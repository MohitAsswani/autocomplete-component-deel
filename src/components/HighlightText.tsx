import { FC } from 'react';

interface HighlightTextProps {
    text: string;
    query: string;
}

export const HighlightText: FC<HighlightTextProps> = ({ text, query }) => {
    if (!query) return <>{text}</>;
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);

    return (
        <>
            {parts.map((part, index) =>
                part.toLowerCase() === query.toLowerCase() ? (
                    <strong key={index} className="highlight">
                        {part}
                    </strong>
                ) : (
                    part
                )
            )}
        </>
    );
}; 