'use client';

import { useActionState } from 'react';
import { login } from './actions';

export default function LoginPage() {
  const [state, action, isPending] = useActionState(async (prevState: any, formData: FormData) => {
    return await login(formData);
  }, null);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md bg-paper p-8 rounded-3xl shadow-xl border border-secondary/20 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 p-4 opacity-50">
           <svg width="40" height="40" viewBox="0 0 24 24" fill="var(--color-secondary)"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        </div>
        
        <h1 className="text-3xl font-handwriting text-accent font-bold text-center mb-2">Until We're Together 💌</h1>
        <p className="text-center text-foreground/70 mb-8 font-sans">A little place for us.</p>
        
        <form action={action} className="flex flex-col space-y-4">
          <div>
            <label className="block text-sm font-semibold text-accent mb-1">Username</label>
            <input 
              name="email" 
              type="text" 
              defaultValue="Thajah"
              className="w-full p-3 rounded-xl bg-background border border-primary focus:outline-none focus:ring-2 focus:ring-secondary"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-accent mb-1">Password</label>
            <input 
              name="password" 
              type="password" 
              defaultValue="password"
              className="w-full p-3 rounded-xl bg-background border border-primary focus:outline-none focus:ring-2 focus:ring-secondary"
              required 
            />
          </div>
          
          {state?.error && <p className="text-red-500 text-sm text-center">{state.error}</p>}
          
          <button 
            type="submit" 
            disabled={isPending}
            className="w-full bg-accent text-white font-bold py-3 rounded-xl hover:bg-opacity-90 transition disabled:opacity-50 mt-4"
          >
            {isPending ? 'Unlocking...' : 'Unlock our post office 📬'}
          </button>
        </form>
      </div>
    </div>
  );
}
