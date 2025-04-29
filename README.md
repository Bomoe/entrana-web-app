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

1. Database Setup

The application uses TimescaleDB (PostgreSQL with time-series extensions). You can set it up using either Docker CLI or Docker Desktop.

#### Option A: Using Docker CLI

```bash
# 1) Create a persisted volume
docker volume create timescale-data

# 2) Launch the container
docker run -d \
  --name timescaledb \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgrespw \
  -e POSTGRES_DB=entrana \
  -p 5432:5432 \
  -v timescale-data:/var/lib/postgresql/data \
  timescale/timescaledb:latest-pg15
```

#### Option B: Using Docker Desktop

1. Open Docker Desktop
2. Go to "Volumes" and click "Create"
   - Name: `timescale-data`
3. Go to "Containers" and click "Add Container"
   - Image: `timescale/timescaledb:latest-pg15`
   - Container name: `timescaledb`
   - Ports: `5432:5432`
   - Environment variables:
     ```
     POSTGRES_USER=postgres
     POSTGRES_PASSWORD=postgrespw
     POSTGRES_DB=entrana
     ```
   - Volume: Click "+" and select `timescale-data`, mount it to `/var/lib/postgresql/data`
4. Click "Run"

The database will be accessible at `postgresql://postgres:postgrespw@localhost:5432/entrana

2. Application Setup

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
