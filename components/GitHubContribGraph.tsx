"use client";

import { useState, useEffect } from "react";
import { Gitmap } from "@components/ui/gitmap";

interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export default function GitHubContribGraph() {
  const [contributions, setContributions] = useState<ContributionDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchContributions() {
      try {
        setLoading(true);
        const response = await fetch("/api/github-contributions");
        
        if (!response.ok) {
          throw new Error(`Failed to fetch contributions: ${response.status}`);
        }

        const data: ContributionDay[] = await response.json();
        setContributions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        console.error("Error fetching GitHub contributions:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchContributions();
  }, []);

  if (loading) {
    return (
      <section className="mt-8">
        <h2 className="font-bold text-xl mb-4 text-white">GitHub Activity</h2>
        <div className="animate-pulse">
          <div className="h-24 bg-zinc-800 rounded-lg"></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mt-8">
        <h2 className="font-bold text-xl mb-4 text-white">GitHub Activity</h2>
        <div className="text-zinc-400 text-sm">
          Unable to load GitHub contributions
        </div>
      </section>
    );
  }

  if (contributions.length === 0) {
    return (
      <section className="mt-8">
        <h2 className="font-bold text-xl mb-4 text-white">GitHub Activity</h2>
        <div className="text-zinc-400 text-sm">
          No contribution data available
        </div>
      </section>
    );
  }

  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1);
  const endDate = new Date();

  const colors = {
    empty: "var(--gitmap-empty)",
    level1: "var(--gitmap-level-1)",
    level2: "var(--gitmap-level-2)",
    level3: "var(--gitmap-level-3)",
    level4: "var(--gitmap-level-4)",
  };

  return (
    <section className="mt-8">
      <h2 className="font-bold text-xl mb-4 text-white">GitHub Activity</h2>
      <div className="flex justify-center overflow-x-auto ">
        <Gitmap
          contributions={contributions}
          from={startDate}
          to={endDate}
          colors={colors}
          showMonths={false}
          showDays={false}
          showCounts={false}
          cellSize={10}
          cellGap={2}
          className="w-full max-w-[650px]"
        />
      </div>
    </section>
  );
}
