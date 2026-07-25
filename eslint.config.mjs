import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: [
      "src/app/{asset,audit,compliance,governance,incident,performance,risk}/**/*.tsx",
      "src/hooks/use-chat-history.ts",
      "src/hooks/use-user-preferences.ts",
    ],
    rules: {
      // These prototype screens intentionally hydrate their localStorage-backed
      // data after mount so server and client markup stay deterministic.
      "react-hooks/set-state-in-effect": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
