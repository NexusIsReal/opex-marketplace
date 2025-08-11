"use client";

import { useState } from "react";
import { 
  Users, 
  Briefcase, 
  ShoppingBag, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Calendar
} from "lucide-react";
import FadeIn from "@/components/FadeIn";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

// Mock data for dashboard stats
const dashboardStats = [
  {
    title: "Total Users",
    value: "2,856",
    change: "+12%",
    trend: "up",
    icon: <Users className="w-5 h-5" />,
    color: "from-blue-600 to-blue-400",
  },
  {
    title: "Freelancers",
    value: "1,325",
    change: "+18%",
    trend: "up",
    icon: <Briefcase className="w-5 h-5" />,
    color: "from-purple-600 to-purple-400",
  },
  {
    title: "Services",
    value: "4,120",
    change: "+5%",
    trend: "up",
    icon: <ShoppingBag className="w-5 h-5" />,
    color: "from-green-600 to-green-400",
  },
  {
    title: "Revenue",
    value: "$42,500",
    change: "-3%",
    trend: "down",
    icon: <DollarSign className="w-5 h-5" />,
    color: "from-orange-600 to-orange-400",
  },
];

// Mock data for recent users
const recentUsers = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    role: "Client",
    status: "Active",
    joinDate: "2023-08-05",
  },
  {
    id: 2,
    name: "Sarah Williams",
    email: "sarah.w@example.com",
    role: "Freelancer",
    status: "Active",
    joinDate: "2023-08-04",
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael.b@example.com",
    role: "Client",
    status: "Inactive",
    joinDate: "2023-08-03",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.d@example.com",
    role: "Freelancer",
    status: "Active",
    joinDate: "2023-08-02",
  },
  {
    id: 5,
    name: "David Wilson",
    email: "david.w@example.com",
    role: "Client",
    status: "Active",
    joinDate: "2023-08-01",
  },
];

// Mock data for recent services
const recentServices = [
  {
    id: 1,
    title: "Professional Logo Design",
    category: "Design",
    seller: "Sarah Williams",
    price: "$120",
    status: "Active",
  },
  {
    id: 2,
    title: "Website Development",
    category: "Development",
    seller: "Emily Davis",
    price: "$450",
    status: "Active",
  },
  {
    id: 3,
    title: "Social Media Management",
    category: "Marketing",
    seller: "James Miller",
    price: "$200",
    status: "Active",
  },
  {
    id: 4,
    title: "Content Writing",
    category: "Writing",
    seller: "Lisa Anderson",
    price: "$80",
    status: "Inactive",
  },
  {
    id: 5,
    title: "Video Editing",
    category: "Multimedia",
    seller: "Robert Taylor",
    price: "$150",
    status: "Active",
  },
];

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState("This Week");

  return (
    <div className="space-y-8">
      <FadeIn>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400">Welcome back, Admin</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
              <Calendar className="mr-2 h-4 w-4" />
              {timeRange}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800 text-gray-300">
                <DropdownMenuItem className="hover:bg-gray-800 hover:text-white cursor-pointer">
                  Refresh Data
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-800 hover:text-white cursor-pointer">
                  Export Report
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-800 hover:text-white cursor-pointer">
                  Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </FadeIn>

      {/* Stats Cards */}
      <FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {dashboardStats.map((stat, index) => (
            <Card key={index} className="bg-gray-900 border-gray-800 text-white shadow-lg">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <div className="flex items-center">
                    <span className={`text-sm ${stat.trend === "up" ? "text-green-400" : "text-red-400"}`}>
                      {stat.change}
                    </span>
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="w-4 h-4 text-green-400" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-gray-400 text-sm">{stat.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </FadeIn>

      {/* Recent Users */}
      <FadeIn>
        <Card className="bg-gray-900 border-gray-800 text-white shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Users</CardTitle>
                <CardDescription className="text-gray-400">
                  Latest user registrations
                </CardDescription>
              </div>
              <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800 hover:bg-gray-800/50">
                  <TableHead className="text-gray-400">Name</TableHead>
                  <TableHead className="text-gray-400">Email</TableHead>
                  <TableHead className="text-gray-400">Role</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-gray-400">Join Date</TableHead>
                  <TableHead className="text-gray-400 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentUsers.map((user) => (
                  <TableRow key={user.id} className="border-gray-800 hover:bg-gray-800/50">
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.role === "Freelancer" 
                          ? "bg-purple-500/20 text-purple-400" 
                          : "bg-blue-500/20 text-blue-400"
                      }`}>
                        {user.role}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.status === "Active" 
                          ? "bg-green-500/20 text-green-400" 
                          : "bg-red-500/20 text-red-400"
                      }`}>
                        {user.status}
                      </span>
                    </TableCell>
                    <TableCell>{user.joinDate}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-800">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800 text-gray-300">
                          <DropdownMenuItem className="hover:bg-gray-800 hover:text-white cursor-pointer">
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-gray-800 hover:text-white cursor-pointer">
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-gray-800 hover:text-red-400 cursor-pointer">
                            Suspend User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Recent Services */}
      <FadeIn>
        <Card className="bg-gray-900 border-gray-800 text-white shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Services</CardTitle>
                <CardDescription className="text-gray-400">
                  Latest services added to the platform
                </CardDescription>
              </div>
              <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800 hover:bg-gray-800/50">
                  <TableHead className="text-gray-400">Title</TableHead>
                  <TableHead className="text-gray-400">Category</TableHead>
                  <TableHead className="text-gray-400">Seller</TableHead>
                  <TableHead className="text-gray-400">Price</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-gray-400 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentServices.map((service) => (
                  <TableRow key={service.id} className="border-gray-800 hover:bg-gray-800/50">
                    <TableCell>{service.title}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-full text-xs bg-gray-800 text-gray-300">
                        {service.category}
                      </span>
                    </TableCell>
                    <TableCell>{service.seller}</TableCell>
                    <TableCell>{service.price}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        service.status === "Active" 
                          ? "bg-green-500/20 text-green-400" 
                          : "bg-red-500/20 text-red-400"
                      }`}>
                        {service.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-800">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800 text-gray-300">
                          <DropdownMenuItem className="hover:bg-gray-800 hover:text-white cursor-pointer">
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-gray-800 hover:text-white cursor-pointer">
                            Edit Service
                          </DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-gray-800 hover:text-red-400 cursor-pointer">
                            Deactivate
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}
