export interface Config {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  code: string;
  language: string;
  notebook: string;
}

export const configs: Config[] = [
  {
    slug: "hnsw-tuning",
    title: "HNSW Index Tuning",
    description:
      "Configure HNSW parameters for optimal recall/speed trade-offs. Covers m, ef_construct, and on-disk settings.",
    tags: ["hnsw", "indexing", "performance"],
    language: "python",
    notebook: "notebooks/configs/hnsw_tuning.ipynb",
    code: `from qdrant_client import QdrantClient
from qdrant_client.models import (
    VectorParams,
    Distance,
    HnswConfigDiff,
    OptimizersConfigDiff,
)

client = QdrantClient(url="http://localhost:6333")

# High-recall configuration (slower indexing, better search)
client.create_collection(
    collection_name="high_recall",
    vectors_config=VectorParams(
        size=768,
        distance=Distance.COSINE,
        on_disk=True,  # store vectors on disk for large datasets
    ),
    hnsw_config=HnswConfigDiff(
        m=32,              # more connections = better recall, more memory
        ef_construct=256,  # higher = better index quality, slower build
        full_scan_threshold=10000,
        on_disk=True,
    ),
    optimizers_config=OptimizersConfigDiff(
        indexing_threshold=50000,  # delay indexing until 50k points
        memmap_threshold=100000,
    ),
)

# Fast configuration (lower recall, faster search)
client.create_collection(
    collection_name="fast_search",
    vectors_config=VectorParams(
        size=384,
        distance=Distance.COSINE,
    ),
    hnsw_config=HnswConfigDiff(
        m=16,
        ef_construct=100,
    ),
)

# Update HNSW config on existing collection
client.update_collection(
    collection_name="fast_search",
    hnsw_config=HnswConfigDiff(
        ef_construct=200,  # rebuild index with higher quality
    ),
)`,
  },
  {
    slug: "payload-indexes",
    title: "Payload Indexes",
    description:
      "Set up payload indexes for fast filtering. Covers keyword, integer, float, geo, and datetime indexes.",
    tags: ["payload", "filtering", "indexes"],
    language: "python",
    notebook: "notebooks/configs/payload_indexes.ipynb",
    code: `from qdrant_client import QdrantClient
from qdrant_client.models import PayloadSchemaType

client = QdrantClient(url="http://localhost:6333")

# Keyword index: for exact match filtering
client.create_payload_index(
    collection_name="products",
    field_name="category",
    field_schema=PayloadSchemaType.KEYWORD,
)

# Integer index: for range filtering
client.create_payload_index(
    collection_name="products",
    field_name="price",
    field_schema=PayloadSchemaType.INTEGER,
)

# Full-text index: for text search within payloads
client.create_payload_index(
    collection_name="products",
    field_name="description",
    field_schema=PayloadSchemaType.TEXT,
)

# Geo index: for location-based filtering
client.create_payload_index(
    collection_name="stores",
    field_name="location",
    field_schema=PayloadSchemaType.GEO,
)

# Now you can filter efficiently
from qdrant_client.models import Filter, FieldCondition, MatchValue, Range

results = client.query_points(
    collection_name="products",
    query=[0.1] * 384,
    query_filter=Filter(
        must=[
            FieldCondition(key="category", match=MatchValue(value="electronics")),
            FieldCondition(key="price", range=Range(gte=10, lte=100)),
        ]
    ),
    limit=10,
)`,
  },
  {
    slug: "quantization",
    title: "Quantization Settings",
    description:
      "Reduce memory usage with scalar, binary, and product quantization. Trade-offs between memory, speed, and accuracy.",
    tags: ["quantization", "memory", "optimization"],
    language: "python",
    notebook: "notebooks/configs/quantization.ipynb",
    code: `from qdrant_client import QdrantClient
from qdrant_client.models import (
    VectorParams,
    Distance,
    ScalarQuantization,
    ScalarQuantizationConfig,
    ScalarType,
    BinaryQuantization,
    BinaryQuantizationConfig,
    ProductQuantization,
    ProductQuantizationConfig,
    CompressionRatio,
    SearchParams,
    QuantizationSearchParams,
)

client = QdrantClient(url="http://localhost:6333")

# Scalar quantization: 4x memory reduction, minimal accuracy loss
client.create_collection(
    collection_name="scalar_quantized",
    vectors_config=VectorParams(size=768, distance=Distance.COSINE),
    quantization_config=ScalarQuantization(
        scalar=ScalarQuantizationConfig(
            type=ScalarType.INT8,
            quantile=0.99,       # clip outliers
            always_ram=True,     # keep quantized vectors in RAM
        ),
    ),
)

# Binary quantization: 32x memory reduction, works best with high-dim vectors
client.create_collection(
    collection_name="binary_quantized",
    vectors_config=VectorParams(size=1536, distance=Distance.COSINE),
    quantization_config=BinaryQuantization(
        binary=BinaryQuantizationConfig(
            always_ram=True,
        ),
    ),
)

# Product quantization: configurable compression ratio
client.create_collection(
    collection_name="product_quantized",
    vectors_config=VectorParams(size=768, distance=Distance.COSINE),
    quantization_config=ProductQuantization(
        product=ProductQuantizationConfig(
            compression=CompressionRatio.X16,
            always_ram=True,
        ),
    ),
)

# Search with quantization oversampling for better accuracy
results = client.query_points(
    collection_name="scalar_quantized",
    query=[0.1] * 768,
    search_params=SearchParams(
        quantization=QuantizationSearchParams(
            ignore=False,
            rescore=True,
            oversampling=2.0,  # fetch 2x candidates, rescore with full vectors
        ),
    ),
    limit=10,
)`,
  },
  {
    slug: "multi-tenancy",
    title: "Multi-Tenancy Setup",
    description:
      "Configure Qdrant for multi-tenant applications using payload-based tenant isolation.",
    tags: ["multi-tenant", "isolation", "production"],
    language: "python",
    notebook: "",
    code: `from qdrant_client import QdrantClient
from qdrant_client.models import (
    VectorParams,
    Distance,
    PayloadSchemaType,
    Filter,
    FieldCondition,
    MatchValue,
    PointStruct,
)

client = QdrantClient(url="http://localhost:6333")

# Create collection with tenant_id payload index
client.create_collection(
    collection_name="multi_tenant",
    vectors_config=VectorParams(size=384, distance=Distance.COSINE),
)

# Index the tenant field for fast filtering
client.create_payload_index(
    collection_name="multi_tenant",
    field_name="tenant_id",
    field_schema=PayloadSchemaType.KEYWORD,
)

# Upsert data with tenant isolation
def upsert_for_tenant(tenant_id: str, points: list[dict]):
    qdrant_points = [
        PointStruct(
            id=p["id"],
            vector=p["vector"],
            payload={**p["payload"], "tenant_id": tenant_id},
        )
        for p in points
    ]
    client.upsert(collection_name="multi_tenant", points=qdrant_points)

# Search scoped to a single tenant
def search_for_tenant(tenant_id: str, query_vector: list[float], limit: int = 10):
    return client.query_points(
        collection_name="multi_tenant",
        query=query_vector,
        query_filter=Filter(
            must=[
                FieldCondition(
                    key="tenant_id",
                    match=MatchValue(value=tenant_id),
                )
            ]
        ),
        limit=limit,
    )

# Each tenant only sees their own data
results = search_for_tenant("tenant_abc", query_vector=[0.1] * 384)`,
  },
  {
    slug: "snapshot-backup",
    title: "Snapshots and Backups",
    description:
      "Create and restore collection snapshots. Set up automated backup schedules for production.",
    tags: ["snapshots", "backup", "disaster-recovery"],
    language: "python",
    notebook: "",
    code: `from qdrant_client import QdrantClient
import os
from datetime import datetime

client = QdrantClient(url="http://localhost:6333")

# Create a snapshot of a collection
snapshot_info = client.create_snapshot(collection_name="my_collection")
print(f"Snapshot created: {snapshot_info.name}")

# List all snapshots
snapshots = client.list_snapshots(collection_name="my_collection")
for snap in snapshots:
    print(f"  {snap.name} | size: {snap.size} | created: {snap.creation_time}")

# Download a snapshot via REST API
import requests

snapshot_url = f"http://localhost:6333/collections/my_collection/snapshots/{snapshot_info.name}"
response = requests.get(snapshot_url, stream=True)
os.makedirs("./backups", exist_ok=True)
backup_path = f"./backups/{snapshot_info.name}"
with open(backup_path, "wb") as f:
    for chunk in response.iter_content(chunk_size=8192):
        f.write(chunk)
print(f"Downloaded to: {backup_path}")

# Restore from snapshot (upload via REST API)
client.recover_snapshot(
    collection_name="my_collection",
    location=f"file:///path/to/backups/{snapshot_info.name}",
)

# Full storage snapshot (all collections)
full_snapshot = client.create_full_snapshot()
print(f"Full snapshot: {full_snapshot.name}")

# Delete old snapshots
client.delete_snapshot(
    collection_name="my_collection",
    snapshot_name=snapshot_info.name,
)`,
  },
  {
    slug: "docker-compose-production",
    title: "Docker Compose for Production",
    description:
      "Production-ready Docker Compose configuration with clustering, TLS, and persistent storage.",
    tags: ["docker", "production", "clustering"],
    language: "yaml",
    notebook: "",
    code: `version: "3.8"

services:
  qdrant:
    image: qdrant/qdrant:latest
    restart: always
    ports:
      - "6333:6333"  # REST API
      - "6334:6334"  # gRPC
    volumes:
      - qdrant_data:/qdrant/storage
      - ./config/config.yaml:/qdrant/config/production.yaml
    environment:
      - QDRANT__SERVICE__GRPC_PORT=6334
      - QDRANT__SERVICE__ENABLE_TLS=false
      - QDRANT__STORAGE__PERFORMANCE__MAX_SEARCH_THREADS=0
      - QDRANT__STORAGE__OPTIMIZERS__DELETED_THRESHOLD=0.2
      - QDRANT__STORAGE__OPTIMIZERS__VACUUM_MIN_VECTOR_NUMBER=1000
      # API key authentication
      - QDRANT__SERVICE__API_KEY=\${QDRANT_API_KEY}
    deploy:
      resources:
        limits:
          memory: 8G
        reservations:
          memory: 4G
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:6333/readyz"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  qdrant_data:
    driver: local`,
  },
];
