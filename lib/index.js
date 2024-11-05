module.exports = {
    rules: {
        "order": require("./rules/order"),
    },
    configs: {
        recommended: {
            plugins: ["tailwindcss-prettier"],
            rules: {
                "tailwindcss-prettier": ["warn", {
                    functions: ["clsx", "tw", "cn"], // Function names to check
                    }],
            },
        },
    },
}
