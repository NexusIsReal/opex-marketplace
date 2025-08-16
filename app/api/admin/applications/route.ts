import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';

// GET - Get all freelancer applications (admin only)
export const GET = requireAdmin(async (req: NextRequest, user) => {
  try {
    // Get query parameters for filtering
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    
    // Build the query
    const query: any = {};
    if (status && ['PENDING', 'APPROVED', 'REJECTED', 'INTERVIEW'].includes(status)) {
      query.status = status;
    }
    
    // Get applications with user information
    const applications = await prisma.freelancerApplication.findMany({
      where: query,
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Parse skills JSON string to array for each application
    const parsedApplications = applications.map(app => ({
      ...app,
      skills: JSON.parse(app.skills)
    }));

    return NextResponse.json({ applications: parsedApplications });
  } catch (error) {
    console.error('Error fetching freelancer applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
});
