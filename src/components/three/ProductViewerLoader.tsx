"use client";

import dynamic from "next/dynamic";

const ProductViewer = dynamic(
  () => import("./ProductViewer").then((m) => m.ProductViewer),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-2xl">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    ),
  }
);

export { ProductViewer };
