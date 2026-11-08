# eslint-plugin-tailwindcss-prettier

ESLint plugin that sorts Tailwind CSS classes using the same logic as `prettier-plugin-tailwindcss`, without affecting the rest of your code formatting.

## The Problem

When migrating from Prettier to Biome for better performance, you lose Tailwind class sorting functionality. Existing solutions like `eslint-plugin-prettier` with Tailwind plugin would format your entire codebase, negating Biome's performance benefits.

## The Solution

This plugin exclusively handles Tailwind class sorting while letting your formatter of choice handle everything else. It:

-   Only sorts Tailwind classes, nothing else
-   Works with ESLint's autofix
-   Uses the official `prettier-plugin-tailwindcss` sorter directly, so the order matches Prettier exactly without running Prettier on your files

## Requirements

-   ESLint 8.40 or newer (ESLint 9 and 10 supported)
-   Node.js 20.19 or newer

## Installation

```bash
npm install --save-dev eslint-plugin-tailwindcss-prettier
```

## Setup

### ESLint Configuration

`eslint.config.js` (flat config):

```js
import tailwindcssPrettier from "eslint-plugin-tailwindcss-prettier"

export default [
    {
        plugins: {
            "tailwindcss-prettier": tailwindcssPrettier,
        },
        rules: {
            "tailwindcss-prettier/order": [
                "warn",
                {
                    // Tailwind v4: your main CSS file (the one with `@import "tailwindcss"`)
                    stylesheet: "./src/styles/globals.css",
                    functions: ["clsx", "cn", "cva", "tw"],
                },
            ],
        },
    },
]
```

Or use the recommended config, which only checks `className` with no extra options:

```js
import tailwindcssPrettier from "eslint-plugin-tailwindcss-prettier"

export default [tailwindcssPrettier.configs.recommended]
```

For legacy `.eslintrc` configs (ESLint 8), use `"extends": ["plugin:tailwindcss-prettier/legacy-recommended"]`.

### Options

`stylesheet` — path to your Tailwind v4 CSS entry file, relative to where ESLint runs. Without it, classes from your theme (e.g. `bg-primary`) are unknown to the sorter and end up out of order.

`config` — path to your `tailwind.config.js` (Tailwind v3 only). If omitted, the closest config file is found automatically.

`attributes` — additional JSX attributes to sort (on top of `className`, which is always included).

`functions` — functions whose string arguments are sorted. Works for calls and tagged templates, and finds strings inside conditionals, arrays and objects:

```js
cn("flex p-4", isActive && "bg-blue-500 text-white", { "opacity-50": disabled })

cva("inline-flex items-center", {
    variants: { size: { sm: "h-8 px-2", lg: "h-12 px-6" } },
})

tw`flex p-4`
```

Template literals with `${expressions}` and strings with escape sequences are skipped.

### VSCode Settings

To autofix on save with Biome as the primary formatter:

`.vscode/settings.json`:

```json
{
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "biomejs.biome",
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": "explicit"
    }
}
```

## Example

```jsx
// Before
<div className="p-4 flex items-center">
  {clsx("text-red-500 mt-2")}
</div>

// After
<div className="flex items-center p-4">
  {clsx("mt-2 text-red-500")}
</div>
```

## License

MIT
