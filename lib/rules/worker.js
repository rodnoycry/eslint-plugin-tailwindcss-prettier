import { runAsWorker } from "synckit"
import * as tailwindPlugin from "prettier-plugin-tailwindcss"

let prettier

runAsWorker(async (source) => {
    if (!prettier) {
        prettier = await import("prettier")
    }
    return prettier.format(source, {
        parser: "babel",
        plugins: [tailwindPlugin],
        printWidth: Number.MAX_SAFE_INTEGER, // Prevent line breaks
        meta: { fixable: "code" },
    })
})
