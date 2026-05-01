"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Plus, 
  Star, 
  TrendingUp, 
  TrendingDown, 
  MoreVertical,
  Edit2,
  Trash2,
  Bell,
  Search,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const defaultWatchlists = [
  {
    id: "futures",
    name: "Futures",
    symbols: [
      { symbol: "NQ", name: "Nasdaq Futures", price: 18312.25, change: 0.87, signal: "long" },
      { symbol: "ES", name: "S&P Futures", price: 5298.75, change: 0.42, signal: null },
      { symbol: "YM", name: "Dow Futures", price: 39845.00, change: -0.12, signal: "short" },
      { symbol: "RTY", name: "Russell Futures", price: 2156.80, change: 0.65, signal: null },
    ]
  },
  {
    id: "commodities",
    name: "Commodities",
    symbols: [
      { symbol: "GC", name: "Gold", price: 2338.20, change: -0.32, signal: null },
      { symbol: "SI", name: "Silver", price: 27.85, change: 1.24, signal: "long" },
      { symbol: "CL", name: "Crude Oil", price: 77.82, change: -0.85, signal: null },
      { symbol: "NG", name: "Natural Gas", price: 2.145, change: 2.31, signal: null },
    ]
  },
  {
    id: "forex",
    name: "Forex",
    symbols: [
      { symbol: "EUR/USD", name: "Euro/Dollar", price: 1.0892, change: 0.15, signal: null },
      { symbol: "GBP/USD", name: "Pound/Dollar", price: 1.2745, change: -0.08, signal: null },
      { symbol: "USD/JPY", name: "Dollar/Yen", price: 149.85, change: 0.22, signal: "long" },
    ]
  },
]

const availableSymbols = [
  { symbol: "BTC", name: "Bitcoin", category: "crypto" },
  { symbol: "ETH", name: "Ethereum", category: "crypto" },
  { symbol: "AAPL", name: "Apple Inc", category: "stocks" },
  { symbol: "MSFT", name: "Microsoft", category: "stocks" },
  { symbol: "6E", name: "Euro FX Futures", category: "futures" },
  { symbol: "6J", name: "Japanese Yen Futures", category: "futures" },
]

