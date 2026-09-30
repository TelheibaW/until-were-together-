'use server';

import { prisma } from '@/lib/prisma';
import { createSession } from '@/lib/session';
import crypto from 'crypto';
import { redirect } from 'next/navigation';

function hash(password: string) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) return { error: 'Missing fields' };

  const user = await prisma.user.findUnique({ where: { email } });
  
  if (!user || user.passwordHash !== hash(password)) {
    return { error: 'Invalid credentials' };
  }

  await createSession(user.id, user.role, user.relationshipId);
  redirect('/');
}

import { cookies } from 'next/headers';

export async function logout() {
  (await cookies()).delete('session');
  redirect('/login');
}
