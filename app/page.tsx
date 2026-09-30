import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Mail, PenLine, Heart, History, Lock, Image as ImageIcon } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export default async function Home() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  const role = session.role;
  const isSender = role === 'SENDER';

  // Get unread letters count
  const unreadCount = await prisma.letter.count({
    where: {
      relationshipId: session.relationshipId,
      receiverId: session.userId,
      openedAt: null,
      status: 'DELIVERED',
    },
  });

  const dailyMessages = [
    "Distance is temporary. This letter is forever.",
    "Somewhere between here and there is another reason to miss you.",
    "Until I can hold you, I'll keep your words close.",
    "Every letter is a little piece of you arriving here."
  ];
  const randomMessage = dailyMessages[Math.floor(Math.random() * dailyMessages.length)];

  return (
    <main className="flex-1 flex flex-col max-w-md mx-auto w-full p-4 min-h-screen relative overflow-hidden">
      {/* Decorative stars */}
      <div className="absolute top-10 left-4 text-secondary opacity-50">✦</div>
      <div className="absolute top-24 right-8 text-primary opacity-50 text-2xl">✧</div>
      <div className="absolute bottom-32 left-10 text-accent opacity-30 text-xl">✦</div>

      <header className="text-center mt-12 mb-8 z-10 relative">
        <form action={async () => {
          'use server';
          const { logout } = await import('./login/actions');
          await logout();
        }} className="absolute -top-8 right-0">
          <button type="submit" className="text-xs bg-white/50 px-3 py-1 rounded-full shadow-sm text-accent hover:bg-white transition border border-accent/20">
            Log out
          </button>
        </form>
        <h1 className="text-4xl font-handwriting font-bold text-accent mb-2">Until We're Together 💌</h1>
        <p className="text-foreground/70 text-sm italic">A little place where our letters can find each other.</p>
      </header>

      {/* Post Office Illustration Area */}
      <div className="relative w-full aspect-square max-w-[280px] mx-auto mb-8 flex items-center justify-center bg-paper rounded-full border-4 border-white shadow-xl">
        <div className="text-center flex flex-col items-center">
          <Mail size={64} className="text-secondary mb-4 drop-shadow-md" />
          <p className="font-handwriting text-xl text-accent font-bold">Our Little Post Office</p>
          <p className="text-xs text-foreground/60 mt-1 px-8">Welcome to our corner of the world.</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 z-10 w-full mb-8">
        <Link href="/write" className="flex items-center gap-4 bg-accent text-white p-4 rounded-2xl shadow-md hover:scale-[1.02] transition">
          <div className="bg-white/20 p-2 rounded-full">
            <PenLine size={24} />
          </div>
          <span className="font-bold text-lg">Write a Letter</span>
        </Link>

        <Link href="/mailbox" className="flex items-center justify-between bg-white text-foreground p-4 rounded-2xl shadow-sm border border-primary/20 hover:scale-[1.02] transition">
          <div className="flex items-center gap-4">
            <div className="bg-primary/20 p-2 rounded-full text-accent">
              <Mail size={24} />
            </div>
            <span className="font-bold text-lg">Mailbox</span>
          </div>
          {unreadCount > 0 && (
            <span className="bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
              {unreadCount} NEW
            </span>
          )}
        </Link>

        <div className="grid grid-cols-2 gap-3">
          <Link href="/archive" className="flex flex-col items-center justify-center bg-white p-4 rounded-2xl shadow-sm border border-primary/20 hover:scale-[1.02] transition gap-2">
            <History size={24} className="text-accent" />
            <span className="font-semibold text-sm">Our Letters</span>
          </Link>
          <Link href="/open-when" className="flex flex-col items-center justify-center bg-white p-4 rounded-2xl shadow-sm border border-primary/20 hover:scale-[1.02] transition gap-2">
            <Lock size={24} className="text-secondary" />
            <span className="font-semibold text-sm">Open When...</span>
          </Link>
          <Link href="/memories" className="flex flex-col items-center justify-center bg-white p-4 rounded-2xl shadow-sm border border-primary/20 hover:scale-[1.02] transition gap-2">
            <ImageIcon size={24} className="text-primary" />
            <span className="font-semibold text-sm">Memories</span>
          </Link>
          <Link href="/us" className="flex flex-col items-center justify-center bg-white p-4 rounded-2xl shadow-sm border border-primary/20 hover:scale-[1.02] transition gap-2">
            <Heart size={24} className="text-red-400" />
            <span className="font-semibold text-sm">Us 💜</span>
          </Link>
        </div>
      </div>

      <div className="mt-auto text-center p-6 bg-paper/50 rounded-2xl border border-dashed border-primary/30 relative">
        <span className="absolute -top-3 -left-3 text-2xl">🌸</span>
        <p className="font-handwriting text-xl text-foreground/80 leading-relaxed">
          "{randomMessage}"
        </p>
      </div>
      
      <p className="text-center text-xs text-foreground/40 mt-8 mb-4">
        Until distance becomes just a memory.
      </p>

    </main>
  );
}
