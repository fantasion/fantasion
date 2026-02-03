---
name: run-fantasion-servers
description: Use when starting the Fantasion app for development or testing - ensures clean startup of both backend and frontend
---

# Run Fantasion Servers

Start and verify both backend (Django) and frontend (Next.js) servers are ready for development or testing.

## Quick Start

```bash
# Start both servers
pnpm run backend &
pnpm run web &

# Wait for both to be ready
curl -s http://localhost:8000/api/v1 > /dev/null && echo "Backend ready"
curl -s http://localhost:3000 > /dev/null && echo "Frontend ready"
```

## Full Startup with Cleanup

**Always clean up old processes first:**

```bash
# Kill any lingering servers
pkill -f "python.*manage.py" || true
pkill -f "next dev" || true
sleep 2

# Remove lock files that block startup
rm -f packages/fantasion-web/.next/dev/lock

# Start fresh
pnpm run backend > /tmp/backend.log 2>&1 &
pnpm run web > /tmp/frontend.log 2>&1 &

# Wait for both to respond
for i in {1..30}; do
  if curl -s http://localhost:8000/api/v1 > /dev/null 2>&1 && \
     curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Both servers ready!"
    break
  fi
  sleep 1
done
```

## Port Reference

- **Frontend**: http://localhost:3000 (Next.js dev server)
- **Backend**: http://localhost:8000 (Django API)
- **API Endpoint**: http://localhost:8000/api/v1

## After Design Changes (SCSS/CSS)

When you modify SCSS files in components or update theme variables, you don't need to restart the server. Instead:

```bash
# Rebuild the UI library to update exported variables
pnpm --filter @fantasion/ui build

# The dev server will automatically hot-reload styles
```

Next.js dev server will automatically detect changes and hot-reload SCSS.

## Server Status

Check if servers are running:

```bash
curl -s http://localhost:3000 > /dev/null && echo "Frontend: ✅" || echo "Frontend: ❌"
curl -s http://localhost:8000/api/v1 > /dev/null && echo "Backend: ✅" || echo "Backend: ❌"
```

## Common Issues

| Problem | Solution |
|---------|----------|
| "Address already in use" | Kill old process: `pkill -f "python\|next"` |
| Frontend on port 3001 instead of 3000 | Remove lock file: `rm -f packages/fantasion-web/.next/dev/lock` |
| Server starts but pages 500 error | Check logs: `tail -30 /tmp/frontend.log` |
| Backend won't start | Check if port 8000 is free: `lsof -i :8000` |

## Stopping Servers

```bash
# Kill both
pkill -f "python.*manage.py" || true
pkill -f "next dev" || true

# Verify stopped
ps aux | grep -E "python|next" | grep -v grep | wc -l
# Should output: 0
```

## Environment

Uses `.env` configuration for:
- `API_URL` (frontend uses to call backend)
- `DEBUG` (Django debug mode)
- Database connection (backend)

See `packages/fantasion-backend/` and `packages/fantasion-web/` for `.env.example` files.

## Package Manager

**CRITICAL:** This project uses `pnpm`, not `npm`. Always use:
- `pnpm run backend` ← NOT npm run backend
- `pnpm run web` ← NOT npm run web
- `pnpm add` ← NOT npm install
