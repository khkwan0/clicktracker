# ClickTracker

Affiliate network app: Next.js web app, Go API, Postgres, Redis.

## Running with Docker

### Development (source mounted, hot reload)

```bash
docker compose up -d
```

- Web: http://localhost:33128 (port 3000 in container)
- API: http://localhost:33124 (port 3000 in container)
- pgAdmin: http://localhost:33125 (or 33126 for HTTPS)

Uses `docker-compose.yml`: builds from local `web/` and `api/`, mounts source and data volumes. Ensure `web/.env` and `api/.env` exist (see `.env.example` if provided).

### Production-like (no source mounts)

```bash
docker compose -f docker-compose.prod.yml up -d
```

Uses production Dockerfiles: multi-stage build, `NODE_ENV=production` for web, healthchecks. Same ports as above. Data volumes (postgres, redis, assets, logs) are still used; only application code is from the built images.

## CI/CD (GitHub Actions)

- **CI** (`.github/workflows/ci.yml`): on push/PR to `master` — lint and build web, build and vet API; optional `npm audit` for web.
- **Deploy** (`.github/workflows/deploy.yml`): after CI succeeds on `master` — SSHs to the production server, pulls latest code, and runs `docker compose -f docker-compose.prod.yml up -d --build`. No container registry; the server builds images from source.

### Secrets for deploy

In the repo **Settings → Secrets and variables → Actions**, add:

| Secret | Required | Description |
|--------|----------|-------------|
| `DEPLOY_HOST` | Yes | Production server hostname or IP |
| `DEPLOY_USER` | Yes | SSH username on the server |
| `DEPLOY_SSH_KEY` | Yes | Private key content for SSH (the full key, including `-----BEGIN ... KEY-----` lines) |
| `DEPLOY_REPO_PATH` | No | Path to the repo on the server (default: `/opt/clicktracker`) |

On the server: clone the repo (e.g. into `/opt/clicktracker`), add `web/.env` and `api/.env`, and ensure Docker and Docker Compose are installed. The deploy workflow will `git fetch` / `git reset --hard origin/master` and then run prod compose.

## Health endpoints

- **API**: `GET http://localhost:33124/health` → `{"status":"ok"}`
- **Web**: `GET http://localhost:33128/api/health` → `{"status":"ok"}`

Used by Docker healthchecks and for load balancer or orchestration probes.
