.PHONY: help dev build up down logs clean deploy

help:
	@echo "Commandes disponibles:"
	@echo "  make dev      - Démarrer en mode développement"
	@echo "  make build    - Build les images Docker"
	@echo "  make up       - Démarrer les conteneurs"
	@echo "  make down     - Arrêter les conteneurs"
	@echo "  make logs     - Voir les logs"
	@echo "  make clean    - Nettoyer les images"
	@echo "  make deploy   - Déployer en production"

dev:
	docker-compose -f docker-compose.dev.yml up

build:
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f

clean:
	docker system prune -f
	docker volume prune -f

deploy:
	git push origin main
