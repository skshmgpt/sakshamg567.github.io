"use client";

import { ReactNode } from "react";
import MetricsTracker from "./MetricsTracker";

interface BlogWrapperProps {
  slug: string;
  children: ReactNode;
}

export default function BlogWrapper({ slug, children }: BlogWrapperProps) {
  return (
    <>
      <MetricsTracker slug={slug} />
      {children}
    </>
  );
}
