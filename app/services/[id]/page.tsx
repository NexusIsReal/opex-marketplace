import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Star, Clock, Check, MessageCircle, Heart, Share2, ShoppingCart, Shield, Award, Zap } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { getServiceById, parseServiceFeatures, parseServiceTags } from '@/lib/services';
import { Metadata } from 'next';
import { ServiceWithProfile } from "@/lib/services";

const DEFAULT_FAQS = [
  {
    question: "How long does delivery usually take?",
    answer: "Delivery time depends on the package you select. Basic packages are typically delivered within 3-5 days, while Premium packages may take 7-10 days due to additional revisions and features."
  },
  {
    question: "Do you offer revisions?",
    answer: "Yes, all packages include at least one revision. The number of revisions depends on the package tier you select. Additional revisions can be purchased if needed."
  },
  {
    question: "What if I'm not satisfied with the work?",
    answer: "Customer satisfaction is our priority. If you're not happy with the delivered work, we offer revisions to address your concerns. If issues persist, please contact support for assistance."
  }
];

import { formatDate } from "@/lib/profile";

// Define the ServicePackageSelector component inline since it's not found
const ServicePackageSelector = ({ packages }: { packages: ServicePackage[] }) => {
  return (
    <div className="space-y-4">
      {packages.map((pkg, index) => (
        <div 
          key={index}
          className={`p-4 rounded-xl border ${index === 1 
            ? 'border-[#9945FF] bg-[#9945FF]/10' 
            : 'border-gray-800 bg-gray-900/50'} 
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
      
      <Button className="w-full py-6 text-lg bg-gradient-to-r from-[#9945FF] to-[#00a2ff] hover:shadow-lg hover:shadow-[#9945FF]/20">
        Continue with Standard Package
      </Button>
    </div>
  );
};

// Define package types for the service
type ServicePackage = {
  name: string;
  price: number;
  description: string;
  deliveryTime: string;
  features: string[];
};

// Using the DEFAULT_FAQS defined at the top of the file

// We've moved the PackageSelector to a separate client component file

// Server component for service detail page
export default async function ServiceDetailPage({ params }: any) {
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
  
  // Parse features and tags from the service data
  const features = service.features ? parseServiceFeatures(service.features) : [];
  const tags = service.tags ? parseServiceTags(service.tags) : [];
  
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
      price: Math.round((service.priceFrom + (service.priceTo || service.priceFrom)) / 2),
      description: "Most popular option with additional features",
      deliveryTime: `${service.deliveryDays - 2 > 0 ? service.deliveryDays - 2 : 1} days`,
      features: features.slice(0, Math.min(6, features.length))
    },
    {
      name: "Premium",
      price: service.priceTo || service.priceFrom * 1.5,
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
                    src={service.coverUrl || '/placeholder-service.jpg'} 
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
                      <span className="text-white font-medium">{service.profile?.rating || '5.0'}</span>
                      <span className="text-gray-400">({service.profile?.reviews || '0'} reviews)</span>
                    </div>
                    
                    <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                    
                    <div className="flex items-center text-gray-300">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{service.deliveryDays} days delivery</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-6">
                    {service.description}
                  </p>
                  
                  {/* Seller Info */}
                  <div className="flex items-center gap-4 pt-4 border-t border-gray-800/50">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
                      <img 
                        src={service.profile?.user?.username ? `https://ui-avatars.com/api/?name=${service.profile.user.username}` : '/placeholder-avatar.png'} 
                        alt={service.profile?.user?.username || 'Service provider'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{service.profile?.user?.username || 'Service provider'}</span>
                        {service.profile?.rating && service.profile.rating >= 4.5 && (
                          <Badge variant="outline" className="border-[#9945FF]/50 text-[#9945FF] text-xs">
                            <Check className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm">
                        {service.profile?.location || 'Location not specified'} • Fast response
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
                <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
                  <ServicePackageSelector packages={packages} />
                </div>
                
                {/* Package Info is now handled by the ServicePackageSelector component */}
                
                {/* Action Buttons */}
                <div className="space-y-3">
                  <button className="w-full py-3 rounded-xl bg-gradient-to-r from-[#9945FF] to-[#00a2ff] text-white font-semibold hover:shadow-lg hover:shadow-[#9945FF]/20 transition-all duration-300 flex items-center justify-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Continue (${packages[1].price})
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
                  <p className="text-gray-300 mb-6">{service.description}</p>
                  
                  <h4 className="text-lg font-semibold text-white mb-3">What's Included:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                    {parseServiceFeatures(service.features).map((feature: string, index: number) => (
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
                    {/* Portfolio items will be implemented in a future update */}
                    <div className="col-span-3 text-center py-8">
                      <p className="text-gray-400">Portfolio items coming soon</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="about" className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-700">
                          <img 
                            src={service.profile?.user?.username ? `https://ui-avatars.com/api/?name=${service.profile.user.username}` : '/placeholder-avatar.png'} 
                            alt={service.profile?.user?.username || 'Service provider'}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">{service.profile?.user?.username || 'Service provider'}</h3>
                          {service.profile?.rating && service.profile.rating >= 4.5 && (
                            <Badge variant="outline" className="border-[#9945FF]/50 text-[#9945FF]">
                              <Award className="w-3 h-3 mr-1" />
                              Top Rated Seller
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center text-gray-300">
                          <Clock className="w-4 h-4 text-gray-400 mr-2" />
                          <span>Member since {service.profile?.memberSince ? new Date(service.profile.memberSince).toLocaleDateString() : 'N/A'}</span>
                        </div>
                        <div className="flex items-center text-gray-300">
                          <MessageCircle className="w-4 h-4 text-gray-400 mr-2" />
                          <span>Fast response time</span>
                        </div>
                      </div>
                      
                      <button className="w-full py-3 rounded-xl border border-gray-700/50 bg-transparent text-white hover:bg-gray-800/50 transition-all duration-300 flex items-center justify-center gap-2">
                        <MessageCircle className="w-5 h-5" />
                        Contact Me
                      </button>
                    </div>
                    
                    <div className="md:w-2/3">
                      <h4 className="text-lg font-semibold text-white mb-3">About Me</h4>
                      <p className="text-gray-300 mb-6">{service.profile?.about || 'No information provided.'}</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-gray-900/30 border border-gray-800/50 rounded-lg p-4">
                          <h5 className="text-white font-medium mb-2">Languages</h5>
                          <div className="space-y-1">
                            {service.profile?.languages ? (
                              typeof service.profile.languages === 'string' ?
                                <div className="text-gray-300 text-sm">{service.profile.languages}</div> :
                                Array.isArray(service.profile.languages) ? 
                                  service.profile.languages.map((language: string, index: number) => (
                                    <div key={index} className="text-gray-300 text-sm">{language}</div>
                                  )) : 
                                  <div className="text-gray-300 text-sm">English</div>
                            ) : (
                              <div className="text-gray-300 text-sm">Not specified</div>
                            )}
                          </div>
                        </div>
                        
                        <div className="bg-gray-900/30 border border-gray-800/50 rounded-lg p-4">
                          <h5 className="text-white font-medium mb-2">Skills</h5>
                          <div className="flex flex-wrap gap-2">
                            {service.profile?.skills ? (
                              typeof service.profile.skills === 'string' ?
                                <Badge className="bg-gray-800 hover:bg-gray-700 text-white">{service.profile.skills}</Badge> :
                                Array.isArray(service.profile.skills) ?
                                  service.profile.skills.map((skill: string, index: number) => (
                                    <Badge key={index} className="bg-gray-800 hover:bg-gray-700 text-white">{skill}</Badge>
                                  )) :
                                  null
                            ) : (
                              <>
                                {service.category && (
                                  <Badge className="bg-gray-800 hover:bg-gray-700 text-white">{service.category}</Badge>
                                )}
                                <Badge className="bg-gray-800 hover:bg-gray-700 text-white">Professional Services</Badge>
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
                    {DEFAULT_FAQS.map((faq: {question: string; answer: string}, index: number) => (
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
              {/* We'll implement related services in a future update */}
              <div className="col-span-3 text-center py-8">
                <p className="text-gray-400">More services coming soon</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}