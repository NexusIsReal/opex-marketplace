'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';
// Removed LiquidButton for a more classic professional button
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

const loginSchema = z.object({
  usernameOrEmail: z.string().min(1, { message: 'Username or email is required' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  
  // Animation variants
  const container: Variants = {
    hidden: { opacity: 0, y: 8 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.06, delayChildren: 0.04 }
    }
  } as const;
  const item: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.24, ease: [0.22, 1, 0.36, 1] } }
  } as const;

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      usernameOrEmail: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      // Login successful - store token in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      console.log('Login successful:', data);
      router.push('/');
    } catch (error) {
      console.error('Login error:', error);
      // Handle error (you could add a toast notification here)
    } finally {
      setIsLoading(false);
    }
  }
  
  // No extra page animations; keep it calm and professional

  return (
    <div className="w-full max-w-md">
      <motion.div layoutId="auth-card" className="relative bg-black/50 border border-white/10 rounded-xl p-8 shadow-lg">
        {isLoading && <div className="anim-loading-bar" />}
        <motion.div className="relative" variants={container} initial="hidden" animate="show">
          <motion.div className="mb-8 text-center" variants={item}>
            <h1 className="text-2xl font-semibold tracking-tight text-white mb-1">Sign in</h1>
            <p className="text-sm text-white/60">Welcome back. Please enter your details.</p>
          </motion.div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <motion.div variants={item}>
              <FormField
                control={form.control}
                name="usernameOrEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-white">Username or Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="username or email"
                          {...field}
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400 font-mono text-xs" />
                  </FormItem>
                )}
              />
              </motion.div>
              <motion.div variants={item}>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-white">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          {...field}
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          aria-pressed={showPassword}
                          className="absolute inset-y-0 right-2 my-auto h-8 px-2 rounded-md text-white/70 hover:text-white/90 focus:outline-none focus:ring-2 focus:ring-primary/30"
                        >
                          {showPassword ? 'Hide' : 'Show'}
                        </button>
                      </div>
                    </FormControl>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-white/40">At least 6 characters.</p>
                      <Link href="#" className="text-xs text-white/70 hover:text-white/90">Forgot password?</Link>
                    </div>
                    <FormMessage className="text-red-400 font-mono text-xs" />
                  </FormItem>
                )}
              />
              </motion.div>
              <motion.div variants={item}>
              <Button
                type="submit"
                className="w-full bg-primary text-black hover:opacity-90 transition-opacity disabled:opacity-60"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Sign in"
                )}
              </Button>
              </motion.div>
            </form>
          </Form>

          <motion.div className="mt-6 text-center border-t border-white/10 pt-4" variants={item}>
            <p className="text-sm text-white/60">
              No account?{' '}
              <Link href="/auth/register" className="text-white hover:text-white/90 underline underline-offset-4">
                Create one
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
