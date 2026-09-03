"use client";

import { useEffect, useRef } from "react";

const SIZE = 128;
const FULL_ROTATION_MS = 8000;
const POLL_INTERVAL_MS = 30000;
const ALBUM_RADIUS_RATIO = 0.32;
const LABEL_D = Math.round(SIZE * ALBUM_RADIUS_RATIO * 2);

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function sourceDims(src: HTMLImageElement | HTMLCanvasElement): [number, number] {
  return src instanceof HTMLImageElement
    ? [src.naturalWidth, src.naturalHeight]
    : [src.width, src.height];
}

// High-quality downscale: halve repeatedly, then a final cover-fit draw.
// Avoids the softness/aliasing of a single large-ratio drawImage step.
function highQualityResize(
  img: HTMLImageElement,
  dw: number,
  dh: number
): HTMLCanvasElement {
  let src: HTMLImageElement | HTMLCanvasElement = img;
  let [w, h] = sourceDims(src);

  while (w / 2 >= dw && h / 2 >= dh) {
    w = Math.floor(w / 2);
    h = Math.floor(h / 2);
    const step = document.createElement("canvas");
    step.width = w;
    step.height = h;
    const sctx = step.getContext("2d")!;
    sctx.imageSmoothingEnabled = true;
    sctx.imageSmoothingQuality = "high";
    sctx.drawImage(src, 0, 0, w, h);
    src = step;
  }

  // Final cover-fit crop into the exact target size.
  const [sw0, sh0] = sourceDims(src);
  const scale = Math.max(dw / sw0, dh / sh0);
  const sw = dw / scale;
  const sh = dh / scale;
  const sx = (sw0 - sw) / 2;
  const sy = (sh0 - sh) / 2;

  const out = document.createElement("canvas");
  out.width = dw;
  out.height = dh;
  const octx = out.getContext("2d")!;
  octx.imageSmoothingEnabled = true;
  octx.imageSmoothingQuality = "high";
  octx.drawImage(src, sx, sy, sw, sh, 0, 0, dw, dh);
  return out;
}

function getOrCreateIconLink(): HTMLLinkElement {
  let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  return link;
}

export default function DynamicFavicon() {
  const trackRef = useRef<{ isPlaying: boolean; albumImageUrl: string }>({
    isPlaying: false,
    albumImageUrl: "",
  });

  useEffect(() => {
    const link = getOrCreateIconLink();
    const defaultHref = link.href || "/favicon.ico";
    const canvas = document.createElement("canvas");
    canvas.width = SIZE;
    canvas.height = SIZE;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    let cancelled = false;
    let rafId = 0;
    let angle = 0;
    let startTime: number | null = null;
    let wasActive = false;
    let discBmp: HTMLCanvasElement | null = null;
    let albumBmp: HTMLCanvasElement | null = null;
    let albumKey = "";

    loadImage("/record-disc.png").then(
      (img) => {
        if (cancelled) return;
        discBmp = highQualityResize(img, SIZE, SIZE);
      },
      () => {
        // Keep default favicon if the disc asset fails to load.
      }
    );

    function render() {
      if (!ctx || !discBmp || !albumBmp) return;
      const r = LABEL_D / 2;
      ctx.clearRect(0, 0, SIZE, SIZE);

      // Rotate the whole composite (disc + label) as one vinyl.
      ctx.save();
      ctx.beginPath();
      ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.translate(SIZE / 2, SIZE / 2);
      ctx.rotate(angle);
      ctx.drawImage(discBmp, -SIZE / 2, -SIZE / 2);
      ctx.save();
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(albumBmp, -r, -r);
      ctx.restore();
      ctx.restore();

      ctx.beginPath();
      ctx.arc(SIZE / 2, SIZE / 2, r, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(240, 240, 235, 0.85)";
      ctx.lineWidth = 3;
      ctx.stroke();

      link.href = canvas.toDataURL("image/png");
    }

    function tick(now: number) {
      if (cancelled) return;
      rafId = requestAnimationFrame(tick);
      const { isPlaying } = trackRef.current;
      if (!isPlaying || !discBmp || !albumBmp) {
        if (wasActive) {
          link.href = defaultHref;
          wasActive = false;
        }
        startTime = null;
        return;
      }
      wasActive = true;
      // Wall-clock angle, re-anchored on resume so rotation never jumps.
      if (startTime === null) {
        startTime = now - ((angle / (Math.PI * 2)) % 1) * FULL_ROTATION_MS;
      }
      angle = ((now - startTime) / FULL_ROTATION_MS) * Math.PI * 2;
      render();
    }

    async function syncAlbum() {
      const { isPlaying, albumImageUrl } = trackRef.current;
      if (!isPlaying || !albumImageUrl || albumImageUrl === albumKey) return;
      const key = albumImageUrl;
      try {
        const img = await loadImage(
          `/api/album-art?url=${encodeURIComponent(albumImageUrl)}`
        );
        if (cancelled || trackRef.current.albumImageUrl !== key) return;
        albumBmp = highQualityResize(img, LABEL_D, LABEL_D);
        albumKey = key;
      } catch {
        // Keep default favicon if album art fails to load.
      }
    }

    async function fetchNowPlaying() {
      try {
        const res = await fetch("/api/now-playing");
        const data = await res.json();
        const isPlaying = data?.success === true && data?.isPlaying === true;
        trackRef.current = {
          isPlaying,
          albumImageUrl: isPlaying ? (data?.albumImageUrl ?? "") : "",
        };
        if (!isPlaying) {
          albumBmp = null;
          albumKey = "";
        } else {
          await syncAlbum();
        }
      } catch {
        trackRef.current = { isPlaying: false, albumImageUrl: "" };
        albumBmp = null;
        albumKey = "";
      }
    }

    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, POLL_INTERVAL_MS);
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      clearInterval(interval);
      link.href = defaultHref;
    };
  }, []);

  return null;
}
