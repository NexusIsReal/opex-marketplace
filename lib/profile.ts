export type Gig = {
  id: string;
  title: string;
  coverUrl: string;
  priceFrom: number;
  rating: number; // 0-5
  reviews: number;
};

export type Review = {
  id: string;
  author: string;
  avatarUrl?: string;
  rating: number; // 0-5
  date: string; // ISO
  content: string;
};

export type Profile = {
  id: string; // Add id field for service fetching
  username: string;
  displayName: string;
  avatarUrl?: string;
  tagline?: string;
  about?: string;
  location?: string;
  memberSince?: string; // ISO
  lastDelivery?: string; // ISO
  languages?: { name: string; level: 'Basic' | 'Conversational' | 'Fluent' | 'Native/Bilingual' }[];
  skills?: string[];
  rating: number; // 0-5
  reviews: number;
  ordersInQueue?: number;
  gigs: Gig[];
  portfolio?: { id: string; title: string; imageUrl: string }[];
  reviewsList: Review[];
};

// Mock data removed - using real database data only

export async function getProfile(username: string): Promise<Profile | null> {
  try {
    // Import prisma here to avoid circular dependencies
    const { prisma } = await import('./prisma');
    
    // Find the user with their profile
    const user = await prisma.user.findUnique({
      where: { username },
      include: { profile: true, freelancerApplication: true }
    });

    if (!user || user.role !== 'FREELANCER' || !user.profile) {
      return null;
    }

    // Parse skills from JSON string
    const skills = user.profile.skills ? JSON.parse(user.profile.skills) : [];
    
    // Parse languages from JSON string
    const languages = user.profile.languages ? JSON.parse(user.profile.languages) : [];
    
    // Return profile with required fields
    return {
      id: user.profile.id, // Add id field for service fetching
      username: user.username,
      displayName: user.fullName || user.username,
      avatarUrl: user.profile.avatarUrl || undefined,
      tagline: user.profile.tagline || undefined,
      about: user.profile.bio || undefined,
      location: user.profile.location || undefined,
      memberSince: user.createdAt?.toISOString() || undefined,
      languages: languages,
      skills: skills,
      rating: 5, // Default values for required fields
      reviews: 0,
      gigs: [],
      reviewsList: []
    };
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}

export async function getProfileServices(profileId: string) {
  try {
    // Import prisma here to avoid circular dependencies
    const { prisma } = await import('./prisma');
    
    const services = await prisma.service.findMany({
      where: {
        profileId: profileId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return services;
  } catch (error) {
    console.error('Error fetching profile services:', error);
    return [];
  }
}

export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}
