import React from 'react';
import { motion } from 'framer-motion';
import { Bookmark } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick: () => void;
  bookmarkCount: number;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onClick,
  bookmarkCount
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-30"
    >
      <Bookmark className="w-6 h-6" />
      {bookmarkCount > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
        >
          {bookmarkCount > 99 ? '99+' : bookmarkCount}
        </motion.div>
      )}
    </motion.button>
  );
};