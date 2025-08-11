"use client";

import { useState } from "react";
import { 
  Search, 
  MoreHorizontal, 
  Filter, 
  Download,
  Edit,
  Eye,
  Trash2,
  Star,
  Clock,
  Tag,
  CheckCircle,
  XCircle
} from "lucide-react";

// Define types for our data
interface Seller {
  id: number;
  name: string;
  avatar: string;
  level: string;
}

interface Service {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  deliveryTime: string;
  seller: Seller;
  status: "Active" | "Inactive";
  featured: boolean;
  createdAt: string;
  image: string;
}
import FadeIn from "@/components/FadeIn";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";

// Mock data for services
const mockServices: Service[] = [
  {
    id: 1,
    title: "Professional Logo Design",
    description: "I will design a modern and professional logo for your business",
    category: "Design",
    price: 120,
    rating: 4.9,
    reviews: 87,
    deliveryTime: "3 days",
    seller: {
      id: 1,
      name: "Sarah Williams",
      avatar: "https://ui-avatars.com/api/?name=Sarah+Williams&background=random&color=fff",
      level: "Top Rated"
    },
    status: "Active",
    featured: true,
    createdAt: "2023-06-15",
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
  },
  {
    id: 2,
    title: "Website Development with React",
    description: "I will build a responsive website using React and Next.js",
    category: "Development",
    price: 450,
    rating: 4.8,
    reviews: 65,
    deliveryTime: "7 days",
    seller: {
      id: 2,
      name: "James Wilson",
      avatar: "https://ui-avatars.com/api/?name=James+Wilson&background=random&color=fff",
      level: "Level 2"
    },
    status: "Active",
    featured: false,
    createdAt: "2023-07-02",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
  },
  {
    id: 3,
    title: "Social Media Management",
    description: "I will manage your social media accounts and create engaging content",
    category: "Marketing",
    price: 200,
    rating: 4.7,
    reviews: 42,
    deliveryTime: "30 days",
    seller: {
      id: 3,
      name: "Lisa Anderson",
      avatar: "https://ui-avatars.com/api/?name=Lisa+Anderson&background=random&color=fff",
      level: "Level 2"
    },
    status: "Active",
    featured: true,
    createdAt: "2023-05-20",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
  },
  {
    id: 4,
    title: "Content Writing",
    description: "I will write SEO-optimized blog posts and articles for your website",
    category: "Writing",
    price: 80,
    rating: 4.6,
    reviews: 38,
    deliveryTime: "2 days",
    seller: {
      id: 4,
      name: "Jessica Miller",
      avatar: "https://ui-avatars.com/api/?name=Jessica+Miller&background=random&color=fff",
      level: "Level 1"
    },
    status: "Inactive",
    featured: false,
    createdAt: "2023-07-10",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
  },
  {
    id: 5,
    title: "Video Editing",
    description: "I will edit your videos professionally with effects and transitions",
    category: "Multimedia",
    price: 150,
    rating: 4.9,
    reviews: 56,
    deliveryTime: "4 days",
    seller: {
      id: 5,
      name: "Robert Taylor",
      avatar: "https://ui-avatars.com/api/?name=Robert+Taylor&background=random&color=fff",
      level: "Top Rated"
    },
    status: "Active",
    featured: true,
    createdAt: "2023-06-05",
    image: "https://images.unsplash.com/photo-1536240478700-b869070f9279?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
  },
  {
    id: 6,
    title: "UI/UX Design",
    description: "I will design beautiful and user-friendly interfaces for your app or website",
    category: "Design",
    price: 350,
    rating: 4.9,
    reviews: 72,
    deliveryTime: "5 days",
    seller: {
      id: 6,
      name: "Emma Thompson",
      avatar: "https://ui-avatars.com/api/?name=Emma+Thompson&background=random&color=fff",
      level: "Top Rated"
    },
    status: "Active",
    featured: false,
    createdAt: "2023-04-18",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
  },
  {
    id: 7,
    title: "Mobile App Development",
    description: "I will develop a cross-platform mobile app using React Native",
    category: "Development",
    price: 600,
    rating: 4.8,
    reviews: 51,
    deliveryTime: "14 days",
    seller: {
      id: 7,
      name: "David Wilson",
      avatar: "https://ui-avatars.com/api/?name=David+Wilson&background=random&color=fff",
      level: "Level 2"
    },
    status: "Active",
    featured: false,
    createdAt: "2023-05-30",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
  }
];

