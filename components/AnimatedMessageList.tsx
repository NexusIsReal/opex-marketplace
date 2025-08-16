import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedMessage from './AnimatedMessage';
import TypingIndicator from './TypingIndicator';

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  read: boolean;
  createdAt: string;
}

interface AnimatedMessageListProps {
  messages: Message[];
  currentUserId: string;
  formatTimestamp: (timestamp: string) => string;
  isTyping?: boolean;
}

export default function AnimatedMessageList({
  messages,
  currentUserId,
  formatTimestamp,
  isTyping = false
}: AnimatedMessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevMessagesLengthRef = useRef(messages.length);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > prevMessagesLengthRef.current) {
      scrollToBottom();
    }
    prevMessagesLengthRef.current = messages.length;
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div 
      className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(100vh-16rem)]"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ overflowY: 'auto' }}
    >
      {messages.length === 0 ? (
        <div className="flex justify-center items-center h-full">
          <motion.div 
            className="text-gray-400 text-center p-6 rounded-lg border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 2, -2, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="text-4xl mb-3"
            >
              💬
            </motion.div>
            <p>No messages yet. Start a conversation!</p>
          </motion.div>
        </div>
      ) : (
        <AnimatePresence>
          {messages.map((message, index) => {
            // In admin interface, we're passing the selectedUser's ID as currentUserId
            // So if the message senderId matches currentUserId, it's FROM the user (should be on left)
            // If it doesn't match, it's FROM the admin (should be on right)
            const isFromUser = message.senderId === currentUserId;
            const isOutgoing = !isFromUser; // Admin messages (not from user) should be on right
            console.log(`Message from ${message.senderId}, selectedUserId: ${currentUserId}, isFromUser: ${isFromUser}, isOutgoing: ${isOutgoing}`);
            const isNew = index === messages.length - 1 && 
                         message.senderId !== currentUserId && 
                         !message.read;
            
            return (
              <AnimatedMessage
                key={message.id}
                content={message.content}
                timestamp={formatTimestamp(message.createdAt)}
                isOutgoing={Boolean(isOutgoing)}
                isRead={message.read}
                isNew={isNew}
              />
            );
          })}
          
          {isTyping && (
            <motion.div
              key="typing-indicator"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <TypingIndicator />
            </motion.div>
          )}
          <div key="messages-end-ref" ref={messagesEndRef} />
        </AnimatePresence>
      )}
    </motion.div>
  );
}
