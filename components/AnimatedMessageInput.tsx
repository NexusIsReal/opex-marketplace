import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Smile, Paperclip, X, FileText, Image as ImageIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AnimatedMessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (attachments?: File[]) => void;
  disabled?: boolean;
}

export default function AnimatedMessageInput({
  value,
  onChange,
  onSend,
  disabled = false
}: AnimatedMessageInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const handleSend = () => {
    onSend(attachments.length > 0 ? attachments : undefined);
    setAttachments([]);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };
  
  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };
  
  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="h-4 w-4" />;
    }
    return <FileText className="h-4 w-4" />;
  };

  return (
    <motion.div 
      className="p-4 border-t border-gray-800 bg-gray-900 sticky bottom-0 z-10 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Hidden file input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        multiple 
      />
      
      {/* Attachment preview area */}
      {attachments.length > 0 && (
        <motion.div 
          className="flex flex-wrap gap-2 mb-2 p-2 bg-gray-800/50 rounded-lg"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          {attachments.map((file, index) => (
            <Badge 
              key={`${file.name}-${index}`} 
              variant="outline" 
              className="bg-gray-800 text-white border-gray-700 flex items-center gap-1 pl-2 pr-1 py-1"
            >
              {getFileIcon(file)}
              <span className="max-w-[100px] truncate text-xs">{file.name}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 rounded-full hover:bg-gray-700 p-0"
                onClick={() => removeAttachment(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </motion.div>
      )}
      
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
          onClick={() => fileInputRef.current?.click()}
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
            onClick={() => handleSend()}
            className="bg-gradient-to-r from-[#9945FF] to-[#8935EE] hover:opacity-90"
            disabled={disabled || (!value.trim() && attachments.length === 0)}
          >
            <motion.div
              animate={{ 
                x: (value.trim() || attachments.length > 0) ? [0, 5, 0] : 0 
              }}
              transition={{ 
                repeat: (value.trim() || attachments.length > 0) ? Infinity : 0, 
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
