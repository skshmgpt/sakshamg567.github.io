"use client";

import { useEffect, useRef } from "react";

export default function TiksProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;

    const handleFirstGesture = async () => {
      if (initialized.current) return;
      initialized.current = true;

      try {
        const { tiks } = await import("@rexa-developer/tiks");
        tiks.init();
      } catch {
        // tiks is optional — fail silently
      }

      window.removeEventListener("click", handleFirstGesture);
      window.removeEventListener("keydown", handleFirstGesture);
      window.removeEventListener("touchstart", handleFirstGesture);
    };

    window.addEventListener("click", handleFirstGesture, { once: true });
    window.addEventListener("keydown", handleFirstGesture, { once: true });
    window.addEventListener("touchstart", handleFirstGesture, { once: true });

    return () => {
      window.removeEventListener("click", handleFirstGesture);
      window.removeEventListener("keydown", handleFirstGesture);
      window.removeEventListener("touchstart", handleFirstGesture);
    };
  }, []);

  return <>{children}</>;
}
