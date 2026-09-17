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
    <nav
      aria-label="主导航"
      className="fixed inset-x-0 bottom-0 z-20 mx-auto w-full max-w-md border-t border-black/10 bg-white/95 px-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur"
    >
      <div className="grid grid-cols-3 gap-1">
        {navItems.map(({ href, label, Icon }) => {
          const isActive =
            href === "/" ? pathname === href : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={[
                "flex h-14 flex-col items-center justify-center rounded-lg text-xs font-medium transition",
                isActive
                  ? "bg-leaf text-white"
                  : "text-ink/60 hover:bg-leaf/10 hover:text-leaf"
              ].join(" ")}
            >
              <Icon aria-hidden="true" className="mb-1 h-5 w-5" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
