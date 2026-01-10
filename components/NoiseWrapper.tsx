"use client";

import dynamic from "next/dynamic";

// Lazy load Noise component to improve initial page load
const Noise = dynamic(() => import("@/components/Noise"), {
  ssr: false,
  loading: () => null,
});

interface NoiseWrapperProps {
  patternSize?: number;
  patternScaleX?: number;
  patternScaleY?: number;
  patternRefreshInterval?: number;
  patternAlpha?: number;
}

export default function NoiseWrapper(props: NoiseWrapperProps) {
  return <Noise {...props} />;
}
