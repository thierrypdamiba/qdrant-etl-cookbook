export interface Recipe {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  category: string;
  code: string;
  notebook: string;
}

export const etlRecipes: Recipe[] = [
  {
    slug: "csv-to-qdrant",
    title: "Load CSV into Qdrant",
    description:
      "Read a CSV file, generate embeddings with sentence-transformers, and upsert into a Qdrant collection with batching.",
    tags: ["csv", "pandas", "sentence-transformers"],
    category: "Data Loading",
    notebook: "notebooks/etl/csv_to_qdrant.ipynb",
    code: `import pandas as pd
from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct, VectorParams, Distance
from sentence_transformers import SentenceTransformer

client = QdrantClient(url="http://localhost:6333")
model = SentenceTransformer("all-MiniLM-L6-v2")

df = pd.read_csv("data.csv")

client.create_collection(
    collection_name="my_collection",
    vectors_config=VectorParams(size=384, distance=Distance.COSINE),
)

batch_size = 100
for i in range(0, len(df), batch_size):
    batch = df.iloc[i : i + batch_size]
    texts = batch["text"].tolist()
    embeddings = model.encode(texts).tolist()

    points = [
        PointStruct(
            id=idx + i,
            vector=emb,
            payload=row.to_dict(),
        )
        for idx, (emb, (_, row)) in enumerate(
            zip(embeddings, batch.iterrows())
        )
    ]
    client.upsert(collection_name="my_collection", points=points)

print(f"Loaded {len(df)} records into Qdrant")`,
  },
  {
    slug: "json-to-qdrant",
    title: "Load JSON / JSONL into Qdrant",
    description:
      "Stream JSON lines into Qdrant with payload filtering support. Handles nested objects and large files.",
    tags: ["json", "jsonl", "streaming"],
    category: "Data Loading",
    notebook: "notebooks/etl/json_to_qdrant.ipynb",
    code: `import json
from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct, VectorParams, Distance
from sentence_transformers import SentenceTransformer

client = QdrantClient(url="http://localhost:6333")
model = SentenceTransformer("all-MiniLM-L6-v2")

client.create_collection(
    collection_name="json_collection",
    vectors_config=VectorParams(size=384, distance=Distance.COSINE),
)

points = []
with open("data.jsonl") as f:
    for idx, line in enumerate(f):
        record = json.loads(line)
        embedding = model.encode(record["text"]).tolist()
        points.append(
            PointStruct(id=idx, vector=embedding, payload=record)
        )

        if len(points) >= 100:
            client.upsert(collection_name="json_collection", points=points)
            points = []

if points:
    client.upsert(collection_name="json_collection", points=points)`,
  },
  {
    slug: "pdf-to-qdrant",
    title: "Extract PDF text and load into Qdrant",
    description:
      "Parse PDFs with PyMuPDF, chunk text with overlap, embed, and store in Qdrant for RAG pipelines.",
    tags: ["pdf", "chunking", "rag"],
    category: "Data Loading",
    notebook: "notebooks/etl/pdf_to_qdrant.ipynb",
    code: `import fitz  # PyMuPDF
from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct, VectorParams, Distance
from sentence_transformers import SentenceTransformer

client = QdrantClient(url="http://localhost:6333")
model = SentenceTransformer("all-MiniLM-L6-v2")

client.create_collection(
    collection_name="pdf_collection",
    vectors_config=VectorParams(size=384, distance=Distance.COSINE),
)

def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50):
    chunks = []
    for i in range(0, len(text), chunk_size - overlap):
        chunks.append(text[i : i + chunk_size])
    return chunks

doc = fitz.open("document.pdf")
points = []
point_id = 0

for page_num, page in enumerate(doc):
    text = page.get_text()
    chunks = chunk_text(text)

    for chunk in chunks:
        embedding = model.encode(chunk).tolist()
        points.append(
            PointStruct(
                id=point_id,
                vector=embedding,
                payload={"text": chunk, "page": page_num, "source": "document.pdf"},
            )
        )
        point_id += 1

client.upsert(collection_name="pdf_collection", points=points)
print(f"Loaded {point_id} chunks from PDF")`,
  },
  {
    slug: "images-clip-to-qdrant",
    title: "Image embeddings with CLIP",
    description:
      "Generate image embeddings using OpenAI CLIP and store them in Qdrant for visual similarity search.",
    tags: ["images", "clip", "multimodal"],
    category: "Embeddings",
    notebook: "notebooks/etl/images_clip_to_qdrant.ipynb",
    code: `import os
from PIL import Image
from transformers import CLIPModel, CLIPProcessor
from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct, VectorParams, Distance

client = QdrantClient(url="http://localhost:6333")
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

client.create_collection(
    collection_name="images",
    vectors_config=VectorParams(size=512, distance=Distance.COSINE),
)

image_dir = "images/"
points = []

for idx, filename in enumerate(os.listdir(image_dir)):
    if not filename.endswith((".jpg", ".png", ".jpeg")):
        continue
    image = Image.open(os.path.join(image_dir, filename))
    inputs = processor(images=image, return_tensors="pt")
    embedding = model.get_image_features(**inputs).detach().numpy()[0].tolist()

    points.append(
        PointStruct(
            id=idx,
            vector=embedding,
            payload={"filename": filename, "path": os.path.join(image_dir, filename)},
        )
    )

client.upsert(collection_name="images", points=points)
print(f"Indexed {len(points)} images")`,
  },
  {
    slug: "web-scrape-to-qdrant",
    title: "Web scraping to Qdrant",
    description:
      "Scrape web pages with BeautifulSoup, clean and chunk HTML content, then load into Qdrant.",
    tags: ["scraping", "beautifulsoup", "html"],
    category: "Data Loading",
    notebook: "notebooks/etl/web_scrape_to_qdrant.ipynb",
    code: `import requests
from bs4 import BeautifulSoup
from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct, VectorParams, Distance
from sentence_transformers import SentenceTransformer

client = QdrantClient(url="http://localhost:6333")
model = SentenceTransformer("all-MiniLM-L6-v2")

client.create_collection(
    collection_name="web_pages",
    vectors_config=VectorParams(size=384, distance=Distance.COSINE),
)

urls = [
    "https://qdrant.tech/documentation/",
]

points = []
for idx, url in enumerate(urls):
    resp = requests.get(url)
    soup = BeautifulSoup(resp.text, "html.parser")

    for tag in soup(["script", "style", "nav", "footer"]):
        tag.decompose()

    text = soup.get_text(separator=" ", strip=True)
    embedding = model.encode(text[:2000]).tolist()

    points.append(
        PointStruct(
            id=idx,
            vector=embedding,
            payload={"url": url, "text": text[:2000], "title": soup.title.string if soup.title else ""},
        )
    )

client.upsert(collection_name="web_pages", points=points)`,
  },
  {
    slug: "postgres-to-qdrant",
    title: "PostgreSQL to Qdrant",
    description:
      "Extract records from PostgreSQL, embed text columns, and sync into Qdrant with incremental updates.",
    tags: ["postgres", "sql", "incremental"],
    category: "Data Loading",
    notebook: "notebooks/etl/postgres_to_qdrant.ipynb",
    code: `import psycopg2
from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct, VectorParams, Distance
from sentence_transformers import SentenceTransformer

client = QdrantClient(url="http://localhost:6333")
model = SentenceTransformer("all-MiniLM-L6-v2")

client.create_collection(
    collection_name="pg_data",
    vectors_config=VectorParams(size=384, distance=Distance.COSINE),
)

conn = psycopg2.connect(
    host="localhost", dbname="mydb", user="user", password="pass"
)
cursor = conn.cursor()
cursor.execute("SELECT id, title, description FROM products WHERE updated_at > %s", ("2024-01-01",))

points = []
for row in cursor.fetchall():
    record_id, title, description = row
    text = f"{title} {description}"
    embedding = model.encode(text).tolist()
    points.append(
        PointStruct(
            id=record_id,
            vector=embedding,
            payload={"title": title, "description": description},
        )
    )

    if len(points) >= 100:
        client.upsert(collection_name="pg_data", points=points)
        points = []

if points:
    client.upsert(collection_name="pg_data", points=points)

conn.close()`,
  },
  {
    slug: "fastembed-to-qdrant",
    title: "FastEmbed with Qdrant",
    description:
      "Use Qdrant's built-in FastEmbed for lightweight, fast embedding generation without external dependencies.",
    tags: ["fastembed", "lightweight", "built-in"],
    category: "Embeddings",
    notebook: "notebooks/etl/fastembed_to_qdrant.ipynb",
    code: `from qdrant_client import QdrantClient

client = QdrantClient(url="http://localhost:6333")

# Qdrant client has built-in FastEmbed support
# No need for separate embedding model setup

documents = [
    "Qdrant is a vector similarity search engine",
    "It provides a production-ready service with a convenient API",
    "Qdrant supports filtering, payload indexing, and more",
]

# add() handles embedding + upserting automatically
client.add(
    collection_name="fastembed_demo",
    documents=documents,
    metadata=[
        {"source": "docs", "topic": "overview"},
        {"source": "docs", "topic": "api"},
        {"source": "docs", "topic": "features"},
    ],
)

# query() handles embedding the query too
results = client.query(
    collection_name="fastembed_demo",
    query_text="How does Qdrant handle search?",
    limit=3,
)

for r in results:
    print(f"Score: {r.score:.4f} | {r.document}")`,
  },
  {
    slug: "sparse-vectors-bm25",
    title: "Sparse vectors with BM25",
    description:
      "Implement hybrid search using sparse BM25 vectors alongside dense embeddings in Qdrant.",
    tags: ["sparse", "bm25", "hybrid-search"],
    category: "Advanced",
    notebook: "notebooks/etl/sparse_vectors_bm25.ipynb",
    code: `from qdrant_client import QdrantClient, models

client = QdrantClient(url="http://localhost:6333")

client.create_collection(
    collection_name="hybrid_collection",
    vectors_config={
        "dense": models.VectorParams(size=384, distance=models.Distance.COSINE),
    },
    sparse_vectors_config={
        "bm25": models.SparseVectorParams(
            modifier=models.Modifier.IDF,
        ),
    },
)

# Qdrant can compute sparse vectors server-side with built-in tokenizer
# Or you can provide your own sparse vectors

documents = [
    "Qdrant is a vector database for similarity search",
    "It supports both dense and sparse vectors",
    "Hybrid search combines keyword and semantic matching",
]

# Using client-side sparse vector generation
from collections import Counter
import math

def simple_bm25_sparse(text: str):
    tokens = text.lower().split()
    tf = Counter(tokens)
    indices = [hash(t) % 30000 for t in tf]
    values = [float(c) for c in tf.values()]
    return models.SparseVector(indices=indices, values=values)

from sentence_transformers import SentenceTransformer
dense_model = SentenceTransformer("all-MiniLM-L6-v2")

points = []
for idx, doc in enumerate(documents):
    dense_vec = dense_model.encode(doc).tolist()
    sparse_vec = simple_bm25_sparse(doc)

    points.append(
        models.PointStruct(
            id=idx,
            vector={
                "dense": dense_vec,
                "bm25": sparse_vec,
            },
            payload={"text": doc},
        )
    )

client.upsert(collection_name="hybrid_collection", points=points)`,
  },
];
