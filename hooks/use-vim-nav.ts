"use client";

import { useRouter } from "next/navigation";
import { useEffect, useCallback, useRef } from "react";

const NAV_SELECTOR = "[data-nav]";

export function useVimNav() {
  const router = useRouter();
  const lastGPress = useRef(0);
  const focusedRef = useRef<Element | null>(null);

  const getNavElements = useCallback((): HTMLElement[] => {
    return Array.from(document.querySelectorAll(NAV_SELECTOR));
  }, []);

  const focusElement = useCallback((el: HTMLElement) => {
    getNavElements().forEach((e) => {
      e.setAttribute("tabindex", "-1");
    });
    el.setAttribute("tabindex", "0");
    el.focus({ preventScroll: true });
    focusedRef.current = el;
  }, [getNavElements]);

  const focusFirst = useCallback(() => {
    const els = getNavElements();
    if (els.length > 0) focusElement(els[0]);
  }, [getNavElements, focusElement]);

  const focusNext = useCallback(() => {
    const els = getNavElements();
    if (els.length === 0) return;
    const current = focusedRef.current;
    const idx = current ? els.indexOf(current as HTMLElement) : -1;
    const next = idx < els.length - 1 ? els[idx + 1] : els[0];
    focusElement(next);
  }, [getNavElements, focusElement]);

  const focusPrev = useCallback(() => {
    const els = getNavElements();
    if (els.length === 0) return;
    const current = focusedRef.current;
    const idx = current ? els.indexOf(current as HTMLElement) : -1;
    const prev = idx > 0 ? els[idx - 1] : els[els.length - 1];
    focusElement(prev);
  }, [getNavElements, focusElement]);

  const activateFocused = useCallback(() => {
    const el = focusedRef.current as HTMLElement | null;
    if (!el) return;
    const tag = el.tagName.toLowerCase();
    if (tag === "a" || tag === "button") {
      el.click();
    } else {
      const link = el.querySelector("a");
      if (link) link.click();
      else el.click();
    }
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const tag = target.tagName.toLowerCase();
      const isEditable =
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        target.getAttribute("contenteditable") === "true";

      if (isEditable) return;

      switch (e.key) {
        case "j":
          e.preventDefault();
          if (!focusedRef.current) {
            focusFirst();
          } else {
            focusNext();
          }
          break;
        case "k":
          e.preventDefault();
          if (!focusedRef.current) {
            focusFirst();
          } else {
            focusPrev();
          }
          break;
        case "Enter":
          activateFocused();
          break;
        case "h":
          router.push("/");
          break;
        case "b":
          router.push("/blog");
          break;
        case "p":
          router.push("/projects");
          break;
        case "g": {
          const now = Date.now();
          if (now - lastGPress.current < 300) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            lastGPress.current = 0;
          } else {
            lastGPress.current = now;
          }
          break;
        }
        case "G":
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth",
          });
          break;
        case "/":
          e.preventDefault();
          break;
      }
    },
    [router, focusFirst, focusNext, focusPrev, activateFocused]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    const handleBlur = () => {
      focusedRef.current = null;
      getNavElements().forEach((e) => e.setAttribute("tabindex", "-1"));
    };
    document.addEventListener("focusout", handleBlur);
    return () => document.removeEventListener("focusout", handleBlur);
  }, [getNavElements]);
}
