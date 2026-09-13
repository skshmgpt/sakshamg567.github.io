"use client";

import dynamic from "next/dynamic";

const Scratchpad = dynamic(() => import("@/components/Scratchpad"), {
  ssr: false,
  loading: () => null,
});

export default function ScratchpadDynamic() {
  return <Scratchpad />;
}
