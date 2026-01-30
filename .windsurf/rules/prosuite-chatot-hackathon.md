# ProSuite Chatbot Hackathon - Project Rules

## 1. Technology Stack

**Required:**
- Next.js 16+ (App Router)
- TypeScript
- Tailwind CSS v4
- shadcn/ui for UI components
- lucide-react for icons

**Forbidden:**
- ❌ Other UI libraries (Material-UI, Ant Design, etc.)
- ❌ Inline CSS or styled-components
- ❌ Other icon libraries
- ❌ Spinner/loading indicators (use Suspense with skeleton blur)

---

## 2. Single Source of Truth (CRITICAL)

### JSON IS THE SYSTEM

All system data comes from one JSON structure (`src/data/prosuite-data.json`):

| Data Category | Examples |
|--------------|----------|
| **Modules** | Risk, Asset, Incident, Audit, Compliance, Governance, Performance |
| **Users** | User accounts, roles, permissions |
| **Entities** | Risks, Assets, Incidents, Audit Engagements |
| **Statuses** | Risk statuses, Asset statuses, Incident statuses |
| **Lookups** | Categories, Departments, Sites, Locations |
| **Relationships** | Risk controls, Incident tasks, Audit findings |

### Forbidden
- ❌ No hardcoded data in components
- ❌ No duplicated configs across files
- ❌ No fake mock data or placeholder content
- ❌ No inline arrays/objects that should come from JSON

### Required
- ✅ Everything is derived from JSON via `src/lib/data.ts`
- ✅ JSON drives UI rendering, navigation, and logic
- ✅ JSON powers AI context generation
- ✅ Types in `src/types/` must match JSON structure

### Data Access Pattern
```typescript
// ✅ Correct - Use data accessor functions
import { getRisks, getUser, getDepartment } from '@/lib/data';

const risks = getRisks();
const user = getUser(risk.owner_id);

// ❌ Wrong - Hardcoded data
const statuses = ['Open', 'Closed', 'Pending'];

// ❌ Wrong - Direct JSON import in components
import data from '@/data/prosuite-data.json';
```

---

## 3. Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── (routes)/       # Route groups
│   ├── layout.tsx      # Root layout
│   └── globals.css     # Global styles
├── components/
│   ├── ui/             # shadcn/ui components only
│   ├── layout/         # Layout components (header, sidebar, nav)
│   └── shared/         # Reusable components (loaders, empty states)
├── lib/                # Utilities (cn, utils, etc.)
├── types/              # TypeScript types and interfaces
│   └── index.ts        # Central type exports
├── hooks/              # Custom React hooks
├── config/             # Configuration files (JSON/TS)
└── services/           # API calls and data fetching
```

---

## 4. Component Rules

### Global Components (`src/components`)
- **ui/**: shadcn/ui components ONLY - do not modify
- **layout/**: Headers, sidebars, navigation shells
- **shared/**: Reusable components like skeletons, empty states, error boundaries

### Component Guidelines
- Use shadcn/ui components as base
- Style with Tailwind CSS only
- Keep components small and focused
- Prefer composition over configuration

---

## 5. Type System Rules

### Centralized Types
- All types live in `src/types/`
- Export all types from `src/types/index.ts`
- Use `type` for object shapes, `interface` for extensible contracts

### Type Usage
```typescript
// ✅ Correct
import type { User, Message } from "@/types"

// ❌ Wrong - inline types
const user: { name: string; id: number } = {}
```

**Rules:**
- ❌ No inline types in components or pages
- ✅ Import types from `@/types`
- ✅ Use type-only imports: `import type { ... }`

---

## 6. Import Order (Enforced)

```typescript
// 1. React
import { useState, useEffect } from "react"

// 2. Next.js
import Link from "next/link"
import { useRouter } from "next/navigation"

// 3. External libraries
import { MessageSquare } from "lucide-react"

// 4. UI components (alphabetical)
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

// 5. Layout/Shared components
import { Header } from "@/components/layout/header"

// 6. Local components
import { ChatMessage } from "./chat-message"

// 7. Hooks and utilities
import { useChatbot } from "@/hooks/use-chatbot"
import { cn } from "@/lib/utils"

// 8. Types (last, type-only imports)
import type { Message, ChatSession } from "@/types"
```

---

## 7. Page Structure (App Router)

### Pages should be thin composition layers:

```typescript
// ✅ Correct - thin page
export default function ChatPage() {
  return <ChatInterface />
}

// ❌ Wrong - logic in page
export default function ChatPage() {
  const [messages, setMessages] = useState([])
  // ... lots of logic
}
```

**Rules:**
- ✅ Layout composition only
- ✅ Render feature components
- ❌ No API calls in pages
- ❌ No business logic in pages
- ❌ No type definitions in pages

---

## 8. Styling Rules

### Tailwind Only
```typescript
// ✅ Correct
<div className="flex items-center gap-4 rounded-lg bg-white p-4">

