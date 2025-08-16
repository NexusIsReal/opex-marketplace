import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';

// GET - Get a specific application by ID (admin only)
export const GET = requireAdmin(async (req: NextRequest, user) => {
  try {
    // Extract ID from params using the URL path segments
    const pathParts = req.nextUrl.pathname.split('/');
    const id = pathParts[pathParts.length - 1];
    
    // Get application with user information
    const application = await prisma.freelancerApplication.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            fullName: true,
            createdAt: true,
          }
        }
      }
    });

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    // Parse skills JSON string to array
    const parsedApplication = {
      ...application,
      skills: JSON.parse(application.skills)
    };

    return NextResponse.json({ application: parsedApplication });
  } catch (error) {
    console.error('Error fetching freelancer application:', error);
    return NextResponse.json(
      { error: 'Failed to fetch application' },
      { status: 500 }
    );
  }
});

// PATCH - Update application status (admin only)
export const PATCH = requireAdmin(async (req: NextRequest, user) => {
  try {
    // Extract ID from params using the URL path segments
    const pathParts = req.nextUrl.pathname.split('/');
    const id = pathParts[pathParts.length - 1];
    
    const data = await req.json();
    const { status, adminNotes } = data;
    
    // Validate status
    if (status && !['PENDING', 'APPROVED', 'REJECTED', 'INTERVIEW'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Get the application
    const existingApplication = await prisma.freelancerApplication.findUnique({
      where: { id },
      include: { user: true }
    });

    if (!existingApplication) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    // Update the application
    const application = await prisma.freelancerApplication.update({
      where: { id },
      data: {
        status: status || undefined,
        adminNotes: adminNotes || undefined,
      }
    });

    // If approved, update user role to FREELANCER
    if (status === 'APPROVED') {
      await prisma.user.update({
        where: { id: existingApplication.userId },
        data: { role: 'FREELANCER' }
      });
    }

    // Parse skills JSON string to array
    const parsedApplication = {
      ...application,
      skills: JSON.parse(application.skills)
    };

    return NextResponse.json({ application: parsedApplication });
  } catch (error) {
    console.error('Error updating freelancer application:', error);
    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 }
    );
  }
});
