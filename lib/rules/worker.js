const { runAsWorker } = require("synckit")

// One sorter per set of options. Loading Tailwind's design system is the
// expensive part, so it happens once per directory/stylesheet, not per file.
const sorters = new Map()

runAsWorker(async ({ classes, ...sorterOptions }) => {
    const key = JSON.stringify(sorterOptions)
    let sorter = sorters.get(key)
    if (!sorter) {
        const { createSorter } = await import("prettier-plugin-tailwindcss/sorter")
        sorter = await createSorter(sorterOptions)
        sorters.set(key, sorter)
    }
    return sorter.sortClassAttributes(classes)
})
