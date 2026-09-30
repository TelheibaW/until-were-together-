'use client';

import { useState } from 'react';
import { createMemory } from '../actions';
import Link from 'next/link';
import { ArrowLeft, Image as ImageIcon } from 'lucide-react';

export default function CreateMemoryPage() {
  const [photoUrl, setPhotoUrl] = useState('');

  const handlePhotoUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) setPhotoUrl(ev.target.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <main className="min-h-screen bg-background flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-md mb-6">
        <Link href="/memories" className="inline-flex p-2 bg-white rounded-full shadow-sm text-primary hover:text-accent transition">
          <ArrowLeft size={24} />
        </Link>
      </div>

      <div className="w-full max-w-md bg-paper p-8 rounded-3xl shadow-xl border border-primary/20">
        <h1 className="text-3xl font-handwriting text-accent font-bold text-center mb-6">Add a Memory 📸</h1>
        
        <form action={createMemory} className="flex flex-col space-y-6">
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-primary/30 p-6 rounded-xl bg-white/50 relative overflow-hidden">
            {photoUrl ? (
              <img src={photoUrl} alt="Preview" className="w-full h-48 object-cover rounded" />
            ) : (
              <>
                <ImageIcon size={40} className="text-primary/50 mb-2" />
                <span className="text-sm text-primary font-semibold">Tap to attach a photo</span>
              </>
            )}
            <input type="file" accept="image/*" onChange={handlePhotoUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <input type="hidden" name="photoUrl" value={photoUrl} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-accent mb-2">What happened? (Caption)</label>
            <textarea 
              name="caption" 
              placeholder="That time we went to the park..."
              className="w-full p-3 rounded-xl bg-white border border-primary/20 focus:outline-none focus:ring-2 focus:ring-secondary min-h-[100px]"
              required 
            />
          </div>
          
          <button type="submit" className="w-full bg-accent text-white font-bold py-3 rounded-xl hover:bg-opacity-90 transition">
            Save to our Scrapbook
          </button>
        </form>
      </div>
    </main>
  );
}
