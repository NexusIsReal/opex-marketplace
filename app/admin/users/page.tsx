"use client";

import { useState } from "react";
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
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  joinDate: string;
  location: string;
  lastActive: string;
  verified: boolean;
}

// Mock data for users
const mockUsers: User[] = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    role: "Client",
    status: "Active",
    joinDate: "2023-08-05",
    location: "New York, USA",
    lastActive: "2023-08-10",
    verified: true,
  },
  {
    id: 2,
    name: "Sarah Williams",
    email: "sarah.w@example.com",
    role: "Freelancer",
    status: "Active",
    joinDate: "2023-08-04",
    location: "London, UK",
    lastActive: "2023-08-09",
    verified: true,
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael.b@example.com",
    role: "Client",
    status: "Inactive",
    joinDate: "2023-08-03",
    location: "Toronto, Canada",
    lastActive: "2023-07-25",
    verified: false,
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.d@example.com",
    role: "Freelancer",
    status: "Active",
    joinDate: "2023-08-02",
    location: "Sydney, Australia",
    lastActive: "2023-08-10",
    verified: true,
  },
  {
    id: 5,
    name: "David Wilson",
    email: "david.w@example.com",
    role: "Client",
    status: "Active",
    joinDate: "2023-08-01",
    location: "Berlin, Germany",
    lastActive: "2023-08-08",
    verified: true,
  },
  {
    id: 6,
    name: "Jessica Miller",
    email: "jessica.m@example.com",
    role: "Freelancer",
    status: "Inactive",
    joinDate: "2023-07-30",
    location: "Paris, France",
    lastActive: "2023-08-01",
    verified: true,
  },
  {
    id: 7,
    name: "Robert Taylor",
    email: "robert.t@example.com",
    role: "Admin",
    status: "Active",
    joinDate: "2023-07-28",
    location: "Chicago, USA",
    lastActive: "2023-08-10",
    verified: true,
  },
  {
    id: 8,
    name: "Lisa Anderson",
    email: "lisa.a@example.com",
    role: "Freelancer",
    status: "Active",
    joinDate: "2023-07-25",
    location: "Tokyo, Japan",
    lastActive: "2023-08-09",
    verified: true,
  },
  {
    id: 9,
    name: "James Wilson",
    email: "james.w@example.com",
    role: "Client",
    status: "Pending",
    joinDate: "2023-08-08",
    location: "Madrid, Spain",
    lastActive: "2023-08-08",
    verified: false,
  },
  {
    id: 10,
    name: "Emma Thompson",
    email: "emma.t@example.com",
    role: "Freelancer",
    status: "Active",
    joinDate: "2023-07-20",
    location: "Amsterdam, Netherlands",
    lastActive: "2023-08-07",
    verified: true,
  },
];

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Filter users based on search term, role, and status
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = selectedRole === "All" || user.role === selectedRole;
    const matchesStatus = selectedStatus === "All" || user.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Handle row selection
  const toggleRowSelection = (userId: number) => {
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
  const handleDeleteUser = () => {
    setUsers(users.filter(user => user.id !== selectedUser?.id));
    setIsDeleteDialogOpen(false);
  };

  // Handle bulk deletion
  const handleBulkDelete = () => {
    setUsers(users.filter(user => !selectedRows.includes(user.id)));
    setSelectedRows([]);
  };

  // Handle user status toggle
  const toggleUserStatus = (userId: number) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        const newStatus = user.status === "Active" ? "Inactive" : "Active";
        return { ...user, status: newStatus };
      }
      return user;
    }));
  };

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Users Management</h1>
            <p className="text-gray-400">Manage all users on the platform</p>
          </div>
          <Button className="bg-gradient-to-r from-[#9945FF] to-[#00a2ff] hover:from-[#8935EF] hover:to-[#0092EF] text-white">
            <Plus className="mr-2 h-4 w-4" />
            Add New User
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
                    <SelectItem value="Freelancer">Freelancer</SelectItem>
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
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.role === "Freelancer" 
                          ? "bg-purple-500/20 text-purple-400" 
                          : user.role === "Admin"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-blue-500/20 text-blue-400"
                      }`}>
                        {user.role}
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
                    <TableCell>{user.joinDate}</TableCell>
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
                <div className="text-white font-medium">{selectedUser.name}</div>
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
                      selectedUser.role === "Freelancer" 
                        ? "bg-purple-500/20 text-purple-400" 
                        : selectedUser.role === "Admin"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-blue-500/20 text-blue-400"
                    }`}>
                      {selectedUser.role}
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
                <div className="text-white font-medium">{selectedUser.location}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-400">Join Date</Label>
                  <div className="text-white font-medium">{selectedUser.joinDate}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-400">Last Active</Label>
                  <div className="text-white font-medium">{selectedUser.lastActive}</div>
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
                  defaultValue={selectedUser.name} 
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
                  <Select defaultValue={selectedUser.role}>
                    <SelectTrigger id="role" className="bg-gray-800 border-gray-700 text-white focus:ring-[#9945FF]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      <SelectItem value="Client">Client</SelectItem>
                      <SelectItem value="Freelancer">Freelancer</SelectItem>
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
                onClick={() => setIsEditDialogOpen(false)}
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
                  You are about to delete <span className="font-semibold">{selectedUser?.name} ({selectedUser?.email})</span>.
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
