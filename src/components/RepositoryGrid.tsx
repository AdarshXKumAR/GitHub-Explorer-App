import React from 'react';
import { motion } from 'framer-motion';
import { Search, AlertCircle, RefreshCw } from 'lucide-react';
import { RepositoryCard } from './RepositoryCard';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { Button } from './ui/Button';
import { GitHubRepository } from '../types/github';

interface RepositoryGridProps {
  repositories: GitHubRepository[];
  loading: boolean;
  error: string | null;
  isBookmarked: (repoId: number) => boolean;
  onToggleBookmark: (repo: GitHubRepository) => void;
  onRetry: () => void;
}

export const RepositoryGrid: React.FC<RepositoryGridProps> = ({
  repositories,
  loading,
  error,
  isBookmarked,
  onToggleBookmark,
  onRetry
}) => {
  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex flex-col items-center justify-center py-20">
          <LoadingSpinner size="lg" className="mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Searching repositories...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Oops! Something went wrong
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            {error}
          </p>
          <Button onClick={onRetry} icon={RefreshCw}>
            Try Again
          </Button>
        </motion.div>
      </section>
    );
  }

  if (repositories.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No repositories found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search criteria or filters
          </p>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {repositories.map((repo, index) => (
          <motion.div
            key={repo.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <RepositoryCard
              repository={repo}
              isBookmarked={isBookmarked(repo.id)}
              onToggleBookmark={onToggleBookmark}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
};