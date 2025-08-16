'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const profileSchema = z.object({
  fullName: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  bio: z.string().optional(),
  avatarUrl: z.string().url({ message: 'Invalid URL' }).optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '',
      bio: '',
      avatarUrl: '',
    },
  });

  // Fetch profile data
  useEffect(() => {
    if (token) {
      fetchProfileData();
    }
  }, [token]);

  const fetchProfileData = async () => {
    try {
      const response = await fetch('/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
        
        // Update form values
        form.reset({
          fullName: data.fullName || '',
          bio: data.profile?.bio || '',
          avatarUrl: data.profile?.avatarUrl || '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const onSubmit = async (values: ProfileFormValues) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const data = await response.json();
        setProfileData(data.user);
      } else {
        console.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-10 pt-32">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Your Profile</h1>
            <Button 
              variant="outline" 
              onClick={logout}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border-red-500/20"
            >
              Logout
            </Button>
          </div>
          
          {profileData ? (
            <div className="bg-black/50 border border-white/10 rounded-xl p-8 shadow-lg">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-white">Full Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your full name"
                            {...field}
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400 font-mono text-xs" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-white">Bio</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us about yourself"
                            {...field}
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400 font-mono text-xs" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="avatarUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-white">Avatar URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/avatar.jpg"
                            {...field}
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400 font-mono text-xs" />
                      </FormItem>
                    )}
                  />
                  
                  <Button
                    type="submit"
                    className="w-full bg-primary text-black hover:opacity-90 transition-opacity disabled:opacity-60"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        <span>Updating profile...</span>
                      </div>
                    ) : (
                      "Save Profile"
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
