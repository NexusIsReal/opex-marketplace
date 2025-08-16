import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import * as z from 'zod';
import bcrypt from 'bcryptjs';

type JwtPayload = {
  id: string;
  username: string;
  email: string;
  role: string;
};

// Schema for email update
const emailUpdateSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

// Schema for password update
const passwordUpdateSchema = z.object({
  currentPassword: z.string().min(1, { message: 'Current password is required' }),
  newPassword: z.string().min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least one special character' }),
  confirmPassword: z.string().min(1, { message: 'Confirm password is required' }),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Get account details
export async function GET(req: NextRequest) {
  try {
    // Verify user is authenticated
    const session = await auth(req);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const user = session.user;
    
    try {
      const userData = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          username: true,
          email: true,
          fullName: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!userData) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(userData);
    } catch (error) {
      console.error('Error fetching account details:', error);
      return NextResponse.json(
        { error: 'Failed to fetch account details' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

// Update account details
export async function PUT(req: NextRequest) {
  try {
    // Verify user is authenticated
    const session = await auth(req);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const user = session.user;
    
    try {
      const body = await req.json();
      const { action } = body;

      if (action === 'updateEmail') {
        return updateEmail(body, user);
      } else if (action === 'updatePassword') {
        return updatePassword(body, user);
      } else {
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
      }
    } catch (error) {
      console.error('Error updating account:', error);
      return NextResponse.json(
        { error: 'Failed to update account' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

// Helper function to update email
async function updateEmail(body: any, user: JwtPayload) {
  try {
    // Validate input
    const validation = emailUpdateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.format() },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // Get current user with password
    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, currentUser.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Check if email is already in use
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        NOT: { id: user.id },
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 409 }
      );
    }

    // Update email
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { email },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      message: 'Email updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating email:', error);
    return NextResponse.json(
      { error: 'Failed to update email' },
      { status: 500 }
    );
  }
}

// Helper function to update password
async function updatePassword(body: any, user: JwtPayload) {
  try {
    // Validate input
    const validation = passwordUpdateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.format() },
        { status: 400 }
      );
    }

    const { currentPassword, newPassword } = validation.data;

    // Get current user with password
    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, currentUser.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 401 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json({
      message: 'Password updated successfully',
    });
  } catch (error) {
    console.error('Error updating password:', error);
    return NextResponse.json(
      { error: 'Failed to update password' },
      { status: 500 }
    );
  }
}
