import { BlogMetric, BlogMetricsSummary, MetricsData } from "@/types/metrics";
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";

const METRICS_DIR = path.join(process.cwd(), "data");
const METRICS_FILE = path.join(METRICS_DIR, "metrics.json");

// Ensure the data directory exists
async function ensureDataDir() {
  try {
    await mkdir(METRICS_DIR, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
}

// Read metrics from file
export async function readMetrics(): Promise<MetricsData> {
  try {
    await ensureDataDir();
    const data = await readFile(METRICS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return empty structure
    return { metrics: [], summaries: {} };
  }
}

// Write metrics to file
export async function writeMetrics(data: MetricsData): Promise<void> {
  await ensureDataDir();
  await writeFile(METRICS_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// Add a new metric and update summaries
export async function addMetric(metric: BlogMetric): Promise<void> {
  const data = await readMetrics();
  
  // Add the metric
  data.metrics.push(metric);
  
  // Update summary for this slug
  const slugMetrics = data.metrics.filter((m) => m.slug === metric.slug);
  const uniqueSessions = new Set(slugMetrics.map((m) => m.sessionId));
  
  // Calculate averages
  const totalReadingTime = slugMetrics.reduce(
    (sum, m) => sum + (m.readingTimeSpent || 0),
    0
  );
  const totalScrollDepth = slugMetrics.reduce(
    (sum, m) => sum + (m.scrollDepth || 0),
    0
  );
  
  // Count referrers
  const referrerCounts: { [key: string]: number } = {};
  slugMetrics.forEach((m) => {
    const ref = m.referrer || "direct";
    referrerCounts[ref] = (referrerCounts[ref] || 0) + 1;
  });
  
  // Update summary
  data.summaries[metric.slug] = {
    slug: metric.slug,
    pageViews: slugMetrics.length,
    uniqueVisitors: uniqueSessions.size,
    averageReadingTime: Math.round(totalReadingTime / slugMetrics.length),
    averageScrollDepth: Math.round(totalScrollDepth / slugMetrics.length),
    topReferrers: referrerCounts,
    lastUpdated: Date.now(),
  };
  
  await writeMetrics(data);
}

// Get summary for a specific slug
export async function getMetricsSummary(
  slug: string
): Promise<BlogMetricsSummary | null> {
  const data = await readMetrics();
  return data.summaries[slug] || null;
}

// Get all summaries
export async function getAllSummaries(): Promise<{
  [slug: string]: BlogMetricsSummary;
}> {
  const data = await readMetrics();
  return data.summaries;
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
