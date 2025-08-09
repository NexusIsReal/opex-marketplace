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
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

const registerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  // Keep UX calm and professional; no extra page animations

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
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  function onSubmit(values: z.infer<typeof registerSchema>) {
    setIsLoading(true);
    // Simulate registration - replace with actual registration logic
    setTimeout(() => {
      console.log(values);
      setIsLoading(false);
      router.push('/auth/login');
    }, 1500);
  }

  return (
    <div className="w-full max-w-md">
      <motion.div layoutId="auth-card" className="relative bg-black/50 border border-white/10 rounded-xl p-8 shadow-lg">
        {isLoading && <div className="anim-loading-bar" />}
        <motion.div className="relative" variants={container} initial="hidden" animate="show">
          <motion.div className="mb-8 text-center" variants={item}>
            <h1 className="text-2xl font-semibold tracking-tight text-white mb-1">Create account</h1>
            <p className="text-sm text-white/60">Start your journey. It’s quick and easy.</p>
          </motion.div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <motion.div variants={item}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-white">Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Your name"
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-white">Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="you@example.com"
                          {...field}
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
                        />
                      </div>
                    </FormControl>
                    <p className="text-xs text-white/40">Use your work email if applicable.</p>
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
                    <p className="text-xs text-white/40">At least 6 characters.</p>
                    <FormMessage className="text-red-400 font-mono text-xs" />
                  </FormItem>
                )}
              />
              </motion.div>
              <motion.div variants={item}>
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-white">Confirm password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirm ? 'text' : 'password'}
                          placeholder="••••••••"
                          {...field}
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm((v) => !v)}
                          aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                          aria-pressed={showConfirm}
                          className="absolute inset-y-0 right-2 my-auto h-8 px-2 rounded-md text-white/70 hover:text-white/90 focus:outline-none focus:ring-2 focus:ring-primary/30"
                        >
                          {showConfirm ? 'Hide' : 'Show'}
                        </button>
                      </div>
                    </FormControl>
                    <p className="text-xs text-white/40">Must match your password.</p>
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
                    <span>Creating account...</span>
                  </div>
                ) : (
                  "Create account"
                )}
              </Button>
              </motion.div>
            </form>
          </Form>

          <motion.div className="mt-6 text-center border-t border-white/10 pt-4" variants={item}>
            <p className="text-sm text-white/60">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-white hover:text-white/90 underline underline-offset-4">
                Sign in
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
