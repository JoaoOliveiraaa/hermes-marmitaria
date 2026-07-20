import { z } from "zod";

/**
 * Valida um conjunto de variáveis de ambiente contra um schema Zod e retorna o
 * objeto tipado. Lança um erro legível (listando cada variável inválida) se a
 * validação falhar — evita o app subir com configuração quebrada.
 */
export function parseEnv<T extends z.ZodTypeAny>(
  schema: T,
  env: Record<string, unknown> = process.env,
): z.infer<T> {
  const result = schema.safeParse(env);
  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `  - ${issue.path.join(".") || "(raiz)"}: ${issue.message}`)
      .join("\n");
    throw new Error(`Variáveis de ambiente inválidas:\n${issues}`);
  }
  return result.data;
}

export { z };
