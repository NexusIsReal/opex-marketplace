import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from './prisma';

export interface JwtPayload {
  id: string;
  email: string;
  username: string;
  role: string;
  iat?: number;
  exp?: number;
}

// Verify JWT token
export async function verifyToken(token: string): Promise<JwtPayload | null> {
  try {
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_production'
    ) as JwtPayload;
    
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

// Middleware to protect API routes
export async function authenticateRequest(
  req: NextRequest,
  handler: (req: NextRequest, user: JwtPayload) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const decoded = await verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }

    // Check if user still exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User no longer exists' },
        { status: 401 }
      );
    }

    // User is authenticated, proceed with the handler
    return handler(req, decoded);
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { error: 'Internal server error during authentication' },
      { status: 500 }
    );
  }
}

// Role-based authorization
export function authorizeRoles(roles: string[]) {
  return async function(
    req: NextRequest,
    handler: (req: NextRequest, user: JwtPayload) => Promise<NextResponse>
  ): Promise<NextResponse> {
    return authenticateRequest(req, async (req, user) => {
      if (!roles.includes(user.role)) {
        return NextResponse.json(
          { error: 'Forbidden - Insufficient permissions' },
          { status: 403 }
        );
      }
      return handler(req, user);
    });
  };
}

// Function that mimics Next.js Auth.js behavior for compatibility with API routes
export async function auth(req?: NextRequest) {
  try {
    let token = null;
    
    // If request is provided, extract token from Authorization header
    if (req) {
      const authHeader = req.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }
    
    // If no token found, return null
    if (!token) {
      return null;
    }
    
    // Verify the token
    const decoded = await verifyToken(token);
    if (!decoded) {
      return null;
    }
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });
    
    if (!user) {
      return null;
    }
    
    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role
      }
    };
  } catch (error) {
    console.error('Error in auth function:', error);
    return null;
  }
}

// Function to extract and verify JWT from request headers
export async function getAuthFromRequest(req: NextRequest) {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.split(' ')[1];
    const decoded = await verifyToken(token);

    if (!decoded) {
      return null;
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return null;
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role
      }
    };
  } catch (error) {
    console.error('Error authenticating request:', error);
    return null;
  }
}

// Function to get authentication in server components using cookies
export async function getServerSession(cookieStore: any) {
  try {
    // Make sure cookieStore is awaited before using it
    const resolvedCookieStore = await cookieStore;
    
    // Get the session token from cookies
    const sessionToken = resolvedCookieStore.get('session-token')?.value;
    
    if (!sessionToken) {
      return null;
    }
    
    // Verify the token
    const decoded = await verifyToken(sessionToken);
    if (!decoded) {
      return null;
    }
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });
    
    if (!user) {
      return null;
    }
    
    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role
      }
    };
  } catch (error) {
    console.error('Error in getServerSession:', error);
    return null;
  }
}
