import React from 'react';
import { Github, Moon, Sun, Bookmark } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface HeaderProps {
  onBookmarksClick: () => void;
  bookmarkCount: number;
}

export const Header: React.FC<HeaderProps> = ({ onBookmarksClick, bookmarkCount }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-black/80 border-b border-gray-200/50 dark:border-gray-800/50"
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Clickable Logo & Title */}
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center space-x-3 no-underline"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur-sm opacity-30" />
              <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-xl">
                <Github className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                GitHub Explorer
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Discover Amazing Repositories
              </p>
            </div>
          </Link>


          {/* Right Buttons */}
          <div className="flex items-center gap-3">

            {/* Bookmarks Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onBookmarksClick}
              className="relative p-3 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <Bookmark className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              {bookmarkCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
                >
                  {bookmarkCount > 99 ? '99+' : bookmarkCount}
                </motion.div>
              )}
            </motion.button>

            {/* Theme Toggle */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="relative p-3 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:bg-gray-200 dark:hover:bg-gray-700 overflow-hidden"
            >
              <motion.div
                initial={false}
                animate={{
                  rotate: theme === 'dark' ? 180 : 0,
                  scale: theme === 'dark' ? 1.1 : 1
                }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="relative z-10"
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5 text-gray-600" />
                ) : (
                  <Sun className="w-5 h-5 text-yellow-400" />
                )}
              </motion.div>

              {/* Animated Background */}
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{
                  background: theme === 'dark'
                    ? 'linear-gradient(45deg, #1f2937, #374151)'
                    : 'linear-gradient(45deg, #f3f4f6, #e5e7eb)'
                }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>

          </div>
        </div>
      </nav>
    </motion.header>
  );
};
