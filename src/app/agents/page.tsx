import { getAgents } from "@/lib/registry";
import { RecipeCard } from "@/components/recipe-card";

export default function AgentsPage() {
  const agents = getAgents();

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-[var(--fg)]">Agents</h1>
        <p className="text-[var(--muted)]">
          Agent patterns built on top of Qdrant. RAG, ingestion pipelines,
          deduplication, and routing.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agents.map((a) => (
          <RecipeCard key={a.slug} item={a} basePath="/agents" />
        ))}
      </div>
    </div>
  );
}
