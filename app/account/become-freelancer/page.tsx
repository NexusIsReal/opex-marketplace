'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
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
import { AlertCircle, CheckCircle, Clock, MessageSquare, Plus, X, User, Calendar, Award, ExternalLink, Send, Briefcase } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

// Type definitions
type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'INTERVIEW';
type FreelancerCategory = 'FRONT_END_DEVELOPER' | 'BACK_END_DEVELOPER' | 'FULL_STACK_DEVELOPER' | 'BOT_DEVELOPER' | 'SOFTWARE_DEVELOPER';

interface Application {
  id: string;
  userId: string;
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

export default function BecomeFreelancer() {
  const router = useRouter();
  const { toast } = useToast();

  // State
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeAdmins, setActiveAdmins] = useState<{id: string, username: string, fullName: string | null}[]>([]);
  const [selectedAdminId, setSelectedAdminId] = useState<string>('');
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [category, setCategory] = useState<FreelancerCategory | ''>('');
  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState('');
  const [experience, setExperience] = useState<number>(0);
  const [portfolio, setPortfolio] = useState('');
  const [coverLetter, setCoverLetter] = useState('');

  // Fetch existing application on component mount
  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/auth/login');
          return;
        }
        
        const response = await fetch('/api/freelancer/application', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.status === 401) {
          localStorage.removeItem('token');
          router.push('/auth/login');
          return;
        }
        
        if (response.status === 404) {
          // No application found, that's okay
          setLoading(false);
          return;
        }
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        setApplication(data.application);
        
        // If application exists, fetch messages
        if (data.application) {
          fetchMessages();
        }
      } catch (err) {
        console.error('Error fetching application:', err);
        setError('Failed to load your application. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchApplication();
  }, [router]);

  // Fetch messages for the application
  const fetchMessages = async () => {
    try {
      setLoadingMessages(true);
      
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }
      
      // Fetch admins first to get their IDs
      const adminsResponse = await fetch('/api/admin/users?role=ADMIN', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!adminsResponse.ok) {
        if (adminsResponse.status !== 404) {
          console.error('Error fetching admins');
        }
      } else {
        const adminsData = await adminsResponse.json();
        if (adminsData.users && adminsData.users.length > 0) {
          setActiveAdmins(adminsData.users);
          setSelectedAdminId(adminsData.users[0].id);
        }
      }
      
      // Now fetch messages with the first admin or any admin if application exists
      if (application) {
        const messagesResponse = await fetch(`/api/messages?applicationId=${application.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!messagesResponse.ok) {
          if (messagesResponse.status !== 404) {
            console.error('Error fetching messages');
          }
        } else {
          const messagesData = await messagesResponse.json();
          setMessages(messagesData.messages || []);
        }
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  // Send a message
  const sendMessage = async () => {
    if (!newMessage.trim() || !application || !selectedAdminId) return;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }
      
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: newMessage,
          receiverId: selectedAdminId,
          applicationId: application.id
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setMessages([...messages, data.message]);
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Add skill to the list
  const addSkill = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill('');
    }
  };

  // Remove skill from the list
  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  // Submit application
  const submitApplication = async () => {
    if (!category || skills.length === 0 || !coverLetter) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }
      
      const response = await fetch('/api/freelancer/application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          category,
          skills,
          experience,
          portfolio: portfolio || null,
          coverLetter
        }),
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          router.push('/auth/login');
          return;
        }
        
        const errorData = await response.json();
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setApplication(data.application);
      
      toast({
        title: "Application Submitted",
        description: "Your freelancer application has been submitted successfully!",
      });
      
      // Reset form
      setCategory('');
      setSkills([]);
      setExperience(0);
      setPortfolio('');
      setCoverLetter('');
      
      // Fetch messages after application is created
      fetchMessages();
    } catch (err: any) {
      console.error('Error submitting application:', err);
      setError(err.message || 'Failed to submit application. Please try again later.');
      toast({
        title: "Error",
        description: err.message || "Failed to submit application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Get status badge and icon
  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'PENDING':
        return (
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-400" />
            <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-medium hover:from-amber-600 hover:to-yellow-600">
              Pending Review
            </Badge>
          </div>
        );
      case 'APPROVED':
        return (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-emerald-400" />
            <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 text-white font-medium hover:from-emerald-600 hover:to-green-600">
              Approved
            </Badge>
          </div>
        );
      case 'REJECTED':
        return (
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium hover:from-red-600 hover:to-pink-600">
              Rejected
            </Badge>
          </div>
        );
      case 'INTERVIEW':
        return (
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-400" />
            <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium hover:from-blue-600 hover:to-indigo-600">
              Interview Requested
            </Badge>
          </div>
        );
      default:
        return <Badge className="bg-gray-600">Unknown</Badge>;
    }
  };

  // Format category for display
  const formatCategory = (category: FreelancerCategory) => {
    return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Render application form
  const renderApplicationForm = () => (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-4">
          <Briefcase className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
          Become a Freelancer
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Join our platform and showcase your skills to clients worldwide. Fill out the form below to get started on your freelancing journey.
        </p>
      </div>

      {/* Application Form Card */}
      <Card className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 border border-gray-700/50 shadow-2xl backdrop-blur-sm">
        <CardHeader className="space-y-2 pb-8">
          <CardTitle className="text-2xl text-white font-semibold flex items-center gap-2">
            <User className="h-6 w-6 text-purple-400" />
            Application Details
          </CardTitle>
          <CardDescription className="text-gray-400">
            Tell us about your expertise and experience
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {/* Category Selection */}
          <div className="space-y-3">
            <Label htmlFor="category" className="text-white font-medium flex items-center gap-2">
              <Award className="h-4 w-4 text-purple-400" />
              Category *
            </Label>
            <Select value={category} onValueChange={(value) => setCategory(value as FreelancerCategory)}>
              <SelectTrigger 
                id="category" 
                className="bg-gray-800/50 border-gray-600 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent h-12 text-base"
              >
                <SelectValue placeholder="Select your area of expertise" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600 text-white">
                <SelectItem value="FRONT_END_DEVELOPER" className="focus:bg-purple-600">Front-End Web Developer</SelectItem>
                <SelectItem value="BACK_END_DEVELOPER" className="focus:bg-purple-600">Back-End Web Developer</SelectItem>
                <SelectItem value="FULL_STACK_DEVELOPER" className="focus:bg-purple-600">Full-Stack Web Developer</SelectItem>
                <SelectItem value="BOT_DEVELOPER" className="focus:bg-purple-600">Bot Developer</SelectItem>
                <SelectItem value="SOFTWARE_DEVELOPER" className="focus:bg-purple-600">Software Developer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Skills Section */}
          <div className="space-y-3">
            <Label htmlFor="skills" className="text-white font-medium">Skills *</Label>
            <div className="flex gap-3">
              <Input
                id="skills"
                value={currentSkill}
                onChange={(e) => setCurrentSkill(e.target.value)}
                className="bg-gray-800/50 border-gray-600 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent h-12 text-base"
                placeholder="Add a skill (e.g., React, Node.js, Python)"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkill();
                  }
                }}
              />
              <Button 
                type="button" 
                onClick={addSkill}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 h-12 px-6 font-medium transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {skills.map((skill, index) => (
                <Badge 
                  key={index} 
                  className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 text-purple-100 cursor-pointer hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-200 px-3 py-1.5 text-sm font-medium"
                  onClick={() => removeSkill(skill)}
                >
                  {skill}
                  <X className="h-3 w-3 ml-2" />
                </Badge>
              ))}
            </div>
            {skills.length === 0 && (
              <p className="text-gray-500 text-sm">Add your technical skills to help clients find you</p>
            )}
          </div>
          
          {/* Experience */}
          <div className="space-y-3">
            <Label htmlFor="experience" className="text-white font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-400" />
              Years of Experience
            </Label>
            <Input
              id="experience"
              type="number"
              min="0"
              value={experience}
              onChange={(e) => setExperience(parseInt(e.target.value) || 0)}
              className="bg-gray-800/50 border-gray-600 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent h-12 text-base"
              placeholder="0"
            />
          </div>
          
          {/* Portfolio */}
          <div className="space-y-3">
            <Label htmlFor="portfolio" className="text-white font-medium flex items-center gap-2">
              <ExternalLink className="h-4 w-4 text-purple-400" />
              Portfolio URL (Optional)
            </Label>
            <Input
              id="portfolio"
              value={portfolio}
              onChange={(e) => setPortfolio(e.target.value)}
              className="bg-gray-800/50 border-gray-600 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent h-12 text-base"
              placeholder="https://your-portfolio.com"
            />
          </div>
          
          {/* Cover Letter */}
          <div className="space-y-3">
            <Label htmlFor="coverLetter" className="text-white font-medium">Cover Letter *</Label>
            <Textarea
              id="coverLetter"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="bg-gray-800/50 border-gray-600 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[200px] text-base resize-none"
              placeholder="Tell us about yourself, your experience, and why you want to join our platform as a freelancer. What makes you stand out from other candidates?"
            />
            <p className="text-gray-500 text-sm">{coverLetter.length}/1000 characters</p>
          </div>
        </CardContent>
        
        <CardFooter className="pt-24">
          <Button 
            onClick={submitApplication}
            disabled={submitting || !category || skills.length === 0 || !coverLetter}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-12 text-base font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Submitting Application...
              </div>
            ) : (
              'Submit Application'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );

  // Render application status
  const renderApplicationStatus = () => {
    if (!application) return null;
    
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header with Status */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full">
            <Briefcase className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Your Application
            </h1>
            <p className="text-gray-400 mb-4">
              Submitted on {new Date(application.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            {getStatusBadge(application.status)}
          </div>
        </div>

        <Card className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 border border-gray-700/50 shadow-2xl backdrop-blur-sm">
          <CardContent className="p-8">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="bg-gray-800/50 border border-gray-600/50 p-1 rounded-lg mb-8">
                <TabsTrigger 
                  value="details" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white text-gray-300 px-6 py-2 rounded-md transition-all duration-200"
                >
                  Application Details
                </TabsTrigger>
                <TabsTrigger 
                  value="messages"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white text-gray-300 px-6 py-2 rounded-md transition-all duration-200"
                >
                  Messages
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-8">
                {/* Status Alerts */}
                {application.status === 'REJECTED' && (
                  <Alert className="bg-gradient-to-r from-red-900/20 to-pink-900/20 border border-red-500/30 backdrop-blur-sm">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    <AlertTitle className="text-red-300 font-semibold">Application Rejected</AlertTitle>
                    <AlertDescription className="text-red-200">
                      Your application has been rejected. You can contact an admin for more information or submit a new application.
                    </AlertDescription>
                  </Alert>
                )}
                
                {application.status === 'INTERVIEW' && (
                  <Alert className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border border-blue-500/30 backdrop-blur-sm">
                    <MessageSquare className="h-5 w-5 text-blue-400" />
                    <AlertTitle className="text-blue-300 font-semibold">Interview Requested</AlertTitle>
                    <AlertDescription className="text-blue-200">
                      Great news! An admin would like to discuss your application. Please check the Messages tab to continue the conversation.
                    </AlertDescription>
                  </Alert>
                )}
                
                {application.status === 'APPROVED' && (
                  <Alert className="bg-gradient-to-r from-emerald-900/20 to-green-900/20 border border-emerald-500/30 backdrop-blur-sm">
                    <CheckCircle className="h-5 w-5 text-emerald-400" />
                    <AlertTitle className="text-emerald-300 font-semibold">Application Approved! 🎉</AlertTitle>
                    <AlertDescription className="text-emerald-200">
                      Congratulations! Your application has been approved. You now have full access to freelancer features and can start taking on projects.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Application Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <Award className="h-5 w-5 text-purple-400" />
                      Category
                    </h3>
                    <p className="text-gray-300 text-base">{formatCategory(application.category)}</p>
                  </div>
                  
                  <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-purple-400" />
                      Experience
                    </h3>
                    <p className="text-gray-300 text-base">{application.experience} years</p>
                  </div>
                </div>
                
                {/* Skills */}
                <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50">
                  <h3 className="text-lg font-semibold text-white mb-4">Technical Skills</h3>
                  <div className="flex flex-wrap gap-3">
                    {application.skills.map((skill, index) => (
                      <Badge 
                        key={index} 
                        className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 text-purple-100 px-4 py-2 text-sm font-medium"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Portfolio */}
                {application.portfolio && (
                  <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <ExternalLink className="h-5 w-5 text-purple-400" />
                      Portfolio
                    </h3>
                    <a 
                      href={application.portfolio} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 transition-colors duration-200 break-all"
                    >
                      {application.portfolio}
                    </a>
                  </div>
                )}
                
                {/* Cover Letter */}
                <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50">
                  <h3 className="text-lg font-semibold text-white mb-4">Cover Letter</h3>
                  <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{application.coverLetter}</p>
                </div>
              </TabsContent>
              
              <TabsContent value="messages" className="space-y-6">
                <div className="bg-gray-800/30 rounded-lg border border-gray-700/50 overflow-hidden">
                  {/* Messages Container */}
                  <div className="h-96 overflow-y-auto p-6 space-y-4">
                    {messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                        <MessageSquare className="h-12 w-12 text-gray-500" />
                        <div>
                          <p className="text-gray-400 text-lg font-medium">No messages yet</p>
                          <p className="text-gray-500 text-sm">Start a conversation with an admin to discuss your application</p>
                        </div>
                      </div>
                    ) : (
                      messages.map((message) => {
                        const isOutgoing = message.senderId === 'user1';
                        return (
                          <div 
                            key={message.id} 
                            className={`flex ${isOutgoing ? 'justify-end' : 'justify-start'}`}
                          >
                            <div 
                              className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                                isOutgoing 
                                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                                  : 'bg-gray-700 text-white'
                              }`}
                            >
                              <p className="text-sm font-medium mb-1">
                                {isOutgoing ? 'You' : message.sender.fullName || message.sender.username}
                              </p>
                              <p className="leading-relaxed">{message.content}</p>
                              <p className="text-xs opacity-70 mt-2">
                                {new Date(message.createdAt).toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                  
                  {/* Message Input */}
                  <div className="border-t border-gray-700/50 p-4 bg-gray-800/50">
                    <div className="flex gap-3">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 bg-gray-700/50 border-gray-600 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent h-12 text-base"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                          }
                        }}
                      />
                      <Button 
                        onClick={sendMessage}
                        disabled={!newMessage.trim()}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-12 px-6 font-medium transition-all duration-200 disabled:opacity-50"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pt-32 px-4">
        <div className="container mx-auto flex justify-center items-center h-96">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto"></div>
            <p className="text-gray-400 text-lg">Loading your application...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pt-32 px-4">
        <div className="container mx-auto max-w-4xl">
          <Alert className="bg-gradient-to-r from-red-900/20 to-pink-900/20 border border-red-500/30 backdrop-blur-sm">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <AlertTitle className="text-red-300 font-semibold">Error</AlertTitle>
            <AlertDescription className="text-red-200">
              {error}
              <div className="mt-4">
                <Button 
                  onClick={() => window.location.reload()}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  Try Again
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pt-32 px-4">
      <div className="container mx-auto pb-12">
        {application ? renderApplicationStatus() : renderApplicationForm()}
      </div>
    </div>
  );
}