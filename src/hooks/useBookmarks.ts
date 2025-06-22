import { useState, useEffect, useCallback } from 'react';
import { BookmarkedRepo, GitHubRepository } from '../types/github';

const STORAGE_KEY = 'github_explorer_bookmarks';

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkedRepo[]>([]);

  useEffect(() => {
    const savedBookmarks = localStorage.getItem(STORAGE_KEY);
    if (savedBookmarks) {
      try {
        setBookmarks(JSON.parse(savedBookmarks));
      } catch (error) {
        console.error('Error loading bookmarks:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const saveBookmarks = useCallback((newBookmarks: BookmarkedRepo[]) => {
    setBookmarks(newBookmarks);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newBookmarks));
  }, []);

  const toggleBookmark = useCallback((repo: GitHubRepository) => {
    const existingIndex = bookmarks.findIndex(b => b.id === repo.id);

    if (existingIndex !== -1) {
      const newBookmarks = bookmarks.filter(b => b.id !== repo.id);
      saveBookmarks(newBookmarks);
    } else {
      const newBookmark: BookmarkedRepo = {
        id: repo.id,
        name: repo.name,
        owner: repo.owner.login,
        description: repo.description,
        html_url: repo.html_url,
        stargazers_count: repo.stargazers_count,
        language: repo.language,
        bookmarked_at: new Date().toISOString()
      };
      saveBookmarks([...bookmarks, newBookmark]);
    }
  }, [bookmarks, saveBookmarks]);

  const isBookmarked = useCallback((repoId: number) => {
    return bookmarks.some(b => b.id === repoId);
  }, [bookmarks]);

  const removeBookmark = useCallback((repoId: number) => {
    const newBookmarks = bookmarks.filter(b => b.id !== repoId);
    saveBookmarks(newBookmarks);
  }, [bookmarks, saveBookmarks]);

  return {
    bookmarks,
    toggleBookmark,
    isBookmarked,
    removeBookmark
  };
};