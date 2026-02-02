export interface Agent {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  code: string;
  notebook: string;
}

export const agents: Agent[] = [
  {
    slug: "rag-agent",
    title: "RAG Agent with Qdrant",
    description:
      "A retrieval-augmented generation agent that queries Qdrant for context and generates answers using an LLM.",
    tags: ["rag", "openai", "retrieval"],
    notebook: "notebooks/agents/rag_agent.ipynb",
    code: `import os
from openai import OpenAI
from qdrant_client import QdrantClient

qdrant = QdrantClient(url="http://localhost:6333")
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def rag_agent(query: str, collection: str = "documents", top_k: int = 5):
    """Retrieve relevant context from Qdrant, then generate an answer."""

    # Search Qdrant for relevant documents
    results = qdrant.query(
        collection_name=collection,
        query_text=query,
        limit=top_k,
    )

    context = "\\n\\n".join([r.document for r in results])

    response = openai_client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": (
                    "Answer the user's question using the provided context. "
                    "If the context doesn't contain the answer, say so."
                ),
            },
            {
                "role": "user",
                "content": f"Context:\\n{context}\\n\\nQuestion: {query}",
            },
        ],
    )

    return {
        "answer": response.choices[0].message.content,
        "sources": [r.metadata for r in results],
    }

# Usage
result = rag_agent("How do I set up HNSW indexing?")
print(result["answer"])`,
  },
  {
    slug: "ingestion-agent",
    title: "Auto-Ingestion Agent",
    description:
      "Watches a directory for new files and automatically ingests them into Qdrant with the right embedding model.",
    tags: ["watchdog", "auto-ingest", "pipeline"],
    notebook: "",
    code: `import os
import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from qdrant_client import QdrantClient

client = QdrantClient(url="http://localhost:6333")

EXTENSION_HANDLERS = {
    ".txt": "text",
    ".pdf": "pdf",
    ".csv": "csv",
    ".json": "json",
    ".md": "text",
}

class IngestionHandler(FileSystemEventHandler):
    def on_created(self, event):
        if event.is_directory:
            return

        ext = os.path.splitext(event.src_path)[1].lower()
        handler_type = EXTENSION_HANDLERS.get(ext)

        if not handler_type:
            print(f"Skipping unsupported file: {event.src_path}")
            return

        print(f"Ingesting {event.src_path} as {handler_type}")
        self.ingest(event.src_path, handler_type)

    def ingest(self, filepath: str, file_type: str):
        if file_type == "text":
            with open(filepath) as f:
                text = f.read()
            client.add(
                collection_name="auto_ingest",
                documents=[text],
                metadata=[{"source": filepath, "type": file_type}],
            )
        # Add more handlers for pdf, csv, json...
        print(f"Ingested: {filepath}")

watch_dir = "./inbox"
os.makedirs(watch_dir, exist_ok=True)

observer = Observer()
observer.schedule(IngestionHandler(), watch_dir, recursive=True)
observer.start()

print(f"Watching {watch_dir} for new files...")
try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    observer.stop()
observer.join()`,
  },
  {
    slug: "dedup-agent",
    title: "Deduplication Agent",
    description:
      "Finds and removes near-duplicate entries in a Qdrant collection using vector similarity thresholds.",
    tags: ["dedup", "maintenance", "similarity"],
    notebook: "notebooks/agents/dedup_agent.ipynb",
    code: `from qdrant_client import QdrantClient
from qdrant_client.models import Filter, FieldCondition, MatchValue

client = QdrantClient(url="http://localhost:6333")

def find_duplicates(
    collection: str,
    threshold: float = 0.95,
    batch_size: int = 100,
):
    """Scan collection and find near-duplicate pairs."""

    duplicates = []
    offset = None

    while True:
        records, offset = client.scroll(
            collection_name=collection,
            limit=batch_size,
            offset=offset,
            with_vectors=True,
        )

        if not records:
            break

        for record in records:
            similar = client.search(
                collection_name=collection,
                query_vector=record.vector,
                limit=5,
                score_threshold=threshold,
            )

            for match in similar:
                if match.id != record.id and match.id > record.id:
                    duplicates.append((record.id, match.id, match.score))

        if offset is None:
            break

    return duplicates

def remove_duplicates(collection: str, threshold: float = 0.95):
    dupes = find_duplicates(collection, threshold)
    print(f"Found {len(dupes)} duplicate pairs")

    ids_to_remove = set()
    for _, dup_id, score in dupes:
        ids_to_remove.add(dup_id)

    if ids_to_remove:
        from qdrant_client.models import PointIdsList
        client.delete(
            collection_name=collection,
            points_selector=PointIdsList(points=list(ids_to_remove)),
        )
        print(f"Removed {len(ids_to_remove)} duplicate points")

    return len(ids_to_remove)

# Usage
removed = remove_duplicates("my_collection", threshold=0.97)`,
  },
  {
    slug: "multi-collection-router",
    title: "Multi-Collection Router Agent",
    description:
      "Routes queries to the most relevant Qdrant collection based on intent classification.",
    tags: ["routing", "multi-collection", "intent"],
    notebook: "",
    code: `import os
from openai import OpenAI
from qdrant_client import QdrantClient

qdrant = QdrantClient(url="http://localhost:6333")
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

COLLECTIONS = {
    "technical_docs": "Technical documentation and API references",
    "blog_posts": "Blog posts and tutorials",
    "support_tickets": "Customer support tickets and solutions",
    "product_specs": "Product specifications and feature lists",
}

def classify_intent(query: str) -> list[str]:
    """Use an LLM to determine which collections to search."""
    response = openai_client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": (
                    "Given a user query, return the most relevant collection names "
                    f"from this list: {list(COLLECTIONS.keys())}. "
                    "Return as comma-separated values. Return 1-2 collections max."
                ),
            },
            {"role": "user", "content": query},
        ],
    )
    names = response.choices[0].message.content.strip().split(",")
    return [n.strip() for n in names if n.strip() in COLLECTIONS]

def route_and_search(query: str, top_k: int = 5):
    """Route query to relevant collections and aggregate results."""
    target_collections = classify_intent(query)

    all_results = []
    for collection in target_collections:
        results = qdrant.query(
            collection_name=collection,
            query_text=query,
            limit=top_k,
        )
        for r in results:
            r.metadata["_collection"] = collection
            all_results.append(r)

    # Sort by score across all collections
    all_results.sort(key=lambda r: r.score, reverse=True)
    return all_results[:top_k]

# Usage
results = route_and_search("How do I configure HNSW parameters?")
for r in results:
    print(f"[{r.metadata['_collection']}] {r.score:.4f}: {r.document[:80]}")`,
  },
];
