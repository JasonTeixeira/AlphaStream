"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
  Shield,
  Smartphone,
  Key,
  Monitor,
  MapPin,
  Clock,
  AlertTriangle,
  Check,
  Copy,
  RefreshCw,
  Trash2,
  Github,
  Chrome,
} from "lucide-react"
import { toast } from "sonner"

const activeSessions = [
  {
    id: 1,
    device: "MacBook Pro",
    browser: "Chrome 120",
    location: "New York, US",
    ip: "192.168.1.xxx",
    lastActive: "Now",
    current: true,
  },
  {
    id: 2,
    device: "iPhone 15",
    browser: "Safari",
    location: "New York, US",
    ip: "192.168.1.xxx",
    lastActive: "2 hours ago",
    current: false,
  },
  {
    id: 3,
    device: "Windows PC",
    browser: "Firefox 121",
    location: "Boston, US",
    ip: "10.0.0.xxx",
    lastActive: "3 days ago",
    current: false,
  },
]

const connectedAccounts = [
  { id: "google", name: "Google", icon: Chrome, connected: true, email: "jason@gmail.com" },
  { id: "github", name: "GitHub", icon: Github, connected: false, email: null },
]

export default function SecuritySettingsPage() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [showBackupCodes, setShowBackupCodes] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState("")

  // Mock QR code data
  const qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/AlphaStream:jason@example.com?secret=JBSWY3DPEHPK3PXP&issuer=AlphaStream"
  const secretKey = "JBSWY3DPEHPK3PXP"

  const handleEnableTwoFactor = () => {
    if (verificationCode.length !== 6) {
      toast.error("Please enter a valid 6-digit code")
      return
    }

    // Generate backup codes
    const codes = Array.from({ length: 8 }, () =>
      Math.random().toString(36).substring(2, 6).toUpperCase() + "-" +
      Math.random().toString(36).substring(2, 6).toUpperCase()
    )
    setBackupCodes(codes)
    setShowBackupCodes(true)
    setTwoFactorEnabled(true)
    setShowTwoFactorSetup(false)
    toast.success("Two-factor authentication enabled!")
  }

  const handleDisableTwoFactor = () => {
    setTwoFactorEnabled(false)
    setBackupCodes([])
    toast.success("Two-factor authentication disabled")
  }

  const handleRevokeSession = (sessionId: number) => {
    toast.success("Session revoked successfully")
  }

  const handleRevokeAllSessions = () => {
    toast.success("All other sessions have been revoked")
  }

  const handleConnectAccount = (accountId: string) => {
    toast.success(`${accountId === "google" ? "Google" : "GitHub"} account connected`)
  }

  const handleDisconnectAccount = (accountId: string) => {
    toast.success(`${accountId === "google" ? "Google" : "GitHub"} account disconnected`)
  }

  const copyBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join("\n"))
    toast.success("Backup codes copied to clipboard")
  }

  const handleDeleteAccount = () => {
    if (deleteConfirmText !== "DELETE") {
      toast.error("Please type DELETE to confirm")
      return
    }
    toast.success("Account deletion request submitted")
  }

  return (
    <div className="min-h-screen bg-[#09090B]">
      {/* Header */}
      <div className="border-b border-[#27272A] bg-[#09090B]/80 backdrop-blur-lg">
        <div className="px-4 md:px-6 py-6">
          <h1 className="text-2xl font-bold text-[#FAFAFA]">Security Settings</h1>
          <p className="text-[#A1A1AA] mt-1">Manage your account security and connected services</p>
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-6 max-w-4xl">
        {/* Two-Factor Authentication */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-[#18181B] border-[#27272A]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-teal/10">
                    <Shield className="h-5 w-5 text-teal" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-[#FAFAFA]">Two-Factor Authentication</CardTitle>
                    <CardDescription className="text-[#71717A]">
                      Add an extra layer of security to your account
                    </CardDescription>
                  </div>
                </div>
                <Badge className={twoFactorEnabled ? "bg-success/20 text-success border-success/30" : "bg-warning/20 text-warning border-warning/30"}>
                  {twoFactorEnabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {!twoFactorEnabled ? (
                <Dialog open={showTwoFactorSetup} onOpenChange={setShowTwoFactorSetup}>
                  <DialogTrigger asChild>
                    <Button className="bg-teal hover:bg-teal/90 text-[#09090B]">
                      <Smartphone className="mr-2 h-4 w-4" />
                      Enable 2FA
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[#18181B] border-[#27272A] max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-[#FAFAFA]">Set Up Two-Factor Authentication</DialogTitle>
                      <DialogDescription className="text-[#A1A1AA]">
                        Scan the QR code with your authenticator app
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                      {/* QR Code */}
                      <div className="flex justify-center">
                        <div className="p-4 bg-white rounded-lg">
                          <img src={qrCodeUrl} alt="2FA QR Code" className="w-48 h-48" />
                        </div>
                      </div>

                      {/* Manual Entry */}
                      <div className="space-y-2">
                        <Label className="text-[#A1A1AA] text-sm">Or enter this code manually:</Label>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 p-3 bg-[#0A0A0B] rounded-lg text-teal font-mono text-sm">
                            {secretKey}
                          </code>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              navigator.clipboard.writeText(secretKey)
                              toast.success("Secret key copied")
                            }}
                            className="border-[#27272A]"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Verification Code Input */}
                      <div className="space-y-2">
                        <Label className="text-[#FAFAFA]">Enter verification code</Label>
                        <Input
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                          placeholder="000000"
                          maxLength={6}
                          className="bg-[#0A0A0B] border-[#27272A] text-[#FAFAFA] text-center text-2xl font-mono tracking-widest"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={handleEnableTwoFactor}
                        disabled={verificationCode.length !== 6}
                        className="w-full bg-teal hover:bg-teal/90 text-[#09090B]"
                      >
                        Verify and Enable
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-success" />
                    <span className="text-[#FAFAFA]">Two-factor authentication is active</span>
                  </div>
                  <div className="flex gap-3">
                    <Dialog open={showBackupCodes} onOpenChange={setShowBackupCodes}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="border-[#27272A] text-[#A1A1AA]">
                          <Key className="mr-2 h-4 w-4" />
                          View Backup Codes
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-[#18181B] border-[#27272A]">
                        <DialogHeader>
                          <DialogTitle className="text-[#FAFAFA]">Backup Codes</DialogTitle>
                          <DialogDescription className="text-[#A1A1AA]">
                            Store these codes safely. Each code can only be used once.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-2 py-4">
                          {backupCodes.map((code, i) => (
                            <code key={i} className="p-2 bg-[#0A0A0B] rounded text-[#FAFAFA] font-mono text-sm text-center">
                              {code}
                            </code>
                          ))}
                        </div>
                        <DialogFooter>
                          <Button onClick={copyBackupCodes} className="w-full bg-teal hover:bg-teal/90 text-[#09090B]">
                            <Copy className="mr-2 h-4 w-4" />
                            Copy All Codes
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      onClick={handleDisableTwoFactor}
                      className="border-danger/30 text-danger hover:bg-danger/10"
                    >
                      Disable 2FA
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Connected Accounts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="bg-[#18181B] border-[#27272A]">
            <CardHeader>
              <CardTitle className="text-lg text-[#FAFAFA]">Connected Accounts</CardTitle>
              <CardDescription className="text-[#71717A]">
                Link your accounts for easier sign-in
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {connectedAccounts.map((account) => (
                <div key={account.id} className="flex items-center justify-between p-4 rounded-lg bg-[#0A0A0B] border border-[#27272A]">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#27272A]">
                      <account.icon className="h-5 w-5 text-[#FAFAFA]" />
                    </div>
                    <div>
                      <p className="font-medium text-[#FAFAFA]">{account.name}</p>
                      {account.connected && account.email && (
                        <p className="text-sm text-[#71717A]">{account.email}</p>
                      )}
                    </div>
                  </div>
                  {account.connected ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDisconnectAccount(account.id)}
                      className="border-[#27272A] text-[#A1A1AA]"
                    >
                      Disconnect
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleConnectAccount(account.id)}
                      className="bg-teal hover:bg-teal/90 text-[#09090B]"
                    >
                      Connect
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Active Sessions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="bg-[#18181B] border-[#27272A]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg text-[#FAFAFA]">Active Sessions</CardTitle>
                  <CardDescription className="text-[#71717A]">
                    Manage devices where you are signed in
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRevokeAllSessions}
                  className="border-danger/30 text-danger hover:bg-danger/10"
                >
                  Revoke All Others
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeSessions.map((session) => (
                <div
                  key={session.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    session.current
                      ? "bg-teal/5 border-teal/30"
                      : "bg-[#0A0A0B] border-[#27272A]"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-[#27272A]">
                      <Monitor className="h-5 w-5 text-[#FAFAFA]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-[#FAFAFA]">{session.device}</p>
                        {session.current && (
                          <Badge className="bg-teal/20 text-teal border-teal/30 text-xs">
                            Current
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-[#71717A]">
                        <span>{session.browser}</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {session.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {session.lastActive}
                        </span>
                      </div>
                    </div>
                  </div>
                  {!session.current && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRevokeSession(session.id)}
                      className="text-[#A1A1AA] hover:text-danger hover:bg-danger/10"
                    >
                      Revoke
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Delete Account */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="bg-[#18181B] border-danger/30">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-danger/10">
                  <AlertTriangle className="h-5 w-5 text-danger" />
                </div>
                <div>
                  <CardTitle className="text-lg text-danger">Danger Zone</CardTitle>
                  <CardDescription className="text-[#71717A]">
                    Irreversible actions that affect your account
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="border-danger/30 text-danger hover:bg-danger/10">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-[#18181B] border-[#27272A]">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-danger">Delete Account</AlertDialogTitle>
                    <AlertDialogDescription className="text-[#A1A1AA]">
                      This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="py-4 space-y-4">
                    <div className="p-4 rounded-lg bg-danger/10 border border-danger/30">
                      <p className="text-sm text-danger">
                        <strong>Warning:</strong> You will lose all your API keys, signal history, backtest results, and subscription benefits.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[#FAFAFA]">Type DELETE to confirm</Label>
                      <Input
                        value={deleteConfirmText}
                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                        placeholder="DELETE"
                        className="bg-[#0A0A0B] border-[#27272A] text-[#FAFAFA]"
                      />
                    </div>
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="border-[#27272A] text-[#A1A1AA]">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      disabled={deleteConfirmText !== "DELETE"}
                      className="bg-danger hover:bg-danger/90 text-white"
                    >
                      Delete Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
