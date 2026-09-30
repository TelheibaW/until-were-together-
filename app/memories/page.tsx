import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus } from 'lucide-react';

export default async function MemoriesPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const memories = await prisma.memory.findMany({
    where: { relationshipId: session.relationshipId },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <main className="min-h-screen bg-[#f4ece4] flex flex-col p-4 max-w-2xl mx-auto relative" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}>
      <header className="flex items-center justify-between mb-8 pt-4">
        <Link href="/" className="p-2 bg-white rounded-full shadow-sm text-primary hover:text-accent transition">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="font-handwriting text-3xl font-bold text-accent tracking-widest uppercase bg-white/50 px-4 py-1 rounded-sm shadow-sm backdrop-blur-sm border border-white/80">Our Scrapbook 📸</h1>
        <Link href="/memories/create" className="p-2 bg-white rounded-full shadow-sm text-primary hover:text-accent transition">
          <Plus size={24} />
        </Link>
      </header>

      <div className="columns-1 sm:columns-2 gap-4 space-y-4">
        {memories.map((memory, i) => (
          <div key={memory.id} className="bg-white p-3 shadow-md border border-gray-200 transform transition hover:scale-105 hover:z-10 relative" style={{ transform: `rotate(${(i % 2 === 0 ? 2 : -2)}deg)` }}>
            {/* Washi tape */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-pink-200/50 -rotate-2 shadow-sm"></div>
            
            <div className="aspect-square bg-gray-100 mb-3 flex items-center justify-center overflow-hidden border border-gray-200 relative">
              {memory.imagePath ? (
                <img src={memory.imagePath} alt="Memory" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl opacity-20">📸</span>
              )}
            </div>
            <p className="font-handwriting text-xl text-center text-foreground/80 leading-tight mb-2">
              {memory.caption}
            </p>
            {memory.date && (
              <p className="text-[10px] text-center uppercase tracking-widest text-foreground/40 font-sans font-bold">
                {new Date(memory.date).toLocaleDateString()}
              </p>
            )}
          </div>
        ))}
        
        {memories.length === 0 && (
          <div className="text-center py-12 col-span-2">
            <h2 className="font-handwriting text-2xl font-bold text-accent mb-2">Nothing here yet</h2>
            <p className="text-foreground/50 text-sm italic">Let's make some memories worth keeping.</p>
          </div>
        )}
      </div>
    </main>
  );
}
