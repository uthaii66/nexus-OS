# Module 8: Playwright MCP Setup for Google Antigravity & Nexus OS

> **Nexus OS Automated Quality Engineering Series**  
> **Topic:** Module 8 — Playwright MCP (Model Context Protocol) & AI Agents  
> **Target App:** Nexus OS Command Center (`/Users/uthayakumar/Documents/nexus-OS`)  
> **Configuration File:** [`.agents/mcp_config.json`](../../.agents/mcp_config.json)  
> **Primary Test File:** [`tests/e2e/overview.spec.ts`](../e2e/overview.spec.ts)

---

## 1. What is Playwright MCP?

**Playwright MCP** is a **Model Context Protocol (MCP)** server that bridges browser automation directly with AI agents inside your IDE (such as Google Antigravity). 

Instead of an AI guessing what a page looks like from static code, Playwright MCP allows the AI agent to:
- Open a live, headless or headed browser session directly from the IDE.
- Inspect the live DOM accessibility tree and interactive elements.
- Click buttons, fill forms, trigger dropdowns, and navigate routes.
- Extract robust, stable locators (`getByRole`, `getByText`, `getByLabel`).
- Generate and refine resilient Playwright test code directly based on actual browser state.

---

## 2. Why is it Useful for AI-Assisted Testing?

1. **Eliminates Locator Guesswork**: Traditional AI coding assistants often hallucinate brittle CSS/XPath selectors. With Playwright MCP, the agent queries the live DOM accessibility tree directly.
2. **Interactive UI Exploration**: Agents can explore complex flows (like modals, command palettes, and multi-step forms) in real time.
3. **Automated Root-Cause Debugging**: If a test fails, the agent can navigate to the failure point, take a live screenshot/snapshot, inspect the discrepancy, and propose an immediate fix.
4. **Separation of Concerns**:
   - **Playwright MCP**: Used by the AI agent for live exploration, selector discovery, and test authoring.
   - **Playwright Test Runner (`@playwright/test`)**: Used by developers and CI/CD pipelines for fast, deterministic, parallel test execution.

---

## 3. Where the MCP Config is Added

The MCP configuration is registered at the workspace level in:

```text
/Users/uthayakumar/Documents/nexus-OS/.agents/mcp_config.json
```

### Exact Configuration:

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

Google Antigravity automatically discovers and loads MCP servers defined in the `.agents/mcp_config.json` directory when opening the workspace.

---

## 4. How to Start Nexus OS Locally

Before asking Antigravity to inspect the application, make sure the local development server is running:

```bash
cd /Users/uthayakumar/Documents/nexus-OS
npm run dev
```

By default, Vite runs on:
```text
http://localhost:5173
```
*(If you run the custom port preview or alternate host, e.g. `npm run dev -- --port 3000`, use `http://localhost:3000`).*

---

## 5. Example CLI Commands

Use these standard commands during your development and testing lifecycle:

```bash
# 1. Navigate to project root
cd /Users/uthayakumar/Documents/nexus-OS

# 2. Start local development server
npm run dev

# 3. Run all Playwright tests headless
npx playwright test

# 4. Run tests in headed mode (visible browser)
npx playwright test --headed

# 5. Open the interactive HTML test report
npx playwright show-report
```

---

## 6. How to Use Antigravity Agent with Playwright MCP

Once Antigravity has loaded the workspace and initialized the `playwright` MCP server, you can interact with the agent using natural language prompts. The agent will autonomously launch browser tools, explore the application, and output high-quality Playwright TypeScript tests.

### Sample Antigravity Agent Prompts:

#### Prompt 1: Inspect the Overview Page & Identify Elements
```text
Use Playwright MCP to open http://localhost:3000. Inspect the overview page and identify all visible headings, buttons, links, inputs, and important sections.
```

#### Prompt 2: Generate Playwright Test Cases with Stable Locators
```text
Use Playwright MCP to inspect http://localhost:3000 and generate Playwright TypeScript test cases for tests/e2e/overview.spec.ts. Use stable locators such as getByRole, getByText, getByLabel, and getByTestId where possible.
```

#### Prompt 3: Discover Missing Test Scenarios
```text
Use Playwright MCP to explore Nexus OS and suggest missing high-priority test scenarios. Group them into smoke tests, navigation tests, form tests, API-related tests, and visual tests.
```

#### Prompt 4: Debug a Failing Playwright Test
```text
Use Playwright MCP to debug the failing Playwright test in tests/e2e/overview.spec.ts. Inspect the UI, compare the locator with the actual page, and update the test with a stable locator and meaningful expect assertion.
```

---

## 7. How to Run Final Playwright Tests Manually

Remember: **MCP is designed for AI-assisted exploration and test generation.** Final automated validation and regression testing must always be executed through the standard Playwright Test Runner.

```bash
# Run the specific overview test suite
npx playwright test tests/e2e/overview.spec.ts --project=chromium

# Run via npm script
npm run test:e2e:chromium

# Run all browsers in headed mode
npm run test:e2e:headed

# Open UI mode for interactive time-travel debugging
npm run test:e2e:ui
```

---

## 8. Troubleshooting Guide

If Google Antigravity does not detect or connect to the Playwright MCP server, follow these verification steps:

1. **Restart Antigravity after adding MCP config**:
   - Close and restart the Google Antigravity IDE so it re-reads `.agents/mcp_config.json`.
2. **Check whether `.agents/mcp_config.json` is valid JSON**:
   - Ensure there are no trailing commas, syntax errors, or improper quote marks.
3. **Confirm Node.js and npm are installed**:
   - Run in your terminal:
     ```bash
     node --version
     npm --version
     ```
4. **Confirm npx works**:
   - Run in your terminal:
     ```bash
     npx --version
     ```
5. **Confirm Nexus OS is running locally**:
   - Make sure your terminal is running `npm run dev` and the server hasn't crashed or terminated.
6. **Confirm the app URL is correct**:
   - Double-check whether Vite is serving on `http://localhost:5173` or `http://localhost:3000`. Provide the exact matching URL in your prompt.
7. **Try running `npx @playwright/mcp@latest` manually**:
   - Run in your terminal to test if the package can be downloaded and spawned without network or permission errors:
     ```bash
     npx @playwright/mcp@latest --help
     ```
8. **Install Playwright browser binaries if needed**:
   - If MCP connects but cannot launch browsers:
     ```bash
     npx playwright install
     ```

---

## 9. Architectural Summary

```
┌────────────────────────────────────────────────────────┐
│                   Google Antigravity                   │
│                    (AI Agent IDE)                      │
└──────────────┬───────────────────────────┬─────────────┘
               │                           │
   [Reads .agents/mcp_config.json]         │ [Generates / Refines]
               │                           │
               ▼                           ▼
┌──────────────────────────────┐ ┌─────────────────────────────┐
│    Playwright MCP Server     │ │ tests/e2e/overview.spec.ts  │
│    (@playwright/mcp@latest)  │ │   (Playwright Test Runner)  │
└──────────────┬───────────────┘ └─────────────┬───────────────┘
               │                               │
    [Live Browser Control &            [Automated Regression &
      Accessibility Inspection]          Deterministic CI Run]
               │                               │
               ▼                               ▼
┌──────────────────────────────────────────────────────────────┐
│                    Nexus OS Web Application                  │
│                     (http://localhost:5173)                  │
└──────────────────────────────────────────────────────────────┘
```
