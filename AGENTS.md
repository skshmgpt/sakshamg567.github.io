# Agent Guidelines for sakshamg567.github.io

This document provides comprehensive guidelines for AI coding agents working on this Next.js portfolio/blog site.

## Build & Development Commands

### Running the Application
```bash
pnpm dev              # Start development server (http://localhost:3000)
pnpm build            # Production build
pnpm start            # Start production server
pnpm lint             # Run ESLint
```

### Testing
**NO TEST FRAMEWORK CONFIGURED** - Tests should be added if modifying critical functionality.

### Package Manager
This project uses **pnpm**. Always use `pnpm` instead of npm or yarn.

## Project Architecture

### Tech Stack
- **Framework:** Next.js 16.1.1 (App Router)
- **React:** 19.2.3
- **TypeScript:** 5.x (strict mode enabled)
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Database:** Redis (for analytics)
- **Content:** Markdown (react-markdown + remark/rehype)

### Directory Structure
```
/app                  # App Router - pages, layouts, API routes
  /api               # API endpoints (Next.js Route Handlers)
  /blog              # Blog pages with dynamic routes [slug]
  /projects          # Projects page
/components          # React components (.tsx and .jsx)
  /ui                # shadcn/ui components
/lib                 # Utilities and business logic
/hooks               # Custom React hooks
/types               # TypeScript type definitions
/blogs               # Markdown blog content
/public              # Static assets
/data                # Data storage
```

### Server vs Client Components
- **Default:** All components are Server Components
- **Client Components:** Must use `"use client"` directive at top of file
- **Examples of Client Components:** Navigation, interactive UI, hooks usage (useState, useEffect, useRouter)
- **Examples of Server Components:** Pages, data fetching, metadata generation

## Code Style Guidelines

### TypeScript Configuration
- **Strict mode:** Enabled
- **Target:** ES2017
- **Module resolution:** bundler
- **JSX:** react-jsx
- **Note:** `ignoreBuildErrors: true` is currently set in next.config.ts (avoid adding new TS errors)

### File Naming Conventions
- **Components:** PascalCase (e.g., `BlogWrapper.tsx`, `MetricsTracker.tsx`)
- **Utilities:** kebab-case (e.g., `use-mobile.ts`, `utils.ts`)
- **Pages:** lowercase (e.g., `page.tsx`, `layout.tsx`)
- **Mix of .tsx/.jsx:** New files should use `.tsx`, but existing `.jsx` files remain

### Import Patterns
```typescript
// USE: Path aliases (preferred)
import Navbar from "@/components/Navbar";
import { Badge } from "@components/ui/badge";
import { calculateReadTime } from "@/lib/utils";

// AVOID: Relative imports
import Navbar from "../../components/Navbar";
```

**Path Aliases:**
- `@/*` → Root directory
- `@components/*` → Components directory

**Import Order (implicit convention):**
1. External packages
2. Internal modules via aliases
3. Types/interfaces
4. Node.js built-ins (for server components)

### Component Structure

**Server Component:**
```typescript
// Default export, async for data fetching
export default async function PageName() {
  const data = await fetchData();
  
  return (
    <main className="flex flex-col">
      {/* JSX */}
    </main>
  );
}
```

**Client Component:**
```typescript
"use client";

import { useState } from "react";

interface ComponentProps {
  title: string;
  details: Record<string, unknown>;
}

export default function ComponentName({ title, details }: ComponentProps) {
  const [state, setState] = useState(false);
  
  return <div>{/* JSX */}</div>;
}
```

**Wrapper Pattern:**
Use client wrappers around server components when needed (see `BlogWrapper.tsx`).

### Type Definitions
```typescript
// Inline interfaces for props
interface BlogWrapperProps {
  slug: string;
  children: ReactNode;
}

// Type aliases for complex types
type BlogData = {
  blogs: {
    [key: string]: {
      description: string;
      date: string;
      slug: string;
    };
  };
};

// Explicit type annotations for parsed data
const data = JSON.parse(dataFile) as BlogData;
```

### Naming Conventions
- **Components:** PascalCase (e.g., `BlogDisplay`, `MetricsTracker`)
- **Functions:** camelCase (e.g., `calculateReadTime`, `addMetric`)
- **Constants:** UPPER_SNAKE_CASE (for true constants)
- **Types/Interfaces:** PascalCase with descriptive suffixes (e.g., `BlogWrapperProps`, `BlogData`)
- **Files:** Match component name or use kebab-case for utilities

