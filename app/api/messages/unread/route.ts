import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Verify user is authenticated
    const session = await auth(request);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Count unread messages for the current user
    const unreadCount = await prisma.message.count({
      where: {
        receiverId: session.user.id,
        read: false,
      },
    });

    return NextResponse.json({ 
      unreadCount
    });
  } catch (error) {
    console.error('Error counting unread messages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
