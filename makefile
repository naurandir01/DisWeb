THIS_FILE := $(lastword $(MAKEFILE_LIST))
.PHONY: all
all : build down up

.PHONY: build
build:
	docker compose -f docker-compose.yml build

.PHONY: up
up:
	docker compose -f docker-compose.yml up -d

.PHONY: save
save:
	@docker compose images -q | xargs -r docker save -o pafdd.tar

.PHONY: release
release:
	7z a pafdd.7z docker-compose.yml pafdd_build.tar .env ./front/nginx.conf makefile

.PHONY: down
down:
	docker compose -f docker-compose.yml down

.PHONY: help
help:
	@echo "Available commands:"
	@echo "  all         - Build and start the project"
	@echo "  build       - Build the project"
	@echo "  up          - Start the project"
	@echo "  save        - Save the project"
	@echo "  release     - Release the project"
	@echo "  down        - Stop the project"
	@echo "  help        - Show this help message"

