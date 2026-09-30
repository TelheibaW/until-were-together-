import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.attachment.deleteMany();
  await prisma.memory.deleteMany();
  await prisma.letter.deleteMany();
  console.log('Database wiped of all letters, attachments, and memories.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
