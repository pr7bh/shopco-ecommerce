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
    default: "SHOP.CO — Premium Fashion",
    template: "%s | SHOP.CO",
  },
  description:
    "Discover premium fashion for women, men and accessories. Shop the latest collections at SHOP.CO — refined pieces for the modern wardrobe.",
  keywords: ["fashion", "clothing", "women", "men", "accessories", "premium", "style", "apparel"],
  openGraph: {
    type: "website",
    siteName: "SHOP.CO",
    title: "SHOP.CO — Premium Fashion",
    description:
      "Discover premium fashion for women, men and accessories. Shop the latest collections at SHOP.CO.",
  },
  twitter: { card: "summary_large_image" },
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
      <body className="min-h-full flex flex-col antialiased">
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
