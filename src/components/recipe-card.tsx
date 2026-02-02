import Link from "next/link";

interface CardItem {
  slug: string;
  title: string;
  description: string;
  tags: string[];
}

export function RecipeCard({
  item,
  basePath,
}: {
  item: CardItem;
  basePath: string;
}) {
  return (
    <Link
      href={`${basePath}/${item.slug}`}
      className="block bg-[var(--card)] border border-[var(--card-border)] rounded-lg p-5 hover:border-[var(--accent)]/50 transition-colors group"
    >
      <h3 className="font-semibold text-white group-hover:text-[var(--accent)] transition-colors">
        {item.title}
      </h3>
      <p className="text-sm text-[var(--muted)] mt-2 line-clamp-2">
        {item.description}
      </p>
      <div className="flex flex-wrap gap-1.5 mt-3">
        {item.tags.map((t) => (
          <span
            key={t}
            className="text-xs bg-white/5 text-[var(--muted)] px-2 py-0.5 rounded"
          >
            {t}
          </span>
        ))}
      </div>
    </Link>
  );
}
