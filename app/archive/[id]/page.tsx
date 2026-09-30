import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function ArchiveDetailPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) redirect('/login');

  const letter = await prisma.letter.findUnique({
    where: { id: params.id },
    include: { attachments: true, sender: true }
  });

  if (!letter || letter.relationshipId !== session.relationshipId) {
    redirect('/archive');
  }

  return (
    <main className="min-h-screen bg-background flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-lg mb-6">
        <Link href="/archive" className="inline-flex p-2 bg-white rounded-full shadow-sm text-primary hover:text-accent transition">
          <ArrowLeft size={24} />
        </Link>
      </div>

      <div 
        className="w-full max-w-lg bg-paper p-8 shadow-2xl rounded-sm relative"
        style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 39px, rgba(201,176,226,0.2) 40px)', lineHeight: '40px' }}
      >
        <div className="flex justify-between items-start mb-6 border-b-2 border-dashed border-primary/30 pb-4">
          <div>
            <p className="text-sm font-bold text-accent font-sans uppercase tracking-widest mb-1">From: {letter.sender.role === 'SENDER' ? 'Her 💜' : 'Him'}</p>
            <p className="text-xs text-foreground/50 font-sans">Date: {new Date(letter.createdAt).toLocaleDateString()}</p>
          </div>
          {letter.mood && (
            <div className="bg-primary/10 px-3 py-1 rounded-full text-xs font-bold text-accent">
              {letter.mood}
            </div>
          )}
        </div>
        
        <h1 className="font-handwriting text-3xl font-bold text-accent mb-4">{letter.title}</h1>
        <p className="font-handwriting text-2xl text-foreground whitespace-pre-wrap">{letter.body}</p>

        {letter.attachments.filter(a => a.type === 'IMAGE').map(img => (
          <div key={img.id} className="mt-8 bg-white p-3 pb-10 shadow-lg border border-gray-200 rotate-2 w-64 mx-auto relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-pink-200/50 -rotate-2 shadow-sm z-10"></div>
            <img src={img.path} alt="Attached" className="w-full h-auto border border-gray-100 object-cover" />
          </div>
        ))}
        
        {letter.reaction && (
          <div className="mt-12 text-center text-6xl">
            {letter.reaction}
          </div>
        )}
      </div>
    </main>
  );
}
