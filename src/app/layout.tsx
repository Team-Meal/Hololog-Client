import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hololog",
  description: "홀로로그 - 일상 기록 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
