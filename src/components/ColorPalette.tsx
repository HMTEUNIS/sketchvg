import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { COLOR_PALETTE } from "@/lib/drawingTypes";
import { Pipette } from "lucide-react";

interface ColorPaletteProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
  onColorPickerOpen: () => void;
}

export function ColorPalette({ 
  selectedColor, 
  onColorSelect, 
  onColorPickerOpen 
}: ColorPaletteProps) {
  return (
    <div 
      className="flex items-center gap-2"
      role="radiogroup"
      aria-label="Color selection"
      data-testid="color-palette"
    >
      {/* Current color indicator */}
      <div 
        className="w-10 h-10 rounded-md border-2 border-border shadow-sm flex-shrink-0"
        style={{ backgroundColor: selectedColor }}
        aria-label={`Current color: ${selectedColor}`}
        data-testid="current-color-display"
      />

      {/* Color swatches */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {COLOR_PALETTE.map(({ name, value }) => (
          <button
            key={value}
            onClick={() => onColorSelect(value)}
            className={cn(
              "w-8 h-8 rounded-full border-2 transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              selectedColor === value 
                ? "border-foreground scale-110 shadow-md" 
                : "border-border hover:scale-105",
              value === '#FFFFFF' && "border-muted"
            )}
            style={{ backgroundColor: value }}
            aria-checked={selectedColor === value}
            role="radio"
            aria-label={name}
            data-testid={`button-color-${name.toLowerCase()}`}
          />
        ))}
        {/* Color picker button */}
        <Button
          variant="outline"
          size="icon"
          onClick={onColorPickerOpen}
          className="w-8 h-8 rounded-full"
          aria-label="Open color picker"
          data-testid="button-color-picker"
        >
          <Pipette className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

