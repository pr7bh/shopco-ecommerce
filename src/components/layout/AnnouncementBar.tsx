"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Link from "next/link";

export function AnnouncementBar() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="bg-black text-white text-sm py-2.5 px-4 relative">
      <p className="text-center">
        Sign up and get 20% off to your first order.{" "}
        <Link
          href="/auth/register"
          className="underline underline-offset-2 font-medium hover:text-gray-200 transition-colors"
        >
          Sign Up Now
        </Link>
      </p>
      <button
        aria-label="Dismiss announcement"
        onClick={() => setVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
      >
        <X size={16} />
      </button>
    </div>
  );
}
