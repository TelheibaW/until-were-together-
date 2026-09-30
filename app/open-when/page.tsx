import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Lock, Unlock } from 'lucide-react';

export default async function OpenWhenPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const role = session.role;
  const isSender = role === 'SENDER';

  // Get all open when letters
  const letters = await prisma.letter.findMany({
    where: { 
      relationshipId: session.relationshipId,
      openWhenCondition: { not: null }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <main className="min-h-screen bg-background flex flex-col p-4 max-w-2xl mx-auto">
      <header className="flex items-center justify-between mb-8 pt-4">
        <Link href="/" className="p-2 bg-white rounded-full shadow-sm text-primary hover:text-accent transition">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="font-handwriting text-3xl font-bold text-accent tracking-widest uppercase">Open When... 🎀</h1>
        <div className="w-10"></div>
      </header>

      <Link href="/write" className="mb-8 w-full bg-white border-2 border-dashed border-primary/50 text-accent font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-primary/5 transition">
        <span className="text-xl">+</span> Create New Rule
      </Link>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {letters.map((letter) => {
          const isMine = letter.senderId === session.userId;
          return (
            <div key={letter.id} className="bg-paper p-6 rounded-2xl shadow-md border-2 border-primary/20 flex flex-col items-center text-center relative overflow-hidden group">
              {letter.isSecret ? (
                <Lock size={40} className="text-primary mb-4" />
              ) : (
                <Unlock size={40} className="text-secondary mb-4" />
              )}
              
              <h3 className="font-handwriting text-2xl text-accent font-bold mb-2">{letter.openWhenCondition}</h3>
              
              {letter.isSecret ? (
                <p className="text-sm text-foreground/50 italic mb-4">This letter is waiting for the right moment.</p>
              ) : (
                <p className="text-sm text-foreground/50 italic mb-4">Ready to be opened.</p>
              )}
              
              {letter.isSecret && isMine ? (
                <form action={async () => {
                  'use server';
                  await prisma.letter.update({ where: { id: letter.id }, data: { isSecret: false } });
                }} className="mt-auto w-full">
                  <button type="submit" className="w-full py-2 rounded-lg font-bold text-sm transition bg-accent text-white hover:bg-opacity-90">
                    Unlock for them
                  </button>
                </form>
              ) : letter.isSecret && !isMine ? (
                <button disabled className="mt-auto w-full py-2 rounded-lg font-bold text-sm transition bg-gray-100 text-gray-400 cursor-not-allowed">
                  Locked
                </button>
              ) : (
                <Link href={`/archive/${letter.id}`} className="mt-auto w-full py-2 rounded-lg font-bold text-sm transition bg-secondary text-white hover:bg-opacity-90 inline-block">
                  Open Letter
                </Link>
              )}
            </div>
          );
        })}
        
        {letters.length === 0 && (
          <div className="col-span-1 sm:col-span-2 text-center py-12">
            <h2 className="font-handwriting text-2xl font-bold text-accent mb-2">No secret envelopes yet</h2>
            <p className="text-foreground/50 text-sm italic">Someone needs to start writing... 👀</p>
          </div>
        )}
      </div>
    </main>
  );
}
