import { useState, useRef, useCallback, useEffect } from "react";
import { Toolbar } from "@/components/Toolbar";
import { TopBar } from "@/components/TopBar";
import { DrawingCanvas, type DrawingCanvasRef } from "@/components/DrawingCanvas";
import { ColorPickerDialog } from "@/components/ColorPickerDialog";
import { exportCanvasToSVG, downloadSVG } from "@/lib/canvasExport";
import type { Tool, ShapeMode, DrawAction } from "@/lib/drawingTypes";
import { COLOR_PALETTE } from "@/lib/drawingTypes";

export default function Paint() {
  const [selectedTool, setSelectedTool] = useState<Tool>('pencil');
  const [selectedColor, setSelectedColor] = useState(COLOR_PALETTE[0].value);
  const [brushSize, setBrushSize] = useState(8);
  const [shapeMode, setShapeMode] = useState<ShapeMode>('outline');
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const canvasRef = useRef<DrawingCanvasRef>(null);
  
  // History management
  const historyRef = useRef<ImageData[]>([]);
  const redoStackRef = useRef<ImageData[]>([]);
  const [undoTrigger, setUndoTrigger] = useState(0);
  const [redoTrigger, setRedoTrigger] = useState(0);
  const [clearTrigger, setClearTrigger] = useState(0);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl/Cmd modifier
      const isModifierPressed = e.ctrlKey || e.metaKey;

      if (isModifierPressed) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          handleUndo();
        } else if ((e.key === 'y') || (e.key === 'z' && e.shiftKey)) {
          e.preventDefault();
          handleRedo();
        }
      } else {
        // Tool shortcuts
        switch (e.key.toLowerCase()) {
          case 'p':
            setSelectedTool('pencil');
            break;
          case 'l':
            setSelectedTool('line');
            break;
          case 'r':
            setSelectedTool('rectangle');
            break;
          case 'c':
            setSelectedTool('circle');
            break;
          case 'e':
            setSelectedTool('eraser');
            break;
          case 'f':
            setSelectedTool('fill');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleUndo = useCallback(() => {
    if (historyRef.current.length > 0) {
      setUndoTrigger(prev => prev + 1);
    }
  }, []);

  const handleRedo = useCallback(() => {
    if (redoStackRef.current.length > 0) {
      setRedoTrigger(prev => prev + 1);
    }
  }, []);

  const handleClear = useCallback(() => {
    setClearTrigger(prev => prev + 1);
  }, []);

  const handleExport = useCallback(() => {
    const canvas = canvasRef.current?.getCanvas();
    if (!canvas) return;
    
    try {
      const svgString = exportCanvasToSVG(canvas);
      downloadSVG(svgString, 'drawing.svg');
    } catch (error) {
      console.error('Error exporting canvas:', error);
    }
  }, []);

  const handleDrawAction = useCallback((action: DrawAction) => {
    // Clear redo stack when a new action is performed
    redoStackRef.current = [];
  }, []);

  const canUndo = historyRef.current.length > 0;
  const canRedo = redoStackRef.current.length > 0;

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <TopBar
        selectedColor={selectedColor}
        brushSize={brushSize}
        canUndo={canUndo}
        canRedo={canRedo}
        onColorSelect={setSelectedColor}
        onColorPickerOpen={() => setIsColorPickerOpen(true)}
        onBrushSizeSelect={setBrushSize}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onClear={handleClear}
        onExport={handleExport}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Toolbar
          selectedTool={selectedTool}
          shapeMode={shapeMode}
          onToolSelect={setSelectedTool}
          onShapeModeChange={setShapeMode}
        />
        
        <DrawingCanvas
          ref={canvasRef}
          tool={selectedTool}
          color={selectedColor}
          brushSize={brushSize}
          shapeMode={shapeMode}
          onDrawAction={handleDrawAction}
          undoTrigger={undoTrigger}
          redoTrigger={redoTrigger}
          clearTrigger={clearTrigger}
          historyRef={historyRef}
          redoStackRef={redoStackRef}
        />
      </div>

      <ColorPickerDialog
        isOpen={isColorPickerOpen}
        onClose={() => setIsColorPickerOpen(false)}
        currentColor={selectedColor}
        onColorSelect={setSelectedColor}
      />
    </div>
  );
}

