import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

// A simple mock hash function since we aren't setting up bcrypt just for a local demo.
function hash(password: string) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function main() {
  console.log('Seeding database...');

  // 1. Create Relationship
  const relationship = await prisma.relationship.create({
    data: {
      id: 'demo-relationship-id',
    },
  });

  // 2. Create Sender & Receiver
  const sender = await prisma.user.create({
    data: {
      email: 'her@demo.com',
      passwordHash: hash('password'),
      role: 'SENDER',
      relationshipId: relationship.id,
    },
  });

  const receiver = await prisma.user.create({
    data: {
      email: 'him@demo.com',
      passwordHash: hash('password'),
      role: 'RECEIVER',
      relationshipId: relationship.id,
    },
  });

  // 3. Create Sample Letters
  await prisma.letter.create({
    data: {
      relationshipId: relationship.id,
      senderId: sender.id,
      receiverId: receiver.id,
      title: 'Just thinking about you',
      body: 'I was just sitting here and thought about how much I miss you. Distance is hard but I know it will be worth it when we are finally together.\n\nLove you! 💜',
      mood: 'Missing You',
      status: 'DELIVERED',
      createdAt: new Date('2026-09-20T10:00:00Z'),
      sentAt: new Date('2026-09-20T10:05:00Z'),
      deliveredAt: new Date('2026-09-21T12:00:00Z'),
      openedAt: new Date('2026-09-21T12:05:00Z'),
      reaction: '🥺',
    }
  });

  await prisma.letter.create({
    data: {
      relationshipId: relationship.id,
      senderId: sender.id,
      receiverId: receiver.id,
      title: 'A funny thing happened today',
      body: 'You won\'t believe what happened at the store today. I saw a bunny that looked exactly like the Kuromi plushie you gave me!\n\nHaha I immediately thought of you and had to tell you.',
      mood: 'Something Funny',
      status: 'DELIVERED',
      createdAt: new Date('2026-09-25T14:00:00Z'),
      sentAt: new Date('2026-09-25T14:30:00Z'),
      deliveredAt: new Date('2026-09-26T09:00:00Z'),
      openedAt: new Date('2026-09-26T10:00:00Z'),
      reaction: '😂',
    }
  });

  await prisma.letter.create({
    data: {
      relationshipId: relationship.id,
      senderId: sender.id,
      receiverId: receiver.id,
      title: 'Goodnight my love',
      body: 'It\'s late and I couldn\'t sleep without sending you a little letter. I hope you have the sweetest dreams. See you tomorrow on call!\n\nSweet dreams 🌙',
      mood: 'Goodnight',
      status: 'ARRIVED',
      createdAt: new Date('2026-09-29T22:00:00Z'),
      sentAt: new Date('2026-09-29T22:10:00Z'),
      deliveredAt: new Date('2026-09-30T08:00:00Z'),
    }
  });

  // 4. Create Open When Letters
  await prisma.letter.create({
    data: {
      relationshipId: relationship.id,
      senderId: sender.id,
      receiverId: receiver.id,
      title: 'Open when you need a hug',
      body: 'I know things are hard right now, but I am sending you the biggest, warmest virtual hug ever! 🫂 Everything will be okay. I believe in you so much.',
      mood: 'I Need a Hug',
      status: 'DELIVERED',
      isSecret: false,
      openWhenCondition: 'Open when you need a hug',
    }
  });

  await prisma.letter.create({
    data: {
      relationshipId: relationship.id,
      senderId: sender.id,
      receiverId: receiver.id,
      title: 'Open when we finally meet',
      body: 'WE DID IT!!! ✈️ We are finally together! No more distance, just us.',
      mood: 'I Love You',
      status: 'DELIVERED',
      isSecret: true,
      openWhenCondition: 'Open when we finally meet',
    }
  });

  // 5. Create Memories
  await prisma.memory.create({
    data: {
      relationshipId: relationship.id,
      caption: 'The day you gave me the bunnies.',
      date: new Date('2026-05-14T00:00:00Z'),
      location: 'Virtual call'
    }
  });

  await prisma.memory.create({
    data: {
      relationshipId: relationship.id,
      caption: 'That random late-night conversation about the future.',
      date: new Date('2026-07-22T00:00:00Z'),
    }
  });

  console.log('Database seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
