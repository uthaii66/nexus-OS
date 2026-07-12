You are a senior frontend architect, product designer, and React engineer.

Build the first production-quality version of a personal life-management dashboard called:

# Uthai Nexus

Tagline:

“Your AI-powered personal command center.”

The dashboard will eventually connect health, finance, career, learning, projects, automations, AI agents, and MCP tools. For this first phase, focus only on building a polished, scalable, responsive frontend foundation with realistic mock data.

Do not add AI agents, MCP servers, authentication, external APIs, payment actions, or complex backend infrastructure yet.

The application must look premium, futuristic, modern, professional, and highly polished without appearing overly flashy or like a generic AI-generated dashboard.

---

# 1. Technology Stack

Use:

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Router
- Framer Motion
- Recharts
- Lucide React
- Zustand for lightweight global state
- React Hook Form
- Zod for validation
- date-fns
- ESLint
- Prettier

Use npm unless the existing environment already uses another package manager.

The codebase must be structured so Supabase, MCP tools, AI agents, n8n workflows, and external integrations can be added later without rewriting the frontend.

---

# 2. Project Goal

Build a responsive personal operating-system dashboard that allows Uthai to view and manually manage:

- Daily priorities
- Personal tasks
- Finance
- Health and fitness
- Learning
- Career
- Projects
- Upcoming events
- Alerts
- Weekly progress

The Phase 1 application should use realistic mock data stored locally in typed files.

The user must be able to navigate between modules, view charts, open quick-add forms, update mock entries during the session, and inspect detailed information.

---

# 3. Visual Direction

Create a premium dark interface with subtle depth and refined motion.

Design qualities:

- Modern
- Spacious
- Elegant
- Futuristic
- Professional
- Calm
- Highly readable
- Recruiter-quality
- Product-launch quality

Avoid:

- Excessive neon
- Constant glowing effects
- Overuse of gradients
- Too many glass cards
- Giant text
- Cluttered widgets
- Excessive animation
- Generic admin-template appearance
- Fake AI chat elements everywhere

Use a dark charcoal or near-black background rather than pure black.

Suggested design system:

- Background: deep charcoal
- Surfaces: slightly lighter layered panels
- Borders: subtle and low-contrast
- Primary accent: refined blue, indigo, or violet
- Success: muted green
- Warning: amber
- Danger: soft red
- Typography: clean, modern, highly legible

Use one primary accent consistently throughout the application.

Use gradients only for important hero surfaces, progress indicators, or selected states.

---

# 4. Animation Principles

Use Framer Motion for polished, purposeful animation.

Include:

- Smooth page transitions
- Subtle card entrance animations
- Animated number changes
- Smooth sidebar collapse
- Modal and drawer transitions
- Hover elevation
- Progress-bar animation
- Chart reveal animation
- Command-palette transitions
- Staggered dashboard card loading

Animations must feel fast and refined.

Respect `prefers-reduced-motion`.

Do not animate every element continuously.

Avoid distracting floating, pulsing, bouncing, or looping animations.

---

# 5. Application Layout

Create a desktop-first application that is fully responsive.

Desktop layout:

- Collapsible left sidebar
- Top header
- Main content area
- Optional contextual right panel where useful
- Floating or fixed quick-add button

Mobile layout:

- Compact top header
- Bottom navigation or drawer navigation
- Responsive stacked cards
- Full-screen quick-add sheet
- Touch-friendly controls

The sidebar should include:

- Overview
- Finance
- Health
- Learning
- Career
- Projects
- Calendar
- Insights
- Settings

Use icons from Lucide React.

The active route should be visually clear.

---

# 6. Main Overview Page

Create an impressive command-center homepage.

Header section:

- Greeting based on time of day
- Current date
- Short motivational status
- Profile avatar placeholder
- Notification button
- Search or command button
- Quick-add button

Main dashboard content:

## Today’s Focus

Show the top three priorities with:

- Priority level
- Category
- Estimated duration
- Completion state
- Mark-complete action

Example priorities:

- Complete Python array practice
- Review monthly expenses
- Finish Terra-Zone project task

## Life Score

Create a visual score from 0 to 100 based on mock values from:

- Health
- Finance
- Career
- Learning
- Projects

Display:

- Overall score
- Change from last week
- Individual category scores
- A polished circular or radial progress visualization

## Daily Summary Cards

Include:

- Monthly spending
- Current debt
- Current weight
- Weekly calorie average
- Study streak
- Problems solved
- Active job applications
- Active projects

