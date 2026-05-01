"use client"

export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-teal focus:text-[#09090B] focus:rounded-lg focus:font-semibold focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2 focus:ring-offset-[#09090B]"
    >
      Skip to main content
    </a>
  )
}
