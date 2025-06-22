import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Search } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-900/20 bg-animated" />
      
      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-indigo-400/30 dark:bg-indigo-400/20 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.5
            }}
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-8"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Discover the best of GitHub
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6"
        >
          Explore{' '}
          <span className="animate-gradient-text">
            Amazing
          </span>
          <br />
          GitHub Repositories
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          Discover trending projects, analyze contributions, and find your next favorite repository 
          with beautiful visualizations and powerful search capabilities.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <Search className="w-4 h-4 mr-2 text-indigo-500" />
              Advanced Search
            </div>
            <div className="flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-purple-500" />
              Real-time Analytics
            </div>
            <div className="flex items-center">
              <Sparkles className="w-4 h-4 mr-2 text-pink-500" />
              Beautiful UI
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};