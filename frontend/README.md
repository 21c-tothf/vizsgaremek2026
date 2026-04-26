# EgyszerűAutó Frontend

React + Vite + TypeScript frontend prepared to integrate with the existing Spring Boot backend.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create environment file:

```bash
copy .env.example .env
```

3. Start dev server:

```bash
npm run dev
```

## Environment variables

- `VITE_API_BASE_URL`: Base URL of the backend REST API.

## Suggested API integration flow

1. Keep all HTTP logic in `src/api/`.
2. Expand `src/api/endpoints.ts` with backend routes.
3. Use `AuthContext` for token lifecycle.
4. Fetch listing data in pages with services/hooks.