import os
from meilisearch import Client

class Database:
    NAME = os.getenv("POSTGRES_DB", "new_pafdd")
    USER = os.getenv("POSTGRES_USER", "admin")
    PASSWORD = os.getenv("POSTGRES_PASSWORD", "admin")
    HOST = os.getenv("POSTGRES_URL", "192.168.1.51")
    PORT = os.getenv("POSTGRES_PORT", "5432")

class CaseDirectory:
    PATH = "/mnt/disk"

class CeleryWorker:
    CELERY_BROKER_URL = os.getenv("CELERY_BROKER_URL","'amqp://guest:guest@pafdd-rabbitmq:5672//")


class Redis:
    HOST = os.getenv("REDIS_HOST", "192.168.1.51")
    PORT = os.getenv("REDIS_PORT", "6379")

class CRSF:
    ORIGINS = os.getenv("ORIGINS", "http://0.0.0.0:3000")

class MeiliSearch:
    MEILI_HOST = os.getenv("MEILI_HOST", "http://disweb_meilisearch:7700")
    MEILI_MASTER_KEY = os.getenv("MEILI_MASTER_KEY", "2HMCrPPjfhtm8U0aqRcJhCAe52L28n5VM5CfVzfz330")
    client = Client(MEILI_HOST, MEILI_MASTER_KEY)

class ElasticSearch:
    ELASTIC_HOST = os.getenv("ELASTIC_HOST", "http://disweb_elasticsearch:9200")
    ELASTIC_USER = os.getenv("ELASTIC")