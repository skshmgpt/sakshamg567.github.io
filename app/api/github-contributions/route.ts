import { NextRequest, NextResponse } from "next/server";

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
const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours

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
  const cache = (globalThis as any).cache;
  if (typeof cache === 'undefined') {
    return null;
  }

  const cached = await cache.get(CACHE_KEY);
  if (!cached) {
    return null;
  }

  const data: GitHubResponse = JSON.parse(cached);
  const now = Date.now();
  
  if (now - new Date(data.lastFetched).getTime() > CACHE_DURATION) {
    await cache.delete(CACHE_KEY);
    return null;
  }

  return data;
}

async function setCachedData(contributions: ContributionDay[]): Promise<void> {
  const cache = (globalThis as any).cache;
  if (typeof cache === 'undefined') {
    return;
  }

  const data: GitHubResponse = {
    contributions,
    lastFetched: new Date().toISOString(),
  };

  await cache.put(CACHE_KEY, JSON.stringify(data));
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
