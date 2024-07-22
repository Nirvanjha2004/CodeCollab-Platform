// This configuration only applies to the package manager root.
/** @type {import("eslint").Linter.Config} */
export const ignorePatterns = ["apps/**", "packages/**"];
export const extends = ["@repo/eslint-config/library.js"];
export const parser = "@typescript-eslint/parser";
export const parserOptions = {
  project: true,
};