### Styling with Tailwind

**Use the `cn()` utility for conditional classes:**
```typescript
import { cn } from "@/lib/utils";

<div className={cn(
  "base-classes",
  variant === "primary" && "primary-classes",
  className
)} />
```

**Class Variance Authority (CVA) for variants:**
```typescript
import { cva, type VariantProps } from "class-variance-authority";

const componentVariants = cva(
  "base classes",
  {
    variants: {
      variant: {
        default: "default classes",
        secondary: "secondary classes",
      },
    },
    defaultVariants: { variant: "default" },
  }
);
```

**Design System:**
- Use CSS variables defined in `app/globals.css`
- Color format: OKLCH
- Dark mode: `.dark` class selector
- Custom fonts: `font-berkeley-mono`, `font-inter`
- Responsive: Mobile-first with breakpoints (`sm:`, `md:`, `lg:`)

### Error Handling

**API Routes:**
```typescript
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate input
    if (!data.requiredField) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    await processData(data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error context:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
```

**Client-Side:**
```typescript
try {
  await fetch("/api/endpoint", { /* config */ });
} catch (error) {
  console.error("Failed to fetch:", error);
  // Graceful degradation - don't break UI
}
```

**Principles:**
- Always use try-catch for async operations
- Validate inputs before processing
- Return appropriate HTTP status codes
- Log errors with context
- Fail gracefully (especially for non-critical features like analytics)

### Data Fetching Patterns

**Server Components (preferred for data):**
```typescript
import { readFile } from "fs/promises";
import path from "path";

export default async function Page() {
  const dataFile = await readFile(
    path.join(process.cwd(), "public/data.json"),
    "utf-8"
  );
  const data = JSON.parse(dataFile);
  // Use data...
}
```

**Redis Singleton Pattern:**
```typescript
// lib/redis.ts pattern
const globalForRedis = globalThis as unknown as {
  redis: ReturnType<typeof createClient> | undefined;
};

export const redis = globalForRedis.redis ?? createClient({ url: "..." });

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redis;
}
```

## Next.js Specific Patterns

### Metadata Generation
```typescript
import type { Metadata } from "next";

export async function generateMetadata({ params }): Promise<Metadata> {
  const { slug } = await params;
  // Fetch data...
  
  return {
    title: "Page Title",
    description: "Description",
    openGraph: { /* OG tags */ },
    twitter: { /* Twitter tags */ },
  };
}
```

### Static Site Generation
```typescript
export async function generateStaticParams() {
  return Object.entries(data.items).map(([_, item]) => ({
    slug: item.slug,
  }));
}
```

## Important Notes

### Configuration
- **ESLint:** Uses flat config (eslint.config.mjs) with Next.js presets
- **TypeScript:** Build errors currently ignored - avoid introducing new errors
- **PostCSS:** Configured for Tailwind v4
- **Images:** Remote patterns allowed for `miro.medium.com`

### Best Practices
1. **Prefer Server Components** - Only use client components when necessary
2. **Use path aliases** - Always prefer `@/*` over relative imports
3. **Type everything** - Use TypeScript for new code, type external data
4. **Mobile-first** - Design responsive from smallest screen up
5. **SEO matters** - Use metadata, sitemap, structured data
6. **Performance** - Leverage static generation where possible

### Common Pitfalls
- ❌ Don't use `"use client"` unnecessarily
- ❌ Don't ignore TypeScript errors (even though build currently does)
- ❌ Don't use relative imports when aliases exist
- ❌ Don't create client components for static content
- ❌ Don't forget to validate API inputs
- ✅ Do separate server/client boundaries clearly
- ✅ Do use `cn()` for className merging
- ✅ Do handle errors gracefully
- ✅ Do leverage Next.js caching and optimization

## Development Workflow

1. **Before changing code:** Understand server vs client requirements
2. **File operations:** Prefer editing existing files over creating new ones
3. **Testing:** Manually test changes (no automated tests exist)
4. **Linting:** Run `pnpm lint` before committing
5. **Building:** Verify with `pnpm build` to catch issues
6. **Commits:** Follow existing commit style (check `git log`)

---

**Last Updated:** January 2026  
**Next.js Version:** 16.1.1  
**React Version:** 19.2.3
