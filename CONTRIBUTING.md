# Contributing to the Qdrant ETL Cookbook

We welcome contributions. Whether it's a new data source, an agent pattern, a config recipe, or a bug fix, we want to see it.

## Adding a new recipe

1. Fork the repo and create a branch
2. Add a Jupyter notebook under the right directory:
   - `notebooks/etl/` for data loading recipes
   - `notebooks/agents/` for agent patterns
   - `notebooks/configs/` for Qdrant configuration guides
3. Follow the notebook template (see below)
4. Add an entry to `registry.yaml`
5. Open a PR

## Notebook template

Every notebook should:

- Start with a markdown cell containing the title, Colab badge, and description
- Include a `!pip install` cell with all dependencies
- Use `QdrantClient(":memory:")` so notebooks are self-contained and testable
- Generate or inline sample data (no external file dependencies)
- End with a verification step (search query, assertion, or print)

Colab badge format:
```markdown
[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/thierrypdamiba/qdrant-etl-cookbook/blob/main/notebooks/<path>.ipynb)
```

## Registry

Every recipe must have an entry in `registry.yaml`:

```yaml
- slug: my-recipe
  title: My Recipe Title
  notebook: notebooks/etl/my_recipe.ipynb
  tags: [tag1, tag2]
  requires_api_key: false
```

Set `requires_api_key: true` if the notebook needs external API keys (OpenAI, etc.). These run in a separate CI job with secrets.

## CI

All notebooks are executed in CI on every PR. Your notebook must:

- Run to completion without errors
- Complete within 5 minutes
- Not require a running Qdrant server (use `:memory:` mode)
- Not require API keys unless marked in the registry

## Code style

- Keep it simple and readable
- Add comments explaining the "why", not the "what"
- Use type hints where they help clarity
- Stick to common libraries (qdrant-client, sentence-transformers, pandas, etc.)

## What we want to see

- Data sources: Parquet, Avro, MongoDB, Elasticsearch, S3, GCS, BigQuery, Kafka, etc.
- Embedding models: Cohere, Voyage, Jina, BGE, Nomic, etc.
- Agent patterns: multi-step reasoning, tool use, memory, evaluation
- Integrations: LangChain, LlamaIndex, Haystack, DSPy, CrewAI
- Config patterns: sharding, replication, auth, monitoring
- Languages: TypeScript/JavaScript examples alongside Python

## Commit style

- Lowercase, imperative, no period: `add parquet to qdrant recipe`
- Keep PRs small and focused
