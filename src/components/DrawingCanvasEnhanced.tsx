import { useRef, useEffect, useCallback, useState } from "react";
import type { Tool, ShapeMode, Point, DrawAction, Shape3DType, Shape3D } from "@/lib/drawingTypes";
import { renderShape3DToImageData } from "@/lib/shape3dUtils";
import { InteractiveShape3D } from "./InteractiveShape3D";

interface DrawingCanvasEnhancedProps {
  tool: Tool;
  color: string;
  brushSize: number;
  shapeMode: ShapeMode;
  shape3dType?: Shape3DType;
  onDrawAction: (action: DrawAction) => void;
  undoTrigger: number;
  redoTrigger: number;
  clearTrigger: number;
  historyRef: React.MutableRefObject<ImageData[]>;
  redoStackRef: React.MutableRefObject<ImageData[]>;
}

export function DrawingCanvasEnhanced({
  tool,
  color,
  brushSize,
  shapeMode,
  shape3dType = 'box',
  onDrawAction,
  undoTrigger,
  redoTrigger,
  clearTrigger,
  historyRef,
  redoStackRef,
}: DrawingCanvasEnhancedProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [currentPoints, setCurrentPoints] = useState<Point[]>([]);
  const [previewImageData, setPreviewImageData] = useState<ImageData | null>(null);
  
  // 3D Shapes management
  const [shapes3D, setShapes3D] = useState<Shape3D[]>([]);
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const [canvasRect, setCanvasRect] = useState<DOMRect | null>(null);
  
  // Track previous trigger values to detect changes
  const prevUndoTrigger = useRef(0);
  const prevRedoTrigger = useRef(0);
  const prevClearTrigger = useRef(0);
  const isInitialized = useRef(false);
  const shapeIdCounter = useRef(0);

  // Generate unique ID for shapes
  const generateShapeId = useCallback(() => {
    return `shape3d-${++shapeIdCounter.current}`;
  }, []);

  // Update canvas rect when container changes
  useEffect(() => {
    const updateRect = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        setCanvasRect(canvas.getBoundingClientRect());
      }
    };

    updateRect();
    const interval = setInterval(updateRect, 100);
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect);
    };
  }, []);

  // Get canvas context helper
  const getContext = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return canvas.getContext('2d', { willReadFrequently: true });
  }, []);

  // Get mouse position relative to canvas
  const getMousePosition = useCallback((e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }, []);

  // Save current state to history
  const saveToHistory = useCallback(() => {
    const ctx = getContext();
    const canvas = canvasRef.current;
    if (!ctx || !canvas || canvas.width === 0 || canvas.height === 0) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    historyRef.current.push(imageData);

    // Limit history to prevent memory issues
    if (historyRef.current.length > 50) {
      historyRef.current.shift();
    }
  }, [getContext, historyRef]);

  // Render all 3D shapes to the base canvas
  const renderAllShapesToCanvas = useCallback(async () => {
    const ctx = getContext();
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    // Clear canvas and redraw all shapes
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Render each shape
    for (const shape of shapes3D) {
      if (shape.imageData) {
        const x = shape.x - shape.width / 2;
        const y = shape.y - shape.height / 2;
        ctx.putImageData(shape.imageData, x, y);
      } else {
        // Render if not cached
        try {
          const imageData = await renderShape3DToImageData(
            shape.type,
            shape.color,
            shape.width,
            shape.height,
            shape.rotation
          );
          const x = shape.x - shape.width / 2;
          const y = shape.y - shape.height / 2;
          ctx.putImageData(imageData, x, y);
          
          // Cache the image data
          setShapes3D(prev => prev.map(s => 
            s.id === shape.id ? { ...s, imageData } : s
          ));
        } catch (error) {
          console.error('Error rendering 3D shape:', error);
        }
      }
    }
  }, [getContext, shapes3D]);

  // Handle 3D shape creation
  const handleCreateShape3D = useCallback(async (point: Point) => {
    const size = Math.max(brushSize * 10, 100);
    const defaultRotation = { x: 0.5, y: 0.5, z: 0 };
    
    const newShape: Shape3D = {
      id: generateShapeId(),
      type: shape3dType,
      x: point.x,
      y: point.y,
      width: size,
      height: size,
      color: color,
      rotation: defaultRotation,
    };

    setShapes3D(prev => [...prev, newShape]);
    setSelectedShapeId(newShape.id);
    saveToHistory();
  }, [brushSize, shape3dType, color, generateShapeId, saveToHistory]);

  // Handle 3D shape move
  const handleShapeMove = useCallback((id: string, x: number, y: number) => {
    setShapes3D(prev => prev.map(s => s.id === id ? { ...s, x, y, imageData: undefined } : s));
  }, []);

  // Handle 3D shape resize
  const handleShapeResize = useCallback((id: string, width: number, height: number) => {
    setShapes3D(prev => prev.map(s => 
      s.id === id ? { ...s, width, height, imageData: undefined } : s
    ));
  }, []);

  // Handle selection tool click
  const handleSelectToolClick = useCallback((point: Point) => {
    // Find shape at point
    const clickedShape = shapes3D.find(shape => {
      const x = shape.x - shape.width / 2;
      const y = shape.y - shape.height / 2;
      return (
        point.x >= x &&
        point.x <= x + shape.width &&
        point.y >= y &&
        point.y <= y + shape.height
      );
    });

    if (clickedShape) {
      setSelectedShapeId(clickedShape.id);
    } else {
      setSelectedShapeId(null);
    }
  }, [shapes3D]);

  // Draw a line between two points (for pencil/eraser)
  const drawLine = useCallback((ctx: CanvasRenderingContext2D, from: Point, to: Point, isEraser: boolean) => {
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.strokeStyle = isEraser ? '#FFFFFF' : color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  }, [color, brushSize]);

  // Draw a straight line between two points
  const drawStraightLine = useCallback((ctx: CanvasRenderingContext2D, from: Point, to: Point) => {
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.stroke();
  }, [color, brushSize]);

  // Draw a rectangle
  const drawRectangle = useCallback((ctx: CanvasRenderingContext2D, from: Point, to: Point, mode: ShapeMode) => {
    const width = to.x - from.x;
    const height = to.y - from.y;

    ctx.beginPath();
    if (mode === 'fill') {
      ctx.fillStyle = color;
      ctx.fillRect(from.x, from.y, width, height);
    } else {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.strokeRect(from.x, from.y, width, height);
    }
  }, [color, brushSize]);

  // Draw a circle/ellipse
  const drawCircle = useCallback((ctx: CanvasRenderingContext2D, from: Point, to: Point, mode: ShapeMode) => {
    const radiusX = Math.abs(to.x - from.x) / 2;
    const radiusY = Math.abs(to.y - from.y) / 2;
    const centerX = from.x + (to.x - from.x) / 2;
    const centerY = from.y + (to.y - from.y) / 2;
    
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);

    if (mode === 'fill') {
      ctx.fillStyle = color;
      ctx.fill();
    } else {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.stroke();
    }
  }, [color, brushSize]);

  // Flood fill algorithm
  const floodFill = useCallback((startX: number, startY: number, fillColorHex: string) => {
    const ctx = getContext();
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    const width = canvas.width;
    const height = canvas.height;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    const pixelX = Math.floor(startX);
    const pixelY = Math.floor(startY);
    
    if (pixelX < 0 || pixelX >= width || pixelY < 0 || pixelY >= height) return;
    
    const startIdx = (pixelY * width + pixelX) * 4;
    const startR = data[startIdx];
    const startG = data[startIdx + 1];
    const startB = data[startIdx + 2];
    const startA = data[startIdx + 3];

    const fillColor = hexToRgb(fillColorHex);
    if (!fillColor) return;

    if (
      Math.abs(startR - fillColor.r) < 5 &&
      Math.abs(startG - fillColor.g) < 5 &&
      Math.abs(startB - fillColor.b) < 5 &&
      startA === 255
    ) {
      return;
    }

    saveToHistory();

    const stack: [number, number][] = [[pixelX, pixelY]];
    const visited = new Uint8Array(width * height);
    const tolerance = 32;

    const matchesStartColor = (idx: number): boolean => {
      return (
        Math.abs(data[idx] - startR) <= tolerance &&
        Math.abs(data[idx + 1] - startG) <= tolerance &&
        Math.abs(data[idx + 2] - startB) <= tolerance &&
        Math.abs(data[idx + 3] - startA) <= tolerance
      );
    };

    const setPixel = (idx: number) => {
      data[idx] = fillColor.r;
      data[idx + 1] = fillColor.g;
      data[idx + 2] = fillColor.b;
      data[idx + 3] = 255;
    };

    while (stack.length > 0) {
      const [x, y] = stack.pop()!;
      const visitIdx = y * width + x;
      
      if (x < 0 || x >= width || y < 0 || y >= height) continue;
      if (visited[visitIdx]) continue;
      
      const idx = visitIdx * 4;
      if (!matchesStartColor(idx)) continue;

      visited[visitIdx] = 1;
      setPixel(idx);

      stack.push([x + 1, y]);
      stack.push([x - 1, y]);
      stack.push([x, y + 1]);
      stack.push([x, y - 1]);
    }

    ctx.putImageData(imageData, 0, 0);
  }, [getContext, saveToHistory]);

  // Handle mouse down
  const handleMouseDown = useCallback(async (e: React.MouseEvent<HTMLCanvasElement>) => {
    const point = getMousePosition(e);
    const ctx = getContext();
    if (!ctx) return;

    if (tool === 'select') {
      handleSelectToolClick(point);
      return;
    }

    if (tool === 'fill') {
      floodFill(point.x, point.y, color);
      onDrawAction({
        type: tool,
        color,
        brushSize,
        shapeMode,
        points: [point],
        startPoint: point,
        endPoint: point,
      });
      return;
    }

    if (tool === 'shape3d') {
      await handleCreateShape3D(point);
      return;
    }

    setIsDrawing(true);
    setStartPoint(point);
    setCurrentPoints([point]);
    saveToHistory();
    
    if (tool === 'line' || tool === 'rectangle' || tool === 'circle') {
      const canvas = canvasRef.current;
      if (canvas) {
        setPreviewImageData(ctx.getImageData(0, 0, canvas.width, canvas.height));
      }
    }
  }, [
    getMousePosition,
    getContext,
    tool,
    color,
    brushSize,
    shapeMode,
    floodFill,
    saveToHistory,
    onDrawAction,
    handleCreateShape3D,
    handleSelectToolClick,
  ]);

  // Handle mouse move
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPoint) return;

    const point = getMousePosition(e);
    const ctx = getContext();
    if (!ctx) return;

    if (tool === 'pencil' || tool === 'eraser') {
      const lastPoint = currentPoints[currentPoints.length - 1] || startPoint;
      drawLine(ctx, lastPoint, point, tool === 'eraser');
      setCurrentPoints(prev => [...prev, point]);
    } else if (tool === 'line' || tool === 'rectangle' || tool === 'circle') {
      if (previewImageData) {
        ctx.putImageData(previewImageData, 0, 0);
      }

      if (tool === 'line') {
        drawStraightLine(ctx, startPoint, point);
      } else if (tool === 'rectangle') {
        drawRectangle(ctx, startPoint, point, shapeMode);
      } else if (tool === 'circle') {
        drawCircle(ctx, startPoint, point, shapeMode);
      }
    }
  }, [
    isDrawing,
    startPoint,
    currentPoints,
    getMousePosition,
    getContext,
    tool,
    shapeMode,
    previewImageData,
    drawLine,
    drawStraightLine,
    drawRectangle,
    drawCircle,
  ]);

  // Handle mouse up
  const handleMouseUp = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPoint) {
      setIsDrawing(false);
      return;
    }

    const point = getMousePosition(e);
    const ctx = getContext();

    if (ctx && (tool === 'line' || tool === 'rectangle' || tool === 'circle')) {
      if (previewImageData) {
        ctx.putImageData(previewImageData, 0, 0);
      }

      if (tool === 'line') {
        drawStraightLine(ctx, startPoint, point);
      } else if (tool === 'rectangle') {
        drawRectangle(ctx, startPoint, point, shapeMode);
      } else if (tool === 'circle') {
        drawCircle(ctx, startPoint, point, shapeMode);
      }
    }

    onDrawAction({
      type: tool,
      color,
      brushSize,
      shapeMode,
      points: currentPoints,
      startPoint,
      endPoint: point,
    });

    setIsDrawing(false);
    setStartPoint(null);
    setCurrentPoints([]);
    setPreviewImageData(null);
  }, [
    isDrawing,
    startPoint,
    currentPoints,
    getMousePosition,
    getContext,
    tool,
    shapeMode,
    previewImageData,
    color,
    brushSize,
    onDrawAction,
    drawStraightLine,
    drawRectangle,
    drawCircle,
  ]);

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    if (isDrawing) {
      setIsDrawing(false);
      setStartPoint(null);
      setCurrentPoints([]);
      setPreviewImageData(null);
    }
  }, [isDrawing]);

  // Handle undo/redo/clear (similar to original, but also handle shapes)
  useEffect(() => {
    if (!isInitialized.current) return;
    if (undoTrigger === prevUndoTrigger.current) return;
    prevUndoTrigger.current = undoTrigger;
    
    const ctx = getContext();
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    if (historyRef.current.length > 0) {
      const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height);
      redoStackRef.current.push(currentState);
      if (redoStackRef.current.length > 50) {
        redoStackRef.current.shift();
      }
      
      const previousState = historyRef.current.pop();
      if (previousState) {
        ctx.putImageData(previousState, 0, 0);
      }
    }
  }, [undoTrigger, getContext, historyRef, redoStackRef]);

  useEffect(() => {
    if (!isInitialized.current) return;
    if (redoTrigger === prevRedoTrigger.current) return;
    prevRedoTrigger.current = redoTrigger;
    
    const ctx = getContext();
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    if (redoStackRef.current.length > 0) {
      const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height);
      historyRef.current.push(currentState);
      if (historyRef.current.length > 50) {
        historyRef.current.shift();
      }
      
      const redoState = redoStackRef.current.pop();
      if (redoState) {
        ctx.putImageData(redoState, 0, 0);
      }
    }
  }, [redoTrigger, getContext, historyRef, redoStackRef]);

  useEffect(() => {
    if (!isInitialized.current) return;
    if (clearTrigger === prevClearTrigger.current) return;
    prevClearTrigger.current = clearTrigger;
    
    const ctx = getContext();
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    saveToHistory();
    setShapes3D([]);
    setSelectedShapeId(null);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [clearTrigger, getContext, saveToHistory]);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const initCanvas = () => {
      const rect = container.getBoundingClientRect();
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      
      let imageData: ImageData | null = null;
      if (ctx && canvas.width > 0 && canvas.height > 0 && isInitialized.current) {
        try {
          imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        } catch {
          // Canvas might be tainted or empty
        }
      }

      canvas.width = Math.max(rect.width, 100);
      canvas.height = Math.max(rect.height, 100);

      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        if (imageData && isInitialized.current) {
          ctx.putImageData(imageData, 0, 0);
        }
      }
      
      isInitialized.current = true;
    };

    initCanvas();
    window.addEventListener('resize', initCanvas);
    return () => window.removeEventListener('resize', initCanvas);
  }, []);

  // Render shapes to canvas when they change (when not selected)
  useEffect(() => {
    if (selectedShapeId) return; // Don't render while shape is being edited
    renderAllShapesToCanvas();
  }, [shapes3D, selectedShapeId, renderAllShapesToCanvas]);

  // Get cursor style
  const getCursorStyle = () => {
    switch (tool) {
      case 'pencil':
      case 'eraser':
      case 'line':
      case 'rectangle':
      case 'circle':
      case 'fill':
      case 'shape3d':
        return 'crosshair';
      case 'select':
        return 'default';
      default:
        return 'default';
    }
  };

  const selectedShape = shapes3D.find(s => s.id === selectedShapeId);

  return (
    <div 
      ref={containerRef}
      className="flex-1 bg-muted p-4 flex items-center justify-center relative"
      data-testid="canvas-container"
    >
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className="bg-white shadow-lg rounded-md relative z-0"
        style={{ 
          cursor: getCursorStyle(),
          maxWidth: '100%',
          maxHeight: '100%',
          width: '100%',
          height: '100%',
        }}
        data-testid="drawing-canvas"
      />
      
      {/* Render interactive 3D shapes overlay */}
      {selectedShape && canvasRect && (
        <InteractiveShape3D
          key={selectedShape.id}
          shape={selectedShape}
          isSelected={true}
          onMove={handleShapeMove}
          onResize={handleShapeResize}
          onSelect={setSelectedShapeId}
          canvasRect={canvasRect}
          getCanvasContext={getContext}
        />
      )}
    </div>
  );
}

// Helper function to convert hex color to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

