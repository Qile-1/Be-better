import type { Metadata, Viewport } from "next";
import { BottomNav } from "./components/BottomNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Be better",
  description: "四级阅读的 AI 费曼督学产品"
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F6F6F5"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col bg-white">
          <BottomNav />
          <main className="flex-1 pb-24 md:pb-0">{children}</main>
        </div>
      </body>
    </html>
  );
}
