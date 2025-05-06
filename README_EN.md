# Half Minute Notes

[简体中文 | Chinese Version](./README.md)

A lightweight note-taking application based on Vue 3 + TypeScript + Vite, focused on instant recording and tag categorization features.

## Features

### Instant Recording
- Minimalist input interface for quickly capturing and recording fragmented ideas, inspirations, or to-dos
- Supports shortcut key (Ctrl+Enter) to submit notes

### Tag Categorization & Review
- Add simple tags to notes (such as mood, work, life, etc.)
- Filter notes by tags
- Timeline display for easy review

### Data Management
- Local storage, no login required
- Customizable tags, supports adding, deleting, and color settings

## User Guide

1. **Add Note**: Enter content in the input box, click the "Record" button or use the Ctrl+Enter shortcut to submit
2. **Add Tag**: Click the "#" button below the input box to select the desired tag
3. **Filter Notes**: Click the tag bar above to filter notes by tag type
4. **Manage Tags**: Click the "Manage Tags" button in the upper right corner to add or delete tags

## Development

### Install Dependencies
```
npm install
```

### Start Development Server
```
npm run dev
```

### Build for Production
```
npm run build
```

### Preview Production Build
```
npm run preview
```

## Tech Stack

- Vue 3
- TypeScript
- Vite
- LocalStorage API