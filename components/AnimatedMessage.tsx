import React from 'react';
import { motion, Variants } from 'framer-motion';
import { CheckCheck, Circle, FileText, Image, Paperclip, File } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Attachment {
  name: string;
  type: string;
  url: string;
}

interface AnimatedMessageProps {
  content: string;
  timestamp: string;
  isOutgoing: boolean;
  isRead: boolean;
  isNew?: boolean;
  attachments?: Attachment[];
}

export default function AnimatedMessage({ 
  content, 
  timestamp, 
  isOutgoing, 
  isRead,
  isNew = false,
  attachments = []
}: AnimatedMessageProps) {
  // Use the isOutgoing prop to determine message position
  // Animation variants
  const containerVariants: Variants = {
    hidden: { 
      opacity: 0,
      y: 20,
      scale: 0.8
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 500,
        damping: 40,
        mass: 1
      } as any
    }
  };

  // Bubble animation for new messages
  const bubbleVariants: Variants = {
    pulse: {
      scale: [1, 1.03, 1],
      transition: {
        duration: 0.3
      } as any
    }
  };

  return (
    <motion.div 
      className={cn("flex", isOutgoing ? "justify-end" : "justify-start")}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div 
        className={cn(
          "max-w-[70%] rounded-lg px-4 py-2 shadow-lg",
          isOutgoing 
            ? "bg-gradient-to-r from-[#9945FF] to-[#8935EE] text-white rounded-tr-none" 
            : "bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-tl-none"
        )}
        animate={isNew ? "pulse" : ""}
        variants={bubbleVariants}
        whileHover={{ scale: 1.02 }}
      >
        {content && <p className="text-sm md:text-base">{content}</p>}
        
        {/* Display attachments if present */}
        {attachments && attachments.length > 0 && (
          <div className="mt-2 space-y-2">
            {attachments.map((attachment, index) => {
              // Determine icon based on file type
              let FileIcon = File;
              if (attachment.type.startsWith('image/')) {
                FileIcon = Image;
              } else if (attachment.type.includes('pdf') || attachment.type.includes('document')) {
                FileIcon = FileText;
              }
              
              return (
                <motion.div 
                  key={`${attachment.name}-${index}`}
                  className="flex items-center gap-2 p-2 rounded-md bg-black bg-opacity-20 hover:bg-opacity-30 transition-all"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                >
                  <FileIcon className="h-4 w-4 flex-shrink-0" />
                  <a 
                    href={attachment.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs truncate flex-1 hover:underline"
                  >
                    {attachment.name}
                  </a>
                </motion.div>
              );
            })}
          </div>
        )}
        
        <div className="flex items-center justify-end gap-1 text-xs opacity-70 mt-1">
          {attachments && attachments.length > 0 && (
            <span className="flex items-center gap-1">
              <Paperclip className="h-3 w-3" />{attachments.length}
            </span>
          )}
          <span>{timestamp}</span>
          {isOutgoing && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              {isRead 
                ? <CheckCheck className="h-3 w-3" /> 
                : <Circle className="h-3 w-3" />
              }
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
