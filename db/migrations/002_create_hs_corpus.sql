CREATE TABLE IF NOT EXISTS hs_corpus (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hs_code TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    embedding vector(768),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS hs_corpus_embedding_idx ON hs_corpus USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
