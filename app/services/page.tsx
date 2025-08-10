"use client";

import { useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Star, Clock, Check, MessageCircle, Heart, Share2, ShoppingCart, Shield, Award, Zap } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    title: "Mobile App UI/UX Design",
    description: "Professional UI/UX design for your mobile application with modern aesthetics and user-friendly interfaces.",
    longDescription: "I'll create stunning, user-centered mobile app designs that provide exceptional user experiences. This comprehensive service includes wireframing, prototyping, visual design, and usability testing to ensure your app not only looks amazing but also functions intuitively for your users.",
    category: "UI/UX Design",
    rating: 4.8,
    reviews: 94,
    price: 399,
    deliveryTime: "5 days",
    revisions: "5 Revisions",
    features: [
      "Complete UI/UX design",
      "Interactive prototypes",
      "Design system creation",
      "User flow optimization",
      "Cross-platform compatibility",
      "Usability testing"
    ],
    packages: [
      {
        name: "Basic",
        price: 399,
        description: "Essential mobile app design",
        deliveryTime: "5 days",
        features: [
          "5-8 screens design",
          "Basic wireframes",
          "Mobile responsive",
          "3 revisions"
        ]
      },
      {
        name: "Standard",
        price: 699,
        description: "Complete app design solution",
        deliveryTime: "8 days",
        features: [
          "10-15 screens design",
          "Interactive prototypes",
          "Design system",
          "User flow diagrams",
          "5 revisions",
          "Source files included"
        ]
      },
      {
        name: "Premium",
        price: 1199,
        description: "Full app design with extras",
        deliveryTime: "12 days",
        features: [
          "20+ screens design",
          "Advanced prototypes",
          "Complete design system",
          "User testing insights",
          "Animation guidelines",
          "Developer handoff",
          "Unlimited revisions"
        ]
      }
    ],
    seller: {
      name: "Sarah Chen",
      avatar: "/avatars/sarah.jpg",
      level: "Level 2",
      memberSince: "March 2021",
      country: "Canada",
      languages: ["English", "French", "Mandarin"],
      responseTime: "Under 1 hour",
      bio: "UX/UI designer with 7+ years of experience creating intuitive mobile experiences. I've designed apps for startups to Fortune 500 companies, focusing on user-centered design principles."
    },
    portfolio: [
      {
        title: "E-commerce Mobile App",
        image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG1vYmlsZSUyMGFwcHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
      },
      {
        title: "Health & Fitness App",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      },
      {
        title: "Social Media App UI",
        image: "https://images.unsplash.com/photo-1611926653458-09294b3142bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      }
    ],
    faqs: [
      {
        question: "What design tools do you use?",
        answer: "I primarily use Figma for design and prototyping, which allows for easy collaboration and developer handoff. I can also work with Sketch or Adobe XD if preferred."
      },
      {
        question: "Do you provide developer-ready assets?",
        answer: "Yes, with Standard and Premium packages, you'll receive all assets optimized for development, including proper naming conventions and export specifications."
      },
      {
        question: "Can you design for both iOS and Android?",
        answer: "Absolutely! I follow platform-specific design guidelines to ensure your app feels native on both iOS and Android platforms."
      }
    ],
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG1vYmlsZSUyMGFwcHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
  },
  {
    id: 3,
    title: "SEO Optimization & Strategy",
    description: "Boost your website's search engine ranking with comprehensive SEO optimization and content strategy.",
    longDescription: "I'll provide a complete SEO audit and implementation strategy to improve your website's visibility in search engines. This includes keyword research, on-page optimization, technical SEO fixes, content recommendations, and ongoing monitoring to ensure sustainable growth in organic traffic.",
    category: "Digital Marketing",
    rating: 4.7,
    reviews: 76,
    price: 199,
    deliveryTime: "7 days",
    revisions: "3 Revisions",
    features: [
      "Complete SEO audit",
      "Keyword research & strategy",
      "On-page optimization",
      "Technical SEO fixes",
      "Content recommendations",
      "Monthly progress reports"
    ],
    packages: [
      {
        name: "Basic",
        price: 199,
        description: "Essential SEO audit and basic optimization",
        deliveryTime: "7 days",
        features: [
          "SEO audit report",
          "Keyword research (20 keywords)",
          "Basic on-page optimization",
          "2 revisions"
        ]
      },
      {
        name: "Standard",
        price: 399,
        description: "Comprehensive SEO strategy",
        deliveryTime: "10 days",
        features: [
          "Detailed SEO audit",
          "Keyword research (50 keywords)",
          "On-page & technical SEO",
          "Content strategy",
          "Competitor analysis",
          "3 months support"
        ]
      },
      {
        name: "Premium",
        price: 799,
        description: "Complete SEO transformation",
        deliveryTime: "14 days",
        features: [
          "Comprehensive audit",
          "Advanced keyword research",
          "Full SEO implementation",
          "Content creation plan",
          "Link building strategy",
          "6 months ongoing support",
          "Monthly reporting"
        ]
      }
    ],
    seller: {
      name: "Marcus Johnson",
      avatar: "/avatars/marcus.jpg",
      level: "Top Rated",
      memberSince: "August 2020",
      country: "United Kingdom",
      languages: ["English"],
      responseTime: "Under 3 hours",
      bio: "SEO specialist with 6+ years of experience helping businesses improve their online visibility. I've successfully increased organic traffic by 200%+ for over 150 websites across various industries."
    },
    portfolio: [
      {
        title: "E-commerce SEO Success",
        image: "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c2VvfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
      },
      {
        title: "Local Business SEO",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      },
      {
        title: "Tech Startup Growth",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      }
    ],
    faqs: [
      {
        question: "How long does it take to see SEO results?",
        answer: "SEO is a long-term strategy. While some improvements can be seen within 2-4 weeks, significant results typically take 3-6 months depending on competition and current site status."
      },
      {
        question: "Do you guarantee first page rankings?",
        answer: "While I cannot guarantee specific rankings due to Google's algorithm complexity, I focus on proven strategies that consistently improve visibility and organic traffic."
      },
      {
        question: "What tools do you use for SEO analysis?",
        answer: "I use a combination of premium tools including SEMrush, Ahrefs, Screaming Frog, and Google's suite of tools for comprehensive SEO analysis and monitoring."
      }
    ],
    image: "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c2VvfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
  }
]

