# eslint-plugin-tailwindcss-prettier

ESLint plugin that sorts Tailwind CSS classes using the same logic as `prettier-plugin-tailwindcss`, without affecting the rest of your code formatting.

## The Problem

When migrating from Prettier to Biome for better performance, you lose Tailwind class sorting functionality. Existing solutions like `eslint-plugin-prettier` with Tailwind plugin would format your entire codebase, negating Biome's performance benefits.

## The Solution

This plugin exclusively handles Tailwind class sorting while letting your formatter of choice handle everything else. It:

-   Only sorts Tailwind classes, nothing else
-   Works with ESLint's autofix
-   Uses the official `prettier-plugin-tailwindcss` sorting logic

## Installation

```bash
npm install --save-dev eslint-plugin-tailwindcss-prettier
```

## Setup

### ESLint Configuration

Minimal configuration — `className` is checked by default:

```json
{
    "plugins": ["tailwindcss-prettier"],
    "rules": {
        "tailwindcss-prettier/order": "warn"
    }
}
```

To also sort classes in additional attributes or function calls:

```json
{
    "plugins": ["tailwindcss-prettier"],
    "rules": {
        "tailwindcss-prettier/order": [
            "warn",
            {
                "attributes": ["class"],
                "functions": ["clsx", "cn", "tw"]
            }
        ]
    }
}
```

`attributes` — additional JSX attributes to sort (on top of `className` which is always included).

`functions` — function calls whose string arguments should be sorted.

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
