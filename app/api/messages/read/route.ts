import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Verify user is authenticated
    const session = await auth(request);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the sender ID from query params
    const url = new URL(request.url);
    const senderId = url.searchParams.get('senderId');

    if (!senderId) {
      return NextResponse.json({ error: 'Sender ID is required' }, { status: 400 });
    }

    // Mark all messages from the specified sender to the current user as read
    const updatedMessages = await prisma.message.updateMany({
      where: {
        senderId: senderId,
        receiverId: session.user.id,
        read: false,
      },
      data: {
        read: true,
      },
    });

    return NextResponse.json({ 
      success: true, 
      updatedCount: updatedMessages.count 
    });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
