# Uthai Nexus

**Your AI-powered personal command center.**

Uthai Nexus is a personal life-management dashboard built to bring health, finance, learning, career, projects, habits, and planning into one place.

Version 1 focuses on a polished, responsive frontend with typed mock data and session-based interactions. It is designed as the foundation for future Supabase persistence, spreadsheet imports, n8n workflows, MCP tools, and AI agents.

---

## Version

**Current release:** `v1.0.0`  
**Status:** Phase 1 ready

---

## Features

### Overview
- Daily priorities
- Life score
- Financial summary
- Health summary
- Learning progress
- Career activity
- Project status
- Alerts and recent activity

### Finance
- INR formatting with Indian number grouping
- Transactions and category tracking
- Monthly income and expense summaries
- Budget tracking
- Debt overview
- Paid versus remaining debt
- Home contribution tracking
- Savings allocation tracking
- India-based accounts, bills, and merchants

### Health
- Daily check-ins
- Weight tracking
- Calories and protein
- Steps, sleep, and water
- Workouts
- Mood, focus, and energy
- Supplements
- Skincare
- Smoking status
- Habit consistency

### Learning
- Python
- DSA
- React
- AI and machine learning
- AWS and cloud
- System design
- Study plans
- Problem attempts
- Independent solves
- Confidence and revision tracking

### Career
- Job application pipeline
- Application stages
- Recruiter follow-ups
- Interview tracking
- Resume versions
- Notes and priority status

### Projects
- Project cards
- Milestones
- Tasks
- Blockers
- Progress
- Activity timeline
- Notes and decisions

### Additional UI
- Responsive desktop, tablet, and mobile layouts
- Collapsible sidebar
- Command palette
- Quick-add workflows
- Animated transitions
- Loading, empty, and error states
- Accessible form controls and keyboard navigation

---

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Router
- Zustand
- React Hook Form
- Zod
- Framer Motion
- Recharts
- Lucide React
- date-fns
- ESLint
- Prettier

---

## Project Structure

```text
src/
  app/
    App.tsx
    router.tsx
    providers.tsx

  components/
    common/
    layout/
    navigation/
    charts/
    forms/
    feedback/
    ui/

  features/
    overview/
    finance/
    health/
    learning/
    career/
    projects/
    calendar/
    insights/
    settings/

  data/
    mock/

  hooks/
  lib/
  services/
  store/
  styles/
  types/
  utils/
```

The codebase uses a feature-oriented structure so each domain can later connect to its own API, Supabase service, MCP server, or agent workflow.

---

## Getting Started

### Requirements

- Node.js 18 or later
- npm 9 or later

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Open the local URL shown by Vite, usually:

```text
http://localhost:5173
```

### Production build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

---

## Available Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run typecheck
npm run format
npm run format:check
```

For CI/CD, use:

```bash
npm ci
npm run typecheck
npm run lint
npm run build
```

---

## Data Model

Version 1 uses typed mock data and local/session state.

Important domains include:

- Finance
- Debt
- Savings
- Home contributions
- Health logs
- Daily check-ins
- Learning progress
- Job applications
- Projects
- Calendar events
- Notifications
- Insights

The frontend is structured so mock services can later be replaced by Supabase or API-backed services without rewriting the UI.

---

## Currency

Finance values use:

```ts
new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
})
```

All finance-related screens should use shared formatting utilities instead of hardcoded currency symbols.

---

## Version 1 Limitations

Version 1 does not yet include:

- User authentication
- Supabase database persistence
- Real spreadsheet import
- Automatic bank or SMS transaction capture
- Gmail or Google Calendar integration
- n8n automation workflows
- MCP servers
- AI agents
- Cloud backups
- Multi-user support
- Production security policies

Most interactions currently use mock data or session-only state.

---

## Roadmap

### Phase 2 — Real Data
- Supabase setup
- Authentication
- Persistent finance, health, learning, career, and project data
- Excel import for daily tracker and debt overview
- File and progress-photo storage
- Audit history

### Phase 3 — Automation
- n8n workflows
- Morning brief
- Evening check-in
- Weekly review
- Finance alerts
- Career follow-up reminders
- GitHub activity summaries

### Phase 4 — MCP Tools
- Finance MCP
- Health MCP
- Learning MCP
- Career MCP
- Projects MCP
- Personal memory MCP

### Phase 5 — AI Agents
- Uthai Chief-of-Staff Agent
- Finance Agent
- Health Agent
- Learning Agent
- Career Agent
- Project Agent

Important actions such as payments, external emails, job applications, and destructive changes will require user approval.

---

## Release Checklist

Before publishing a release:

```bash
npm install
npm run typecheck
npm run lint
npm run build
npm run format:check
```

Then:

```bash
git add .
git commit -m "Finalize Uthai Nexus v1.0"
git push origin main

git tag -a v1.0.0 -m "Uthai Nexus v1.0.0"
git push origin v1.0.0
```

---

## Design Principles

Uthai Nexus is built around these principles:

- One source of truth
- Clear separation of domains
- Minimal manual work
- Human approval for sensitive actions
- Accessible and responsive UI
- Typed and validated data
- Calm, premium visual design
- Future-ready architecture without unnecessary complexity

---

## License

This project is currently intended for personal use.

---

## Author

**Uthai**

Built as a personal operating system for managing life, health, finance, learning, career, and projects.
