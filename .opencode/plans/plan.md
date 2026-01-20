# Plan: Add Dark/Light Mode Support

This plan outlines the steps to implement dark/light mode switching using Shadcn UI patterns and the existing Tailwind CSS configuration.

## 1. Components Implementation

### 1.1 Create `src/components/theme-provider.tsx`
We will add a context provider to manage the theme state (`light`, `dark`, or `system`). This provider will handle:
- Persisting the theme preference to `localStorage`.
- Applying the `.dark` class to the `<html>` element based on the selected theme or system preference.
- Listening for system preference changes when in "system" mode.

### 1.2 Create `src/components/mode-toggle.tsx`
We will implement a UI component to allow users to switch themes.
- It will use the `DropdownMenu` component (which we've already ensured is installed).
- It will use `Lucide` icons (`Sun`, `Moon`) to indicate current state.
- It will consume the `useTheme` hook from the provider to update settings.

## 2. Integration

### 2.1 Update `src/routes/__root.tsx`
We need to wrap the application's root component with the `ThemeProvider`.
- Import `ThemeProvider` from `src/components/theme-provider.tsx`.
- Wrap the main content (including `Header`, `Outlet`, and DevTools) with `<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">`.

### 2.2 Update `src/components/Header.tsx`
We will expose the toggle in the main navigation header.
- Import `ModeToggle` from `src/components/mode-toggle.tsx`.
- Add the `<ModeToggle />` component to the header's flex container, likely on the right side (creating a `justify-between` layout if not already present, or appending to the existing structure).

## 3. Verification

### 3.1 Code Quality
- Run `pnpm check` to ensure Biome linting and formatting rules are met.
- Run `pnpm build` to confirm there are no type errors or build issues.

### 3.2 Manual Verification (User)
- The user should be able to click the toggle in the header.
- Switching to "Dark" should apply dark styles immediately.
- Switching to "Light" should apply light styles immediately.
- "System" should mirror the OS preference.
- Refreshing the page should persist the selected mode.
