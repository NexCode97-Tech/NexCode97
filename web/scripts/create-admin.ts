import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";

async function main() {
  const password = process.argv[2];
  if (!password) {
    console.error("Uso: npx tsx scripts/create-admin.ts <contraseña>");
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email: "nexcode97@gmail.com" },
    update: { hashedPassword },
    create: {
      email: "nexcode97@gmail.com",
      name: "NexCode97",
      hashedPassword,
    },
  });

  console.log("✅ Usuario creado:", user.email);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
