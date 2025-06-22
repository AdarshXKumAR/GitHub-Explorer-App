import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Trash2, Bookmark, Info } from 'lucide-react';
import { Button } from './ui/Button';
import { BookmarkedRepo, GitHubRepository } from '../types/github';
import { formatNumber, formatDate } from '../utils/formatters';

interface BookmarksPanelProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: BookmarkedRepo[];
  onRemoveBookmark: (repoId: number) => void;
  onViewDetails?: (bookmark: BookmarkedRepo) => void;
}

export const BookmarksPanel: React.FC<BookmarksPanelProps> = ({
  isOpen,
  onClose,
  bookmarks,
  onRemoveBookmark,
  onViewDetails
}) => {
  const handleViewDetails = (bookmark: BookmarkedRepo) => {
    // Convert bookmark to repository format for details view
    const repo: GitHubRepository = {
      id: bookmark.id,
      name: bookmark.name,
      full_name: `${bookmark.owner}/${bookmark.name}`,
      description: bookmark.description,
      html_url: bookmark.html_url,
      stargazers_count: bookmark.stargazers_count,
      forks_count: 0,
      watchers_count: 0,
      language: bookmark.language,
      size: 0,
      created_at: bookmark.bookmarked_at,
      updated_at: bookmark.bookmarked_at,
      pushed_at: bookmark.bookmarked_at,
      owner: {
        login: bookmark.owner,
        avatar_url: `https://github.com/${bookmark.owner}.png`,
        html_url: `https://github.com/${bookmark.owner}`
      },
      topics: [],
      license: null,
      open_issues_count: 0,
      default_branch: 'main'
    };
    
    // Trigger the same details modal as repo cards
    if (onViewDetails) {
      onViewDetails(bookmark);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                    <Bookmark className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Bookmarks
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {bookmarks.length} saved repositories
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {bookmarks.length === 0 ? (
                  <div className="text-center py-12">
                    <Bookmark className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No bookmarks yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Start exploring repositories and bookmark your favorites!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookmarks.map((bookmark, index) => (
                      <motion.div
                        key={bookmark.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 dark:text-white truncate">
                              {bookmark.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              by {bookmark.owner}
                            </p>
                          </div>
                        </div>

                        {bookmark.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                            {bookmark.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              ⭐ {formatNumber(bookmark.stargazers_count)}
                            </span>
                            {bookmark.language && (
                              <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">
                                {bookmark.language}
                              </span>
                            )}
                          </div>
                          <span className="text-xs">
                            {formatDate(bookmark.bookmarked_at)}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={() => window.open(bookmark.html_url, '_blank')}
                            size="sm"
                            icon={ExternalLink}
                            className="flex-1"
                          >
                            View
                          </Button>
                          <Button
                            onClick={() => handleViewDetails(bookmark)}
                            size="sm"
                            variant="secondary"
                            icon={Info}
                          >
                            Details
                          </Button>
                          <Button
                            onClick={() => onRemoveBookmark(bookmark.id)}
                            size="sm"
                            variant="ghost"
                            icon={Trash2}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};