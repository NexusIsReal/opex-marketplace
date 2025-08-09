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

const mockProfiles: Profile[] = [
  {
    username: 'nexus',
    displayName: 'Nexus Dev',
    avatarUrl: 'https://api.dicebear.com/7.x/thumbs/svg?seed=Nexus',
    tagline: 'Full‑stack developer • Next.js • UI/UX',
    about:
      'I build robust, scalable web apps with a focus on clean UI and great UX. Specialized in Next.js, TypeScript, and design systems.',
    location: 'Dhaka, BD',
    memberSince: '2022-04-12T00:00:00.000Z',
    lastDelivery: '2025-06-20T00:00:00.000Z',
    languages: [
      { name: 'English', level: 'Fluent' },
      { name: 'Bengali', level: 'Native/Bilingual' },
    ],
    skills: ['Next.js', 'TypeScript', 'Tailwind', 'Node.js', 'Framer Motion', 'UI/UX'],
    rating: 4.9,
    reviews: 128,
    ordersInQueue: 2,
    gigs: [
      {
        id: 'g1',
        title: 'I will build a modern Next.js app with beautiful UI',
        coverUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop',
        priceFrom: 199,
        rating: 4.9,
        reviews: 87,
      },
      {
        id: 'g2',
        title: 'I will design and implement a scalable API',
        coverUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1200&auto=format&fit=crop',
        priceFrom: 149,
        rating: 4.8,
        reviews: 54,
      },
      {
        id: 'g3',
        title: 'I will refactor your React codebase to TypeScript',
        coverUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop',
        priceFrom: 99,
        rating: 5,
        reviews: 12,
      },
    ],
    portfolio: [
      { id: 'p1', title: 'Dashboard UI', imageUrl: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1200&auto=format&fit=crop' },
      { id: 'p2', title: 'Auth Experience', imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop' },
      { id: 'p3', title: 'Marketing Site', imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop' },
    ],
    reviewsList: [
      {
        id: 'r1',
        author: 'Alex J.',
        rating: 5,
        date: '2025-07-01T00:00:00.000Z',
        content: 'Great work, clean code and on time delivery. Highly recommended!'
      },
      {
        id: 'r2',
        author: 'Ripper Design',
        rating: 5,
        date: '2025-06-02T00:00:00.000Z',
        content: 'Superb UI polish and helpful communication throughout.'
      },
      {
        id: 'r3',
        author: 'Peng',
        rating: 4,
        date: '2025-05-18T00:00:00.000Z',
        content: 'Solid delivery and code quality. Will hire again.'
      }
    ],
  },
];

export async function getProfile(username: string): Promise<Profile | null> {
  // Simulate fetch latency
  await new Promise((r) => setTimeout(r, 200));
  return (
    mockProfiles.find((p) => p.username.toLowerCase() === username.toLowerCase()) || null
  );
}

export function formatDate(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
}
