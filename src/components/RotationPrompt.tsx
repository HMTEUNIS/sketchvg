import { useState, useEffect } from "react";
import { RotateCw } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";

export function RotationPrompt() {
  const isMobile = useIsMobile();
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    if (!isMobile) {
      setIsPortrait(false);
      return;
    }

    const checkOrientation = () => {
      // Check if device is in portrait mode
      // Use window.innerHeight > window.innerWidth as the primary check
      const portrait = window.innerHeight > window.innerWidth;
      setIsPortrait(portrait);
    };

    // Check initial orientation
    checkOrientation();

    // Listen for orientation changes
    const handleOrientationChange = () => {
      // Small delay to allow window dimensions to update
      setTimeout(checkOrientation, 100);
    };

    // Listen for resize events (handles orientation changes)
    window.addEventListener('resize', handleOrientationChange);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleOrientationChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [isMobile]);

  // Only show on mobile and when in portrait mode
  if (!isMobile || !isPortrait) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      style={{ touchAction: 'none' }}
    >
      <div className="bg-background border border-border rounded-lg shadow-lg p-6 mx-4 max-w-sm text-center">
        <div className="flex justify-center mb-4">
          <RotateCw className="w-12 h-12 text-primary animate-spin" />
        </div>
        <h2 className="text-lg font-semibold mb-2">Please Rotate Your Device</h2>
        <p className="text-muted-foreground">
          This app works best in landscape mode. Please rotate your device to continue.
        </p>
      </div>
    </div>
  );
}

