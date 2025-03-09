import { FC, useState, useEffect, useRef, KeyboardEvent } from 'react';
import { User } from '../types/user';
import { useUsers } from '../hooks/useUsers';
import { useOutsideClick } from '../hooks/useOutsideClick';
import { SuggestionItem } from './SuggestionItem';
import styles from './Autocomplete.module.css';

export const Autocomplete: FC = () => {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState<User[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const { filterUsers, isLoading, error } = useUsers();

    // Use custom hook for outside click
    useOutsideClick(containerRef, () => setIsOpen(false));

    // Handle input changes with debounce
    useEffect(() => {
        const handler = async () => {
            if (!inputValue.trim()) {
                setSuggestions([]);
                setIsOpen(false);
                return;
            }

            try {
                const results = await filterUsers(inputValue);
                setSuggestions(results);
                setIsOpen(true);
            } catch (err) {
                console.error('Error filtering results:', err);
            }
        };

        const timer = setTimeout(handler, 300);
        return () => clearTimeout(timer);
    }, [inputValue, filterUsers]);

    // Keyboard navigation
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (!isOpen) return;

        switch (e.key) {
            case 'ArrowDown':
                setSelectedIndex(prev =>
                    prev < suggestions.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
                break;
            case 'Enter':
                if (selectedIndex >= 0 && suggestions[selectedIndex]) {
                    handleSelect(suggestions[selectedIndex].name);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                break;
        }
    };

    const handleSelect = (name: string) => {
        setInputValue(name);
        setIsOpen(false);
    };

    return (
        <div className={styles.container}>
            <div className={styles.wrapper} ref={containerRef}>
                <label htmlFor="user-search" className={styles.label}>
                    Search Users
                </label>
                <input
                    id="user-search"
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                        setSelectedIndex(-1);
                    }}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder="Start typing to search users..."
                    aria-autocomplete="list"
                    aria-expanded={isOpen}
                    aria-busy={isLoading}
                    className={styles.input}
                />

                {isOpen && (
                    <div className={styles.suggestionsList} role="listbox">
                        {isLoading && <div className={styles.statusMessage}>Loading...</div>}
                        {error && <div className={`${styles.statusMessage} ${styles.error}`}>{error}</div>}
                        {!isLoading && !error && suggestions.length === 0 && (
                            <div className={styles.statusMessage}>No results found</div>
                        )}

                        {suggestions.map((user, index) => (
                            <SuggestionItem
                                key={user.id}
                                user={user}
                                isSelected={index === selectedIndex}
                                query={inputValue}
                                onSelect={handleSelect}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}; 