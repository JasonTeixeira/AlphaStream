"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Layers } from "lucide-react"
import { BacktestConfig } from "@/components/backtester/backtest-config"
import { BacktestLoading } from "@/components/backtester/backtest-loading"
import { BacktestResults } from "@/components/backtester/backtest-results"

export default function BacktesterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [compareMode, setCompareMode] = useState(false)

  const handleRunBacktest = () => {
    setIsLoading(true)
    setShowResults(false)
    
    // Simulate backtest running
    setTimeout(() => {
      setIsLoading(false)
      setShowResults(true)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-[#09090B]">
      {/* Header */}
      <div className="border-b border-[#27272A] bg-[#09090B]/80 backdrop-blur-lg">
        <div className="px-4 md:px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#FAFAFA]">Backtester</h1>
            <p className="text-[#A1A1AA] mt-1">Test strategies against historical data. No look-ahead bias.</p>
          </div>
          <Button
            variant={compareMode ? "default" : "outline"}
            onClick={() => setCompareMode(!compareMode)}
            className={compareMode 
              ? "bg-violet hover:bg-violet/90 text-white" 
              : "border-[#27272A] text-[#A1A1AA] hover:text-[#FAFAFA] hover:border-[#3F3F46]"
            }
          >
            <Layers className="mr-2 h-4 w-4" />
            Compare Strategies
          </Button>
        </div>
      </div>
      
      <div className="p-4 md:p-6 space-y-6">
        {compareMode ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#FAFAFA]">Strategy A</h3>
              <BacktestConfig onRun={handleRunBacktest} isLoading={isLoading} />
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#FAFAFA]">Strategy B</h3>
              <BacktestConfig onRun={handleRunBacktest} isLoading={isLoading} />
            </div>
          </div>
        ) : (
          <BacktestConfig onRun={handleRunBacktest} isLoading={isLoading} />
        )}
        
        {isLoading && <BacktestLoading />}
        
        {showResults && !isLoading && <BacktestResults compareMode={compareMode} />}
      </div>
    </div>
  )
}
