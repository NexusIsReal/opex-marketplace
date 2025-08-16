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
    
    // Check content type to determine if it's a FormData request (with attachments)
    const contentType = req.headers.get('content-type') || '';
    
    let content = '';
    let receiverId = '';
    let applicationId: string | null = null;
    let attachments: { name: string; type: string; url: string }[] = [];
    
    if (contentType.includes('multipart/form-data')) {
      // Handle FormData with attachments
      const formData = await req.formData();
      content = formData.get('content') as string || '';
      receiverId = formData.get('receiverId') as string || '';
      applicationId = formData.get('applicationId') as string || null;
      
      // Process attachments
      const files: File[] = [];
      
      // Extract all files from the formData
      for (const [key, value] of formData.entries()) {
        if (key.startsWith('attachment') && value instanceof File) {
          files.push(value);
        }
      }
      
      // Process each file
      for (const file of files) {
        const fileName = file.name;
        const fileType = file.type;
        const timestamp = Date.now();
        const safeFileName = `${timestamp}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        
        // Create URL for the file in the public/uploads directory
        const fileUrl = `/uploads/${safeFileName}`;
        
        // In a real implementation, you would use a proper file storage service
        // For now, we'll save to the public directory
        try {
          // Convert file to ArrayBuffer
          const arrayBuffer = await file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          
          // Use Node.js fs module to write the file
          const fs = require('fs');
          const path = require('path');
          const filePath = path.join(process.cwd(), 'public', 'uploads', safeFileName);
          
          // Create directory if it doesn't exist
          const dir = path.dirname(filePath);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          
          // Write the file
          fs.writeFileSync(filePath, buffer);
          
          // Add to attachments
          attachments.push({
            name: fileName,
            type: fileType,
            url: fileUrl
          });
        } catch (fileError) {
          console.error('Error saving file:', fileError);
          // Continue with other files even if one fails
        }
      }
    } else {
      // Handle regular JSON request
      const data = await req.json();
      content = data.content;
      receiverId = data.receiverId;
      applicationId = data.applicationId || null;
    }

    // Validate required fields
    if (!receiverId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Ensure we have either content or attachments
    if (!content && attachments.length === 0) {
      return NextResponse.json(
        { error: 'Message must have content or attachments' },
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
        read: false,
        attachments: attachments.length > 0 ? JSON.stringify(attachments) : null
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
