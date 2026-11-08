const path = require("node:path")
const { describe, it } = require("node:test")
const { RuleTester } = require("eslint")
const rule = require("../lib/rules/order")

RuleTester.describe = describe
RuleTester.it = it
RuleTester.itOnly = it.only

const ruleTester = new RuleTester({
    languageOptions: {
        parserOptions: { ecmaFeatures: { jsx: true } },
    },
})

const cn = [{ functions: ["cn", "tw"] }]
const stylesheet = [{ stylesheet: path.join(__dirname, "fixtures", "app.css") }]
const error = { messageId: "unsorted" }

ruleTester.run("order", rule, {
    valid: [
        '<div className="flex items-center p-4" />',
        "<div className='flex p-4' />",
        "<div className={dynamic} />",
        '<div className={foo("p-4 flex")} />',
        { code: 'cn("flex p-4")', options: cn },
        { code: "cn('flex p-4')", options: cn },
        // Not in `functions`
        { code: 'foo("p-4 flex")', options: cn },
        // Escapes are skipped
        { code: 'cn("p-4\\tflex")', options: cn },
        // Without the stylesheet, `bg-primary` is unknown and goes first
        '<div className="bg-primary flex" />',
    ],
    invalid: [
        {
            code: '<div className="p-4 flex" />',
            output: '<div className="flex p-4" />',
            errors: [error],
        },
        {
            // Quote style is preserved
            code: "<div className='p-4 flex' />",
            output: "<div className='flex p-4' />",
            errors: [error],
        },
        {
            // Duplicates are removed
            code: '<div className="p-4 flex flex" />',
            output: '<div className="flex p-4" />',
            errors: [error],
        },
        {
            code: '<div className={cond ? "p-4 flex" : "p-2 m-2"} />',
            output: '<div className={cond ? "flex p-4" : "m-2 p-2"} />',
            errors: [error, error],
        },
        {
            code: 'cn("p-4 flex", cond && "p-2 m-2", { "font-bold text-sm": x }, ["p-4 flex"])',
            output: 'cn("flex p-4", cond && "m-2 p-2", { "text-sm font-bold": x }, ["flex p-4"])',
            options: cn,
            errors: [error, error, error, error],
        },
        {
            code: "cn(`p-4 flex`)",
            output: "cn(`flex p-4`)",
            options: cn,
            errors: [error],
        },
        {
            code: "tw`p-4 flex`",
            output: "tw`flex p-4`",
            options: cn,
            errors: [error],
        },
        {
            // cva-style variant objects
            code: 'cva("p-4 flex", { variants: { size: { sm: "p-2 m-2" } } })',
            output: 'cva("flex p-4", { variants: { size: { sm: "m-2 p-2" } } })',
            options: [{ functions: ["cva"] }],
            errors: [error, error],
        },
        {
            // Nested calls are reported once, not twice
            code: 'cn("flex", cn("p-4 flex"))',
            output: 'cn("flex", cn("flex p-4"))',
            options: cn,
            errors: [error],
        },
        {
            code: '<div className="p-4 flex" />',
            output: '<div className="flex p-4" />',
            options: [{ attributes: ["class"] }],
            errors: [error],
        },
        {
            code: '<div class="p-4 flex" />',
            output: '<div class="flex p-4" />',
            options: [{ attributes: ["class"] }],
            errors: [error],
        },
        {
            // With the stylesheet, theme classes are sorted properly
            code: '<div className="bg-primary flex" />',
            output: '<div className="flex bg-primary" />',
            options: stylesheet,
            errors: [error],
        },
    ],
})
