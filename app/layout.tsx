import type { Metadata, Viewport } from "next";
import { BottomNav } from "./components/BottomNav";
import "./globals.css";

export const metadata: Metadata = { title: "Be better", description: "四级阅读、写作与翻译的 AI 费曼督学产品" };
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#F4F3ED" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body className="antialiased"><div className="app-shell"><BottomNav /><main className="app-main">{children}</main></div></body></html>;
}