// ❌ Wrong
<div style={{ display: "flex", padding: "16px" }}>
```

### Using cn() utility
```typescript
import { cn } from "@/lib/utils"

<Button className={cn("w-full", isActive && "bg-primary")} />
```

---

## 9. Data Fetching

### Use Services Layer
```typescript
// src/services/chatbot.ts
export async function getChatHistory(userId: string) {
  const response = await fetch(`/api/chat/${userId}`)
  return response.json()
}

// In component
import { getChatHistory } from "@/services/chatbot"
```

**Rules:**
- ✅ All API calls in `src/services/`
- ✅ Components call services, not APIs directly
- ✅ Services return typed data

---

## 10. Configuration

### Use config files for static data
```typescript
// src/config/chatbot.ts
export const CHATBOT_CONFIG = {
  maxMessages: 100,
  typingDelay: 500,
  models: ["gpt-4", "claude-3"]
}
```

**Rules:**
- ✅ Configuration in `src/config/`
- ✅ Can use JSON or TypeScript
- ❌ No magic numbers in components

---

## 11. Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| Files/Folders | kebab-case | `chat-interface.tsx` |
| Components | PascalCase | `ChatMessage` |
| Hooks | useCamelCase | `useChatbot` |
| Functions | camelCase | `sendMessage` |
| Constants | UPPER_SNAKE_CASE | `MAX_MESSAGES` |
| Types/Interfaces | PascalCase | `Message`, `ChatSession` |

---

## 12. Code Quality

### General Rules
- Write clean, readable code
- Add comments for complex logic only
- Use descriptive variable names
- Keep functions small and focused
- Handle errors gracefully

### TypeScript
- Enable strict mode
- No `any` types (use `unknown` if needed)
- Prefer `type` over `interface` for simple objects

---

## 13. Loading States (Suspense Pattern)

### Rules
- ❌ **NO spinner loaders** - spinners are forbidden
- ❌ **NO generic skeletons** - each component needs its own specific skeleton
- ✅ Use React Suspense with component-specific skeleton fallbacks
- ✅ Static content (headings, labels, navigation) must always display immediately
- ✅ Only fetched/dynamic content should be wrapped in Suspense
- ✅ Each new component that fetches data MUST have a matching skeleton

### Component-Specific Skeletons
Every component that fetches data needs its own skeleton that mirrors its layout:

```typescript
// Component: RiskList.tsx
export function RiskList() { ... }

// Matching skeleton: RiskListSkeleton.tsx (same folder)
export function RiskListSkeleton() {
  return (
    <div className="animate-pulse blur-[1px] opacity-80">
      {/* Mirrors RiskList structure */}
      <div className="rounded-lg border">
        <div className="h-12 bg-muted/50" /> {/* Table header */}
        {[1,2,3,4,5].map(i => (
          <div key={i} className="h-16 border-t bg-muted/30" />
        ))}
      </div>
    </div>
  )
}
```

### Page Pattern
```typescript
// ✅ Correct - Static header visible, fetched content has specific skeleton
export default function RiskPage() {
  return (
    <>
      <PageHeader title="Risk Management" />  {/* Always visible */}
      <Suspense fallback={<RiskListSkeleton />}>
        <RiskList />  {/* Has its own skeleton */}
      </Suspense>
    </>
  )
}

// ❌ Wrong - Generic skeleton
<Suspense fallback={<ContentSkeleton />}>
  <RiskList />
</Suspense>

// ❌ Wrong - Using spinners
{isLoading && <Spinner />}
```

### Skeleton Naming Convention
| Component | Skeleton |
|-----------|----------|
| `RiskList` | `RiskListSkeleton` |
| `AssetTable` | `AssetTableSkeleton` |
| `MetricsGrid` | `MetricsGridSkeleton` |
| `RiskHeatmap` | `RiskHeatmapSkeleton` |

### What Needs a Skeleton vs What Doesn't

| Needs Skeleton (fetched) | No Skeleton (static) |
|--------------------------|----------------------|
| Data tables | Page headers |
| List components | Breadcrumbs |
| Charts/graphs | Navigation/sidebar |
| Metric cards (if fetched) | Labels/titles |
| API-fetched content | Action buttons |
| Dynamic widgets | Form fields |

### Skeleton File Structure
```
src/app/risk/
├── page.tsx           # Page component
├── risk-list.tsx      # Data component
└── risk-list-skeleton.tsx  # Matching skeleton
```

---

## 14. Git Workflow

- Use descriptive commit messages
- Keep commits atomic and focused
- Branch naming: `feature/`, `fix/`, `refactor/`

---

## Summary

This project prioritizes:
1. **Type safety** - TypeScript everywhere
2. **UI consistency** - shadcn/ui + Tailwind only
3. **Clean architecture** - Separation of concerns
4. **Developer experience** - Clear structure and conventions