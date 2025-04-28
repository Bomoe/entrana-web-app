# Entrana Clan Web App

This is the official web application for the Entrana clan in Old School RuneScape. Built to serve our community.

## Prerequisites

To develop this application, you need to have pnpm installed. Here's how to install it:

```bash
# Using npm
npm install -g pnpm

# Using Homebrew (macOS)
brew install pnpm
```

## Getting Started

After installing pnpm, you can set up the project:

```bash
# Install dependencies
pnpm install
```

## Project Structure

This monorepo uses pnpm workspaces and contains:

- `apps/web`: Main Next.js application
- `packages/ui`: Shared UI components library

## Development

### Code Style

This project uses Prettier for code formatting. Please ensure you:

1. Install the Prettier extension for your IDE
2. Enable "Format on Save" in your IDE
3. Use the project's `.prettierrc` configuration

This ensures consistent code styling across the project.

### Components

The project uses shadcn/ui for components. To add new shadcn components to the app, run:

```bash
pnpm dlx shadcn@latest add <component-name> -c apps/web
```

This will place the UI components in the `packages/ui/src/components` directory.

## Using Components

To use the components in the app, import them from the `ui` package:

```tsx
import { Button } from '@workspace/ui/components/button'
```

## Tailwind Configuration

Your `tailwind.config.ts` and `globals.css` are already set up to use the components from the `ui` package.

### Color Conventions

When using Tailwind classes for colors, prefer using our themed color variables instead of direct color classes. This makes it easier to maintain and update the color scheme:

```tsx
// ✅ Good - Uses themed colors
<div className="bg-default text-primary hover:bg-secondary">

// ❌ Avoid - Uses direct colors
<div className="bg-slate-100 text-blue-600 hover:bg-gray-200">
```

Common themed colors include:

- `bg-default`, `bg-secondary`
- `text-primary`, `text-secondary`
- `border-default`
- `accent-primary`
