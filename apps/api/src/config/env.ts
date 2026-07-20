import { parseEnv, z } from "@hermes/config";

/** Variáveis de ambiente da API, validadas na inicialização. */
export const env = parseEnv(
  z.object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.coerce.number().default(3333),
    WEB_ORIGIN: z.string().default("http://localhost:3000"),
    DATABASE_URL: z.string(),
    JWT_ACCESS_SECRET: z.string().min(16),
    JWT_REFRESH_SECRET: z.string().min(16),
    JWT_ACCESS_TTL: z.string().default("15m"),
    JWT_REFRESH_TTL: z.string().default("7d"),
  }),
);

export type Env = typeof env;

export const isProd = env.NODE_ENV === "production";
