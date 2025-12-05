import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface ToolButtonProps {
  tool: string;
  icon: LucideIcon;
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

export function ToolButton({ icon: Icon, isSelected, onClick, label }: ToolButtonProps) {
  return (
    <Button
      variant={isSelected ? "default" : "ghost"}
      size="icon"
      onClick={onClick}
      className={cn(
        "w-12 h-12 transition-all",
        "max-md:w-9 max-md:h-9", // 3/4 size on mobile (48px -> 36px)
        isSelected && "ring-2 ring-ring ring-offset-2 ring-offset-background"
      )}
      aria-pressed={isSelected}
      aria-label={label}
    >
      <Icon className="w-6 h-6 max-md:w-[18px] max-md:h-[18px]" /> {/* 3/4 size on mobile (24px -> 18px) */}
    </Button>
  );
}

