import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { cn } from "./utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-0", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-2",
        caption: "flex justify-center pt-1 relative items-center h-10",
        caption_label: "text-sm font-medium absolute inset-x-0 text-center z-10 bg-transparent",
        nav: "absolute inset-x-0 top-0 flex justify-between items-center h-10 px-1 z-20",
        button_previous: cn(
          "h-7 w-7 bg-transparent p-0 inline-flex items-center justify-center rounded-md hover:bg-neutral-100 transition-colors disabled:pointer-events-none disabled:opacity-50"
        ),
        button_next: cn(
          "h-7 w-7 bg-transparent p-0 inline-flex items-center justify-center rounded-md hover:bg-neutral-100 transition-colors disabled:pointer-events-none disabled:opacity-50"
        ),
        month_grid: "w-full border-collapse space-y-2",
        weekdays: "flex",
        weekday: "text-neutral-500 rounded-md w-9 h-9 font-normal text-[0.8rem] flex items-center justify-center",
        week: "flex w-full",
        day_button: cn(
          "h-9 w-9 p-0 font-normal rounded-md transition-colors relative inline-flex items-center justify-center hover:bg-neutral-100 aria-selected:opacity-100"
        ),
        day: cn("h-9 w-9 p-0 text-center text-sm relative flex items-center justify-center"),
        selected: "bg-black text-white hover:bg-black hover:text-white focus:bg-black focus:text-white",
        today: "bg-neutral-900 text-white font-medium",
        outside: "text-neutral-400 opacity-50",
        disabled: "text-neutral-500 opacity-50",
        range_middle: "aria-selected:bg-neutral-100 aria-selected:text-neutral-900",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => {
          const Icon = orientation === "left" ? ChevronLeft : ChevronRight
          return <Icon className="h-4 w-4" />
        },
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }