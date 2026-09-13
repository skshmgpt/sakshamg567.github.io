"use client";

import dynamic from "next/dynamic";
import type { Activity } from "@/components/contribution-graph/contribution-graph";

const GitHubContributions = dynamic(
  () =>
    import("@/components/github-contributions/github-contributions").then(
      (m) => m.GitHubContributions
    ),
  { ssr: false, loading: () => null }
);

export default function GitHubContributionsDynamic(props: {
  contributions: Promise<Activity[]>;
  githubProfileUrl: string;
}) {
  return <GitHubContributions {...props} />;
}
