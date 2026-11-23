from meilisearch import Client
from back.keyconfig import MeiliSearch

class MeiliSearchClient:
    client = Client(MeiliSearch.MEILI_HOST, MeiliSearch.MEILI_MASTER_KEY)
