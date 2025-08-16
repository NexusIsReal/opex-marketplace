"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { 
  Search, 
  MoreHorizontal, 
  Plus, 
  Filter, 
  Download,
  Trash2,
  Edit,
  Eye,
  CheckCircle,
  XCircle
} from "lucide-react";
import FadeIn from "@/components/FadeIn";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  DialogTrigger,
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
import { Checkbox } from "@/components/ui/checkbox";

// Define types for our data
interface User {
  id: string;
  username: string;
  email: string;
  fullName: string | null;
  role: "USER" | "FREELANCER" | "ADMIN";
  createdAt: string;
  updatedAt: string;
  active?: boolean;
  emailVerified?: Date | null;
  profile?: {
    bio: string | null;
    avatarUrl: string | null;
  } | null;
  // Additional fields for UI display
  status?: "Active" | "Inactive" | "Pending";
  location?: string;
  lastActive?: string;
  verified?: boolean;
  joinDate?: string;
}

// Mock data for users - will be replaced with API data
const mockUsers: User[] = [
  {
    id: "1",
    username: "alexjohnson",
    fullName: "Alex Johnson",
    email: "alex.johnson@example.com",
    role: "USER",
    createdAt: "2023-08-05T00:00:00.000Z",
    updatedAt: "2023-08-10T00:00:00.000Z",
    profile: {
      bio: "Regular user from New York",
      avatarUrl: null
    },
    status: "Active",
    location: "New York, USA",
    lastActive: "2023-08-10",
    verified: true,
    joinDate: "2023-08-05"
  },
  {
    id: "2",
    username: "sarahw",
    fullName: "Sarah Williams",
    email: "sarah.w@example.com",
    role: "FREELANCER",
    createdAt: "2023-08-04T00:00:00.000Z",
    updatedAt: "2023-08-09T00:00:00.000Z",
    profile: {
      bio: "Freelancer from London",
      avatarUrl: null
    },
    status: "Active",
    location: "London, UK",
    lastActive: "2023-08-09",
    verified: true,
    joinDate: "2023-08-04"
  },
  {
    id: "3",
    username: "michaelb",
    fullName: "Michael Brown",
    email: "michael.b@example.com",
    role: "USER",
    createdAt: "2023-08-03T00:00:00.000Z",
    updatedAt: "2023-07-25T00:00:00.000Z",
    profile: null,
    status: "Inactive",
    location: "Toronto, Canada",
    lastActive: "2023-07-25",
    verified: false,
    joinDate: "2023-08-03"
  },
  {
    id: "7",
    username: "robertt",
    fullName: "Robert Taylor",
    email: "robert.t@example.com",
    role: "ADMIN",
    createdAt: "2023-07-28T00:00:00.000Z",
    updatedAt: "2023-08-10T00:00:00.000Z",
    profile: {
      bio: "System administrator",
      avatarUrl: null
    },
    status: "Active",
    location: "Chicago, USA",
    lastActive: "2023-08-10",
    verified: true,
    joinDate: "2023-07-28"
  }
];

