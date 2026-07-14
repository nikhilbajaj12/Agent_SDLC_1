# Agent SDLC

Jira automation bot — picks up tickets, runs an AI coding agent, creates PRs, reports back.

Built on the OpenHands SDK with a Next.js dashboard UI.

---

## Project Structure

```
jira_bot.py          → main pipeline (6-step flow)
jira_tool.py         → Jira API wrapper
ui/                  → Next.js frontend (React + Tailwind)
SETUP.md             → full setup & architecture docs
```

## Quick Start

```bash
# install
uv sync --dev

# set env vars
# edit .env with your Azure, Jira, and GitHub credentials

# run bot
uv run python jira_bot.py

# run UI
cd ui && npm install && npm run dev
```

Login at `http://localhost:3000` with `admin` / `admin`.

---

See [SETUP.md](SETUP.md) for detailed documentation, architecture, pipeline flow, and development notes.
