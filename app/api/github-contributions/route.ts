import { NextResponse } from "next/server";
import { getRedisClient } from "@/lib/redis";

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface GitHubResponse {
  contributions: ContributionDay[];
  lastFetched: string;
}

const CACHE_KEY = "github-contributions";
const CACHE_DURATION = 6 * 60 * 60; // 6 hours in seconds for Redis

async function fetchGitHubContributions(): Promise<ContributionDay[]> {
  const query = `
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            weeks {
              contributionDays {
                date
                contributionCount
                contributionLevel
              }
            }
          }
        }
      }
    }
  `;

  const token = process.env.GITHUB_TOKEN || process.env.GITHUB_PAT;
  
  if (!token) {
    throw new Error("GitHub token not configured. Please set GITHUB_TOKEN or GITHUB_PAT environment variable.");
  }

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: { username: "skshmgpt" },
    }),
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  const data = await response.json();
  
  if (data.errors) {
    throw new Error(`GraphQL error: ${data.errors[0].message}`);
  }

  const weeks = data.data.user.contributionsCollection.contributionCalendar.weeks;
  const contributions: ContributionDay[] = [];

  weeks.forEach((week: { contributionDays: Array<{ date: string; contributionCount: number; contributionLevel: string }> }) => {
    week.contributionDays.forEach((day: { date: string; contributionCount: number; contributionLevel: string }) => {
      contributions.push({
        date: day.date,
        count: day.contributionCount,
        level: getLevel(day.contributionLevel),
      });
    });
  });

  return contributions;
}

function getLevel(level: string): number {
  const levelMap: Record<string, number> = {
    NONE: 0,
    FIRST_QUARTILE: 1,
    SECOND_QUARTILE: 2,
    THIRD_QUARTILE: 3,
    FOURTH_QUARTILE: 4,
  };
  return levelMap[level] || 0;
}

async function getCachedData(): Promise<GitHubResponse | null> {
  try {
    const redis = await getRedisClient();
    
    const cached = await redis.get(CACHE_KEY);
    if (!cached) {
      return null;
    }

    const data: GitHubResponse = JSON.parse(cached);
    const now = Date.now();
    
    if (now - new Date(data.lastFetched).getTime() > CACHE_DURATION * 1000) {
      await redis.del(CACHE_KEY);
      return null;
    }

    return data;
  } catch (error) {
    console.warn("Redis cache not available, proceeding without cache:", error);
    return null;
  }
}

async function setCachedData(contributions: ContributionDay[]): Promise<void> {
  try {
    const redis = await getRedisClient();

    const data: GitHubResponse = {
      contributions,
      lastFetched: new Date().toISOString(),
    };

    await redis.setEx(CACHE_KEY, CACHE_DURATION, JSON.stringify(data));
  } catch (error) {
    console.warn("Failed to cache data in Redis, proceeding without cache:", error);
  }
}

export async function GET() {
  try {
    const cached = await getCachedData();
    
    if (cached) {
      return NextResponse.json(cached.contributions);
    }

    const contributions = await fetchGitHubContributions();
    await setCachedData(contributions);

    return NextResponse.json(contributions);
  } catch (error) {
    console.error("Error fetching GitHub contributions:", error);
    return NextResponse.json(
      { error: "Failed to fetch contributions" },
      { status: 500 }
    );
  }
}
