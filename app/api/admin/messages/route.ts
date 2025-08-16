import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAdmin } from '@/lib/adminAuth';

const prisma = new PrismaClient();

// POST - Send a new message as admin
export const POST = requireAdmin(async (req: NextRequest, admin) => {
  try {

    const senderId = admin.id;
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
});

// GET - Get admin's conversations or messages with a specific user
export const GET = requireAdmin(async (req: NextRequest, admin) => {
  try {

    const adminId = admin.id;
    const url = new URL(req.url);
    const withUserId = url.searchParams.get('withUser');
    const applicationId = url.searchParams.get('applicationId');
    
    // If a specific conversation is requested
    if (withUserId) {
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: adminId, receiverId: withUserId },
            { senderId: withUserId, receiverId: adminId }
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
          receiverId: adminId,
          senderId: withUserId,
          read: false
        },
        data: {
          read: true
        }
      });

      return NextResponse.json({ messages });
    }
    
    // Get all users with conversations (for admin, we want to see all users)
    const allUsers = await prisma.user.findMany({
      where: {
        OR: [
          { sentMessages: { some: { receiverId: adminId } } },
          { receivedMessages: { some: { senderId: adminId } } }
        ]
      },
      select: {
        id: true,
        username: true,
        fullName: true,
        role: true
      }
    });

    const conversations = [];
    
    // For each user, find the last message and unread count
    for (const user of allUsers) {
      // Skip if the user is the admin
      if (user.id === adminId) continue;
      
      // Get the last message between admin and this user
      const lastMessage = await prisma.message.findFirst({
        where: {
          OR: [
            { senderId: adminId, receiverId: user.id },
            { senderId: user.id, receiverId: adminId }
          ]
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      // Count unread messages from this user
      const unreadCount = await prisma.message.count({
        where: {
          senderId: user.id,
          receiverId: adminId,
          read: false
        }
      });
      
      if (lastMessage) {
        conversations.push({
          user,
          lastMessage,
          unreadCount
        });
      }
    }
    
    // Sort conversations by last message date (newest first)
    conversations.sort((a, b) => 
      new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
    );

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
});
