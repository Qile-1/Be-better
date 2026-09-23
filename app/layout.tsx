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
        <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-[#fbfcf9]/95 shadow-soft md:max-w-5xl lg:my-6 lg:min-h-[calc(100dvh-3rem)] lg:rounded-3xl lg:border lg:border-white/80 lg:shadow-[0_28px_80px_rgba(22,32,25,0.10)] xl:max-w-6xl">
          <BottomNav />
          <main className="flex-1 pb-24 md:pb-0">{children}</main>
        </div>
      </body>
    </html>
  );
}
