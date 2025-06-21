import os

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