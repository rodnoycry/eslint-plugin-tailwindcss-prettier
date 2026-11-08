const { name, version } = require("../package.json")

const plugin = {
    meta: { name, version },
    rules: {
        order: require("./rules/order"),
    },
    configs: {},
}

Object.assign(plugin.configs, {
    // Flat config (eslint.config.js)
    recommended: {
        name: "tailwindcss-prettier/recommended",
        plugins: { "tailwindcss-prettier": plugin },
        rules: { "tailwindcss-prettier/order": "warn" },
    },
    // Legacy config (.eslintrc), ESLint 8 only
    "legacy-recommended": {
        plugins: ["tailwindcss-prettier"],
        rules: { "tailwindcss-prettier/order": "warn" },
    },
})

module.exports = plugin
