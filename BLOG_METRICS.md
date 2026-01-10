# Blog Metrics System

## Overview
Automated blog metrics collection system that tracks page views, reading time, unique visitors, scroll depth, and referrer sources using Vercel KV for distributed, production-ready storage.

## Features

### Metrics Tracked
- **Page Views**: Total number of times each blog post is viewed
- **Reading Time Spent**: How long users spend reading (in seconds)
- **Unique Visitors**: Number of unique sessions viewing each post
- **Scroll Depth**: How far users scroll through the content (percentage)
- **Referrer Source**: Where visitors came from (direct, search engines, other sites)

### Data Storage
- Metrics are stored in Vercel KV (Redis-compatible key-value store)
- Scalable and production-ready
- Automatic data persistence
- Fast read/write operations

### Export Functionality
- Export all metrics as CSV format
- Access via: `GET /api/metrics/export`
- Downloads file named `blog-metrics.csv`

## Setup

### 1. Create Vercel KV Database

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to the **Storage** tab
3. Click **Create Database** and select **KV**
4. Name your database (e.g., "blog-metrics")
5. Select a region close to your users
6. Click **Create**

### 2. Configure Environment Variables

Vercel will automatically provide these environment variables when you deploy:
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `KV_REST_API_READ_ONLY_TOKEN`
- `KV_URL`

For local development, create a `.env.local` file:

```bash
# Copy these values from your Vercel KV dashboard
KV_REST_API_URL="https://your-kv-url.upstash.io"
KV_REST_API_TOKEN="your-token-here"
KV_REST_API_READ_ONLY_TOKEN="your-readonly-token-here"
KV_URL="redis://default:your-password@your-kv-url.upstash.io"
```

### 3. Link to Vercel Project

Connect your KV database to your Vercel project:

```bash
# In the Vercel dashboard, go to your project
# Settings > Environment Variables
# Add the KV environment variables
```

Or use the Vercel CLI:

```bash
vercel env pull .env.local
```

## Usage

### Viewing Metrics
Metrics are automatically collected when users view blog posts. No manual intervention needed.

### Exporting Metrics
To download metrics as CSV:

**Via browser:**
Visit: `https://your-domain.com/api/metrics/export`

**Via curl:**
```bash
curl https://your-domain.com/api/metrics/export -o blog-metrics.csv
```

**For local development:**
```bash
curl http://localhost:3000/api/metrics/export -o blog-metrics.csv
```

### CSV Format
```csv
Slug,Page Views,Unique Visitors,Avg Reading Time (s),Avg Scroll Depth (%),Top Referrer,Last Updated
git-internals,150,120,245,85,https://twitter.com,2026-01-10T...
journey-request,89,72,312,92,direct,2026-01-10T...
...
```

## Technical Details

### Data Structure in Vercel KV

**Individual metrics (per blog):**
```
Key: blog:metrics:{slug}
Type: List
Value: JSON array of BlogMetric objects
```

**Aggregated summaries:**
```
Key: blog:summaries
Type: Hash
Fields: {slug}: JSON BlogMetricsSummary object
```

### Components
- `MetricsTracker` - Client component that tracks user behavior
- `BlogWrapper` - Wrapper component that integrates metrics tracking

### API Routes
- `POST /api/metrics` - Store new metric data
- `GET /api/metrics/export` - Export metrics as CSV

### Files
- `/types/metrics.ts` - TypeScript interfaces
- `/lib/metrics.ts` - Core metrics functionality (Vercel KV integration)
- `/components/MetricsTracker.tsx` - Client-side tracking
- `/components/BlogWrapper.tsx` - Integration wrapper
- `/app/api/metrics/route.ts` - Store metrics endpoint
- `/app/api/metrics/export/route.ts` - Export endpoint

## Privacy Considerations
- Session IDs are generated client-side and stored in sessionStorage
- No personally identifiable information is collected
- Referrer data only includes the source URL
- Data is stored securely in Vercel KV with encryption at rest

## Development vs Production

### Local Development
- Requires `.env.local` with KV credentials
- Can use a separate KV database for testing
- Metrics won't persist if KV is not configured

### Production (Vercel)
- Environment variables automatically injected
- Production KV database used
- Metrics persist across deployments
- Automatic scaling with traffic

## Troubleshooting

### Metrics not being recorded
1. Check that KV environment variables are set
2. Verify KV database is active in Vercel dashboard
3. Check browser console for API errors
4. Ensure `/api/metrics` endpoint is accessible

### Export shows no data
- Metrics may not have been collected yet
- Visit some blog posts to generate data
- Check KV database in Vercel dashboard to verify data exists

### Local development issues
- Ensure `.env.local` exists with valid KV credentials
- Run `vercel env pull .env.local` to sync environment variables
- Restart the dev server after adding environment variables
