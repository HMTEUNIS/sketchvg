// Drawing tool types and constants for the Paint application

export type Tool = 
  | 'pencil' 
  | 'line' 
  | 'rectangle' 
  | 'circle' 
  | 'eraser' 
  | 'fill';

export type ShapeMode = 'fill' | 'outline';

export interface Point {
  x: number;
  y: number;
}

export interface DrawAction {
  type: Tool;
  color: string;
  brushSize: number;
  shapeMode: ShapeMode;
  points: Point[];
  startPoint?: Point;
  endPoint?: Point;
  imageData?: ImageData;
}

// Predefined color palette with 8 basic colors
export const COLOR_PALETTE = [
  { name: 'Black', value: '#000000' },
  { name: 'White', value: '#FFFFFF' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Green', value: '#22C55E' },
  { name: 'Yellow', value: '#EAB308' },
  { name: 'Purple', value: '#A855F7' },
  { name: 'Orange', value: '#F97316' },
] as const;

// Brush size options
export const BRUSH_SIZES = [
  { name: 'Extra Small', value: 2 },
  { name: 'Small', value: 4 },
  { name: 'Medium', value: 8 },
  { name: 'Large', value: 16 },
  { name: 'Extra Large', value: 24 },
] as const;

// Tool keyboard shortcuts
export const TOOL_SHORTCUTS: Record<Tool, string> = {
  pencil: 'P',
  line: 'L',
  rectangle: 'R',
  circle: 'C',
  eraser: 'E',
  fill: 'F',
};

