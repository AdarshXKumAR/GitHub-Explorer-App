export const GITHUB_CONFIG = {
  API_BASE: 'https://api.github.com',
  TOKEN: import.meta.env.VITE_GITHUB_TOKEN || '',
  DEFAULT_QUERY: 'stars:>500 sort:stars-desc',
  PER_PAGE: 24,
  RATE_LIMIT_THRESHOLD: 10,
};

export const API_HEADERS = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'GitExplorer-React-v2.0',
  ...(GITHUB_CONFIG.TOKEN && {
    Authorization: `Bearer ${GITHUB_CONFIG.TOKEN}`,
  }),
};
