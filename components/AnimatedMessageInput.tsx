import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Smile, Paperclip } from 'lucide-react';

interface AnimatedMessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

export default function AnimatedMessageInput({
  value,
  onChange,
  onSend,
  disabled = false
}: AnimatedMessageInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <motion.div 
      className="p-4 border-t border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <motion.div 
        className={`flex gap-2 items-center p-1 rounded-lg ${
          isFocused ? 'bg-gray-800/50' : ''
        }`}
        animate={{ 
          boxShadow: isFocused 
            ? '0 0 0 2px rgba(153, 69, 255, 0.3)' 
            : '0 0 0 0px rgba(153, 69, 255, 0)'
        }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          whileHover={{ scale: 1.1, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
          className="text-gray-400 hover:text-gray-300 cursor-pointer"
        >
          <Paperclip className="h-5 w-5" />
        </motion.div>
        
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-gray-800 border-gray-700 text-white focus:ring-[#9945FF] focus:border-[#9945FF]"
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
        />
        
        <motion.div
          whileHover={{ scale: 1.1, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
          className="text-gray-400 hover:text-gray-300 cursor-pointer"
        >
          <Smile className="h-5 w-5" />
        </motion.div>
        
        <motion.div whileTap={{ scale: 0.9 }}>
          <Button 
            onClick={onSend}
            className="bg-gradient-to-r from-[#9945FF] to-[#8935EE] hover:opacity-90"
            disabled={disabled || !value.trim()}
          >
            <motion.div
              animate={{ 
                x: value.trim() ? [0, 5, 0] : 0 
              }}
              transition={{ 
                repeat: value.trim() ? Infinity : 0, 
                repeatDelay: 3,
                duration: 0.3
              }}
            >
              <Send className="h-4 w-4" />
            </motion.div>
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