export default function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Await the params Promise before accessing properties
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
                  <img 
                    src={service.image} 
                    alt={service.title}
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
                                <Badge className="bg-gray-800 hover:bg-gray-700 text-white">Figma</Badge>
                                <Badge className="bg-gray-800 hover:bg-gray-700 text-white">Adobe XD</Badge>
                                <Badge className="bg-gray-800 hover:bg-gray-700 text-white">Prototyping</Badge>
                                <Badge className="bg-gray-800 hover:bg-gray-700 text-white">User Research</Badge>
                                <Badge className="bg-gray-800 hover:bg-gray-700 text-white">Mobile Design</Badge>
                              </>
                            )}
                            {serviceId === 3 && (
                              <>
                                <Badge className="bg-gray-800 hover:bg-gray-700 text-white">SEO</Badge>
                                <Badge className="bg-gray-800 hover:bg-gray-700 text-white">Google Analytics</Badge>
                                <Badge className="bg-gray-800 hover:bg-gray-700 text-white">Keyword Research</Badge>
                                <Badge className="bg-gray-800 hover:bg-gray-700 text-white">Content Strategy</Badge>
                                <Badge className="bg-gray-800 hover:bg-gray-700 text-white">Technical SEO</Badge>
                              </>
                            )}
                            {serviceId === 4 && (
                              <>
                                <Badge className="bg-gray-800 hover:bg-gray-700 text-white">Adobe Illustrator</Badge>
                                <Badge className="bg-gray-800 hover:bg-gray-700 text-white">Photoshop</Badge>
                                <Badge className="bg-gray-800 hover:bg-gray-700 text-white">Brand Design</Badge>
                                <Badge className="bg-gray-800 hover:bg-gray-700 text-white">Typography</Badge>
                                <Badge className="bg-gray-800 hover:bg-gray-700 text-white">Logo Design</Badge>
                              </>
                            )}
                            {serviceId === 5 && (
                              <>
                                <Badge className="bg-gray-800 hover:bg-gray-700 text-white">Social Strategy</Badge>
                                <Badge className="bg-gray-800 hover:bg-gray-700 text-white">Campaign Management</Badge>
                                <Badge className="bg-gray-800 hover:bg-gray-700 text-white">Analytics</Badge>
                                <Badge className="bg-gray-800 hover:bg-gray-700 text-white">Content Marketing</Badge>
                                <Badge className="bg-gray-800 hover:bg-gray-700 text-white">Community Management</Badge>
                              </>
                            )}
                            {serviceId === 6 && (
                              <>
                                <Badge className="bg-gray-800 hover:bg-gray-700 text-white">React/Next.js</Badge>
                                <Badge className="bg-gray-800 hover:bg-gray-700 text-white">Node.js</Badge>
                                <Badge className="bg-gray-800 hover:bg-gray-700 text-white">PostgreSQL</Badge>
                                <Badge className="bg-gray-800 hover:bg-gray-700 text-white">AWS</Badge>
                                <Badge className="bg-gray-800 hover:bg-gray-700 text-white">API Development</Badge>
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