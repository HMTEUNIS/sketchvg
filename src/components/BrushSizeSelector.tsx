import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BRUSH_SIZES } from "@/lib/drawingTypes";

interface BrushSizeSelectorProps {
  selectedSize: number;
  onSizeSelect: (size: number) => void;
}

export function BrushSizeSelector({ selectedSize, onSizeSelect }: BrushSizeSelectorProps) {
  return (
    <div 
      className="flex items-center gap-1.5"
      role="radiogroup"
      aria-label="Brush size selection"
      data-testid="brush-size-selector"
    >
      {BRUSH_SIZES.map(({ name, value }) => (
        <Button
          key={value}
          variant={selectedSize === value ? "default" : "ghost"}
          size="icon"
          onClick={() => onSizeSelect(value)}
          className={cn(
            "w-9 h-9",
            selectedSize === value && "ring-1 ring-ring"
          )}
          aria-checked={selectedSize === value}
          role="radio"
          aria-label={name}
          data-testid={`button-brush-size-${value}`}
        >
          {/* Visual representation of brush size */}
          <div
            className={cn(
              "rounded-full bg-current",
              selectedSize === value 
                ? "text-primary-foreground" 
                : "text-foreground"
            )}
            style={{
              width: Math.min(value + 4, 20),
              height: Math.min(value + 4, 20),
            }}
          />
        </Button>
      ))}
    </div>
  );
}

