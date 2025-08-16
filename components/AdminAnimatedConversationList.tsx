import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

// Use the same User interface as in admin/messages/page.tsx
interface User {
  id: string;
  username: string;
  fullName: string | null;
  role: string;
}

interface Message {
  id: string;
  content: string;
  createdAt: string;
}

interface Conversation {
  user: User;
  lastMessage: Message;
  unreadCount: number;
}

interface AdminAnimatedConversationListProps {
  conversations: Conversation[];
  selectedUserId: string | null;
  onSelectConversation: (user: User) => void;
  formatTimestamp: (timestamp: string) => string;
  getUserInitials: (user: User) => string;
  getUserDisplayName: (user: User) => string;
  loading?: boolean;
}

export default function AdminAnimatedConversationList({
  conversations,
  selectedUserId,
  onSelectConversation,
  formatTimestamp,
  getUserInitials,
  getUserDisplayName,
  loading = false
}: AdminAnimatedConversationListProps) {
  // List animation
  const listVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Item animation
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      } as any
    }
  };

  // Badge animation
  const badgeVariants: Variants = {
    hidden: { scale: 0 },
    visible: { 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 20,
        delay: 0.2
      } as any
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full p-4 space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center space-x-4 p-3 rounded-lg animate-pulse">
            <div className="w-10 h-10 rounded-full bg-gray-700"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-700 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-xl font-semibold text-white">Conversations</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {conversations.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <motion.div 
              className="text-gray-400 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              No conversations yet
            </motion.div>
          </div>
        ) : (
          <motion.div
            className="space-y-2"
            variants={listVariants}
            initial="hidden"
            animate="visible"
          >
            {conversations.map((conversation) => (
              <motion.div
                key={conversation.user.id}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedUserId === conversation.user.id 
                    ? 'bg-gray-800 border-l-4 border-[#9945FF]' 
                    : 'hover:bg-gray-800/50'
                }`}
                onClick={() => onSelectConversation(conversation.user)}
                variants={itemVariants}
                whileHover={{ x: 5 }}
              >
                <Avatar className="h-10 w-10 border-2 border-gray-700">
                  <AvatarFallback className="bg-gray-700 text-white">
                    {getUserInitials(conversation.user)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-white truncate">
                      {getUserDisplayName(conversation.user)}
                    </h3>
                    <span className="text-xs text-gray-400">
                      {formatTimestamp(conversation.lastMessage.createdAt)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-400 truncate max-w-[180px]">
                      {conversation.lastMessage.content}
                    </p>
                    
                    {conversation.unreadCount > 0 && (
                      <motion.div variants={badgeVariants}>
                        <Badge 
                          className="bg-[#9945FF] hover:bg-[#8935EE] text-white"
                          variant="outline"
                        >
                          {conversation.unreadCount}
                        </Badge>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
