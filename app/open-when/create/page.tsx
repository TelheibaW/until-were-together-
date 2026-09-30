'use client';

import { createOpenWhen } from '../actions';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function CreateOpenWhenPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-lg mb-6">
        <Link href="/open-when" className="inline-flex p-2 bg-white rounded-full shadow-sm text-primary hover:text-accent transition">
          <ArrowLeft size={24} />
        </Link>
      </div>

      <div className="w-full max-w-lg bg-paper p-8 rounded-3xl shadow-xl border border-primary/20">
        <h1 className="text-3xl font-handwriting text-accent font-bold text-center mb-6">Create Open When Letter 🎀</h1>
        
        <form action={createOpenWhen} className="flex flex-col space-y-6">
          <div>
            <label className="block text-sm font-semibold text-accent mb-2">Condition (e.g. Open when you miss me)</label>
            <input 
              name="condition" 
              type="text"
              placeholder="Open when..."
              className="w-full p-3 rounded-xl bg-white border border-primary/20 focus:outline-none focus:ring-2 focus:ring-secondary"
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-accent mb-2">The Letter</label>
            <textarea 
              name="body" 
              placeholder="Write your message here..."
              className="w-full p-3 rounded-xl bg-white border border-primary/20 focus:outline-none focus:ring-2 focus:ring-secondary min-h-[200px]"
              required 
            />
          </div>

          <div className="flex items-center gap-3 bg-primary/10 p-4 rounded-xl border border-primary/20">
            <input type="checkbox" id="isSecret" name="isSecret" className="w-5 h-5 accent-accent" />
            <label htmlFor="isSecret" className="text-sm text-accent font-bold">Lock this letter until I unlock it manually</label>
          </div>
          
          <button type="submit" className="w-full bg-accent text-white font-bold py-3 rounded-xl hover:bg-opacity-90 transition">
            Create Envelope
          </button>
        </form>
      </div>
    </main>
  );
}
