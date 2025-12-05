/**
 * Export canvas to SVG by embedding as image
 */
export function exportCanvasToSVG(canvas: HTMLCanvasElement): string {
  const dataUrl = canvas.toDataURL('image/png');
  
  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="${canvas.width}" height="${canvas.height}" xmlns="http://www.w3.org/2000/svg">
  <image width="${canvas.width}" height="${canvas.height}" href="${dataUrl}"/>
</svg>`;
}

/**
 * Download SVG file
 */
export function downloadSVG(svgString: string, filename: string = 'drawing.svg'): void {
  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

