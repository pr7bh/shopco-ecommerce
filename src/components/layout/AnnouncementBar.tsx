"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

const MESSAGES = [
  "FREE SHIPPING ON ORDERS OVER $200",
  "NEW SEASON — EXPLORE THE COLLECTION",
  "USE CODE NEWUSER FOR 15% OFF YOUR FIRST ORDER",
];

export function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    try {
      if (localStorage.getItem("shopco-bar-dismissed") === "1") {
        setVisible(false);
      }
    } catch {}
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % MESSAGES.length);
        setFade(true);
      }, 300);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  function dismiss() {
    setVisible(false);
    try {
      localStorage.setItem("shopco-bar-dismissed", "1");
    } catch {}
  }

  if (!visible) return null;

  return (
    <div className="h-10 bg-black text-white flex items-center justify-center relative overflow-hidden shrink-0">
      <span
        className="eyebrow text-white/90 transition-opacity duration-300 px-10 text-center"
        style={{ opacity: fade ? 1 : 0 }}
      >
        {MESSAGES[idx]}
      </span>
      <button
        aria-label="Dismiss announcement"
        onClick={dismiss}
        className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity"
      >
        <X size={14} />
      </button>
    </div>
  );
}
