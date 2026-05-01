"use client"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface TruncateTooltipProps {
  text: string
  maxWidth?: string
  className?: string
}

export function TruncateTooltip({
  text,
  maxWidth = "200px",
  className,
}: TruncateTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <span
            className={cn("block truncate cursor-default", className)}
            style={{ maxWidth }}
          >
            {text}
          </span>
        </TooltipTrigger>
        <TooltipContent
          className="bg-[#18181B] border-[#27272A] text-[#FAFAFA] max-w-xs"
          side="top"
        >
          {text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
