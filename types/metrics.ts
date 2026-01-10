export interface BlogMetric {
  slug: string;
  timestamp: number;
  sessionId: string;
  readingTimeSpent?: number; // in seconds
  scrollDepth?: number; // percentage 0-100
  referrer?: string;
}

export interface BlogMetricsSummary {
  slug: string;
  pageViews: number;
  uniqueVisitors: number;
  averageReadingTime: number; // in seconds
  averageScrollDepth: number; // percentage
  topReferrers: { [referrer: string]: number };
  lastUpdated: number;
}

export interface MetricsData {
  metrics: BlogMetric[];
  summaries: { [slug: string]: BlogMetricsSummary };
}
