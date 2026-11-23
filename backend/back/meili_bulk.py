# backend/back/meili_bulk.py
"""Bulk indexing helpers for Meilisearch.

The original tasks pushed documents ONE BY ONE
(index.add_documents([record])) — on a 500k-file disk image that means
hundreds of thousands of HTTP round-trips against Meilisearch.

This helper accumulates records in memory and flushes them in chunks
(default 1000 docs per call), reducing indexing time by orders of
magnitude while keeping memory bounded.
"""
import logging

logger = logging.getLogger(__name__)

DEFAULT_CHUNK_SIZE = 1000


def add_documents_chunked(index, documents_iterable, chunk_size=DEFAULT_CHUNK_SIZE):
    """Consume an iterable of documents and push them to Meilisearch in chunks.

    Accepts lists or generators (Dissect plugin generators can be huge).
    Returns the number of documents pushed.
    """
    pushed = 0
    chunk = []
    for doc in documents_iterable:
        chunk.append(doc)
        if len(chunk) >= chunk_size:
            _push(index, chunk)
            pushed += len(chunk)
            chunk = []
    if chunk:
        _push(index, chunk)
        pushed += len(chunk)
    return pushed


def _push(index, chunk):
    try:
        index.add_documents(chunk, primary_key="id")
    except Exception:
        # Do not kill the whole task for one failed batch: log it and let
        # Celery decide (the task itself continues with remaining chunks).
        # For forensic traceability the error is logged with its content size,
        # not the full payload (could contain sensitive evidence).
        logger.exception("Meilisearch: failed to push batch of %d documents", len(chunk))
        raise
