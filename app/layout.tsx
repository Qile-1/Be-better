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
  themeColor: "#F6F7F2"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-paper shadow-soft">
          <main className="flex-1 pb-24">{children}</main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
