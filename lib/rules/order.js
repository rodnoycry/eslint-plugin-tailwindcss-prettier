// Lazily-loaded Prettier.
let prettierFormat;

module.exports = {
    create(context) {
        // Get options from rule configuration
        const options = context.options[0] || {}
        const additionalAttributes = options.attributes || []
        const functionNames = options.functions || []

        // Always include 'className'
        const attributes = ["className", ...additionalAttributes]

        return {
            JSXAttribute(node) {
                if (!attributes.includes(node.name.name)) return
                processAttribute(node, context)
            },
            CallExpression(node) {
                if (functionNames.includes(node.callee.name)) {
                    node.arguments.forEach((arg) => {
                        if (
                            arg.type === "Literal" &&
                            typeof arg.value === "string"
                        ) {
                            processStringArgument(arg, context)
                        }
                    })
                }
            },
        }
    },
    meta: {
        fixable: "code",
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
                },
                additionalProperties: false,
            },
        ],
    },
}

function processAttribute(node, context) {
    try {
        const sourceCode = context.getSourceCode()
        const originalText = sourceCode.getText(node.value)

        if (originalText.startsWith("{") && originalText.endsWith("}")) {
            // Skip dynamic class names
            return
        }

        formatAndReport(originalText, node.value, context)
    } catch (error) {
        // biome-ignore lint/suspicious/noConsole: <explanation>
        console.error("Error processing attribute:", error)
    }
}

function processStringArgument(node, context) {
    try {
        const originalText = node.raw
        formatAndReport(originalText, node, context)
    } catch (error) {
        // biome-ignore lint/suspicious/noConsole: <explanation>
        console.error("Error processing string argument:", error)
    }
}

function formatAndReport(originalText, node, context) {
    // Create a minimal JSX structure for formatting
    const dummyJsx = `<div className=${originalText}></div>`

    if (!prettierFormat) {
        prettierFormat = require('synckit').createSyncFn(
            require.resolve('./worker'),
          );
    }

    const formattedText = prettierFormat(dummyJsx)
    const match = formattedText.match(/className=([^>]+)/)

    if (match && match[1] !== originalText) {
        context.report({
            node: node,
            message: "Tailwind classes are not sorted",
            fix(fixer) {
                return fixer.replaceText(node, match[1])
            },
        })
    }
}
