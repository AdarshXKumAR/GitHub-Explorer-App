import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, TrendingUp, BarChart3 } from 'lucide-react';
import { Button } from './ui/Button';
import { SearchFilters } from '../types/github';

interface SearchSectionProps {
  onSearch: (filters: SearchFilters) => void;
  onTrending: () => void;
  onAnalytics: () => void;
  loading: boolean;
}

export const SearchSection: React.FC<SearchSectionProps> = ({
  onSearch,
  onTrending,
  onAnalytics,
  loading
}) => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    language: '',
    sort: 'stars',
    dateFilter: '',
    starsFilter: '0'
  });

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12"
    >
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
        {/* Search Input */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={filters.query}
            onChange={(e) => setFilters({ ...filters, query: e.target.value })}
            onKeyPress={handleKeyPress}
            placeholder="Search repositories, users, or topics..."
            className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 dark:border-gray-600 rounded-2xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Filter className="inline w-4 h-4 mr-1" />
              Language
            </label>
            <select
              value={filters.language}
              onChange={(e) => setFilters({ ...filters, language: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">All Languages</option>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="typescript">TypeScript</option>
              <option value="go">Go</option>
              <option value="rust">Rust</option>
              <option value="cpp">C++</option>
              <option value="php">PHP</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sort By
            </label>
            <select
              value={filters.sort}
              onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            >
              <option value="stars">Most Stars</option>
              <option value="updated">Recently Updated</option>
              <option value="created">Recently Created</option>
              <option value="forks">Most Forks</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Created
            </label>
            <select
              value={filters.dateFilter}
              onChange={(e) => setFilters({ ...filters, dateFilter: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">Any time</option>
              <option value="2024-01-01">This year</option>
              <option value="2024-06-01">Last 6 months</option>
              <option value="2024-11-01">Last month</option>
              <option value="2024-12-08">Last week</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Minimum Stars
            </label>
            <select
              value={filters.starsFilter}
              onChange={(e) => setFilters({ ...filters, starsFilter: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            >
              <option value="0">Any</option>
              <option value="10">10+</option>
              <option value="100">100+</option>
              <option value="1000">1000+</option>
              <option value="10000">10000+</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          <Button
            onClick={handleSearch}
            disabled={loading}
            icon={Search}
            size="lg"
          >
            {loading ? 'Searching...' : 'Search Repositories'}
          </Button>
          
          <Button
            onClick={onTrending}
            variant="secondary"
            disabled={loading}
            icon={TrendingUp}
            size="lg"
          >
            Trending Today
          </Button>
          
          <Button
            onClick={onAnalytics}
            variant="secondary"
            icon={BarChart3}
            size="lg"
          >
            View Analytics
          </Button>
        </div>
      </div>
    </motion.section>
  );
};