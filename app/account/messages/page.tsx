'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

// Custom animated components
import AnimatedMessageList from '@/components/AnimatedMessageList';
import AnimatedConversationList from '@/components/AnimatedConversationList';
import AnimatedMessageInput from '@/components/AnimatedMessageInput';

// Type definitions
interface User {
  id: string;
  username: string;
  fullName: string | null;
  email?: string; // Make email optional to be compatible with AnimatedConversationList
  role: string;
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

interface Conversation {
  user: User;
  lastMessage: Message;
  unreadCount: number;
}

export default function MessagesPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  // State
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  // Fetch conversations on component mount
  useEffect(() => {
    fetchCurrentUser();
    fetchConversations();
    
    // Set up polling for new messages
    const interval = setInterval(() => {
      if (selectedUser) {
        fetchMessages(selectedUser.id);
      }
      fetchConversations();
    }, 5000); // Poll every 5 seconds for more responsive updates
    
    setPollingInterval(interval);
    
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, []);

  // Mark messages as read when conversation is selected
  useEffect(() => {
    if (selectedUser) {
      markMessagesAsRead(selectedUser.id);
    }
  }, [selectedUser]);

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

  // Fetch all conversations
  const fetchConversations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/messages', {
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
      setConversations(data.conversations || []);
      
      // If there's a selected user, keep it selected
      // Otherwise, select the first conversation if available
      if (!selectedUser && data.conversations && data.conversations.length > 0) {
        setSelectedUser(data.conversations[0].user);
        fetchMessages(data.conversations[0].user.id);
      }
    } catch (err) {
      console.error("Failed to fetch conversations:", err);
      toast({
        title: "Error",
        description: "Failed to load conversations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for a specific conversation
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
      setMessages(data.messages || []);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };

  // Mark messages as read
  const markMessagesAsRead = async (userId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/messages/read?senderId=${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      // Update conversations to reflect read status
      setConversations(conversations.map(conv => {
        if (conv.user.id === userId) {
          return { ...conv, unreadCount: 0 };
        }
        return conv;
      }));
    } catch (err) {
      console.error("Failed to mark messages as read:", err);
    }
  };

  // Send a message
  const sendMessage = async (attachments?: File[]) => {
    if (!selectedUser || (!newMessage.trim() && !attachments?.length)) return;
    
    try {
      const messageContent = newMessage.trim();
      setNewMessage(''); // Clear input immediately for better UX
      
      // Don't show typing indicator for our own messages
      // setIsTyping(true);
      
      const token = localStorage.getItem('token');
      
      // If we have attachments, use FormData instead of JSON
      if (attachments && attachments.length > 0) {
        const formData = new FormData();
        formData.append('content', messageContent);
        formData.append('receiverId', selectedUser.id);
        
        // Append each file to the form data
        attachments.forEach((file, index) => {
          formData.append(`attachment${index}`, file);
        });
        
        const response = await fetch('/api/messages', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
      } else {
        // Regular JSON message without attachments
        const response = await fetch('/api/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            content: messageContent,
            receiverId: selectedUser.id
          }),
        });
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        setMessages([...messages, data.message]);
      }
      
      // Update conversations list to show the new message
      fetchConversations();
      
      // Fetch messages again after sending to ensure we have the latest
      setTimeout(() => {
        if (selectedUser) {
          fetchMessages(selectedUser.id);
        }
      }, 500);
    } catch (err) {
      console.error("Failed to send message:", err);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };

  // Select a conversation
  const selectConversation = (user: User) => {
    setSelectedUser(user);
    fetchMessages(user.id);
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

  // Get user display name
  const getUserDisplayName = (user: User) => {
    return user.fullName || user.username;
  };

  // Get user initials for avatar
  const getUserInitials = (user: User) => {
    if (user.fullName) {
      return user.fullName
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    return user.username.substring(0, 2).toUpperCase();
  };

  // Get role badge color
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-500';
      case 'FREELANCER':
        return 'bg-green-500';
      default:
        return 'bg-blue-500';
    }
  };

  if (loading && conversations.length === 0) {
    return (
      <div className="container mx-auto py-6 flex justify-center items-center h-64">
        <motion.div 
          className="flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="rounded-full h-16 w-16 border-4 border-[#9945FF] border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          />
          <motion.p 
            className="mt-4 text-white text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Loading messages...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      className="container mx-auto py-6 pt-32"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1 
        className="text-3xl font-bold text-white mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Messages
      </motion.h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Conversations List */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-gray-900 border-gray-800 flex flex-col overflow-hidden shadow-lg" style={{ height: 'calc(100vh - 12rem)' }}>
            <CardHeader className="bg-gradient-to-r from-gray-900 to-gray-800">
              <CardTitle className="text-xl text-white flex items-center">
                <motion.div
                  className="mr-2 text-[#9945FF]" 
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, 0, -5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 5
                  }}
                >
                  💬
                </motion.div>
                Conversations
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 max-h-[500px] overflow-y-auto">
              <AnimatedConversationList
                conversations={conversations}
                selectedUserId={selectedUser?.id || null}
                onSelectConversation={selectConversation}
                formatTimestamp={formatTimestamp}
                getUserInitials={getUserInitials}
                getUserDisplayName={getUserDisplayName}
              />
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Messages */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="md:col-span-2"
        >
          <Card className="bg-gray-900 border-gray-700 overflow-hidden">
            <CardHeader className="border-b border-gray-700 bg-gradient-to-r from-gray-900 to-gray-800">
              {selectedUser ? (
                <motion.div 
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Avatar className="h-10 w-10 ring-2 ring-offset-2 ring-offset-gray-900 ring-[#9945FF]">
                      <AvatarFallback className="bg-gradient-to-br from-[#9945FF] to-[#8935EE]">
                        {getUserInitials(selectedUser)}
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>
                  
                  <div>
                    <div className="font-medium text-white">
                      {getUserDisplayName(selectedUser)}
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 15 }}
                      >
                        <Badge className={`${getRoleBadgeColor(selectedUser.role)} text-xs`}>
                          {selectedUser.role}
                        </Badge>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <CardTitle className="text-xl text-white flex items-center">
                    <motion.span
                      animate={{ 
                        x: [0, 5, 0, 5, 0],
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3
                      }}
                      className="mr-2"
                    >
                      👈
                    </motion.span>
                    Select a conversation
                  </CardTitle>
                </motion.div>
              )}
            </CardHeader>
            
            <CardContent className="p-0 flex flex-col overflow-hidden" style={{ height: 'calc(100vh - 16rem)' }}>
              {!selectedUser ? (
                <motion.div
                  className="flex-1 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="text-center p-6">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, 0, -5, 0]
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity
                      }}
                      className="text-6xl mb-4"
                    >
                      💬
                    </motion.div>
                    <p className="text-gray-400">Select a conversation to view messages</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div className="flex flex-col w-full overflow-hidden" style={{ height: '100%' }}>
                  <AnimatedMessageList
                    messages={messages}
                    currentUserId={currentUser?.id || ''} // For account page, currentUser's messages should be on right
                    formatTimestamp={formatTimestamp}
                    isTyping={isTyping}
                    isAdminInterface={false}
                  />
                  
                  <div className="mt-auto">
                    <AnimatedMessageInput
                      value={newMessage}
                      onChange={setNewMessage}
                      onSend={sendMessage}
                      disabled={isTyping}
                    />
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
