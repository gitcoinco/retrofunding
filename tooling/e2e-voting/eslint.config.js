import { reactJsConfig } from "@repo/eslint-config/react-js";

/** @type {import("eslint").Linter.Config} */
export default {
  ...reactJsConfig,
  ignores: [
    "node_modules/",
    "**/*.less",
    "**/*.css",
    "**/*.scss",
    "**/*.json",
    "**/*.png",
    "**/*.svg",
  ],
};
