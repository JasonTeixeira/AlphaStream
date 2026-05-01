"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
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
  MessageCircle, 
  Send, 
  Slack, 
  Mail, 
  Smartphone, 
  Webhook,
  Check,
  ExternalLink,
  Plus,
  Trash2,
  Settings,
  TestTube,
  Zap
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const integrations = [
  {
    id: "telegram",
    name: "Telegram",
    description: "Receive signals instantly via Telegram bot",
    icon: Send,
    color: "#0088cc",
    connected: true,
    username: "@alphastream_bot",
  },
  {
    id: "discord",
    name: "Discord",
    description: "Get alerts in your Discord server",
    icon: MessageCircle,
    color: "#5865F2",
    connected: false,
  },
  {
    id: "slack",
    name: "Slack",
    description: "Integrate with your team's Slack workspace",
    icon: Slack,
    color: "#4A154B",
    connected: false,
  },
  {
    id: "email",
    name: "Email Digest",
    description: "Daily or weekly signal summaries",
    icon: Mail,
    color: "#06B6D4",
    connected: true,
    frequency: "daily",
  },
  {
    id: "sms",
    name: "SMS Alerts",
    description: "Text message alerts for high-confidence signals",
    icon: Smartphone,
    color: "#10B981",
    connected: false,
  },
  {
    id: "webhook",
    name: "Custom Webhook",
    description: "Send signals to any endpoint",
    icon: Webhook,
    color: "#F59E0B",
    connected: true,
    endpoints: 2,
  },
]

