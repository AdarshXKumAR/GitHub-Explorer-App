import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, GitFork, Eye, Calendar, ExternalLink, Info, Download, User, AlertCircle, X, Bookmark } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { RepositoryAnalytics } from './RepositoryAnalytics';
import { GitHubRepository } from '../types/github';
import { formatNumber, formatDate, formatRelativeTime, truncateText } from '../utils/formatters';

interface RepositoryCardProps {
  repository: GitHubRepository;
  isBookmarked: boolean;
  onToggleBookmark: (repo: GitHubRepository) => void;
}

export const RepositoryCard: React.FC<RepositoryCardProps> = ({
  repository,
  isBookmarked,
  onToggleBookmark
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const stats = [
    { icon: Star, value: formatNumber(repository.stargazers_count), color: 'text-yellow-500', label: 'Stars' },
    { icon: GitFork, value: formatNumber(repository.forks_count), color: 'text-blue-500', label: 'Forks' },
    { icon: Eye, value: formatNumber(repository.watchers_count), color: 'text-green-500', label: 'Watchers' }
  ];

  const downloadRepo = () => {
    const downloadUrl = `${repository.html_url}/archive/refs/heads/${repository.default_branch}.zip`;
    window.open(downloadUrl, '_blank');
  };

  const viewOwner = () => {
    window.open(repository.owner.html_url, '_blank');
  };

  // Mock recent commits data
  const recentCommits = [
    {
      id: '1',
      message: 'Fix: Update dependencies and security patches',
      author: 'john-doe',
      date: '2 hours ago',
      sha: 'a1b2c3d'
    },
    {
      id: '2',
      message: 'Feature: Add new authentication system',
      author: 'jane-smith',
      date: '1 day ago',
      sha: 'e4f5g6h'
    },
    {
      id: '3',
      message: 'Docs: Update README with installation guide',
      author: 'dev-team',
      date: '3 days ago',
      sha: 'i7j8k9l'
    }
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        whileHover={{ y: -4 }}
        className="h-full"
      >
        <Card className="repo-card-container p-6 relative">
          {/* Bookmark button in top right corner */}
          <button
            onClick={() => onToggleBookmark(repository)}
            className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-200 ${
              isBookmarked 
                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/50' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <Bookmark className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>

          <div className="repo-card-content">
            {/* Header */}
            <div className="flex items-start gap-4 mb-4 pr-12">
              <motion.img
                whileHover={{ scale: 1.1 }}
                src={repository.owner.avatar_url}
                alt={repository.owner.login}
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-gray-200 dark:ring-gray-700"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                  {repository.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  by {repository.owner.login}
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed line-clamp-3">
              {repository.description 
                ? repository.description
                : 'No description available'
              }
            </p>

            {/* Stats - Plain styling without colored borders */}
            <div className="flex items-center gap-4 mb-4 text-sm">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-1">
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  <span className="text-gray-600 dark:text-gray-400">{stat.value}</span>
                </div>
              ))}
              <div className="flex items-center gap-1">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span className="text-gray-600 dark:text-gray-400">{formatNumber(repository.open_issues_count)}</span>
              </div>
            </div>

            {/* Language and Date */}
            <div className="flex items-center justify-between mb-6 text-sm">
              <div className="flex items-center gap-2">
                {repository.language && (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium text-xs">
                    {repository.language}
                  </span>
                )}
                {repository.topics?.slice(0, 2).map((topic) => (
                  <span
                    key={topic}
                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg font-medium text-xs"
                  >
                    {topic}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>{formatRelativeTime(repository.updated_at)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="repo-card-actions flex gap-2">
            <Button
              onClick={() => window.open(repository.html_url, '_blank')}
              icon={ExternalLink}
              className="flex-1"
              size="sm"
            >
              View on GitHub
            </Button>
            
            <Button
              onClick={() => setShowDetails(true)}
              variant="secondary"
              icon={Info}
              size="sm"
            >
              Details
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Enhanced Details Modal with Custom Header */}
      {showDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowDetails(false)}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden border border-gray-200 dark:border-gray-700 relative"
          >
            {/* Custom Header with Action Buttons */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {repository.name} - Repository Details
              </h2>
              
              {/* Action buttons positioned before close button */}
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.open(repository.html_url, '_blank')}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-all duration-200"
                >
                  <ExternalLink className="w-4 h-4" />
                  GitHub
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={downloadRepo}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-all duration-200"
                >
                  <Download className="w-4 h-4" />
                  Download
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={viewOwner}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all duration-200"
                >
                  <User className="w-4 h-4" />
                  Owner
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onToggleBookmark(repository)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isBookmarked 
                      ? 'text-yellow-700 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 hover:bg-yellow-100 dark:hover:bg-yellow-900/30'
                      : 'text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Bookmark className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
                  {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                </motion.button>
                
                {/* Close button */}
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ml-2"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-8">
                {/* Repository Header */}
                <div className="flex items-start gap-6">
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    src={repository.owner.avatar_url}
                    alt={repository.owner.login}
                    className="w-20 h-20 rounded-2xl object-cover ring-4 ring-gray-200 dark:ring-gray-700"
                  />
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {repository.full_name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                      {repository.description || 'No description available'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {repository.topics?.slice(0, 8).map((topic) => (
                        <span
                          key={topic}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Enhanced Stats without card animations */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="stat-card-plain bg-gray-50 dark:bg-gray-800">
                    <Star className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">
                      {formatNumber(repository.stargazers_count)}
                    </div>
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Stars</div>
                  </div>
                  
                  <div className="stat-card-plain bg-gray-50 dark:bg-gray-800">
                    <GitFork className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                      {formatNumber(repository.forks_count)}
                    </div>
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Forks</div>
                  </div>
                  
                  <div className="stat-card-plain bg-gray-50 dark:bg-gray-800">
                    <Eye className="w-8 h-8 text-green-500 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                      {formatNumber(repository.watchers_count)}
                    </div>
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Watchers</div>
                  </div>
                  
                  <div className="stat-card-plain bg-gray-50 dark:bg-gray-800">
                    <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-1">
                      {formatNumber(repository.open_issues_count)}
                    </div>
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Issues</div>
                  </div>
                </div>

                {/* Repository Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-4 text-lg">Repository Info</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400 font-medium">Language:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{repository.language || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400 font-medium">Size:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{formatNumber(repository.size)} KB</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400 font-medium">Default Branch:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{repository.default_branch}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400 font-medium">License:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{repository.license?.name || 'None'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-4 text-lg">Timeline</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400 font-medium">Created:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{formatDate(repository.created_at)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400 font-medium">Updated:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{formatDate(repository.updated_at)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400 font-medium">Last Push:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{formatDate(repository.pushed_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Repository Analytics */}
                <RepositoryAnalytics repository={repository} />

                {/* Recent Commits Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6"
                >
                  <h4 className="font-bold text-gray-900 dark:text-white mb-4 text-lg flex items-center gap-2">
                    <GitFork className="w-5 h-5 text-indigo-500" />
                    Recent Commits
                  </h4>
                  <div className="commits-section hide-scrollbar">
                    {recentCommits.map((commit, index) => (
                      <motion.div
                        key={commit.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="commit-item bg-white dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {commit.message}
                            </p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                              <span>{commit.author}</span>
                              <span>•</span>
                              <span>{commit.date}</span>
                              <span>•</span>
                              <code className="bg-gray-100 dark:bg-gray-600 px-1 rounded">
                                {commit.sha}
                              </code>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};