import { FC, useMemo } from 'react';

interface HighlightTextProps {
    text: string;
    query: string;
}

export const HighlightText: FC<HighlightTextProps> = ({ text, query }) => {
    if (!query?.trim()) {
        return <>{text}</>;
    }

    const parts = useMemo(() => {
        try {
            const sanitizedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`(${sanitizedQuery})`, 'gi');
            return text.split(regex);
        } catch (error) {
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