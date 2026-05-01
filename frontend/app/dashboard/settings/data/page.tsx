"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { 
  Download, 
  Trash2, 
  FileJson, 
  FileSpreadsheet, 
  Clock, 
  CheckCircle2,
  AlertTriangle,
  Shield,
  Database,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function DataManagementPage() {
  const [exportStatus, setExportStatus] = useState<"idle" | "preparing" | "ready">("idle")
  const [exportProgress, setExportProgress] = useState(0)
  const [deleteStep, setDeleteStep] = useState(0)

  const handleExport = async (format: "json" | "csv") => {
    setExportStatus("preparing")
    setExportProgress(0)

    // Simulate export preparation
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200))
      setExportProgress(i)
    }

    setExportStatus("ready")
  }

  const dataCategories = [
    { name: "Profile Information", size: "2.4 KB", items: 12 },
    { name: "Trading Signals History", size: "1.2 MB", items: 4521 },
    { name: "Notification Preferences", size: "856 B", items: 8 },
    { name: "API Usage Logs", size: "342 KB", items: 2341 },
    { name: "Billing History", size: "15.6 KB", items: 24 },
    { name: "Session Data", size: "4.1 KB", items: 3 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#FAFAFA]">Data & Privacy</h1>
        <p className="text-[#A1A1AA]">Manage your data, export records, or delete your account</p>
      </div>

      {/* GDPR Info */}
      <Card className="bg-teal/10 border-teal/30">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Shield className="h-6 w-6 text-teal shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-[#FAFAFA] mb-2">Your Data Rights</h3>
              <p className="text-sm text-[#A1A1AA] mb-3">
                Under GDPR and similar regulations, you have the right to access, export, 
                and delete your personal data. We make it easy to exercise these rights.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="border-teal/30 text-teal">GDPR Compliant</Badge>
                <Badge variant="outline" className="border-teal/30 text-teal">CCPA Compliant</Badge>
                <Badge variant="outline" className="border-teal/30 text-teal">SOC 2 Type II</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Overview */}
      <Card className="bg-[#18181B] border-[#27272A]">
        <CardHeader>
          <CardTitle className="text-[#FAFAFA] flex items-center gap-2">
            <Database className="h-5 w-5 text-teal" />
            Your Data
          </CardTitle>
          <CardDescription>Overview of data we store about you</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {dataCategories.map((category) => (
              <div
                key={category.name}
                className="flex items-center justify-between p-3 rounded-lg bg-[#0A0A0B] border border-[#27272A]"
              >
                <div>
                  <p className="text-sm font-medium text-[#FAFAFA]">{category.name}</p>
                  <p className="text-xs text-[#71717A]">{category.items} records</p>
                </div>
                <span className="text-sm font-mono text-[#A1A1AA]">{category.size}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export Data */}
      <Card className="bg-[#18181B] border-[#27272A]">
        <CardHeader>
          <CardTitle className="text-[#FAFAFA] flex items-center gap-2">
            <Download className="h-5 w-5 text-teal" />
            Export Your Data
          </CardTitle>
          <CardDescription>Download a copy of all your data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {exportStatus === "idle" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => handleExport("json")}
                className="p-6 rounded-lg bg-[#0A0A0B] border border-[#27272A] hover:border-teal/30 transition-colors text-left group"
              >
                <FileJson className="h-8 w-8 text-teal mb-3 group-hover:scale-110 transition-transform" />
                <p className="font-semibold text-[#FAFAFA] mb-1">JSON Format</p>
                <p className="text-sm text-[#71717A]">
                  Machine-readable format, ideal for importing to other services
                </p>
              </button>
              <button
                onClick={() => handleExport("csv")}
                className="p-6 rounded-lg bg-[#0A0A0B] border border-[#27272A] hover:border-teal/30 transition-colors text-left group"
              >
                <FileSpreadsheet className="h-8 w-8 text-success mb-3 group-hover:scale-110 transition-transform" />
                <p className="font-semibold text-[#FAFAFA] mb-1">CSV Format</p>
                <p className="text-sm text-[#71717A]">
                  Spreadsheet-friendly format, works with Excel and Google Sheets
                </p>
              </button>
            </div>
          )}

          {exportStatus === "preparing" && (
            <div className="p-6 rounded-lg bg-[#0A0A0B] border border-[#27272A]">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="h-5 w-5 text-teal animate-spin" />
                <p className="font-medium text-[#FAFAFA]">Preparing your data export...</p>
              </div>
              <Progress value={exportProgress} className="h-2 bg-[#27272A]" />
              <p className="text-sm text-[#71717A] mt-2">{exportProgress}% complete</p>
            </div>
          )}

          {exportStatus === "ready" && (
            <div className="p-6 rounded-lg bg-success/10 border border-success/30">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <p className="font-medium text-[#FAFAFA]">Your data export is ready!</p>
              </div>
              <div className="flex items-center gap-3">
                <Button className="bg-success hover:bg-success/90 text-[#09090B]">
                  <Download className="mr-2 h-4 w-4" />
                  Download Export (1.6 MB)
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setExportStatus("idle")}
                  className="border-[#27272A] text-[#A1A1AA]"
                >
                  Export Again
                </Button>
              </div>
              <p className="text-xs text-[#71717A] mt-3">
                This link will expire in 24 hours. We&apos;ll also email you a copy.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Account */}
      <Card className="bg-[#18181B] border-danger/30">
        <CardHeader>
          <CardTitle className="text-danger flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Delete Account
          </CardTitle>
          <CardDescription>Permanently delete your account and all associated data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-lg bg-danger/10 border border-danger/30 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-danger shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-[#FAFAFA] mb-1">This action cannot be undone</p>
                <p className="text-sm text-[#A1A1AA]">
                  Deleting your account will permanently remove all your data, including trading 
                  history, settings, and any active subscriptions. This process takes up to 30 days 
                  to complete.
                </p>
              </div>
            </div>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="border-danger text-danger hover:bg-danger/10">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete My Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-[#18181B] border-[#27272A]">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-[#FAFAFA]">Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription className="text-[#A1A1AA]">
                  This will permanently delete your account and remove all your data from our servers. 
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-[#27272A] border-[#3F3F46] text-[#FAFAFA] hover:bg-[#3F3F46]">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction className="bg-danger hover:bg-danger/90 text-white">
                  Yes, delete my account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  )
}
