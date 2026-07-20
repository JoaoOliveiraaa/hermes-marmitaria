import { PrismaClient, Role } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@hermesmarmitaria.com";
  const senha = process.env.ADMIN_PASSWORD ?? "changeme123";
  const nome = process.env.ADMIN_NOME ?? "Administrador";

  const senhaHash = await bcrypt.hash(senha, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, nome, senhaHash, role: Role.OWNER },
  });

  console.log(`Admin garantido: ${user.email} (role=${user.role})`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
