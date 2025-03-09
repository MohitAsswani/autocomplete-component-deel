# TypeScript React Autocomplete Component

A modern, accessible, and customizable autocomplete component built with React and TypeScript. This component provides a rich user experience with features like keyboard navigation, debounced search, and highlighted search results.
![image](https://github.com/user-attachments/assets/7b28f52a-247e-40a2-bd61-4853dab7b086)

## Features

- 🔍 Real-time search with debounced input
- ⌨️ Full keyboard navigation support
- 💅 Modern and clean UI with CSS Modules
- ♿ Fully accessible (WAI-ARIA compliant)
- 🎯 Highlighted search matches
- 📱 Responsive design
- 🔄 Loading states and error handling
- 🎨 Customizable styling
- 📦 TypeScript support
- 🧹 Clean code with proper error boundaries
- 🔍 Multi-term search support
- 📱 Touch device support

## Demo

The component provides a user search interface with the following features:

- Search by name, email, or username
- Real-time suggestions as you type
- Keyboard navigation (up/down arrows, enter to select, escape to close)
- Touch-friendly interface
- Highlighted matching text in suggestions
- Loading and error states
- Responsive design that works on all screen sizes

## Installation

```bash
# Clone the repository
git clone https://github.com/MohitAsswani/autocomplete-component-deel
cd autocomplete-component-deel

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Dependencies

- React 18+
- TypeScript 5+
- CSS Modules
- Vite (for development and building)

## Project Structure

```
src/
├── components/
│   ├── Autocomplete.tsx        # Main component with search logic
│   ├── Autocomplete.module.css # Scoped styles
│   ├── HighlightText.tsx      # Text highlighting with regex
│   └── SuggestionItem.tsx     # Individual suggestion with memo
├── hooks/
│   ├── useOutsideClick.ts     # Click outside detection
│   └── useUsers.ts            # User data fetching and filtering
├── types/
│   └── user.ts                # TypeScript interfaces
└── main.tsx                   # Entry point
```

## Implementation Details

### Component Architecture

- **Autocomplete**: Main component managing search state and UI
- **SuggestionItem**: Memoized component for rendering individual results
- **HighlightText**: Utility component for highlighting matched text

### Custom Hooks

- **useUsers**:
  - Manages user data fetching
  - Implements search functionality
  - Handles API errors and loading states
  - Uses AbortController for cleanup
- **useOutsideClick**:
  - Handles clicks outside the component
  - Supports both mouse and touch events
  - Includes enable/disable functionality

### Performance Optimizations

- Debounced search (300ms delay)
- Memoized components and callbacks
- Proper cleanup of async operations
- Efficient text highlighting algorithm
- Optimized re-renders with React.memo

### Accessibility Features

- Semantic HTML structure
- Keyboard navigation support
- Focus management
- Touch device support

### Error Handling

- API error handling
- Search query validation
- Regex error protection
- Network request cleanup
- Proper error messages
