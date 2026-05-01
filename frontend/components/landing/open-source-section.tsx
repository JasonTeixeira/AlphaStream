import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Github, BookOpen } from "lucide-react"
import Link from "next/link"

const techStack = [
  "Python",
  "scikit-learn",
  "XGBoost",
  "PyTorch",
  "FastAPI",
  "Redis",
]

export function OpenSourceSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#FAFAFA] mb-4">Open-Source Core</h2>
          <p className="text-[#A1A1AA] max-w-2xl mx-auto mb-8">
            Our models are transparent. Our methodology is published. We don&apos;t hide behind a black box.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {techStack.map((tech) => (
              <Badge
                key={tech}
                variant="outline"
                className="border-[#27272A] bg-[#18181B] text-[#A1A1AA] px-4 py-2 font-mono text-sm"
              >
                {tech}
              </Badge>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="outline"
              className="border-[#27272A] bg-transparent text-[#FAFAFA] hover:bg-[#18181B] hover:border-[#3F3F46]"
              asChild
            >
              <Link href="https://github.com" target="_blank">
                <Github className="mr-2 h-4 w-4" />
                View on GitHub
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#18181B]"
              asChild
            >
              <Link href="/docs">
                <BookOpen className="mr-2 h-4 w-4" />
                Read the Docs
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
