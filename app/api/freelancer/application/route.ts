import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// POST - Create a new freelancer application
export async function POST(req: NextRequest) {
  try {
    // Verify user is authenticated
    const session = await auth(req);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    
    // Check if user already has an application
    const existingApplication = await prisma.freelancerApplication.findUnique({
      where: { userId }
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: 'You already have a pending application' },
        { status: 400 }
      );
    }

    const data = await req.json();
    const { category, skills, experience, portfolio, coverLetter } = data;

    // Validate required fields
    if (!category || !skills || !experience || !coverLetter) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create the application
    const application = await prisma.freelancerApplication.create({
      data: {
        userId,
        category,
        skills: JSON.stringify(skills), // Convert array to JSON string
        experience,
        portfolio,
        coverLetter,
        status: 'PENDING'
      }
    });
    
    // Convert skills back to array for response
    const responseApplication = {
      ...application,
      skills: JSON.parse(application.skills)
    };

    return NextResponse.json({ application: responseApplication }, { status: 201 });
  } catch (error) {
    console.error('Error creating freelancer application:', error);
    return NextResponse.json(
      { error: 'Failed to create application' },
      { status: 500 }
    );
  }
}

// GET - Get user's own application
export async function GET(req: NextRequest) {
  try {
    // Verify user is authenticated
    const session = await auth(req);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    
    // Get the user's application
    const application = await prisma.freelancerApplication.findUnique({
      where: { userId }
    });

    if (!application) {
      return NextResponse.json(
        { error: 'No application found' },
        { status: 404 }
      );
    }
    
    // Convert skills from JSON string to array
    const responseApplication = {
      ...application,
      skills: JSON.parse(application.skills)
    };

    return NextResponse.json({ application: responseApplication });
  } catch (error) {
    console.error('Error fetching freelancer application:', error);
    return NextResponse.json(
      { error: 'Failed to fetch application' },
      { status: 500 }
    );
  }
}

// PATCH - Update user's own application (only if it's in PENDING status)
export async function PATCH(req: NextRequest) {
  try {
    // Verify user is authenticated
    const session = await auth(req);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    
    // Get the user's application
    const existingApplication = await prisma.freelancerApplication.findUnique({
      where: { userId }
    });

    if (!existingApplication) {
      return NextResponse.json(
        { error: 'No application found' },
        { status: 404 }
      );
    }

    // Only allow updates if the application is still pending
    if (existingApplication.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Cannot update application that is no longer pending' },
        { status: 400 }
      );
    }

    const data = await req.json();
    const { category, skills, experience, portfolio, coverLetter } = data;

    // Update the application
    const application = await prisma.freelancerApplication.update({
      where: { userId },
      data: {
        category: category || undefined,
        skills: skills ? JSON.stringify(skills) : undefined,
        experience: experience || undefined,
        portfolio: portfolio || undefined,
        coverLetter: coverLetter || undefined,
      }
    });
    
    // Convert skills back to array for response
    const responseApplication = {
      ...application,
      skills: JSON.parse(application.skills)
    };

    return NextResponse.json({ application: responseApplication });
  } catch (error) {
    console.error('Error updating freelancer application:', error);
    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 }
    );
  }
}
