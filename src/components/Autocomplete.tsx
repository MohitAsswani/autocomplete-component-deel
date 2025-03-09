import { FC, useState, useEffect, useRef, KeyboardEvent } from 'react';
import { User } from '../types/user';
import { useUsers } from '../hooks/useUsers';
import { useOutsideClick } from '../hooks/useOutsideClick';
import { SuggestionItem } from './SuggestionItem';
import styles from './Autocomplete.module.css';

export const Autocomplete: FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState<User[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);

    const searchBoxRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const { filterUsers, isLoading, error } = useUsers();
    useOutsideClick(searchBoxRef, () => setShowDropdown(false));

    useEffect(() => {
        if (!searchTerm?.trim()) {
            setSuggestions([]);
            setShowDropdown(false);
            return;
        }

        let isSubscribed = true;
        const searchTimeout = setTimeout(async () => {
            try {
                const results = await filterUsers(searchTerm);
                if (isSubscribed) {
                    setSuggestions(results);
                    setShowDropdown(true);
                }
            } catch (err) {
                console.warn('Search failed:', err);
            }
        }, 300);

        return () => {
            isSubscribed = false;
            clearTimeout(searchTimeout);
        };
    }, [searchTerm, filterUsers]);

    const handleKeyboardNavigation = (e: KeyboardEvent<HTMLInputElement>) => {
        if (!showDropdown) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setActiveIndex(prev =>
                    prev < suggestions.length - 1 ? prev + 1 : prev
                );
                break;

            case 'ArrowUp':
                e.preventDefault();
                setActiveIndex(prev => (prev > 0 ? prev - 1 : -1));
                break;

            case 'Enter':
                if (activeIndex >= 0 && suggestions[activeIndex]) {
                    selectUser(suggestions[activeIndex].name);
                }
                break;

            case 'Escape':
                setShowDropdown(false);
                setActiveIndex(-1);
                break;
        }
    };

    const selectUser = (name: string) => {
        setSearchTerm(name);
        setShowDropdown(false);
        setActiveIndex(-1);
        inputRef.current?.blur();
    };

    return (
        <div className={styles.container}>
            <div className={styles.wrapper} ref={searchBoxRef}>
                <label htmlFor="user-search" className={styles.label}>
                    Find Users
                </label>

                <input
                    id="user-search"
                    ref={inputRef}
                    type="text"
                    value={searchTerm}
                    onChange={e => {
                        setSearchTerm(e.target.value);
                        setActiveIndex(-1);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    onKeyDown={handleKeyboardNavigation}
                    placeholder="Type a name, email, or username..."
                    aria-autocomplete="list"
                    aria-expanded={showDropdown}
                    aria-busy={isLoading}
                    className={styles.input}
                />

                {showDropdown && (
                    <div className={styles.suggestionsList} role="listbox">
                        {isLoading && (
                            <div className={styles.statusMessage}>
                                Searching...
                            </div>
                        )}

                        {error && (
                            <div className={`${styles.statusMessage} ${styles.error}`}>
                                {error}
                            </div>
                        )}

                        {!isLoading && !error && suggestions.length === 0 && (
                            <div className={styles.statusMessage}>
                                No matching users found
                            </div>
                        )}

                        {suggestions.map((user, index) => (
                            <SuggestionItem
                                key={user.id}
                                user={user}
                                isSelected={index === activeIndex}
                                query={searchTerm}
                                onSelect={selectUser}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}; 