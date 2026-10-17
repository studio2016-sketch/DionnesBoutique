import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Dionne’s Boutique | Timeless Style. Elevated You.", description: "An elegant, curated boutique of fragrance, beauty and distinctive finds.", robots: { index: false, follow: false } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
