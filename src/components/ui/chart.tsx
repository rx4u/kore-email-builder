import * as React from "react"
import { cn } from "./utils"

// Stub component - recharts not available
export type ChartConfig = Record<string, any>

const ChartContext = React.createContext<{ config: ChartConfig } | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }
  return context
}

const ChartContainer = React.forwardRef<HTMLDivElement, React.ComponentProps<"div"> & { config: ChartConfig; children: React.ReactNode }>(
  ({ id, className, children, config, ...props }, ref) => {
    return (
      <ChartContext.Provider value={{ config }}>
        <div ref={ref} className={cn("flex aspect-video justify-center text-xs", className)} {...props}>
          {children}
        </div>
      </ChartContext.Provider>
    )
  }
)
ChartContainer.displayName = "Chart"

const ChartTooltip = ({ children }: { children?: React.ReactNode }) => <>{children}</>

const ChartTooltipContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("border bg-background p-2", className)} {...props} />
  )
)
ChartTooltipContent.displayName = "ChartTooltip"

const ChartLegend = ({ children }: { children?: React.ReactNode }) => <>{children}</>

const ChartLegendContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center justify-center gap-4", className)} {...props} />
  )
)
ChartLegendContent.displayName = "ChartLegend"

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => null

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
}
