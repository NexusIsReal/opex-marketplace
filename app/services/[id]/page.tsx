"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronRight, Star, Clock, Check, MessageCircle, Heart, Share2, ShoppingCart, Shield, Award, Zap } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { getServiceById, parseServiceFeatures, parseServiceTags } from "@/lib/services";
import { formatDate } from "@/lib/profile";

// Define package types for the service
type ServicePackage = {
  name: string;
  price: number;
  description: string;
  deliveryTime: string;
  features: string[];
};

// Default FAQs for services
const DEFAULT_FAQS = [
  {
    question: "Do you provide revisions?",
    answer: "Yes, all services include revision rounds. The number of revisions depends on the package you select."
  },
  {
    question: "How do I request changes?",
    answer: "You can request changes through our messaging system. I'll respond promptly and make the necessary adjustments."
  },
  {
    question: "What's your cancellation policy?",
    answer: "Cancellations are accepted within 24 hours of ordering if work hasn't started. After work begins, partial refunds may be available depending on progress."
  }
];

// Client component for package selection
function PackageSelector({ packages }: { packages: ServicePackage[] }) {
  const [selectedPackage, setSelectedPackage] = useState<ServicePackage>(packages[1]); // Default to Standard package

  return (
    <div>
      <div className="flex flex-col space-y-4 mb-6">
        {packages.map((pkg: ServicePackage) => (
          <div 
            key={pkg.name}
            onClick={() => setSelectedPackage(pkg)}
            className={`p-4 rounded-xl border ${selectedPackage.name === pkg.name 
              ? 'border-[#9945FF] bg-[#9945FF]/10' 
              : 'border-gray-800 bg-gray-900/50 hover:bg-gray-900'} 
              cursor-pointer transition-all duration-200`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-white font-semibold">{pkg.name}</h3>
                <p className="text-gray-400 text-sm">{pkg.description}</p>
              </div>
              <div className="text-right">
                <p className="text-white font-bold text-xl">${pkg.price}</p>
                <p className="text-gray-400 text-xs">{pkg.deliveryTime}</p>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-800">
              <p className="text-gray-400 text-xs mb-2">Package includes:</p>
              <ul className="space-y-1">
                {pkg.features.map((feature: string, i: number) => (
                  <li key={i} className="flex items-start text-sm">
                    <Check className="h-4 w-4 text-[#9945FF] mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      
      <Button className="w-full py-6 text-lg bg-gradient-to-r from-[#9945FF] to-[#00a2ff] hover:shadow-lg hover:shadow-[#9945FF]/20">
        Continue with {selectedPackage.name} Package
      </Button>
    </div>
  );
}

// Server component for service detail page
export default async function ServiceDetailPage({ params }: { params: { id: string } }) {
  // Fetch the service data from the database
  const service = await getServiceById(params.id);
  
  if (!service) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 relative overflow-hidden pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10 text-center">
          <h1 className="text-3xl font-bold text-white mb-6">Service not found</h1>
          <p className="text-gray-300 mb-8">The service you're looking for doesn't exist or has been removed.</p>
          <Link href="/services" className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#9945FF] to-[#00a2ff] text-white font-semibold hover:shadow-lg hover:shadow-[#9945FF]/20 transition-all duration-300">
            Browse Services
          </Link>
        </div>
      </div>
    );
  }
  
  // Parse features from the service
  const features = parseServiceFeatures(service.features);
  const tags = parseServiceTags(service.tags);
  
  // Create packages based on the service price range
  const packages: ServicePackage[] = [
    {
      name: "Basic",
      price: service.priceFrom,
      description: "Essential package to get started",
      deliveryTime: `${service.deliveryDays} days`,
      features: features.slice(0, Math.min(4, features.length))
    },
    {
      name: "Standard",
      price: Math.round((service.priceFrom + service.priceTo) / 2),
      description: "Most popular option with additional features",
      deliveryTime: `${service.deliveryDays - 2 > 0 ? service.deliveryDays - 2 : 1} days`,
      features: features.slice(0, Math.min(6, features.length))
    },
    {
      name: "Premium",
      price: service.priceTo,
      description: "Complete solution with all features",
      deliveryTime: `${service.deliveryDays - 5 > 0 ? service.deliveryDays - 5 : 1} days`,
      features: features
    }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 relative overflow-hidden pt-24 pb-16">
      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Base gradient similar to profile page */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-black to-gray-900" />
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