export default function IntegrationsSettingsPage() {
  const [telegramToken, setTelegramToken] = useState("")
  const [discordWebhook, setDiscordWebhook] = useState("")
  const [webhookUrl, setWebhookUrl] = useState("")
  const [webhooks, setWebhooks] = useState([
    { id: 1, url: "https://api.mybroker.com/webhook/signals", name: "Trading Bot" },
    { id: 2, url: "https://n8n.example.com/webhook/abc123", name: "Automation" },
  ])
  const [emailFrequency, setEmailFrequency] = useState("daily")
  const [phoneNumber, setPhoneNumber] = useState("")

  const handleConnect = (integration: string) => {
    toast.success(`${integration} connected successfully!`)
  }

  const handleDisconnect = (integration: string) => {
    toast.success(`${integration} disconnected`)
  }

  const handleTestWebhook = (url: string) => {
    toast.info("Sending test payload...")
    setTimeout(() => {
      toast.success("Test payload delivered successfully!")
    }, 1500)
  }

  const handleAddWebhook = () => {
    if (!webhookUrl.trim()) {
      toast.error("Please enter a webhook URL")
      return
    }
    setWebhooks([...webhooks, { id: Date.now(), url: webhookUrl, name: "New Webhook" }])
    setWebhookUrl("")
    toast.success("Webhook added successfully!")
  }

  const handleRemoveWebhook = (id: number) => {
    setWebhooks(webhooks.filter(w => w.id !== id))
    toast.success("Webhook removed")
  }

  return (
    <div className="min-h-screen bg-[#09090B]">
      <div className="border-b border-[#27272A] bg-[#09090B]/80 backdrop-blur-lg">
        <div className="px-4 md:px-6 py-6">
          <h1 className="text-2xl font-bold text-[#FAFAFA]">Integrations</h1>
          <p className="text-[#A1A1AA] mt-1">Connect AlphaStream to your favorite tools</p>
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-6">
        {/* Integration Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {integrations.map((integration) => (
            <Card key={integration.id} className="bg-[#18181B] border-[#27272A]">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: `${integration.color}20` }}
                    >
                      <integration.icon 
                        className="h-5 w-5" 
                        style={{ color: integration.color }}
                      />
                    </div>
                    <div>
                      <CardTitle className="text-base text-[#FAFAFA]">
                        {integration.name}
                      </CardTitle>
                      {integration.connected && (
                        <Badge className="mt-1 bg-success/20 text-success border-success/30 text-xs">
                          Connected
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <CardDescription className="text-[#71717A] mt-2">
                  {integration.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {integration.id === "telegram" && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant={integration.connected ? "outline" : "default"}
                        className={cn(
                          "w-full",
                          integration.connected 
                            ? "border-[#27272A] text-[#A1A1AA]" 
                            : "bg-teal hover:bg-teal/90 text-[#09090B]"
                        )}
                      >
                        {integration.connected ? (
                          <>
                            <Settings className="mr-2 h-4 w-4" />
                            Configure
                          </>
                        ) : (
                          <>
                            <Plus className="mr-2 h-4 w-4" />
                            Connect
                          </>
                        )}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#18181B] border-[#27272A]">
                      <DialogHeader>
                        <DialogTitle className="text-[#FAFAFA]">Telegram Integration</DialogTitle>
                        <DialogDescription className="text-[#71717A]">
                          Connect your Telegram account to receive signals
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="p-4 bg-[#0A0A0B] rounded-lg border border-[#27272A]">
                          <h4 className="font-medium text-[#FAFAFA] mb-2">Setup Instructions</h4>
                          <ol className="space-y-2 text-sm text-[#A1A1AA]">
                            <li>1. Open Telegram and search for @AlphaStreamBot</li>
                            <li>2. Start a conversation and send /start</li>
                            <li>3. Copy the token provided and paste below</li>
                          </ol>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[#FAFAFA]">Verification Token</Label>
                          <Input
                            value={telegramToken}
                            onChange={(e) => setTelegramToken(e.target.value)}
                            placeholder="Paste your token here"
                            className="bg-[#0A0A0B] border-[#27272A] text-[#FAFAFA]"
                          />
                        </div>
                        <div className="flex gap-3">
                          <Button className="flex-1 bg-teal hover:bg-teal/90 text-[#09090B]">
                            <Check className="mr-2 h-4 w-4" />
                            Verify & Connect
                          </Button>
                          <Button variant="outline" className="border-[#27272A] text-[#A1A1AA]" asChild>
                            <a href="https://t.me/AlphaStreamBot" target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Open Bot
                            </a>
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}

                {integration.id === "discord" && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-[#5865F2] hover:bg-[#5865F2]/90 text-white">
                        <Plus className="mr-2 h-4 w-4" />
                        Add to Discord
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#18181B] border-[#27272A]">
                      <DialogHeader>
                        <DialogTitle className="text-[#FAFAFA]">Discord Integration</DialogTitle>
                        <DialogDescription className="text-[#71717A]">
                          Add AlphaStream bot to your Discord server
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label className="text-[#FAFAFA]">Webhook URL</Label>
                          <Input
                            value={discordWebhook}
                            onChange={(e) => setDiscordWebhook(e.target.value)}
                            placeholder="https://discord.com/api/webhooks/..."
                            className="bg-[#0A0A0B] border-[#27272A] text-[#FAFAFA]"
                          />
                          <p className="text-xs text-[#71717A]">
                            Create a webhook in your Discord server settings
                          </p>
                        </div>
                        <Button 
                          onClick={() => handleConnect("Discord")}
                          className="w-full bg-[#5865F2] hover:bg-[#5865F2]/90 text-white"
                        >
                          Connect Discord
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}

                {integration.id === "slack" && (
                  <Button 
                    className="w-full"
                    style={{ backgroundColor: "#4A154B" }}
                    onClick={() => handleConnect("Slack")}
                  >
                    <Slack className="mr-2 h-4 w-4" />
                    Add to Slack
                  </Button>
                )}

                {integration.id === "email" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-[#FAFAFA]">Digest Frequency</Label>
                      <Select value={emailFrequency} onValueChange={setEmailFrequency}>
                        <SelectTrigger className="w-32 bg-[#0A0A0B] border-[#27272A] text-[#FAFAFA]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#18181B] border-[#27272A]">
                          <SelectItem value="realtime">Real-time</SelectItem>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#A1A1AA]">Include charts</span>
                      <Switch defaultChecked className="data-[state=checked]:bg-teal" />
                    </div>
                  </div>
                )}

                {integration.id === "sms" && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-success hover:bg-success/90 text-white">
                        <Smartphone className="mr-2 h-4 w-4" />
                        Enable SMS
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#18181B] border-[#27272A]">
                      <DialogHeader>
                        <DialogTitle className="text-[#FAFAFA]">SMS Alerts</DialogTitle>
                        <DialogDescription className="text-[#71717A]">
                          Receive text messages for high-confidence signals
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label className="text-[#FAFAFA]">Phone Number</Label>
                          <Input
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="+1 (555) 123-4567"
                            className="bg-[#0A0A0B] border-[#27272A] text-[#FAFAFA]"
                          />
                        </div>
                        <div className="p-3 bg-warning/10 border border-warning/30 rounded-lg">
                          <p className="text-sm text-warning">
                            SMS alerts are available on Pro and Enterprise plans. 
                            Standard messaging rates may apply.
                          </p>
                        </div>
                        <Button className="w-full bg-success hover:bg-success/90 text-white">
                          Verify Phone Number
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}

                {integration.id === "webhook" && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full border-[#27272A] text-[#A1A1AA]">
                        <Settings className="mr-2 h-4 w-4" />
                        Manage Webhooks ({webhooks.length})
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#18181B] border-[#27272A] max-w-lg">
                      <DialogHeader>
                        <DialogTitle className="text-[#FAFAFA]">Custom Webhooks</DialogTitle>
                        <DialogDescription className="text-[#71717A]">
                          Send signals to any HTTP endpoint
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        {/* Existing Webhooks */}
                        <div className="space-y-2">
                          {webhooks.map((webhook) => (
                            <div 
                              key={webhook.id}
                              className="flex items-center gap-2 p-3 bg-[#0A0A0B] rounded-lg border border-[#27272A]"
                            >
                              <Zap className="h-4 w-4 text-warning shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-[#FAFAFA] truncate">
                                  {webhook.name}
                                </p>
                                <p className="text-xs text-[#71717A] truncate">
                                  {webhook.url}
                                </p>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleTestWebhook(webhook.url)}
                                className="text-[#A1A1AA] hover:text-[#FAFAFA] shrink-0"
                              >
                                <TestTube className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleRemoveWebhook(webhook.id)}
                                className="text-danger hover:text-danger shrink-0"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>

                        {/* Add New Webhook */}
                        <div className="space-y-2">
                          <Label className="text-[#FAFAFA]">Add New Webhook</Label>
                          <div className="flex gap-2">
                            <Input
                              value={webhookUrl}
                              onChange={(e) => setWebhookUrl(e.target.value)}
                              placeholder="https://your-endpoint.com/webhook"
                              className="bg-[#0A0A0B] border-[#27272A] text-[#FAFAFA]"
                            />
                            <Button 
                              onClick={handleAddWebhook}
                              className="bg-teal hover:bg-teal/90 text-[#09090B] shrink-0"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Webhook Payload Info */}
                        <div className="p-3 bg-[#0A0A0B] rounded-lg border border-[#27272A]">
                          <p className="text-xs text-[#71717A] font-mono">
                            POST payload: {`{ "signal": {...}, "timestamp": "..." }`}
                          </p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Signal Delivery Settings */}
        <Card className="bg-[#18181B] border-[#27272A]">
          <CardHeader>
            <CardTitle className="text-lg text-[#FAFAFA]">Delivery Preferences</CardTitle>
            <CardDescription className="text-[#71717A]">
              Choose which signals to receive on each channel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium text-[#FAFAFA]">Signal Types</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#A1A1AA]">Long signals</span>
                    <Switch defaultChecked className="data-[state=checked]:bg-teal" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#A1A1AA]">Short signals</span>
                    <Switch defaultChecked className="data-[state=checked]:bg-teal" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#A1A1AA]">Exit signals</span>
                    <Switch defaultChecked className="data-[state=checked]:bg-teal" />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-[#FAFAFA]">Confidence Filter</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#A1A1AA]">High (80%+)</span>
                    <Switch defaultChecked className="data-[state=checked]:bg-teal" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#A1A1AA]">Medium (60-79%)</span>
                    <Switch defaultChecked className="data-[state=checked]:bg-teal" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#A1A1AA]">Low (40-59%)</span>
                    <Switch className="data-[state=checked]:bg-teal" />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-[#FAFAFA]">Timing</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#A1A1AA]">During market hours</span>
                    <Switch defaultChecked className="data-[state=checked]:bg-teal" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#A1A1AA]">After hours</span>
                    <Switch className="data-[state=checked]:bg-teal" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#A1A1AA]">Weekends</span>
                    <Switch className="data-[state=checked]:bg-teal" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
