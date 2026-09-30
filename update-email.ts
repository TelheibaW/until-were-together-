import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.updateMany({
    where: { email: 'him@demo.com' },
    data: { email: 'telheibawangkheimayum@gmail.com' }
  });
  console.log('Updated receiver email to telheibawangkheimayum@gmail.com');
}

main().catch(console.error).finally(() => prisma.$disconnect());
