import * as React from "react"
import { cn } from "@/lib/utils"

interface TooltipContextValue {
  delayDuration?: number
}

const TooltipContext = React.createContext<TooltipContextValue>({
  delayDuration: 0,
})

interface TooltipProviderProps {
  children: React.ReactNode
  delayDuration?: number
}

export function TooltipProvider({ children, delayDuration = 0 }: TooltipProviderProps) {
  return (
    <TooltipContext.Provider value={{ delayDuration }}>
      {children}
    </TooltipContext.Provider>
  )
}

interface TooltipProps {
  children: React.ReactNode
  delayDuration?: number
}

const Tooltip = ({ children, delayDuration = 200 }: TooltipProps) => {
  return (
    <TooltipContext.Provider value={{ delayDuration }}>
      <div className="relative inline-block">{children}</div>
    </TooltipContext.Provider>
  )
}

interface TooltipTriggerProps {
  asChild?: boolean
  children: React.ReactNode
}

const TooltipTrigger = React.forwardRef<HTMLElement, TooltipTriggerProps>(
  ({ asChild, children, ...props }, ref) => {
    const [, setIsOpen] = React.useState(false)
    const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>()

    const handleMouseEnter = () => {
      const { delayDuration } = React.useContext(TooltipContext)
      timeoutRef.current = setTimeout(() => setIsOpen(true), delayDuration)
    }

    const handleMouseLeave = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      setIsOpen(false)
    }

    React.useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }, [])

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, {
        ...props,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        ref,
      } as any)
    }

    return (
      <span
        ref={ref as any}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}
      </span>
    )
  }
)
TooltipTrigger.displayName = "TooltipTrigger"

interface TooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: "top" | "right" | "bottom" | "left"
}

const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  ({ className, side = "top", children, ...props }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false)

    React.useEffect(() => {
      setIsVisible(true)
    }, [])

    if (!isVisible) return null

    return (
      <div
        ref={ref}
        className={cn(
          "absolute z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95",
          {
            "bottom-full left-1/2 -translate-x-1/2 mb-2": side === "top",
            "left-full top-1/2 -translate-y-1/2 ml-2": side === "right",
            "top-full left-1/2 -translate-x-1/2 mt-2": side === "bottom",
            "right-full top-1/2 -translate-y-1/2 mr-2": side === "left",
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
TooltipContent.displayName = "TooltipContent"

export { Tooltip, TooltipTrigger, TooltipContent }

