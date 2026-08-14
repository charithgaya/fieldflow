import "dotenv/config";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";

const users = [
  {
    name: "FieldFlow Admin",
    email: "admin@fieldflow.test",
    password: "Admin@12345",
    role: "ADMIN" as const,
  },
  {
    name: "FieldFlow Dispatcher",
    email: "dispatch@fieldflow.test",
    password: "Dispatch@12345",
    role: "DISPATCHER" as const,
  },
  {
    name: "FieldFlow Technician",
    email: "tech@fieldflow.test",
    password: "Technician@12345",
    role: "TECHNICIAN" as const,
  },
];

async function main() {
  for (const user of users) {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });

    if (existingUser) {
      console.log(`User already exists: ${user.email}`);
      continue;
    }

    const result = await auth.api.signUpEmail({
      body: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });

    if (!result.user) {
      throw new Error(`Failed to create ${user.email}`);
    }

    await prisma.user.update({
      where: {
        id: result.user.id,
      },
      data: {
        role: user.role,
      },
    });

    console.log(`Created ${user.role}: ${user.email}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });