interface VisuallyHiddenProps {
  children: React.ReactNode
  as?: "span" | "div" | "label"
}

export function VisuallyHidden({ children, as: Component = "span" }: VisuallyHiddenProps) {
  return (
    <Component className="sr-only">
      {children}
    </Component>
  )
}
