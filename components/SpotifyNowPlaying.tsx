"use client";

import { useEffect, useState } from "react";
import Image from "next/image";


interface NowPlaying {
  success: boolean;
  source: string;
  isPlaying: boolean;
  title: string;
  artist: string;
  album: string;
  albumImageUrl: string;
  songUrl: string;
  duration: number;
  progressMs: number;
  timestamp: string;
  error?: string;
}

function formatDuration(ms: number) {
  if (!ms || ms <= 0) return "--:--";
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function relativeTime(iso: string) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "moments ago";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

export default function SpotifyNowPlaying() {
  const [track, setTrack] = useState<NowPlaying | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchNowPlaying() {
      try {
        const res = await fetch("/api/now-playing");
        const data = await res.json();
        if (!cancelled) {
          setTrack(data.success ? data : null);
          setLoading(false);
        }
      } catch {
        if (!cancelled) setLoading(false);
      }
    }

    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 30000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-2 pt-4">
        <span className="font-mono text-[11px] text-[#1F1F1C] tracking-[0.08em] uppercase">
          now playing
        </span>
        <span className="font-mono text-[16px] text-[#889988]">—</span>
      </div>
    );
  }

  if (!track) {
    return (
      <div className="flex flex-col gap-2 pt-4">
        <span className="font-mono text-[11px] text-[#1F1F1C] tracking-[0.08em] uppercase">
          now playing
        </span>
        <span className="font-mono text-[16px] text-[#1F1F1C]">offline</span>
      </div>
    );
  }

  const { isPlaying, title, artist, duration, songUrl, timestamp } = track;

  return (
    <div className="flex flex-row gap-10 pt-4 items-center">
      {track.albumImageUrl && (
        <div className="relative h-[68px] w-[68px] shrink-0">
          <div
            className={[
              "absolute inset-0 h-[68px] w-[68px]",
              isPlaying ? "" : "translate-x-0 opacity-0",
            ].join(" ")}
            style={{
              animation: isPlaying
                ? "slide-record-out 1s linear forwards"
                : undefined,
            }}
          >
            <Image
              src="/record-disc.png"
              alt=""
              width={68}
              height={68}
              className="h-[68px] w-[68px] object-contain"
              style={{
                animation: isPlaying
                  ? "spin-record 8s linear 1s infinite"
                  : undefined,
              }}
            />
          </div>
          <Image
            src={track.albumImageUrl}
            alt={track.album}
            width={68}
            height={68}
            className="relative z-10 h-[68px] w-[68px] border border-[#1F1F1C]"
          />
        </div>
      )}
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <span className="font-mono text-[11px] text-[#889988] tracking-[0.08em] uppercase">
          {isPlaying ? "now playing" : "last played"}
        </span>
        <a
          href={songUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[16px] text-[#F0F0EB] hover:text-[#00FF41] transition-colors truncate"
        >
          {title} — {artist}
        </a>
        <span className="font-mono text-[12px] text-[#889988]">
          {isPlaying ? "▶" : "⏸"} {formatDuration(duration)}
        </span>
        {!isPlaying && timestamp && (
          <span className="font-mono text-[10px] text-[#1F1F1C]">
            {relativeTime(timestamp)}
          </span>
        )}
      </div>
    </div>
  );
}
