# AgencyFlow - Digital Marketing CRM

## Overview

AgencyFlow is a comprehensive CRM and client portal platform designed for digital marketing agencies. It provides role-based access for administrators, managers, and clients with features including project management, task tracking, invoicing, messaging, and activity logging.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight alternative to React Router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **Build Tool**: Vite with custom plugins for Replit integration

The frontend follows a feature-based structure with:
- `/pages` - Route components organized by feature (admin, auth, crm, portal, projects, team)
- `/components` - Reusable UI components (layout, shared, ui)
- `/hooks` - Custom React hooks for auth and utilities
- `/lib` - API utilities, query client configuration, and helpers

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript compiled with tsx
- **Session Management**: express-session with PostgreSQL session store (connect-pg-simple)
- **Authentication**: Session-based with bcrypt password hashing

The backend follows a modular structure:
- `server/routes.ts` - API route definitions with Zod validation
- `server/storage.ts` - Data access layer abstracting database operations
- `server/db.ts` - Database connection using Drizzle ORM

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Validation**: Zod with drizzle-zod integration
- **Database**: PostgreSQL (requires DATABASE_URL environment variable)

### Database Schema
Core entities defined in `shared/schema.ts`:
- **Users**: Role-based (admin, manager, client) with status tracking
- **Clients**: Business entities with contact info and revenue tracking
- **Projects**: Linked to clients with status, budget, and assignees
- **Tasks**: Project subtasks with priority and status
- **Invoices**: Client billing with payment status
- **Messages**: Communication between users
- **Activities**: Audit log for system events

### Authentication Flow
- Session-based authentication stored in PostgreSQL
- Protected routes check user roles before rendering
- Clients redirect to `/portal`, admin/managers to `/admin`

### Build System
- Development: Vite dev server with HMR
- Production: esbuild bundles server, Vite builds client
- Output: `dist/` directory with `index.cjs` (server) and `public/` (client assets)

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- Session storage uses `user_sessions` table (auto-created)

### UI Component Libraries
- **Radix UI**: Accessible primitives for dialogs, dropdowns, forms
- **shadcn/ui**: Pre-styled component collection
- **Lucide Icons**: Icon library

### Build & Development
- **Vite**: Frontend bundler with React plugin
- **esbuild**: Server bundler for production
- **Tailwind CSS v4**: Styling with PostCSS

### Key NPM Packages
- `@tanstack/react-query`: Data fetching and caching
- `drizzle-orm` / `drizzle-kit`: Database ORM and migrations
- `zod`: Runtime type validation
- `bcrypt`: Password hashing
- `express-session`: Session middleware
- `connect-pg-simple`: PostgreSQL session store