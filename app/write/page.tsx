import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import WriteClient from './WriteClient';
import { prisma } from '@/lib/prisma';

export default async function WritePage() {
  const session = await getSession();
  if (!session) {
    redirect('/');
  }

  // Get the other person in this relationship
  const receiver = await prisma.user.findFirst({
    where: {
      relationshipId: session.relationshipId,
      id: { not: session.userId }
    }
  });

  return <WriteClient senderId={session.userId} receiverId={receiver?.id || ''} relationshipId={session.relationshipId} />;
}