Each card should show:

- Main metric
- Trend
- Supporting information
- Relevant icon
- Optional mini-chart

## Upcoming Schedule

Show today’s and upcoming events in a compact timeline.

## Alerts and Attention Required

Examples:

- Credit-card payment due soon
- Two job applications need follow-up
- Protein target missed for three days
- One project task is blocked

## Weekly Progress

Create a chart or visual summary comparing:

- Planned versus completed tasks
- Study activity
- Workout consistency
- Spending versus budget

## Recent Activity

Show recent actions such as:

- Weight logged
- Expense added
- LeetCode problem completed
- Job application updated
- Project task completed

---

# 7. Finance Page

Create a polished finance dashboard using mock data.

Include:

- Total balance
- Monthly income
- Monthly expenses
- Savings
- Total debt
- Budget remaining
- Upcoming bills
- Recent transactions
- Spending by category
- Monthly spending trend
- Debt repayment progress

Add transaction filters:

- Search
- Category
- Date
- Income or expense
- Amount range

Allow users to:

- Add a transaction
- Edit a transaction
- Delete a session-only mock transaction
- Change category
- Mark recurring expense

Use React Hook Form and Zod for forms.

---

# 8. Health Page

Create a health and fitness dashboard.

Include:

- Current weight
- Starting weight
- Target weight
- Weekly weight average
- Daily calorie average
- Protein average
- Workout streak
- Steps
- Sleep duration
- Water intake
- Body-fat placeholder
- Weight trend chart
- Calories versus target chart
- Workout history
- Progress-photo placeholder section
- Habit consistency indicators

Allow users to manually log:

- Weight
- Meal
- Calories
- Protein
- Workout
- Steps
- Sleep
- Water
- Mood or energy

Do not provide medical diagnosis or unsafe recommendations.

---

# 9. Learning Page

Create a learning and interview-preparation dashboard.

Categories:

- Python
- Data Structures and Algorithms
- React
- AI and Machine Learning
- Cloud and AWS
- System Design

Include:

- Today’s study plan
- Current streak
- Weekly study time
- Topics in progress
- Problems solved
- Problems solved independently
- Weak topics
- Revision queue
- Recent problem attempts
- Confidence scores
- Learning activity chart

Create a DSA problem table with:

- Problem name
- Pattern
- Difficulty
- Status
- Attempts
- Solved independently
- Confidence
- Revision date

Allow session-only updates.

---

# 10. Career Page

Create a career and job-application dashboard.

Include:

- Total applications
- Applications this month
- Recruiter screens
- Technical interviews
- Follow-ups due
- Offers
- Application funnel
- Upcoming interviews
- Recruiter contacts
- Resume versions
- Recent activity

Application stages:

- Discovered
- Reviewing
- Resume tailored
- Referral requested
- Applied
- Recruiter screen
- Technical interview
- Final interview
- Offer
- Rejected

Create both:

- Kanban view
- Table view

Allow users to:

- Add an application
- Update stage
- Add notes
- Set follow-up date
- Mark priority
- Associate resume version

Use mock companies such as:

- Capital One
- Amazon
- Google
- Vanguard
- Microsoft
- CoreWeave

---

# 11. Projects Page

Create a project-management dashboard.

Sample projects:

- Terra-Zone
- Uthai Nexus
- Personal Portfolio
- Ramayana Game
- Finance Tracker

Include:

- Project cards
- Progress
- Status
- Priority
- Deadline
- Repository link placeholder
- Team members
- Active tasks
- Blockers
- Recent updates
- Milestones

Create:

- Grid view
- List view
- Project-detail page
- Task board
- Activity timeline
- Notes and decisions section

---

# 12. Calendar Page

Create a calendar and schedule page.

Include:

- Month view
- Week view
- Agenda view
- Upcoming deadlines
- Study sessions
- Workouts
- Interviews
- Bill dates
- Project milestones

Use mock events.

Do not integrate Google Calendar yet.

Structure the code so a calendar integration can be added later through a service adapter.

---

# 13. Insights Page

Create a future-ready insights page using mock generated insights.

Examples:

- Spending increased by 12% this month.
- Your study consistency is strongest on weekdays.
- Weight trend is moving toward the target.
- Three applications require follow-up.
- Project completion slows when more than four projects are active.

Clearly label these as dashboard insights derived from mock data.

Do not build a chatbot yet.

Add an inactive or “Coming Later” section for:

