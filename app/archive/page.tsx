import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';

export default async function ArchivePage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const letters = await prisma.letter.findMany({
    where: { relationshipId: session.relationshipId, status: 'DELIVERED', isSecret: false, openWhenCondition: null },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <main className="min-h-screen bg-background flex flex-col p-4 max-w-2xl mx-auto">
      <header className="flex items-center justify-between mb-8 pt-4">
        <Link href="/" className="p-2 bg-white rounded-full shadow-sm text-primary hover:text-accent transition">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="font-handwriting text-3xl font-bold text-accent tracking-widest uppercase">Our Letters 💜</h1>
        <button className="p-2 bg-white rounded-full shadow-sm text-primary hover:text-accent transition">
          <Search size={24} />
        </button>
      </header>

      <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
        {['All', '❤️ Love', '🥺 Missing You', '🌙 Goodnight', '😂 Funny', '🎀 Random'].map(f => (
          <button key={f} className="whitespace-nowrap px-4 py-1.5 rounded-full bg-white border border-primary/20 text-sm font-semibold text-accent shadow-sm hover:bg-primary/10 transition">
            {f}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-6 relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-primary/20 -z-10"></div>
        
        {letters.map((letter) => (
          <Link href={`/archive/${letter.id}`} key={letter.id} className="flex gap-4 group">
            <div className="w-12 h-12 bg-white border-4 border-background rounded-full flex items-center justify-center shadow-md text-xl z-10 shrink-0">
              {letter.mood?.includes('Missing') ? '🥺' : letter.mood?.includes('Love') ? '❤️' : letter.mood?.includes('Funny') ? '😂' : '💌'}
            </div>
            
            <div className="bg-paper p-4 rounded-2xl rounded-tl-none shadow-sm border border-primary/10 flex-1 hover:shadow-md transition cursor-pointer relative overflow-hidden group-hover:-translate-y-1">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="var(--color-primary)"><path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"/></svg>
              </div>
              
              <p className="text-xs text-foreground/50 font-bold mb-1 uppercase tracking-wider">{new Date(letter.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              <h3 className="font-handwriting text-2xl text-accent font-bold mb-2">{letter.title || 'A little note...'}</h3>
              <p className="text-sm text-foreground/70 line-clamp-2">{letter.body}</p>
              
              {letter.reaction && (
                <div className="absolute bottom-2 right-2 text-2xl opacity-80">{letter.reaction}</div>
              )}
            </div>
          </Link>
        ))}

        {letters.length === 0 && (
          <div className="text-center py-12">
             <div className="text-6xl mb-4 opacity-50">💌</div>
             <p className="font-handwriting text-xl text-accent">No letters yet...</p>
          </div>
        )}
      </div>
    </main>
  );
}
