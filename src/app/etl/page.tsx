import { etlRecipes } from "@/data/etl-recipes";
import { RecipeCard } from "@/components/recipe-card";
import { SearchBar } from "@/components/search-bar";

export default function ETLPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">ETL Recipes</h1>
        <p className="text-[var(--muted)]">
          Copy-paste recipes for loading any data type into Qdrant.
        </p>
        <SearchBar />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {etlRecipes.map((r) => (
          <RecipeCard key={r.slug} item={r} basePath="/etl" />
        ))}
      </div>
    </div>
  );
}
