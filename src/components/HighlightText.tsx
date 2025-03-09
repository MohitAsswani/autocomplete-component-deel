import { FC, useMemo } from 'react';

interface HighlightTextProps {
    text: string;
    query: string;
}

export const HighlightText: FC<HighlightTextProps> = ({ text, query }) => {
    // If no query, return the original text
    if (!query?.trim()) {
        return <>{text}</>;
    }

    // Memoize the split parts to avoid recalculation on every render
    const parts = useMemo(() => {
        try {
            // Escape special regex characters in the query
            const sanitizedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`(${sanitizedQuery})`, 'gi');
            return text.split(regex);
        } catch (error) {
            // If regex fails, return the original text as a single part
            console.warn('Error splitting text:', error);
            return [text];
        }
    }, [text, query]);

    return (
        <>
            {parts.map((part, index) => {
                const isMatch = part.toLowerCase() === query.toLowerCase();
                return isMatch ? (
                    <strong key={`${part}-${index}`} className="highlight">
                        {part}
                    </strong>
                ) : (
                    part
                );
            })}
        </>
    );
}; 