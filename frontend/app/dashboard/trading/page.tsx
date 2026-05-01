"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  TrendingUp, 
  Download, 
  Link2, 
  Copy, 
  ExternalLink,
  Play,
  Pause,
  DollarSign,
  Target,
  AlertTriangle,
  Check,
  RefreshCw,
  Settings,
  Code,
  Zap
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

// Paper trading state
const paperTradingState = {
  balance: 100000,
  equity: 112450,
  openPositions: 3,
  todayPnL: 1250,
  totalTrades: 47,
  winRate: 72.3,
}

const brokers = [
  { id: "ib", name: "Interactive Brokers", logo: "IB", connected: false },
  { id: "td", name: "TD Ameritrade", logo: "TD", connected: false },
  { id: "alpaca", name: "Alpaca", logo: "AL", connected: true },
  { id: "tradier", name: "Tradier", logo: "TR", connected: false },
]

const openPositions = [
  { symbol: "NQ", direction: "Long", entry: 18245.50, current: 18312.25, pnl: 1335, pnlPercent: 0.37 },
  { symbol: "ES", direction: "Long", entry: 5285.00, current: 5298.75, pnl: 687.50, pnlPercent: 0.26 },
  { symbol: "GC", direction: "Short", entry: 2345.80, current: 2338.20, pnl: 760, pnlPercent: 0.32 },
]

