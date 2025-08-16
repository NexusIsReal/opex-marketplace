import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedMessage from './AnimatedMessage';
import TypingIndicator from './TypingIndicator';

interface Attachment {
  name: string;
  type: string;
  url: string;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  read: boolean;
  createdAt: string;
  attachments?: string | null;
}

interface AnimatedMessageListProps {
  messages: Message[];
  currentUserId: string;
  formatTimestamp: (timestamp: string) => string;
  isTyping?: boolean;
  isAdminInterface?: boolean;
}

export default function AnimatedMessageList({
  messages,
  currentUserId,
  formatTimestamp,
  isTyping = false,
  isAdminInterface = false
}: AnimatedMessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevMessagesLengthRef = useRef(messages.length);
  
  // Scroll to bottom when new messages arrive or when typing status changes
  useEffect(() => {
    if (messages.length > 0 || isTyping) {
      scrollToBottom();
    }
  }, [messages, isTyping]);
  
  // Scroll to bottom when the component mounts
  useEffect(() => {
    scrollToBottom();
  }, []);
  
  // Scroll to bottom when the window is resized
  useEffect(() => {
    const handleResize = () => scrollToBottom();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
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

  // Always scroll to bottom when component mounts
  useEffect(() => {
    scrollToBottom();
  }, []);

  return (
    <motion.div 
      className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(100vh-12rem)]"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ 
        overflowY: 'auto',
        scrollbarWidth: 'thin',
        scrollbarColor: '#4a5568 #1a202c',
        paddingBottom: '1rem',
        msOverflowStyle: 'none' /* IE and Edge */
      }}
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
            // Fix message positioning for both interfaces
            // Get the current URL path to determine if we're in admin or user interface
            let path = '';
            if (typeof window !== 'undefined') {
              path = window.location.pathname;
            }
            
            // Determine if we're in the admin interface
            const isAdminInterface = path.includes('/admin/');
            
            // Determine if this is the first sender ID pattern we've seen
            const isFirstSenderId = message.senderId.startsWith('cmedx');
            
            // For admin interface: keep as is (first sender on right)
            // For user interface: reverse it (first sender on left)
            const isOutgoing = isAdminInterface ? isFirstSenderId : !isFirstSenderId;
            
            console.log(`Message from ${message.senderId}, isFirstSenderId: ${isFirstSenderId}, isAdminInterface: ${isAdminInterface}, isOutgoing: ${isOutgoing}`);
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
                attachments={message.attachments ? JSON.parse(message.attachments) : []}
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
