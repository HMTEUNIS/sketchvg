import * as React from "react"

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export type ToastActionElement = React.ReactElement

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={className} {...props} />
  }
)
Toast.displayName = "Toast"

export const Toaster = () => {
  return null
}

