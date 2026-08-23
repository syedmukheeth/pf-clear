import type { Metadata, Viewport } from "next";
import "./globals.css";

const DESCRIPTION =
  "A citizen-side rebuild of the EPFO member portal: plain-language claim status, decoded rejections, and what you will actually receive.";

export const metadata: Metadata = {
  title: "PF Clear — know why your PF claim is stuck",
  description: DESCRIPTION,
  // The submission is a shared link. It should not unfurl as a bare URL.
  openGraph: {
    title: "PF Clear — know why your PF claim is stuck",
    description: DESCRIPTION,
    type: "website",
    siteName: "PF Clear",
  },
  twitter: { card: "summary", title: "PF Clear", description: DESCRIPTION },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1F3A8A",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-dvh flex flex-col antialiased">
        <div className="flex-1">{children}</div>
        <footer className="border-t border-line bg-sunk">
          <p className="mx-auto max-w-3xl px-4 py-3 text-center text-xs text-ink-faint">
            Demo only — all data is fictional. Not affiliated with EPFO.
          </p>
        </footer>
      </body>
    </html>
  );
}
