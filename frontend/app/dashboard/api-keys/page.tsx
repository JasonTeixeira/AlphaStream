"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Key, Plus, Copy, Trash2, Check, ExternalLink } from "lucide-react"
import { toast } from "sonner"

const apiKeys = [
  { id: 1, name: "Production", key: "sk_live_...4f2a", created: "Apr 15, 2025", lastUsed: "2 min ago", status: "Active" },
  { id: 2, name: "Development", key: "sk_test_...8b1c", created: "Apr 20, 2025", lastUsed: "3 days ago", status: "Active" },
]

const curlExample = `curl -H "Authorization: Bearer YOUR_API_KEY" \\
  https://api.alphastream.io/v1/signals`

const pythonExample = `import requests

headers = {"Authorization": "Bearer YOUR_API_KEY"}
response = requests.get(
    "https://api.alphastream.io/v1/signals",
    headers=headers
)
signals = response.json()

for signal in signals["data"]:
    print(f"{signal['symbol']}: {signal['direction']} ({signal['confidence']}%)")`

const jsExample = `const response = await fetch("https://api.alphastream.io/v1/signals", {
  headers: { "Authorization": "Bearer YOUR_API_KEY" }
});
const { data } = await response.json();
data.forEach(s => console.log(\`\${s.symbol}: \${s.direction} (\${s.confidence}%)\`));`

const responseExample = `{
  "data": [
    {
      "id": "sig_abc123",
      "symbol": "NQ",
      "direction": "LONG",
      "confidence": 91,
      "model": "xgboost",
      "entry_price": 18245.50,
      "stop_loss": 18180.00,
      "take_profit": 18375.00,
      "created_at": "2025-04-30T09:31:02Z"
    }
  ],
  "meta": { "total": 8, "page": 1 }
}`

const endpoints = [
  {
    method: "GET",
    path: "/v1/signals",
    description: "Get latest signals for all subscribed symbols",
    params: [
      { name: "symbol", type: "string", required: false, description: "Filter by symbol (e.g., NQ, ES)" },
      { name: "min_confidence", type: "integer", required: false, description: "Minimum confidence threshold (0-100)" },
      { name: "model", type: "string", required: false, description: "Filter by model (xgboost, lightgbm, lstm, randomforest, ensemble)" },
    ],
  },
  {
    method: "GET",
    path: "/v1/signals/:id",
    description: "Get a single signal by ID",
    params: [],
  },
  {
    method: "GET",
    path: "/v1/models",
    description: "List all models with current performance metrics",
    params: [],
  },
  {
    method: "GET",
    path: "/v1/backtest",
    description: "Run a backtest with specified parameters",
    params: [
      { name: "symbols", type: "string[]", required: true, description: "Array of symbols to backtest" },
      { name: "start_date", type: "string", required: true, description: "Start date (ISO 8601)" },
      { name: "end_date", type: "string", required: true, description: "End date (ISO 8601)" },
      { name: "models", type: "string[]", required: false, description: "Models to use (default: all)" },
      { name: "initial_capital", type: "number", required: false, description: "Starting capital (default: 100000)" },
    ],
  },
]

const responseCodes = [
  { code: "200", description: "OK - Request successful" },
  { code: "401", description: "Unauthorized - Invalid or missing API key" },
  { code: "403", description: "Forbidden - Plan limit exceeded" },
  { code: "429", description: "Rate Limited - Too many requests" },
  { code: "500", description: "Server Error - Internal server error" },
]

