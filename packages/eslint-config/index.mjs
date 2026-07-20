import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

// Config base compartilhada. Regras "ruidosas" ficam como warn por ora —
// o código legado do V0 será reescrito nas Fases 4/5; não queremos travar o
// lint em dívida conhecida, mas queremos o sinal.
// ponytail: warn em vez de error no código legado; apertar para error na Fase 4.
export default tseslint.config(
  {
    ignores: [
      "**/.next/**",
      "**/dist/**",
      "**/node_modules/**",
      "**/*.config.*",
      "**/next-env.d.ts",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
);
