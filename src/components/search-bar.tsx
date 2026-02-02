"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/etl?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search recipes, agents, configs..."
          className="w-full bg-[var(--card)] border border-[var(--card-border)] rounded-lg px-4 py-3 text-sm text-white placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-medium px-3 py-1.5 rounded-md transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  );
}
