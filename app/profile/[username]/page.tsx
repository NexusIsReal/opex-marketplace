import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { Star, MapPin, Calendar, Clock, Award, Briefcase, MessageCircle, Heart, Share2, ExternalLink, ChevronRight, Zap, Shield, Trophy, Users, Check, Plus, Edit, Settings, Package } from 'lucide-react';
import { Badge as UIBadge } from '@/components/ui/badge';
import ServiceCard from '@/components/ServiceCard';
import { getProfile, formatDate, getProfileServices } from '@/lib/profile';
import { getServerSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Define types locally since they're not available in this context
interface User {
  id: string;
  email: string;
  username: string;
  role: string;
}

interface Service {
  id: string;
  title: string;
  description: string;
  coverUrl: string | null;
  category: string;
  priceFrom: number;
  priceTo: number | null;
  deliveryDays: number;
  createdAt: Date;
  updatedAt: Date;
}

type StarSize = 'sm' | 'lg';
function Stars({ rating, size = 'sm', showNumber = false }: { rating: number; size?: StarSize; showNumber?: boolean }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  const sizeClass = size === 'lg' ? 'w-4 h-4 sm:w-5 sm:h-5' : 'w-3 h-3 sm:w-4 sm:h-4';
  
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center text-yellow-400">
        {Array.from({ length: full }).map((_, i) => (
          <Star key={`f${i}`} className={`${sizeClass} fill-current`} />
        ))}
        {half && (
          <div className="relative">
            <Star className={`${sizeClass} text-gray-600 fill-current`} />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className={`${sizeClass} text-yellow-400 fill-current`} />
            </div>
          </div>
        )}
        {Array.from({ length: empty }).map((_, i) => (
          <Star key={`e${i}`} className={`${sizeClass} text-gray-600 fill-current`} />
        ))}
      </div>
      {showNumber ? <span className="text-white/90 font-medium ml-1 sm:ml-2 text-sm sm:text-base">{rating.toFixed(1)}</span> : null}
    </div>
  );
}

