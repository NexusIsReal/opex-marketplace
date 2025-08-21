import { prisma } from './prisma';

export type ServiceWithProfile = {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  category: string;
  priceFrom: number;
  priceTo: number;
  deliveryDays: number;
  revisions: number;
  features: string;
  tags: string;
  createdAt: Date;
  updatedAt: Date;
  profileId: string;
  profile?: {
    id: string;
    userId: string;
    displayName: string | null;
    avatarUrl: string | null;
    tagline: string | null;
    about: string | null;
    location: string | null;
    memberSince: Date | null;
    lastDelivery: Date | null;
    languages: any | null;
    skills: string[] | null;
    rating: number | null;
    reviews: number | null;
    ordersInQueue: number | null;
    user?: {
      id: string;
      username: string;
    }
  }
};

export async function getAllServices(): Promise<ServiceWithProfile[]> {
  try {
    const services = await prisma.service.findMany({
      include: {
        profile: {
          include: {
            user: {
              select: {
                id: true,
                username: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return services;
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

export async function getServiceById(id: string): Promise<ServiceWithProfile | null> {
  try {
    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        profile: {
          include: {
            user: {
              select: {
                id: true,
                username: true
              }
            }
          }
        }
      }
    });
    
    return service;
  } catch (error) {
    console.error(`Error fetching service with id ${id}:`, error);
    return null;
  }
}

// Helper function to parse features and tags
export function parseServiceFeatures(featuresString: string): string[] {
  return featuresString.split(',').map(feature => feature.trim());
}

export function parseServiceTags(tagsString: string): string[] {
  return tagsString.split(',').map(tag => tag.trim());
}
