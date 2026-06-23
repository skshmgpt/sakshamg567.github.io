"use client";

import { useEffect, useRef, useState } from "react";

interface MetricsTrackerProps {
  slug: string;
}

export default function MetricsTracker({ slug }: MetricsTrackerProps) {
  const [sessionId] = useState(() => {
    // Generate or retrieve session ID from sessionStorage
    if (typeof window !== "undefined") {
      let id = sessionStorage.getItem("blog-session-id");
      if (!id) {
        id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem("blog-session-id", id);
      }
      return id;
    }
    return "";
  });

  const startTimeRef = useRef<number | null>(null);
  const maxScrollDepthRef = useRef<number>(0);
  const metricsReportedRef = useRef<boolean>(false);

  useEffect(() => {
    startTimeRef.current = Date.now();
    const scrollContainer = document.querySelector<HTMLElement>(
      "[data-blog-scroll-container]"
    );

    // Track scroll depth
    const handleScroll = () => {
      const windowHeight = scrollContainer?.clientHeight ?? window.innerHeight;
      const documentHeight =
        scrollContainer?.scrollHeight ?? document.documentElement.scrollHeight;
      const scrollTop = scrollContainer?.scrollTop ?? window.scrollY;
      const scrollDepth = Math.round(
        ((scrollTop + windowHeight) / documentHeight) * 100
      );
      
      if (scrollDepth > maxScrollDepthRef.current) {
        maxScrollDepthRef.current = Math.min(scrollDepth, 100);
      }
    };

    // Report metrics when user leaves
    const reportMetrics = async () => {
      if (metricsReportedRef.current) return;
      metricsReportedRef.current = true;

      const readingTimeSpent = Math.round(
        (Date.now() - (startTimeRef.current ?? Date.now())) / 1000
      );
      const scrollDepth = maxScrollDepthRef.current;
      const referrer = document.referrer || "direct";

      try {
        await fetch("/api/metrics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug,
            sessionId,
            readingTimeSpent,
            scrollDepth,
            referrer,
            timestamp: Date.now(),
          }),
        });
      } catch (error) {
        console.error("Failed to report metrics:", error);
      }
    };

    // Add event listeners
    scrollContainer?.addEventListener("scroll", handleScroll, { passive: true });
    if (!scrollContainer) window.addEventListener("scroll", handleScroll);
    window.addEventListener("beforeunload", reportMetrics);

    // Also report metrics on visibility change (when tab becomes hidden)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        reportMetrics();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Initial scroll depth calculation
    handleScroll();

    // Cleanup
    return () => {
      scrollContainer?.removeEventListener("scroll", handleScroll);
      if (!scrollContainer) window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("beforeunload", reportMetrics);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      reportMetrics();
    };
  }, [slug, sessionId]);

  return null; // This component doesn't render anything
}
