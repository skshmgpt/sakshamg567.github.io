# Blog Metrics System

## Overview
Automated blog metrics collection system that tracks page views, reading time, unique visitors, scroll depth, and referrer sources.

## Features

### Metrics Tracked
- **Page Views**: Total number of times each blog post is viewed
- **Reading Time Spent**: How long users spend reading (in seconds)
- **Unique Visitors**: Number of unique sessions viewing each post
- **Scroll Depth**: How far users scroll through the content (percentage)
- **Referrer Source**: Where visitors came from (direct, search engines, other sites)

### Data Storage
- Metrics are stored locally in `/data/metrics.json`
- Data persists across sessions
- File is automatically created on first metric event
- Excluded from git via `.gitignore`

### Export Functionality
- Export all metrics as CSV format
- Access via: `GET /api/metrics/export`
- Downloads file named `blog-metrics.csv`

## Usage

### Viewing Metrics
Metrics are automatically collected when users view blog posts. No manual intervention needed.

### Exporting Metrics
To download metrics as CSV:
```bash
curl http://localhost:3000/api/metrics/export -o blog-metrics.csv
```

Or visit in browser: `http://localhost:3000/api/metrics/export`

### CSV Format
```csv
Slug,Page Views,Unique Visitors,Avg Reading Time (s),Avg Scroll Depth (%),Top Referrer,Last Updated
git-internals,150,120,245,85,https://twitter.com,2026-01-10T...
...
```

## Technical Details

### Components
- `MetricsTracker` - Client component that tracks user behavior
- `BlogWrapper` - Wrapper component that integrates metrics tracking

### API Routes
- `POST /api/metrics` - Store new metric data
- `GET /api/metrics/export` - Export metrics as CSV

### Files Created
- `/types/metrics.ts` - TypeScript interfaces
- `/lib/metrics.ts` - Core metrics functionality
- `/components/MetricsTracker.tsx` - Client-side tracking
- `/components/BlogWrapper.tsx` - Integration wrapper
- `/app/api/metrics/route.ts` - Store metrics endpoint
- `/app/api/metrics/export/route.ts` - Export endpoint
- `/data/metrics.json` - Local storage (auto-created)

## Privacy Considerations
- Session IDs are generated client-side and stored in sessionStorage
- No personally identifiable information is collected
- Referrer data only includes the source URL
- All data stays local on your server
