"use client";

import { useState } from "react";
import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Star, Clock, Check, MessageCircle, Heart, Share2, ShoppingCart, Shield, Award, Zap } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

// Mock data for services (same as in services/page.tsx)
const SERVICES = [
  {
    id: 1,
    title: "Professional Website Development",
    description: "Get a custom-built website with modern design and responsive layout for your business or personal brand.",
    longDescription: "I'll create a professional, responsive website tailored to your business needs. The package includes custom design, mobile optimization, basic SEO setup, and integration with your preferred CMS. You'll receive a website that not only looks great but also performs well across all devices.",
    category: "Web Development",
    rating: 4.9,
    reviews: 128,
    price: 299,
    deliveryTime: "3 days",
    revisions: "Unlimited",
    features: [
      "Custom design & development",
      "Responsive on all devices",
      "5 pages included",
      "SEO optimization",
      "Contact form setup",
      "Social media integration"
    ],
    packages: [
      {
        name: "Basic",
        price: 299,
        description: "Perfect for small businesses just getting started",
        deliveryTime: "3 days",
        features: [
          "3 page website",
          "Mobile responsive",
          "Contact form",
          "2 revisions"
        ]
      },
      {
        name: "Standard",
        price: 499,
        description: "Most popular option with additional features",
        deliveryTime: "5 days",
        features: [
          "5 page website",
          "Mobile responsive",
          "Contact form",
          "SEO optimization",
          "Social media integration",
          "Unlimited revisions"
        ]
      },
      {
        name: "Premium",
        price: 899,
        description: "Complete solution for established businesses",
        deliveryTime: "7 days",
        features: [
          "10 page website",
          "Mobile responsive",
          "Advanced contact forms",
          "E-commerce integration",
          "SEO optimization",
          "Social media integration",
          "Analytics setup",
          "Unlimited revisions"
        ]
      }
    ],
    seller: {
      name: "Alex Morgan",
      avatar: "/avatars/alex.jpg",
      level: "Top Rated",
      memberSince: "January 2022",
      country: "United States",
      languages: ["English", "Spanish"],
      responseTime: "Under 2 hours",
      bio: "Full-stack developer with 8+ years of experience specializing in modern web technologies. I've helped over 200 clients bring their web projects to life with clean code and beautiful design."
    },
    portfolio: [
      {
        title: "E-commerce Fashion Store",
        image: "https://images.unsplash.com/photo-1561069934-eee225952461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZWNvbW1lcmNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
      },
      {
        title: "Restaurant Website",
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cmVzdGF1cmFudCUyMHdlYnNpdGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
      },
      {
        title: "Fitness App Landing Page",
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Zml0bmVzcyUyMGFwcHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
      }
    ],
    faqs: [
      {
        question: "Do you provide website hosting?",
        answer: "No, hosting is not included in the packages. However, I can recommend reliable hosting providers and help you set everything up for a small additional fee."
      },
      {
        question: "Can I request changes after the website is delivered?",
        answer: "Yes, all packages include revision rounds. The Basic package includes 2 revisions, while Standard and Premium packages include unlimited revisions within the scope of work."
      },
      {
        question: "Do you provide ongoing maintenance?",
        answer: "Website maintenance is not included in the base packages. I offer monthly maintenance plans starting at $99/month that include updates, security patches, and minor content changes."
      }
    ],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHdlYnNpdGUlMjBkZXNpZ258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
  },
  {
    id: 2,
    title: "Logo Design & Brand Identity",
    description: "Professional logo design with complete brand identity package including colors, fonts, and brand guidelines.",
    longDescription: "I'll create a unique, memorable logo that perfectly represents your brand identity. This comprehensive package includes multiple logo variations, color palette, typography selection, and a complete brand guide to ensure consistent brand application across all platforms.",
    category: "Graphic Design",
    rating: 4.8,
    reviews: 97,
    price: 199,
    deliveryTime: "2 days",
    revisions: "5 Revisions",
    features: [
      "3 logo concepts",
      "Unlimited revisions",
      "High-resolution files",
      "Brand guideline document",
      "Social media kit",
      "Commercial license"
    ],
    packages: [
      {
        name: "Basic",
        price: 199,
        description: "Essential logo design for startups",
        deliveryTime: "2 days",
        features: [
          "2 logo concepts",
          "3 revisions",
          "High-res PNG/JPG files",
          "Basic brand colors"
        ]
      },
      {
        name: "Standard",
        price: 349,
        description: "Complete brand identity solution",
        deliveryTime: "4 days",
        features: [
          "3 logo concepts",
          "5 revisions",
          "Vector files (AI, EPS, SVG)",
          "Brand guideline document",
          "Business card design",
          "Social media kit"
        ]
      },
      {
        name: "Premium",
        price: 599,
        description: "Full brand package with extras",
        deliveryTime: "7 days",
        features: [
          "5 logo concepts",
          "Unlimited revisions",
          "All file formats",
          "Complete brand guidelines",
          "Stationery design",
          "Social media kit",
          "Website favicon",
          "Brand animation"
        ]
      }
    ],
    seller: {
      name: "Sarah Chen",
      avatar: "/avatars/sarah.jpg",
      level: "Top Rated",
      memberSince: "March 2021",
      country: "Canada",
      languages: ["English", "French", "Mandarin"],
      responseTime: "Under 1 hour",
      bio: "Creative brand designer with 10+ years of experience helping businesses establish their visual identity. I specialize in creating memorable brands that resonate with target audiences."
    },
    portfolio: [
      {
        title: "Tech Startup Brand",
        image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      },
      {
        title: "Restaurant Logo Design",
        image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      },
      {
        title: "Fashion Brand Identity",
        image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      }
    ],
    faqs: [
      {
        question: "What file formats will I receive?",
        answer: "You'll receive your logo in multiple formats including PNG, JPG, PDF, and vector formats (AI, EPS, SVG) depending on your package selection."
      },
      {
        question: "Can I trademark my logo?",
        answer: "Yes, you'll receive full commercial rights to your logo design. However, trademark registration is a separate legal process that you'll need to handle independently."
      },
      {
        question: "Do you offer rush delivery?",
        answer: "Yes, I can deliver within 24 hours for an additional rush fee. Please contact me before ordering to confirm availability."
      }
    ],
    image: "https://images.unsplash.com/photo-1626785774625-0b1c2c4eab67?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
  },
  {
    id: 3,
    title: "Social Media Content Creation",
    description: "Engaging social media content creation including posts, stories, and graphics for all major platforms.",
    longDescription: "I'll create eye-catching, engaging social media content that drives engagement and grows your following. This service includes custom graphics, captions, hashtag research, and content strategy tailored to your brand and target audience across all major social platforms.",
    category: "Social Media",
    rating: 4.9,
    reviews: 156,
    price: 149,
    deliveryTime: "2 days",
    revisions: "3 Revisions",
    features: [
      "10 social media posts",
      "Custom graphics design",
      "Engaging captions",
      "Hashtag research",
      "Multi-platform optimization",
      "Content calendar"
    ],
    packages: [
      {
        name: "Basic",
        price: 149,
        description: "Essential social media content",
        deliveryTime: "2 days",
        features: [
          "10 social posts",
          "Basic graphics",
          "Captions included",
          "2 revisions"
        ]
      },
      {
        name: "Standard",
        price: 249,
        description: "Complete social media package",
        deliveryTime: "3 days",
        features: [
          "20 social posts",
          "Custom graphics",
          "Engaging captions",
          "Hashtag research",
          "Stories templates",
          "Content calendar"
        ]
      },
      {
        name: "Premium",
        price: 399,
        description: "Full month social media content",
        deliveryTime: "5 days",
        features: [
          "30 social posts",
          "Premium graphics",
          "Professional captions",
          "Advanced hashtag strategy",
          "Stories & highlights",
          "Content calendar",
          "Analytics insights",
          "Posting schedule"
        ]
      }
    ],
    seller: {
      name: "Marcus Johnson",
      avatar: "/avatars/marcus.jpg",
      level: "Rising Star",
      memberSince: "August 2023",
      country: "United Kingdom",
      languages: ["English"],
      responseTime: "Under 3 hours",
      bio: "Social media specialist focused on creating viral content and growing brand presence. I've helped 100+ businesses increase their social media engagement by 300% on average."
    },
    portfolio: [
      {
        title: "Fashion Brand Campaign",
        image: "https://images.unsplash.com/photo-1611048267451-e6ed903d4a38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      },
      {
        title: "Restaurant Social Content",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      },
      {
        title: "Tech Company Posts",
        image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      }
    ],
    faqs: [
      {
        question: "Which social media platforms do you create content for?",
        answer: "I create content optimized for Instagram, Facebook, Twitter, LinkedIn, TikTok, and Pinterest. Each post is tailored to the specific platform's requirements and best practices."
      },
      {
        question: "Do you provide the posting schedule?",
        answer: "Yes, with Standard and Premium packages, you'll receive a detailed content calendar with optimal posting times and a strategic posting schedule."
      },
      {
        question: "Can you match my existing brand style?",
        answer: "Absolutely! I'll analyze your current brand guidelines and create content that matches your existing visual identity and brand voice."
      }
    ],
    image: "https://images.unsplash.com/photo-1611926653458-09294b3142bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
  }
];

export default function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Use the `use()` hook to unwrap the Promise
  const { id } = use(params);
  const serviceId = parseInt(id);
  const service = SERVICES.find(s => s.id === serviceId) || SERVICES[0]; // Fallback to first service if not found
  
  const [selectedPackage, setSelectedPackage] = useState(service.packages[1]); // Default to Standard package
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 relative overflow-hidden pt-24 pb-16">
      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Base gradient similar to profile page */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-black to-gray-900" />
        
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }} />
        
        {/* Glow elements matching theme */}
        <div className="absolute top-20 right-20 w-48 h-48 sm:w-96 sm:h-96 bg-[#9945FF]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-48 h-48 sm:w-96 sm:h-96 bg-[#00a2ff]/10 rounded-full blur-3xl" />
      </div>

      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        {/* Breadcrumb */}
        <div className="mb-6">
          <div className="flex items-center text-sm text-gray-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link href="/services" className="hover:text-white transition-colors">Services</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-white">{service.title}</span>
          </div>
        </div>

        {/* Service Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Service Image and Info - 2/3 width on desktop */}
          <div className="lg:col-span-2">
            <FadeIn delay={0.1} duration={0.5} direction="up">
              <div className="rounded-xl overflow-hidden border border-gray-800/50 bg-black/40 backdrop-blur-md">
                {/* Service Image */}
                <div className="aspect-video relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-40 z-10" />
                  <Image 
                    src={service.image} 
                    alt={service.title}
                    width={800}
                    height={450}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 z-20">
                    <Badge className="bg-[#9945FF]/80 hover:bg-[#9945FF] text-white border-none">
                      {service.category}
                    </Badge>
                  </div>
                </div>
                
                {/* Service Title and Info */}
                <div className="p-6">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                    {service.title}
                  </h1>
                  
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      <span className="text-white font-medium">{service.rating}</span>
                      <span className="text-gray-400">({service.reviews} reviews)</span>
                    </div>
                    
                    <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                    
                    <div className="flex items-center text-gray-300">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{service.deliveryTime} delivery</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-6">
                    {service.longDescription}
                  </p>
                  
                  {/* Seller Info */}
                  <div className="flex items-center gap-4 pt-4 border-t border-gray-800/50">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
                      <img 
                        src={service.seller.avatar} 
                        alt={service.seller.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${service.seller.name}&background=random`;
                        }}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{service.seller.name}</span>
                        {service.seller.level === "Top Rated" && (
                          <Badge variant="outline" className="border-[#9945FF]/50 text-[#9945FF] text-xs">
                            <Check className="w-3 h-3 mr-1" />
                            Top Rated
                          </Badge>
                        )}
                        {service.seller.level === "Rising Star" && (
                          <Badge variant="outline" className="border-[#00a2ff]/50 text-[#00a2ff] text-xs">
                            <Zap className="w-3 h-3 mr-1" />
                            Rising Star
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm">
                        {service.seller.country} • {service.seller.responseTime} response time
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
          
          {/* Pricing Card - 1/3 width on desktop */}
          <div className="lg:col-span-1">
            <FadeIn delay={0.2} duration={0.5} direction="up">
              <div className="rounded-xl border border-gray-800/50 bg-black/40 backdrop-blur-md p-6 sticky top-24">
                <h2 className="text-xl font-bold text-white mb-4">Service Packages</h2>
                
                {/* Package Selection */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                  {service.packages.map((pkg, index) => (
                    <button
                      key={index}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedPackage === pkg 
                          ? "bg-[#9945FF] text-white" 
                          : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
                      }`}
                      onClick={() => setSelectedPackage(pkg)}
                    >
                      {pkg.name}
                    </button>
                  ))}
                </div>
                
                {/* Selected Package Info */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-white font-medium">{selectedPackage.name} Package</h3>
                    <div className="text-white font-bold text-2xl">${selectedPackage.price}</div>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">{selectedPackage.description}</p>
                  
                  <div className="flex items-center text-gray-300 text-sm mb-4">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{selectedPackage.deliveryTime} delivery</span>
                  </div>
                  
                  <div className="space-y-2">
                    {selectedPackage.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-gray-300">
                        <Check className="w-4 h-4 text-[#9945FF] mr-2" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="space-y-3">
                  <button className="w-full py-3 rounded-xl bg-gradient-to-r from-[#9945FF] to-[#00a2ff] text-white font-semibold hover:shadow-lg hover:shadow-[#9945FF]/20 transition-all duration-300 flex items-center justify-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Continue (${selectedPackage.price})
                  </button>
                  
                  <button className="w-full py-3 rounded-xl border border-gray-700/50 bg-transparent text-white hover:bg-gray-800/50 transition-all duration-300 flex items-center justify-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Contact Seller
                  </button>
                  
                  <div className="flex items-center justify-between">
                    <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-gray-300 hover:text-white transition-colors">
                      <Heart className="w-5 h-5" />
                      Save
                    </button>
                    
                    <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-gray-300 hover:text-white transition-colors">
                      <Share2 className="w-5 h-5" />
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
        
        {/* Service Details Tabs */}
        <div className="mb-12">
          <FadeIn delay={0.3} duration={0.5} direction="up">
            <div className="rounded-xl border border-gray-800/50 bg-black/40 backdrop-blur-md overflow-hidden">
              <Tabs defaultValue="description" className="w-full">
                <div className="border-b border-gray-800/50">
                  <TabsList className="bg-transparent border-b border-gray-800/50 w-full justify-start rounded-none h-auto p-0">
                    <TabsTrigger 
                      value="description" 
                      className="px-6 py-4 rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#9945FF] data-[state=active]:shadow-none text-gray-400 data-[state=active]:text-white"
                    >
                      Description
                    </TabsTrigger>
                    <TabsTrigger 
                      value="portfolio" 
                      className="px-6 py-4 rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#9945FF] data-[state=active]:shadow-none text-gray-400 data-[state=active]:text-white"
                    >
                      Portfolio
                    </TabsTrigger>
                    <TabsTrigger 
                      value="about" 
                      className="px-6 py-4 rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#9945FF] data-[state=active]:shadow-none text-gray-400 data-[state=active]:text-white"
                    >
                      About Seller
                    </TabsTrigger>
                    <TabsTrigger 
                      value="faq" 
                      className="px-6 py-4 rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#9945FF] data-[state=active]:shadow-none text-gray-400 data-[state=active]:text-white"
                    >
                      FAQ
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="description" className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Service Description</h3>
                  <p className="text-gray-300 mb-6">{service.longDescription}</p>
                  
                  <h4 className="text-lg font-semibold text-white mb-3">What's Included:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-gray-300">
                        <Check className="w-5 h-5 text-[#9945FF] mr-2" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-gray-900/50 border border-gray-800/50 rounded-lg p-4 flex items-center">
                    <Shield className="w-10 h-10 text-[#9945FF] mr-4" />
                    <div>
                      <h5 className="text-white font-medium">100% Satisfaction Guarantee</h5>
                      <p className="text-gray-400 text-sm">If you're not completely satisfied with the delivered work, we'll work to make it right.</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="portfolio" className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Portfolio</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {service.portfolio.map((item, index) => (
                      <div key={index} className="rounded-lg overflow-hidden border border-gray-800/50 bg-gray-900/30">
                        <div className="aspect-video relative">
                          <img 
                            src={item.image} 
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-3">
                          <h5 className="text-white font-medium">{item.title}</h5>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="about" className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-700">
                          <img 
                            src={service.seller.avatar} 
                            alt={service.seller.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = `https://ui-avatars.com/api/?name=${service.seller.name}&background=random`;
                            }}
                          />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">{service.seller.name}</h3>
                          {service.seller.level === "Top Rated" && (
                            <Badge variant="outline" className="border-[#9945FF]/50 text-[#9945FF]">
                              <Award className="w-3 h-3 mr-1" />
                              Top Rated Seller
                            </Badge>
                          )}
                          {service.seller.level === "Rising Star" && (
                            <Badge variant="outline" className="border-[#00a2ff]/50 text-[#00a2ff]">
                              <Zap className="w-3 h-3 mr-1" />
                              Rising Star
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center text-gray-300">
                          <Clock className="w-4 h-4 text-gray-400 mr-2" />
                          <span>Member since {service.seller.memberSince}</span>
                        </div>
                        <div className="flex items-center text-gray-300">
                          <MessageCircle className="w-4 h-4 text-gray-400 mr-2" />
                          <span>{service.seller.responseTime} response time</span>
                        </div>
                      </div>
                      
                      <button className="w-full py-3 rounded-xl border border-gray-700/50 bg-transparent text-white hover:bg-gray-800/50 transition-all duration-300 flex items-center justify-center gap-2">
                        <MessageCircle className="w-5 h-5" />
                        Contact Me
                      </button>
                    </div>
                    
                    <div className="md:w-2/3">
                      <h4 className="text-lg font-semibold text-white mb-3">About Me</h4>
                      <p className="text-gray-300 mb-6">{service.seller.bio}</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-gray-900/30 border border-gray-800/50 rounded-lg p-4">
                          <h5 className="text-white font-medium mb-2">Languages</h5>
                          <div className="space-y-1">
                            {service.seller.languages.map((language, index) => (
                              <div key={index} className="text-gray-300 text-sm">{language}</div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="bg-gray-900/30 border border-gray-800/50 rounded-lg p-4">
                          <h5 className="text-white font-medium mb-2">Skills</h5>
                          <div className="flex flex-wrap gap-2">
                            {serviceId === 1 && (
                              <>
                                <Badge className="bg-gray-800 hover:bg-gray-700 text-white">HTML/CSS</Badge>
                                <Badge className="bg-gray-800 hover:bg-gray-700 text-white">JavaScript</Badge>
                                <Badge className="bg-gray-800 hover:bg-gray-700 text-white">React</Badge>
                                <Badge className="bg-gray-800 hover:bg-gray-700 text-white">Node.js</Badge>
                                <Badge className="bg-gray-800 hover:bg-gray-700 text-white">UI/UX Design</Badge>
                              </>
                            )}
                            {serviceId === 2 && (
                              <>
                                <Badge className="bg-gray-800 hover:bg-gray-700 text-white">Adobe Illustrator</Badge>
                                <Badge className="bg-gray-800 hover:bg-gray-700 text-white">Photoshop</Badge>
                                <Badge className="bg-gray-800 hover:bg-gray-700 text-white">Brand Design</Badge>
                                <Badge className="bg-gray-800 hover:bg-gray-700 text-white">Typography</Badge>
                                <Badge className="bg-gray-800 hover:bg-gray-700 text-white">Logo Design</Badge>
                              </>
                            )}
                            {serviceId === 3 && (
                              <>
                                <Badge className="bg-gray-800 hover:bg-gray-700 text-white">Content Creation</Badge>
                                <Badge className="bg-gray-800 hover:bg-gray-700 text-white">Social Strategy</Badge>
                                <Badge className="bg-gray-800 hover:bg-gray-700 text-white">Canva</Badge>
                                <Badge className="bg-gray-800 hover:bg-gray-700 text-white">Analytics</Badge>
                                <Badge className="bg-gray-800 hover:bg-gray-700 text-white">Copywriting</Badge>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="faq" className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Frequently Asked Questions</h3>
                  <div className="space-y-4">
                    {service.faqs.map((faq, index) => (
                      <div key={index} className="border border-gray-800/50 rounded-lg p-4">
                        <h4 className="text-white font-medium mb-2">{faq.question}</h4>
                        <p className="text-gray-300">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </FadeIn>
        </div>
        
        {/* Related Services */}
        <div>
          <FadeIn delay={0.4} duration={0.5} direction="up">
            <h2 className="text-2xl font-bold text-white mb-6">Similar Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SERVICES.filter(s => s.id !== serviceId).slice(0, 3).map((relatedService) => (
                <Link key={relatedService.id} href={`/services/${relatedService.id}`} className="block">
                  <div className="group relative rounded-xl overflow-hidden border border-gray-800/50 bg-black/40 backdrop-blur-md hover:bg-gray-900/60 transition-all duration-300 hover:border-[#9945FF]/30 hover:shadow-lg hover:shadow-[#9945FF]/5">
                    {/* Service Image */}
                    <div className="aspect-video relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60 z-10" />
                      <img 
                        src={relatedService.image} 
                        alt={relatedService.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 z-20">
                        <Badge className="bg-[#9945FF]/80 hover:bg-[#9945FF] text-white border-none">
                          {relatedService.category}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Service Content */}
                    <div className="p-4">
                      <h3 className="text-white font-medium text-lg mb-2 line-clamp-1 group-hover:text-[#9945FF]/90 transition-colors">
                        {relatedService.title}
                      </h3>
                      
                      <div className="flex items-center gap-1 mb-3">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-white font-medium">{relatedService.rating}</span>
                        <span className="text-gray-400 text-sm">({relatedService.reviews})</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-400 text-sm">
                          <Clock className="w-4 h-4 mr-1" />
                          {relatedService.deliveryTime}
                        </div>
                        <div className="text-white font-bold">${relatedService.price}</div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}