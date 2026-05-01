"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Play, Loader2 } from "lucide-react"

const symbols = ["NQ", "ES", "CL", "GC", "BTC", "ETH", "YM", "RTY"]
const models = ["XGBoost", "LightGBM", "LSTM", "Random Forest", "Ensemble"]

interface BacktestConfigProps {
  onRun: (symbols?: string[]) => void
  isLoading: boolean
}

export function BacktestConfig({ onRun, isLoading }: BacktestConfigProps) {
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>(["NQ", "ES", "CL"])
  const [selectedModels, setSelectedModels] = useState<string[]>(models)
  const [minConfidence, setMinConfidence] = useState([70])

  const toggleSymbol = (symbol: string) => {
    setSelectedSymbols((prev) =>
      prev.includes(symbol)
        ? prev.filter((s) => s !== symbol)
        : [...prev, symbol]
    )
  }

  const toggleModel = (model: string) => {
    setSelectedModels((prev) =>
      prev.includes(model)
        ? prev.filter((m) => m !== model)
        : [...prev, model]
    )
  }

  return (
    <Card className="bg-[#18181B] border-[#27272A]">
      <CardHeader>
        <CardTitle className="text-lg text-[#FAFAFA]">Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Symbols */}
            <div className="space-y-3">
              <Label className="text-[#FAFAFA]">Symbols</Label>
              <div className="flex flex-wrap gap-2">
                {symbols.map((symbol) => (
                  <button
                    key={symbol}
                    onClick={() => toggleSymbol(symbol)}
                    className={`px-3 py-1.5 text-sm font-mono rounded-md border transition-colors ${
                      selectedSymbols.includes(symbol)
                        ? "bg-teal/20 text-teal border-teal/30"
                        : "bg-[#27272A] text-[#A1A1AA] border-[#27272A] hover:border-[#3F3F46]"
                    }`}
                  >
                    {symbol}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[#FAFAFA]">Start Date</Label>
                <Input
                  type="date"
                  defaultValue="2024-04-30"
                  className="bg-[#0A0A0B] border-[#27272A] text-[#FAFAFA]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[#FAFAFA]">End Date</Label>
                <Input
                  type="date"
                  defaultValue="2025-04-30"
                  className="bg-[#0A0A0B] border-[#27272A] text-[#FAFAFA]"
                />
              </div>
            </div>

            {/* Initial Capital */}
            <div className="space-y-2">
              <Label className="text-[#FAFAFA]">Initial Capital</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]">$</span>
                <Input
                  type="text"
                  defaultValue="100,000"
                  className="pl-7 bg-[#0A0A0B] border-[#27272A] text-[#FAFAFA] font-mono"
                />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Models */}
            <div className="space-y-3">
              <Label className="text-[#FAFAFA]">Models</Label>
              <div className="space-y-2">
                {models.map((model) => (
                  <div key={model} className="flex items-center gap-2">
                    <Checkbox
                      id={model}
                      checked={selectedModels.includes(model)}
                      onCheckedChange={() => toggleModel(model)}
                      className="border-[#27272A] data-[state=checked]:bg-teal data-[state=checked]:border-teal"
                    />
                    <label
                      htmlFor={model}
                      className="text-sm text-[#A1A1AA] cursor-pointer"
                    >
                      {model}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Position Size */}
            <div className="space-y-2">
              <Label className="text-[#FAFAFA]">Position Size</Label>
              <Select defaultValue="2">
                <SelectTrigger className="bg-[#0A0A0B] border-[#27272A] text-[#FAFAFA]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#18181B] border-[#27272A]">
                  <SelectItem value="1">1% of capital</SelectItem>
                  <SelectItem value="2">2% of capital</SelectItem>
                  <SelectItem value="5">5% of capital</SelectItem>
                  <SelectItem value="10">10% of capital</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Min Confidence */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-[#FAFAFA]">Min Confidence</Label>
                <span className="text-sm font-mono text-teal">{minConfidence[0]}%</span>
              </div>
              <Slider
                value={minConfidence}
                onValueChange={setMinConfidence}
                min={50}
                max={95}
                step={5}
                className="py-4"
              />
            </div>
          </div>
        </div>

        {/* Run Button */}
        <div className="mt-8">
          <Button
            onClick={() => onRun(selectedSymbols)}
            disabled={isLoading || selectedSymbols.length === 0 || selectedModels.length === 0}
            className="w-full bg-teal hover:bg-teal/90 text-[#09090B] font-semibold h-12"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running Backtest...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Run Backtest
              </>
            )}
          </Button>
          <p className="text-center text-sm text-[#71717A] mt-2">
            Estimated time: ~5 seconds
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