- Uthai Chief-of-Staff Agent
- Finance Agent
- Health Agent
- Career Agent
- Learning Agent
- Project Agent

---

# 14. Quick-Add System

Create a global quick-add modal or command panel.

Actions:

- Add expense
- Add income
- Log weight
- Log meal
- Log workout
- Add study session
- Add job application
- Update application
- Add project task
- Add calendar event
- Add note

The quick-add interface should:

- Be keyboard accessible
- Open from a button
- Open from a keyboard shortcut
- Use validated forms
- Show success feedback
- Update local Zustand state for the current session

---

# 15. Command Palette

Add a command palette similar to modern productivity tools.

Keyboard shortcut:

- Command + K on macOS
- Control + K on Windows

Commands:

- Navigate to a page
- Add a transaction
- Log weight
- Add a task
- Add a job application
- Search projects
- Toggle sidebar
- Toggle compact mode
- Open settings

---

# 16. Component Architecture

Create reusable components such as:

- AppShell
- Sidebar
- MobileNavigation
- TopHeader
- PageHeader
- MetricCard
- TrendIndicator
- MiniChart
- SectionCard
- EmptyState
- StatusBadge
- ProgressRing
- ActivityTimeline
- TaskItem
- AlertCard
- DataTable
- ChartCard
- QuickAddModal
- CommandPalette
- ConfirmationDialog
- LoadingSkeleton
- ErrorState
- FilterBar
- SearchInput

Do not place the entire application in one file.

---

# 17. Recommended Folder Structure

Use a clean feature-based structure:

src/
  app/
    App.tsx
    router.tsx
    providers.tsx
  components/
    layout/
    navigation/
    common/
    charts/
    forms/
    feedback/
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
  types/
  utils/
  styles/

Inside each feature, use folders such as:

- components
- pages
- schemas
- hooks
- types
- utils

---

# 18. Future-Proof Service Layer

Do not directly access mock data from visual components.

Create service interfaces.

Example:

```ts
export interface FinanceService {
  getTransactions(): Promise<Transaction[]>;
  createTransaction(input: CreateTransactionInput): Promise<Transaction>;
  getFinanceSummary(): Promise<FinanceSummary>;
}
```

Create mock implementations for Phase 1.

Organize services so they can later be replaced with:

- Supabase services
- REST APIs
- MCP tools
- n8n webhooks
- AI agent actions

Create similar service interfaces for:

- Finance
- Health
- Learning
- Career
- Projects
- Calendar
- Notifications
- Insights

Use dependency boundaries that prevent frontend components from knowing whether data comes from mock files, Supabase, or MCP.

---

# 19. TypeScript Requirements

Use strict TypeScript.

Requirements:

- Avoid `any`
- Create domain types
- Use discriminated unions where useful
- Use enums sparingly
- Validate form inputs with Zod
- Type chart data
- Type service responses
- Type Zustand stores
- Type component props
- Add reusable generic table types where appropriate

---

# 20. State Management

Use:

- Local component state for UI-only state
- Zustand for session-level domain state and quick-add updates
- React Hook Form for forms

Create separate Zustand slices or stores where appropriate.

Do not place every domain in one oversized store.

Prepare the architecture for TanStack Query later, but do not introduce it unless it provides clear value in Phase 1.

---

# 21. Performance Requirements

Optimize the application carefully.

Use:

- Route-level lazy loading
- Code splitting
- Memoization only where useful
- Responsive images
- Avoid unnecessary rerenders
- Lightweight chart rendering
- Skeleton loading states
- Error boundaries
- Suspense where appropriate

Do not overuse `useMemo` or `useCallback`.

Aim for:

- Fast first load
- Smooth navigation
- Smooth animations
- Strong Lighthouse scores
- No obvious layout shifts
- Accessible contrast
- Responsive interaction

---

# 22. Accessibility Requirements

Include:

- Keyboard navigation
- Visible focus states
- ARIA labels where necessary
- Semantic HTML
- Accessible form errors
- Accessible modals
- Reduced-motion support
- Sufficient contrast
- Screen-reader-friendly labels
- Logical tab order

---

# 23. Responsive Requirements

Test layouts conceptually for:

- 1440px desktop
- 1280px laptop
- 1024px tablet landscape
- 768px tablet
- 430px mobile
- 390px mobile

Cards must reflow naturally.

Tables should become horizontally scrollable or transform into mobile-friendly cards.

Charts must resize correctly.

The sidebar should collapse intelligently.

