import type { Metadata, Viewport } from "next";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const siteUrl = "https://djstratageminc.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "D&J Stratagem — Find the work. Price it. Build it.",
    template: "%s | D&J Stratagem",
  },
  description:
    "One construction account for contractors, subcontractors, and suppliers to find work, bid, source material, staff crews, and build what’s next.",
  applicationName: "D&J Stratagem",
  icons: { icon: "/favicon.svg" },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "D&J Stratagem",
    title: "Find the work. Price it. Build it.",
    description:
      "Nine modes. One desk. Construction work connected from the first lead to the next customer.",
  },
  twitter: {
    card: "summary_large_image",
    title: "D&J Stratagem — Find the work. Price it. Build it.",
    description:
      "Nine modes. One desk. Construction work connected from the first lead to the next customer.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0b1118" },
    { media: "(prefers-color-scheme: light)", color: "#f7f6f2" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
