import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

// GET a specific service by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        profile: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                displayName: true,
                email: true
              }
            }
          }
        }
      }
    });
    
    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ service });
  } catch (error) {
    console.error('Error fetching service:', error);
    return NextResponse.json(
      { error: 'Failed to fetch service' },
      { status: 500 }
    );
  }
}

// PUT update a service
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const authResult = await verifyAuth(request);
    
    if (!authResult.success) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const userId = authResult.userId;
    
    // Find the service and check ownership
    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        profile: {
          include: {
            user: true
          }
        }
      }
    });
    
    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }
    
    // Check if the user owns this service
    if (service.profile.user.id !== userId) {
      return NextResponse.json(
        { error: 'You do not have permission to update this service' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    
    // Parse features if it's a string
    let features = body.features;
    if (features && typeof features === 'string') {
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
    
    // Update the service
    const updatedService = await prisma.service.update({
      where: { id },
      data: {
        title: body.title ?? undefined,
        description: body.description ?? undefined,
        coverUrl: body.coverUrl ?? undefined,
        category: body.category ?? undefined,
        priceFrom: body.priceFrom ? parseFloat(body.priceFrom) : undefined,
        priceTo: body.priceTo ? parseFloat(body.priceTo) : undefined,
        deliveryDays: body.deliveryDays ? parseInt(body.deliveryDays) : undefined,
        revisions: body.revisions ? parseInt(body.revisions) : undefined,
        features: features ? (typeof features === 'string' ? features : JSON.stringify(features)) : undefined,
        tags: tags ? (typeof tags === 'string' ? tags : JSON.stringify(tags)) : undefined,
      }
    });
    
    return NextResponse.json({ service: updatedService });
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      { error: 'Failed to update service' },
      { status: 500 }
    );
  }
}

// DELETE a service
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const authResult = await verifyAuth(request);
    
    if (!authResult.success) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const userId = authResult.userId;
    
    // Find the service and check ownership
    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        profile: {
          include: {
            user: true
          }
        }
      }
    });
    
    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }
    
    // Check if the user owns this service
    if (service.profile.user.id !== userId) {
      return NextResponse.json(
        { error: 'You do not have permission to delete this service' },
        { status: 403 }
      );
    }
    
    // Delete the service
    await prisma.service.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { error: 'Failed to delete service' },
      { status: 500 }
    );
  }
}
