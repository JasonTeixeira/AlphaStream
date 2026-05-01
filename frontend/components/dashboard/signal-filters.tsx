"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

const filters = [
  { id: "all", label: "All" },
  { id: "long", label: "Long Only" },
  { id: "short", label: "Short Only" },
  { id: "high", label: "High Confidence (>80%)" },
]

export function SignalFilters() {
  const [activeFilter, setActiveFilter] = useState("all")

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      {/* Filter Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
              activeFilter === filter.id
                ? "bg-teal text-[#09090B]"
                : "bg-[#18181B] text-[#A1A1AA] hover:text-[#FAFAFA] border border-[#27272A]"
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Search and Sort */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="relative flex-1 sm:flex-none">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#71717A]" />
          <Input
            placeholder="Search symbols..."
            className="pl-9 w-full sm:w-48 bg-[#18181B] border-[#27272A] text-[#FAFAFA] placeholder:text-[#71717A]"
          />
        </div>
        <Select defaultValue="confidence">
          <SelectTrigger className="w-32 bg-[#18181B] border-[#27272A] text-[#A1A1AA]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-[#18181B] border-[#27272A]">
            <SelectItem value="confidence">Confidence</SelectItem>
            <SelectItem value="time">Time</SelectItem>
            <SelectItem value="symbol">Symbol</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
