import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { BRUSH_SIZES } from "@/lib/drawingTypes";
import { cn } from "@/lib/utils";
import { Settings2 } from "lucide-react";

interface BrushSizeMenuProps {
  selectedSize: number;
  onSizeSelect: (size: number) => void;
}

export function BrushSizeMenu({ selectedSize, onSizeSelect }: BrushSizeMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedBrush = BRUSH_SIZES.find(b => b.value === selectedSize);

  return (
    <>
      {/* Mobile: Collapsible button */}
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="md:hidden flex items-center gap-2"
        aria-label="Brush size"
      >
        <Settings2 className="w-4 h-4" />
        <div
          className="rounded-full bg-current"
          style={{
            width: Math.min(selectedSize + 4, 20),
            height: Math.min(selectedSize + 4, 20),
          }}
        />
      </Button>

      {/* Mobile: Dialog menu */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-xs">
          <h3 className="text-lg font-semibold mb-4">Brush Size</h3>
          <div className="grid grid-cols-2 gap-3">
            {BRUSH_SIZES.map(({ name, value }) => (
              <Button
                key={value}
                variant={selectedSize === value ? "default" : "outline"}
                onClick={() => {
                  onSizeSelect(value);
                  setIsOpen(false);
                }}
                className={cn(
                  "h-16 flex flex-col items-center justify-center gap-2",
                  selectedSize === value && "ring-2 ring-ring"
                )}
                aria-checked={selectedSize === value}
                role="radio"
                aria-label={name}
              >
                <div
                  className={cn(
                    "rounded-full",
                    selectedSize === value 
                      ? "bg-primary-foreground" 
                      : "bg-foreground"
                  )}
                  style={{
                    width: Math.min(value + 4, 20),
                    height: Math.min(value + 4, 20),
                  }}
                />
                <span className="text-xs">{name}</span>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

