import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import MailboxClient from './MailboxClient';

export default async function MailboxPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const unreadLetter = await prisma.letter.findFirst({
    where: {
      relationshipId: session.relationshipId,
      receiverId: session.userId,
      openedAt: null,
      status: 'DELIVERED',
    },
    include: {
      attachments: true
    },
    orderBy: { createdAt: 'asc' }
  });

  const allReadLetters = await prisma.letter.findMany({
    where: {
      relationshipId: session.relationshipId,
      receiverId: session.userId,
      openedAt: { not: null },
    },
    include: {
      attachments: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <MailboxClient 
      unreadLetter={unreadLetter} 
      readLetters={allReadLetters} 
    />
  );
}
