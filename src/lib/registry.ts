import fs from "fs";
import path from "path";
import yaml from "js-yaml";

export interface RegistryEntry {
  slug: string;
  title: string;
  notebook: string;
  tags: string[];
  requires_api_key: boolean;
  description: string;
  code: string;
  language: string;
  colabUrl: string;
  githubUrl: string;
}

interface RawEntry {
  slug: string;
  title: string;
  notebook: string;
  tags: string[];
  requires_api_key: boolean;
}

interface Registry {
  etl: RawEntry[];
  agents: RawEntry[];
  configs: RawEntry[];
}

const REPO = "thierrypdamiba/qdrant-etl-cookbook";

function extractFromNotebook(notebookPath: string): {
  description: string;
  code: string;
  language: string;
} {
  const fullPath = path.join(process.cwd(), notebookPath);
  if (!fs.existsSync(fullPath)) {
    return { description: "", code: "", language: "python" };
  }

  const nb = JSON.parse(fs.readFileSync(fullPath, "utf-8"));
  const cells = nb.cells || [];

  // Extract description from first markdown cell
  let description = "";
  for (const cell of cells) {
    if (cell.cell_type === "markdown") {
      const text = (cell.source || []).join("");
      // Skip the title line and badge, get the description paragraph
      const lines = text.split("\n").filter(
        (l: string) =>
          l.trim() &&
          !l.startsWith("#") &&
          !l.includes("colab.research.google.com") &&
          !l.startsWith("**Requirements")
      );
      if (lines.length > 0) {
        description = lines.join(" ").trim();
        break;
      }
    }
  }

  // Extract all code cells (skip pip install cells)
  const codeCells: string[] = [];
  for (const cell of cells) {
    if (cell.cell_type === "code") {
      const src = (cell.source || []).join("");
      if (!src.trim().startsWith("!pip") && src.trim()) {
        codeCells.push(src);
      }
    }
  }

  return {
    description,
    code: codeCells.join("\n\n"),
    language: "python",
  };
}

function enrichEntry(entry: RawEntry): RegistryEntry {
  const { description, code, language } = extractFromNotebook(entry.notebook);
  return {
    ...entry,
    description,
    code,
    language,
    colabUrl: entry.notebook
      ? `https://colab.research.google.com/github/${REPO}/blob/main/${entry.notebook}`
      : "",
    githubUrl: entry.notebook
      ? `https://github.com/${REPO}/blob/main/${entry.notebook}`
      : "",
  };
}

let _cache: Registry | null = null;

function loadRegistry(): Registry {
  if (_cache) return _cache;
  const filePath = path.join(process.cwd(), "registry.yaml");
  const raw = fs.readFileSync(filePath, "utf-8");
  _cache = yaml.load(raw) as Registry;
  return _cache;
}

export function getETLRecipes(): RegistryEntry[] {
  return (loadRegistry().etl || []).map(enrichEntry);
}

export function getAgents(): RegistryEntry[] {
  return (loadRegistry().agents || []).map(enrichEntry);
}

export function getConfigs(): RegistryEntry[] {
  return (loadRegistry().configs || []).map(enrichEntry);
}

export function getAllEntries(): RegistryEntry[] {
  return [...getETLRecipes(), ...getAgents(), ...getConfigs()];
}
