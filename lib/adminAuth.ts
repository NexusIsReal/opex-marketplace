import { NextRequest, NextResponse } from 'next/server';
import { JwtPayload, authenticateRequest } from './auth';

// Admin-only middleware
export function requireAdmin(
  handler: (req: NextRequest, user: JwtPayload) => Promise<NextResponse>
) {
  return async function(req: NextRequest): Promise<NextResponse> {
    return authenticateRequest(req, async (req, user) => {
      if (user.role !== 'ADMIN') {
        return NextResponse.json(
          { error: 'Forbidden - Admin access required' },
          { status: 403 }
        );
      }
      return handler(req, user);
    });
  };
}

// Note: Client-side admin check has been moved to adminAuthClient.tsx

// Note: Client-side admin protection has been moved to a separate file
// See: lib/adminAuthClient.tsx

