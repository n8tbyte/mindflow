# MindFlow

Text-to-Mind-Map converter. Type indented text, get a mind map in real-time.

![MindFlow](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Vite](https://img.shields.io/badge/Vite-6-purple)

## Features

- **Real-time conversion** — Text updates reflect instantly on the canvas
- **Indentation-based hierarchy** — Use `Tab` / `Shift+Tab` to structure content
- **Auto-fit layout** — Mind map automatically fits the viewport
- **3 Themes** — Default, Colorful, Dark (iOS-style)
- **Export** — PNG / SVG at 1920×1080, centered with 40px padding
- **Fullscreen mode** — Distraction-free editing
- **Auto-save** — Persists to `localStorage` automatically
- **Inline editing** — Double-click any node to rename it
- **Draggable nodes** — Rearrange nodes manually

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + Vite |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Mind Map Engine | React Flow |
| State Management | Zustand |
| Icons | Lucide React |
| Export | html-to-image |

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Build

```bash
npm run build
```

Output in `dist/`

## Usage

### Text Format

Use indentation (2 spaces or Tab) to create hierarchy:

```
Root Topic
  Sub Topic A
    Detail 1
    Detail 2
  Sub Topic B
    Detail 3
```

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Tab` | Indent line |
| `Shift+Tab` | Outdent line |
| `Ctrl/Cmd+S` | Export PNG |
| `Ctrl/Cmd+Shift+F` | Toggle fullscreen |
| `Double-click node` | Edit node text |
| `Enter` | Confirm edit |
| `Escape` | Cancel edit |

### Toolbar

- **Auto** — Fit mind map to viewport
- **Default / Colorful / Dark** — Switch theme
- **PNG / SVG** — Export as 1920×1080 image

### Export

Exported images are:
- Resolution: 1920 × 1080 pixels
- Content: Centered with 40px padding
- Background: Matches current theme (white/black)
- Controls hidden: Zoom controls and minimap excluded

## Project Structure

```
src/
├── components/
│   ├── CustomNode.tsx      # Mind map node component
│   ├── MindMapCanvas.tsx   # React Flow canvas
│   ├── TextEditor.tsx      # Indentation-aware editor
│   └── Toolbar.tsx         # Top toolbar
├── store/
│   └── mindmapStore.ts     # Zustand state
├── utils/
│   └── textParser.ts       # Text → tree → nodes/edges
├── App.tsx
└── index.css
```

## License

MIT
