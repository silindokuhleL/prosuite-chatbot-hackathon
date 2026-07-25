# Prosuite Chatbot Hackathon

AI-assisted GRC dashboard prototype for exploring how a chatbot can help users navigate Governance, Risk, Compliance, Audit, Asset, Incident, and Performance workflows.

The assistant is called **Mazwi**. It sits inside a ProSuite-style dashboard and uses module context, seeded demo data, OpenAI chat completions, quick suggestions, visual responses, and approval-aware action patterns.

## Portfolio Proof Status

Current status:

- Next.js dashboard prototype: available.
- GRC module navigation: available.
- Seeded demo data: available.
- Floating Mazwi assistant: available.
- OpenAI chat route: available.
- Streaming response UI: available.
- Module-aware quick suggestions: available.
- Visual response triggers: available.
- Browser screenshots: available.
- Production build: passing across all 57 application routes.
- Lint: passing with zero errors and zero warnings.
- Production dependency audit: zero known vulnerabilities.
- Live AI response proof: not captured in this pass because it requires sending a prompt through the configured OpenAI account.

## Visual Proof

Dashboard:

![Prosuite dashboard](Docs/proof-assets/prosuite-dashboard.png)

Mazwi chat interface:

![Mazwi chat interface](Docs/proof-assets/prosuite-mazwi-chat.png)

More verification detail:

- [Local verification log](Docs/LOCAL_VERIFICATION.md)
- [Demo questions](DEMO_QUESTIONS.md)
- [AI implementation checklist](AI_IMPLEMENTATION_CHECKLIST.md)

## What This Project Proves

- Next.js App Router dashboard architecture.
- AI feature integration inside a business workflow interface.
- OpenAI-powered chat route with streaming responses.
- Prompt engineering for GRC-specific assistant behavior.
- Context building from local ProSuite demo data.
- Role/action safety concepts for AI-assisted create, update, delete, escalation, reporting, and evidence-harvesting workflows.
- UI proof for a real assistant surface, not only a standalone chat page.
- Data visualization concepts for AI responses, including heatmaps, charts, metrics, progress, and tables.

## AI Provider And Model

Provider:

- OpenAI

Packages:

- `openai`
- `@ai-sdk/openai`
- `ai`

Default model:

```text
gpt-4o-mini
```

The API route falls back to `gpt-4o-mini` when `OPENAI_MODEL` is not set. The route also maps the invalid value `gpt-5-mini` back to `gpt-4o-mini`.

Primary route:

```text
src/app/api/chat/route.ts
```

Important AI files:

```text
src/app/api/chat/route.ts                 # Streaming OpenAI chat endpoint
src/components/ai/chat-interface.tsx       # Mazwi chat UI
src/components/ai/chat-button.tsx          # Floating assistant launcher
src/lib/ai/config.ts                       # Module definitions and suggestions
src/lib/ai/prompts/system.ts               # System and module prompts
src/lib/ai/context/builder.ts              # Module/screen context builders
src/lib/ai/actions/handler.ts              # AI action handling
src/lib/ai/actions/types.ts                # Action types and approval model
src/services/permissions.ts                # Role-based AI action permissions
src/services/audit-logger.ts               # AI action audit logging concept
src/services/pattern-detection.ts          # Risk, incident, and KPI pattern helpers
src/components/ai/smart-visualizer.tsx     # Response-driven visualizer
src/components/ai/quick-navigation.tsx     # Navigation help inside chat
```

## Main Features

- Dashboard with GRC metrics, risk heatmap, recent activity, and module cards.
- GRC modules for risk, asset, incident, audit, compliance, governance, and performance.
- Floating Mazwi assistant that detects the active module from the route.
- Module-specific suggested prompts.
- Streaming assistant responses from `/api/chat`.
- Markdown rendering for assistant responses.
- Automatic visualization triggers based on assistant wording.
- Quick navigation when users ask where to find a module or page.
- Action confirmation pattern for AI-proposed operations.
- Voice input UI using the browser speech recognition layer.
- Keyboard shortcut support for chat open/close.
- Local chat history and preference hooks.

## Demo Questions

Good questions for showing the project:

```text
Show me the risk heatmap
Summarize top 5 critical risks
Show risks without mitigation plans
Analyze risk trends this quarter
How many assets do we have?
What is our overall compliance score?
Which policies are due for review?
Show me incident trends
Take me to audit engagements
```

The full demo list is in [DEMO_QUESTIONS.md](DEMO_QUESTIONS.md).

## Local Setup

Install dependencies:

```bash
npm install
```

Create a local environment file from the safe template:

```bash
cp .env.example .env.local
```

Add your OpenAI key:

```text
OPENAI_API_KEY=your-key-here
OPENAI_MODEL=gpt-4o-mini
OPENAI_MAX_TOKENS=4000
OPENAI_TEMPERATURE=0.7
```

Start the dev server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Verification Notes

Latest local proof pass: 2026-07-25.

Passed:

- `npm install` completed on Node.js 20.9 or newer.
- `npm run lint` passed with zero errors and zero warnings.
- `npm run build` compiled, type-checked, and generated all 57 routes.
- `npm audit --omit=dev` reports zero production vulnerabilities.
- Dev server rendered locally on `http://localhost:3109`.
- Browser verified dashboard content, module navigation, risk heatmap, metrics, and recent activity.
- Browser verified the Mazwi chat panel opens and shows module-aware risk suggestions.

Needs work:

- The development toolchain audit still reports seven transitive advisories; production dependencies are clean.
- Live AI response proof still needs a safe demo run with an approved OpenAI key and non-sensitive prompt.

## Known Gaps

- Some AI action services are proof-of-concept helpers around local JSON data, not production persistence.
- Sensitive data masking, cross-tenant isolation, and long-term RAG memory are still listed as pending/future work.
- Live assistant responses require `OPENAI_API_KEY`; without it, `/api/chat` returns a controlled `503` response.

## Portfolio Summary

**Prosuite Chatbot Hackathon** is best presented as an AI product prototype: a Next.js GRC dashboard with an embedded assistant that understands business modules, can stream OpenAI responses, can trigger visual summaries, and demonstrates approval-aware AI action design.

It is not yet production-ready, but it is useful proof of AI workflow thinking, frontend architecture, business-domain modeling, and the ability to turn enterprise software workflows into assistant-driven user experiences.
