"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import AdminAnimatedConversationList from '@/components/AdminAnimatedConversationList';
import AnimatedMessageList from '@/components/AnimatedMessageList';
import AnimatedMessageInput from '@/components/AnimatedMessageInput';
import { withAdminProtection } from '@/lib/adminAuthClient';

// Match the User interface from AnimatedConversationList.tsx
interface User {
  id: string;
  username: string;
  fullName: string | null;
  role: string;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  read: boolean;
  createdAt: string;
}

interface Conversation {
  user: User;
  lastMessage: Message;
  unreadCount: number;
}

function AdminMessagesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // We'll handle message positioning in the AnimatedMessageList component

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

  // Check for userId in URL params
  useEffect(() => {
    const userId = searchParams.get('userId');
    if (userId) {
      fetchUserById(userId);
    }
  }, [searchParams]);

  // Format timestamp for messages
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

  // Fetch current admin user info
  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/verify', {
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
        
        // Don't throw error, just log it and set a default admin user
        console.error('Failed to fetch user, using default admin user');
        setCurrentUser({
          id: 'admin-default',
          username: 'admin',
          fullName: 'Admin User',
          role: 'admin'
        });
        return;
      }
      
      const verifyData = await response.json();
      // The verify endpoint returns { isAdmin: true, user: { id, username, email } }
      const userData = verifyData.user;
      
      // Ensure admin ID has 'admin-' prefix for message positioning
      const adminUser = {
        ...userData,
        id: userData.id.includes('admin') ? userData.id : 'admin-' + userData.id
      };
      console.log('Admin user with ID:', adminUser.id);
      setCurrentUser(adminUser);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  // Fetch conversations list
  const fetchConversations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      try {
        // Try admin endpoint
        const response = await fetch('/api/admin/messages', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setConversations(data.conversations || []);
          setLoading(false);
          return;
        }
        
        if (response.status === 401) {
          toast({
            title: "Unauthorized",
            description: "Please log in to continue",
            variant: "destructive"
          });
          router.push('/auth/login');
          return;
        }
      } catch (adminErr) {
        console.log("Admin endpoint failed:", adminErr);
        // Continue to try regular endpoint
      }
      
      try {
        // Try regular endpoint
        const regularResponse = await fetch('/api/messages', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (regularResponse.ok) {
          const regularData = await regularResponse.json();
          setConversations(regularData.conversations || []);
          setLoading(false);
          return;
        }
      } catch (regularErr) {
        console.log("Regular endpoint failed:", regularErr);
      }
      
      // If we get here, both endpoints failed but didn't throw
      console.log("Both endpoints failed but didn't throw");
      setConversations([]);
      setLoading(false);
      
    } catch (err) {
      // This is the outer catch for any unexpected errors
      console.error("Failed to fetch conversations:", err);
      setLoading(false);
      setConversations([]);
      toast({
        title: "Error",
        description: "Failed to fetch conversations",
        variant: "destructive"
      });
    }
  };

  // Fetch user by ID
  const fetchUserById = async (userId: string) => {
    try {
      // First check if user exists in conversations
      const existingConversation = conversations.find(conv => conv.user.id === userId);
      if (existingConversation) {
        setSelectedUser(existingConversation.user);
        fetchMessages(existingConversation.user.id);
        return;
      }
      
      const token = localStorage.getItem('token');
      
      try {
        // Try admin API endpoint
        const response = await fetch(`/api/admin/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setSelectedUser(data.user);
          fetchMessages(data.user.id);
          return;
        }
      } catch (adminErr) {
        console.log("Admin users endpoint failed:", adminErr);
      }
      
      // If we get here, create a minimal user object
      const minimalUser = {
        id: userId,
        username: `User ${userId.substring(0, 6)}`,
        fullName: null,
        role: 'USER'
      };
      
      setSelectedUser(minimalUser);
      fetchMessages(userId);
      
    } catch (err) {
      console.error("Failed to fetch user:", err);
      toast({
        title: "Error",
        description: "Failed to fetch user",
        variant: "destructive"
      });
    }
  };

  // Fetch messages for a conversation
  const fetchMessages = async (userId: string) => {
    try {
      setMessagesLoading(true);
      const token = localStorage.getItem('token');
      
      // If currentUser is not available yet, wait for it
      if (!currentUser) {
        console.log('Current user not available yet, fetching first...');
        await fetchCurrentUser();
        // If still not available after fetching, use a default admin ID
        if (!currentUser) {
          console.log('Using default admin ID for message positioning');
        }
      }
      
      // Debug current user ID and format
      console.log('Current user ID when fetching messages:', currentUser?.id);
      console.log('Selected user ID:', userId);
      console.log('Current user ID type:', typeof currentUser?.id);
      console.log('Is admin ID prefixed correctly:', currentUser?.id?.includes('admin-'));
      
      let messagesData = null;
      
      try {
        // Try the admin endpoint first
        const response = await fetch(`/api/admin/messages?withUser=${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          messagesData = data;
        }
      } catch (adminErr) {
        console.log("Admin messages endpoint failed:", adminErr);
      }
      
      // If admin endpoint didn't work, try regular endpoint
      if (!messagesData) {
        try {
          const regularResponse = await fetch(`/api/messages?withUser=${userId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (regularResponse.ok) {
            const regularData = await regularResponse.json();
            messagesData = regularData;
          }
        } catch (regularErr) {
          console.log("Regular messages endpoint failed:", regularErr);
        }
      }
      
      // If we got messages data from either endpoint
      if (messagesData && messagesData.messages) {
        // Only update messages if we got new ones to avoid unnecessary re-renders
        if (messagesData.messages.length !== messages.length || 
            (messagesData.messages.length > 0 && messages.length > 0 && 
             messagesData.messages[messagesData.messages.length - 1].id !== messages[messages.length - 1].id)) {
          setMessages(messagesData.messages);
          // Mark messages as read if they are from the selected user
          markMessagesAsRead(userId);
        }
      } else {
        // If both endpoints failed, set empty messages array
        setMessages([]);
      }
    } catch (err) {
      console.error("Failed to fetch messages:", err);
      setMessages([]);
      toast({
        title: "Error",
        description: "Failed to fetch messages",
        variant: "destructive"
      });
    } finally {
      setMessagesLoading(false);
    }
  };

  // Mark messages as read
  const markMessagesAsRead = async (userId: string) => {
    try {
      const token = localStorage.getItem('token');
      let success = false;
      
      try {
        // Try the admin endpoint first
        const response = await fetch('/api/admin/messages/read', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ senderId: userId })
        });
        
        if (response.ok) {
          success = true;
        }
      } catch (adminErr) {
        console.log("Admin read endpoint failed:", adminErr);
      }
      
      // If admin endpoint didn't work, try regular endpoint
      if (!success) {
        try {
          const regularResponse = await fetch('/api/messages/read', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ senderId: userId })
          });
          
          if (regularResponse.ok) {
            success = true;
          }
        } catch (regularErr) {
          console.log("Regular read endpoint failed:", regularErr);
        }
      }
      
      // Update unread count in conversations regardless of API success
      // This gives a better UX even if the backend fails
      setConversations(prev => {
        return prev.map(conv => {
          if (conv.user.id === userId) {
            return { ...conv, unreadCount: 0 };
          }
          return conv;
        });
      });
    } catch (err) {
      console.error("Failed to mark messages as read:", err);
    }
  };

  // Send a new message
  const sendMessage = async () => {
    if (!selectedUser || !newMessage.trim()) return;
    
    try {
      const token = localStorage.getItem('token');
      const newMessageContent = newMessage.trim();
      // Ensure the admin ID is properly formatted
      const adminId = currentUser?.id || '';
      console.log('Sending message with admin ID:', adminId);
      
      const tempMessage = {
        id: `temp-${Date.now()}`,
        content: newMessageContent,
        senderId: adminId,
        receiverId: selectedUser.id,
        createdAt: new Date().toISOString(),
        read: true,
        sender: currentUser,
        receiver: selectedUser,
        applicationId: null
      };
      
      // Optimistically add the message
      setMessages(prev => [...prev, tempMessage] as Message[]);
      setNewMessage('');
      
      let success = false;
      let messageData = null;
      
      try {
        // Try the admin endpoint first
        const response = await fetch('/api/admin/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            content: newMessageContent,
            receiverId: selectedUser.id,
            applicationId: null
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          messageData = data;
          success = true;
          console.log('Messages from admin endpoint:', data);
          // Debug the first message to see structure
          if (data && data.message) {
            console.log('First message structure:', JSON.stringify(data.message, null, 2));
          }
        }
      } catch (adminErr) {
        console.log("Admin send message endpoint failed:", adminErr);
      }
      
      // If admin endpoint didn't work, try regular endpoint
      if (!success) {
        try {
          const regularResponse = await fetch('/api/messages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              content: newMessageContent,
              receiverId: selectedUser.id,
              applicationId: null
            })
          });
          
          if (regularResponse.ok) {
            const regularData = await regularResponse.json();
            messageData = regularData;
            success = true;
          }
        } catch (regularErr) {
          console.log("Regular send message endpoint failed:", regularErr);
        }
      }
      
      if (success && messageData) {
        // Replace the temporary message with the real one
        setMessages(prev => prev.map(msg => 
          typeof msg !== 'string' && msg.id === tempMessage.id ? messageData.message : msg
        ));
        
        // Mark messages as read after sending a message
        markMessagesAsRead(selectedUser.id);
        
        // Update conversations list to show the latest message
        fetchConversations();
      } else {
        // If both endpoints failed but we didn't throw an error yet
        throw new Error("Both send message endpoints failed");
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      // Remove the temporary message on error
      setMessages(prev => prev.filter(msg => !msg.id.startsWith('temp-')));
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
    
    // Update URL with userId parameter
    router.push(`/admin/messages?userId=${user.id}`);
  };

  // Get display name for a user
  const getDisplayName = (user: User) => {
    return user.fullName || user.username || "Unknown User";
  };

  // Admin authentication is handled by the HOC

  return (
    <div className="container mx-auto py-6">
      <motion.h1 
        className="text-3xl font-bold text-white mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        Messages
      </motion.h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
        <motion.div
          className="md:col-span-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-gray-900 border-gray-800 h-full overflow-hidden">
            <CardContent className="p-0 h-full">
              <AdminAnimatedConversationList
                conversations={conversations}
                selectedUserId={selectedUser?.id || null}
                onSelectConversation={selectConversation}
                getUserDisplayName={getDisplayName}
                formatTimestamp={formatTimestamp}
                getUserInitials={(user) => {
                  const name = user.fullName || user.username;
                  return name ? name.substring(0, 2).toUpperCase() : 'UN';
                }}
                loading={loading}
              />
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          className="md:col-span-2 h-full"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="bg-gray-900 border-gray-800 h-full flex flex-col overflow-hidden">
            <CardContent className="p-0 flex-1 flex flex-col h-full">
              {selectedUser ? (
                <motion.div 
                  className="flex flex-col h-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-4 border-b border-gray-800 bg-gray-800/50">
                    <h2 className="text-xl font-semibold text-white">
                      {getDisplayName(selectedUser)}
                    </h2>
                  </div>
                  
                  {/* Debug current user ID rendered invisibly */}
                  <div style={{ display: 'none' }}>
                    {currentUser?.id && `Current user ID: ${currentUser.id}`}
                  </div>
                  {messagesLoading ? (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                    </div>
                  ) : (
                    <AnimatedMessageList
                      messages={messages}
                      currentUserId={selectedUser?.id} // Use selectedUser ID instead of currentUser ID
                      formatTimestamp={formatTimestamp}
                      isTyping={isTyping}
                    />
                  )}
                  
                  <AnimatedMessageInput
                    value={newMessage}
                    onChange={setNewMessage}
                    onSend={sendMessage}
                    disabled={isTyping}
                  />
                </motion.div>
              ) : (
                <div className="flex justify-center items-center h-full">
                  <motion.div 
                    className="text-gray-400 text-center p-6"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      animate={{ 
                        rotate: [0, 5, 0, -5, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                      className="text-5xl mb-4"
                    >
                      💬
                    </motion.div>
                    <p className="text-xl">Select a conversation to start messaging</p>
                  </motion.div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default withAdminProtection(AdminMessagesPage);
