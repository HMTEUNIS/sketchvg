import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface ColorPickerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentColor: string;
  onColorSelect: (color: string) => void;
}

export function ColorPickerDialog({
  isOpen,
  onClose,
  currentColor,
  onColorSelect,
}: ColorPickerDialogProps) {
  const [selectedColor, setSelectedColor] = useState(currentColor);

  useEffect(() => {
    setSelectedColor(currentColor);
  }, [currentColor]);

  const handleConfirm = () => {
    onColorSelect(selectedColor);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choose a Custom Color</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center gap-4 py-4">
          {/* Color preview */}
          <div className="flex items-center gap-4 w-full">
            <div 
              className="w-16 h-16 rounded-md border-2 border-border shadow-sm"
              style={{ backgroundColor: selectedColor }}
            />
            <div className="flex-1">
              <label className="text-sm text-muted-foreground mb-1 block">
                Selected Color
              </label>
              <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                {selectedColor}
              </code>
            </div>
          </div>

          {/* Native color input */}
          <div className="w-full">
            <label className="text-sm text-muted-foreground mb-2 block">
              Pick from color wheel
            </label>
            <input
              type="color"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="w-full h-12 cursor-pointer rounded-md border border-border"
              data-testid="input-color-picker"
            />
          </div>

          {/* Hex input */}
          <div className="w-full">
            <label className="text-sm text-muted-foreground mb-2 block">
              Or enter hex code
            </label>
            <input
              type="text"
              value={selectedColor}
              onChange={(e) => {
                const value = e.target.value;
                if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                  setSelectedColor(value);
                }
              }}
              placeholder="#000000"
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
              data-testid="input-hex-color"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} data-testid="button-cancel-color">
            Cancel
          </Button>
          <Button onClick={handleConfirm} data-testid="button-confirm-color">
            Apply Color
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

