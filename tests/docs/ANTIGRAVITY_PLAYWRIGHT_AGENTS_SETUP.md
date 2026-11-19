# Antigravity Playwright Agents Setup & Guide

> **Project:** Nexus OS (`/Users/uthayakumar/Documents/nexus-OS`)  
> **Workspace Config Root:** [`.agents/`](../../.agents/)  
> **MCP Configuration:** [`.agents/mcp_config.json`](../../.agents/mcp_config.json)  
> **Primary Reference Test:** [`tests/e2e/overview.spec.ts`](../e2e/overview.spec.ts)

---

## 1. Overview: What Changed from `.github/agents` to `.agents/agents`

Previously, agent definitions were structured for GitHub Copilot in `.github/agents/`. 

To enable **Google Antigravity** to natively discover, load, and execute workspace agents alongside Playwright MCP, the agent configuration has been migrated into the standard Antigravity workspace structure under `.agents/`:

```text
nexus-OS/
├── .agents/                                    <-- Antigravity Workspace Root
│   ├── mcp_config.json                         <-- Playwright MCP Configuration
│   ├── agents/
│   │   ├── playwright-test-generator/
│   │   │   └── agent.md                        <-- Test Generator Agent
│   │   ├── playwright-test-healer/
│   │   │   └── agent.md                        <-- Test Healer / Debugger Agent
│   │   └── playwright-test-planner/
│   │       └── agent.md                        <-- Test Planner & Strategist Agent
│   ├── workflows/                              <-- Workspace automation workflows
│   └── skills/
│       └── playwright-testing/
│           └── SKILL.md                        <-- Playwright Best Practices Skill
└── .github/agents/                             <-- Preserved for GitHub Copilot compatibility
```

> **Note:** The original `.github/agents/` files have been safely preserved and not deleted.

---

## 2. Agent Roles & Capabilities

### 1. `playwright-test-generator`
- **Location:** [`.agents/agents/playwright-test-generator/agent.md`](../../.agents/agents/playwright-test-generator/agent.md)
- **Role:** Generates clean, robust, and well-structured Playwright TypeScript tests.
- **Capabilities:**
  - Inspects live web pages using Playwright MCP (`browser_snapshot`, `browser_navigate`).
  - Discovers semantic and accessible locators (`getByRole`, `getByLabel`, `getByText`).
  - Applies `test.describe()`, `test.beforeEach()`, and web-first `expect()` assertions.
  - Follows the Nexus OS test architecture established in `tests/e2e/overview.spec.ts`.

### 2. `playwright-test-healer`
- **Location:** [`.agents/agents/playwright-test-healer/agent.md`](../../.agents/agents/playwright-test-healer/agent.md)
- **Role:** Diagnoses, debugs, and fixes broken or flaky Playwright tests.
- **Capabilities:**
  - Analyzes terminal error logs, call logs, and stack traces.
  - Inspects live UI state with Playwright MCP to spot DOM discrepancies and strict-mode violations.
  - Replaces brittle selectors with stable, resilient locators.
  - Removes anti-patterns like `waitForTimeout()` and validates fixes using `npx playwright test`.

### 3. `playwright-test-planner`
- **Location:** [`.agents/agents/playwright-test-planner/agent.md`](../../.agents/agents/playwright-test-planner/agent.md)
- **Role:** Analyzes user workflows, maps critical user journeys, and produces structured test plans.
- **Capabilities:**
  - Explores routes, forms, modals, and buttons across Nexus OS.
  - Categorizes scenarios into Smoke, Navigation, Form, API, Visual, and Regression suites.
  - Defines precise preconditions, actions, and verification criteria ready for automation.

---

## 3. Playwright MCP Configuration

File: [`.agents/mcp_config.json`](../../.agents/mcp_config.json)

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

Google Antigravity automatically detects this file and starts the `@playwright/mcp@latest` server to provide browser exploration tools (`browser_navigate`, `browser_click`, `browser_snapshot`, etc.) to the agents.

---

## 4. How to Restart Antigravity to Detect Agents

1. Save any open files in Antigravity.
2. Completely quit and restart the **Google Antigravity IDE**.
3. Open the workspace folder:
   ```text
   /Users/uthayakumar/Documents/nexus-OS
   ```
4. Antigravity will automatically index the `.agents/` root, loading:
   - The **Playwright MCP** server from `.agents/mcp_config.json`
   - The **3 Workspace Agents** from `.agents/agents/`
   - The **Playwright Testing Skill** from `.agents/skills/playwright-testing/`

---

## 5. Example Prompts for Each Agent

You can invoke each agent directly in the Antigravity chat using the prompts below:

### Generator Agent Prompt:
```text
Use the playwright-test-generator agent. Open http://localhost:3000 using Playwright MCP, inspect the overview page, and generate Playwright TypeScript tests for tests/e2e/overview.spec.ts using stable locators and meaningful expect assertions.
```
*(Note: If your local dev server runs on port 5173, replace `http://localhost:3000` with `http://localhost:5173`).*

### Healer Agent Prompt:
```text
Use the playwright-test-healer agent. Debug the failing test in tests/e2e/overview.spec.ts. Inspect the live UI using Playwright MCP, identify broken locators, replace them with stable locators, remove hard waits, and explain the fix.
```

### Planner Agent Prompt:
```text
Use the playwright-test-planner agent. Analyze Nexus OS and create high-priority Playwright test scenarios grouped into smoke, navigation, form, API, visual, and regression categories.
```

---

## 6. How to Run Playwright Tests Manually

Remember: **MCP is designed for AI-assisted browser exploration and test authoring.** Final automated regression testing and CI verification must always run through the standard Playwright Test Runner.

```bash
# 1. Navigate to the project root
cd /Users/uthayakumar/Documents/nexus-OS

# 2. Start the local application server
npm run dev

# 3. Run all end-to-end tests headless
npx playwright test

# 4. Run tests in headed mode (visible browser window)
npx playwright test --headed

# 5. Open the HTML execution report
npx playwright show-report
```

### Project-Specific Shortcut Scripts:
```bash
# Run specifically against Google Chromium
npm run test:e2e:chromium -- tests/e2e/overview.spec.ts

# Run in interactive visual UI mode
npm run test:e2e:ui
```
