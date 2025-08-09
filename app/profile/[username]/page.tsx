import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getProfile, formatDate } from '@/lib/profile';
import { Star, MapPin, Calendar, Clock, Award, Briefcase, MessageCircle, Heart, Share2, ExternalLink, ChevronRight, Zap, Shield, Trophy, Users, Check } from 'lucide-react';

type StarSize = 'sm' | 'lg';
function Stars({ rating, size = 'sm', showNumber = false }: { rating: number; size?: StarSize; showNumber?: boolean }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  const sizeClass = size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
  
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
      {showNumber ? <span className="text-white/90 font-medium ml-2">{rating.toFixed(1)}</span> : null}
    </div>
  );
}

type IconType = React.ComponentType<{ className?: string }>;
function StatCard({ icon: Icon, label, value, accent = false }: { icon: IconType; label: string; value: string | number; accent?: boolean }) {
  return (
    <div className={`group rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] ${
      accent 
        ? 'bg-gradient-to-br from-gray-600/20 to-gray-700/30 border border-gray-400/30' 
        : 'bg-gray-900/50 border border-gray-700/50'
    } backdrop-blur-sm hover:shadow-xl`}>
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${
          accent 
            ? 'bg-gradient-to-br from-gray-500 to-gray-600' 
            : 'bg-gray-800/50'
        }`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="text-sm text-gray-400 mb-1">{label}</div>
          <div className="text-xl font-bold text-white">{value}</div>
        </div>
      </div>
    </div>
  );
}

type BadgeVariant = 'default' | 'success' | 'warning' | 'accent';
function Badge({ children, variant = 'default' }: { children: React.ReactNode; variant?: BadgeVariant }) {
  const variants: Record<BadgeVariant, string> = {
    default: 'bg-gray-800/50 border-gray-600/50 text-gray-300',
    success: 'bg-emerald-600/20 border-emerald-500/40 text-emerald-300',
    warning: 'bg-amber-600/20 border-amber-500/40 text-amber-300',
    accent: 'bg-gray-600/20 border-gray-500/40 text-gray-200',
  };

  return <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${variants[variant]} backdrop-blur-sm`}>{children}</span>;
}

