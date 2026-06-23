import { getRedisClient } from "@/lib/redis";

const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_API_URL = "https://api.spotify.com/v1";

const TOKEN_CACHE_KEY = "spotify:access-token";
const NOW_PLAYING_CACHE_KEY = "spotify:now-playing";

interface SpotifyToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

interface SpotifyTrack {
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string; width: number; height: number }[];
  };
  external_urls: { spotify: string };
  duration_ms: number;
}

export interface NowPlayingResponse {
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

async function getAccessToken(): Promise<string> {
  const client = await getRedisClient();
  const cached = await client.get(TOKEN_CACHE_KEY);
  if (cached) return cached;

  const basic = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: process.env.SPOTIFY_REFRESH_TOKEN!,
    }),
  });

  if (!res.ok) {
    throw new Error(`Spotify token refresh failed: ${res.status}`);
  }

  const data = (await res.json()) as SpotifyToken;
  // Cache for 55 minutes (token expires in 60)
  await client.set(TOKEN_CACHE_KEY, data.access_token, { EX: 3300 });
  return data.access_token;
}

async function fetchTrack(url: string, token: string): Promise<Response> {
  return fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

function pickImage(images: SpotifyTrack["album"]["images"]) {
  // Prefer ~300px image, fallback to smallest or first
  const target = images.find((i) => i.width >= 300) ?? images[images.length - 1] ?? images[0];
  return target?.url ?? "";
}

function toNowPlaying(track: SpotifyTrack, isPlaying: boolean, progressMs = 0, timestamp = ""): NowPlayingResponse {
  return {
    success: true,
    source: "Spotify",
    isPlaying,
    title: track.name,
    artist: track.artists.map((a) => a.name).join(", "),
    album: track.album.name,
    albumImageUrl: pickImage(track.album.images),
    songUrl: track.external_urls.spotify,
    duration: track.duration_ms,
    progressMs,
    timestamp,
  };
}

export async function getNowPlaying(): Promise<NowPlayingResponse> {
  const token = await getAccessToken();

  // Try currently-playing first
  const nowRes = await fetchTrack(`${SPOTIFY_API_URL}/me/player/currently-playing`, token);

  if (nowRes.status === 200) {
    const data = await nowRes.json();
    if (data?.item) {
      return toNowPlaying(data.item as SpotifyTrack, data.is_playing ?? false, data.progress_ms ?? 0);
    }
  }

  // Fall back to recently-played
  if (nowRes.status === 204 || (nowRes.status === 200 && !(await nowRes.clone().json())?.item)) {
    const recentRes = await fetchTrack(
      `${SPOTIFY_API_URL}/me/player/recently-played?limit=1`,
      token
    );

    if (recentRes.status === 200) {
      const recent = await recentRes.json();
      if (recent?.items?.[0]?.track) {
        return toNowPlaying(recent.items[0].track as SpotifyTrack, false, 0, recent.items[0].played_at ?? "");
      }
    }
  }

  return {
    success: false,
    source: "Spotify",
    isPlaying: false,
    title: "",
    artist: "",
    album: "",
    albumImageUrl: "",
    songUrl: "",
    duration: 0,
    progressMs: 0,
    timestamp: "",
    error: "no track data",
  };
}

export async function getCachedNowPlaying(): Promise<NowPlayingResponse> {
  const client = await getRedisClient();
  const cached = await client.get(NOW_PLAYING_CACHE_KEY);
  if (cached) return JSON.parse(cached) as NowPlayingResponse;

  const data = await getNowPlaying();
  await client.set(NOW_PLAYING_CACHE_KEY, JSON.stringify(data), { EX: 15 });
  return data;
}
