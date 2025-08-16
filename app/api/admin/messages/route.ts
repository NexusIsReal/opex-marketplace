import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAdmin } from '@/lib/adminAuth';

const prisma = new PrismaClient();

// POST - Send a new message as admin
export const POST = requireAdmin(async (req: NextRequest, admin) => {
  try {
    const senderId = admin.id;
    
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
