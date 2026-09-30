'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export async function createMemory(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  const caption = formData.get('caption') as string;
  const photoUrl = formData.get('photoUrl') as string;

  if (!caption) return;

  await prisma.memory.create({
    data: {
      relationshipId: session.relationshipId,
      caption,
      imagePath: photoUrl || null,
      date: new Date(),
    }
  });

  redirect('/memories');
}
