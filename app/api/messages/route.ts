import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/lib/auth';

const prisma = new PrismaClient();

// POST - Send a new message
export async function POST(req: NextRequest) {
  try {
    // Verify user is authenticated
    const session = await auth(req);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const senderId = session.user.id;
    const data = await req.json();
    const { content, receiverId, applicationId } = data;

    // Validate required fields
    if (!content || !receiverId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        content,
        senderId,
        receiverId,
        applicationId: applicationId || null,
        read: false
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            fullName: true,
          }
        },
        receiver: {
          select: {
            id: true,
            username: true,
            fullName: true,
          }
        }
      }
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

// GET - Get user's conversations
export async function GET(req: NextRequest) {
  try {
    // Verify user is authenticated
    const session = await auth(req);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const url = new URL(req.url);
    const withUserId = url.searchParams.get('withUser');
    const applicationId = url.searchParams.get('applicationId');
    
    // If a specific conversation is requested
    if (withUserId) {
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: userId, receiverId: withUserId },
            { senderId: withUserId, receiverId: userId }
          ],
          ...(applicationId ? { applicationId } : {})
        },
        orderBy: {
          createdAt: 'asc'
        },
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              fullName: true,
            }
          },
          receiver: {
            select: {
              id: true,
              username: true,
              fullName: true,
            }
          }
        }
      });

      // Mark messages as read
      await prisma.message.updateMany({
        where: {
          receiverId: userId,
          senderId: withUserId,
          read: false
        },
        data: {
          read: true
        }
      });

      return NextResponse.json({ messages });
    }
    
    // Get all conversations
    const sentMessages = await prisma.message.findMany({
      where: { senderId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        receiver: {
          select: {
            id: true,
            username: true,
            fullName: true,
          }
        }
      }
    });

    const receivedMessages = await prisma.message.findMany({
      where: { receiverId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            fullName: true,
          }
        }
      }
    });

    // Get unique conversations
    const conversations = new Map();
    
    // Process sent messages
    sentMessages.forEach((message: any) => {
      const otherUserId = message.receiver.id;
      if (!conversations.has(otherUserId)) {
        conversations.set(otherUserId, {
          user: message.receiver,
          lastMessage: message,
          unreadCount: 0
        });
      }
    });
    
    // Process received messages
    receivedMessages.forEach((message: any) => {
      const otherUserId = message.sender.id;
      const unread = !message.read;
      
      if (!conversations.has(otherUserId)) {
        conversations.set(otherUserId, {
          user: message.sender,
          lastMessage: message,
          unreadCount: unread ? 1 : 0
        });
      } else {
        const conversation = conversations.get(otherUserId);
        if (message.createdAt > conversation.lastMessage.createdAt) {
          conversation.lastMessage = message;
        }
        if (unread) {
          conversation.unreadCount += 1;
        }
      }
    });

    return NextResponse.json({ 
      conversations: Array.from(conversations.values())
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}
