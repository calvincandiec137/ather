# Ather: The Council

A premium multi-agent decision support interface that visualizes complex AI debates, verdicts, and summaries in real-time.

---

## Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Requirements](#requirements)
- [Setup](#setup)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API / Interfaces](#api--interfaces)
- [Data & Storage](#data--storage)
- [Security Considerations](#security-considerations)
- [Testing](#testing)
- [Deployment](#deployment)
- [Monitoring & Logging](#monitoring--logging)
- [Limitations](#limitations)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Overview
Current AI interfaces often present a single, opaque viewpoint. **The Council** addresses this by orchestrating multiple AI agents (Pro, Con, Judge) to debate a query, providing users with a comprehensive breakdown of the reasoning process before delivering a final verdict. This project serves as the visual frontend for the underlying multi-model debate engine.

It explicitly does **not** handle the LLM inference locally; it delegates complex reasoning to the external TSDC / Godfather API service.

---

## Architecture
The system follows a standard Single Page Application (SPA) architecture with a proxy layer for API communication.

```mermaid
Client (React/Vite) → Vite Proxy (Dev) / Edge Middleware (Prod) → External AI Service (TSDC)
```

**Key Components:**
- **CouncilDashboard**: The central orchestrator managing agent states (`idle`, `processing`, `complete`).
- **Agent System**: Visual representation of the debate participants using `AgentCard` and `AgentIcon`.
- **API Integration**: Centralized service layer (`src/lib/api.ts`) managing communication with the classification and summarization endpoints.

The frontend is **stateless**; it relies on the browser session and immediate API responses. All complex logic (debate, summarization) is asynchronous.

---

## Features
- **Multi-Agent Visualization**: Real-time visual feedback for agent activities (Pro, Con, Judge) with dynamic status indicators (blinking/glowing states).
- **Debate & Verdict Rendering**: Clean, markdown-supported display of the debate transcript and final verdict.
- **Auto-Summarization**: Integrated TL;DR generation for quick insight consumption.
- **Responsive Design**: Mobile-first layout with a custom "Tropical Lagoon" and dark-themed aesthetic.
- **Resilient State Management**: Optimized data fetching and state synchronization using TanStack Query.

---

## Tech Stack
**Frontend:**  
- React 18 + TypeScript
- Vite (Build Tool)
- Tailwind CSS (Styling)
- Shadcn UI + Radix Primitives (Component Library)
- Framer Motion (Animations)
- TanStack Query (State Management)
- Lucide React (Icons)

**Infra:**  
- Vercel (Deployment)
- Bun (Package Manager - recommended)

**External APIs:**  
- TSDC Classification Service (Custom AI Endpoint)

---

## Requirements
- **OS**: Windows, macOS, or Linux
- **Runtime**: Node.js v18+ OR Bun v1.0+
- **Hardware**: Basic consumer hardware (Frontend is lightweight)

---

## Setup
```bash
git clone <repo_url>
cd front
npm install
# OR if using Bun
bun install
```

---

## Configuration

Configuration is primarily handled via environment variables and the `vite.config.ts` proxy setup.

**Environment Variables (`.env`)**:
```env
# Currently primarily uses Vite Proxy, but prepare for:
VITE_API_URL=http://164.52.211.24
```

**Proxy Configuration (`vite.config.ts`)**:
The application proxies `/tsdc` requests to the external AI service to avoid CORS issues during development.

---

## Running the Application

### Development

```bash
# Using npm
npm run dev

# Using Bun
bun dev
```

Server will start at `http://localhost:8080`.

### Production

```bash
npm run build
npm run preview
```

---

## API / Interfaces

### Endpoints

| Method | Path | Description |
| ------ | ---- | ----------- |
| POST | `/tsdc/classify` | Triggers the main debate/classification process. Accepts `query` and `history`. |
| POST | `/tsdc/tldr` | Generates a concise summary of the debate verdict. |

---

## Data & Storage

- **Local State**: The application uses React State and TanStack Query for session-level data.
- **Persistence**: No local persistence (LocalStorage/IndexedDB) is currently implemented; refreshing the page resets the council session.
- **Data Model**:
  - `ProcessRequest`: Main query payload.
  - `ProcessResponse`: Contains the verdict, transcript, and agent details.

---

## Security Considerations

- **API Security**: The current development setup uses a direct IP proxy. For production, ensure the upstream API is secured behind an API Gateway or proper authentication headers.
- **Input Sanitization**: User inputs are passed directly to the AI service; relying on the backend implementation for robust prompt injection defenses.
- **Secrets**: No secrets are stored in the frontend codebase.

---

## Testing

**Unit / Component Tests**
Uses Vitest and React Testing Library.

```bash
npm run test
```

Expect coverage for core utility functions (`api.ts`) and main UI components (`AgentCard`).

---

## Deployment

**Platform**: Vercel (Optimized for Vite/React).

**Build**:
```bash
npm run build
```

**Strategy**:
- deploy on push to `main`.
- SPA routing must be handled (all routes redirect to `index.html`) - `vercel.json` is included to handle this.

---

## Monitoring & Logging

- **Console Logs**: Used for development debugging (API errors, state transitions).
- **Production**: Recommended to integrate Vercel Analytics or Sentry for runtime error tracking.

---

## Limitations

- **Session Persistence**: Chat history is lost on refresh.
- **Mobile Layout**: Complex debate views are optimized for desktop/tablet; mobile view is functional but condensed.
- **API Dependency**: The application is unusable without the backend TSDC service being online.

---

## Roadmap

- [ ] Implement persistent chat history (LocalStorage/DB).
- [ ] Add user authentication (Auth0/Supabase).
- [ ] Visualizer for intermediate "thought" steps from agents.
- [ ] Export debate transcripts to PDF/Markdown.

---

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/agent-animations`).
3. Commit changes following the conventional commits standard.
4. Push to the branch and open a Pull Request.

**Code Style**:
- Adhere to the `eslint.config.js` rules.
- Run `npm run lint` before committing.

---

## License

MIT License.
