"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Keyboard } from "lucide-react"

const shortcuts = [
  {
    category: "Navigation",
    items: [
      { keys: ["Cmd", "K"], description: "Open command palette" },
      { keys: ["G", "H"], description: "Go to home" },
      { keys: ["G", "D"], description: "Go to dashboard" },
      { keys: ["G", "S"], description: "Go to signals" },
      { keys: ["G", "B"], description: "Go to backtester" },
    ],
  },
  {
    category: "Actions",
    items: [
      { keys: ["Cmd", "Enter"], description: "Run backtest" },
      { keys: ["Cmd", "S"], description: "Save settings" },
      { keys: ["Cmd", "E"], description: "Export data" },
      { keys: ["Cmd", "/"], description: "Toggle sidebar" },
    ],
  },
  {
    category: "General",
    items: [
      { keys: ["?"], description: "Show keyboard shortcuts" },
      { keys: ["Esc"], description: "Close modal / Cancel" },
      { keys: ["Cmd", "."], description: "Open settings" },
    ],
  },
]

export function KeyboardShortcuts() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "?" && !e.metaKey && !e.ctrlKey) {
        const target = e.target as HTMLElement
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-[#18181B] border-[#27272A] max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[#FAFAFA]">
            <Keyboard className="h-5 w-5 text-teal" />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          {shortcuts.map((category) => (
            <div key={category.category}>
              <h3 className="text-sm font-medium text-[#A1A1AA] mb-3">
                {category.category}
              </h3>
              <div className="space-y-2">
                {category.items.map((shortcut) => (
                  <div 
                    key={shortcut.description}
                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-[#27272A]/50"
                  >
                    <span className="text-sm text-[#FAFAFA]">
                      {shortcut.description}
                    </span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, i) => (
                        <span key={i} className="flex items-center gap-1">
                          <kbd className="px-2 py-1 bg-[#27272A] border border-[#3F3F46] rounded text-xs text-[#FAFAFA] font-mono min-w-[28px] text-center">
                            {key}
                          </kbd>
                          {i < shortcut.keys.length - 1 && (
                            <span className="text-[#71717A] text-xs">+</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-[#27272A] text-center">
          <p className="text-xs text-[#71717A]">
            Press <kbd className="px-1.5 py-0.5 bg-[#27272A] rounded text-[10px]">?</kbd> anywhere to toggle this menu
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
