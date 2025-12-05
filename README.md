# SketchVG - Paint App

A Microsoft Paint-like application built with React, TypeScript, and Vite for drawing and exporting SVGs.

## Features

- 🎨 2D drawing tools (pencil, line, rectangle, circle)
- 🗑️ Eraser and flood fill
- 📏 Adjustable brush sizes
- 🎨 Color palette and custom color picker
- ↶ Undo/Redo functionality
- 📥 Export drawings as SVG
- 💾 History management

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the URL shown in the terminal (typically `http://localhost:5173`)

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Deployment to GitHub Pages

This project is configured for automatic deployment to GitHub Pages via GitHub Actions.

### Automatic Deployment

1. Push your code to the `main` branch
2. Go to your repository Settings → Pages
3. Under "Source", select "GitHub Actions"
4. The workflow will automatically build and deploy on every push to `main`

### Manual Deployment

If you need to deploy manually or to a different branch:

1. Build the project:
```bash
npm run build
```

2. Copy the contents of the `dist` folder to the `gh-pages` branch

### Configuration

The base path is configured in `vite.config.ts` as `/sketchvg/`. If your repository name is different:
1. Update `base` in `vite.config.ts`
2. Update `pathSegmentsToKeep` in `public/404.html` if needed

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # UI primitives (Button, Dialog, etc.)
│   ├── DrawingCanvas.tsx
│   ├── Toolbar.tsx
│   ├── TopBar.tsx
│   └── Shape3DPicker.tsx  # 3D shape selection component
├── lib/
│   ├── drawingTypes.ts     # Type definitions
│   └── shape3dUtils.ts     # Three.js rendering utilities
├── pages/
│   └── paint.tsx           # Main paint page
└── hooks/
    └── useToast.ts         # Toast notification hook
```

## Technologies Used

- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Three.js** - 3D graphics library for rendering 3D shapes
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI component library (custom implementation)
- **Wouter** - Lightweight routing
- **TanStack Query** - Data fetching (configured for future use)

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Pencil | `P` |
| Line | `L` |
| Rectangle | `R` |
| Circle | `C` |
| Eraser | `E` |
| Fill Bucket | `F` |
| Undo | `Ctrl+Z` or `Cmd+Z` |
| Redo | `Ctrl+Y` or `Cmd+Y` |

## Development

The project uses:
- **TypeScript** for type safety
- **ESLint** for code linting
- **Tailwind CSS** for styling with custom design tokens
- **Path aliases** - Use `@/` to import from `src/`

## License

MIT

# sketchvg
# sketchvg
