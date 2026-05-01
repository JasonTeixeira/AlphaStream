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
  Plus, 
  Bell, 
  BellOff,
  Trash2,
  Edit2,
  TrendingUp,
  TrendingDown,
  Target,
  Zap
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const existingAlerts = [
  { 
    id: 1, 
    symbol: "NQ", 
    condition: "price_above", 
    value: 18500, 
    active: true,
    triggered: false,
    createdAt: "2024-08-10"
  },
  { 
    id: 2, 
    symbol: "ES", 
    condition: "price_below", 
    value: 5200, 
    active: true,
    triggered: false,
    createdAt: "2024-08-12"
  },
  { 
    id: 3, 
    symbol: "GC", 
    condition: "signal_generated", 
    value: null, 
    active: false,
    triggered: true,
    createdAt: "2024-08-08"
  },
  { 
    id: 4, 
    symbol: "NQ", 
    condition: "confidence_above", 
    value: 85, 
    active: true,
    triggered: false,
    createdAt: "2024-08-14"
  },
]

const conditionLabels: Record<string, string> = {
  price_above: "Price crosses above",
  price_below: "Price crosses below",
  signal_generated: "New signal generated",
  confidence_above: "Confidence above",
  volume_spike: "Volume spike detected",
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(existingAlerts)
  const [newAlert, setNewAlert] = useState({
    symbol: "",
    condition: "price_above",
    value: "",
  })

  const handleToggleAlert = (id: number) => {
    setAlerts(alerts.map(a => 
      a.id === id ? { ...a, active: !a.active } : a
    ))
  }

  const handleDeleteAlert = (id: number) => {
    setAlerts(alerts.filter(a => a.id !== id))
    toast.success("Alert deleted")
  }

  const handleCreateAlert = () => {
    if (!newAlert.symbol) {
      toast.error("Please select a symbol")
      return
    }
    const alert = {
      id: Date.now(),
      symbol: newAlert.symbol,
      condition: newAlert.condition,
      value: newAlert.value ? parseFloat(newAlert.value) : null,
      active: true,
      triggered: false,
      createdAt: new Date().toISOString().split('T')[0]
    }
    setAlerts([...alerts, alert])
    setNewAlert({ symbol: "", condition: "price_above", value: "" })
    toast.success("Alert created successfully")
  }

  const activeCount = alerts.filter(a => a.active).length
  const triggeredCount = alerts.filter(a => a.triggered).length

  return (
    <div className="min-h-screen bg-[#09090B]">
      <div className="border-b border-[#27272A] bg-[#09090B]/80 backdrop-blur-lg">
        <div className="px-4 md:px-6 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#FAFAFA]">Custom Alerts</h1>
            <p className="text-[#A1A1AA] mt-1">Set up custom price and signal alerts</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-teal hover:bg-teal/90 text-[#09090B]">
                <Plus className="mr-2 h-4 w-4" />
                Create Alert
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#18181B] border-[#27272A]">
              <DialogHeader>
                <DialogTitle className="text-[#FAFAFA]">Create Custom Alert</DialogTitle>
                <DialogDescription className="text-[#71717A]">
                  Set up conditions to trigger notifications
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label className="text-[#FAFAFA]">Symbol</Label>
                  <Select 
                    value={newAlert.symbol} 
                    onValueChange={(v) => setNewAlert({ ...newAlert, symbol: v })}
                  >
                    <SelectTrigger className="bg-[#0A0A0B] border-[#27272A] text-[#FAFAFA]">
                      <SelectValue placeholder="Select symbol" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#18181B] border-[#27272A]">
                      <SelectItem value="NQ">NQ - Nasdaq Futures</SelectItem>
                      <SelectItem value="ES">ES - S&P Futures</SelectItem>
                      <SelectItem value="GC">GC - Gold</SelectItem>
                      <SelectItem value="CL">CL - Crude Oil</SelectItem>
                      <SelectItem value="BTC">BTC - Bitcoin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-[#FAFAFA]">Condition</Label>
                  <Select 
                    value={newAlert.condition} 
                    onValueChange={(v) => setNewAlert({ ...newAlert, condition: v })}
                  >
                    <SelectTrigger className="bg-[#0A0A0B] border-[#27272A] text-[#FAFAFA]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#18181B] border-[#27272A]">
                      <SelectItem value="price_above">Price crosses above</SelectItem>
                      <SelectItem value="price_below">Price crosses below</SelectItem>
                      <SelectItem value="signal_generated">New signal generated</SelectItem>
                      <SelectItem value="confidence_above">Confidence above</SelectItem>
                      <SelectItem value="volume_spike">Volume spike detected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {newAlert.condition !== "signal_generated" && newAlert.condition !== "volume_spike" && (
                  <div className="space-y-2">
                    <Label className="text-[#FAFAFA]">
                      {newAlert.condition === "confidence_above" ? "Confidence %" : "Price"}
                    </Label>
                    <Input
                      type="number"
                      value={newAlert.value}
                      onChange={(e) => setNewAlert({ ...newAlert, value: e.target.value })}
                      placeholder={newAlert.condition === "confidence_above" ? "85" : "18500"}
                      className="bg-[#0A0A0B] border-[#27272A] text-[#FAFAFA] font-mono"
                    />
                  </div>
                )}

                <Button 
                  onClick={handleCreateAlert}
                  className="w-full bg-teal hover:bg-teal/90 text-[#09090B]"
                >
                  Create Alert
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-[#18181B] border-[#27272A]">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-[#71717A] text-sm mb-1">
                <Bell className="h-4 w-4" />
                Total Alerts
              </div>
              <p className="text-2xl font-bold text-[#FAFAFA] font-mono">{alerts.length}</p>
            </CardContent>
          </Card>

          <Card className="bg-[#18181B] border-[#27272A]">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-[#71717A] text-sm mb-1">
                <Zap className="h-4 w-4" />
                Active
              </div>
              <p className="text-2xl font-bold text-success font-mono">{activeCount}</p>
            </CardContent>
          </Card>

          <Card className="bg-[#18181B] border-[#27272A]">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-[#71717A] text-sm mb-1">
                <Target className="h-4 w-4" />
                Triggered Today
              </div>
              <p className="text-2xl font-bold text-teal font-mono">{triggeredCount}</p>
            </CardContent>
          </Card>
        </div>

        {/* Alerts List */}
        <Card className="bg-[#18181B] border-[#27272A]">
          <CardHeader>
            <CardTitle className="text-lg text-[#FAFAFA]">Your Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={cn(
                  "flex items-center justify-between p-4 rounded-lg border transition-colors",
                  alert.active 
                    ? "bg-[#0A0A0B] border-[#27272A]" 
                    : "bg-[#0A0A0B]/50 border-[#27272A]/50 opacity-60"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    alert.condition.includes("above") || alert.condition === "signal_generated"
                      ? "bg-success/20"
                      : "bg-danger/20"
                  )}>
                    {alert.condition.includes("above") || alert.condition === "signal_generated" ? (
                      <TrendingUp className={cn(
                        "h-5 w-5",
                        alert.condition.includes("above") || alert.condition === "signal_generated"
                          ? "text-success"
                          : "text-danger"
                      )} />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-danger" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#FAFAFA]">{alert.symbol}</span>
                      {alert.triggered && (
                        <Badge className="bg-teal/20 text-teal border-teal/30 text-xs">
                          Triggered
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-[#A1A1AA]">
                      {conditionLabels[alert.condition]}
                      {alert.value && (
                        <span className="font-mono ml-1">
                          {alert.condition === "confidence_above" ? `${alert.value}%` : `$${alert.value}`}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Switch
                    checked={alert.active}
                    onCheckedChange={() => handleToggleAlert(alert.id)}
                    className="data-[state=checked]:bg-teal"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteAlert(alert.id)}
                    className="text-[#71717A] hover:text-danger"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {alerts.length === 0 && (
              <div className="text-center py-12">
                <BellOff className="h-12 w-12 text-[#27272A] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[#FAFAFA] mb-2">No alerts yet</h3>
                <p className="text-[#71717A]">
                  Create your first alert to get notified when conditions are met
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
