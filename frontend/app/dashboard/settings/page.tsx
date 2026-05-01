"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Camera, Check, CreditCard, Sparkles, Bell, Plus, Copy, Trash2, AlertTriangle, Key } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const timezones = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Asia/Tokyo",
  "Asia/Singapore",
]

const symbols = ["NQ", "ES", "CL", "GC", "BTC", "ETH", "YM", "RTY"]

const apiKeys = [
  { id: 1, name: "Production", keyPrefix: "sk_live_", keySuffix: "4f2a", created: "Apr 15, 2025", lastUsed: "2 min ago", status: "active" },
  { id: 2, name: "Development", keyPrefix: "sk_test_", keySuffix: "8b1c", created: "Apr 20, 2025", lastUsed: "3 days ago", status: "active" },
]

const plans = [
  {
    name: "Starter",
    price: 49,
    features: ["5 symbols", "Daily signals", "Email alerts"],
    current: false,
  },
  {
    name: "Pro",
    price: 149,
    features: ["25 symbols", "Real-time signals", "API access", "SMS alerts"],
    current: true,
  },
  {
    name: "Premium",
    price: 299,
    features: ["Unlimited symbols", "WebSocket streaming", "Priority support"],
    current: false,
  },
]

export default function SettingsPage() {
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [smsAlerts, setSmsAlerts] = useState(true)
  const [minConfidence, setMinConfidence] = useState([70])
  const [selectedSymbols, setSelectedSymbols] = useState(["NQ", "ES", "CL", "BTC"])
  const [alertOnSignal, setAlertOnSignal] = useState(true)
  const [alertOnClose, setAlertOnClose] = useState(true)
  const [alertOnRetrain, setAlertOnRetrain] = useState(false)
  const [showNewKeyDialog, setShowNewKeyDialog] = useState(false)
  const [newKeyName, setNewKeyName] = useState("")
  const [generatedKey, setGeneratedKey] = useState<string | null>(null)

  const toggleSymbol = (symbol: string) => {
    setSelectedSymbols((prev) =>
      prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]
    )
  }

  const handleSave = () => {
    toast.success("Settings saved successfully")
  }

  const handleTestAlert = () => {
    toast.info("Test alert sent to your configured channels")
  }

  const handleCreateKey = () => {
    if (!newKeyName.trim()) {
      toast.error("Please enter a key name")
      return
    }
    const key = `sk_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
    setGeneratedKey(key)
  }

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key)
    toast.success("API key copied to clipboard")
  }

  const handleRevokeKey = (keyName: string) => {
    toast.success(`API key "${keyName}" revoked`)
  }

  const handleCloseNewKeyDialog = () => {
    setShowNewKeyDialog(false)
    setNewKeyName("")
    setGeneratedKey(null)
  }

  return (
    <div className="min-h-screen bg-[#09090B]">
      {/* Header */}
      <div className="border-b border-[#27272A] bg-[#09090B]/80 backdrop-blur-lg">
        <div className="px-4 md:px-6 py-6">
          <h1 className="text-2xl font-bold text-[#FAFAFA]">Settings</h1>
          <p className="text-[#A1A1AA] mt-1">Manage your account and preferences</p>
        </div>
      </div>

      <div className="p-4 md:p-6">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-[#18181B] border border-[#27272A] p-1">
            <TabsTrigger value="profile" className="data-[state=active]:bg-teal data-[state=active]:text-[#09090B]">
              Profile
            </TabsTrigger>
            <TabsTrigger value="subscription" className="data-[state=active]:bg-teal data-[state=active]:text-[#09090B]">
              Subscription
            </TabsTrigger>
            <TabsTrigger value="api-keys" className="data-[state=active]:bg-teal data-[state=active]:text-[#09090B]">
              API Keys
            </TabsTrigger>
            <TabsTrigger value="alerts" className="data-[state=active]:bg-teal data-[state=active]:text-[#09090B]">
              Alerts
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-[#18181B] border-[#27272A]">
              <CardHeader>
                <CardTitle className="text-lg text-[#FAFAFA]">Profile Information</CardTitle>
                <CardDescription className="text-[#71717A]">Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="h-20 w-20">
                      <AvatarFallback className="bg-[#27272A] text-teal text-2xl">JT</AvatarFallback>
                    </Avatar>
                    <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-teal flex items-center justify-center">
                      <Camera className="h-4 w-4 text-[#09090B]" />
                    </button>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#FAFAFA]">Profile Photo</h3>
                    <p className="text-sm text-[#71717A]">Click the camera to upload</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[#FAFAFA]">Full Name</Label>
                    <Input
                      defaultValue=""
                      placeholder="Your full name"
                      className="bg-[#0A0A0B] border-[#27272A] text-[#FAFAFA]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#FAFAFA]">Email</Label>
                    <div className="relative">
                      <Input
                        defaultValue=""
                        placeholder="your@email.com"
                        className="bg-[#0A0A0B] border-[#27272A] text-[#FAFAFA] pr-24"
                      />
                      <Badge className="absolute right-2 top-1/2 -translate-y-1/2 bg-success/20 text-success border-success/30">
                        <Check className="mr-1 h-3 w-3" />
                        Verified
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#FAFAFA]">Timezone</Label>
                    <Select defaultValue="America/New_York">
                      <SelectTrigger className="bg-[#0A0A0B] border-[#27272A] text-[#FAFAFA]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#18181B] border-[#27272A]">
                        {timezones.map((tz) => (
                          <SelectItem key={tz} value={tz}>
                            {tz}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={handleSave} className="bg-teal hover:bg-teal/90 text-[#09090B]">
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subscription Tab */}
          <TabsContent value="subscription" className="space-y-6">
            {/* Current Plan */}
            <Card className="bg-[#18181B] border-violet/30">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-[#FAFAFA]">Pro Plan</h3>
                      <Badge className="bg-violet/20 text-violet border-violet/30">Current</Badge>
                    </div>
                    <p className="text-[#A1A1AA]">$149/month · Renews May 30, 2025</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" className="border-[#27272A] text-[#A1A1AA] hover:text-[#FAFAFA]">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Manage Subscription
                    </Button>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#A1A1AA]">Symbols Used</span>
                    <span className="text-sm font-mono text-[#FAFAFA]">18 of 25</span>
                  </div>
                  <Progress value={72} className="h-2 bg-[#27272A]" />
                </div>

                <button className="mt-4 text-sm text-danger hover:underline">Cancel Plan</button>
              </CardContent>
            </Card>

            {/* Plan Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {plans.map((plan) => (
                <Card
                  key={plan.name}
                  className={cn(
                    "bg-[#18181B] border-[#27272A]",
                    plan.current && "border-violet ring-1 ring-violet"
                  )}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-[#FAFAFA]">{plan.name}</h3>
                      {plan.current && (
                        <Badge className="bg-violet/20 text-violet border-violet/30 text-xs">Current</Badge>
                      )}
                    </div>
                    <p className="text-3xl font-bold text-[#FAFAFA] mb-4">
                      ${plan.price}<span className="text-sm font-normal text-[#71717A]">/mo</span>
                    </p>
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-[#A1A1AA]">
                          <Check className="h-4 w-4 text-teal" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    {!plan.current && (
                      <Button className="w-full bg-[#27272A] hover:bg-[#3F3F46] text-[#FAFAFA]">
                        <Sparkles className="mr-2 h-4 w-4" />
                        Upgrade
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* API Keys Tab */}
          <TabsContent value="api-keys" className="space-y-6">
            <Card className="bg-[#18181B] border-[#27272A]">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg text-[#FAFAFA]">API Keys</CardTitle>
                  <CardDescription className="text-[#71717A]">Manage your API keys for programmatic access</CardDescription>
                </div>
                <Dialog open={showNewKeyDialog} onOpenChange={setShowNewKeyDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-teal hover:bg-teal/90 text-[#09090B]">
                      <Plus className="mr-2 h-4 w-4" />
                      Create New Key
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[#18181B] border-[#27272A]">
                    <DialogHeader>
                      <DialogTitle className="text-[#FAFAFA]">Create New API Key</DialogTitle>
                      <DialogDescription className="text-[#71717A]">
                        Give your key a name to identify it later.
                      </DialogDescription>
                    </DialogHeader>
                    {!generatedKey ? (
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label className="text-[#FAFAFA]">Key Name</Label>
                          <Input
                            value={newKeyName}
                            onChange={(e) => setNewKeyName(e.target.value)}
                            placeholder="e.g., Production, Development"
                            className="bg-[#0A0A0B] border-[#27272A] text-[#FAFAFA]"
                          />
                        </div>
                        <Button onClick={handleCreateKey} className="w-full bg-teal hover:bg-teal/90 text-[#09090B]">
                          Create Key
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4 py-4">
                        <div className="p-4 bg-[#0A0A0B] rounded-lg border border-[#27272A]">
                          <p className="text-xs text-[#71717A] mb-2">Your new API key:</p>
                          <code className="text-sm font-mono text-teal break-all">{generatedKey}</code>
                        </div>
                        <div className="flex items-start gap-2 p-3 bg-warning/10 border border-warning/30 rounded-lg">
                          <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                          <p className="text-sm text-warning">
                            This key will only be shown once. Make sure to copy it now.
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <Button onClick={() => handleCopyKey(generatedKey)} className="flex-1 bg-teal hover:bg-teal/90 text-[#09090B]">
                            <Copy className="mr-2 h-4 w-4" />
                            Copy Key
                          </Button>
                          <Button onClick={handleCloseNewKeyDialog} variant="outline" className="flex-1 border-[#27272A] text-[#A1A1AA]">
                            Done
                          </Button>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#27272A] bg-[#0A0A0B]">
                      <TableHead className="text-[#A1A1AA]">Name</TableHead>
                      <TableHead className="text-[#A1A1AA]">Key</TableHead>
                      <TableHead className="text-[#A1A1AA]">Created</TableHead>
                      <TableHead className="text-[#A1A1AA]">Last Used</TableHead>
                      <TableHead className="text-[#A1A1AA]">Status</TableHead>
                      <TableHead className="text-[#A1A1AA] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apiKeys.map((key) => (
                      <TableRow key={key.id} className="border-[#27272A]">
                        <TableCell className="font-medium text-[#FAFAFA]">{key.name}</TableCell>
                        <TableCell className="font-mono text-[#A1A1AA]">
                          {key.keyPrefix}...{key.keySuffix}
                        </TableCell>
                        <TableCell className="text-[#71717A]">{key.created}</TableCell>
                        <TableCell className="text-[#71717A]">{key.lastUsed}</TableCell>
                        <TableCell>
                          <Badge className="bg-success/20 text-success border-success/30">Active</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopyKey(`${key.keyPrefix}xxxxxxxx${key.keySuffix}`)}
                              className="text-[#A1A1AA] hover:text-[#FAFAFA]"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRevokeKey(key.name)}
                              className="text-danger hover:text-danger hover:bg-danger/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Rate Limit Display */}
            <Card className="bg-[#18181B] border-[#27272A]">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Key className="h-5 w-5 text-teal" />
                  <div>
                    <h3 className="font-semibold text-[#FAFAFA]">Rate Limit</h3>
                    <p className="text-sm text-[#71717A]">Pro Plan: 1,000 requests/hour</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#A1A1AA]">Current Usage</span>
                    <span className="font-mono text-[#FAFAFA]">342 / 1,000</span>
                  </div>
                  <Progress value={34.2} className="h-2 bg-[#27272A]" />
                  <p className="text-xs text-[#71717A]">Resets in 47 minutes</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="space-y-6">
            <Card className="bg-[#18181B] border-[#27272A]">
              <CardHeader>
                <CardTitle className="text-lg text-[#FAFAFA]">Notification Channels</CardTitle>
                <CardDescription className="text-[#71717A]">Configure how you receive alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Email Alerts */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-[#FAFAFA]">Email Alerts</Label>
                    <p className="text-sm text-[#71717A]">Receive signals via email</p>
                  </div>
                  <Switch
                    checked={emailAlerts}
                    onCheckedChange={setEmailAlerts}
                    className="data-[state=checked]:bg-teal"
                  />
                </div>
                {emailAlerts && (
                  <Input
                    defaultValue=""
                    className="bg-[#0A0A0B] border-[#27272A] text-[#FAFAFA]"
                    placeholder="Email address"
                  />
                )}

                {/* SMS Alerts */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-[#FAFAFA]">SMS Alerts</Label>
                    <p className="text-sm text-[#71717A]">Receive signals via text message (Pro+)</p>
                  </div>
                  <Switch
                    checked={smsAlerts}
                    onCheckedChange={setSmsAlerts}
                    className="data-[state=checked]:bg-teal"
                  />
                </div>
                {smsAlerts && (
                  <Input
                    defaultValue="+1 (555) 123-4567"
                    className="bg-[#0A0A0B] border-[#27272A] text-[#FAFAFA]"
                    placeholder="Phone number"
                  />
                )}

                {/* Webhook */}
                <div className="space-y-2">
                  <Label className="text-[#FAFAFA]">Webhook URL</Label>
                  <Input
                    placeholder="https://your-app.com/webhook"
                    className="bg-[#0A0A0B] border-[#27272A] text-[#FAFAFA] placeholder:text-[#71717A]"
                  />
                </div>

                {/* Discord Webhook */}
                <div className="space-y-2">
                  <Label className="text-[#FAFAFA]">Discord Webhook</Label>
                  <Input
                    placeholder="https://discord.com/api/webhooks/..."
                    className="bg-[#0A0A0B] border-[#27272A] text-[#FAFAFA] placeholder:text-[#71717A]"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#18181B] border-[#27272A]">
              <CardHeader>
                <CardTitle className="text-lg text-[#FAFAFA]">Alert Preferences</CardTitle>
                <CardDescription className="text-[#71717A]">Customize when and what alerts you receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Min Confidence */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-[#FAFAFA]">Minimum Confidence Threshold</Label>
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

                {/* Symbols to Alert */}
                <div className="space-y-3">
                  <Label className="text-[#FAFAFA]">Symbols to Alert On</Label>
                  <div className="flex flex-wrap gap-2">
                    {symbols.map((symbol) => (
                      <button
                        key={symbol}
                        onClick={() => toggleSymbol(symbol)}
                        className={cn(
                          "px-3 py-1.5 text-sm font-mono rounded-md border transition-colors",
                          selectedSymbols.includes(symbol)
                            ? "bg-teal/20 text-teal border-teal/30"
                            : "bg-[#27272A] text-[#A1A1AA] border-[#27272A] hover:border-[#3F3F46]"
                        )}
                      >
                        {symbol}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Alert On */}
                <div className="space-y-3">
                  <Label className="text-[#FAFAFA]">Alert On</Label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="new-signal"
                        checked={alertOnSignal}
                        onCheckedChange={(checked) => setAlertOnSignal(checked as boolean)}
                        className="border-[#27272A] data-[state=checked]:bg-teal data-[state=checked]:border-teal"
                      />
                      <label htmlFor="new-signal" className="text-sm text-[#A1A1AA] cursor-pointer">
                        New signals
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="signal-closed"
                        checked={alertOnClose}
                        onCheckedChange={(checked) => setAlertOnClose(checked as boolean)}
                        className="border-[#27272A] data-[state=checked]:bg-teal data-[state=checked]:border-teal"
                      />
                      <label htmlFor="signal-closed" className="text-sm text-[#A1A1AA] cursor-pointer">
                        Signal closed
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="model-retrained"
                        checked={alertOnRetrain}
                        onCheckedChange={(checked) => setAlertOnRetrain(checked as boolean)}
                        className="border-[#27272A] data-[state=checked]:bg-teal data-[state=checked]:border-teal"
                      />
                      <label htmlFor="model-retrained" className="text-sm text-[#A1A1AA] cursor-pointer">
                        Model retrained
                      </label>
                    </div>
                  </div>
                </div>

                {/* Quiet Hours */}
                <div className="space-y-3">
                  <Label className="text-[#FAFAFA]">Quiet Hours</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm text-[#71717A]">Start</Label>
                      <Input
                        type="time"
                        defaultValue="22:00"
                        className="bg-[#0A0A0B] border-[#27272A] text-[#FAFAFA]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-[#71717A]">End</Label>
                      <Input
                        type="time"
                        defaultValue="06:00"
                        className="bg-[#0A0A0B] border-[#27272A] text-[#FAFAFA]"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <Button onClick={handleSave} className="bg-teal hover:bg-teal/90 text-[#09090B]">
                    Save Preferences
                  </Button>
                  <Button onClick={handleTestAlert} variant="outline" className="border-[#27272A] text-[#A1A1AA] hover:text-[#FAFAFA]">
                    <Bell className="mr-2 h-4 w-4" />
                    Test Alert
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
