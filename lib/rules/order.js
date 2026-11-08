const path = require("node:path")

// Synchronous bridge to the worker, created on first use.
let sortInWorker

/** @type {import("eslint").Rule.RuleModule} */
module.exports = {
    meta: {
        type: "layout",
        docs: {
            description:
                "Sort Tailwind CSS classes the same way prettier-plugin-tailwindcss does",
            url: "https://github.com/rodnoycry/eslint-plugin-tailwindcss-prettier#readme",
        },
        fixable: "code",
        messages: {
            unsorted: "Tailwind classes are not sorted",
        },
        schema: [
            {
                type: "object",
                properties: {
                    attributes: {
                        type: "array",
                        items: { type: "string" },
                    },
                    functions: {
                        type: "array",
                        items: { type: "string" },
                    },
                    stylesheet: { type: "string" },
                    config: { type: "string" },
                },
                additionalProperties: false,
            },
        ],
    },

    create(context) {
        const options = context.options[0] || {}
        const attributes = new Set(["className", ...(options.attributes || [])])
        const functions = new Set(options.functions || [])

        // Class strings found in this file. They are all sorted in a single
        // worker call at the end, instead of one call per string.
        const found = []

        function collectString(node) {
            if (node.type === "Literal" && typeof node.value === "string") {
                const inner = node.raw.slice(1, -1)
                // Skip strings with escapes or HTML entities: the raw text
                // and the value differ, so replacing it safely is tricky.
                if (inner !== node.value) return
                found.push({
                    node,
                    text: inner,
                    range: [node.range[0] + 1, node.range[1] - 1],
                })
                return
            }

            if (node.type === "TemplateLiteral" && node.expressions.length === 0) {
                const { raw, cooked } = node.quasis[0].value
                if (raw !== cooked) return
                found.push({
                    node,
                    text: raw,
                    range: [node.range[0] + 1, node.range[1] - 1],
                })
            }
        }

        // Finds class strings inside an expression, e.g.
        // cn("a", cond && "b", cond ? "c" : "d", ["e"], { f: cond }).
        // Nested calls are not entered: if they are in `functions`, the
        // CallExpression visitor handles them on its own.
        function collectNested(node) {
            if (!node) return
            switch (node.type) {
                case "Literal":
                case "TemplateLiteral":
                    collectString(node)
                    break
                case "LogicalExpression":
                    collectNested(node.left)
                    collectNested(node.right)
                    break
                case "ConditionalExpression":
                    collectNested(node.consequent)
                    collectNested(node.alternate)
                    break
                case "ArrayExpression":
                    for (const element of node.elements) collectNested(element)
                    break
                case "ObjectExpression":
                    for (const property of node.properties) {
                        if (property.type !== "Property") continue
                        if (!property.computed) collectString(property.key)
                        collectNested(property.value)
                    }
                    break
            }
        }

        return {
            JSXAttribute(node) {
                if (node.name.type !== "JSXIdentifier") return
                if (!attributes.has(node.name.name) || !node.value) return

                if (node.value.type === "JSXExpressionContainer") {
                    collectNested(node.value.expression)
                } else {
                    collectString(node.value)
                }
            },

            CallExpression(node) {
                if (
                    node.callee.type === "Identifier" &&
                    functions.has(node.callee.name)
                ) {
                    for (const arg of node.arguments) collectNested(arg)
                }
            },

            TaggedTemplateExpression(node) {
                if (node.tag.type === "Identifier" && functions.has(node.tag.name)) {
                    collectString(node.quasi)
                }
            },

            "Program:exit"() {
                if (found.length === 0) return

                if (!sortInWorker) {
                    sortInWorker = require("synckit").createSyncFn(
                        require.resolve("./worker"),
                    )
                }

                const sorted = sortInWorker({
                    classes: found.map((entry) => entry.text),
                    ...getSorterOptions(context, options),
                })

                found.forEach((entry, i) => {
                    if (sorted[i] === entry.text) return
                    context.report({
                        node: entry.node,
                        messageId: "unsorted",
                        fix: (fixer) => fixer.replaceTextRange(entry.range, sorted[i]),
                    })
                })
            },
        }
    },
}

function getSorterOptions(context, options) {
    const cwd = context.cwd
    const filename = context.filename
    const resolve = (file) => (file ? path.resolve(cwd, file) : undefined)

    return {
        // Tailwind is resolved from the linted file's directory, so monorepos
        // pick up the right version per package.
        base: path.isAbsolute(filename) ? path.dirname(filename) : cwd,
        stylesheetPath: resolve(options.stylesheet),
        configPath: resolve(options.config),
    }
}
