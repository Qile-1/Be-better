"use client";

import { BookOpenText, Home, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType, SVGProps } from "react";

type NavItem = {
  href: string;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const navItems: NavItem[] = [
  { href: "/", label: "首页", Icon: Home },
  { href: "/learn", label: "学习", Icon: BookOpenText },
  { href: "/me", label: "我的", Icon: UserRound }
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <>
      <nav
        aria-label="主导航"
        className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-md border-t border-black/5 bg-white/90 px-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-12px_30px_rgba(22,32,25,0.06)] backdrop-blur-xl md:hidden"
      >
        <div className="grid grid-cols-3 gap-1.5">
          {navItems.map(({ href, label, Icon }) => {
            const isActive =
              href === "/" ? pathname === href : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={[
                  "flex h-14 flex-col items-center justify-center rounded-2xl text-xs font-semibold transition",
                  isActive
                    ? "bg-gradient-to-br from-leaf to-[#4f8a68] text-white shadow-[0_8px_20px_rgba(47,111,78,0.22)]"
                    : "text-ink/55 hover:bg-leaf/10 hover:text-leaf"
                ].join(" ")}
              >
                <Icon aria-hidden="true" className="mb-1 h-5 w-5" />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <nav
        aria-label="主导航"
        className="sticky top-0 z-30 hidden items-center justify-between border-b border-black/5 bg-white/80 px-8 py-3 backdrop-blur-xl md:flex lg:rounded-t-3xl lg:px-10"
      >
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-leaf to-[#4f8a68] text-sm font-bold text-white shadow-[0_8px_22px_rgba(47,111,78,0.20)]">
            B
          </span>
          <span className="text-lg font-extrabold text-ink">Be better</span>
        </Link>

        <div className="flex items-center gap-2">
          {navItems.map(({ href, label, Icon }) => {
            const isActive =
              href === "/" ? pathname === href : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={[
                  "flex h-11 items-center gap-2 rounded-2xl px-4 text-sm font-semibold transition",
                  isActive
                    ? "bg-leaf/10 text-leaf"
                    : "text-ink/55 hover:bg-paper hover:text-ink"
                ].join(" ")}
              >
                <Icon aria-hidden="true" className="h-5 w-5" />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
