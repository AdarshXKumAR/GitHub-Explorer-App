import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = true,
  onClick 
}) => {
  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.02 } : {}}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      onClick={onClick}
      className={`
        bg-white dark:bg-gray-800 
        border border-gray-200 dark:border-gray-700 
        rounded-2xl shadow-sm hover:shadow-xl 
        transition-all duration-300
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};