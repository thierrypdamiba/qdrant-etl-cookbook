import Link from "next/link";
import { SearchBar } from "@/components/search-bar";
import { etlRecipes } from "@/data/etl-recipes";
import { agents } from "@/data/agents";
import { configs } from "@/data/configs";
import { RecipeCard } from "@/components/recipe-card";

export default function Home() {
  return (
    <div className="space-y-16">
      <section className="text-center space-y-6 py-12">
        <h1 className="text-5xl font-bold tracking-tight">
          Qdrant ETL Cookbook
        </h1>
        <p className="text-lg text-[var(--muted)] max-w-2xl mx-auto">
          Your one-stop resource for loading any data type into Qdrant.
          Working code, agent patterns, and production configs.
        </p>
        <SearchBar />
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">ETL Recipes</h2>
          <Link
            href="/etl"
            className="text-sm text-[var(--accent)] hover:text-[var(--accent-hover)]"
          >
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {etlRecipes.slice(0, 6).map((r) => (
            <RecipeCard key={r.slug} item={r} basePath="/etl" />
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Agents</h2>
          <Link
            href="/agents"
            className="text-sm text-[var(--accent)] hover:text-[var(--accent-hover)]"
          >
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.slice(0, 3).map((a) => (
            <RecipeCard key={a.slug} item={a} basePath="/agents" />
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Qdrant Configs</h2>
          <Link
            href="/configs"
            className="text-sm text-[var(--accent)] hover:text-[var(--accent-hover)]"
          >
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {configs.slice(0, 3).map((c) => (
            <RecipeCard key={c.slug} item={c} basePath="/configs" />
          ))}
        </div>
      </section>
    </div>
  );
}
