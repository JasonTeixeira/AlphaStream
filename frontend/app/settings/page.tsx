"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Settings,
  Link,
  Database,
  Bell,
  Shield,
  Zap,
  Check,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Trash2,
  Plus,
} from "lucide-react"
import { toast } from "sonner"

interface BrokerConnection {
  id: string
  name: string
  type: string
  status: "connected" | "disconnected" | "error"
  lastSync?: string
  accountId?: string
}

interface DataFeed {
  id: string
  name: string
  type: "market_data" | "news" | "sentiment"
  status: "active" | "inactive" | "error"
  latency?: number
}

export default function SettingsPage() {
  const [brokers, setBrokers] = useState<BrokerConnection[]>([
    { id: "1", name: "Interactive Brokers", type: "broker", status: "connected", lastSync: "2 min ago", accountId: "U1234567" },
    { id: "2", name: "Alpaca Markets", type: "broker", status: "connected", lastSync: "5 min ago", accountId: "ABCD1234" },
    { id: "3", name: "TradeStation", type: "broker", status: "disconnected" },
  ])

  const [dataFeeds, setDataFeeds] = useState<DataFeed[]>([
    { id: "1", name: "Polygon.io", type: "market_data", status: "active", latency: 12 },
    { id: "2", name: "Alpha Vantage", type: "market_data", status: "active", latency: 45 },
    { id: "3", name: "Reuters News", type: "news", status: "active", latency: 230 },
    { id: "4", name: "StockTwits", type: "sentiment", status: "inactive" },
  ])

  const [notifications, setNotifications] = useState({
    emailSignals: true,
    emailDaily: true,
    pushSignals: true,
    pushPortfolio: false,
    slackIntegration: false,
    telegramBot: true,
  })

  const [riskSettings, setRiskSettings] = useState({
    maxPositionSize: "5",
    maxDailyLoss: "2",
    maxOpenPositions: "5",
    requireConfirmation: true,
    autoStopLoss: true,
    trailingStop: false,
  })

  const handleConnect = (id: string) => {
    setBrokers(prev => prev.map(b => 
      b.id === id ? { ...b, status: "connected" as const, lastSync: "Just now" } : b
    ))
    toast.success("Broker connected successfully")
  }

  const handleDisconnect = (id: string) => {
    setBrokers(prev => prev.map(b => 
      b.id === id ? { ...b, status: "disconnected" as const, lastSync: undefined } : b
    ))
    toast.success("Broker disconnected")
  }

  const handleToggleDataFeed = (id: string) => {
    setDataFeeds(prev => prev.map(f => 
      f.id === id ? { ...f, status: f.status === "active" ? "inactive" as const : "active" as const } : f
    ))
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#FAFAFA] flex items-center gap-3">
          <Settings className="h-7 w-7 text-teal" />
          Settings
        </h1>
        <p className="text-[#71717A] mt-1">Manage your integrations, notifications, and trading preferences</p>
      </div>

      <Tabs defaultValue="integrations" className="space-y-6">
        <TabsList className="bg-[#18181B] border border-[#27272A]">
          <TabsTrigger value="integrations" className="data-[state=active]:bg-teal data-[state=active]:text-[#0A0A0B]">
            <Link className="h-4 w-4 mr-2" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="data-feeds" className="data-[state=active]:bg-teal data-[state=active]:text-[#0A0A0B]">
            <Database className="h-4 w-4 mr-2" />
            Data Feeds
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-teal data-[state=active]:text-[#0A0A0B]">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="risk" className="data-[state=active]:bg-teal data-[state=active]:text-[#0A0A0B]">
            <Shield className="h-4 w-4 mr-2" />
            Risk Management
          </TabsTrigger>
        </TabsList>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-6">
          <Card className="bg-[#18181B] border-[#27272A]">
            <CardHeader>
              <CardTitle className="text-[#FAFAFA]">Broker Connections</CardTitle>
              <CardDescription className="text-[#71717A]">
                Connect your brokerage accounts for automated trade execution
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {brokers.map((broker) => (
                <div 
                  key={broker.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-[#0A0A0B] border border-[#27272A]"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#27272A] flex items-center justify-center">
                      <Zap className="h-5 w-5 text-teal" />
                    </div>
                    <div>
                      <p className="font-medium text-[#FAFAFA]">{broker.name}</p>
                      {broker.accountId && (
                        <p className="text-sm text-[#71717A]">Account: {broker.accountId}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {broker.status === "connected" && (
                      <div className="flex items-center gap-2 text-sm text-[#71717A]">
                        <RefreshCw className="h-3 w-3" />
                        {broker.lastSync}
                      </div>
                    )}
                    <Badge 
                      className={
                        broker.status === "connected" 
                          ? "bg-success/20 text-success border-success/30"
                          : broker.status === "error"
                          ? "bg-danger/20 text-danger border-danger/30"
                          : "bg-[#27272A] text-[#71717A] border-[#3F3F46]"
                      }
                    >
                      {broker.status === "connected" && <Check className="h-3 w-3 mr-1" />}
                      {broker.status === "error" && <AlertCircle className="h-3 w-3 mr-1" />}
                      {broker.status.charAt(0).toUpperCase() + broker.status.slice(1)}
                    </Badge>
                    {broker.status === "connected" ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-[#27272A] text-[#71717A] hover:text-danger hover:border-danger"
                        onClick={() => handleDisconnect(broker.id)}
                      >
                        Disconnect
                      </Button>
                    ) : (
                      <Button 
                        size="sm"
                        className="bg-teal text-[#0A0A0B] hover:bg-teal/90"
                        onClick={() => handleConnect(broker.id)}
                      >
                        Connect
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              <Button 
                variant="outline" 
                className="w-full border-dashed border-[#27272A] text-[#71717A] hover:text-teal hover:border-teal"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Broker
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-[#18181B] border-[#27272A]">
            <CardHeader>
              <CardTitle className="text-[#FAFAFA]">API Keys</CardTitle>
              <CardDescription className="text-[#71717A]">
                Manage API keys for external services and data providers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label htmlFor="openai-key" className="text-[#FAFAFA]">OpenAI API Key</Label>
                <div className="flex gap-2">
                  <Input 
                    id="openai-key"
                    type="password"
                    value="sk-••••••••••••••••••••••••••••••••"
                    className="bg-[#0A0A0B] border-[#27272A] text-[#FAFAFA] font-mono"
                    readOnly
                  />
                  <Button variant="outline" className="border-[#27272A] text-[#71717A]">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Separator className="bg-[#27272A]" />
              <div className="space-y-3">
                <Label htmlFor="polygon-key" className="text-[#FAFAFA]">Polygon.io API Key</Label>
                <div className="flex gap-2">
                  <Input 
                    id="polygon-key"
                    type="password"
                    value="pg_••••••••••••••••"
                    className="bg-[#0A0A0B] border-[#27272A] text-[#FAFAFA] font-mono"
                    readOnly
                  />
                  <Button variant="outline" className="border-[#27272A] text-[#71717A]">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Feeds Tab */}
        <TabsContent value="data-feeds" className="space-y-6">
          <Card className="bg-[#18181B] border-[#27272A]">
            <CardHeader>
              <CardTitle className="text-[#FAFAFA]">Market Data Sources</CardTitle>
              <CardDescription className="text-[#71717A]">
                Configure real-time data feeds for market analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {dataFeeds.map((feed) => (
                <div 
                  key={feed.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-[#0A0A0B] border border-[#27272A]"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#27272A] flex items-center justify-center">
                      <Database className="h-5 w-5 text-teal" />
                    </div>
                    <div>
                      <p className="font-medium text-[#FAFAFA]">{feed.name}</p>
                      <p className="text-sm text-[#71717A] capitalize">{feed.type.replace("_", " ")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {feed.latency && feed.status === "active" && (
                      <span className="text-sm text-[#71717A] font-mono">
                        {feed.latency}ms latency
                      </span>
                    )}
                    <Badge 
                      className={
                        feed.status === "active" 
                          ? "bg-success/20 text-success border-success/30"
                          : feed.status === "error"
                          ? "bg-danger/20 text-danger border-danger/30"
                          : "bg-[#27272A] text-[#71717A] border-[#3F3F46]"
                      }
                    >
                      {feed.status.charAt(0).toUpperCase() + feed.status.slice(1)}
                    </Badge>
                    <Switch 
                      checked={feed.status === "active"}
                      onCheckedChange={() => handleToggleDataFeed(feed.id)}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-[#18181B] border-[#27272A]">
            <CardHeader>
              <CardTitle className="text-[#FAFAFA]">Email Notifications</CardTitle>
              <CardDescription className="text-[#71717A]">
                Configure email alerts for signals and reports
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-[#0A0A0B] border border-[#27272A]">
                <div>
                  <p className="font-medium text-[#FAFAFA]">Signal Alerts</p>
                  <p className="text-sm text-[#71717A]">Receive email when new high-confidence signals are generated</p>
                </div>
                <Switch 
                  checked={notifications.emailSignals}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, emailSignals: checked }))}
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-[#0A0A0B] border border-[#27272A]">
                <div>
                  <p className="font-medium text-[#FAFAFA]">Daily Summary</p>
                  <p className="text-sm text-[#71717A]">Receive daily performance report and market outlook</p>
                </div>
                <Switch 
                  checked={notifications.emailDaily}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, emailDaily: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#18181B] border-[#27272A]">
            <CardHeader>
              <CardTitle className="text-[#FAFAFA]">Messaging Integrations</CardTitle>
              <CardDescription className="text-[#71717A]">
                Connect messaging platforms for instant alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-[#0A0A0B] border border-[#27272A]">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#27272A] flex items-center justify-center">
                    <svg className="h-5 w-5 text-[#FAFAFA]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-[#FAFAFA]">Telegram Bot</p>
                    <p className="text-sm text-[#71717A]">@YourTradingBot connected</p>
                  </div>
                </div>
                <Switch 
                  checked={notifications.telegramBot}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, telegramBot: checked }))}
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-[#0A0A0B] border border-[#27272A]">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#27272A] flex items-center justify-center">
                    <svg className="h-5 w-5 text-[#FAFAFA]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52a2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521a2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521a2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523a2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-[#FAFAFA]">Slack Integration</p>
                    <p className="text-sm text-[#71717A]">Not connected</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="border-[#27272A] text-[#71717A] hover:text-teal hover:border-teal">
                  Connect
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Risk Management Tab */}
        <TabsContent value="risk" className="space-y-6">
          <Card className="bg-[#18181B] border-[#27272A]">
            <CardHeader>
              <CardTitle className="text-[#FAFAFA]">Position Limits</CardTitle>
              <CardDescription className="text-[#71717A]">
                Set maximum position sizes and exposure limits
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="max-position" className="text-[#FAFAFA]">Max Position Size (%)</Label>
                  <Input 
                    id="max-position"
                    type="number"
                    value={riskSettings.maxPositionSize}
                    onChange={(e) => setRiskSettings(prev => ({ ...prev, maxPositionSize: e.target.value }))}
                    className="bg-[#0A0A0B] border-[#27272A] text-[#FAFAFA]"
                  />
                  <p className="text-xs text-[#71717A]">Maximum % of portfolio per position</p>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="max-loss" className="text-[#FAFAFA]">Max Daily Loss (%)</Label>
                  <Input 
                    id="max-loss"
                    type="number"
                    value={riskSettings.maxDailyLoss}
                    onChange={(e) => setRiskSettings(prev => ({ ...prev, maxDailyLoss: e.target.value }))}
                    className="bg-[#0A0A0B] border-[#27272A] text-[#FAFAFA]"
                  />
                  <p className="text-xs text-[#71717A]">Stop trading if daily loss exceeds</p>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="max-positions" className="text-[#FAFAFA]">Max Open Positions</Label>
                  <Input 
                    id="max-positions"
                    type="number"
                    value={riskSettings.maxOpenPositions}
                    onChange={(e) => setRiskSettings(prev => ({ ...prev, maxOpenPositions: e.target.value }))}
                    className="bg-[#0A0A0B] border-[#27272A] text-[#FAFAFA]"
                  />
                  <p className="text-xs text-[#71717A]">Maximum simultaneous positions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#18181B] border-[#27272A]">
            <CardHeader>
              <CardTitle className="text-[#FAFAFA]">Automated Protections</CardTitle>
              <CardDescription className="text-[#71717A]">
                Configure automatic risk management features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-[#0A0A0B] border border-[#27272A]">
                <div>
                  <p className="font-medium text-[#FAFAFA]">Require Confirmation</p>
                  <p className="text-sm text-[#71717A]">Ask for confirmation before executing trades</p>
                </div>
                <Switch 
                  checked={riskSettings.requireConfirmation}
                  onCheckedChange={(checked) => setRiskSettings(prev => ({ ...prev, requireConfirmation: checked }))}
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-[#0A0A0B] border border-[#27272A]">
                <div>
                  <p className="font-medium text-[#FAFAFA]">Auto Stop-Loss</p>
                  <p className="text-sm text-[#71717A]">Automatically set stop-loss on all positions</p>
                </div>
                <Switch 
                  checked={riskSettings.autoStopLoss}
                  onCheckedChange={(checked) => setRiskSettings(prev => ({ ...prev, autoStopLoss: checked }))}
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-[#0A0A0B] border border-[#27272A]">
                <div>
                  <p className="font-medium text-[#FAFAFA]">Trailing Stop</p>
                  <p className="text-sm text-[#71717A]">Use trailing stops to protect profits</p>
                </div>
                <Switch 
                  checked={riskSettings.trailingStop}
                  onCheckedChange={(checked) => setRiskSettings(prev => ({ ...prev, trailingStop: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button 
              className="bg-teal text-[#0A0A0B] hover:bg-teal/90"
              onClick={() => toast.success("Settings saved successfully")}
            >
              Save Changes
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
