import { useState, useCallback } from 'react';
import { GitHubRepository, GitHubSearchResponse, SearchFilters } from '../types/github';
import { GITHUB_CONFIG, API_HEADERS } from '../config/github';

export const useGitHubAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [repositories, setRepositories] = useState<GitHubRepository[]>([]);

  const buildSearchQuery = useCallback((filters: SearchFilters): string => {
    let query = filters.query.trim() || GITHUB_CONFIG.DEFAULT_QUERY;

    if (filters.language) {
      query += ` language:${filters.language}`;
    }

    if (filters.dateFilter) {
      query += ` created:>${filters.dateFilter}`;
    }

    if (filters.starsFilter && filters.starsFilter !== '0') {
      query += ` stars:>=${filters.starsFilter}`;
    }

    return query;
  }, []);

  const fetchRepositories = useCallback(async (filters: SearchFilters, page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const query = buildSearchQuery(filters);
      const searchParams = new URLSearchParams({
        q: query,
        sort: filters.sort || 'stars',
        order: 'desc',
        per_page: GITHUB_CONFIG.PER_PAGE.toString(),
        page: page.toString()
      });

      console.log('🚀 Fetching repositories with query:', query);

      const response = await fetch(
        `${GITHUB_CONFIG.API_BASE}/search/repositories?${searchParams}`,
        { headers: API_HEADERS }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data: GitHubSearchResponse = await response.json();
      
      // Log rate limit info
      const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
      const rateLimitLimit = response.headers.get('X-RateLimit-Limit');
      console.log(`✅ API Request successful. Rate limit: ${rateLimitRemaining}/${rateLimitLimit}`);
      console.log(`📊 Found ${data.total_count} repositories`);

      setRepositories(data.items || []);
      return data.items || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('❌ Error fetching repositories:', errorMessage);
      setError(errorMessage);
      setRepositories([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [buildSearchQuery]);

  const fetchTrendingRepos = useCallback(async () => {
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const dateString = lastWeek.toISOString().split('T')[0];

    const filters: SearchFilters = {
      query: `created:>${dateString}`,
      language: '',
      sort: 'stars',
      dateFilter: '',
      starsFilter: '10'
    };

    return fetchRepositories(filters);
  }, [fetchRepositories]);

  return {
    loading,
    error,
    repositories,
    fetchRepositories,
    fetchTrendingRepos,
    setError
  };
};