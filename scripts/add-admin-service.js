const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Find the admin user and their profile
    const user = await prisma.user.findUnique({
      where: { username: 'admin' },
      include: { profile: true }
    });

    if (!user) {
      console.log('Admin user not found');
      return;
    }

    if (!user.profile) {
      console.log('Admin user has no profile');
      return;
    }

    console.log('Found admin user with profile ID:', user.profile.id);

    // Create a service for the admin user
    const service = await prisma.service.create({
      data: {
        title: 'Full-Stack Development',
        description: 'Professional full-stack development services using React, Next.js, Node.js and more. I can build complete web applications from scratch or improve your existing codebase.',
        coverUrl: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-1.2.1&auto=format&fit=crop&w=1489&q=80',
        category: 'Development',
        priceFrom: 800,
        priceTo: 3000,
        deliveryDays: 21,
        revisions: 3,
        features: 'Frontend development, Backend development, Database design, API integration, Deployment',
        tags: 'react,nextjs,node,typescript,prisma',
        profileId: user.profile.id
      }
    });

    console.log('Successfully created service for admin user:', service);
  } catch (error) {
    console.error('Error creating service:', error);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
