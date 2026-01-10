import { BlogMetric, BlogMetricsSummary } from "@/types/metrics";
import { kv } from "@vercel/kv";

const METRICS_KEY = "blog:metrics";
const SUMMARIES_KEY = "blog:summaries";

// Add a new metric and update summaries
export async function addMetric(metric: BlogMetric): Promise<void> {
  // Store the individual metric in a list
  await kv.lpush(`${METRICS_KEY}:${metric.slug}`, JSON.stringify(metric));
  
  // Get all metrics for this slug to recalculate summary
  const slugMetrics = await kv.lrange<string>(
    `${METRICS_KEY}:${metric.slug}`,
    0,
    -1
  );
  
  const parsedMetrics: BlogMetric[] = slugMetrics.map((m) => JSON.parse(m));
  const uniqueSessions = new Set(parsedMetrics.map((m) => m.sessionId));
  
  // Calculate averages
  const totalReadingTime = parsedMetrics.reduce(
    (sum, m) => sum + (m.readingTimeSpent || 0),
    0
  );
  const totalScrollDepth = parsedMetrics.reduce(
    (sum, m) => sum + (m.scrollDepth || 0),
    0
  );
  
  // Count referrers
  const referrerCounts: { [key: string]: number } = {};
  parsedMetrics.forEach((m) => {
    const ref = m.referrer || "direct";
    referrerCounts[ref] = (referrerCounts[ref] || 0) + 1;
  });
  
  // Update summary
  const summary: BlogMetricsSummary = {
    slug: metric.slug,
    pageViews: parsedMetrics.length,
    uniqueVisitors: uniqueSessions.size,
    averageReadingTime: Math.round(totalReadingTime / parsedMetrics.length),
    averageScrollDepth: Math.round(totalScrollDepth / parsedMetrics.length),
    topReferrers: referrerCounts,
    lastUpdated: Date.now(),
  };
  
  await kv.hset(SUMMARIES_KEY, { [metric.slug]: JSON.stringify(summary) });
}

// Get summary for a specific slug
export async function getMetricsSummary(
  slug: string
): Promise<BlogMetricsSummary | null> {
  const summary = await kv.hget<string>(SUMMARIES_KEY, slug);
  return summary ? JSON.parse(summary) : null;
}

// Get all summaries
export async function getAllSummaries(): Promise<{
  [slug: string]: BlogMetricsSummary;
}> {
  const summaries = await kv.hgetall<{ [key: string]: string }>(SUMMARIES_KEY);
  
  if (!summaries) {
    return {};
  }
  
  const parsed: { [slug: string]: BlogMetricsSummary } = {};
  for (const [slug, data] of Object.entries(summaries)) {
    parsed[slug] = JSON.parse(data);
  }
  
  return parsed;
}

// Export metrics as CSV
export function metricsToCSV(summaries: {
  [slug: string]: BlogMetricsSummary;
}): string {
  const headers = [
    "Slug",
    "Page Views",
    "Unique Visitors",
    "Avg Reading Time (s)",
    "Avg Scroll Depth (%)",
    "Top Referrer",
    "Last Updated",
  ];
  
  const rows = Object.values(summaries).map((summary) => {
    const topReferrer = Object.entries(summary.topReferrers).sort(
      ([, a], [, b]) => b - a
    )[0]?.[0] || "none";
    
    return [
      summary.slug,
      summary.pageViews.toString(),
      summary.uniqueVisitors.toString(),
      summary.averageReadingTime.toString(),
      summary.averageScrollDepth.toString(),
      topReferrer,
      new Date(summary.lastUpdated).toISOString(),
    ];
  });
  
  return [headers, ...rows].map((row) => row.join(",")).join("\n");
}
