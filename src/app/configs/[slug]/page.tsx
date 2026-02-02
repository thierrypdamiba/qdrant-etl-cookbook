import { notFound } from "next/navigation";
import { configs } from "@/data/configs";
import { CodeBlock } from "@/components/code-block";
import Link from "next/link";

export function generateStaticParams() {
  return configs.map((c) => ({ slug: c.slug }));
}

export default async function ConfigDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const config = configs.find((c) => c.slug === slug);
  if (!config) notFound();

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <Link
          href="/configs"
          className="text-sm text-[var(--muted)] hover:text-white"
        >
          ← Back to configs
        </Link>
      </div>
      <div className="space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {config.tags.map((t) => (
            <span
              key={t}
              className="text-xs bg-[var(--accent)]/10 text-[var(--accent)] px-2 py-0.5 rounded"
            >
              {t}
            </span>
          ))}
        </div>
        <h1 className="text-3xl font-bold">{config.title}</h1>
        <p className="text-[var(--muted)]">{config.description}</p>
      </div>
      <CodeBlock code={config.code} language={config.language} />
    </div>
  );
}
