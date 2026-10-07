# Agent notes

- Dev stack: `docker compose -f docker-compose.base44.yml up -d`. The repo's own `docker-compose.yml` builds images and maps 8080/8081; the Base44 file runs every service from bind-mounted source instead.
- Ports: **vote** (Flask, debug reloader) on host 3000 = preview; **result** (Node + socket.io, nodemon `-L`) on host 8081, publicly at `https://8081-$BASE44_PUBLIC_HOST_SUFFIX`.
- **worker** (.NET 7) runs `dotnet watch run` with polling; `bin/`, `obj/` and the NuGet cache are Docker volumes so build output never lands in the repo. First start takes ~30–60s (restore + compile).
- Hostnames `redis` and `db` and the `postgres/postgres` credentials are hardcoded in the vote, result and worker code — keep the compose service names.
- The `votes` table is created by the worker on connect, so `result` depends on `worker` being healthy (otherwise it logs "relation votes does not exist" on a fresh DB).
- Verify end to end: `curl -X POST -d vote=a localhost:3000/` then `docker compose -f docker-compose.base44.yml exec -T db psql -U postgres -tAc "select vote,count(*) from votes group by vote"`.
- Vote values are `a` (Cats), `b` (Dogs), and `c` (Neither). The worker stores these without a schema change; results broadcast all three counts. Result percentages include all three votes and sum to 100 when votes exist (all zero when empty).
- Flask reloads Python but template/CSS changes need a browser refresh; the results server uses nodemon and serves files directly from `result/views`.
- Optional seed data: `seed-data/` (upstream compose `seed` profile); not wired into the Base44 compose.
