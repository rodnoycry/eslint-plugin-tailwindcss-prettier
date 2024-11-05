module.exports = {
    rules: {
        "order": require("./rules/order"),
    },
    configs: {
        recommended: {
            plugins: ['tailwind-class-order'],
            rules: {
                'tailwind-class-order/order': 'warn'
            }
        }
    }
}
