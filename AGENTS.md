# Agent Guidelines for jsonl-web-explorer

This document provides essential information for AI agents working on this codebase.

## 1. Environment & Commands

- **Package Manager:** `pnpm` (Project uses `pnpm-lock.yaml`).
- **Runtime:** Node.js (v20+ recommended).

### Core Commands

| Action | Command | Description |
| :--- | :--- | :--- |
| **Install** | `pnpm install` | Install dependencies |
| **Dev Server** | `pnpm dev` | Start development server on port 3000 |
| **Build** | `pnpm build` | Production build (Vite + tsc) |
| **Test (All)** | `pnpm test` | Run all tests via Vitest |
| **Test (Single)** | `pnpm dlx vitest run <path/to/test>` | Run a specific test file |
| **Lint** | `pnpm lint` | Run Biome linter |
| **Format** | `pnpm format` | Run Biome formatter |
| **Check** | `pnpm check` | Run Biome check (lint + format) |

## 2. Code Style & Standards

This project uses **Biome** for formatting and linting. Do not use Prettier or ESLint.

### Formatting Rules (Enforced by `biome.json`)
- **Indentation:** Tabs (not spaces).
- **Quotes:** Double quotes (`"`) preferred for strings/imports (configured in `biome.json`).
- **Semicolons:** Follow Biome defaults (typically needed in TS).
- **Imports:** Organized automatically by Biome.

### TypeScript Config
- **Strict Mode:** Enabled (`"strict": true`).
- **Path Alias:** Use `@/*` for imports from `./src/*` (e.g., `import { Button } from "@/components/ui/button"`).
- **Target:** ES2022.

### Naming Conventions
- **Components:** PascalCase (e.g., `MyComponent.tsx`).
- **Functions/Variables:** camelCase (e.g., `handleSubmit`, `isLoading`).
- **Files:**
  - Components: PascalCase (e.g., `Header.tsx`).
  - Utilities/Hooks: camelCase (e.g., `useAuth.ts`, `utils.ts`).
  - Constants: SCREAMING_SNAKE_CASE (if global constant).

## 3. Architecture & Libraries

- **Framework:** React 19 + Vite.
- **Routing:** `@tanstack/react-router`.
  - Route tree is generated (`routeTree.gen.ts`).
  - New routes often require creating files in `src/routes/` (check project structure).
- **Styling:** Tailwind CSS v4.
- **UI Components:** Shadcn UI.
  - Located in `src/components/ui`.
  - Icons: `lucide-react`.

## 4. Testing Guidelines

- **Framework:** Vitest + React Testing Library.
- **Location:** Co-located with source files (e.g., `Button.test.tsx`) or in `__tests__` directory.
- **Writing Tests:**
  - Use `describe` blocks to group tests.
  - Use `it` or `test` for individual test cases.
  - Use `@testing-library/react` for component rendering and interaction.
  - Mock external dependencies where appropriate.

## 5. Specific Rules (from .cursorrules)

### Shadcn Instructions
Use the latest version of Shadcn to install new components.
Example command to add a button component:

```bash
pnpm dlx shadcn@latest add button
```

## 6. Workflow for Agents

1.  **Analyze:** Always read `package.json` and `biome.json` first if unsure about scripts or rules.
2.  **Verify:** After making changes, run `pnpm check` to ensure formatting and linting pass.
3.  **Test:** If editing logic, run `pnpm test`. If creating new features, add basic tests.
4.  **Path Resolution:** When importing, use the `@/` alias for cleaner imports.
5.  **Dependencies:** Do not add new libraries without good reason. Use existing ones (`date-fns`, `clsx`, `tailwind-merge`) if available.
