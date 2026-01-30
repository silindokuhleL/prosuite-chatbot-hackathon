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

---

## 2. Project Structure

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

## 3. Component Rules

### Global Components (`src/components`)
- **ui/**: shadcn/ui components ONLY - do not modify
- **layout/**: Headers, sidebars, navigation shells
- **shared/**: Reusable components like loaders, empty states, error boundaries

### Component Guidelines
- Use shadcn/ui components as base
- Style with Tailwind CSS only
- Keep components small and focused
- Prefer composition over configuration

---

## 4. Type System Rules

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

## 5. Import Order (Enforced)

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

## 6. Page Structure (App Router)

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

## 7. Styling Rules

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

## 8. Data Fetching

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

## 9. Configuration

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

## 10. Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| Files/Folders | kebab-case | `chat-interface.tsx` |
| Components | PascalCase | `ChatMessage` |
| Hooks | useCamelCase | `useChatbot` |
| Functions | camelCase | `sendMessage` |
| Constants | UPPER_SNAKE_CASE | `MAX_MESSAGES` |
| Types/Interfaces | PascalCase | `Message`, `ChatSession` |

---

## 11. Code Quality

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

## 12. Git Workflow

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