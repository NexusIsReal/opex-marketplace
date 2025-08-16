import React from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

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

interface AnimatedConversationListProps {
  conversations: Conversation[];
  selectedUserId: string | null;
  onSelectConversation: (user: User) => void;
  formatTimestamp: (timestamp: string) => string;
  getUserInitials: (user: User) => string;
  getUserDisplayName: (user: User) => string;
}

export default function AnimatedConversationList({
  conversations,
  selectedUserId,
  onSelectConversation,
  formatTimestamp,
  getUserInitials,
  getUserDisplayName
}: AnimatedConversationListProps) {
  // List animation
  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      } as any
    }
  };

  // Item animation
  const itemVariants = {
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
  const badgeVariants = {
    initial: { scale: 0 },
    animate: { 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 15
      } as any
    }
  };

  return (
    <div className="divide-y divide-gray-700">
      {conversations.length === 0 ? (
        <motion.div 
          className="p-6 text-gray-400 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          No conversations yet
        </motion.div>
      ) : (
        <motion.div
          variants={listVariants}
          initial="hidden"
          animate="visible"
        >
          {conversations.map((conversation) => (
            <motion.div 
              key={conversation.user.id}
              variants={itemVariants}
              className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-800 transition-all ${
                selectedUserId === conversation.user.id ? 'bg-gray-800 border-l-4 border-[#9945FF]' : ''
              }`}
              onClick={() => onSelectConversation(conversation.user)}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
            >
              <Avatar className="h-10 w-10 ring-2 ring-offset-2 ring-offset-gray-900 ring-[#9945FF]">
                <AvatarFallback className="bg-gradient-to-br from-[#9945FF] to-[#8935EE]">
                  {getUserInitials(conversation.user)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <div className="font-medium text-white truncate">
                    {getUserDisplayName(conversation.user)}
                  </div>
                  <div className="text-xs text-gray-400">
                    {conversation.lastMessage && formatTimestamp(conversation.lastMessage.createdAt)}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="text-sm text-gray-400 truncate flex-1">
                    {conversation.lastMessage ? conversation.lastMessage.content : 'No messages yet'}
                  </div>
                  
                  {conversation.unreadCount > 0 && (
                    <motion.div
                      variants={badgeVariants}
                      initial="initial"
                      animate="animate"
                    >
                      <Badge className="bg-gradient-to-r from-[#9945FF] to-[#8935EE] animate-pulse">
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
  );
}
