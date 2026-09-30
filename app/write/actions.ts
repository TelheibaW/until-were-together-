'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import nodemailer from 'nodemailer';

export async function sendLetter(data: any) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  const letter = await prisma.letter.create({
    data: {
      relationshipId: session.relationshipId,
      senderId: session.userId,
      receiverId: data.receiverId,
      title: data.title || null,
      body: data.body,
      mood: data.mood || null,
      status: 'DELIVERED', // Simulate fast delivery for now, normally it would be TRAVELLING
      createdAt: new Date(),
      sentAt: new Date(),
      deliveredAt: new Date(), // Simulate delivery
    }
  });

  if (data.photoUrl) {
    await prisma.attachment.create({
      data: {
        letterId: letter.id,
        type: 'IMAGE',
        path: data.photoUrl,
      }
    });
  }

  // Find the receiver's email
  const receiver = await prisma.user.findUnique({
    where: { id: data.receiverId }
  });

  // Attempt to send email notification (this will fail silently if .env isn't configured, which is safe for demo)
  if (receiver && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Our Post Office 💌" <${process.env.EMAIL_USER}>`,
        to: receiver.email,
        subject: "You have a new letter waiting for you 💜",
        html: `
          <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
            <h1 style="color: #9b72aa;">YOU HAVE MAIL 💌</h1>
            <p style="font-size: 16px; color: #333;">Your partner just sent you a new letter!</p>
            <p style="font-size: 14px; color: #666; font-style: italic;">"Distance is temporary. This letter is forever."</p>
            <br/>
            <a href="https://until-were-together.vercel.app/mailbox" style="background-color: #c9b0e2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 20px; font-weight: bold;">Open My Letter</a>
          </div>
        `,
      });
      console.log('Email sent successfully to', receiver.email);
    } catch (e) {
      console.error('Failed to send email:', e);
    }
  }

  return { success: true, letterId: letter.id };
}
