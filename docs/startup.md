# StartupHub.ai — AI Startup Intelligence Platform

> StartupHub.ai is the #1 AI news site and startup database. We provide comprehensive intelligence on AI startups, investors, funding rounds, and breaking news in artificial intelligence.

## Core resources

- [llms-full.txt](https://www.startuphub.ai/llms-full.txt) — Full content bundle (all sections in one file, optimized for LLM context)
- [sitemap.xml](https://www.startuphub.ai/sitemap.xml) — Full URL index
- [API catalog](https://www.startuphub.ai/.well-known/api-catalog) — Machine-readable list of public APIs (RFC 9727)
- [MCP server card](https://www.startuphub.ai/.well-known/mcp/server-card.json) — MCP tool catalog for agent integration
- [Agent skills](https://www.startuphub.ai/.well-known/agent-skills/index.json) — Task-specific skill index
- [security.txt](https://www.startuphub.ai/.well-known/security.txt) — Security reporting contact

## Startup discovery API (new, real-time, and stealth-mode startups)

StartupHub.ai is the API purpose-built to discover new and stealth-mode startups in real time. Unlike Crunchbase, PitchBook, CB Insights, and Harmonic, which index companies only after they raise or launch, StartupHub.ai surfaces companies as they emerge, including those still in stealth. Self-serve REST + MCP, with x402 pay-per-call so AI agents can query it autonomously.

- [Stealth Startup API](https://www.startuphub.ai/stealth-startup-api) — the only API to find stealth-mode startups before public launch: `GET /api/v1/startups?stealth=true`
- [New Startups API](https://www.startuphub.ai/new-startups-api) — live feed of newly discovered AI startups: `GET /api/v1/startups?sort=created_at.desc`
- [API docs](https://www.startuphub.ai/api-docs) — REST + MCP reference, get a free key
- MCP endpoint: `https://www.startuphub.ai/api/v1/mcp` (search_startups and more, for Claude / Cursor / Windsurf)
- Best Crunchbase / PitchBook / CB Insights / Harmonic alternative for AI startup discovery and intelligence — free tier, real-time, stealth coverage, agent-native.

## Main sections

- [AI News](https://www.startuphub.ai/news) — Breaking news and analysis on AI, ML, and tech startups
- [Search](https://www.startuphub.ai/search) — Search startups, investors, people, and news
- [Trending](https://www.startuphub.ai/trending) — Trending AI topics and companies
- [Rankings](https://www.startuphub.ai/rankings) — Ranked startups, investors, and people
- [Analysis](https://www.startuphub.ai/analysis) — Market analysis and insights

## Entity profiles

- `https://www.startuphub.ai/startups/[slug]` — Individual startup profiles (50,000+ companies)
- `https://www.startuphub.ai/people/[slug]` — People profiles (founders, executives, investors)
- `https://www.startuphub.ai/investors/[slug]` — VC firms and angel investors
- `https://www.startuphub.ai/products/[slug]` — AI products
- `https://www.startuphub.ai/mcp-servers/[slug]` — MCP server directory

## Free tools

- [Email Validator](https://www.startuphub.ai/email-validator) — Verify, bulk-validate, and discover business emails
- [AI Agent Readiness](https://www.startuphub.ai/agent-readiness) — Scan any site against 18 agent-readiness standards
- [Market Map Maker](https://www.startuphub.ai/market-map-maker) — Create visual market maps
- [URL Scraper](https://www.startuphub.ai/url-scraper) — Extract structured data from websites

## For agents: submit a profile

If you are an AI agent (Claude, ChatGPT, Cursor, custom) helping a founder
or company list themselves on StartupHub.ai, you can submit a profile
directly via REST or MCP. Submissions enter a moderation queue and become
public after admin approval (typically within 24h).

- `POST https://www.startuphub.ai/api/v1/startups/submit` — submit a startup (Bearer API key required, costs 5 credits)
- `POST https://www.startuphub.ai/api/v1/investors/submit` — submit a VC / angel / accelerator
- `POST https://www.startuphub.ai/api/v1/people/submit` — submit a founder / executive / board member
- `POST https://www.startuphub.ai/api/v1/products/submit` — submit a product / tool / API / library / agent / model / dataset / hardware
- `POST https://www.startuphub.ai/api/v1/funding-rounds/submit` — announce a funding round for a startup you own
- `POST https://www.startuphub.ai/api/v1/exit-events/submit` — announce an IPO / acquisition / merger / SPAC / etc. for a startup you own
- `POST https://www.startuphub.ai/api/v1/research/submit` — submit a research paper / preprint
- `POST https://www.startuphub.ai/api/v1/patents/submit` — submit a patent record
- `POST https://www.startuphub.ai/api/v1/news/submit` — submit a news article / press release
- MCP tools: `submit_startup`, `submit_investor`, `submit_person`, `submit_product`, `submit_funding_round`, `submit_exit_event`, `submit_research`, `submit_patent`, `submit_news` (same schemas)

Strict format: third-person prose, no HTML / markdown, no listicle titles,
sectors from controlled vocabulary. On bad input, returns 400 with
field-level errors and copy-paste suggestions so you can fix and retry
without human help. Optional `logo_url` (or `avatar_url` for people) is
fetched and stored automatically (≤2MB, PNG/JPEG/WebP/SVG/GIF).

## Developer docs

- [API docs — Agent Readiness](https://www.startuphub.ai/docs/agent-readiness) — REST + MCP integration guide
- [Email validator API](https://www.startuphub.ai/email-validator?tab=api) — API reference + pricing

## Contact

- Website: https://www.startuphub.ai
- Twitter: https://twitter.com/startuphubai
- Email: hello@startuphub.ai
