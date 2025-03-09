import { FC, memo } from 'react';
import { User } from '../types/user';
import { HighlightText } from './HighlightText';
import styles from './Autocomplete.module.css';

interface SuggestionItemProps {
    user: User;
    isSelected: boolean;
    query: string;
    onSelect: (name: string) => void;
}

// Memoize the component to prevent unnecessary re-renders
export const SuggestionItem: FC<SuggestionItemProps> = memo(({
    user,
    isSelected,
    query,
    onSelect,
}) => (
    <button
        type="button"
        className={`${styles.suggestionItem} ${isSelected ? styles.selected : ''}`}
        onClick={() => onSelect(user.name)}
        role="option"
        aria-selected={isSelected}
    >
        {/* Main user info */}
        <div className={styles.primaryText}>
            <HighlightText text={user.name} query={query} />
        </div>

        {/* Contact info */}
        <div className={styles.secondaryText}>
            <HighlightText text={user.email} query={query} />
        </div>

        {/* Username */}
        <div className={styles.tertiaryText}>
            <HighlightText text={`@${user.username}`} query={query} />
        </div>
    </button>
)); 