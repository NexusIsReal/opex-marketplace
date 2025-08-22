import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

// GET all services
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const username = searchParams.get('username');
    
    let query: any = {};
    
    if (category) {
      query.category = category;
    }
    
    if (username) {
      query.profile = {
        user: {
          username
        }
      };
    }
    
    const services = await prisma.service.findMany({
      where: query,
      include: {
        profile: {
          include: {
            user: {
              select: {
                username: true,
                id: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json({ services });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

// POST create a new service
export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const userId = authResult.userId;
    
    // Check if user is a freelancer
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    if (user.role !== 'FREELANCER') {
      // Check if they have an approved application
      const application = await prisma.freelancerApplication.findUnique({
        where: { userId },
      });
      
      if (!application || application.status !== 'APPROVED') {
        return NextResponse.json(
          { error: 'Only approved freelancers can create services' },
          { status: 403 }
        );
      }
    }
    
    // Ensure user has a profile
    if (!user.profile) {
      return NextResponse.json(
        { error: 'Freelancer profile not found. Please complete your profile first.' },
        { status: 400 }
      );
    }
    
    const profileId = user.profile.id;
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'description', 'category', 'priceFrom', 'deliveryDays', 'features'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Parse features if it's a string
    let features = body.features;
    if (typeof features === 'string') {
      try {
        features = JSON.parse(features);
      } catch (e) {
        return NextResponse.json(
          { error: 'Invalid features format' },
          { status: 400 }
        );
      }
    }
    
    // Parse tags if provided and it's a string
    let tags = body.tags || null;
    if (tags && typeof tags === 'string') {
      try {
        tags = JSON.parse(tags);
      } catch (e) {
        return NextResponse.json(
          { error: 'Invalid tags format' },
          { status: 400 }
        );
      }
    }
    
    // Create the service
    const service = await prisma.service.create({
      data: {
        title: body.title,
        description: body.description,
        coverUrl: body.coverUrl,
        category: body.category,
        priceFrom: parseFloat(body.priceFrom),
        priceTo: body.priceTo ? parseFloat(body.priceTo) : null,
        deliveryDays: parseInt(body.deliveryDays),
        revisions: body.revisions ? parseInt(body.revisions) : 1,
        features: typeof features === 'string' ? features : JSON.stringify(features),
        tags: tags ? (typeof tags === 'string' ? tags : JSON.stringify(tags)) : null,
        profileId
      }
    });
    
    return NextResponse.json({ service }, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    );
  }
}
