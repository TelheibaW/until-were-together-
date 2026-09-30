'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export async function createOpenWhen(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  const condition = formData.get('condition') as string;
  const body = formData.get('body') as string;
  const isSecret = formData.get('isSecret') === 'on';

  if (!condition || !body) return;

  const receiver = await prisma.user.findFirst({
    where: { relationshipId: session.relationshipId, id: { not: session.userId } }
  });

  if (!receiver) return;

  await prisma.letter.create({
    data: {
      relationshipId: session.relationshipId,
      senderId: session.userId,
      receiverId: receiver.id,
      title: condition,
      body: body,
      status: 'DELIVERED',
      isSecret,
      openWhenCondition: condition,
    }
  });

  redirect('/open-when');
}
