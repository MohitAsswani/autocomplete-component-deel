import { useState, useEffect, useCallback, useRef } from 'react';
import { User } from '../types/user';

interface UseUsersReturn {
  allUsers: User[];
  filterUsers: (query: string) => Promise<User[]>;
  isLoading: boolean;
  error: string | null;
}

const API_URL = 'https://jsonplaceholder.typicode.com/users';
const SEARCH_DELAY = 300;

export const useUsers = (): UseUsersReturn => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Keep track of the abort controller for cleanup
  const abortControllerRef = useRef<AbortController | null>(null);

  // Fetch users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      // Cleanup previous request if it exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(API_URL, {
          signal: abortController.signal
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setAllUsers(data);
      } catch (err) {
        // Only set error if it's not an abort error
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err.message || 'Failed to fetch users');
        }
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchUsers();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Filter users based on search query
  const filterUsers = useCallback(
    async (query: string): Promise<User[]> => {
      // Added API delay for better UX 
      await new Promise(resolve => setTimeout(resolve, SEARCH_DELAY));

      const searchTerms = query.toLowerCase().split(' ');
      
      return allUsers.filter(user => {
        const searchableText = [
          user.name,
          user.email,
          user.username
        ].join(' ').toLowerCase();

        return searchTerms.every(term => searchableText.includes(term));
      });
    },
    [allUsers]
  );

  return { allUsers, filterUsers, isLoading, error };
}; 