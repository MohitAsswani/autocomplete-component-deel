import { useEffect, RefObject } from 'react';

type Handler = () => void;

export const useOutsideClick = (
  ref: RefObject<HTMLElement | null>,
  handler: Handler
): void => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [ref, handler]);
}; 