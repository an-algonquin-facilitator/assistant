import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ["./tsconfig.json"],
      },
    },
  },
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  { ignores: ["eslint.config.mjs"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.all,
  {
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
    plugins: {
      pluginReact,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    rules: {
      // Generally good but impractical with Redux
      "@typescript-eslint/prefer-readonly-parameter-types": "off",
      // Why isn't this default?
      "@typescript-eslint/no-magic-numbers": ["error", { ignore: [-1, 0, 1] }],
      // Subjective
      "@typescript-eslint/max-params": "off",
      // React needs PascalCase
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "function",
          format: ["camelCase", "PascalCase"],
        },
      ],

      // These need to be turned back on.
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-return": "off",
    },
  },
];