type IconType = React.ComponentType<{ className?: string }>;
function StatCard({ icon: Icon, label, value, accent = false }: { icon: IconType; label: string; value: string | number; accent?: boolean }) {
  return (
    <div className={`group rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:scale-[1.02] ${
      accent 
        ? 'bg-gradient-to-br from-gray-600/20 to-gray-700/30 border border-gray-400/30' 
        : 'bg-gray-900/50 border border-gray-700/50'
    } backdrop-blur-sm hover:shadow-xl`}>
      <div className="flex items-center gap-3 sm:gap-4">
        <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${
          accent 
            ? 'bg-gradient-to-br from-gray-500 to-gray-600' 
            : 'bg-gray-800/50'
        }`}>
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
        <div>
          <div className="text-xs sm:text-sm text-gray-400 mb-1">{label}</div>
          <div className="text-lg sm:text-xl font-bold text-white">{value}</div>
        </div>
      </div>
    </div>
  );
}

type BadgeVariant = 'default' | 'success' | 'warning' | 'accent';
function ProfileBadge({ children, variant = 'default' }: { children: React.ReactNode; variant?: BadgeVariant }) {
  const variants: Record<BadgeVariant, string> = {
    default: 'bg-gray-800/50 border-gray-600/50 text-gray-300',
    success: 'bg-emerald-600/20 border-emerald-500/40 text-emerald-300',
    warning: 'bg-amber-600/20 border-amber-500/40 text-amber-300',
    accent: 'bg-gray-600/20 border-gray-500/40 text-gray-200',
  };

  return <span className={`inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium border ${variants[variant]} backdrop-blur-sm`}>{children}</span>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const profile = await getProfile(username);
  
  if (!profile) return notFound();

  return {
    title: `${profile.displayName} (@${profile.username}) - Professional Profile`,
    description: profile.tagline || `View ${profile.displayName}'s professional profile and services`,
  };
}

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const profile = await getProfile(username);
  
  if (!profile) return notFound();
  
  // Get current user from session using our server-side auth function
  const cookieStore = cookies();
  const session = await getServerSession(cookieStore);
  const currentUser = session?.user as User | undefined;

  // Fetch real services from the database for this profile
  let services: Service[] = [];
  
  if (profile.id) {
    // Use the dedicated function to fetch services
    services = await getProfileServices(profile.id);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 relative overflow-hidden pt-16 pb-16 sm:pt-24 md:pt-28">
      {/* Background matching homepage */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Base gradient similar to homepage */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-black to-gray-900" />
        
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }} />
        
        {/* Silver glow elements matching homepage theme */}
        <div className="absolute top-20 right-20 w-48 h-48 sm:w-96 sm:h-96 bg-gray-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-48 h-48 sm:w-96 sm:h-96 bg-gray-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 sm:w-80 sm:h-80 bg-gray-300/5 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Profile Header - Simplified for mobile */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Profile Card */}
        <div className="relative rounded-2xl sm:rounded-3xl border border-gray-700/30 bg-black/70 backdrop-blur-xl shadow-2xl overflow-hidden mb-8 sm:mb-12 sm:mt-6 md:mt-10">
          {/* Glass effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800/10 to-transparent" />
          
          <div className="relative p-5 sm:p-8">
            {/* Avatar & Basic Info - Horizontal layout on desktop */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
              {/* Avatar with online indicator */}
              <div className="relative flex-shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl sm:rounded-3xl overflow-hidden border-3 sm:border-4 border-gray-500/20 shadow-2xl">
                  {profile.avatarUrl ? (
                    profile.avatarUrl.toLowerCase().includes('.svg') || profile.avatarUrl.includes('/svg') ? (
                      <img src={profile.avatarUrl} alt={profile.displayName} className="w-full h-full object-cover" />
                    ) : (
                      <Image src={profile.avatarUrl} alt={profile.displayName} fill className="object-cover" />
                    )
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-400 text-2xl sm:text-3xl font-bold">
                      {profile.displayName[0]}
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-emerald-500 rounded-full border-3 sm:border-4 border-black/80 flex items-center justify-center">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full animate-pulse" />
                </div>
              </div>
              
              {/* Name and info - Takes full width on desktop */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                    {profile.displayName}
                  </h1>
                  <ProfileBadge>
                    <Check className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                    <span className="hidden sm:inline">Verified Pro</span>
                    <span className="sm:hidden">Pro</span>
                  </ProfileBadge>
                </div>
                
                <p className="text-gray-400 text-base sm:text-lg mb-2">@{profile.username}</p>
                
                {profile.tagline ? (
                  <p className="text-gray-200 text-base sm:text-lg font-medium mb-4 max-w-2xl">{profile.tagline}</p>
                ) : null}
                
                {/* Stats row */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-6 text-sm mb-5">
                  <div className="flex items-center gap-2">
                    <Stars rating={profile.rating} size="lg" showNumber />
                    <span className="text-gray-400">({profile.reviews} reviews)</span>
                  </div>
                  {profile.location && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="truncate">{profile.location}</span>
                    </div>
                  )}
                  <div className="hidden sm:flex items-center gap-2 text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>Usually responds within a few hours</span>
                  </div>
                </div>
                
                {/* Action Buttons - Horizontal on desktop */}
                <div className="grid grid-cols-2 sm:flex sm:items-center sm:justify-between gap-3 mt-4">
                  <div className="flex flex-col sm:flex-row gap-3 col-span-2">
                    <button className="px-4 py-3 sm:px-5 sm:py-2.5 rounded-xl border transition-all duration-300 flex items-center justify-center gap-2 bg-transparent border-gray-500/30 text-gray-300 hover:bg-gray-600/20 hover:border-gray-400/50 text-sm col-span-1">
                      <Heart className="w-4 h-4" />
                      <span>Follow</span>
                    </button>
                    
                    <button className="px-4 py-3 sm:px-5 sm:py-2.5 rounded-xl bg-gray-900/30 border border-gray-500/20 text-white hover:bg-gray-600/20 transition-all duration-300 flex items-center justify-center gap-2 text-sm col-span-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>Contact</span>
                    </button>
                  </div>
                  
                  <button className="px-4 py-3 sm:px-8 sm:py-2.5 rounded-xl bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold hover:from-gray-500 hover:to-gray-600 transition-all duration-300 shadow-lg hover:shadow-gray-500/25 flex items-center justify-center gap-2 text-sm col-span-2">
                    <Zap className="w-4 h-4" />
                    <span>Hire Now</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-8 sm:pb-16">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8 sm:mb-12">
          <StatCard icon={Trophy} label="Rating" value={profile.rating ? `${profile.rating.toFixed(1)}/5` : 'N/A'} accent />
          <StatCard icon={Users} label="Reviews" value={profile.reviews ? `${profile.reviews}+` : '0'} />
          <StatCard icon={Award} label="Orders in Queue" value={profile.ordersInQueue ?? 0} />
          <StatCard icon={Shield} label="Member Since" value={profile.memberSince ? formatDate(profile.memberSince) : 'N/A'} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* About Section */}
            {profile.about && (
              <div className="rounded-2xl sm:rounded-3xl border border-gray-800/80 bg-black/50 backdrop-blur-xl overflow-hidden">
                <div className="p-4 sm:p-6 md:p-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                    About Me
                  </h2>
                  <p className="text-gray-300 leading-relaxed text-base sm:text-lg mb-6 sm:mb-8">{profile.about}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2 sm:space-y-3">
                      {profile.memberSince && (
                        <div className="flex items-center gap-2 sm:gap-3 text-gray-400 text-sm sm:text-base">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>Member since {formatDate(profile.memberSince)}</span>
                        </div>
                      )}
                      {profile.lastDelivery && (
                        <div className="flex items-center gap-2 sm:gap-3 text-gray-400 text-sm sm:text-base">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>Last delivery: {formatDate(profile.lastDelivery)}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center gap-2 sm:gap-3 text-gray-400 text-sm sm:text-base">
                        <Award className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Top Rated Seller</span>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 text-gray-400 text-sm sm:text-base">
                        <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>99% Order Completion</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Services section removed - using real services data from database */}

            {/* Reviews section removed - will be implemented with real data in the future */}
          </div>

          {/* Sidebar */}
          <div className="space-y-6 sm:space-y-8">
            {/* Skills */}
            {profile.skills?.length ? (
              <div className="rounded-2xl sm:rounded-3xl border border-gray-800/80 bg-black/50 backdrop-blur-xl p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-white mb-4 sm:mb-6 flex items-center gap-2">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  Skills & Expertise
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <ProfileBadge key={skill}>{skill}</ProfileBadge>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Languages */}
            {profile.languages?.length ? (
              <div className="rounded-2xl sm:rounded-3xl border border-gray-800/80 bg-black/50 backdrop-blur-xl p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-white mb-4 sm:mb-6 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  Languages
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {profile.languages.map((l) => (
                    <div key={l.name} className="flex items-center justify-between p-3 rounded-xl bg-gray-900/30 border border-gray-800/50">
                      <span className="text-gray-200 text-sm sm:text-base truncate">{l.name}</span>
                      <ProfileBadge>
                        {l.level}
                      </ProfileBadge>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Portfolio section removed - will be implemented with real data in the future */}
          </div>
        </div>
      </div>
      
      {/* Services Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12">
        <div className="rounded-2xl sm:rounded-3xl border border-gray-800/80 bg-black/50 backdrop-blur-xl overflow-hidden">
          <div className="p-4 sm:p-6 md:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Package className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                Services
              </h2>
              
              {/* Only show these buttons if the profile belongs to the current user */}
              {currentUser && currentUser.username === username && (
                <div className="flex flex-wrap gap-3">
                  <Link 
                    href="/account/services/create" 
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 text-sm font-medium"
                  >
                    <Plus size={16} />
                    Add Service
                  </Link>
                  <Link 
                    href="/account/services" 
                    className="flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-xl hover:bg-white/20 transition-all duration-200 text-sm font-medium"
                  >
                    <Settings size={16} />
                    Manage All Services
                  </Link>
                </div>
              )}
            </div>
            
            {/* Services grid */}
            {services.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service: Service) => (
                  <div key={service.id} className="group relative bg-gray-900/30 border border-gray-800/50 rounded-xl sm:rounded-2xl overflow-hidden hover:bg-gray-800/50 hover:shadow-lg transition-all duration-300">
                    {/* Service card */}
                    <ServiceCard
                      key={service.id}
                      id={service.id}
                      title={service.title}
                      description={service.description}
                      coverUrl={service.coverUrl}
                      category={service.category}
                      priceFrom={service.priceFrom}
                      priceTo={service.priceTo}
                      deliveryDays={service.deliveryDays}
                      username={username}
                      displayName={profile.displayName || username}
                      avatarUrl={profile.avatarUrl}
                    />
                    
                    {/* Action buttons - only visible to profile owner */}
                    {currentUser && currentUser.username === username && (
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Link href={`/account/services/edit/${service.id}`} className="bg-white/10 backdrop-blur-md hover:bg-white/20 p-2 rounded-full inline-block shadow-lg">
                          <Edit size={16} className="text-white" />
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-900/30 border border-gray-800/50 rounded-xl">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-white">No services</h3>
                <p className="mt-1 text-sm text-gray-400">
                  {currentUser && currentUser.username === username
                    ? "Get started by creating a new service."
                    : "This freelancer hasn't added any services yet."}
                </p>
                
                {currentUser && currentUser.username === username && (
                  <div className="mt-6">
                    <Link
                      href="/account/services/create"
                      className="inline-flex items-center gap-x-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-blue-600 hover:to-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      <Plus className="-ml-0.5 h-4 w-4" aria-hidden="true" />
                      Create new service
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}