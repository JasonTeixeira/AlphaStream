"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Calculator, TrendingUp, ArrowRight, DollarSign, Percent, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

export function ROICalculator() {
  const [investment, setInvestment] = useState(25000)
  const [monthsTrading, setMonthsTrading] = useState(6)
  const [tradesPerWeek, setTradesPerWeek] = useState(10)

  const results = useMemo(() => {
    const avgWinRate = 0.73
    const avgWin = 0.012 // 1.2% avg win
    const avgLoss = 0.008 // 0.8% avg loss
    const profitFactor = 2.14
    
    const totalTrades = tradesPerWeek * 4 * monthsTrading
    const winningTrades = Math.floor(totalTrades * avgWinRate)
    const losingTrades = totalTrades - winningTrades

    const grossProfit = investment * avgWin * winningTrades
    const grossLoss = investment * avgLoss * losingTrades
    const netProfit = grossProfit - grossLoss
    const percentReturn = (netProfit / investment) * 100
    const finalValue = investment + netProfit
    const monthlyReturn = netProfit / monthsTrading

    return {
      totalTrades,
      winningTrades,
      losingTrades,
      netProfit: Math.round(netProfit),
      percentReturn: percentReturn.toFixed(1),
      finalValue: Math.round(finalValue),
      monthlyReturn: Math.round(monthlyReturn),
    }
  }, [investment, monthsTrading, tradesPerWeek])

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-success/20 text-success border-success/30">
            <Calculator className="mr-1 h-3 w-3" />
            ROI Calculator
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-[#FAFAFA] mb-4">
            Calculate Your Potential Returns
          </h2>
          <p className="text-[#A1A1AA] max-w-xl mx-auto">
            Based on our historical 73% win rate and 2.14 profit factor. Results may vary.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-[#18181B] border-[#27272A]">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Inputs */}
                <div className="space-y-8">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-sm text-[#A1A1AA] flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Starting Capital
                      </label>
                      <span className="font-mono font-bold text-teal text-lg">
                        ${investment.toLocaleString()}
                      </span>
                    </div>
                    <Slider
                      value={[investment]}
                      onValueChange={(v) => setInvestment(v[0])}
                      min={5000}
                      max={100000}
                      step={5000}
                      className="w-full"
                    />
                    <div className="flex justify-between mt-2 text-xs text-[#71717A]">
                      <span>$5,000</span>
                      <span>$100,000</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-sm text-[#A1A1AA] flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Time Period
                      </label>
                      <span className="font-mono font-bold text-teal text-lg">
                        {monthsTrading} months
                      </span>
                    </div>
                    <Slider
                      value={[monthsTrading]}
                      onValueChange={(v) => setMonthsTrading(v[0])}
                      min={1}
                      max={12}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between mt-2 text-xs text-[#71717A]">
                      <span>1 month</span>
                      <span>12 months</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-sm text-[#A1A1AA] flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Trades per Week
                      </label>
                      <span className="font-mono font-bold text-teal text-lg">
                        {tradesPerWeek} trades
                      </span>
                    </div>
                    <Slider
                      value={[tradesPerWeek]}
                      onValueChange={(v) => setTradesPerWeek(v[0])}
                      min={5}
                      max={25}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between mt-2 text-xs text-[#71717A]">
                      <span>5 trades</span>
                      <span>25 trades</span>
                    </div>
                  </div>
                </div>

                {/* Results */}
                <div className="bg-[#0A0A0B] rounded-xl p-6 border border-[#27272A]">
                  <h3 className="text-lg font-semibold text-[#FAFAFA] mb-6">Projected Results</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-[#18181B]">
                      <span className="text-sm text-[#A1A1AA]">Total Trades</span>
                      <span className="font-mono font-semibold text-[#FAFAFA]">{results.totalTrades}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 rounded-lg bg-[#18181B]">
                      <span className="text-sm text-[#A1A1AA]">Winning Trades</span>
                      <span className="font-mono font-semibold text-success">{results.winningTrades} (73%)</span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-[#18181B]">
                      <span className="text-sm text-[#A1A1AA]">Monthly Return</span>
                      <span className="font-mono font-semibold text-teal">+${results.monthlyReturn.toLocaleString()}</span>
                    </div>

                    <div className="border-t border-[#27272A] pt-4 mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[#A1A1AA]">Net Profit</span>
                        <span className="font-mono font-bold text-2xl text-success">
                          +${results.netProfit.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#A1A1AA]">Total Return</span>
                        <span className="font-mono font-bold text-xl text-success">
                          +{results.percentReturn}%
                        </span>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-teal/10 border border-teal/30 mt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-teal">Final Portfolio Value</span>
                        <span className="font-mono font-bold text-2xl text-teal">
                          ${results.finalValue.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full mt-6 bg-teal hover:bg-teal/90 text-[#09090B] font-semibold" asChild>
                    <Link href="/auth/signup">
                      Start Growing Your Account
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>

              <p className="text-xs text-[#71717A] text-center mt-6">
                * Projections based on historical performance. Past results do not guarantee future returns. 
                Trading involves risk and may not be suitable for all investors.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
