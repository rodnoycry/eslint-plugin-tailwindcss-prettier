const { runAsWorker } = require("synckit");
const fs = require("fs")
const path = require("path")

let prettier;
let tailwindPlugin;
const logsPath = path.join(__dirname, "logs.txt")

runAsWorker(async (source) => {
    try {
    if (!prettier) {
        prettier = await import('prettier');
    }
    if (!tailwindPlugin) {
        tailwindPlugin = await import('prettier-plugin-tailwindcss');
    }
    return prettier.format(source, {
        parser: "babel",
        plugins: [tailwindPlugin],
        printWidth: Number.MAX_SAFE_INTEGER, // Prevent line breaks
        meta: { fixable: "code" },
    });
} catch (e) {
    fs.writeFileSync(logsPath, `${(new Date()).toISOString}: Error happened: ${e?.message}`)
}
});
