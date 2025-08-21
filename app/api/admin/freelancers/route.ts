import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';

// GET - Get all freelancers (admin only)
export const GET = requireAdmin(async (req: NextRequest, user) => {
  try {
    // Get query parameters for filtering
    const url = new URL(req.url);
    const category = url.searchParams.get('category');
    
    // Build the query for freelancers (users with FREELANCER role)
    const query: any = {
      role: 'FREELANCER'
    };
    
    // Get freelancers with their profile and application information
    const freelancers = await prisma.user.findMany({
      where: query,
      include: {
        profile: true,
        freelancerApplication: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Process the data to match the expected format in the frontend
    const processedFreelancers = freelancers.map(freelancer => {
      // Parse skills from profile if available
      const skills = freelancer.profile?.skills 
        ? JSON.parse(freelancer.profile.skills) 
        : [];
      
      return {
        id: freelancer.id,
        name: freelancer.fullName || freelancer.username,
        username: freelancer.username,
        email: freelancer.email,
        avatar: freelancer.profile?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(freelancer.fullName || freelancer.username)}&background=random&color=fff`,
        category: freelancer.freelancerApplication?.category || 'Not specified',
        skills: skills,
        verified: freelancer.emailVerified !== null,
        featured: false, // This can be added as a field to the profile model later
        joinDate: freelancer.createdAt,
        // Additional fields that can be expanded later
        rating: 0,
        reviews: 0,
        level: 'Level 1',
        earnings: '$0',
        completedJobs: 0
      };
    });

    return NextResponse.json({ freelancers: processedFreelancers });
  } catch (error) {
    console.error('Error fetching freelancers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch freelancers' },
      { status: 500 }
    );
  }
});
