'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Plus, Loader2, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import ServiceCard from '@/components/ServiceCard';

interface Service {
  id: string;
  title: string;
  description: string;
  coverUrl: string | null;
  category: string;
  priceFrom: number;
  priceTo: number | null;
  deliveryDays: number;
  profile: {
    user: {
      username: string;
      displayName: string;
    }
  }
}

export default function ServicesPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push('/auth/login?redirect=/account/services');
    }
  }, [user, router]);
  
  // Fetch user's services
  useEffect(() => {
    const fetchServices = async () => {
      if (!user || !token) return;
      
      try {
        setIsLoading(true);
        
        const response = await fetch(`/api/services?username=${user.username}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }
        
        const data = await response.json();
        setServices(data.services);
      } catch (error) {
        console.error('Error fetching services:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your services',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchServices();
  }, [user, token, toast]);
  
  // Handle service deletion
  const handleDelete = async () => {
    if (!deleteId || !token) return;
    
    try {
      setIsDeleting(true);
      
      const response = await fetch(`/api/services/${deleteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete service');
      }
      
      // Remove the deleted service from state
      setServices(services.filter(service => service.id !== deleteId));
      
      toast({
        title: 'Service deleted',
        description: 'Your service has been deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting service:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete service',
        variant: 'destructive'
      });
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };
  
  if (!user) {
    return null;
  }
  
  return (
    <div className="container max-w-6xl py-8 sm:py-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">My Services</h1>
          <p className="text-gray-400">Manage your services and track their performance</p>
        </div>
        
        <Link href="/account/services/create">
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            Create New Service
          </Button>
        </Link>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
        </div>
      ) : services.length === 0 ? (
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">No services yet</h3>
              <p className="text-gray-400 max-w-md">
                Create your first service to start offering your skills to potential clients
              </p>
            </div>
            
            <Link href="/account/services/create">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Service
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service.id} className="relative group">
              <ServiceCard
                id={service.id}
                title={service.title}
                description={service.description}
                coverUrl={service.coverUrl}
                category={service.category}
                priceFrom={service.priceFrom}
                priceTo={service.priceTo}
                deliveryDays={service.deliveryDays}
                username={service.profile.user.username}
                displayName={service.profile.user.displayName}
              />
              
              {/* Action buttons */}
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-gray-900/80 border-gray-700 hover:bg-gray-800"
                  onClick={() => router.push(`/account/services/edit/${service.id}`)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-gray-900/80 border-gray-700 hover:bg-red-900/80"
                  onClick={() => setDeleteId(service.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="bg-gray-900 border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your service.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
