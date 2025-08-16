import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';

export const GET = requireAdmin(async (req: NextRequest, user) => {
  return NextResponse.json({ 
    isAdmin: true,
    user: {
      id: user.id,
      username: user.username,
      email: user.email
    }
  });
});
