# JSONL Web Explorer

A modern, web-based tool for exploring, analyzing, and visualizing JSONL (JSON Lines) log files. This application allows users to easily upload multiple log files, search through entries, and view detailed structured data in a clean interface.

## Features

- **Drag & Drop Upload**: Simply drag JSONL files onto the interface to load them instantly.
- **Multi-file Support**: Manage multiple log files simultaneously via the sidebar.
- **Advanced Filtering**: Real-time search and filtering across all log messages and metadata.
- **Detailed Inspection**: Click on any log entry to view its full structured data in a dedicated panel.
- **Responsive Design**: Collapsible sidebar and flexible layout powered by `react-resizable-panels`.
- **Dark Mode**: Fully supported dark/light theme switching.

## Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) (Radix UI)
- **Routing**: [TanStack Router](https://tanstack.com/router)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Testing**: [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/)

## Getting Started

### Prerequisites

- Node.js (v20+ recommended)
- [pnpm](https://pnpm.io/) package manager

### Installation

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

### Development

Start the development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

## Building for Production

To create a production-ready build:

```bash
pnpm build
```

## Quality & Testing

### Running Tests

Run the test suite using Vitest:

```bash
pnpm test
```

### Linting & Formatting

This project uses [Biome](https://biomejs.dev/) for fast linting and formatting.

```bash
# Format code
pnpm format

# Lint code
pnpm lint

# Run both linting and formatting checks
pnpm check
```
