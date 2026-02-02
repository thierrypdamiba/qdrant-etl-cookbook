# Qdrant ETL Cookbook

Your one-stop resource for loading any data type into [Qdrant](https://qdrant.tech). Working code, agent patterns, and production configs.

**[Browse the cookbook](https://etl-amoeba-labs.vercel.app)** | **[Contributing](CONTRIBUTING.md)**

## Recipes

### ETL (data loading)

| Recipe | Notebook | Tags |
|--------|----------|------|
| Load CSV into Qdrant | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/thierrypdamiba/qdrant-etl-cookbook/blob/main/notebooks/etl/csv_to_qdrant.ipynb) | csv, pandas |
| Load JSON/JSONL into Qdrant | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/thierrypdamiba/qdrant-etl-cookbook/blob/main/notebooks/etl/json_to_qdrant.ipynb) | json, streaming |
| Extract PDF text and load into Qdrant | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/thierrypdamiba/qdrant-etl-cookbook/blob/main/notebooks/etl/pdf_to_qdrant.ipynb) | pdf, chunking, rag |
| Image embeddings with CLIP | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/thierrypdamiba/qdrant-etl-cookbook/blob/main/notebooks/etl/images_clip_to_qdrant.ipynb) | images, clip, multimodal |
| Web scraping to Qdrant | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/thierrypdamiba/qdrant-etl-cookbook/blob/main/notebooks/etl/web_scrape_to_qdrant.ipynb) | scraping, beautifulsoup |
| PostgreSQL to Qdrant | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/thierrypdamiba/qdrant-etl-cookbook/blob/main/notebooks/etl/postgres_to_qdrant.ipynb) | postgres, sql |
| FastEmbed with Qdrant | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/thierrypdamiba/qdrant-etl-cookbook/blob/main/notebooks/etl/fastembed_to_qdrant.ipynb) | fastembed, lightweight |
| Sparse vectors with BM25 | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/thierrypdamiba/qdrant-etl-cookbook/blob/main/notebooks/etl/sparse_vectors_bm25.ipynb) | sparse, bm25, hybrid |

### Agents

| Recipe | Notebook | Tags |
|--------|----------|------|
| RAG Agent with Qdrant | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/thierrypdamiba/qdrant-etl-cookbook/blob/main/notebooks/agents/rag_agent.ipynb) | rag, openai |
| Deduplication Agent | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/thierrypdamiba/qdrant-etl-cookbook/blob/main/notebooks/agents/dedup_agent.ipynb) | dedup, maintenance |

### Qdrant Configs

| Recipe | Notebook | Tags |
|--------|----------|------|
| HNSW Index Tuning | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/thierrypdamiba/qdrant-etl-cookbook/blob/main/notebooks/configs/hnsw_tuning.ipynb) | hnsw, performance |
| Payload Indexes | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/thierrypdamiba/qdrant-etl-cookbook/blob/main/notebooks/configs/payload_indexes.ipynb) | payload, filtering |
| Quantization Settings | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/thierrypdamiba/qdrant-etl-cookbook/blob/main/notebooks/configs/quantization.ipynb) | quantization, memory |

## Running locally

```bash
# Clone
git clone https://github.com/thierrypdamiba/qdrant-etl-cookbook.git
cd qdrant-etl-cookbook

# Run a notebook
pip install jupyter qdrant-client sentence-transformers
jupyter notebook notebooks/etl/csv_to_qdrant.ipynb

# Run the web UI
pnpm install
pnpm dev  # http://localhost:4321
```

## Structure

```
notebooks/
  etl/           # data loading recipes (CSV, JSON, PDF, images, etc.)
  agents/        # agent patterns (RAG, dedup, routing, ingestion)
  configs/       # Qdrant configuration guides (HNSW, quantization, etc.)
src/             # Next.js web UI for browsing recipes
registry.yaml    # index of all recipes (used by CI and the web UI)
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). We want recipes for every data source, embedding model, agent pattern, and integration people use with Qdrant.

## License

MIT
