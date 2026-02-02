"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";

const links = [
  { href: "/", label: "Home" },
  { href: "/etl", label: "ETL Recipes" },
  { href: "/agents", label: "Agents" },
  { href: "/configs", label: "Configs" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-[var(--card-border)] backdrop-blur-md sticky top-0 z-50" style={{ background: "var(--nav-bg)" }}>
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg tracking-tight text-[var(--fg)]">
          <span className="text-[var(--accent)]">Q</span>drant ETL
        </Link>
        <div className="flex items-center gap-6">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm transition-colors ${
                pathname === l.href
                  ? "text-[var(--fg)]"
                  : "text-[var(--muted)] hover:text-[var(--fg)]"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
