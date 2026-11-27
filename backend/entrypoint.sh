#!/bin/sh
set -e

echo "Waiting for PostgreSQL to be ready..."
# After a volume wipe, Postgres takes 10-20s to initialize. Migrating too
# early fails with "connection refused" and — without set -e — the original
# script silently continued and served an unmigrated (empty) database.
attempt=0
until python -c "
import os, sys
import psycopg
conn = psycopg.connect(
    host=os.environ.get('POSTGRES_URL', 'disweb-psql'),
    port=int(os.environ.get('POSTGRES_PORT', '5432')),
    user=os.environ.get('POSTGRES_USER', 'postgres'),
    password=os.environ.get('POSTGRES_PASSWORD', ''),
    dbname=os.environ.get('POSTGRES_DB', 'postgres'),
)
conn.close()
" 2>/dev/null; do
    attempt=$((attempt+1))
    if [ "$attempt" -ge 60 ]; then
        echo "ERROR: PostgreSQL not reachable after 60 attempts. Aborting."
        exit 1
    fi
    sleep 2
done
echo "PostgreSQL is ready (after $((attempt*2))s)."

echo "Making migrations and migrating the database."
# ONLY the backend container runs migrations. Worker and beat containers
# share this image/entrypoint and used to run makemigrations+migrate
# CONCURRENTLY with the backend — racing on file generation and creating
# duplicate PostgreSQL types (pg_type UniqueViolation) on cold starts.
if [ "$RUN_MIGRATIONS" = "false" ]; then
    echo "RUN_MIGRATIONS=false — skipping migrations (another container owns them)."
else
    python manage.py makemigrations --noinput
    python manage.py migrate --noinput
    python manage.py collectstatic --noinput
    python manage.py initadmin
    python manage.py initioc
fi
echo $@
exec "$@"
