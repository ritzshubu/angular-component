# Component Docs

An Angular 20 playground that showcases small, reusable UI components. The first release focuses on a responsive tooltip with configurable inputs and a documentation-style layout.

## Getting Started

```bash
npm install
npm start
```

Then open `http://localhost:4200/` to explore the component gallery. The app reloads automatically when you edit source files.

## Available Components

### Tooltip

- `text`: tooltip message (required)
- `direction`: "top" | "right" | "bottom" | "left" (defaults to "top")
- Responsive, accessible hover/focus/touch support
- Works with projected content: wrap any trigger element with `<ui-tooltip>`

### Dropdown

- `options`: array of `{ label, value, hint?, disabled? }`
- `placeholder`: helper text before a selection is made
- `selected`: value binding for controlled usage
- Emits `selectionChange` with the full option payload
- Keyboard navigation with arrow keys, Enter/Space selection, and ESC to close

### Multi-select Filter

- Supports flat or hierarchical checkbox filters with indeterminate states
- `showDropdownCount` displays per-option counts, `showFilterCount` condenses trigger label
- `showAllSelected` toggles the top-level “All Selected” row
- `initialSelection` (boolean) pre-selects everything when true
- Emits a string array; collapsed to parent value when all descendants are selected
- Includes quick clear action and responsive layout

## Project Structure

- `src/app/app.*`: shell layout with sidebar navigation, search, and routing
- `src/app/components/tooltip`: standalone tooltip component (`ui-tooltip`)
- `src/app/demos/tooltip-demo`: examples, API tables, and usage snippets
- `src/styles.css`: global resets and typography

Add new components by creating a standalone component under `src/app/components`, a matching demo under `src/app/demos`, and a route entry in `app.routes.ts`.

## Scripts

| Command | Description |
| --- | --- |
| `npm start` | Run the dev server on `http://localhost:4200` |
| `npm run build` | Production build to `dist/` |
| `npm run lint` | Lint the source files (if configured) |

## Conventions

- Prefer standalone components with external HTML/CSS/TS files
- Keep dependencies minimal (only Angular platform + tooling)
- Ensure components remain keyboard accessible and responsive
- Use `lucide-angular` icons for a lightweight, consistent visual language

Feel free to expand the gallery with more primitives following the same pattern.
