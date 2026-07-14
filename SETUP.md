# Agent SDLC

Jira automation bot powered by OpenHands SDK. Picks up tickets, runs an AI coding agent, creates PRs, and reports back — all the way from Jira to merged.

---

## Architecture

```
jira_bot.py          → main pipeline (6-step flow)
jira_tool.py         → Jira API wrapper
ui/                  → Next.js frontend (React + Tailwind)
openhands-sdk/       → SDK package (installed dependency)
openhands-tools/     → Tool package (installed dependency)
```

### Pipeline Flow

| Step | Name | What happens |
|------|------|-------------|
| 1 | **Fetch** | JQL query picks up an `Agent-ready` ticket |
| 2 | **Clarity Gate** | LLM validates the description has enough detail |
| 3 | **Agent Run** | Clones repo, AI agent edits code, runs verification |
| 4 | **Verify** | Checks `git diff` for modifications + pip dry-run |
| 5 | **PR** | Creates branch, commits, pushes, opens GitHub PR |
| 6 | **Report** | Comments on Jira, transitions status to Done |

---

## Setup

### Prerequisites

- Python 3.12
- Azure OpenAI deployment (GPT-4.1-mini)
- Jira account with API token
- GitHub PAT with `Contents: Write`

### Environment Variables

Create `.env` in the project root:

```env
# Azure OpenAI
AZURE_OPENAI_ENDPOINT="https://<your-endpoint>.cognitiveservices.azure.com/"
AZURE_OPENAI_API_KEY=<your-key>
AZURE_OPENAI_DEPLOYMENT="gpt-4.1-mini"

# Jira
JIRA_BASE_URL=https://<your-domain>.atlassian.net
JIRA_USER_EMAIL=<your-email>
JIRA_API_TOKEN=<your-token>

# GitHub
GITHUB_TOKEN=<github-pat>
```

### Install

```bash
uv sync --dev
```

### Run Bot

```bash
uv run python jira_bot.py
```

---

## Frontend (Next.js)

A dashboard UI to visualize and trigger pipelines.

### Pages

| Route | Description |
|-------|-------------|
| `/` | Login page — pull the lamp chain, enter `admin`/`admin` |
| `/dashboard` | Stats cards + recent runs table |
| `/run` | Input a Jira ticket key, run pipeline, watch progress |
| `/logs` | Search/filter past runs, expand for step-by-step logs |

### Run Dev Server

```bash
cd ui
npm install
npm run dev
```

### Design

Two distinct design systems:

- **Login page** — dark brass/warm theme with animated SVG lamp, chain pull, dust particles (from `loginpage.html`)
- **All other pages** — light purple/indigo theme with grid background, orbs, step cards (from `dasboard.html`)

---

## Key Decisions

- **SDK over full OpenHands app** — lighter, no React/Docker overhead, fits a headless bot
- **Clarity gate** — LLM validates ticket has ≥5 words and sufficient detail
- **Gate fail-loudly** — on LLM error, ticket is NOT sent to agent; posts distinct Jira comment
- **pip dry-run** — checks only new packages from the ticket, not entire `requirements.txt`
- **Two design systems** — login page is standalone, rest of UI uses separate theme
- **GitHub PAT** — fine-grained token with `Contents: Write` on target repo

---

## Development Notes

### API Stubs

The frontend (`ui/lib/api.ts`) has fetch stubs ready for:

- `POST /api/run-ticket` — start a pipeline run
- `GET /api/run-status/{id}` — poll run progress
- `GET /api/stats` — aggregate run stats
- `GET /api/runs` — list all runs

Wire these to the backend when ready.

### Model

Uses `azure/gpt-4.1-mini` via LiteLLM. Cost per full pipeline run: ~$0.058.

### Git

```bash
git remote -v          # check remotes
git push origin main   # push to current repo
```
