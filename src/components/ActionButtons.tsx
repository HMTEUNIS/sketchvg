import { Button } from "@/components/ui/button";
import { Undo2, Redo2, Trash2, Download } from "lucide-react";

interface ActionButtonsProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onExport?: () => void;
}

export function ActionButtons({ canUndo, canRedo, onUndo, onRedo, onClear, onExport }: ActionButtonsProps) {
  return (
    <div className="flex items-center gap-2" data-testid="action-buttons">
      <Button
        variant="outline"
        size="icon"
        onClick={onUndo}
        disabled={!canUndo}
        data-testid="button-undo"
        aria-label="Undo last action"
      >
        <Undo2 className="w-4 h-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={onRedo}
        disabled={!canRedo}
        data-testid="button-redo"
        aria-label="Redo last action"
      >
        <Redo2 className="w-4 h-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={onClear}
        data-testid="button-clear"
        aria-label="Clear canvas"
      >
        <Trash2 className="w-4 h-4" />
      </Button>

      {onExport && (
        <Button
          variant="outline"
          size="icon"
          onClick={onExport}
          data-testid="button-export"
          aria-label="Export as SVG"
        >
          <Download className="w-4 h-4" />
          <span>SVG</span>
        </Button>
      )}
    </div>
  );
}

