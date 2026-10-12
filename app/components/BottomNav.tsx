"use client";

import { BookOpenText, Home, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "首页", Icon: Home },
  { href: "/learn", label: "学习", Icon: BookOpenText },
  { href: "/me", label: "我的", Icon: UserRound }
];

export function BottomNav() {
  const pathname = usePathname();
  const home = pathname === "/";
  return (
    <>
      <header className={`site-header ${home ? "site-header-film" : ""}`}>
        <Link href="/" className="wordmark" aria-label="Be better 首页">Be <span>better.</span></Link>
        <nav aria-label="主导航" className="desktop-nav">{items.map(({ href, label }) => (
          <Link key={href} href={href} aria-current={(href === "/" ? home : pathname.startsWith(href)) ? "page" : undefined}>{label}</Link>
        ))}</nav>
        <Link href="/me" className="mobile-profile" aria-label="查看我的学习进度"><UserRound size={18} aria-hidden="true" /></Link>
      </header>
      <nav className="mobile-nav" aria-label="手机主导航">{items.map(({ href, label, Icon }) => (
        <Link key={href} href={href} aria-current={(href === "/" ? home : pathname.startsWith(href)) ? "page" : undefined}>
          <Icon size={19} aria-hidden="true" /><span>{label}</span>
        </Link>
      ))}</nav>
    </>
  );
}