export default function UsersManagement() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  
  // Fetch users from API
  useEffect(() => {
    async function fetchUsers() {
      try {
        setError(null);
        setLoading(true);
        const token = localStorage.getItem('token');
        
        const response = await fetch('/api/admin/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          if (response.status === 403) {
            toast.error("You don't have permission to access this page");
            router.push('/auth/login');
            return;
          }
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Log the response to see what we're getting
        console.log('API Response:', data);
        
        // Check if data is an array, if not, try to extract users from it
        const usersArray = Array.isArray(data) ? data : data.users || [];
        
        // Filter out freelancers since they have their own page
        const filteredUsers = usersArray.filter((user: any) => user.role !== 'FREELANCER');
        
        // Transform API data to match our UI needs
        const transformedUsers = filteredUsers.map((user: any) => ({
          ...user,
          status: user.active ? "Active" : "Inactive",
          verified: Boolean(user.emailVerified),
          joinDate: new Date(user.createdAt).toLocaleDateString(),
          lastActive: new Date(user.updatedAt).toLocaleDateString(),
        }));
        
        setUsers(transformedUsers);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError("Failed to load users. Please try again later.");
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [router]);

  // Filter users based on search term, role, and status
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      (user.fullName?.toLowerCase() || user.username.toLowerCase()).includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = selectedRole === "All" || 
      (selectedRole === "Client" && user.role === "USER") ||
      (selectedRole === "Admin" && user.role === "ADMIN");
    const matchesStatus = selectedStatus === "All" || user.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Handle row selection
  const toggleRowSelection = (userId: string) => {
    if (selectedRows.includes(userId)) {
      setSelectedRows(selectedRows.filter(id => id !== userId));
    } else {
      setSelectedRows([...selectedRows, userId]);
    }
  };

  // Handle bulk selection
  const toggleAllRows = () => {
    if (selectedRows.length === filteredUsers.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredUsers.map(user => user.id));
    }
  };

  // Handle user deletion
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      setUsers(users.filter(user => user.id !== selectedUser.id));
      setIsDeleteDialogOpen(false);
      toast.success("User deleted successfully");
    } catch (err) {
      console.error("Failed to delete user:", err);
      toast.error("Failed to delete user");
    }
  };

  // Handle bulk deletion
  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) return;
    
    try {
      const token = localStorage.getItem('token');
      // Delete users one by one
      const deletePromises = selectedRows.map(userId => 
        fetch(`/api/admin/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      );
      
      await Promise.all(deletePromises);
      
      setUsers(users.filter(user => !selectedRows.includes(user.id)));
      setSelectedRows([]);
      toast.success(`${selectedRows.length} users deleted successfully`);
    } catch (err) {
      console.error("Failed to delete users:", err);
      toast.error("Failed to delete some users");
    }
  };

  // Handle user status toggle
  const toggleUserStatus = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    const newStatus = user.status === "Active" ? "Inactive" : "Active";
    const active = newStatus === "Active";
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ active }),
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      setUsers(users.map(u => {
        if (u.id === userId) {
          return { ...u, status: newStatus };
        }
        return u;
      }));
      
      toast.success(`User status updated to ${newStatus}`);
    } catch (err) {
      console.error("Failed to update user status:", err);
      toast.error("Failed to update user status");
    }
  };

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Users Management</h1>
            <p className="text-gray-400">Manage all users on the platform</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-[#9945FF] to-[#00a2ff] hover:from-[#8935EF] hover:to-[#0092EF] text-white">
                <Plus className="mr-2 h-4 w-4" />
                Add New User
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-md">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Create a new user account.
                </DialogDescription>
              </DialogHeader>
              <form id="new-user-form" onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const userData = {
                  username: formData.get('username') as string,
                  email: formData.get('email') as string,
                  password: formData.get('password') as string,
                  fullName: formData.get('fullName') as string,
                  role: formData.get('role') === 'Client' ? 'USER' : 'ADMIN',
                };
                
                try {
                  const token = localStorage.getItem('token');
                  const response = await fetch('/api/admin/users', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(userData),
                  });
                  
                  if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                  }
                  
                  const responseData = await response.json();
                  const newUser = responseData.user || responseData;
                  
                  // Add the new user to the list
                  setUsers([
                    ...users, 
                    {
                      ...newUser,
                      status: 'Active',
                      verified: false,
                      joinDate: new Date(newUser.createdAt).toLocaleDateString(),
                      lastActive: new Date(newUser.updatedAt).toLocaleDateString(),
                    }
                  ]);
                  
                  toast.success("User created successfully");
                  (document.getElementById('new-user-form') as HTMLFormElement).reset();
                  (document.querySelector('[data-dialog-close]') as HTMLButtonElement)?.click();
                } catch (err) {
                  console.error("Failed to create user:", err);
                  toast.error("Failed to create user");
                }
              }}>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input 
                      id="username" 
                      name="username"
                      required
                      className="bg-gray-800 border-gray-700 text-white focus-visible:ring-[#9945FF]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      name="email"
                      type="email"
                      required
                      className="bg-gray-800 border-gray-700 text-white focus-visible:ring-[#9945FF]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      name="password"
                      type="password"
                      required
                      minLength={8}
                      className="bg-gray-800 border-gray-700 text-white focus-visible:ring-[#9945FF]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input 
                      id="fullName" 
                      name="fullName"
                      className="bg-gray-800 border-gray-700 text-white focus-visible:ring-[#9945FF]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select name="role" defaultValue="Client">
                      <SelectTrigger id="role" className="bg-gray-800 border-gray-700 text-white focus:ring-[#9945FF]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        <SelectItem value="Client">Client</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button 
                      type="button"
                      variant="outline" 
                      className="border-gray-700 text-gray-300 hover:bg-gray-800"
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button 
                    type="submit"
                    className="bg-gradient-to-r from-[#9945FF] to-[#00a2ff] hover:from-[#8935EF] hover:to-[#0092EF] text-white"
                  >
                    Create User
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
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
                  placeholder="Search users..." 
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus-visible:ring-[#9945FF]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-[150px] bg-gray-800 border-gray-700 text-white focus:ring-[#9945FF]">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="All">All Roles</SelectItem>
                    <SelectItem value="Client">Client</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
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
                    <SelectItem value="Pending">Pending</SelectItem>
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

      {/* Users Table */}
      <FadeIn>
        {loading ? (
          <Card className="bg-gray-900 border-gray-800 text-white shadow-lg p-8">
            <div className="flex justify-center items-center h-40">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9945FF] mx-auto mb-4"></div>
                <p className="text-gray-400">Loading users...</p>
              </div>
            </div>
          </Card>
        ) : error ? (
          <Card className="bg-gray-900 border-gray-800 text-white shadow-lg p-8">
            <div className="flex justify-center items-center h-40">
              <div className="text-center">
                <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <p className="text-red-400">{error}</p>
                <Button 
                  onClick={() => window.location.reload()} 
                  className="mt-4 bg-gray-800 hover:bg-gray-700 text-white"
                >
                  Retry
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="bg-gray-900 border-gray-800 text-white shadow-lg">
            <CardContent className="p-0">
              <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {selectedRows.length > 0 && (
                  <>
                    <span className="text-sm text-gray-400">
                      {selectedRows.length} selected
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-gray-700 text-red-400 hover:bg-gray-800 hover:text-red-300"
                      onClick={handleBulkDelete}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </>
                )}
              </div>
              <div className="text-sm text-gray-400">
                Showing {filteredUsers.length} of {users.length} users
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800 hover:bg-gray-800/50">
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={selectedRows.length === filteredUsers.length && filteredUsers.length > 0}
                      onCheckedChange={toggleAllRows}
                      className="border-gray-600 data-[state=checked]:bg-[#9945FF] data-[state=checked]:border-[#9945FF]"
                    />
                  </TableHead>
                  <TableHead className="text-gray-400">Name</TableHead>
                  <TableHead className="text-gray-400">Email</TableHead>
                  <TableHead className="text-gray-400">Role</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-gray-400">Join Date</TableHead>
                  <TableHead className="text-gray-400">Verified</TableHead>
                  <TableHead className="text-gray-400 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="border-gray-800 hover:bg-gray-800/50">
                    <TableCell>
                      <Checkbox 
                        checked={selectedRows.includes(user.id)}
                        onCheckedChange={() => toggleRowSelection(user.id)}
                        className="border-gray-600 data-[state=checked]:bg-[#9945FF] data-[state=checked]:border-[#9945FF]"
                      />
                    </TableCell>
                    <TableCell>{user.fullName || user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.role === "FREELANCER" 
                          ? "bg-purple-500/20 text-purple-400" 
                          : user.role === "ADMIN"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-blue-500/20 text-blue-400"
                      }`}>
                        {user.role === "USER" ? "Client" : 
                         user.role === "FREELANCER" ? "Freelancer" : 
                         "Admin"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.status === "Active" 
                          ? "bg-green-500/20 text-green-400" 
                          : user.status === "Pending"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-red-500/20 text-red-400"
                      }`}>
                        {user.status}
                      </span>
                    </TableCell>
                    <TableCell>{user.joinDate || new Date(user.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {user.verified ? (
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-400" />
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-800"
                          onClick={() => {
                            setSelectedUser(user);
                            setIsViewDialogOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-800"
                          onClick={() => {
                            setSelectedUser(user);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-gray-400 hover:text-red-400 hover:bg-gray-800"
                          onClick={() => {
                            setSelectedUser(user);
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
          </CardContent>
        </Card>
        )}
      </FadeIn>

      {/* View User Dialog */}
      {selectedUser && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-md">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
              <DialogDescription className="text-gray-400">
                View detailed information about this user.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-gray-400">Name</Label>
                <div className="text-white font-medium">{selectedUser.fullName || selectedUser.username}</div>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-400">Email</Label>
                <div className="text-white font-medium">{selectedUser.email}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-400">Role</Label>
                  <div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      selectedUser.role === "FREELANCER" 
                        ? "bg-purple-500/20 text-purple-400" 
                        : selectedUser.role === "ADMIN"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-blue-500/20 text-blue-400"
                    }`}>
                      {selectedUser.role === "USER" ? "Client" : 
                       selectedUser.role === "FREELANCER" ? "Freelancer" : 
                       "Admin"}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-400">Status</Label>
                  <div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      selectedUser.status === "Active" 
                        ? "bg-green-500/20 text-green-400" 
                        : selectedUser.status === "Pending"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                    }`}>
                      {selectedUser.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-400">Location</Label>
                <div className="text-white font-medium">{selectedUser.location || "Not specified"}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-400">Join Date</Label>
                  <div className="text-white font-medium">{selectedUser.joinDate || new Date(selectedUser.createdAt).toLocaleDateString()}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-400">Last Active</Label>
                  <div className="text-white font-medium">{selectedUser.lastActive || new Date(selectedUser.updatedAt).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-400">Verified</Label>
                <div className="flex items-center">
                  {selectedUser.verified ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                      <span className="text-green-400">Verified</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-red-400 mr-2" />
                      <span className="text-red-400">Not Verified</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
                onClick={() => setIsViewDialogOpen(false)}
              >
                Close
              </Button>
              <Button 
                className="bg-gradient-to-r from-[#9945FF] to-[#00a2ff] hover:from-[#8935EF] hover:to-[#0092EF] text-white"
                onClick={() => {
                  setIsViewDialogOpen(false);
                  setIsEditDialogOpen(true);
                }}
              >
                Edit User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit User Dialog */}
      {selectedUser && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-md">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription className="text-gray-400">
                Make changes to the user information.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  defaultValue={selectedUser.fullName || selectedUser.username} 
                  className="bg-gray-800 border-gray-700 text-white focus-visible:ring-[#9945FF]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  defaultValue={selectedUser.email} 
                  className="bg-gray-800 border-gray-700 text-white focus-visible:ring-[#9945FF]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select defaultValue={selectedUser.role === "USER" ? "Client" : 
                                    selectedUser.role === "FREELANCER" ? "Freelancer" : 
                                    "Admin"}>
                    <SelectTrigger id="role" className="bg-gray-800 border-gray-700 text-white focus:ring-[#9945FF]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      <SelectItem value="Client">Client</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select defaultValue={selectedUser.status}>                    
                    <SelectTrigger id="status" className="bg-gray-800 border-gray-700 text-white focus:ring-[#9945FF]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location" 
                  defaultValue={selectedUser.location} 
                  className="bg-gray-800 border-gray-700 text-white focus-visible:ring-[#9945FF]"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="verified" 
                  defaultChecked={selectedUser.verified}
                  className="border-gray-600 data-[state=checked]:bg-[#9945FF] data-[state=checked]:border-[#9945FF]"
                />
                <Label htmlFor="verified">Verified Account</Label>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                className="bg-gradient-to-r from-[#9945FF] to-[#00a2ff] hover:from-[#8935EF] hover:to-[#0092EF] text-white"
                onClick={async () => {
                  if (!selectedUser) return;
                  
                  const nameInput = document.getElementById('name') as HTMLInputElement;
                  const emailInput = document.getElementById('email') as HTMLInputElement;
                  const roleSelect = document.getElementById('role') as HTMLSelectElement;
                  const statusSelect = document.getElementById('status') as HTMLSelectElement;
                  const verifiedCheckbox = document.getElementById('verified') as HTMLInputElement;
                  
                  try {
                    const token = localStorage.getItem('token');
                    const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
                      method: 'PATCH',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                      },
                      body: JSON.stringify({
                        fullName: nameInput.value,
                        email: emailInput.value,
                        role: roleSelect.value === 'Client' ? 'USER' : 'ADMIN',
                        active: statusSelect.value === 'Active',
                        emailVerified: verifiedCheckbox.checked ? new Date() : null,
                      }),
                    });
                    
                    if (!response.ok) {
                      throw new Error(`Error ${response.status}: ${response.statusText}`);
                    }
                    
                    const responseData = await response.json();
                    const updatedUser = responseData.user || responseData;
                    
                    // Update the user in the list
                    setUsers(users.map(u => {
                      if (u.id === selectedUser.id) {
                        return {
                          ...updatedUser,
                          status: updatedUser.active ? 'Active' : 'Inactive',
                          verified: Boolean(updatedUser.emailVerified),
                          joinDate: new Date(updatedUser.createdAt).toLocaleDateString(),
                          lastActive: new Date(updatedUser.updatedAt).toLocaleDateString(),
                        };
                      }
                      return u;
                    }));
                    
                    setIsEditDialogOpen(false);
                    toast.success("User updated successfully");
                  } catch (err) {
                    console.error("Failed to update user:", err);
                    toast.error("Failed to update user");
                  }
                }}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete User Dialog */}
      {selectedUser && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-md">
            <DialogHeader>
              <DialogTitle>Delete User</DialogTitle>
              <DialogDescription className="text-gray-400">
                Are you sure you want to delete this user? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400">
                  You are about to delete <span className="font-semibold">{selectedUser?.fullName || selectedUser?.username} ({selectedUser?.email})</span>.
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
                onClick={handleDeleteUser}
              >
                Delete User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
