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
        className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full border-t border-ink/15 bg-white px-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 md:hidden"
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
                  "flex h-14 flex-col items-center justify-center text-xs font-medium transition",
                  isActive
                    ? "text-ink"
                    : "text-ink/45 hover:text-ink"
                ].join(" ")}
              >
                <Icon aria-hidden="true" className="mb-1 h-5 w-5" />
                <span>{label}</span>
                <span className={`mt-1 h-0.5 w-5 ${isActive ? "bg-ink" : "bg-transparent"}`} />
              </Link>
            );
          })}
        </div>
      </nav>

      <nav
        aria-label="主导航"
        className="sticky top-0 z-30 hidden items-center justify-between border-b border-ink/10 bg-white px-12 py-4 md:flex"
      >
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center bg-ink text-sm font-semibold text-white">
            B
          </span>
          <span className="text-lg font-semibold text-ink">Be better</span>
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
                  "flex h-11 items-center gap-2 border-b-2 px-4 text-sm font-medium transition",
                  isActive
                    ? "border-ink text-ink"
                    : "border-transparent text-ink/50 hover:text-ink"
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
