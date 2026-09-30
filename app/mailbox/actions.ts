'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function markAsRead(letterId: string) {
  const session = await getSession();
  if (!session) return;

  await prisma.letter.update({
    where: { id: letterId },
    data: { openedAt: new Date() }
  });
}

export async function reactToLetter(letterId: string, reaction: string) {
  await prisma.letter.update({
    where: { id: letterId },
    data: { reaction }
  });
}