---

# 24. Mock Data

Create realistic mock data for all pages.

Use dates close to the current period.

Include enough records to make:

- Charts meaningful
- Tables useful
- Filters demonstrable
- Empty states testable
- Trends believable

Store mock data in separate typed files.

Do not hardcode large data arrays directly inside components.

---

# 25. Settings Page

Create a settings page with frontend-only preferences:

- Profile information
- Display name
- Theme preference
- Sidebar preference
- Compact mode
- Dashboard widget visibility
- Notification preferences
- Reduced-motion option
- Currency preference
- Weight unit
- Date format

Use localStorage to persist UI preferences.

Do not store sensitive personal information.

---

# 26. Design Details

Include refined touches:

- Subtle background texture or gradient
- Soft shadows
- Thin borders
- Deliberate spacing
- Strong hierarchy
- Elegant empty states
- Smooth loading skeletons
- Polished tooltips
- Refined dropdowns
- Responsive chart legends
- Sticky section headers where useful
- Clean status indicators
- Tasteful progress visuals

The UI should feel custom-designed for Uthai Nexus.

It should not look like a copied SaaS admin template.

---

# 27. Branding

Use:

Product name:

Uthai Nexus

Tagline:

Your AI-powered personal command center.

Possible brand mark:

- A minimal connected-node symbol
- A refined letter N
- A subtle nexus/orbit motif

Create the logo using CSS, SVG, or Lucide-compatible shapes.

Do not use an external copyrighted logo.

---

# 28. Deliverables

Build the complete frontend foundation.

Provide:

1. Full working source code
2. Clean folder structure
3. Installed dependencies
4. Responsive pages
5. Reusable components
6. Typed mock data
7. Forms with validation
8. Zustand state
9. Charts
10. Animations
11. Command palette
12. Quick-add workflow
13. README
14. Run instructions
15. Build instructions
16. Architecture notes
17. Future integration notes

The README must explain:

- What Uthai Nexus is
- Technology stack
- Folder structure
- How to run locally
- Available scripts
- How mock services work
- How Supabase can replace mock services later
- Where MCP integrations will be added
- Where n8n integrations will be added
- Where AI agents will be added

---

# 29. Implementation Workflow

Follow this order:

1. Inspect the existing folder.
2. If no project exists, initialize a Vite React TypeScript project.
3. Install dependencies.
4. Configure Tailwind CSS.
5. Configure shadcn/ui.
6. Set up routing.
7. Build the design tokens and global styles.
8. Create the application shell.
9. Create typed mock data.
10. Create service interfaces and mock services.
11. Build the overview dashboard.
12. Build all remaining modules.
13. Add forms and quick-add functionality.
14. Add command palette.
15. Add responsive behavior.
16. Add animations.
17. Add accessibility improvements.
18. Add loading, error, and empty states.
19. Run lint.
20. Run type checking.
21. Run the production build.
22. Fix all reported issues.
23. Review the final UI for consistency.
24. Update the README.

Do not stop after creating only the landing page or dashboard shell.

Continue until the Phase 1 frontend is complete and runnable.

---

# 30. Code Quality Rules

- Do not use placeholder code such as “implement later.”
- Do not create dead buttons.
- Buttons must perform a meaningful local action.
- Avoid duplicate components.
- Avoid oversized files.
- Avoid fragile relative imports where aliases are appropriate.
- Use clear naming.
- Add comments only when they explain architecture or non-obvious logic.
- Do not add unnecessary abstractions.
- Do not expose secrets.
- Do not hardcode API keys.
- Do not add fake backend requests.
- Do not suppress TypeScript errors.
- Do not use `@ts-ignore` unless absolutely unavoidable.
- Do not leave lint errors.
- Do not leave build errors.

---

# 31. Final Validation

Before completing the task, verify:

- The application runs with `npm run dev`.
- The application builds with `npm run build`.
- TypeScript passes.
- ESLint passes.
- All routes load.
- Navigation works.
- Mobile navigation works.
- Charts render.
- Forms validate.
- Quick-add updates session data.
- Command palette works.
- Animations respect reduced motion.
- No page contains broken layouts.
- No buttons are misleading or nonfunctional.
- No console errors remain.

At the end, provide:

- A summary of what was built
- The final folder structure
- Commands to run the project
- Important architecture decisions
- Any limitations of the mock-data Phase 1
- Recommended next steps for Phase 2

Build this as a serious long-term product foundation, not as a basic dashboard demo.