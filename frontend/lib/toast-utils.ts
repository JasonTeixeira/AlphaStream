import { toast } from "sonner"

interface UndoToastOptions {
  message: string
  undoAction: () => void
  duration?: number
}

export function toastWithUndo({ message, undoAction, duration = 5000 }: UndoToastOptions) {
  let undone = false

  toast(message, {
    duration,
    action: {
      label: "Undo",
      onClick: () => {
        if (!undone) {
          undone = true
          undoAction()
          toast.success("Action undone")
        }
      },
    },
  })
}

export function toastSuccess(message: string) {
  toast.success(message, {
    icon: "✓",
    style: {
      background: "#18181B",
      border: "1px solid #27272A",
      color: "#10B981",
    },
  })
}

export function toastError(message: string) {
  toast.error(message, {
    icon: "✕",
    style: {
      background: "#18181B",
      border: "1px solid #27272A",
      color: "#EF4444",
    },
  })
}

export function toastLoading(message: string) {
  return toast.loading(message, {
    style: {
      background: "#18181B",
      border: "1px solid #27272A",
      color: "#FAFAFA",
    },
  })
}