export default function WatchlistPage() {
  const [watchlists, setWatchlists] = useState(defaultWatchlists)
  const [activeWatchlist, setActiveWatchlist] = useState("futures")
  const [searchQuery, setSearchQuery] = useState("")
  const [newWatchlistName, setNewWatchlistName] = useState("")

  const currentWatchlist = watchlists.find(w => w.id === activeWatchlist)

  const handleAddWatchlist = () => {
    if (!newWatchlistName.trim()) {
      toast.error("Please enter a watchlist name")
      return
    }
    const newId = newWatchlistName.toLowerCase().replace(/\s+/g, "-")
    setWatchlists([...watchlists, { id: newId, name: newWatchlistName, symbols: [] }])
    setNewWatchlistName("")
    toast.success(`Watchlist "${newWatchlistName}" created`)
  }

  const handleDeleteWatchlist = (id: string) => {
    setWatchlists(watchlists.filter(w => w.id !== id))
    if (activeWatchlist === id) {
      setActiveWatchlist(watchlists[0]?.id || "")
    }
    toast.success("Watchlist deleted")
  }

  const handleAddSymbol = (symbol: typeof availableSymbols[0]) => {
    setWatchlists(watchlists.map(w => {
      if (w.id === activeWatchlist) {
        const exists = w.symbols.some(s => s.symbol === symbol.symbol)
        if (exists) {
          toast.error(`${symbol.symbol} is already in this watchlist`)
          return w
        }
        toast.success(`${symbol.symbol} added to watchlist`)
        return {
          ...w,
          symbols: [...w.symbols, { 
            symbol: symbol.symbol, 
            name: symbol.name, 
            price: Math.random() * 1000, 
            change: (Math.random() - 0.5) * 5,
            signal: null 
          }]
        }
      }
      return w
    }))
  }

  const handleRemoveSymbol = (symbolId: string) => {
    setWatchlists(watchlists.map(w => {
      if (w.id === activeWatchlist) {
        return {
          ...w,
          symbols: w.symbols.filter(s => s.symbol !== symbolId)
        }
      }
      return w
    }))
    toast.success("Symbol removed from watchlist")
  }

  const filteredSymbols = availableSymbols.filter(s => 
    s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#09090B]">
      <div className="border-b border-[#27272A] bg-[#09090B]/80 backdrop-blur-lg">
        <div className="px-4 md:px-6 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#FAFAFA]">Watchlists</h1>
            <p className="text-[#A1A1AA] mt-1">Track your favorite symbols</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-teal hover:bg-teal/90 text-[#09090B]">
                <Plus className="mr-2 h-4 w-4" />
                New Watchlist
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#18181B] border-[#27272A]">
              <DialogHeader>
                <DialogTitle className="text-[#FAFAFA]">Create Watchlist</DialogTitle>
                <DialogDescription className="text-[#71717A]">
                  Create a new watchlist to organize your symbols
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Input
                  value={newWatchlistName}
                  onChange={(e) => setNewWatchlistName(e.target.value)}
                  placeholder="Watchlist name"
                  className="bg-[#0A0A0B] border-[#27272A] text-[#FAFAFA]"
                />
                <Button 
                  onClick={handleAddWatchlist}
                  className="w-full bg-teal hover:bg-teal/90 text-[#09090B]"
                >
                  Create Watchlist
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="p-4 md:p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Watchlist Tabs */}
          <div className="lg:w-64 space-y-2">
            {watchlists.map((watchlist) => (
              <div
                key={watchlist.id}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors",
                  activeWatchlist === watchlist.id
                    ? "bg-teal/20 border border-teal/30"
                    : "bg-[#18181B] border border-[#27272A] hover:border-[#3F3F46]"
                )}
                onClick={() => setActiveWatchlist(watchlist.id)}
              >
                <div className="flex items-center gap-2">
                  <Star className={cn(
                    "h-4 w-4",
                    activeWatchlist === watchlist.id ? "text-teal" : "text-[#71717A]"
                  )} />
                  <span className={cn(
                    "font-medium",
                    activeWatchlist === watchlist.id ? "text-[#FAFAFA]" : "text-[#A1A1AA]"
                  )}>
                    {watchlist.name}
                  </span>
                </div>
                <Badge variant="outline" className="border-[#27272A] text-[#71717A]">
                  {watchlist.symbols.length}
                </Badge>
              </div>
            ))}
          </div>

          {/* Symbols Grid */}
          <div className="flex-1 space-y-4">
            {/* Add Symbol */}
            <Card className="bg-[#18181B] border-[#27272A]">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#71717A]" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search symbols to add..."
                      className="pl-10 bg-[#0A0A0B] border-[#27272A] text-[#FAFAFA]"
                    />
                  </div>
                </div>
                {searchQuery && (
                  <div className="mt-3 space-y-1">
                    {filteredSymbols.map((symbol) => (
                      <div
                        key={symbol.symbol}
                        onClick={() => handleAddSymbol(symbol)}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-[#27272A] cursor-pointer transition-colors"
                      >
                        <div>
                          <span className="font-medium text-[#FAFAFA]">{symbol.symbol}</span>
                          <span className="text-[#71717A] ml-2">{symbol.name}</span>
                        </div>
                        <Plus className="h-4 w-4 text-teal" />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Symbols List */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {currentWatchlist?.symbols.map((item) => (
                <Card key={item.symbol} className="bg-[#18181B] border-[#27272A] hover:border-[#3F3F46] transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg text-[#FAFAFA]">{item.symbol}</span>
                          {item.signal && (
                            <Badge className={cn(
                              "text-xs",
                              item.signal === "long" 
                                ? "bg-success/20 text-success border-success/30"
                                : "bg-danger/20 text-danger border-danger/30"
                            )}>
                              {item.signal.toUpperCase()}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-[#71717A]">{item.name}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-[#71717A]">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-[#18181B] border-[#27272A]">
                          <DropdownMenuItem className="text-[#FAFAFA]">
                            <Bell className="mr-2 h-4 w-4" />
                            Set Alert
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-[#27272A]" />
                          <DropdownMenuItem 
                            onClick={() => handleRemoveSymbol(item.symbol)}
                            className="text-danger"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="mt-4 flex items-end justify-between">
                      <div>
                        <p className="text-2xl font-bold text-[#FAFAFA] font-mono">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className={cn(
                        "flex items-center gap-1 text-sm font-medium",
                        item.change >= 0 ? "text-success" : "text-danger"
                      )}>
                        {item.change >= 0 ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4" />
                        )}
                        {item.change >= 0 ? "+" : ""}{item.change.toFixed(2)}%
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {currentWatchlist?.symbols.length === 0 && (
              <Card className="bg-[#18181B] border-[#27272A]">
                <CardContent className="p-12 text-center">
                  <Star className="h-12 w-12 text-[#27272A] mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-[#FAFAFA] mb-2">No symbols yet</h3>
                  <p className="text-[#71717A]">
                    Search and add symbols to track them in this watchlist
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
