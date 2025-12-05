import { ColorPalette } from "./ColorPalette";
import { BrushSizeSelector } from "./BrushSizeSelector";
import { BrushSizeMenu } from "./BrushSizeMenu";
import { ActionButtons } from "./ActionButtons";
import { Separator } from "@/components/ui/separator";

interface TopBarProps {
  selectedColor: string;
  brushSize: number;
  canUndo: boolean;
  canRedo: boolean;
  onColorSelect: (color: string) => void;
  onColorPickerOpen: () => void;
  onBrushSizeSelect: (size: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onExport?: () => void;
}

export function TopBar({
  selectedColor,
  brushSize,
  canUndo,
  canRedo,
  onColorSelect,
  onColorPickerOpen,
  onBrushSizeSelect,
  onUndo,
  onRedo,
  onClear,
  onExport,
}: TopBarProps) {
  return (
    <header 
      className="h-16 bg-sidebar border-b border-sidebar-border flex items-center justify-between gap-4 px-4"
      data-testid="top-bar"
    >
      {/* Left section: Colors and Brush Size */}
      <div className="flex items-center gap-4 flex-wrap">
        <ColorPalette
          selectedColor={selectedColor}
          onColorSelect={onColorSelect}
          onColorPickerOpen={onColorPickerOpen}
        />
        <Separator orientation="vertical" className="h-8" />
        {/* Desktop: Show full brush size selector */}
        <div className="hidden md:block">
          <BrushSizeSelector
            selectedSize={brushSize}
            onSizeSelect={onBrushSizeSelect}
          />
        </div>
        {/* Mobile: Show collapsible menu */}
        <div className="md:hidden">
          <BrushSizeMenu
            selectedSize={brushSize}
            onSizeSelect={onBrushSizeSelect}
          />
        </div>
      </div>

      {/* Right section: Action buttons */}
      <ActionButtons
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={onUndo}
        onRedo={onRedo}
        onClear={onClear}
        onExport={onExport}
      />
    </header>
  );
}

