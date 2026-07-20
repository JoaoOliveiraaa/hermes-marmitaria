import { parseEnv, z } from "@hermes/config";

/**
 * Variáveis de ambiente da API, validadas na inicialização.
 * DATABASE_URL e os segredos de JWT ficam opcionais até as fases de Prisma/auth.
 */
export const env = parseEnv(
  z.object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.coerce.number().default(3333),
    WEB_ORIGIN: z.string().default("http://localhost:3000"),
    DATABASE_URL: z.string().optional(),
    JWT_ACCESS_SECRET: z.string().optional(),
    JWT_REFRESH_SECRET: z.string().optional(),
  }),
);

export type Env = typeof env;
