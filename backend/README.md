# OutboxLabs - Project Sharing Backend (Scaffold)

## Features included
- JWT authentication with roles: Student, Mentor, Admin
- Project CRUD with tags, versions, links
- Comments, likes, follow project
- Basic search by tags/tech stack
- GitHub integration placeholder (fetch commits/stats)
- Dockerfile + docker-compose + basic k8s manifests
- REST API (can be extended to GraphQL)

## Quick start
1. copy `.env.example` to `.env` and set `MONGO_URI` and `JWT_SECRET`
2. `npm install`
3. `npm run dev`
