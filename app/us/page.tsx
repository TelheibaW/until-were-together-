import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Heart } from 'lucide-react';

export default async function UsPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const lettersSent = await prisma.letter.count({ where: { relationshipId: session.relationshipId, senderId: session.userId } });
  const lettersReceived = await prisma.letter.count({ where: { relationshipId: session.relationshipId, receiverId: session.userId } });
  const memoriesCount = await prisma.memory.count({ where: { relationshipId: session.relationshipId } });

  return (
    <main className="min-h-screen bg-background flex flex-col p-4 max-w-lg mx-auto">
      <header className="flex items-center justify-between mb-12 pt-4">
        <Link href="/" className="p-2 bg-white rounded-full shadow-sm text-primary hover:text-accent transition">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="font-handwriting text-3xl font-bold text-accent tracking-widest uppercase">Us 💜</h1>
        <div className="w-10"></div>
      </header>

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-primary/20 flex flex-col items-center relative overflow-hidden">
        {/* Heart background decoration */}
        <div className="absolute -top-10 -right-10 opacity-5">
          <Heart size={200} fill="var(--color-primary)" />
        </div>

        <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-6">
           <Heart size={40} className="text-accent animate-pulse" fill="var(--color-accent)" />
        </div>

        <h2 className="font-handwriting text-3xl font-bold text-accent mb-8">Our Little World</h2>

        <div className="w-full space-y-4">
          <div className="flex justify-between items-center bg-background p-4 rounded-xl border border-primary/10">
            <span className="font-semibold text-foreground/80">Letters sent</span>
            <span className="font-bold text-accent text-xl">{lettersSent}</span>
          </div>
          <div className="flex justify-between items-center bg-background p-4 rounded-xl border border-primary/10">
            <span className="font-semibold text-foreground/80">Letters received</span>
            <span className="font-bold text-accent text-xl">{lettersReceived}</span>
          </div>
          <div className="flex justify-between items-center bg-background p-4 rounded-xl border border-primary/10">
            <span className="font-semibold text-foreground/80">Memories saved</span>
            <span className="font-bold text-accent text-xl">{memoriesCount}</span>
          </div>
          <div className="flex justify-between items-center bg-secondary/10 p-4 rounded-xl border border-secondary/30">
            <span className="font-semibold text-foreground/80">Hugs waiting</span>
            <span className="font-bold text-secondary text-xl">∞</span>
          </div>
        </div>

        <p className="text-center text-xs text-foreground/40 mt-8">
          Built with love, just for us.
        </p>
      </div>
    </main>
  );
}
