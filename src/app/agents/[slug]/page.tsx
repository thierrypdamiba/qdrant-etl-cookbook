import { notFound } from "next/navigation";
import { getAgents } from "@/lib/registry";
import { CodeBlock } from "@/components/code-block";
import { ColabButton } from "@/components/colab-button";
import Link from "next/link";

export function generateStaticParams() {
  return getAgents().map((a) => ({ slug: a.slug }));
}

export default async function AgentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const agent = getAgents().find((a) => a.slug === slug);
  if (!agent) notFound();

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <Link
          href="/agents"
          className="text-sm text-[var(--muted)] hover:text-[var(--fg)]"
        >
          ← Back to agents
        </Link>
      </div>
      <div className="space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {agent.tags.map((t) => (
            <span
              key={t}
              className="text-xs bg-[var(--badge-bg)] text-[var(--badge-text)] px-2 py-0.5 rounded"
            >
              {t}
            </span>
          ))}
        </div>
        <h1 className="text-3xl font-bold text-[var(--fg)]">{agent.title}</h1>
        <p className="text-[var(--muted)]">{agent.description}</p>
        <ColabButton notebook={agent.notebook} />
      </div>
      <CodeBlock code={agent.code} language="python" />
    </div>
  );
}
