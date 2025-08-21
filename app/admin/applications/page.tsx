'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

// Animated components
import AnimatedMessageList from '@/components/AnimatedMessageList';
import AnimatedMessageInput from '@/components/AnimatedMessageInput';
import AnimatedMessage from '@/components/AnimatedMessage';

// Type definitions
type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'INTERVIEW';
type FreelancerCategory = 'FRONT_END_DEVELOPER' | 'BACK_END_DEVELOPER' | 'FULL_STACK_DEVELOPER' | 'BOT_DEVELOPER' | 'SOFTWARE_DEVELOPER';

interface User {
  id: string;
  username: string;
  email: string;
  fullName: string | null;
  createdAt: string;
}

interface Application {
  id: string;
  userId: string;
  user: User;
  category: FreelancerCategory;
  skills: string[];
  experience: number;
  portfolio: string | null;
  coverLetter: string;
  status: ApplicationStatus;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  read: boolean;
  applicationId: string | null;
  createdAt: string;
  sender: {
    id: string;
    username: string;
    fullName: string | null;
  };
  receiver: {
    id: string;
    username: string;
    fullName: string | null;
  };
}

export default function ApplicationsManagement() {
  const router = useRouter();
  const { toast } = useToast();
  
  // State
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [adminNotes, setAdminNotes] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

  // Fetch applications on component mount
  useEffect(() => {
    fetchApplications();
    fetchCurrentUser();
  }, []);

  // Fetch applications from API
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/applications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          toast({
            title: "Unauthorized",
            description: "Please log in as an admin",
            variant: "destructive"
          });
          router.push('/auth/login');
          return;
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      // Get applications with user information
      const data = await response.json();
      console.log('API Response:', data);
      
      // Parse skills JSON string to array for each application
      const applicationsArray = (data.applications || []).map((app: { skills: string; }) => ({
        ...app,
        skills: typeof app.skills === 'string' ? JSON.parse(app.skills) : app.skills
      }));
      setApplications(applicationsArray);
    } catch (err) {
      console.error("Failed to fetch applications:", err);
      toast({
        title: "Error",
        description: "Failed to fetch applications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter applications based on search term and status
  const filteredApplications = applications.filter(application => {
    const matchesSearch = 
      (application.user.fullName?.toLowerCase() || application.user.username.toLowerCase()).includes(searchTerm.toLowerCase()) || 
      application.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === "All" || application.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Format category for display
  const formatCategory = (category: FreelancerCategory) => {
    return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };
  
  // Format timestamp for display
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  // Get status badge color
  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'PENDING':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'APPROVED':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'REJECTED':
        return <Badge className="bg-red-500">Rejected</Badge>;
      case 'INTERVIEW':
        return <Badge className="bg-blue-500">Interview</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  // Open application details
  const openApplicationDetails = (application: Application) => {
    // Ensure skills is parsed as an array
    const appWithParsedSkills = {
      ...application,
      skills: typeof application.skills === 'string' ? JSON.parse(application.skills) : application.skills
    };
    setSelectedApplication(appWithParsedSkills);
    setAdminNotes(appWithParsedSkills.adminNotes || '');
    setIsDetailsOpen(true);
  };

  // Open chat with applicant
  const openChat = async (application: Application) => {
    // Ensure skills is parsed as an array
    const appWithParsedSkills = {
      ...application,
      skills: typeof application.skills === 'string' ? JSON.parse(application.skills) : application.skills
    };
    setSelectedApplication(appWithParsedSkills);
    setIsChatOpen(true);
    setIsTyping(false); // Reset typing indicator when opening chat
    await fetchMessages(application.userId);
    
    // Set up polling for new messages when chat is opened
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }
    
    const interval = setInterval(() => {
      if (appWithParsedSkills && isChatOpen) {
        fetchMessages(appWithParsedSkills.userId);
      }
    }, 5000); // Poll every 5 seconds
    
    setPollingInterval(interval);
  };

  // Fetch messages for a conversation
  const fetchMessages = async (userId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/messages?withUser=${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      // Only update messages if we got new ones to avoid unnecessary re-renders
      if (data.messages && (data.messages.length !== messages.length || 
          (data.messages.length > 0 && messages.length > 0 && 
           data.messages[data.messages.length - 1].id !== messages[messages.length - 1].id))) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error("Failed to fetch messages:", err);
      toast({
        title: "Error",
        description: "Failed to fetch messages",
        variant: "destructive"
      });
    }
  };

  // Fetch current user info
  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/account', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          toast({
            title: "Unauthorized",
            description: "Please log in to continue",
            variant: "destructive"
          });
          router.push('/auth/login');
          return;
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setCurrentUser(data.user);
    } catch (err) {
      console.error("Failed to fetch current user:", err);
    }
  };

  // Send a message
  const sendMessage = async () => {
    if (!selectedApplication || !newMessage.trim()) return;
    
    try {
      const messageContent = newMessage.trim();
      setNewMessage(''); // Clear input immediately for better UX
      
      // Show brief typing indicator after user sends a message
      // to simulate the other person typing a response
      // This is just for demo purposes - in a real app you'd use websockets
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      const token = localStorage.getItem('token');
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: messageContent,
          receiverId: selectedApplication.userId,
          applicationId: selectedApplication.id
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setMessages([...messages, data.message]);
      
      // Show typing indicator for 2-4 seconds after sending a message
      // to simulate the other person typing a response
      const randomDelay = Math.floor(Math.random() * 2000) + 2000; // 2-4 seconds
      setIsTyping(true);
      
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        // Fetch messages again after typing indicator disappears
        fetchMessages(selectedApplication.userId);
      }, randomDelay);
    } catch (err) {
      console.error("Failed to send message:", err);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };

  // Update application status
  const updateApplicationStatus = async (status: ApplicationStatus) => {
    if (!selectedApplication) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/applications/${selectedApplication.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status,
          adminNotes
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Update applications list
      setApplications(applications.map(app => 
        app.id === selectedApplication.id ? { ...app, status, adminNotes } : app
      ));
      
      setIsDetailsOpen(false);
      
      toast({
        title: "Success",
        description: `Application ${status.toLowerCase()}`,
      });
      
      // If approved, send a congratulatory message
      if (status === 'APPROVED') {
        await fetch('/api/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            content: "Congratulations! Your application to become a freelancer has been approved. You can now access the freelancer dashboard.",
            receiverId: selectedApplication.userId,
            applicationId: selectedApplication.id
          }),
        });
      }
      
    } catch (err) {
      console.error("Failed to update application:", err);
      toast({
        title: "Error",
        description: "Failed to update application",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-purple-200">Freelancer Applications</h1>
        <div className="flex gap-4">
          <Input
            placeholder="Search applications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[300px] bg-gray-800 border-gray-700 text-purple-200 focus:ring-[#9945FF]"
          />
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-purple-200 focus:ring-[#9945FF]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-purple-200 shadow-lg">
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
              <SelectItem value="INTERVIEW">Interview</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9945FF]"></div>
        </div>
      ) : (
        <div className="rounded-md border border-gray-600 overflow-hidden bg-gray-900 shadow-lg">
          <Table>
            <TableHeader className="bg-gray-800/90">
              <TableRow className="hover:bg-gray-800/50 border-gray-700">
                <TableHead className="text-gray-200">Applicant</TableHead>
                <TableHead className="text-gray-200">Category</TableHead>
                <TableHead className="text-gray-200">Experience</TableHead>
                <TableHead className="text-gray-200">Applied On</TableHead>
                <TableHead className="text-gray-200">Status</TableHead>
                <TableHead className="text-gray-200 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-gray-900/95">
              {filteredApplications.length === 0 ? (
                <TableRow className="hover:bg-gray-800/70 border-gray-700">
                  <TableCell colSpan={6} className="text-center text-gray-300 py-8">
                    No applications found
                  </TableCell>
                </TableRow>
              ) : (
                filteredApplications.map((application) => (
                  <TableRow key={application.id} className="hover:bg-gray-800/70 border-gray-700">
                    <TableCell className="font-medium text-purple-200">
                      {application.user.fullName || application.user.username}
                      <div className="text-sm text-gray-300">{application.user.email}</div>
                    </TableCell>
                    <TableCell className="text-purple-200">{formatCategory(application.category)}</TableCell>
                    <TableCell className="text-purple-200">{application.experience} years</TableCell>
                    <TableCell className="text-purple-200">{new Date(application.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(application.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="bg-purple-600 text-white hover:bg-purple-700 border-purple-700"
                          onClick={() => openApplicationDetails(application)}
                        >
                          Details
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="bg-purple-600 text-white hover:bg-purple-700 border-purple-700"
                          onClick={() => router.push(`/admin/messages?userId=${application.userId}`)}
                        >
                          Chat
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Application Details Dialog */}
      {selectedApplication && (
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="bg-gray-900 text-gray-200 border-gray-600 max-w-3xl shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">Application Details</DialogTitle>
              <DialogDescription className="text-gray-300">
                Review the freelancer application
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="bg-gray-800 border-gray-600 text-gray-100">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="skills">Skills & Experience</TabsTrigger>
                <TabsTrigger value="notes">Admin Notes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-gray-800 border-gray-600 shadow-md">
                    <CardHeader>
                      <CardTitle className="text-purple-200">Applicant Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <span className="text-gray-300">Name:</span>
                        <span className="text-purple-200 ml-2">{selectedApplication.user.fullName || selectedApplication.user.username}</span>
                      </div>
                      <div>
                        <span className="text-gray-300">Email:</span>
                        <span className="text-purple-200 ml-2">{selectedApplication.user.email}</span>
                      </div>
                      <div>
                        <span className="text-gray-300">Username:</span>
                        <span className="text-purple-200 ml-2">{selectedApplication.user.username}</span>
                      </div>
                      <div>
                        <span className="text-gray-300">Member Since:</span>
                        <span className="text-purple-200 ml-2">{new Date(selectedApplication.user.createdAt).toLocaleDateString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gray-800 border-gray-600 shadow-md">
                    <CardHeader>
                      <CardTitle className="text-purple-200">Application Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <span className="text-gray-300">Current Status:</span>
                        <span className="ml-2">{getStatusBadge(selectedApplication.status)}</span>
                      </div>
                      <div>
                        <span className="text-gray-300">Applied On:</span>
                        <span className="text-purple-200 ml-2">{new Date(selectedApplication.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-300">Last Updated:</span>
                        <span className="text-purple-200 ml-2">{new Date(selectedApplication.updatedAt).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-300">Category:</span>
                        <span className="text-purple-200 ml-2">{formatCategory(selectedApplication.category)}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card className="bg-gray-800 border-gray-600 shadow-md">
                  <CardHeader>
                      <CardTitle className="text-purple-200">Cover Letter</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-purple-200 whitespace-pre-wrap">{selectedApplication.coverLetter}</p>
                  </CardContent>
                </Card>
                
                {selectedApplication.portfolio && (
                  <Card className="bg-gray-800 border-gray-600 shadow-md">
                    <CardHeader>
                      <CardTitle className="text-purple-200">Portfolio</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-purple-200 break-words">{selectedApplication.portfolio}</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="skills" className="space-y-4 mt-4">
                <Card className="bg-gray-800 border-gray-600 shadow-md">
                  <CardHeader>
                      <CardTitle className="text-purple-200">Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedApplication.skills.map((skill, index) => (
                        <Badge key={index} className="bg-[#9945FF]">{skill}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-800 border-gray-600 shadow-md">
                  <CardHeader>
                      <CardTitle className="text-purple-200">Experience</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-purple-200">{selectedApplication.experience} years of experience</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="notes" className="space-y-4 mt-4">
                <Card className="bg-gray-800 border-gray-600 shadow-md">
                  <CardHeader>
                      <CardTitle className="text-purple-200">Admin Notes</CardTitle>
                    <CardDescription className="text-gray-300">
                      Add private notes about this application
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea 
                      value={adminNotes} 
                      onChange={(e) => setAdminNotes(e.target.value)}
                      className="bg-gray-900 border-gray-600 text-purple-200 min-h-[150px] focus:border-purple-500"
                      placeholder="Add your notes here..."
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <DialogFooter className="flex justify-between">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => router.push(`/admin/messages?userId=${selectedApplication.userId}`)}
                  className="bg-purple-600 text-white hover:bg-purple-700 border-purple-700"
                >
                  Message Applicant
                </Button>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => updateApplicationStatus('APPROVED')}
                  className="bg-purple-600 text-white hover:bg-purple-700 border-purple-700"
                >
                  Approve
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => updateApplicationStatus('REJECTED')}
                >
                  Reject
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Chat Dialog */}
      {selectedApplication && (
        <Dialog 
          open={isChatOpen} 
          onOpenChange={(open) => {
            setIsChatOpen(open);
            // Clear polling interval and typing timeout when dialog is closed
            if (!open) {
              if (pollingInterval) {
                clearInterval(pollingInterval);
                setPollingInterval(null);
              }
              if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
                typingTimeoutRef.current = null;
              }
              setIsTyping(false);
            }
          }}
        >
          <DialogContent className="bg-gray-900 text-gray-200 border-gray-600 max-w-2xl h-[70vh] flex flex-col shadow-xl">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  <motion.div 
                    className="flex items-center gap-2"
                    initial={{ x: -20 }}
                    animate={{ x: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    <motion.span
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, 0, -5, 0]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 5
                      }}
                      className="text-[#9945FF]"
                    >
                      💬
                    </motion.span>
                    Chat with {selectedApplication.user.fullName || selectedApplication.user.username}
                  </motion.div>
                </DialogTitle>
                <DialogDescription className="text-gray-300">
                  Discuss the freelancer application
                </DialogDescription>
              </DialogHeader>
            </motion.div>
            
            <AnimatedMessageList
              messages={messages}
              currentUserId={currentUser?.id || ''}
              formatTimestamp={formatTimestamp}
              isTyping={isTyping}
            />
            
            <AnimatedMessageInput
              value={newMessage}
              onChange={setNewMessage}
              onSend={sendMessage}
              disabled={isTyping}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