export default function ApiKeysPage() {
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [newKeyName, setNewKeyName] = useState("")
  const [showNewKey, setShowNewKey] = useState(false)
  const [generatedKey, setGeneratedKey] = useState("")

  const copyToClipboard = (text: string, id?: number) => {
    navigator.clipboard.writeText(text)
    if (id) {
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    }
    toast.success("Copied to clipboard")
  }

  const handleCreateKey = () => {
    const key = `sk_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
    setGeneratedKey(key)
    setShowNewKey(true)
    setNewKeyName("")
  }

  return (
    <div className="min-h-screen bg-[#09090B]">
      {/* Header */}
      <div className="border-b border-[#27272A] bg-[#09090B]/80 backdrop-blur-lg">
        <div className="px-4 md:px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#FAFAFA]">API Documentation</h1>
              <p className="text-[#A1A1AA] mt-1">Integrate AlphaStream signals into your trading systems</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="border-teal/30 text-teal">REST API v1</Badge>
              <Badge variant="outline" className="border-violet/30 text-violet">WebSocket</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-8">
        {/* API Keys Section */}
        <Card className="bg-[#18181B] border-[#27272A]">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg text-[#FAFAFA]">API Keys</CardTitle>
              <CardDescription className="text-[#71717A]">Manage your API keys for programmatic access</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-teal hover:bg-teal/90 text-[#09090B]">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Key
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#18181B] border-[#27272A]">
                {!showNewKey ? (
                  <>
                    <DialogHeader>
                      <DialogTitle className="text-[#FAFAFA]">Create API Key</DialogTitle>
                      <DialogDescription className="text-[#71717A]">
                        Give your key a name to help you identify it later.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <Label className="text-[#FAFAFA]">Key Name</Label>
                      <Input
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        placeholder="e.g., Production"
                        className="mt-2 bg-[#0A0A0B] border-[#27272A] text-[#FAFAFA]"
                      />
                    </div>
                    <DialogFooter>
                      <Button onClick={handleCreateKey} className="bg-teal hover:bg-teal/90 text-[#09090B]">
                        Create Key
                      </Button>
                    </DialogFooter>
                  </>
                ) : (
                  <>
                    <DialogHeader>
                      <DialogTitle className="text-[#FAFAFA]">Your New API Key</DialogTitle>
                      <DialogDescription className="text-danger">
                        This key will only be shown once. Copy it now!
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <div className="flex items-center gap-2 p-3 bg-[#0A0A0B] border border-[#27272A] rounded-lg">
                        <code className="flex-1 text-sm text-[#FAFAFA] font-mono break-all">{generatedKey}</code>
                        <Button size="icon" variant="ghost" onClick={() => copyToClipboard(generatedKey)}>
                          <Copy className="h-4 w-4 text-[#A1A1AA]" />
                        </Button>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={() => setShowNewKey(false)} className="bg-teal hover:bg-teal/90 text-[#09090B]">
                        Done
                      </Button>
                    </DialogFooter>
                  </>
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
                    <TableCell className="font-mono text-[#A1A1AA]">{key.key}</TableCell>
                    <TableCell className="text-[#71717A]">{key.created}</TableCell>
                    <TableCell className="text-[#71717A]">{key.lastUsed}</TableCell>
                    <TableCell>
                      <Badge className="bg-success/20 text-success border-success/30">{key.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-[#A1A1AA] hover:text-[#FAFAFA]"
                          onClick={() => copyToClipboard(key.key, key.id)}
                        >
                          {copiedId === key.id ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                        </Button>
                        <Button size="icon" variant="ghost" className="text-[#A1A1AA] hover:text-danger">
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
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#A1A1AA]">Rate Limit (Pro Plan)</p>
                <p className="text-lg font-semibold text-[#FAFAFA]">1,000 requests/hour</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-[#71717A]">Used this hour</p>
                <p className="text-lg font-mono text-teal">247 / 1,000</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Start */}
        <Card className="bg-[#18181B] border-[#27272A]">
          <CardHeader>
            <CardTitle className="text-lg text-[#FAFAFA]">Quick Start</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="curl" className="w-full">
              <TabsList className="bg-[#0A0A0B] border border-[#27272A]">
                <TabsTrigger value="curl" className="data-[state=active]:bg-teal data-[state=active]:text-[#09090B]">cURL</TabsTrigger>
                <TabsTrigger value="python" className="data-[state=active]:bg-teal data-[state=active]:text-[#09090B]">Python</TabsTrigger>
                <TabsTrigger value="javascript" className="data-[state=active]:bg-teal data-[state=active]:text-[#09090B]">JavaScript</TabsTrigger>
              </TabsList>
              <TabsContent value="curl" className="mt-4">
                <div className="relative">
                  <pre className="p-4 bg-[#0A0A0B] border border-[#27272A] rounded-lg overflow-x-auto">
                    <code className="text-sm text-[#A1A1AA] font-mono">{curlExample}</code>
                  </pre>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2 text-[#71717A] hover:text-[#FAFAFA]"
                    onClick={() => copyToClipboard(curlExample)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="python" className="mt-4">
                <div className="relative">
                  <pre className="p-4 bg-[#0A0A0B] border border-[#27272A] rounded-lg overflow-x-auto">
                    <code className="text-sm text-[#A1A1AA] font-mono">{pythonExample}</code>
                  </pre>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2 text-[#71717A] hover:text-[#FAFAFA]"
                    onClick={() => copyToClipboard(pythonExample)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="javascript" className="mt-4">
                <div className="relative">
                  <pre className="p-4 bg-[#0A0A0B] border border-[#27272A] rounded-lg overflow-x-auto">
                    <code className="text-sm text-[#A1A1AA] font-mono">{jsExample}</code>
                  </pre>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2 text-[#71717A] hover:text-[#FAFAFA]"
                    onClick={() => copyToClipboard(jsExample)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Authentication */}
        <Card className="bg-[#18181B] border-[#27272A]">
          <CardHeader>
            <CardTitle className="text-lg text-[#FAFAFA]">Authentication</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-[#A1A1AA]">
              All API requests require authentication using a Bearer token in the Authorization header:
            </p>
            <pre className="p-4 bg-[#0A0A0B] border border-[#27272A] rounded-lg">
              <code className="text-sm text-teal font-mono">Authorization: Bearer sk_live_...</code>
            </pre>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="p-4 bg-[#0A0A0B] rounded-lg border border-[#27272A]">
                <p className="font-semibold text-[#FAFAFA]">Starter</p>
                <p className="text-2xl font-mono text-teal mt-1">100/hr</p>
              </div>
              <div className="p-4 bg-[#0A0A0B] rounded-lg border border-violet/30">
                <p className="font-semibold text-[#FAFAFA]">Pro</p>
                <p className="text-2xl font-mono text-violet mt-1">1,000/hr</p>
              </div>
              <div className="p-4 bg-[#0A0A0B] rounded-lg border border-[#27272A]">
                <p className="font-semibold text-[#FAFAFA]">Premium</p>
                <p className="text-2xl font-mono text-success mt-1">Unlimited</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Endpoints */}
        <Card className="bg-[#18181B] border-[#27272A]">
          <CardHeader>
            <CardTitle className="text-lg text-[#FAFAFA]">Endpoints</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Accordion type="single" collapsible className="w-full">
              {endpoints.map((endpoint, index) => (
                <AccordionItem key={index} value={`endpoint-${index}`} className="border-[#27272A] px-6">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-teal/20 text-teal border-teal/30 font-mono">{endpoint.method}</Badge>
                      <code className="text-[#FAFAFA] font-mono">{endpoint.path}</code>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6">
                    <p className="text-[#A1A1AA] mb-4">{endpoint.description}</p>
                    {endpoint.params.length > 0 && (
                      <div className="space-y-2">
                        <p className="font-semibold text-[#FAFAFA]">Parameters</p>
                        <div className="bg-[#0A0A0B] rounded-lg border border-[#27272A] overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow className="border-[#27272A]">
                                <TableHead className="text-[#A1A1AA]">Name</TableHead>
                                <TableHead className="text-[#A1A1AA]">Type</TableHead>
                                <TableHead className="text-[#A1A1AA]">Required</TableHead>
                                <TableHead className="text-[#A1A1AA]">Description</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {endpoint.params.map((param) => (
                                <TableRow key={param.name} className="border-[#27272A]">
                                  <TableCell className="font-mono text-teal">{param.name}</TableCell>
                                  <TableCell className="font-mono text-[#71717A]">{param.type}</TableCell>
                                  <TableCell>
                                    {param.required ? (
                                      <Badge className="bg-warning/20 text-warning">Required</Badge>
                                    ) : (
                                      <span className="text-[#71717A]">Optional</span>
                                    )}
                                  </TableCell>
                                  <TableCell className="text-[#A1A1AA]">{param.description}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Example Response */}
        <Card className="bg-[#18181B] border-[#27272A]">
          <CardHeader>
            <CardTitle className="text-lg text-[#FAFAFA]">Example Response</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="p-4 bg-[#0A0A0B] border border-[#27272A] rounded-lg overflow-x-auto">
              <code className="text-sm text-[#A1A1AA] font-mono whitespace-pre">{responseExample}</code>
            </pre>
          </CardContent>
        </Card>

        {/* Response Codes */}
        <Card className="bg-[#18181B] border-[#27272A]">
          <CardHeader>
            <CardTitle className="text-lg text-[#FAFAFA]">Response Codes</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-[#27272A] bg-[#0A0A0B]">
                  <TableHead className="text-[#A1A1AA]">Code</TableHead>
                  <TableHead className="text-[#A1A1AA]">Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {responseCodes.map((code) => (
                  <TableRow key={code.code} className="border-[#27272A]">
                    <TableCell className="font-mono font-semibold text-[#FAFAFA]">{code.code}</TableCell>
                    <TableCell className="text-[#A1A1AA]">{code.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* SDKs Coming Soon */}
        <div>
          <h2 className="text-lg font-semibold text-[#FAFAFA] mb-4">SDKs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["Python SDK", "JavaScript SDK", "NinjaTrader Plugin"].map((sdk) => (
              <Card key={sdk} className="bg-[#18181B] border-[#27272A]">
                <CardContent className="p-6 text-center">
                  <Badge className="bg-violet/20 text-violet border-violet/30 mb-3">Coming Soon</Badge>
                  <h3 className="font-semibold text-[#FAFAFA]">{sdk}</h3>
                  <Button variant="ghost" className="mt-4 text-[#A1A1AA] hover:text-teal">
                    Notify Me
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
