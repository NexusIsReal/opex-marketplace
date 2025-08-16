import React from 'react';
import { motion } from 'framer-motion';

export default function TypingIndicator() {
  return (
    <div className="flex justify-start mb-4">
      <div className="bg-gray-700 rounded-lg px-4 py-2 shadow-lg">
        <div className="flex space-x-2">
          {[0, 1, 2].map((dot) => (
            <motion.div
              key={dot}
              className="w-2 h-2 bg-gray-400 rounded-full"
              initial={{ y: 0 }}
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 0.6,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "loop",
                delay: dot * 0.1,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
