import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { SearchSection } from './components/SearchSection';
import { StatsCards } from './components/StatsCards';
import { RepositoryGrid } from './components/RepositoryGrid';
import { Analytics } from './components/Analytics';
import { BookmarksPanel } from './components/BookmarksPanel';
import { useGitHubAPI } from './hooks/useGitHubAPI';
import { useBookmarks } from './hooks/useBookmarks';
import { useTheme } from './hooks/useTheme';
import { calculateStats } from './utils/analytics';
import { SearchFilters, BookmarkedRepo, GitHubRepository } from './types/github';

function App() {
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showBookmarkDetails, setShowBookmarkDetails] = useState<GitHubRepository | null>(null);
  const analyticsRef = useRef<HTMLDivElement>(null);
  
  const { theme } = useTheme();
  const { 
    loading, 
    error, 
    repositories, 
    fetchRepositories, 
    fetchTrendingRepos,
    setError 
  } = useGitHubAPI();
  
  const { 
    bookmarks, 
    toggleBookmark, 
    isBookmarked, 
    removeBookmark 
  } = useBookmarks();

  const stats = calculateStats(repositories);

  useEffect(() => {
    // Load trending repositories on initial load
    fetchTrendingRepos();
  }, [fetchTrendingRepos]);

  const handleSearch = (filters: SearchFilters) => {
    fetchRepositories(filters);
  };

  const handleTrending = () => {
    fetchTrendingRepos();
  };

  const handleAnalytics = () => {
    if (analyticsRef.current) {
      analyticsRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleRetry = () => {
    setError(null);
    fetchTrendingRepos();
  };

  const handleViewBookmarkDetails = (bookmark: BookmarkedRepo) => {
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
    
    setShowBookmarkDetails(repo);
    setShowBookmarks(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      {/* Enhanced animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-900/30 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 dark:bg-yellow-900/30 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 dark:bg-pink-900/30 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-20 animate-blob animation-delay-4000" />
        
        {/* Additional floating elements for dark theme */}
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-indigo-400 dark:bg-indigo-600/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-2xl opacity-10 animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-40 h-40 bg-cyan-400 dark:bg-cyan-600/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-2xl opacity-10 animate-pulse animation-delay-1000" />
      </div>

      <Header 
        onBookmarksClick={() => setShowBookmarks(true)}
        bookmarkCount={bookmarks.length}
      />
      
      <main className="relative">
        <Hero />
        
        <SearchSection
          onSearch={handleSearch}
          onTrending={handleTrending}
          onAnalytics={handleAnalytics}
          loading={loading}
        />

        {!loading && !error && repositories.length > 0 && (
          <StatsCards stats={stats} />
        )}

        <RepositoryGrid
          repositories={repositories}
          loading={loading}
          error={error}
          isBookmarked={isBookmarked}
          onToggleBookmark={toggleBookmark}
          onRetry={handleRetry}
        />

        <div ref={analyticsRef}>
          <Analytics repositories={repositories} />
        </div>
      </main>

      <BookmarksPanel
        isOpen={showBookmarks}
        onClose={() => setShowBookmarks(false)}
        bookmarks={bookmarks}
        onRemoveBookmark={removeBookmark}
        onViewDetails={handleViewBookmarkDetails}
      />

      {/* Bookmark Details Modal */}
      {showBookmarkDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowBookmarkDetails(null)}
          />
          
          {/* Modal - Reuse the same structure as RepositoryCard details */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden border border-gray-200 dark:border-gray-700 relative"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {showBookmarkDetails.name} - Repository Details
              </h2>
              <button
                onClick={() => setShowBookmarkDetails(null)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                ✕
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📖</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Bookmark Details
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  This is a bookmarked repository. Visit GitHub for full details.
                </p>
                <button
                  onClick={() => window.open(showBookmarkDetails.html_url, '_blank')}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  View on GitHub
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default App;