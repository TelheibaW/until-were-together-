'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { markAsRead, reactToLetter } from './actions';
import Link from 'next/link';
import { ArrowLeft, MailOpen } from 'lucide-react';

const REACTIONS = ['❤️', '🥺', '🫂', '😂', '💜', '🎀'];

export default function MailboxClient({ unreadLetter, readLetters }: any) {
  const [opening, setOpening] = useState(false);
  const [opened, setOpened] = useState(false);
  const [showReaction, setShowReaction] = useState(false);

  const handleOpen = async () => {
    setOpening(true);
    setTimeout(() => {
      setOpening(false);
      setOpened(true);
      markAsRead(unreadLetter.id);
    }, 3000);
  };

  const handleReact = async (r: string) => {
    setShowReaction(true);
    await reactToLetter(unreadLetter.id, r);
  };

  // 1. You Have Mail Modal
  if (unreadLetter && !opened) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <AnimatePresence>
          {!opening ? (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              className="text-center z-10 flex flex-col items-center"
            >
              <h2 className="font-handwriting text-3xl font-bold text-accent mb-8 tracking-widest">YOU HAVE MAIL</h2>
              
              <motion.div 
                animate={{ rotate: [-5, 5, -5, 5, 0] }}
                transition={{ repeat: Infinity, duration: 2, repeatDelay: 1 }}
                className="text-8xl mb-8 cursor-pointer"
                onClick={handleOpen}
              >
                📬
              </motion.div>
              
              <p className="font-sans text-foreground/80 mb-2">From your pretty girl 💜</p>
              <p className="font-handwriting text-2xl text-accent mb-8">You have a new letter waiting for you.</p>
              
              <button 
                onClick={handleOpen}
                className="bg-accent text-white font-bold py-4 px-8 rounded-full shadow-xl hover:scale-105 transition flex items-center gap-2"
              >
                <MailOpen size={20} />
                Open My Letter
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ y: 200, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative w-80 h-56 bg-[#fff5f8] shadow-2xl rounded-sm border-2 border-primary/20 flex items-center justify-center"
            >
              <div className="absolute top-0 left-0 w-full h-full border-t-[100px] border-t-primary/30 border-l-[160px] border-l-transparent border-r-[160px] border-r-transparent"></div>
              <motion.div 
                initial={{ rotateX: 0 }}
                animate={{ rotateX: 180 }}
                transition={{ duration: 1, delay: 0.5 }}
                style={{ transformOrigin: 'top' }}
                className="absolute top-0 left-0 w-full h-0 border-t-[100px] border-t-[#fff5f8] border-l-[160px] border-l-transparent border-r-[160px] border-r-transparent z-20"
              ></motion.div>
              
              <motion.div 
                initial={{ y: 100 }}
                animate={{ y: -50 }}
                transition={{ duration: 1, delay: 1.5 }}
                className="absolute w-64 h-48 bg-white shadow-md rounded border border-primary/10 z-10"
              ></motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // 2. Reading the opened letter
  if (opened && unreadLetter) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center py-12 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg bg-paper p-8 shadow-2xl rounded-sm relative"
          style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 39px, rgba(201,176,226,0.2) 40px)', lineHeight: '40px' }}
        >
          <div className="flex justify-between items-start mb-6 border-b-2 border-dashed border-primary/30 pb-4">
            <div>
              <p className="text-sm font-bold text-accent font-sans uppercase tracking-widest mb-1">From: My Pretty Girl 💜</p>
              <p className="text-xs text-foreground/50 font-sans">Date: {new Date(unreadLetter.createdAt).toLocaleDateString()}</p>
            </div>
            {unreadLetter.mood && (
              <div className="bg-primary/10 px-3 py-1 rounded-full text-xs font-bold text-accent">
                {unreadLetter.mood}
              </div>
            )}
          </div>
          
          <h1 className="font-handwriting text-3xl font-bold text-accent mb-4">{unreadLetter.title}</h1>
          <p className="font-handwriting text-2xl text-foreground whitespace-pre-wrap">{unreadLetter.body}</p>

          {unreadLetter.attachments && unreadLetter.attachments.filter((a: any) => a.type === 'IMAGE').map((img: any) => (
            <div key={img.id} className="mt-8 bg-white p-3 pb-10 shadow-lg border border-gray-200 rotate-2 w-64 mx-auto relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-pink-200/50 -rotate-2 shadow-sm z-10"></div>
              <img src={img.path} alt="Attached memory" className="w-full h-auto border border-gray-100 object-cover" />
              <p className="font-handwriting text-xl text-center text-accent mt-4">For you 💜</p>
            </div>
          ))}

          <div className="mt-12 pt-8 border-t border-primary/20 text-center">
            {showReaction ? (
              <p className="text-sm text-foreground/50">Reaction sent! 💜</p>
            ) : (
              <>
                <p className="text-sm font-bold text-accent mb-4">React to this letter</p>
                <div className="flex justify-center gap-4">
                  {REACTIONS.map(r => (
                    <button key={r} onClick={() => handleReact(r)} className="text-2xl hover:scale-125 transition">{r}</button>
                  ))}
                </div>
              </>
            )}
            
            <Link href="/" className="inline-block mt-8 text-sm font-bold text-white bg-accent px-6 py-2 rounded-full shadow-md hover:bg-opacity-90">
              ❤️ Keep this letter
            </Link>
          </div>
        </motion.div>
      </main>
    );
  }

  // 3. Empty Mailbox State
  return (
    <main className="min-h-screen bg-background flex flex-col p-4 max-w-2xl mx-auto">
      <header className="flex items-center justify-between mb-12 pt-4">
        <Link href="/" className="p-2 bg-white rounded-full shadow-sm text-primary hover:text-accent transition">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="font-handwriting text-3xl font-bold text-accent">Mailbox</h1>
        <div className="w-10"></div>
      </header>
      
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="text-6xl mb-6 opacity-50">📭</div>
        <h2 className="font-handwriting text-2xl font-bold text-accent mb-2">No letters right now</h2>
        <p className="text-foreground/50 text-sm italic">The mailbox is waiting for someone special...</p>
        
        <p className="text-xs text-primary mt-12 bg-white px-4 py-2 rounded-full border border-primary/20 shadow-sm">
          "Someone really missed you. 👀💜" - Postal Bunny
        </p>
      </div>
    </main>
  );
}
