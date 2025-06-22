import { GitHubRepository, RepoStats } from '../types/github';

export const calculateStats = (repositories: GitHubRepository[]): RepoStats => {
  if (repositories.length === 0) {
    return {
      totalRepos: 0,
      totalStars: 0,
      topLanguage: 'None',
      avgForks: 0
    };
  }

  const totalStars = repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const avgForks = Math.round(repositories.reduce((sum, repo) => sum + repo.forks_count, 0) / repositories.length);

  const languageCounts: Record<string, number> = {};
  repositories.forEach(repo => {
    if (repo.language) {
      languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
    }
  });

  const topLanguage = Object.keys(languageCounts).reduce((a, b) =>
    languageCounts[a] > languageCounts[b] ? a : b, 'None');

  return {
    totalRepos: repositories.length,
    totalStars,
    topLanguage,
    avgForks
  };
};

export const getLanguageDistribution = (repositories: GitHubRepository[]) => {
  const languageCounts: Record<string, number> = {};
  
  repositories.forEach(repo => {
    if (repo.language) {
      languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
    }
  });

  return Object.entries(languageCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([language, count]) => ({ language, count }));
};

export const getCreationTimeline = (repositories: GitHubRepository[]) => {
  const monthCounts: Record<string, number> = {};
  
  repositories.forEach(repo => {
    const date = new Date(repo.created_at);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1;
  });

  return Object.entries(monthCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12)
    .map(([month, count]) => {
      const [year, monthNum] = month.split('-');
      const date = new Date(parseInt(year), parseInt(monthNum) - 1);
      return {
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        count
      };
    });
};

export const getSizeDistribution = (repositories: GitHubRepository[]) => {
  const sizeRanges = {
    'Small (< 1MB)': 0,
    'Medium (1-10MB)': 0,
    'Large (10-100MB)': 0,
    'Very Large (> 100MB)': 0
  };

  repositories.forEach(repo => {
    const sizeKB = repo.size;
    const sizeMB = sizeKB / 1024;

    if (sizeMB < 1) sizeRanges['Small (< 1MB)']++;
    else if (sizeMB < 10) sizeRanges['Medium (1-10MB)']++;
    else if (sizeMB < 100) sizeRanges['Large (10-100MB)']++;
    else sizeRanges['Very Large (> 100MB)']++;
  });

  return Object.entries(sizeRanges).map(([range, count]) => ({ range, count }));
};