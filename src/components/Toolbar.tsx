import { Separator } from "@/components/ui/separator";
import { ToolButton } from "./ToolButton";
import { ShapeModeToggle } from "./ShapeModeToggle";
import type { Tool, ShapeMode } from "@/lib/drawingTypes";
import { 
  Pencil, 
  Minus, 
  Square, 
  Circle, 
  Eraser, 
  PaintBucket,
} from "lucide-react";

interface ToolbarProps {
  selectedTool: Tool;
  shapeMode: ShapeMode;
  onToolSelect: (tool: Tool) => void;
  onShapeModeChange: (mode: ShapeMode) => void;
}

const DRAWING_TOOLS: { tool: Tool; icon: typeof Pencil; label: string }[] = [
  { tool: 'pencil', icon: Pencil, label: 'Pencil' },
  { tool: 'line', icon: Minus, label: 'Line' },
  { tool: 'rectangle', icon: Square, label: 'Rectangle' },
  { tool: 'circle', icon: Circle, label: 'Circle' },
];

const UTILITY_TOOLS: { tool: Tool; icon: typeof Pencil; label: string }[] = [
  { tool: 'eraser', icon: Eraser, label: 'Eraser' },
  { tool: 'fill', icon: PaintBucket, label: 'Fill Bucket' },
];

export function Toolbar({ 
  selectedTool, 
  shapeMode,
  onToolSelect, 
  onShapeModeChange,
}: ToolbarProps) {
  const isShapeTool = selectedTool === 'rectangle' || selectedTool === 'circle';

  return (
    <aside 
      className="w-20 bg-sidebar border-r border-sidebar-border flex flex-col items-center py-4 gap-2 overflow-y-auto overflow-x-hidden h-full"
      role="toolbar"
      aria-label="Drawing tools"
      data-testid="toolbar"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {/* Drawing Tools */}
      <div className="flex flex-col items-center gap-2">
        {DRAWING_TOOLS.map(({ tool, icon, label }) => (
          <ToolButton
            key={tool}
            tool={tool}
            icon={icon}
            label={label}
            isSelected={selectedTool === tool}
            onClick={() => onToolSelect(tool)}
          />
        ))}
      </div>
      <Separator orientation="horizontal" className="w-12 my-2" />

      {/* Utility Tools */}
      <div className="flex flex-col items-center gap-2">
        {UTILITY_TOOLS.map(({ tool, icon, label }) => (
          <ToolButton
            key={tool}
            tool={tool}
            icon={icon}
            label={label}
            isSelected={selectedTool === tool}
            onClick={() => onToolSelect(tool)}
          />
        ))}
      </div>

      {/* Shape Mode Toggle - appears when shape tool is selected */}
      {isShapeTool && (
        <>
          <Separator orientation="horizontal" className="w-12 my-2" />
          <ShapeModeToggle
            mode={shapeMode}
            onChange={onShapeModeChange}
          />
        </>
      )}
    </aside>
  );
}

