import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

function hash(password: string) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function main() {
  await prisma.user.updateMany({
    where: { role: 'SENDER' }, // Updating the girlfriend's account
    data: { 
      email: 'Thajah',
      passwordHash: hash('angie123')
    }
  });
  console.log('Updated girlfriend account to username: Thajah, pass: angie123');
}

main().catch(console.error).finally(() => prisma.$disconnect());
