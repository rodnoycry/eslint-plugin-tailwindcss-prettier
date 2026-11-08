---
"eslint-plugin-tailwindcss-prettier": minor
---

Support ESLint 10 and switch to the `prettier-plugin-tailwindcss` sorter API

-   Fix crash on ESLint 10 (`context.getSourceCode is not a function`)
-   Sort classes with `prettier-plugin-tailwindcss/sorter` directly instead of formatting each string with Prettier, with one worker call per file instead of one per string
-   Add `stylesheet` (Tailwind v4) and `config` (Tailwind v3) options so theme classes sort correctly
-   Sort strings inside conditionals, arrays and objects in `functions` calls (e.g. `cn`, `cva` variants), plus tagged templates like `` tw`...` ``
-   Keep the original quote style (single-quoted strings were rewritten to double quotes)
-   Errors are no longer swallowed and logged once per attribute; ESLint now reports them with the file name
-   Breaking: `configs.recommended` is now a flat config; the `.eslintrc` version moved to `configs["legacy-recommended"]`
-   Breaking: requires ESLint 8.40+ and Node.js 20.19+
-   Add `prettier` as a dependency (it was imported but never declared)
