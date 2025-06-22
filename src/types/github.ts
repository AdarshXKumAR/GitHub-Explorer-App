export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  language: string | null;
  size: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  owner: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
  topics: string[];
  license: {
    name: string;
    spdx_id: string;
  } | null;
  open_issues_count: number;
  default_branch: string;
}

export interface GitHubSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubRepository[];
}

export interface SearchFilters {
  language: string;
  sort: string;
  dateFilter: string;
  starsFilter: string;
  query: string;
}

export interface BookmarkedRepo {
  id: number;
  name: string;
  owner: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  bookmarked_at: string;
}

export interface RepoStats {
  totalRepos: number;
  totalStars: number;
  topLanguage: string;
  avgForks: number;
}