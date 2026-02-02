const REPO = "thierrypdamiba/qdrant-etl-cookbook";

export function ColabButton({ notebook }: { notebook: string }) {
  if (!notebook) return null;

  const colabUrl = `https://colab.research.google.com/github/${REPO}/blob/main/${notebook}`;
  const githubUrl = `https://github.com/${REPO}/blob/main/${notebook}`;

  return (
    <div className="flex gap-3">
      <a
        href={colabUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-[#F9AB00] text-black text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#F9AB00]/90 transition-colors"
      >
        Open in Colab
      </a>
      <a
        href={githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-white/10 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/20 transition-colors"
      >
        View on GitHub
      </a>
    </div>
  );
}
