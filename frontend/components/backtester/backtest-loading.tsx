"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Check, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const steps = [
  "Loading data...",
  "Computing indicators...",
  "Running models...",
  "Calculating results...",
]

export function BacktestLoading() {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 2
      })
    }, 50)

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(stepInterval)
          return steps.length - 1
        }
        return prev + 1
      })
    }, 700)

    return () => {
      clearInterval(progressInterval)
      clearInterval(stepInterval)
    }
  }, [])

  return (
    <Card className="bg-[#18181B] border-[#27272A]">
      <CardContent className="py-12">
        <div className="max-w-md mx-auto">
          <div className="mb-8">
            <Progress value={progress} className="h-2 bg-[#27272A]" />
            <p className="text-center text-sm text-[#71717A] mt-2">{progress}% complete</p>
          </div>

          <div className="space-y-3">
            {steps.map((step, index) => (
              <div
                key={step}
                className={cn(
                  "flex items-center gap-3 text-sm",
                  index < currentStep && "text-success",
                  index === currentStep && "text-teal",
                  index > currentStep && "text-[#71717A]"
                )}
              >
                {index < currentStep ? (
                  <Check className="h-4 w-4" />
                ) : index === currentStep ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <div className="h-4 w-4 rounded-full border border-[#27272A]" />
                )}
                {step}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
