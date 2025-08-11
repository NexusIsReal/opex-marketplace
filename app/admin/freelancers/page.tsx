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
  CheckCircle,
  XCircle,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Briefcase,
  Award,
  DollarSign,
  Shield,
  BadgeCheck
} from "lucide-react";

// Define types for our data
interface PortfolioItem {
  title: string;
  description: string;
  image: string;
}

interface Freelancer {
  id: number;
  name: string;
  avatar: string;
  email: string;
  category: string;
  rating: number;
  reviews: number;
  level: string;
  earnings: string;
  completedJobs: number;
  joinDate: string;
  verified: boolean;
  featured: boolean;
  skills: string[];
  languages: string[];
  portfolio: PortfolioItem[];
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
import Image from "next/image";

// Mock data for freelancers
const mockFreelancers: Freelancer[] = [
  {
    id: 1,
    name: "Sarah Williams",
    avatar: "https://ui-avatars.com/api/?name=Sarah+Williams&background=random&color=fff",
    email: "sarah.w@example.com",
    category: "Web Development",
    rating: 4.9,
    reviews: 87,
    level: "Top Rated",
    earnings: "$12,450",
    completedJobs: 42,
    joinDate: "2023-02-15",
    verified: true,
    featured: true,
    skills: ["React", "Next.js", "TypeScript", "Node.js", "MongoDB"],
    languages: ["English (Native)", "Spanish (Fluent)"],
    portfolio: [
      {
        title: "E-commerce Website",
        description: "Built a full-stack e-commerce platform with Next.js and Stripe integration",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      },
      {
        title: "SaaS Dashboard",
        description: "Designed and developed an analytics dashboard for a SaaS company",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      }
    ]
  },
  {
    id: 2,
    name: "Emily Davis",
    avatar: "https://ui-avatars.com/api/?name=Emily+Davis&background=random&color=fff",
    email: "emily.d@example.com",
    category: "Graphic Design",
    rating: 4.8,
    reviews: 65,
    level: "Level 2",
    earnings: "$8,320",
    completedJobs: 31,
    joinDate: "2023-03-22",
    verified: true,
    featured: false,
    skills: ["Adobe Photoshop", "Illustrator", "UI/UX Design", "Logo Design", "Branding"],
    languages: ["English (Native)", "French (Basic)"],
    portfolio: [
      {
        title: "Brand Identity Package",
        description: "Created complete brand identity for a tech startup",
        image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      }
    ]
  },
  {
    id: 3,
    name: "Jessica Miller",
    avatar: "https://ui-avatars.com/api/?name=Jessica+Miller&background=random&color=fff",
    email: "jessica.m@example.com",
    category: "Content Writing",
    rating: 4.7,
    reviews: 42,
    level: "Level 1",
    earnings: "$5,120",
    completedJobs: 28,
    joinDate: "2023-05-10",
    verified: true,
    featured: false,
    skills: ["SEO Writing", "Blog Posts", "Copywriting", "Technical Writing", "Editing"],
    languages: ["English (Native)"],
    portfolio: [
      {
        title: "Tech Blog Articles",
        description: "Series of SEO-optimized articles for a tech blog",
        image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      }
    ]
  },
  {
    id: 4,
    name: "Robert Taylor",
    avatar: "https://ui-avatars.com/api/?name=Robert+Taylor&background=random&color=fff",
    email: "robert.t@example.com",
    category: "Video Editing",
    rating: 4.9,
    reviews: 56,
    level: "Top Rated",
    earnings: "$15,780",
    completedJobs: 47,
    joinDate: "2022-11-18",
    verified: true,
    featured: true,
    skills: ["Adobe Premiere Pro", "After Effects", "Final Cut Pro", "Motion Graphics", "Color Grading"],
    languages: ["English (Native)", "German (Conversational)"],
    portfolio: [
      {
        title: "Product Promo Video",
        description: "Created promotional video for tech product launch",
        image: "https://images.unsplash.com/photo-1536240478700-b869070f9279?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      }
    ]
  },
  {
    id: 5,
    name: "Lisa Anderson",
    avatar: "https://ui-avatars.com/api/?name=Lisa+Anderson&background=random&color=fff",
    email: "lisa.a@example.com",
    category: "Digital Marketing",
    rating: 4.6,
    reviews: 38,
    level: "Level 2",
    earnings: "$7,890",
    completedJobs: 25,
    joinDate: "2023-01-05",
    verified: true,
    featured: false,
    skills: ["Social Media Marketing", "Google Ads", "Facebook Ads", "Email Marketing", "SEO"],
    languages: ["English (Native)", "Portuguese (Fluent)"],
    portfolio: [
      {
        title: "E-commerce Marketing Campaign",
        description: "Managed successful marketing campaign for online store",
        image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      }
    ]
  },
  {
    id: 6,
    name: "James Wilson",
    avatar: "https://ui-avatars.com/api/?name=James+Wilson&background=random&color=fff",
    email: "james.w@example.com",
    category: "Mobile Development",
    rating: 4.8,
    reviews: 51,
    level: "Level 2",
    earnings: "$10,450",
    completedJobs: 33,
    joinDate: "2023-02-28",
    verified: true,
    featured: false,
    skills: ["React Native", "Flutter", "iOS Development", "Android Development", "Firebase"],
    languages: ["English (Native)", "Mandarin (Basic)"],
    portfolio: [
      {
        title: "Fitness Tracking App",
        description: "Developed cross-platform mobile app for fitness tracking",
        image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      }
    ]
  },
  {
    id: 7,
    name: "Emma Thompson",
    avatar: "https://ui-avatars.com/api/?name=Emma+Thompson&background=random&color=fff",
    email: "emma.t@example.com",
    category: "UI/UX Design",
    rating: 4.9,
    reviews: 72,
    level: "Top Rated",
    earnings: "$18,320",
    completedJobs: 55,
    joinDate: "2022-09-15",
    verified: true,
    featured: true,
    skills: ["Figma", "Adobe XD", "Sketch", "Prototyping", "User Research"],
    languages: ["English (Native)", "Italian (Conversational)"],
    portfolio: [
      {
        title: "Banking App Redesign",
        description: "Complete UX research and UI redesign for banking application",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      }
    ]
  }
];

export default function FreelancersManagement() {
  const [freelancers, setFreelancers] = useState<Freelancer[]>(mockFreelancers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [selectedFreelancer, setSelectedFreelancer] = useState<Freelancer | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("skills");

  // Filter freelancers based on search term, category, and level
  const filteredFreelancers = freelancers.filter(freelancer => {
    const matchesSearch = 
      freelancer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      freelancer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      freelancer.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "All" || freelancer.category === selectedCategory;
    const matchesLevel = selectedLevel === "All" || freelancer.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  // Get unique categories for filter
  const categories = ["All", ...new Set(freelancers.map(f => f.category))];
  
  // Get unique levels for filter
  const levels = ["All", ...new Set(freelancers.map(f => f.level))];

  // Toggle featured status
  const toggleFeatured = (id: number) => {
    setFreelancers(freelancers.map(freelancer => {
      if (freelancer.id === id) {
        return { ...freelancer, featured: !freelancer.featured };
      }
      return freelancer;
    }));
  };

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Freelancers Management</h1>
            <p className="text-gray-400">Manage all freelancers on the platform</p>
          </div>
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
                  placeholder="Search freelancers..." 
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
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="w-[150px] bg-gray-800 border-gray-700 text-white focus:ring-[#9945FF]">
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    {levels.map(level => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
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

      {/* Freelancers Table */}
      <FadeIn>
        <Card className="bg-gray-900 border-gray-800 text-white shadow-lg">
          <CardContent className="p-0">
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Showing {filteredFreelancers.length} of {freelancers.length} freelancers
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800 hover:bg-gray-800/50">
                  <TableHead className="text-gray-400">Freelancer</TableHead>
                  <TableHead className="text-gray-400">Category</TableHead>
                  <TableHead className="text-gray-400">Rating</TableHead>
                  <TableHead className="text-gray-400">Level</TableHead>
                  <TableHead className="text-gray-400">Earnings</TableHead>
                  <TableHead className="text-gray-400">Jobs</TableHead>
                  <TableHead className="text-gray-400">Featured</TableHead>
                  <TableHead className="text-gray-400 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFreelancers.map((freelancer) => (
                  <TableRow key={freelancer.id} className="border-gray-800 hover:bg-gray-800/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          <Image 
                            src={freelancer.avatar} 
                            alt={freelancer.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium flex items-center">
                            {freelancer.name}
                            {freelancer.verified && (
                              <BadgeCheck className="w-4 h-4 text-blue-400 ml-1" />
                            )}
                          </div>
                          <div className="text-sm text-gray-400">{freelancer.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-gray-800/50 text-gray-300 border-gray-700">
                        {freelancer.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                        <span>{freelancer.rating}</span>
                        <span className="text-gray-400 text-sm ml-1">({freelancer.reviews})</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        freelancer.level === "Top Rated" 
                          ? "bg-purple-500/20 text-purple-400" 
                          : freelancer.level === "Level 2"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-green-500/20 text-green-400"
                      }`}>
                        {freelancer.level}
                      </span>
                    </TableCell>
                    <TableCell>{freelancer.earnings}</TableCell>
                    <TableCell>{freelancer.completedJobs}</TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={`${
                          freelancer.featured 
                            ? "text-yellow-400 hover:text-yellow-300" 
                            : "text-gray-400 hover:text-gray-300"
                        }`}
                        onClick={() => toggleFeatured(freelancer.id)}
                      >
                        <Shield className={`h-5 w-5 ${freelancer.featured ? "fill-yellow-400/20" : ""}`} />
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-800"
                          onClick={() => {
                            setSelectedFreelancer(freelancer);
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
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-800">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800 text-gray-300">
                            <DropdownMenuItem className="hover:bg-gray-800 hover:text-white cursor-pointer">
                              View Services
                            </DropdownMenuItem>
                            <DropdownMenuItem className="hover:bg-gray-800 hover:text-white cursor-pointer">
                              Message
                            </DropdownMenuItem>
                            <DropdownMenuItem className="hover:bg-gray-800 hover:text-red-400 cursor-pointer">
                              Suspend Account
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </FadeIn>

      {/* View Freelancer Dialog */}
      {selectedFreelancer && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-3xl">
            <DialogHeader>
              <DialogTitle>Freelancer Profile</DialogTitle>
              <DialogDescription className="text-gray-400">
                Detailed information about this freelancer.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              {/* Profile Header */}
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-24 h-24 rounded-full overflow-hidden">
                  <Image 
                    src={selectedFreelancer?.avatar || ""} 
                    alt={selectedFreelancer?.name || ""}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold">{selectedFreelancer?.name}</h2>
                    {selectedFreelancer?.verified && (
                      <BadgeCheck className="w-5 h-5 text-blue-400" />
                    )}
                    {selectedFreelancer?.featured && (
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-400">{selectedFreelancer?.email}</p>
                  
                  <div className="flex flex-wrap gap-3 mt-3">
                    <div className="flex items-center">
                      <Briefcase className="w-4 h-4 text-gray-400 mr-1" />
                      <span>{selectedFreelancer?.category}</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                      <span>{selectedFreelancer?.rating}</span>
                      <span className="text-gray-400 text-sm ml-1">({selectedFreelancer?.reviews} reviews)</span>
                    </div>
                    <div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        selectedFreelancer?.level === "Top Rated" 
                          ? "bg-purple-500/20 text-purple-400" 
                          : selectedFreelancer?.level === "Level 2"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-green-500/20 text-green-400"
                      }`}>
                        {selectedFreelancer?.level}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 text-right">
                  <div>
                    <div className="text-sm text-gray-400">Total Earnings</div>
                    <div className="text-xl font-bold">{selectedFreelancer?.earnings}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Completed Jobs</div>
                    <div className="font-semibold">{selectedFreelancer?.completedJobs}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Joined</div>
                    <div>{selectedFreelancer?.joinDate}</div>
                  </div>
                </div>
              </div>
              
              {/* Tabs for more details */}
              <Tabs defaultValue="skills" className="w-full">
                <TabsList className="bg-gray-800 border-gray-700">
                  <TabsTrigger value="skills" className="data-[state=active]:bg-gray-700">Skills & Languages</TabsTrigger>
                  <TabsTrigger value="portfolio" className="data-[state=active]:bg-gray-700">Portfolio</TabsTrigger>
                </TabsList>
                <TabsContent value="skills" className="pt-4">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-gray-400 mb-2 block">Skills</Label>
                      <div className="flex flex-wrap gap-2">
                        {selectedFreelancer?.skills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="bg-gray-800 border-gray-700">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-400 mb-2 block">Languages</Label>
                      <div className="flex flex-wrap gap-2">
                        {selectedFreelancer?.languages.map((language, index) => (
                          <div key={index} className="text-sm">{language}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="portfolio" className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedFreelancer?.portfolio.map((item, index) => (
                      <div key={index} className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                        <div className="aspect-video relative">
                          <Image 
                            src={item.image} 
                            alt={item.title}
                            width={400}
                            height={225}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-3">
                          <h3 className="font-medium">{item.title}</h3>
                          <p className="text-sm text-gray-400">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
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
                Message Freelancer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