export default function TradingPage() {
  const [isPaperTrading, setIsPaperTrading] = useState(true)
  const [riskPercent, setRiskPercent] = useState("2")
  const [maxPositions, setMaxPositions] = useState("5")

  const handleCopyPineScript = () => {
    const script = `// AlphaStream TradingView Alert
// Paste this in TradingView Pine Script editor

//@version=5
indicator("AlphaStream Signals", overlay=true)

// Webhook URL: https://api.alphastream.io/v1/tradingview/webhook
// Alert message format:
// {"symbol": "{{ticker}}", "action": "{{strategy.order.action}}", "price": {{close}}}`
    
    navigator.clipboard.writeText(script)
    toast.success("Pine Script copied to clipboard!")
  }

  const handleDownloadEA = () => {
    toast.success("Downloading AlphaStream_EA.ex4...")
  }

  return (
    <div className="min-h-screen bg-[#09090B]">
      <div className="border-b border-[#27272A] bg-[#09090B]/80 backdrop-blur-lg">
        <div className="px-4 md:px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#FAFAFA]">Trading</h1>
            <p className="text-[#A1A1AA] mt-1">Execute signals and manage positions</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge 
              className={cn(
                "px-3 py-1",
                isPaperTrading 
                  ? "bg-warning/20 text-warning border-warning/30" 
                  : "bg-success/20 text-success border-success/30"
              )}
            >
              {isPaperTrading ? "Paper Trading" : "Live Trading"}
            </Badge>
            <Button
              variant="outline"
              onClick={() => setIsPaperTrading(!isPaperTrading)}
              className="border-[#27272A] text-[#A1A1AA]"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Switch Mode
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-6">
        <Tabs defaultValue="simulator" className="space-y-6">
          <TabsList className="bg-[#18181B] border border-[#27272A]">
            <TabsTrigger value="simulator" className="data-[state=active]:bg-teal data-[state=active]:text-[#09090B]">
              Paper Trading
            </TabsTrigger>
            <TabsTrigger value="brokers" className="data-[state=active]:bg-teal data-[state=active]:text-[#09090B]">
              Broker Connections
            </TabsTrigger>
            <TabsTrigger value="tradingview" className="data-[state=active]:bg-teal data-[state=active]:text-[#09090B]">
              TradingView
            </TabsTrigger>
            <TabsTrigger value="mt4" className="data-[state=active]:bg-teal data-[state=active]:text-[#09090B]">
              MT4/MT5
            </TabsTrigger>
          </TabsList>

          {/* Paper Trading Tab */}
          <TabsContent value="simulator" className="space-y-6">
            {/* Account Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-[#18181B] border-[#27272A]">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-[#71717A] text-sm mb-1">
                    <DollarSign className="h-4 w-4" />
                    Balance
                  </div>
                  <p className="text-2xl font-bold text-[#FAFAFA] font-mono">
                    ${paperTradingState.balance.toLocaleString()}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-[#18181B] border-[#27272A]">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-[#71717A] text-sm mb-1">
                    <TrendingUp className="h-4 w-4" />
                    Equity
                  </div>
                  <p className="text-2xl font-bold text-success font-mono">
                    ${paperTradingState.equity.toLocaleString()}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-[#18181B] border-[#27272A]">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-[#71717A] text-sm mb-1">
                    <Target className="h-4 w-4" />
                    Today P&L
                  </div>
                  <p className="text-2xl font-bold text-success font-mono">
                    +${paperTradingState.todayPnL.toLocaleString()}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-[#18181B] border-[#27272A]">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-[#71717A] text-sm mb-1">
                    <Zap className="h-4 w-4" />
                    Win Rate
                  </div>
                  <p className="text-2xl font-bold text-[#FAFAFA] font-mono">
                    {paperTradingState.winRate}%
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Open Positions */}
            <Card className="bg-[#18181B] border-[#27272A]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-[#FAFAFA]">Open Positions</CardTitle>
                  <Badge className="bg-teal/20 text-teal border-teal/30">
                    {openPositions.length} Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {openPositions.map((position, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 bg-[#0A0A0B] rounded-lg border border-[#27272A]"
                    >
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-semibold text-[#FAFAFA]">{position.symbol}</p>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "text-xs",
                              position.direction === "Long" 
                                ? "border-success/30 text-success" 
                                : "border-danger/30 text-danger"
                            )}
                          >
                            {position.direction}
                          </Badge>
                        </div>
                        <div className="text-sm">
                          <p className="text-[#71717A]">Entry: <span className="text-[#FAFAFA] font-mono">${position.entry}</span></p>
                          <p className="text-[#71717A]">Current: <span className="text-[#FAFAFA] font-mono">${position.current}</span></p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={cn(
                          "font-semibold font-mono",
                          position.pnl >= 0 ? "text-success" : "text-danger"
                        )}>
                          {position.pnl >= 0 ? "+" : ""}${position.pnl.toFixed(2)}
                        </p>
                        <p className={cn(
                          "text-sm",
                          position.pnl >= 0 ? "text-success" : "text-danger"
                        )}>
                          {position.pnl >= 0 ? "+" : ""}{position.pnlPercent.toFixed(2)}%
                        </p>
                      </div>
                      <Button variant="outline" size="sm" className="border-[#27272A] text-[#A1A1AA]">
                        Close
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Risk Settings */}
            <Card className="bg-[#18181B] border-[#27272A]">
              <CardHeader>
                <CardTitle className="text-lg text-[#FAFAFA]">Risk Settings</CardTitle>
                <CardDescription className="text-[#71717A]">
                  Configure position sizing and risk management
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[#FAFAFA]">Risk per Trade</Label>
                    <Select value={riskPercent} onValueChange={setRiskPercent}>
                      <SelectTrigger className="bg-[#0A0A0B] border-[#27272A] text-[#FAFAFA]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#18181B] border-[#27272A]">
                        <SelectItem value="1">1% of equity</SelectItem>
                        <SelectItem value="2">2% of equity</SelectItem>
                        <SelectItem value="3">3% of equity</SelectItem>
                        <SelectItem value="5">5% of equity</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[#FAFAFA]">Max Open Positions</Label>
                    <Select value={maxPositions} onValueChange={setMaxPositions}>
                      <SelectTrigger className="bg-[#0A0A0B] border-[#27272A] text-[#FAFAFA]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#18181B] border-[#27272A]">
                        <SelectItem value="3">3 positions</SelectItem>
                        <SelectItem value="5">5 positions</SelectItem>
                        <SelectItem value="10">10 positions</SelectItem>
                        <SelectItem value="unlimited">Unlimited</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[#FAFAFA]">Position Size ($)</Label>
                    <div className="p-3 bg-[#0A0A0B] rounded-lg border border-[#27272A]">
                      <p className="text-lg font-semibold text-teal font-mono">
                        ${((paperTradingState.equity * parseInt(riskPercent)) / 100).toLocaleString()}
                      </p>
                      <p className="text-xs text-[#71717A]">Based on current equity</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Broker Connections Tab */}
          <TabsContent value="brokers" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {brokers.map((broker) => (
                <Card key={broker.id} className="bg-[#18181B] border-[#27272A]">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#27272A] rounded-lg flex items-center justify-center">
                          <span className="text-lg font-bold text-[#FAFAFA]">{broker.logo}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-[#FAFAFA]">{broker.name}</h3>
                          {broker.connected ? (
                            <Badge className="bg-success/20 text-success border-success/30">
                              Connected
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="border-[#27272A] text-[#71717A]">
                              Not connected
                            </Badge>
                          )}
                        </div>
                      </div>
                      {broker.connected ? (
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="border-[#27272A] text-[#A1A1AA]">
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="border-danger/30 text-danger">
                            Disconnect
                          </Button>
                        </div>
                      ) : (
                        <Button className="bg-teal hover:bg-teal/90 text-[#09090B]">
                          <Link2 className="mr-2 h-4 w-4" />
                          Connect
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-[#18181B] border-[#27272A]">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-[#FAFAFA]">Important Notice</h4>
                    <p className="text-sm text-[#A1A1AA] mt-1">
                      Live trading involves significant risk. AlphaStream signals are for informational purposes only. 
                      Always use proper risk management and never trade with money you cannot afford to lose.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TradingView Tab */}
          <TabsContent value="tradingview" className="space-y-6">
            <Card className="bg-[#18181B] border-[#27272A]">
              <CardHeader>
                <CardTitle className="text-lg text-[#FAFAFA]">TradingView Integration</CardTitle>
                <CardDescription className="text-[#71717A]">
                  Receive AlphaStream signals directly in TradingView
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-[#0A0A0B] rounded-lg border border-[#27272A]">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-[#FAFAFA]">Webhook URL</h4>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText("https://api.alphastream.io/v1/tradingview/webhook")
                        toast.success("Webhook URL copied!")
                      }}
                      className="border-[#27272A] text-[#A1A1AA]"
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                  </div>
                  <code className="text-sm text-teal font-mono">
                    https://api.alphastream.io/v1/tradingview/webhook
                  </code>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-[#FAFAFA]">Pine Script Template</h4>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleCopyPineScript}
                      className="border-[#27272A] text-[#A1A1AA]"
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Script
                    </Button>
                  </div>
                  <div className="p-4 bg-[#0A0A0B] rounded-lg border border-[#27272A] overflow-x-auto">
                    <pre className="text-xs text-[#A1A1AA] font-mono whitespace-pre">
{`//@version=5
indicator("AlphaStream Signals", overlay=true)

// Configure your webhook URL in alert settings
// Message format: {"symbol": "{{ticker}}", ...}`}
                    </pre>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button className="bg-teal hover:bg-teal/90 text-[#09090B]" asChild>
                    <a href="https://www.tradingview.com" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Open TradingView
                    </a>
                  </Button>
                  <Button variant="outline" className="border-[#27272A] text-[#A1A1AA]">
                    <Code className="mr-2 h-4 w-4" />
                    View Full Documentation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* MT4/MT5 Tab */}
          <TabsContent value="mt4" className="space-y-6">
            <Card className="bg-[#18181B] border-[#27272A]">
              <CardHeader>
                <CardTitle className="text-lg text-[#FAFAFA]">MetaTrader Integration</CardTitle>
                <CardDescription className="text-[#71717A]">
                  Download our Expert Advisor for MT4/MT5
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#0A0A0B] rounded-lg border border-[#27272A]">
                    <h4 className="font-medium text-[#FAFAFA] mb-2">MetaTrader 4</h4>
                    <p className="text-sm text-[#71717A] mb-4">
                      Compatible with all MT4 brokers
                    </p>
                    <Button 
                      onClick={handleDownloadEA}
                      className="w-full bg-teal hover:bg-teal/90 text-[#09090B]"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download EA (.ex4)
                    </Button>
                  </div>

                  <div className="p-4 bg-[#0A0A0B] rounded-lg border border-[#27272A]">
                    <h4 className="font-medium text-[#FAFAFA] mb-2">MetaTrader 5</h4>
                    <p className="text-sm text-[#71717A] mb-4">
                      Compatible with all MT5 brokers
                    </p>
                    <Button 
                      onClick={handleDownloadEA}
                      className="w-full bg-teal hover:bg-teal/90 text-[#09090B]"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download EA (.ex5)
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-[#0A0A0B] rounded-lg border border-[#27272A]">
                  <h4 className="font-medium text-[#FAFAFA] mb-3">Installation Instructions</h4>
                  <ol className="space-y-2 text-sm text-[#A1A1AA]">
                    <li>1. Download the Expert Advisor file above</li>
                    <li>2. Open MetaTrader and go to File {">"} Open Data Folder</li>
                    <li>3. Navigate to MQL4/Experts (or MQL5/Experts)</li>
                    <li>4. Copy the downloaded .ex4/.ex5 file into this folder</li>
                    <li>5. Restart MetaTrader and find AlphaStream in Navigator</li>
                    <li>6. Drag the EA onto your chart and enter your API key</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
