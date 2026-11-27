# backend/back/meili_bulk.py
"""Bulk indexing helpers for Meilisearch.

The original tasks pushed documents ONE BY ONE
(index.add_documents([record])) — on a 500k-file disk image that means
hundreds of thousands of HTTP round-trips against Meilisearch.

This helper accumulates records in memory and flushes them in chunks
(default 1000 docs per call), reducing indexing time by orders of
magnitude while keeping memory bounded.

It also ensures the index settings (filterable/sortable attributes) are
configured before the first push: Meilisearch rejects `filter` queries
with `invalid_document_filter` unless the attribute is declared
filterable upfront.
"""
import logging
import threading

logger = logging.getLogger(__name__)

DEFAULT_CHUNK_SIZE = 1000

# Attributes the frontend and backend filter on (source separation,
# plugin name, yara rule, fs parent). KEEP IN SYNC with the filter
# expressions used in source/views.py and task/tasks.py.
FILTERABLE_ATTRIBUTES = [
    "source",
    "plugin",
    "case",
    "parent",
    "rule",
    "id",
]

# Sortable attributes: "*" makes every document field sortable, which is
# what the dynamic DataGrids need (plugin result schemas vary widely and
# users expect to sort any column). Sorting on irrelevant fields costs a
# bit of index size but keeps the UX uniform.
SORTABLE_ATTRIBUTES = ["*"]

# Per-process cache: indexes already configured during this worker lifetime.
# Avoids re-sending update_settings on every task (each call costs a Meili
# task and triggers a reindex round-trip on the engine).
_configured_indexes = set()
_config_lock = threading.Lock()


def ensure_index_settings(index):
    """Declare filterable/sortable attributes on an index (idempotent).

    Meilisearch requires attributes to be listed as filterable/sortable
    BEFORE they can be used in `filter`/`sort` query parameters. Without
    this, get_documents(filter='source = ... AND plugin = ...') fails with
    `invalid_document_filter` (HTTP 400) as soon as a plugin result is
    queried.

    Safe to call repeatedly: settings are only sent once per index per
    process (guarded by an in-memory set).
    """
    uid = index.uid
    with _config_lock:
        if uid in _configured_indexes:
            return
        try:
            index.update_filterable_attributes(FILTERABLE_ATTRIBUTES)
            index.update_sortable_attributes(SORTABLE_ATTRIBUTES)
            _configured_indexes.add(uid)
            logger.info("Meilisearch: configured index '%s' "
                        "(filterable=%s, sortable=%s)",
                        uid, FILTERABLE_ATTRIBUTES, SORTABLE_ATTRIBUTES)
        except Exception:
            # Configuration failure is logged but non-fatal: existing indexes
            # with settings already applied will keep working; a brand-new
            # index failing here will surface the error on the next query,
            # which is loud and traceable.
            logger.exception("Meilisearch: failed to configure index '%s'", uid)


def add_documents_chunked(index, documents_iterable, chunk_size=DEFAULT_CHUNK_SIZE):
    """Consume an iterable of documents and push them to Meilisearch in chunks.

    Accepts lists or generators (Dissect plugin generators can be huge).
    Ensures index settings (filterable/sortable) before pushing.
    Returns the number of documents pushed.
    """
    ensure_index_settings(index)
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
