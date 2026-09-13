"use client";

import dynamic from "next/dynamic";

const SpotifyNowPlaying = dynamic(
  () => import("@/components/SpotifyNowPlaying"),
  { ssr: false, loading: () => null }
);

export default function SpotifyNowPlayingDynamic() {
  return <SpotifyNowPlaying />;
}
