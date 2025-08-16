"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Client-side admin check
export async function isAdmin(): Promise<boolean> {
  try {
    const response = await fetch('/api/admin/verify', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) return false;
    
    const data = await response.json();
    return data.isAdmin === true;
  } catch (error) {
    console.error('Admin verification failed:', error);
    return false;
  }
}

// Admin route protection for client components
export function withAdminProtection<P extends object>(Component: React.ComponentType<P>) {
  return function AdminProtectedComponent(props: P) {
    const [loading, setLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const router = useRouter();
    
    useEffect(() => {
      async function checkAdminStatus() {
        const adminStatus = await isAdmin();
        
        if (!adminStatus) {
          router.push('/auth/login?redirect=/admin');
          return;
        }
        
        setIsAuthorized(true);
        setLoading(false);
      }
      
      checkAdminStatus();
    }, [router]);
    
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/10 border-t-purple-500"></div>
        </div>
      );
    }
    
    if (!isAuthorized) {
      return null; // Will redirect in the useEffect
    }
    
    return <Component {...props} />;
  };
}
