"use client";

import { useCallback } from "react";

export function useTiksSounds() {
  const play = useCallback(async (sound: string) => {
    try {
      const { tiks } = await import("@rexa-developer/tiks");
      switch (sound) {
        case "click":
          tiks.click();
          break;
        case "hover":
          tiks.hover();
          break;
        case "toggle":
          tiks.toggle(false);
          break;
        default:
          tiks.click();
      }
    } catch {
      // tiks is optional
    }
  }, []);

  return { play };
}
