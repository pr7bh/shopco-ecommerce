import type { Metadata } from "next";
import { Inter, Space_Grotesk, Unbounded } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

/* Used only for the hero headline — wide/heavy, closest to Integral CF */
const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SHOP.CO — Find Clothes That Match Your Style",
    template: "%s | SHOP.CO",
  },
  description:
    "Browse our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.",
  keywords: ["fashion", "clothing", "style", "apparel", "shop"],
  openGraph: {
    type: "website",
    siteName: "SHOP.CO",
    title: "SHOP.CO — Find Clothes That Match Your Style",
    description:
      "Browse our diverse range of meticulously crafted garments, designed to bring out your individuality.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${unbounded.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
