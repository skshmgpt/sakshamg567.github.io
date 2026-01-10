# Blog Metrics System

## Overview
Automated blog metrics collection system that tracks page views, reading time, unique visitors, scroll depth, and referrer sources using Redis for distributed, production-ready storage.

## Features

### Metrics Tracked
- **Page Views**: Total number of times each blog post is viewed
- **Reading Time Spent**: How long users spend reading (in seconds)
- **Unique Visitors**: Number of unique sessions viewing each post
- **Scroll Depth**: How far users scroll through the content (percentage)
- **Referrer Source**: Where visitors came from (direct, search engines, other sites)

### Data Storage
- Metrics are stored in Redis (node-redis client)
- Scalable and production-ready
- Automatic data persistence
- Fast read/write operations

### Export Functionality
- Export all metrics as CSV format
- Access via: `GET /api/metrics/export`
- Downloads file named `blog-metrics.csv`

## Setup

### 1. Redis Instance

You can use any Redis provider. This project is configured to use Redis Labs (via Vercel).

### 2. Configure Environment Variables

Create a `.env.local` file (or add to your Vercel environment variables):

```bash
REDIS_URL="redis://default:your-password@your-redis-host.com:port"
```

**Example (Redis Labs):**
```bash
REDIS_URL="redis://default:dhg0gyS1NqgeI9mFPgzDNYk8VdYXelk4@redis-14969.c264.ap-south-1-1.ec2.cloud.redislabs.com:14969"
```

### 3. Vercel Setup

Add the `REDIS_URL` environment variable in your Vercel project:

1. Go to your Vercel Dashboard
2. Select your project
3. Navigate to **Settings** > **Environment Variables**
4. Add `REDIS_URL` with your Redis connection string

Or use the Vercel CLI:

```bash
vercel env add REDIS_URL
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

### Data Structure in Redis

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

### Redis Client

The project uses `node-redis` with a singleton pattern to maintain a single connection:

```typescript
import { getRedisClient } from "@/lib/redis";

const redis = await getRedisClient();
```

### Components
- `MetricsTracker` - Client component that tracks user behavior
- `BlogWrapper` - Wrapper component that integrates metrics tracking

### API Routes
- `POST /api/metrics` - Store new metric data
- `GET /api/metrics/export` - Export metrics as CSV

### Files
- `/types/metrics.ts` - TypeScript interfaces
- `/lib/redis.ts` - Redis client singleton
- `/lib/metrics.ts` - Core metrics functionality (Redis integration)
- `/components/MetricsTracker.tsx` - Client-side tracking
- `/components/BlogWrapper.tsx` - Integration wrapper
- `/app/api/metrics/route.ts` - Store metrics endpoint
- `/app/api/metrics/export/route.ts` - Export endpoint

## Privacy Considerations
- Session IDs are generated client-side and stored in sessionStorage
- No personally identifiable information is collected
- Referrer data only includes the source URL
- Data is stored securely in Redis with TLS encryption

## Development vs Production

### Local Development
- Requires `.env.local` with `REDIS_URL`
- Can use a separate Redis database for testing
- Metrics won't persist if Redis is not configured

### Production (Vercel)
- Environment variables injected via Vercel settings
- Production Redis database used
- Metrics persist across deployments
- Automatic scaling with traffic

## Troubleshooting

### Metrics not being recorded
1. Check that `REDIS_URL` environment variable is set
2. Verify Redis instance is accessible
3. Check browser console for API errors
4. Ensure `/api/metrics` endpoint is accessible
5. Check Redis connection: `redis-cli ping`

### Export shows no data
- Metrics may not have been collected yet
- Visit some blog posts to generate data
- Check Redis directly: `redis-cli hgetall blog:summaries`

### Local development issues
- Ensure `.env.local` exists with valid `REDIS_URL`
- Restart the dev server after adding environment variables
- Test Redis connection: `redis-cli -u $REDIS_URL ping`

### Redis connection errors
- Verify the `REDIS_URL` format is correct
- Check Redis instance is running and accessible
- Ensure firewall/security groups allow connections
- For Redis Labs, check IP whitelist settings
