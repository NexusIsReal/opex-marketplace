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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, User, Award, ExternalLink, Briefcase, Plus, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

const profileSchema = z.object({
  tagline: z.string().min(10, { message: 'Tagline must be at least 10 characters' }).max(100, { message: 'Tagline must be less than 100 characters' }),
  bio: z.string().min(50, { message: 'Bio must be at least 50 characters' }).max(1000, { message: 'Bio must be less than 1000 characters' }),
  location: z.string().min(2, { message: 'Location must be at least 2 characters' }).max(100, { message: 'Location must be less than 100 characters' }),
  avatarUrl: z.string().url({ message: 'Invalid URL' }).optional().or(z.literal('')),
  skills: z.array(z.string()).min(1, { message: 'Add at least one skill' }),
  languages: z.array(z.object({
    name: z.string(),
    level: z.enum(['Basic', 'Conversational', 'Fluent', 'Native/Bilingual'])
  })).min(1, { message: 'Add at least one language' }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfileSetupPage() {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [currentSkill, setCurrentSkill] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState('');
  const [currentLanguageLevel, setCurrentLanguageLevel] = useState<'Basic' | 'Conversational' | 'Fluent' | 'Native/Bilingual'>('Fluent');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      tagline: '',
      bio: '',
      location: '',
      avatarUrl: '',
      skills: [],
      languages: [],
    },
  });

  // Fetch profile data
  useEffect(() => {
    if (token) {
      fetchProfileData();
      checkFreelancerStatus();
    }
  }, [token]);

  const checkFreelancerStatus = async () => {
    try {
      const response = await fetch('/api/freelancer/application', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        // If application is not approved, redirect to the application page
        if (data.application.status !== 'APPROVED') {
          router.push('/account/become-freelancer');
        }
      } else if (response.status === 404) {
        // No application found, redirect to application page
        router.push('/account/become-freelancer');
      }
    } catch (error) {
      console.error('Error checking freelancer status:', error);
      router.push('/account/become-freelancer');
    }
  };

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
        
        // Update form values if profile exists
        if (data.profile) {
          const skills = data.profile.skills ? 
            (typeof data.profile.skills === 'string' ? 
              JSON.parse(data.profile.skills) : 
              data.profile.skills) : 
            [];
            
          const languages = data.profile.languages ? 
            (typeof data.profile.languages === 'string' ? 
              JSON.parse(data.profile.languages) : 
              data.profile.languages) : 
            [];
            
          form.reset({
            tagline: data.profile.tagline || '',
            bio: data.profile.bio || '',
            location: data.profile.location || '',
            avatarUrl: data.profile.avatarUrl || '',
            skills: skills,
            languages: languages,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const addSkill = () => {
    if (currentSkill.trim() && !form.getValues().skills.includes(currentSkill.trim())) {
      const currentSkills = form.getValues().skills;
      form.setValue('skills', [...currentSkills, currentSkill.trim()]);
      setCurrentSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const currentSkills = form.getValues().skills;
    form.setValue('skills', currentSkills.filter(skill => skill !== skillToRemove));
  };

  const addLanguage = () => {
    if (currentLanguage.trim()) {
      const currentLanguages = form.getValues().languages;
      const languageExists = currentLanguages.some(lang => lang.name.toLowerCase() === currentLanguage.trim().toLowerCase());
      
      if (!languageExists) {
        form.setValue('languages', [...currentLanguages, { 
          name: currentLanguage.trim(), 
          level: currentLanguageLevel 
        }]);
        setCurrentLanguage('');
      }
    }
  };

  const removeLanguage = (languageName: string) => {
    const currentLanguages = form.getValues().languages;
    form.setValue('languages', currentLanguages.filter(lang => lang.name !== languageName));
  };

  const onSubmit = async (values: ProfileFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...values,
          skills: JSON.stringify(values.skills),
          languages: JSON.stringify(values.languages)
        }),
      });

      if (response.ok) {
        toast({
          title: "Profile Updated",
          description: "Your freelancer profile has been set up successfully!",
        });
        
        // Redirect to the profile page
        setTimeout(() => {
          router.push(`/profile/${user?.username}`);
        }, 1500);
      } else {
        toast({
          title: "Error",
          description: "Failed to update profile. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pt-32 px-4">
        <div className="max-w-4xl mx-auto space-y-8 pb-16">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-4">
              <User className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Complete Your Freelancer Profile
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Congratulations on being approved as a freelancer! Let's set up your professional profile to attract clients.
            </p>
          </div>

          <Alert className="bg-gradient-to-r from-emerald-900/20 to-green-900/20 border border-emerald-500/30 backdrop-blur-sm">
            <CheckCircle className="h-5 w-5 text-emerald-400" />
            <AlertTitle className="text-emerald-300 font-semibold">Your application has been approved!</AlertTitle>
            <AlertDescription className="text-emerald-200">
              Complete your profile to start receiving client requests and showcase your skills.
            </AlertDescription>
          </Alert>

          <Card className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 border border-gray-700/50 shadow-2xl backdrop-blur-sm">
            <CardHeader className="space-y-2 pb-8">
              <CardTitle className="text-2xl text-white font-semibold flex items-center gap-2">
                <Briefcase className="h-6 w-6 text-purple-400" />
                Freelancer Profile Details
              </CardTitle>
              <CardDescription className="text-gray-400">
                This information will be displayed on your public profile
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/* Tagline */}
                  <FormField
                    control={form.control}
                    name="tagline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-medium">Professional Tagline *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Full-stack developer • Next.js • UI/UX"
                            {...field}
                            className="bg-gray-800/50 border-gray-600 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent h-12 text-base"
                          />
                        </FormControl>
                        <p className="text-gray-500 text-sm">A short description that appears under your name (max 100 characters)</p>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  
                  {/* Bio */}
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-medium">Professional Bio *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="I build robust, scalable web apps with a focus on clean UI and great UX. Specialized in Next.js, TypeScript, and design systems."
                            {...field}
                            className="bg-gray-800/50 border-gray-600 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[150px] text-base resize-none"
                          />
                        </FormControl>
                        <p className="text-gray-500 text-sm">{field.value?.length || 0}/1000 characters</p>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  
                  {/* Location */}
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-medium">Location *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="City, Country"
                            {...field}
                            className="bg-gray-800/50 border-gray-600 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent h-12 text-base"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  
                  {/* Avatar URL */}
                  <FormField
                    control={form.control}
                    name="avatarUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-medium">Avatar URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/avatar.jpg"
                            {...field}
                            className="bg-gray-800/50 border-gray-600 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent h-12 text-base"
                          />
                        </FormControl>
                        <p className="text-gray-500 text-sm">Link to your professional profile picture</p>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  
                  {/* Skills */}
                  <FormField
                    control={form.control}
                    name="skills"
                    render={() => (
                      <FormItem>
                        <FormLabel className="text-white font-medium">Skills *</FormLabel>
                        <div className="flex gap-3">
                          <Input
                            value={currentSkill}
                            onChange={(e) => setCurrentSkill(e.target.value)}
                            className="bg-gray-800/50 border-gray-600 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent h-12 text-base"
                            placeholder="Add a skill (e.g., React, Node.js, Python)"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addSkill();
                              }
                            }}
                          />
                          <Button 
                            type="button" 
                            onClick={addSkill}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 h-12 px-6 font-medium transition-all duration-200"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {form.getValues().skills.map((skill, index) => (
                            <Badge 
                              key={index} 
                              className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 text-purple-100 cursor-pointer hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-200 px-3 py-1.5 text-sm font-medium"
                              onClick={() => removeSkill(skill)}
                            >
                              {skill}
                              <X className="h-3 w-3 ml-2" />
                            </Badge>
                          ))}
                        </div>
                        {form.getValues().skills.length === 0 && (
                          <p className="text-gray-500 text-sm">Add your technical skills to help clients find you</p>
                        )}
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  
                  {/* Languages */}
                  <FormField
                    control={form.control}
                    name="languages"
                    render={() => (
                      <FormItem>
                        <FormLabel className="text-white font-medium">Languages *</FormLabel>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <Input
                            value={currentLanguage}
                            onChange={(e) => setCurrentLanguage(e.target.value)}
                            className="bg-gray-800/50 border-gray-600 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent h-12 text-base col-span-1"
                            placeholder="Language name"
                          />
                          <select 
                            value={currentLanguageLevel}
                            onChange={(e) => setCurrentLanguageLevel(e.target.value as any)}
                            className="bg-gray-800/50 border-gray-600 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent h-12 text-base rounded-md col-span-1"
                          >
                            <option value="Basic">Basic</option>
                            <option value="Conversational">Conversational</option>
                            <option value="Fluent">Fluent</option>
                            <option value="Native/Bilingual">Native/Bilingual</option>
                          </select>
                          <Button 
                            type="button" 
                            onClick={addLanguage}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 h-12 px-6 font-medium transition-all duration-200 col-span-1"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add
                          </Button>
                        </div>
                        <div className="space-y-2 mt-4">
                          {form.getValues().languages.map((lang, index) => (
                            <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-gray-800/30 border border-gray-700/50">
                              <span className="text-gray-200 text-sm sm:text-base truncate">{lang.name}</span>
                              <div className="flex items-center gap-2">
                                <Badge variant={lang.level === 'Native/Bilingual' ? 'outline' : 'secondary'}>
                                  {lang.level}
                                </Badge>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeLanguage(lang.name)}
                                  className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700/50"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                        {form.getValues().languages.length === 0 && (
                          <p className="text-gray-500 text-sm">Add languages you speak and your proficiency level</p>
                        )}
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  
                  <CardFooter className="pt-4 px-0">
                    <Button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-12 text-base font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          Saving Profile...
                        </div>
                      ) : (
                        'Complete Profile Setup'
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
