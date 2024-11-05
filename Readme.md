# eslint-plugin-tailwindcss-prettier

ESLint plugin that brings Tailwind class sorting without affecting the rest of your code formatting. Perfect companion for Biome formatter.

## The Problem

When migrating from Prettier to Biome for better performance, you lose Tailwind class sorting functionality. Existing solutions like `eslint-plugin-prettier` with Tailwind plugin would format your entire codebase, negating Biome's performance benefits.

## The Solution

This plugin exclusively handles Tailwind class sorting while letting Biome handle the main formatting. It:

-   ✅ Only formats Tailwind classes
-   ✅ Works with ESLint's autofix
-   ✅ Perfectly complements Biome
-   ✅ Avoids performance overhead of double formatting
-   ✅ Uses same sorting logic as `prettier-plugin-tailwindcss`

## Installation

```bash
npm install --save-dev github:rodnoycry/eslint-plugin-tailwindcss-prettier
```

_Later after publication to NPM:_

```bash
npm install --save-dev eslint-plugin-tailwindcss-prettier
```

## Setup

### 1. ESLint Configuration

```json
{
    "plugins": ["tailwindcss-prettier"],
    "rules": {
        "tailwindcss-prettier": [
            "warn",
            {
                "attributes": ["className"],
                "functions": ["clsx", "cn", "tw"]
            }
        ]
    }
}
```

### 2. VSCode Settings

Create `.vscode/settings.json`:

```json
{
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "biomejs.biome",
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": "explicit"
    },
    "eslint.quiet": ["eslint-plugin-tailwindcss-prettier"]
}
```

Create `.vscode/extensions.json`:

```json
{
    "recommendations": [
        "biomejs.biome",
        "dbaeumer.vscode-eslint",
        "bradlc.vscode-tailwindcss"
    ]
}
```

## How It Works

1. Biome handles primary code formatting with superior performance
2. This plugin only processes Tailwind classes in:
    - Specified classes attributes
    - Specified function calls (clsx, cn, tw)
3. ESLint autofix applies the changes on save

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

## Why This Approach?

This solution emerged from a specific need: maintaining Tailwind class ordering while using Biome's superior formatting performance. Traditional setups using Prettier + ESLint would format the code twice, negating Biome's speed benefits. This plugin provides the best of both worlds:

-   Biome's fast formatting
-   Tailwind class ordering
-   Essential ESLint rules
-   No performance overhead

## License

MIT
