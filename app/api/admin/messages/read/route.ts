import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAdmin } from '@/lib/adminAuth';

const prisma = new PrismaClient();

// POST - Mark messages as read for admin
export const POST = requireAdmin(async (req: NextRequest, admin) => {
  try {

    const adminId = admin.id;
    const data = await req.json();
    const { senderId } = data;

    // Validate required fields
    if (!senderId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Mark all messages from the sender to the admin as read
    await prisma.message.updateMany({
      where: {
        senderId,
        receiverId: adminId,
        read: false
      },
      data: {
        read: true
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    return NextResponse.json(
      { error: 'Failed to mark messages as read' },
      { status: 500 }
    );
  }
});
