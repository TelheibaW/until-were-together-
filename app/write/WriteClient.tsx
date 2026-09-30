'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendLetter } from './actions';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Image as ImageIcon, Mic, SmilePlus, X } from 'lucide-react';
import Link from 'next/link';

const MOODS = ['💜 Missing You', '🌙 Goodnight', '🥺 I Need You', '🎀 Just Because', '❤️ I Love You', '😂 Something Funny', '🫂 I Need a Hug'];

export default function WriteClient({ senderId, receiverId, relationshipId }: any) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [mood, setMood] = useState(MOODS[0]);
  const [photoUrl, setPhotoUrl] = useState('');
  
  const [animationStage, setAnimationStage] = useState<number>(0);
  // 0: Writing, 1: Folding, 2: Envelope, 3: Stamp, 4: Postal Char, 5: Mailbox, 6: Travelling

  const handlePhotoUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setPhotoUrl(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if (!body.trim()) return;
    
    // Start animation sequence
    setAnimationStage(1);
    
    // Stage 2: Envelope
    setTimeout(() => setAnimationStage(2), 1500);
    // Stage 3: Stamp
    setTimeout(() => setAnimationStage(3), 3000);
    // Stage 4: Character picks up
    setTimeout(() => setAnimationStage(4), 4500);
    // Stage 5: Mailbox
    setTimeout(() => setAnimationStage(5), 6000);
    // Stage 6: Travelling
    setTimeout(() => {
      setAnimationStage(6);
      // Actually send to DB while travelling
      sendLetter({ title, body, mood, receiverId, photoUrl });
    }, 7500);
    
    // Done, redirect home
    setTimeout(() => {
      router.push('/');
    }, 11000);
  };

  if (animationStage > 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center overflow-hidden relative">
        <AnimatePresence>
          {animationStage === 1 && (
            <motion.div
              key="stage1"
              initial={{ scale: 1, rotateX: 0 }}
              animate={{ scale: 0.8, rotateX: 180, y: 100, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="bg-paper p-8 w-80 h-96 shadow-xl relative"
            >
              <div className="border-b-2 border-primary/30 h-full w-full opacity-50 flex flex-col gap-4 pt-4">
                <div className="h-4 bg-primary/20 rounded w-3/4"></div>
                <div className="h-4 bg-primary/20 rounded w-full"></div>
                <div className="h-4 bg-primary/20 rounded w-5/6"></div>
              </div>
            </motion.div>
          )}

          {(animationStage >= 2 && animationStage <= 5) && (
            <motion.div
              key="stage2-5"
              initial={{ y: 200, opacity: 0 }}
              animate={{ 
                y: animationStage >= 5 ? 200 : 0, 
                opacity: animationStage >= 5 ? 0 : 1,
                scale: animationStage >= 4 ? 0.8 : 1
              }}
              transition={{ duration: 1 }}
              className="relative w-72 h-48 bg-[#fff5f8] shadow-2xl rounded-sm border-2 border-primary/20 flex items-center justify-center overflow-hidden z-20"
            >
              {/* Envelope flap */}
              <div className="absolute top-0 left-0 w-full h-full border-t-[80px] border-t-primary/30 border-l-[144px] border-l-transparent border-r-[144px] border-r-transparent opacity-50 pointer-events-none"></div>
              
              {animationStage >= 3 && (
                <motion.div 
                  initial={{ scale: 3, opacity: 0, rotate: 20 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  className="absolute top-4 right-4 w-10 h-12 bg-white border-2 border-dashed border-gray-300 flex items-center justify-center"
                >
                  <span className="text-xl">💜</span>
                </motion.div>
              )}

              <p className="font-handwriting text-2xl text-accent font-bold mt-8">To You</p>
            </motion.div>
          )}

          {animationStage >= 4 && animationStage <= 5 && (
            <motion.div
              key="stage4-5"
              initial={{ x: -200, opacity: 0 }}
              animate={{ x: animationStage === 5 ? 200 : 0, opacity: 1 }}
              transition={{ duration: 1.5 }}
              className="absolute z-10 top-1/2 -mt-32"
            >
              <div className="text-6xl">🐰📮</div>
            </motion.div>
          )}

          {animationStage >= 6 && (
            <motion.div
              key="stage6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-8"
            >
              <h2 className="font-handwriting text-4xl text-accent">Your letter is on its way... 💌</h2>
              
              <div className="flex items-center gap-4 w-full max-w-sm">
                <div className="flex-1 text-right font-bold text-primary">Sender 💜</div>
                
                <div className="w-48 h-1 bg-primary/30 rounded-full relative">
                  <motion.div 
                    initial={{ left: 0 }}
                    animate={{ left: "100%" }}
                    transition={{ duration: 3, ease: "linear" }}
                    className="absolute -top-3 text-2xl"
                  >
                    ✉️
                  </motion.div>
                </div>

                <div className="flex-1 font-bold text-accent">Receiver</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <main className="flex-1 flex flex-col max-w-2xl mx-auto w-full p-4 h-screen">
      <header className="flex items-center justify-between mb-6 pt-4">
        <Link href="/" className="p-2 bg-white rounded-full shadow-sm text-primary hover:text-accent transition">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="font-handwriting text-3xl font-bold text-accent">Write a Letter</h1>
        <div className="w-10"></div>
      </header>

      <div className="flex-1 bg-paper shadow-xl rounded-t-3xl border-x border-t border-primary/20 flex flex-col overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-10 bg-[url('https://www.transparenttextures.com/patterns/notebook.png')] opacity-10 pointer-events-none"></div>
        
        <div className="p-6 flex-1 flex flex-col gap-4 overflow-y-auto">
          <input 
            type="text" 
            placeholder="FOR MY PRETTY BOY 💜 (Title)" 
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full bg-transparent font-handwriting text-3xl font-bold text-accent placeholder:text-accent/40 focus:outline-none border-b-2 border-dashed border-primary/30 pb-2"
          />

          <select 
            value={mood} 
            onChange={e => setMood(e.target.value)}
            className="self-start bg-primary/10 text-accent font-semibold py-1 px-3 rounded-full text-sm focus:outline-none appearance-none"
          >
            {MOODS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>

          <textarea 
            placeholder="Write your heart out..." 
            value={body}
            onChange={e => setBody(e.target.value)}
            className="w-full flex-1 bg-transparent font-handwriting text-2xl leading-[2.5rem] text-foreground focus:outline-none resize-none"
            style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 39px, rgba(201,176,226,0.2) 40px)', lineHeight: '40px' }}
          ></textarea>
          
          {photoUrl && (
            <div className="relative mt-4 self-start bg-white p-3 pb-8 shadow-md border border-gray-200 rotate-2">
              <button 
                onClick={() => setPhotoUrl('')} 
                className="absolute -top-3 -right-3 bg-red-400 text-white p-1 rounded-full shadow-sm hover:scale-110 transition z-10"
              >
                <X size={16} />
              </button>
              <img src={photoUrl} alt="Attached" className="w-48 h-auto object-cover border border-gray-100" />
            </div>
          )}
        </div>

        {/* Toolbar */}
        <div className="bg-white p-4 border-t border-primary/20 flex items-center justify-between">
          <div className="flex gap-4 text-primary">
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handlePhotoUpload} 
            />
            <button onClick={() => fileInputRef.current?.click()} className="p-2 hover:bg-primary/10 rounded-full transition relative group">
              <ImageIcon size={20} />
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-accent text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none">Attach Photo</span>
            </button>
            <button className="p-2 hover:bg-primary/10 rounded-full transition"><Mic size={20} /></button>
            <button className="p-2 hover:bg-primary/10 rounded-full transition"><SmilePlus size={20} /></button>
          </div>
          
          <button 
            onClick={handleSend}
            disabled={!body.trim()}
            className="bg-accent text-white font-bold py-2 px-6 rounded-xl hover:bg-opacity-90 transition shadow-md disabled:opacity-50"
          >
            📮 SEND
          </button>
        </div>
      </div>
    </main>
  );
}
