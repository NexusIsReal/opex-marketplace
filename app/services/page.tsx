"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Star, Clock, Check, Filter, Search, ArrowUpDown, Zap, Heart, X, Eye } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import BlurText from "@/components/BlurText";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

// Mock data for services
const SERVICES = [
  {
    id: 1,
    title: "Professional Website Development",
    description: "Get a custom-built website with modern design and responsive layout for your business or personal brand.",
    category: "Web Development",
    rating: 4.9,
    reviews: 128,
    price: 299,
    deliveryTime: "3 days",
    seller: {
      name: "Alex Morgan",
      level: "Top Rated"
    },
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHdlYnNpdGUlMjBkZXNpZ258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
  },
  {
    id: 2,
    title: "Mobile App UI/UX Design",
    description: "Professional UI/UX design for your mobile application with modern aesthetics and user-friendly interfaces.",
    category: "UI/UX Design",
    rating: 4.8,
    reviews: 94,
    price: 399,
    deliveryTime: "4 days",
    seller: {
      name: "Emma Wilson",
      level: "Top Rated"
    },
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG1vYmlsZSUyMGFwcHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
  },
  {
    id: 3,
    title: "Logo & Brand Identity Design",
    description: "Create a memorable brand identity with a custom logo design that represents your business values and vision.",
    category: "Graphic Design",
    rating: 4.7,
    reviews: 156,
    price: 199,
    deliveryTime: "2 days",
    seller: {
      name: "Marcus Chen",
      level: "Level 2"
    },
    image: "https://images.unsplash.com/photo-1636633762833-5d1658f1e29b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bG9nbyUyMGRlc2lnbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
  },
  {
    id: 4,
    title: "Social Media Marketing Campaign",
    description: "Boost your online presence with a comprehensive social media marketing strategy and content creation.",
    category: "Digital Marketing",
    rating: 4.6,
    reviews: 87,
    price: 349,
    deliveryTime: "5 days",
    seller: {
      name: "Sarah Johnson",
      level: "Level 2"
    },
    image: "https://images.unsplash.com/photo-1611926653458-09294b3142bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c29jaWFsJTIwbWVkaWElMjBtYXJrZXRpbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
  },
  {
    id: 5,
    title: "SEO Optimization & Strategy",
    description: "Improve your website's search engine ranking with comprehensive SEO analysis and optimization.",
    category: "Digital Marketing",
    rating: 4.8,
    reviews: 112,
    price: 299,
    deliveryTime: "4 days",
    seller: {
      name: "David Kim",
      level: "Top Rated"
    },
    image: "https://images.unsplash.com/photo-1571677246347-5040e090b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c2VvfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
  },
  {
    id: 6,
    title: "Video Editing & Production",
    description: "Professional video editing services for social media, marketing, or personal content with quick turnaround.",
    category: "Video & Animation",
    rating: 4.9,
    reviews: 76,
    price: 249,
    deliveryTime: "3 days",
    seller: {
      name: "Ryan Miller",
      level: "Level 1"
    },
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dmlkZW8lMjBlZGl0aW5nfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
  }
];

