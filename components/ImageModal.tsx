"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";

interface ImageModalProps {
  src: string;
  alt: string;
}

export default function ImageModal({ src, alt }: ImageModalProps) {
  const [open, setOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, lastX: 0, lastY: 0 });

  const reset = useCallback(() => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    reset();
  }, [reset]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.15 : 0.87;
    setScale((prev) => Math.min(Math.max(prev * factor, 0.5), 6));
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (scale <= 1) return;
    setDragging(true);
    dragRef.current = {
      startX: e.clientX - translate.x,
      startY: e.clientY - translate.y,
      lastX: e.clientX,
      lastY: e.clientY,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    setTranslate({
      x: e.clientX - dragRef.current.startX,
      y: e.clientY - dragRef.current.startY,
    });
  };

  const handlePointerUp = () => {
    setDragging(false);
  };

  const handleDoubleClick = () => {
    if (scale > 1) {
      reset();
    } else {
      setScale(2);
      setTranslate({ x: 0, y: 0 });
    }
  };

  return (
    <>
      <span
        className="block relative w-full my-8"
      >
        <Image
          src={src}
          alt={alt}
          width={1200}
          height={630}
          className="border border-[#1F1F1C] w-full h-auto cursor-zoom-in"
          onClick={() => setOpen(true)}
        />
      </span>

      {open && (
        <div
          className="fixed inset-0 z-[100] bg-[#0D0D0D]/95 flex items-center justify-center"
          onClick={close}
        >
          <button
            className="absolute top-4 right-4 z-10 font-mono text-[#889988] hover:text-[#F0F0EB] text-sm px-3 py-1 border border-[#1F1F1C] bg-[#0D0D0D] transition-colors"
            onClick={close}
          >
            esc
          </button>

          <div
            className="max-w-[90vw] max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
            onWheel={handleWheel}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onDoubleClick={handleDoubleClick}
            style={{
              cursor: scale > 1 ? (dragging ? "grabbing" : "grab") : "zoom-in",
              touchAction: "none",
            }}
          >
            <Image
              src={src}
              alt={alt}
              width={1200}
              height={630}
              className="max-w-full max-h-[90vh] object-contain select-none pointer-events-none"
              style={{
                transform: `scale(${scale}) translate(${translate.x / scale}px, ${translate.y / scale}px)`,
                transition: dragging ? "none" : "transform 0.2s ease-out",
              }}
              priority
            />
          </div>
        </div>
      )}
    </>
  );
}