export const dynamic = 'force-dynamic';

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const profile = await getProfile(username);
  if (!profile) return notFound();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 relative overflow-hidden">
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
        <div className="absolute top-20 right-20 w-96 h-96 bg-gray-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gray-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gray-300/5 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div className="h-72 w-full bg-transparent" />
        <div className="absolute inset-0 bg-transparent" />
        
        {/* Profile Header */}
        <div className="absolute -bottom-24 left-0 right-0">
          <div className="max-w-7xl mx-auto px-6">
            <div className="relative rounded-3xl border border-gray-700/30 bg-black/70 backdrop-blur-xl shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800/10 to-transparent" />
              <div className="relative p-8">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                  {/* Avatar & Basic Info */}
                  <div className="flex items-start gap-6">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-gray-500/20 shadow-2xl">
                        {profile.avatarUrl ? (
                          profile.avatarUrl.toLowerCase().includes('.svg') || profile.avatarUrl.includes('/svg') ? (
                            <img src={profile.avatarUrl} alt={profile.displayName} className="w-full h-full object-cover" />
                          ) : (
                            <Image src={profile.avatarUrl} alt={profile.displayName} fill className="object-cover" />
                          )
                        ) : (
                          <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-400 text-3xl font-bold">
                            {profile.displayName[0]}
                          </div>
                        )}
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full border-4 border-black/80 flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">
                          {profile.displayName}
                        </h1>
                        <Badge variant="success">
                          <Check className="w-3 h-3 mr-1" />
                          Verified Pro
                        </Badge>
                      </div>
                      <p className="text-gray-400 text-lg mb-3">@{profile.username}</p>
                      {profile.tagline ? (
                        <p className="text-gray-200 text-lg font-medium mb-4 max-w-2xl">{profile.tagline}</p>
                      ) : null}
                      
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <Stars rating={profile.rating} size="lg" showNumber />
                          <span className="text-gray-400">({profile.reviews} reviews)</span>
                        </div>
                        {profile.location && (
                          <div className="flex items-center gap-2 text-gray-400">
                            <MapPin className="w-4 h-4" />
                            {profile.location}
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-gray-400">
                          <Clock className="w-4 h-4" />
                          Usually responds within a few hours
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 lg:ml-auto">
                    <button className="px-6 py-3 rounded-2xl border transition-all duration-300 flex items-center gap-2 bg-transparent border-gray-500/30 text-gray-300 hover:bg-gray-600/20 hover:border-gray-400/50">
                      <Heart className="w-4 h-4" />
                      Follow
                    </button>
                    
                    <button className="px-6 py-3 rounded-2xl bg-gray-900/30 border border-gray-500/20 text-white hover:bg-gray-600/20 transition-all duration-300 flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      Contact
                    </button>
                    
                    <button className="px-8 py-3 rounded-2xl bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold hover:from-gray-500 hover:to-gray-600 transition-all duration-300 shadow-lg hover:shadow-gray-500/25 flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Hire Now
                    </button>
                    
                    <button className="p-3 rounded-2xl bg-gray-900/30 border border-gray-500/20 text-gray-300 hover:bg-gray-600/20 transition-all duration-300">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pt-36 pb-16">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard icon={Trophy} label="Rating" value={`${profile.rating.toFixed(1)}/5`} accent />
          <StatCard icon={Users} label="Reviews" value={`${profile.reviews}+`} />
          <StatCard icon={Award} label="Orders in Queue" value={profile.ordersInQueue ?? 0} />
          <StatCard icon={Shield} label="Member Since" value={profile.memberSince ? formatDate(profile.memberSince) : 'N/A'} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            {profile.about && (
              <div className="rounded-3xl border border-gray-800/80 bg-black/50 backdrop-blur-xl overflow-hidden">
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-4 h-4 text-white" />
                    </div>
                    About Me
                  </h2>
                  <p className="text-gray-300 leading-relaxed text-lg mb-8">{profile.about}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      {profile.memberSince && (
                        <div className="flex items-center gap-3 text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span>Member since {formatDate(profile.memberSince)}</span>
                        </div>
                      )}
                      {profile.lastDelivery && (
                        <div className="flex items-center gap-3 text-gray-400">
                          <Clock className="w-4 h-4" />
                          <span>Last delivery: {formatDate(profile.lastDelivery)}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-gray-400">
                        <Award className="w-4 h-4" />
                        <span>Top Rated Seller</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-400">
                        <Shield className="w-4 h-4" />
                        <span>99% Order Completion</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Services/Gigs */}
            {profile.gigs?.length > 0 && (
              <div className="rounded-3xl border border-gray-800/80 bg-black/50 backdrop-blur-xl overflow-hidden">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg flex items-center justify-center">
                        <Zap className="w-4 h-4 text-white" />
                      </div>
                      My Services
                    </h2>
                    <button className="text-gray-400 hover:text-gray-300 transition-colors flex items-center gap-1">
                      View all <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {profile.gigs.slice(0, 2).map((gig) => (
                      <div key={gig.id} className="group relative rounded-2xl overflow-hidden border border-gray-800/50 bg-gray-900/30 hover:bg-gray-800/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
                        <div className="aspect-video relative overflow-hidden">
                          <img 
                            src={gig.coverUrl}
                            alt={gig.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="absolute top-4 right-4">
                            <Badge variant="accent">Featured</Badge>
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-white font-semibold mb-3 group-hover:text-gray-300 transition-colors line-clamp-2">
                            {gig.title}
                          </h3>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Stars rating={gig.rating} />
                              <span className="text-gray-400 text-sm">({gig.reviews})</span>
                            </div>
                            <div className="text-right">
                              <span className="text-gray-400 text-sm">Starting at</span>
                              <div className="text-gray-300 font-bold text-xl">${gig.priceFrom}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Reviews */}
            {profile.reviewsList?.length ? (
              <div className="rounded-3xl border border-gray-800/80 bg-black/50 backdrop-blur-xl overflow-hidden">
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
                      <Star className="w-4 h-4 text-white" />
                    </div>
                    Client Reviews
                  </h2>
                  
                  <div className="space-y-6">
                    {profile.reviewsList.map((r) => (
                      <div key={r.id} className="relative p-6 rounded-2xl bg-gray-900/30 border border-gray-800/50 hover:bg-gray-800/50 transition-all duration-300">
                        <div className="flex gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-white font-bold">
                            {r.author[0]}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-white font-semibold">{r.author}</span>
                              <Stars rating={r.rating} />
                              <span className="text-gray-500 text-sm">{new Date(r.date).toLocaleDateString()}</span>
                            </div>
                            <p className="text-gray-300 leading-relaxed">{r.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Skills */}
            {profile.skills?.length ? (
              <div className="rounded-3xl border border-gray-800/80 bg-black/50 backdrop-blur-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  <Award className="w-5 h-5 text-gray-400" />
                  Skills & Expertise
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <Badge key={skill}>{skill}</Badge>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Languages */}
            {profile.languages?.length ? (
              <div className="rounded-3xl border border-gray-800/80 bg-black/50 backdrop-blur-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-gray-400" />
                  Languages
                </h3>
                <div className="space-y-3">
                  {profile.languages.map((l) => (
                    <div key={l.name} className="flex items-center justify-between p-3 rounded-xl bg-gray-900/30 border border-gray-800/50">
                      <span className="text-gray-200">{l.name}</span>
                      <Badge variant={l.level === 'Native/Bilingual' ? 'success' : 'default'}>
                        {l.level}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Portfolio Preview */}
            {profile.portfolio?.length ? (
              <div className="rounded-3xl border border-gray-800/80 bg-black/50 backdrop-blur-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <ExternalLink className="w-5 h-5 text-gray-400" />
                    Portfolio
                  </h3>
                  <button className="text-gray-400 hover:text-gray-300 text-sm transition-colors">View All</button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {profile.portfolio.map((p) => (
                    <div key={p.id} className="group relative aspect-square rounded-xl overflow-hidden border border-gray-800/50 hover:border-gray-700 transition-all duration-300">
                      <img 
                        src={p.imageUrl}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <ExternalLink className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}