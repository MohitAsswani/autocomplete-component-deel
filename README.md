# TypeScript React Autocomplete Component

A modern, accessible, and customizable autocomplete component built with React and TypeScript. This component provides a rich user experience with features like keyboard navigation, debounced search, and highlighted search results.

## Features

- 🔍 Real-time search with debounced input
- ⌨️ Full keyboard navigation support
- 💅 Modern and clean UI with CSS Modules
- ♿ Fully accessible (WAI-ARIA compliant)
- 🎯 Highlighted search matches
- 🔄 Loading states and error handling
- 🎨 Customizable styling
- 📦 TypeScript support

## Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── Autocomplete.tsx        # Main component
│   ├── Autocomplete.module.css # Styles
│   ├── HighlightText.tsx      # Text highlighting component
│   └── SuggestionItem.tsx     # Individual suggestion component
├── hooks/
│   ├── useOutsideClick.ts     # Click outside handler
│   └── useUsers.ts            # User data and filtering logic
├── types/
│   └── user.ts                # TypeScript interfaces
└── main.tsx                   # Entry point
```

## Component Usage

```tsx
import { Autocomplete } from "./components/Autocomplete";

function App() {
  return <Autocomplete />;
}
```

## Features in Detail

### Keyboard Navigation

- `↑` / `↓`: Navigate through suggestions
- `Enter`: Select the highlighted suggestion
- `Escape`: Close the suggestions dropdown

### Search Features

- Debounced search (300ms)
- Highlights matching text in suggestions
- Shows loading state during search
- Handles errors gracefully
- No results state

### Accessibility

- Proper ARIA attributes
- Semantic HTML structure
- Keyboard navigation support
- Screen reader friendly

### Styling

- Modern and clean design
- Responsive layout
- Smooth transitions
- Focus and hover states
- CSS Modules for style encapsulation

## Development

The component is built with modern React practices including:

- Functional components
- React hooks
- TypeScript for type safety
- CSS Modules for styling
- Custom hooks for reusable logic

## Contributing

Feel free to submit issues and enhancement requests!