// Get unique categories
const CATEGORIES = ["All Categories", ...new Set(SERVICES.map(service => service.category))];

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("recommended");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [quickViewService, setQuickViewService] = useState<any>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('serviceFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage when they change
  useEffect(() => {
    localStorage.setItem('serviceFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // Toggle favorite status
  const toggleFavorite = (id: number) => {
    setFavorites(prev => {
      if (prev.includes(id)) {
        toast({
          title: "Removed from favorites",
          description: "Service has been removed from your favorites",
        });
        return prev.filter(item => item !== id);
      } else {
        toast({
          title: "Added to favorites",
          description: "Service has been added to your favorites",
          variant: "default",
        });
        return [...prev, id];
      }
    });
  };

  // Filter and sort services
  const filteredServices = SERVICES.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All Categories" || service.category === selectedCategory;
    const matchesPrice = service.price >= priceRange[0] && service.price <= priceRange[1];
    const matchesFavorites = showFavoritesOnly ? favorites.includes(service.id) : true;
    return matchesSearch && matchesCategory && matchesPrice && matchesFavorites;
  }).sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "price_low") return a.price - b.price;
    if (sortBy === "price_high") return b.price - a.price;
    return 0; // recommended - no specific sort
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 relative overflow-hidden pt-32 pb-16">
      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Base gradient similar to profile page */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-black to-gray-900" />
        
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03]" />
        
        {/* Glow elements */}
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#9945FF] opacity-[0.08] blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00a2ff] opacity-[0.08] blur-[120px] rounded-full" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Page Header */}
        <div className="text-center mb-12">
          <FadeIn>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-white">
              Explore Services
            </h1>
            <BlurText 
              text="Find the perfect service for your project from our talented freelancers"
              className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto"
            />
          </FadeIn>
        </div>

        {/* Filters section */}
        <div className="container mx-auto px-4 mb-8">
          <div className="flex flex-col gap-4 bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/10">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between w-full">
              <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                {/* Search input */}
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search services..."
                    className="w-full bg-black/50 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#9945FF]/50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                {/* Category filter */}
                <div className="relative w-full md:w-48">
                  <select
                    className="w-full appearance-none bg-black/50 border border-white/10 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-[#9945FF]/50"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 text-gray-400 h-4 w-4" />
                </div>
              </div>
              
              {/* Sort options */}
              <div className="relative w-full md:w-48">
                <select
                  className="w-full appearance-none bg-black/50 border border-white/10 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-[#9945FF]/50"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="recommended">Recommended</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                </select>
                <ArrowUpDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
            </div>
            
            {/* Advanced filters */}
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center pt-2">
              {/* Price range slider */}
              <div className="w-full md:w-1/2">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-white text-sm">Price Range: ${priceRange[0]} - ${priceRange[1]}</label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setPriceRange([0, 1000])}
                    className="h-6 text-xs text-gray-400 hover:text-white"
                  >
                    Reset
                  </Button>
                </div>
                <Slider
                  defaultValue={[0, 1000]}
                  min={0}
                  max={1000}
                  step={10}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="py-4"
                />
              </div>
              
              {/* Favorites filter */}
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${showFavoritesOnly ? 'bg-[#9945FF]/20 border-[#9945FF]' : 'bg-black/50 border-white/10'} transition-all duration-200`}
                >
                  <Heart className={`h-4 w-4 ${showFavoritesOnly ? 'text-[#9945FF] fill-[#9945FF]' : 'text-gray-400'}`} />
                  <span className={`text-sm ${showFavoritesOnly ? 'text-white' : 'text-gray-400'}`}>Favorites Only</span>
                </button>
                <Badge variant="outline" className="bg-black/50">{favorites.length}</Badge>
              </div>
              
              {/* Results count */}
              <div className="ml-auto text-sm text-gray-400">
                {filteredServices.length} services found
              </div>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="container mx-auto px-4 mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredServices.map((service) => (
              <div key={service.id} className="group bg-black/40 backdrop-blur-md border border-gray-800/50 hover:border-[#9945FF]/50 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-[#9945FF]/20">
                <div className="relative h-48 overflow-hidden">
                  <Image 
                    src={service.image} 
                    alt={service.title}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-[#9945FF]/80 hover:bg-[#9945FF] text-white border-none">
                      {service.category}
                    </Badge>
                  </div>
                  
                  {/* Quick view button */}
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setQuickViewService(service);
                    }}
                    className="absolute bottom-3 left-3 bg-black/70 hover:bg-black text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  
                  {/* Favorite button */}
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFavorite(service.id);
                    }}
                    className="absolute top-3 right-3 bg-black/70 hover:bg-black text-white p-2 rounded-lg transition-all duration-300"
                  >
                    <Heart className={`w-4 h-4 ${favorites.includes(service.id) ? 'text-[#9945FF] fill-[#9945FF]' : 'text-white'}`} />
                  </button>
                </div>
                
                <Link href={`/services/${service.id}`}>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full overflow-hidden">
                        <Image 
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(service.seller.name)}&background=random&color=fff`} 
                          alt={service.seller.name}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-gray-300 text-sm">{service.seller.name}</span>
                      {service.seller.level === "Top Rated" && (
                        <Badge variant="outline" className="ml-auto border-[#00a2ff] text-[#00a2ff] text-xs">
                          <Zap className="w-3 h-3 mr-1" />
                          Top Rated
                        </Badge>
                      )}
                    </div>
                    
                    <h3 className="text-white font-medium mb-2 line-clamp-2 group-hover:text-[#9945FF] transition-colors">
                      {service.title}
                    </h3>
                    
                    <div className="flex items-center gap-1 mb-3">
                      <div className="flex items-center text-yellow-400">
                        <Star className="w-4 h-4 fill-current" />
                      </div>
                      <span className="text-white">{service.rating}</span>
                      <span className="text-gray-400 text-sm">({service.reviews})</span>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-gray-800/50">
                      <div className="flex items-center text-gray-300">
                        <Clock className="w-4 h-4 mr-1" />
                        <span className="text-sm">{service.deliveryTime}</span>
                      </div>
                      <div className="text-white font-semibold">
                        From ${service.price}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="container mx-auto px-4 mb-16">
          <div className="bg-gradient-to-r from-[#9945FF]/20 to-[#00a2ff]/20 backdrop-blur-md border border-white/10 rounded-xl p-8 md:p-12">
            <FadeIn>
              <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Ready to offer your services?
                </h2>
                <p className="text-gray-300 text-lg mb-8">
                  Join our community of professional freelancers and start selling your services to clients worldwide
                </p>
                
                <Link href="/register-seller" className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r from-[#9945FF] to-[#00a2ff] text-white font-semibold text-lg hover:shadow-lg hover:shadow-[#9945FF]/20 transition-all duration-300">
                  Start Selling Today
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewService && (
        <Dialog open={!!quickViewService} onOpenChange={() => setQuickViewService(null)}>
          <DialogContent className="bg-gray-950/95 backdrop-blur-xl border border-gray-800 text-white max-w-3xl">
            <DialogHeader>
              <div className="flex justify-between items-center">
                <DialogTitle className="text-xl font-semibold text-white">{quickViewService.title}</DialogTitle>
                <DialogClose className="text-gray-400 hover:text-white">
                  <X className="h-5 w-5" />
                </DialogClose>
              </div>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative rounded-lg overflow-hidden">
                <Image 
                  src={quickViewService.image} 
                  alt={quickViewService.title}
                  width={500}
                  height={300}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-3 left-3 bg-[#9945FF]/80 text-white border-none">
                  {quickViewService.category}
                </Badge>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <Image 
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(quickViewService.seller.name)}&background=random&color=fff`} 
                      alt={quickViewService.seller.name}
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-gray-300">{quickViewService.seller.name}</span>
                  {quickViewService.seller.level === "Top Rated" && (
                    <Badge variant="outline" className="ml-auto border-[#00a2ff] text-[#00a2ff] text-xs">
                      <Zap className="w-3 h-3 mr-1" />
                      Top Rated
                    </Badge>
                  )}
                </div>
                
                <p className="text-gray-300 mb-4">{quickViewService.description}</p>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-white">{quickViewService.rating}</span>
                    <span className="text-gray-400 text-sm">({quickViewService.reviews})</span>
                  </div>
                  
                  <div className="flex items-center text-gray-300">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{quickViewService.deliveryTime}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-6 pt-4 border-t border-gray-800">
                  <div className="text-sm text-gray-400">Starting at</div>
                  <div className="text-white font-bold text-2xl">${quickViewService.price}</div>
                </div>
                
                <div className="flex gap-3">
                  <Link 
                    href={`/services/${quickViewService.id}`}
                    className="flex-1 bg-gradient-to-r from-[#9945FF] to-[#00a2ff] text-white py-2 px-4 rounded-lg text-center font-medium hover:shadow-lg hover:shadow-[#9945FF]/20 transition-all duration-300"
                  >
                    View Details
                  </Link>
                  
                  <Button 
                    variant="outline" 
                    className="border-white/20 hover:bg-white/10 text-white"
                    onClick={() => toggleFavorite(quickViewService.id)}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${favorites.includes(quickViewService.id) ? 'text-[#9945FF] fill-[#9945FF]' : ''}`} />
                    {favorites.includes(quickViewService.id) ? 'Saved' : 'Save'}
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Toast notifications */}
      <Toaster />
    </div>
  );
}
