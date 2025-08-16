import React from 'react';
import { motion, Variants } from 'framer-motion';
import { CheckCheck, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnimatedMessageProps {
  content: string;
  timestamp: string;
  isOutgoing: boolean;
  isRead: boolean;
  isNew?: boolean;
}

export default function AnimatedMessage({ 
  content, 
  timestamp, 
  isOutgoing, 
  isRead,
  isNew = false
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
        <p className="text-sm md:text-base">{content}</p>
        <div className="flex items-center justify-end gap-1 text-xs opacity-70 mt-1">
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
