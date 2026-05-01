"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useAuth } from "@/contexts/auth-context"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import {
  CreditCard,
  Download,
  Plus,
  Check,
  Sparkles,
  Zap,
  Crown,
  AlertTriangle,
  Trash2,
  ExternalLink,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

const plans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    icon: Zap,
    features: [
      "5 signals per day",
      "2 symbols",
      "1 API key",
      "Email alerts",
      "Community support",
    ],
  },
  {
    id: "starter",
    name: "Starter",
    price: 49,
    icon: Sparkles,
    features: [
      "25 signals per day",
      "5 symbols",
      "2 API keys",
      "Email alerts",
      "Standard support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 149,
    icon: Sparkles,
    popular: true,
    features: [
      "Unlimited signals",
      "All symbols",
      "5 API keys",
      "Email + SMS alerts",
      "Webhook integrations",
      "Backtester access",
      "Priority support",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: 299,
    icon: Crown,
    features: [
      "Everything in Pro",
      "Unlimited API keys",
      "Custom models",
      "Dedicated infrastructure",
      "SLA guarantee",
      "24/7 phone support",
      "Custom integrations",
    ],
  },
]

const invoices = [
  { id: "INV-001", date: new Date(2024, 2, 1), amount: 99, status: "paid" },
  { id: "INV-002", date: new Date(2024, 1, 1), amount: 99, status: "paid" },
  { id: "INV-003", date: new Date(2024, 0, 1), amount: 99, status: "paid" },
  { id: "INV-004", date: new Date(2023, 11, 1), amount: 99, status: "paid" },
  { id: "INV-005", date: new Date(2023, 10, 1), amount: 99, status: "paid" },
]

const paymentMethods = [
  { id: "pm_1", brand: "visa", last4: "4242", expiry: "12/26", isDefault: true },
  { id: "pm_2", brand: "mastercard", last4: "8888", expiry: "09/25", isDefault: false },
]

const usage = {
  signals: { used: 847, limit: 1000 },
  apiCalls: { used: 12450, limit: 50000 },
  apiKeys: { used: 3, limit: 5 },
}

export default function BillingPage() {
  const { user } = useAuth()
  const [showChangePlanModal, setShowChangePlanModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const currentPlan = plans.find((p) => p.id === user?.plan) || plans[0]

  const handleChangePlan = (planId: string) => {
    setSelectedPlan(planId)
    setShowChangePlanModal(true)
  }

  const confirmPlanChange = async () => {
    setIsProcessing(true)
    await new Promise((r) => setTimeout(r, 2000))
    setIsProcessing(false)
    setShowChangePlanModal(false)
    toast.success("Plan changed successfully!")
  }

  const downloadInvoice = (invoiceId: string) => {
    toast.success(`Downloading ${invoiceId}...`)
  }

  return (
    <div className="min-h-screen bg-[#09090B]">
      {/* Header */}
      <div className="border-b border-[#27272A] bg-[#09090B]/80 backdrop-blur-lg">
        <div className="px-4 md:px-6 py-6">
          <h1 className="text-2xl font-bold text-[#FAFAFA]">Billing & Subscription</h1>
          <p className="text-[#A1A1AA] mt-1">
            Manage your subscription, payment methods, and billing history.
          </p>
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-6">
        {/* Current Plan */}
        <Card className="bg-[#18181B] border-[#27272A]">
          <CardHeader>
            <CardTitle className="text-[#FAFAFA] flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal/10 border border-teal/30 flex items-center justify-center">
                <currentPlan.icon className="h-5 w-5 text-teal" />
              </div>
              Current Plan
            </CardTitle>
            <CardDescription>
              You are currently on the <span className="text-[#FAFAFA] font-medium">{currentPlan.name}</span> plan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-[#FAFAFA]">${currentPlan.price}</span>
                  <span className="text-[#71717A]">/month</span>
                </div>
                <p className="text-sm text-[#A1A1AA] mt-1">
                  Next billing date: April 1, 2024
                </p>
              </div>
              <Button
                onClick={() => setShowChangePlanModal(true)}
                className="bg-teal hover:bg-teal/90 text-[#09090B] font-medium"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Change Plan
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Usage */}
        <Card className="bg-[#18181B] border-[#27272A]">
          <CardHeader>
            <CardTitle className="text-[#FAFAFA]">Usage This Month</CardTitle>
            <CardDescription>Track your usage against your plan limits.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.entries(usage).map(([key, value]) => {
              const percentage = (value.used / value.limit) * 100
              const isNearLimit = percentage >= 80
              
              return (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#FAFAFA] capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                    <span className={cn(
                      "text-sm font-mono",
                      isNearLimit ? "text-warning" : "text-[#A1A1AA]"
                    )}>
                      {value.used.toLocaleString()} / {value.limit.toLocaleString()}
                    </span>
                  </div>
                  <Progress 
                    value={percentage} 
                    className={cn(
                      "h-2 bg-[#27272A]",
                      isNearLimit && "[&>div]:bg-warning"
                    )} 
                  />
                  {isNearLimit && (
                    <div className="flex items-center gap-2 text-xs text-warning">
                      <AlertTriangle className="h-3 w-3" />
                      Approaching limit
                    </div>
                  )}
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card className="bg-[#18181B] border-[#27272A]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-[#FAFAFA]">Payment Methods</CardTitle>
                <CardDescription>Manage your payment methods.</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-[#27272A] text-[#A1A1AA] hover:text-[#FAFAFA]"
                onClick={() => toast.info("Add payment method flow would open here")}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Method
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center justify-between p-4 bg-[#27272A]/50 rounded-lg border border-[#27272A]"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-8 bg-[#27272A] rounded flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-[#A1A1AA]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[#FAFAFA] font-medium capitalize">
                          {method.brand}
                        </span>
                        <span className="text-[#71717A] font-mono">
                          **** {method.last4}
                        </span>
                        {method.isDefault && (
                          <Badge className="bg-teal/20 text-teal border-teal/30 text-xs">
                            Default
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-[#71717A]">Expires {method.expiry}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-[#71717A] hover:text-danger"
                    onClick={() => toast.info("Remove payment method")}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Invoice History */}
        <Card className="bg-[#18181B] border-[#27272A]">
          <CardHeader>
            <CardTitle className="text-[#FAFAFA]">Invoice History</CardTitle>
            <CardDescription>Download your past invoices for your records.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-[#27272A] bg-[#0A0A0B]">
                  <TableHead className="text-[#A1A1AA]">Invoice</TableHead>
                  <TableHead className="text-[#A1A1AA]">Date</TableHead>
                  <TableHead className="text-[#A1A1AA]">Amount</TableHead>
                  <TableHead className="text-[#A1A1AA]">Status</TableHead>
                  <TableHead className="text-[#A1A1AA] text-right">Download</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id} className="border-[#27272A]">
                    <TableCell className="font-mono text-[#FAFAFA]">{invoice.id}</TableCell>
                    <TableCell className="text-[#A1A1AA]">
                      {format(invoice.date, "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="font-mono text-[#FAFAFA]">
                      ${invoice.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-success/20 text-success border-success/30 capitalize">
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => downloadInvoice(invoice.id)}
                        className="text-[#A1A1AA] hover:text-[#FAFAFA]"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Change Plan Modal */}
      <Dialog open={showChangePlanModal} onOpenChange={setShowChangePlanModal}>
        <DialogContent className="bg-[#18181B] border-[#27272A] max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-[#FAFAFA]">Change Your Plan</DialogTitle>
            <DialogDescription>
              Select a plan that best fits your trading needs.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-4">
            {plans.map((plan) => {
              const isCurrentPlan = plan.id === user?.plan
              const Icon = plan.icon
              
              return (
                <div
                  key={plan.id}
                  className={cn(
                    "relative p-4 rounded-lg border transition-all cursor-pointer",
                    selectedPlan === plan.id
                      ? "bg-teal/10 border-teal"
                      : isCurrentPlan
                      ? "bg-[#27272A]/50 border-[#3F3F46]"
                      : "bg-[#27272A]/30 border-[#27272A] hover:border-[#3F3F46]"
                  )}
                  onClick={() => !isCurrentPlan && setSelectedPlan(plan.id)}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-violet text-white border-0">
                      Most Popular
                    </Badge>
                  )}
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      plan.id === "pro" ? "bg-violet/20" : "bg-teal/10"
                    )}>
                      <Icon className={cn(
                        "h-5 w-5",
                        plan.id === "pro" ? "text-violet" : "text-teal"
                      )} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#FAFAFA]">{plan.name}</h3>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold text-[#FAFAFA]">${plan.price}</span>
                        <span className="text-xs text-[#71717A]">/mo</span>
                      </div>
                    </div>
                  </div>

                  <ul className="space-y-2">
                    {plan.features.slice(0, 4).map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-[#A1A1AA]">
                        <Check className="h-3 w-3 text-teal shrink-0" />
                        {feature}
                      </li>
                    ))}
                    {plan.features.length > 4 && (
                      <li className="text-xs text-[#71717A]">
                        +{plan.features.length - 4} more features
                      </li>
                    )}
                  </ul>

                  {isCurrentPlan && (
                    <Badge className="mt-4 w-full justify-center bg-[#27272A] text-[#A1A1AA] border-0">
                      Current Plan
                    </Badge>
                  )}
                </div>
              )
            })}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowChangePlanModal(false)}
              className="border-[#27272A] text-[#A1A1AA]"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmPlanChange}
              disabled={!selectedPlan || isProcessing}
              className="bg-teal hover:bg-teal/90 text-[#09090B]"
            >
              {isProcessing ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Processing...
                </>
              ) : (
                "Confirm Change"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
