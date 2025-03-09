import { useEffect, RefObject, useCallback } from 'react';

type Handler = () => void;

/**
 * Hook that handles clicks outside of a specified element
 * @param ref - Reference to the element to monitor
 * @param handler - Callback function to execute when clicking outside
 * @param enabled - Optional flag to enable/disable the listener
 */
export const useOutsideClick = (
  ref: RefObject<HTMLElement | null>,
  handler: Handler,
  enabled: boolean = true
): void => {
  const handleClick = useCallback((event: MouseEvent | TouchEvent) => {
    if (!ref.current || !enabled) return;

    const target = event.target as Node;
    
    // Check if click was outside the referenced element
    if (!ref.current.contains(target)) {
      handler();
    }
  }, [ref, handler, enabled]);

  useEffect(() => {
    if (!enabled) return;

    // Add both mouse and touch events for better mobile support
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('touchstart', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('touchstart', handleClick);
    };
  }, [handleClick, enabled]);
}; 