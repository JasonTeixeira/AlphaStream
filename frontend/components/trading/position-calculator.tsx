"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calculator, DollarSign, Target, AlertTriangle } from "lucide-react"

const symbols = [
  { id: "NQ", name: "Nasdaq Futures", tickValue: 5, tickSize: 0.25 },
  { id: "ES", name: "S&P Futures", tickValue: 12.50, tickSize: 0.25 },
  { id: "CL", name: "Crude Oil", tickValue: 10, tickSize: 0.01 },
  { id: "GC", name: "Gold Futures", tickValue: 10, tickSize: 0.10 },
  { id: "BTC", name: "Bitcoin", tickValue: 1, tickSize: 1 },
]

export function PositionCalculator() {
  const [accountSize, setAccountSize] = useState(100000)
  const [riskPercent, setRiskPercent] = useState([2])
  const [selectedSymbol, setSelectedSymbol] = useState("NQ")
  const [stopLossPoints, setStopLossPoints] = useState(20)

  const symbol = symbols.find(s => s.id === selectedSymbol)!

  const calculations = useMemo(() => {
    const riskAmount = (accountSize * riskPercent[0]) / 100
    const stopLossTicks = stopLossPoints / symbol.tickSize
    const riskPerContract = stopLossTicks * symbol.tickValue
    const positionSize = Math.floor(riskAmount / riskPerContract)
    const actualRisk = positionSize * riskPerContract
    const actualRiskPercent = (actualRisk / accountSize) * 100

    return {
      riskAmount,
      positionSize: Math.max(1, positionSize),
      riskPerContract,
      actualRisk,
      actualRiskPercent,
    }
  }, [accountSize, riskPercent, selectedSymbol, stopLossPoints, symbol])

  return (
    <Card className="bg-[#18181B] border-[#27272A]">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-teal" />
          <CardTitle className="text-lg text-[#FAFAFA]">Position Size Calculator</CardTitle>
        </div>
        <CardDescription className="text-[#71717A]">
          Calculate optimal position size based on risk parameters
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[#FAFAFA]">Account Size</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#71717A]" />
                <Input
                  type="number"
                  value={accountSize}
                  onChange={(e) => setAccountSize(Number(e.target.value))}
                  className="pl-9 bg-[#0A0A0B] border-[#27272A] text-[#FAFAFA] font-mono"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-[#FAFAFA]">Risk Per Trade</Label>
                <span className="text-sm font-mono text-teal">{riskPercent[0]}%</span>
              </div>
              <Slider
                value={riskPercent}
                onValueChange={setRiskPercent}
                min={0.5}
                max={5}
                step={0.5}
                className="[&_[role=slider]]:bg-teal"
              />
              <p className="text-xs text-[#71717A]">
                Risk amount: ${((accountSize * riskPercent[0]) / 100).toLocaleString()}
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-[#FAFAFA]">Symbol</Label>
              <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
                <SelectTrigger className="bg-[#0A0A0B] border-[#27272A] text-[#FAFAFA]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#18181B] border-[#27272A]">
                  {symbols.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.id} - {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[#FAFAFA]">Stop Loss (points)</Label>
              <Input
                type="number"
                value={stopLossPoints}
                onChange={(e) => setStopLossPoints(Number(e.target.value))}
                className="bg-[#0A0A0B] border-[#27272A] text-[#FAFAFA] font-mono"
              />
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            <div className="p-4 bg-teal/10 border border-teal/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-teal" />
                <span className="text-sm text-[#A1A1AA]">Recommended Position Size</span>
              </div>
              <p className="text-4xl font-bold text-teal font-mono">
                {calculations.positionSize}
              </p>
              <p className="text-sm text-[#71717A] mt-1">
                {calculations.positionSize === 1 ? "contract" : "contracts"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-[#0A0A0B] rounded-lg border border-[#27272A]">
                <p className="text-xs text-[#71717A]">Risk per Contract</p>
                <p className="text-lg font-semibold text-[#FAFAFA] font-mono">
                  ${calculations.riskPerContract.toFixed(2)}
                </p>
              </div>

              <div className="p-3 bg-[#0A0A0B] rounded-lg border border-[#27272A]">
                <p className="text-xs text-[#71717A]">Total Risk</p>
                <p className="text-lg font-semibold text-[#FAFAFA] font-mono">
                  ${calculations.actualRisk.toFixed(2)}
                </p>
              </div>

              <div className="p-3 bg-[#0A0A0B] rounded-lg border border-[#27272A]">
                <p className="text-xs text-[#71717A]">Actual Risk %</p>
                <p className="text-lg font-semibold text-[#FAFAFA] font-mono">
                  {calculations.actualRiskPercent.toFixed(2)}%
                </p>
              </div>

              <div className="p-3 bg-[#0A0A0B] rounded-lg border border-[#27272A]">
                <p className="text-xs text-[#71717A]">Tick Value</p>
                <p className="text-lg font-semibold text-[#FAFAFA] font-mono">
                  ${symbol.tickValue}
                </p>
              </div>
            </div>

            {calculations.actualRiskPercent > 3 && (
              <div className="flex items-start gap-2 p-3 bg-warning/10 border border-warning/30 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                <p className="text-sm text-warning">
                  High risk warning: Consider reducing position size or widening stop loss.
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
