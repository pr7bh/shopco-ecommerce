import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Same mark as icon.svg, full-bleed: iOS applies its own corner rounding.
const MARK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="#0E0E0D"/>
  <path d="M41.5 22.5C40.6 17.4 36.2 14.5 29.6 14.5C22.6 14.5 18 18.1 18 23.6C18 29.6 23.4 31.3 29.6 32.6C36 34 41.5 35.9 41.5 42C41.5 47.7 36.6 51 29.6 51C22.6 51 17.8 48 17 42.3" fill="none" stroke="#FFFFFF" stroke-width="8.5" stroke-linecap="square"/>
  <circle cx="49.5" cy="46.5" r="5" fill="#C8BBAA"/>
</svg>`;

export default function AppleIcon() {
  return new ImageResponse(
    (
      <img
        src={`data:image/svg+xml;base64,${Buffer.from(MARK).toString("base64")}`}
        width={size.width}
        height={size.height}
        alt=""
      />
    ),
    size
  );
}
