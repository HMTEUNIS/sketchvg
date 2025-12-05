import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ShapeMode } from "@/lib/drawingTypes";
import { Square, SquareDashedBottom } from "lucide-react";

interface ShapeModeToggleProps {
  mode: ShapeMode;
  onChange: (mode: ShapeMode) => void;
}

export function ShapeModeToggle({ mode, onChange }: ShapeModeToggleProps) {
  return (
    <div 
      className="flex flex-col items-center gap-1"
      role="radiogroup"
      aria-label="Shape fill mode"
    >
      <Button
        variant={mode === 'fill' ? "default" : "ghost"}
        size="icon"
        onClick={() => onChange('fill')}
        className={cn(
          "w-10 h-10",
          mode === 'fill' && "ring-1 ring-ring"
        )}
        data-testid="button-shape-mode-fill"
        aria-checked={mode === 'fill'}
        role="radio"
        aria-label="Fill"
      >
        <Square className="w-5 h-5 fill-current" />
      </Button>

      <Button
        variant={mode === 'outline' ? "default" : "ghost"}
        size="icon"
        onClick={() => onChange('outline')}
        className={cn(
          "w-10 h-10",
          mode === 'outline' && "ring-1 ring-ring"
        )}
        data-testid="button-shape-mode-outline"
        aria-checked={mode === 'outline'}
        role="radio"
        aria-label="Outline"
      >
        <SquareDashedBottom className="w-5 h-5" />
      </Button>
    </div>
  );
}

