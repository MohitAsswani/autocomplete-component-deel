import { useState, useEffect, useCallback } from 'react';
import { User } from '../types/user';

interface UseUsersReturn {
  allUsers: User[];
  filterUsers: (query: string) => Promise<User[]>;
  isLoading: boolean;
  error: string | null;
}

export const useUsers = (): UseUsersReturn => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        setAllUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch users');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllUsers();
  }, []);

  const filterUsers = useCallback(
    async (query: string) => {
      // Added API delay for smoother experience
      await new Promise(resolve => setTimeout(resolve, 300)); 
      return allUsers.filter(user =>
        Object.values(user).some(value =>
          value.toString().toLowerCase().includes(query.toLowerCase())
        )
      );
    },
    [allUsers]
  );

  return { allUsers, filterUsers, isLoading, error };
}; 