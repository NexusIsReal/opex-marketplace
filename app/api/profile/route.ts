import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Get user profile - protected route
export async function GET(req: NextRequest) {
  try {
    // Verify user is authenticated
    const session = await auth(req);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const user = session.user;
    
    try {
      const userProfile = await prisma.user.findUnique({
        where: { id: user.id },
        include: { profile: true },
      });

      if (!userProfile) {
        return NextResponse.json(
          { error: 'Profile not found' },
          { status: 404 }
        );
      }

      // Remove password from response
      const { password, ...userWithoutPassword } = userProfile;

      return NextResponse.json(userWithoutPassword);
    } catch (error) {
      console.error('Error fetching profile:', error);
      return NextResponse.json(
        { error: 'Failed to fetch profile' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

// Update user profile - protected route
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
      
      // Update user data
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          fullName: body.fullName,
          profile: {
            upsert: {
              create: {
                bio: body.bio,
                avatarUrl: body.avatarUrl,
                skills: body.skills,
                tagline: body.tagline,
                location: body.location,
                languages: body.languages,
              },
              update: {
                bio: body.bio,
                avatarUrl: body.avatarUrl,
                skills: body.skills,
                tagline: body.tagline,
                location: body.location,
                languages: body.languages,
              },
            },
          },
        },
        include: { profile: true },
      });

      // Remove password from response
      const { password, ...userWithoutPassword } = updatedUser;

      return NextResponse.json({
        message: 'Profile updated successfully',
        user: userWithoutPassword,
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
