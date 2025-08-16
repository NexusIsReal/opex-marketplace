'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, UserPlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
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
import { useToast } from '@/hooks/use-toast';

// Schema for email update
const emailSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(1, { message: 'Password is required to confirm changes' }),
});

// Schema for password update
const passwordSchema = z.object({
  currentPassword: z.string().min(1, { message: 'Current password is required' }),
  newPassword: z.string().min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least one special character' }),
  confirmPassword: z.string().min(1, { message: 'Please confirm your password' }),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type EmailFormValues = z.infer<typeof emailSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function AccountPage() {
  const { user, token, logout } = useAuth();
  const { toast } = useToast();
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  // Email form
  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: user?.email || '',
      password: '',
    },
  });

  // Password form
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onEmailSubmit = async (values: EmailFormValues) => {
    setIsEmailLoading(true);
    try {
      const response = await fetch('/api/account', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'updateEmail',
          email: values.email,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Your email has been updated. Please log in again with your new email.',
          variant: 'default',
        });
        
        // Clear password field
        emailForm.reset({
          email: data.user.email,
          password: '',
        });
        
        // Force logout after 2 seconds to refresh token
        setTimeout(() => {
          logout();
        }, 2000);
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to update email',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsEmailLoading(false);
    }
  };

  const onPasswordSubmit = async (values: PasswordFormValues) => {
    setIsPasswordLoading(true);
    try {
      const response = await fetch('/api/account', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'updatePassword',
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Your password has been updated. Please log in again with your new password.',
          variant: 'default',
        });
        
        // Reset form
        passwordForm.reset({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        
        // Force logout after 2 seconds
        setTimeout(() => {
          logout();
        }, 2000);
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to update password',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsPasswordLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      {/* Subtle background */}
      <div className="fixed inset-0 bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_rgba(147,51,234,0.05),_transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(255,255,255,0.02),_transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,_rgba(147,51,234,0.03),_transparent_70%)]"></div>
      </div>

      <div className="relative z-10 container mx-auto py-10 pt-32">
        <div className="max-w-4xl mx-auto">
          {/* Clean header */}
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Account Settings</h1>
              <p className="text-gray-400">Manage your profile and security preferences</p>
            </div>
            <Button 
              variant="outline" 
              onClick={logout}
              className="bg-red-950/30 hover:bg-red-950/50 text-red-400 border-red-500/30 hover:border-red-500/50 transition-all duration-200"
            >
              Sign Out
            </Button>
          </div>

          {/* Clean user info */}
          {user && (
            <div className="mb-10 p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <h2 className="text-xl font-semibold mb-6 text-white">Profile Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500 uppercase tracking-wide">Username</p>
                  <p className="text-lg text-white font-medium">{user.username}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500 uppercase tracking-wide">Email</p>
                  <p className="text-lg text-white font-medium break-all">{user.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500 uppercase tracking-wide">Full Name</p>
                  <p className="text-lg text-white font-medium">{user.fullName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500 uppercase tracking-wide">Account Type</p>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${user.role === 'admin' ? 'bg-purple-500' : 'bg-white'}`}></div>
                    <p className="text-lg text-white font-medium capitalize">{user.role}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Access Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <Link href="/account/become-freelancer">
              <Card className="border-white/10 bg-white/5 backdrop-blur-sm rounded-2xl hover:bg-white/10 transition-all duration-200 h-full cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#9945FF]/20">
                      <UserPlus className="h-6 w-6 text-[#9945FF]" />
                    </div>
                    <CardTitle className="text-xl text-white">Become a Freelancer</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">
                    Apply to become a freelancer on our platform. Submit your skills and portfolio for review.
                  </p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/account/messages">
              <Card className="border-white/10 bg-white/5 backdrop-blur-sm rounded-2xl hover:bg-white/10 transition-all duration-200 h-full cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#9945FF]/20">
                      <MessageSquare className="h-6 w-6 text-[#9945FF]" />
                    </div>
                    <CardTitle className="text-xl text-white">Messages</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">
                    View and respond to messages from admins and other users on the platform.
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Clean tabs */}
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 p-1 bg-white/5 rounded-xl border border-white/10">
              <TabsTrigger 
                value="email" 
                className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-gray-400 rounded-lg transition-all duration-200"
              >
                Change Email
              </TabsTrigger>
              <TabsTrigger 
                value="password"
                className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-gray-400 rounded-lg transition-all duration-200"
              >
                Change Password
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="email">
              <Card className="border-white/10 bg-white/5 backdrop-blur-sm rounded-2xl">
                <CardHeader className="pb-6">
                  <CardTitle className="text-2xl text-white">Email Settings</CardTitle>
                  <CardDescription className="text-gray-400 text-base">
                    Update your email address. You'll need to confirm with your current password.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...emailForm}>
                    <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-6">
                      <FormField
                        control={emailForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white font-medium">Email Address</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="your.email@example.com" 
                                {...field}
                                className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all duration-200 h-12 rounded-lg"
                              />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={emailForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white font-medium">Current Password</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="Enter your current password" 
                                {...field}
                                className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all duration-200 h-12 rounded-lg"
                              />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-all duration-200 border-0"
                        disabled={isEmailLoading}
                      >
                        {isEmailLoading ? (
                          <div className="flex items-center gap-3">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            <span>Updating...</span>
                          </div>
                        ) : (
                          "Update Email"
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="password">
              <Card className="border-white/10 bg-white/5 backdrop-blur-sm rounded-2xl">
                <CardHeader className="pb-6">
                  <CardTitle className="text-2xl text-white">Password Settings</CardTitle>
                  <CardDescription className="text-gray-400 text-base">
                    Change your password. Enter your current password to confirm.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...passwordForm}>
                    <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                      <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white font-medium">Current Password</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="Enter your current password" 
                                {...field}
                                className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all duration-200 h-12 rounded-lg"
                              />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white font-medium">New Password</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="Enter your new password" 
                                {...field}
                                className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all duration-200 h-12 rounded-lg"
                              />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white font-medium">Confirm New Password</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="Confirm your new password" 
                                {...field}
                                className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all duration-200 h-12 rounded-lg"
                              />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-all duration-200 border-0"
                        disabled={isPasswordLoading}
                      >
                        {isPasswordLoading ? (
                          <div className="flex items-center gap-3">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            <span>Updating...</span>
                          </div>
                        ) : (
                          "Update Password"
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
}