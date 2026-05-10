.PHONY: setup dev build seed test test-backend test-frontend clean reset

setup:
	cp -n .env.example .env 2>/dev/null || true
	cp -n backend/.env.example backend/.env 2>/dev/null || true
	cp -n frontend/.env.example frontend/.env 2>/dev/null || true
	cd backend && npm install
	cd frontend && npm install

dev:
	docker compose up postgres -d
	cd backend && npm run dev &
	cd frontend && npm run dev

build:
	docker compose build

seed:
	cd backend && npm run db:seed

test: test-backend test-frontend

test-backend:
	cd backend && npm test

test-frontend:
	cd frontend && npm test

clean:
	docker compose down
	rm -rf backend/dist
	rm -rf frontend/dist

reset:
	docker compose down -v
	docker compose up postgres -d
	cd backend && npm run db:reset && npm run db:seed
