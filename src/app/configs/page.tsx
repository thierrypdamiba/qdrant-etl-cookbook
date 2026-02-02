import { configs } from "@/data/configs";
import { RecipeCard } from "@/components/recipe-card";

export default function ConfigsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Qdrant Configs</h1>
        <p className="text-[var(--muted)]">
          Production-ready configuration patterns. Indexing, quantization,
          multi-tenancy, backups, and deployment.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {configs.map((c) => (
          <RecipeCard key={c.slug} item={c} basePath="/configs" />
        ))}
      </div>
    </div>
  );
}