export default function ServicesManagement() {
  const [services, setServices] = useState<Service[]>(mockServices);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Filter services based on search term, category, and status
  const filteredServices = services.filter(service => {
    const matchesSearch = 
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "All" || service.category === selectedCategory;
    const matchesStatus = selectedStatus === "All" || service.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Get unique categories for filter
  const categories = ["All", ...new Set(services.map(s => s.category))];

  // Toggle featured status
  const toggleFeatured = (id: number) => {
    setServices(services.map(service => {
      if (service.id === id) {
        return { ...service, featured: !service.featured };
      }
      return service;
    }));
  };

  // Toggle service status
  const toggleStatus = (id: number) => {
    setServices(services.map(service => {
      if (service.id === id) {
        const newStatus = service.status === "Active" ? "Inactive" : "Active";
        return { ...service, status: newStatus };
      }
      return service;
    }));
  };

  // Handle service deletion
  const handleDeleteService = () => {
    if (selectedService) {
      setServices(services.filter(service => service.id !== selectedService.id));
    }
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Services Management</h1>
            <p className="text-gray-400">Manage all services on the platform</p>
          </div>
          <Button className="bg-gradient-to-r from-[#9945FF] to-[#00a2ff] hover:from-[#8935EF] hover:to-[#0092EF] text-white">
            Add New Service
          </Button>
        </div>
      </FadeIn>

      {/* Filters and Search */}
      <FadeIn>
        <Card className="bg-gray-900 border-gray-800 text-white shadow-lg">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input 
                  placeholder="Search services..." 
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus-visible:ring-[#9945FF]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white focus:ring-[#9945FF]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[150px] bg-gray-800 border-gray-700 text-white focus:ring-[#9945FF]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="All">All Status</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Services Table */}
      <FadeIn>
        <Card className="bg-gray-900 border-gray-800 text-white shadow-lg">
          <CardContent className="p-0">
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Showing {filteredServices.length} of {services.length} services
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-800 hover:bg-gray-800/50">
                    <TableHead className="text-gray-400">Service</TableHead>
                    <TableHead className="text-gray-400">Category</TableHead>
                    <TableHead className="text-gray-400">Price</TableHead>
                    <TableHead className="text-gray-400">Rating</TableHead>
                    <TableHead className="text-gray-400">Seller</TableHead>
                    <TableHead className="text-gray-400">Status</TableHead>
                    <TableHead className="text-gray-400">Featured</TableHead>
                    <TableHead className="text-gray-400 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServices.map((service) => (
                    <TableRow key={service.id} className="border-gray-800 hover:bg-gray-800/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-md overflow-hidden">
                            <Image 
                              src={service.image} 
                              alt={service.title}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium line-clamp-1">{service.title}</div>
                            <div className="text-sm text-gray-400 line-clamp-1">{service.description}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-gray-800/50 text-gray-300 border-gray-700">
                          {service.category}
                        </Badge>
                      </TableCell>
                      <TableCell>${service.price}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                          <span>{service.rating}</span>
                          <span className="text-gray-400 text-sm ml-1">({service.reviews})</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full overflow-hidden">
                            <Image 
                              src={service.seller.avatar} 
                              alt={service.seller.name}
                              width={24}
                              height={24}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span>{service.seller.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Switch 
                          checked={service.status === "Active"} 
                          onCheckedChange={() => toggleStatus(service.id)}
                          className="data-[state=checked]:bg-green-500"
                        />
                      </TableCell>
                      <TableCell>
                        <Switch 
                          checked={service.featured} 
                          onCheckedChange={() => toggleFeatured(service.id)}
                          className="data-[state=checked]:bg-[#9945FF]"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-800"
                            onClick={() => {
                              setSelectedService(service);
                              setIsViewDialogOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-800"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-gray-400 hover:text-red-400 hover:bg-gray-800"
                            onClick={() => {
                              setSelectedService(service);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      {/* View Service Dialog */}
      {selectedService && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-3xl">
            <DialogHeader>
              <DialogTitle>Service Details</DialogTitle>
              <DialogDescription className="text-gray-400">
                Detailed information about this service.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              {/* Service Header */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="aspect-video relative rounded-lg overflow-hidden">
                  <Image 
                    src={selectedService.image} 
                    alt={selectedService.title}
                    width={600}
                    height={338}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-[#9945FF]/80 text-white border-none">
                      {selectedService.category}
                    </Badge>
                  </div>
                  {selectedService.featured && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-yellow-500/80 text-white border-none">
                        Featured
                      </Badge>
                    </div>
                  )}
                </div>
                
                <div>
                  <h2 className="text-xl font-bold mb-2">{selectedService.title}</h2>
                  <p className="text-gray-400 mb-4">{selectedService.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label className="text-gray-400 mb-1 block">Price</Label>
                      <div className="text-xl font-bold">${selectedService.price}</div>
                    </div>
                    <div>
                      <Label className="text-gray-400 mb-1 block">Delivery Time</Label>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1 text-gray-400" />
                        {selectedService.deliveryTime}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label className="text-gray-400 mb-1 block">Rating</Label>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                        <span>{selectedService.rating}</span>
                        <span className="text-gray-400 text-sm ml-1">({selectedService.reviews} reviews)</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-400 mb-1 block">Status</Label>
                      <div className={`flex items-center ${
                        selectedService.status === "Active" 
                          ? "text-green-400" 
                          : "text-red-400"
                      }`}>
                        {selectedService.status === "Active" ? (
                          <CheckCircle className="w-4 h-4 mr-1" />
                        ) : (
                          <XCircle className="w-4 h-4 mr-1" />
                        )}
                        {selectedService.status}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <Label className="text-gray-400 mb-1 block">Seller</Label>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full overflow-hidden">
                        <Image 
                          src={selectedService.seller.avatar} 
                          alt={selectedService.seller.name}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{selectedService.seller.name}</div>
                        <div className="text-xs text-gray-400">{selectedService.seller.level}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-gray-400 mb-1 block">Created At</Label>
                    <div>{selectedService.createdAt}</div>
                  </div>
                </div>
              </div>
              
              {/* Service Actions */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-800">
                <Button 
                  variant="outline" 
                  className={`border-gray-700 ${
                    selectedService.featured 
                      ? "text-yellow-400 hover:text-yellow-300" 
                      : "text-gray-300 hover:bg-gray-800"
                  }`}
                  onClick={() => {
                    if (selectedService) {
                      toggleFeatured(selectedService.id);
                      setSelectedService({...selectedService, featured: !selectedService.featured});
                    }
                  }}
                >
                  {selectedService.featured ? "Remove from Featured" : "Add to Featured"}
                </Button>
                
                <Button 
                  variant="outline" 
                  className={`border-gray-700 ${
                    selectedService.status === "Active" 
                      ? "text-red-400 hover:text-red-300" 
                      : "text-green-400 hover:text-green-300"
                  }`}
                  onClick={() => {
                    if (selectedService) {
                      toggleStatus(selectedService.id);
                      setSelectedService({
                        ...selectedService, 
                        status: selectedService.status === "Active" ? "Inactive" : "Active"
                      });
                    }
                  }}
                >
                  {selectedService.status === "Active" ? "Deactivate Service" : "Activate Service"}
                </Button>
              </div>
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button 
                  variant="outline" 
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  Close
                </Button>
              </DialogClose>
              <Button 
                className="bg-gradient-to-r from-[#9945FF] to-[#00a2ff] hover:from-[#8935EF] hover:to-[#0092EF] text-white"
              >
                Edit Service
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Service Dialog */}
      {selectedService && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Service</DialogTitle>
              <DialogDescription className="text-gray-400">
                Are you sure you want to delete this service? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400">
                  You are about to delete <span className="font-semibold">{selectedService?.title}</span>.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleDeleteService}
              >
                Delete Service
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
