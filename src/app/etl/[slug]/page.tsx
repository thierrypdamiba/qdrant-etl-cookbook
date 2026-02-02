import { notFound } from "next/navigation";
import { etlRecipes } from "@/data/etl-recipes";
import { CodeBlock } from "@/components/code-block";
import Link from "next/link";

export function generateStaticParams() {
  return etlRecipes.map((r) => ({ slug: r.slug }));
}

export default async function ETLDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const recipe = etlRecipes.find((r) => r.slug === slug);
  if (!recipe) notFound();

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <Link
          href="/etl"
          className="text-sm text-[var(--muted)] hover:text-white"
        >
          ← Back to recipes
        </Link>
      </div>
      <div className="space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {recipe.tags.map((t) => (
            <span
              key={t}
              className="text-xs bg-[var(--accent)]/10 text-[var(--accent)] px-2 py-0.5 rounded"
            >
              {t}
            </span>
          ))}
        </div>
        <h1 className="text-3xl font-bold">{recipe.title}</h1>
        <p className="text-[var(--muted)]">{recipe.description}</p>
      </div>
      <CodeBlock code={recipe.code} language="python" />
    </div>
  );
}
