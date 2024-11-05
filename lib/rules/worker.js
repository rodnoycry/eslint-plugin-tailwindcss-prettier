const { runAsWorker } = require("synckit")

let prettier
let tailwindPlugin

runAsWorker(async (source) => {
    if (!prettier) {
        prettier = await import("prettier")
    }
    if (!tailwindPlugin) {
        tailwindPlugin = await import("prettier-plugin-tailwindcss")
    }
    return prettier.format(source, {
        parser: "babel",
        plugins: [tailwindPlugin],
        printWidth: Number.MAX_SAFE_INTEGER, // Prevent line breaks
        meta: { fixable: "code" },
    })
})
