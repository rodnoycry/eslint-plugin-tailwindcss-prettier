module.exports = {
    rules: {
        "order": require("./rules/order"),
    },
    configs: {
        recommended: {
            plugins: ['tailwindcss-prettier'],
            rules: {
                'tailwindcss-prettier/order': 'warn'
            }
        }
    }
}
