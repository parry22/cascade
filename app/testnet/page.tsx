"use client"

import { useEffect, useMemo, useState } from "react"
import Navbar from "@/components/Navbar"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"

type RWAAsset = {
  symbol: string
  name: string
  price: number
  tags: string[] // e.g., ["Treasuries"], ["Private Credit"], ["Real Estate"]
  supply: number
  supplyUSD: number
  borrow: number
  borrowUSD: number
  supplyAPR: number
  borrowAPR: number
}

const RWA_ASSETS: RWAAsset[] = [
  {
    symbol: "UST",
    name: "Tokenized U.S. Treasuries",
    price: 1.0,
    tags: ["All", "Treasuries", "RWA"],
    supply: 37_190_000,
    supplyUSD: 125_660_000,
    borrow: 19_970_000,
    borrowUSD: 67_470_000,
    supplyAPR: 5.12,
    borrowAPR: 2.31,
  },
  {
    symbol: "PRIV",
    name: "Private Credit Note",
    price: 1.0,
    tags: ["All", "Private Credit", "RWA"],
    supply: 34_390_000,
    supplyUSD: 116_320_000,
    borrow: 846_840,
    borrowUSD: 2_860_000,
    supplyAPR: 8.4,
    borrowAPR: 3.28,
  },
  {
    symbol: "REIT",
    name: "Tokenized Real Estate",
    price: 1.0,
    tags: ["All", "Real Estate", "RWA"],
    supply: 92_990_000,
    supplyUSD: 92_970_000,
    borrow: 83_970_000,
    borrowUSD: 83_950_000,
    supplyAPR: 6.12,
    borrowAPR: 4.7,
  },
  {
    symbol: "GOLD",
    name: "Tokenized Gold",
    price: 1.0,
    tags: ["All", "Commodities", "RWA"],
    supply: 614_250,
    supplyUSD: 74_470_000,
    borrow: 212_250,
    borrowUSD: 25_730_000,
    supplyAPR: 1.82,
    borrowAPR: 0.43,
  },
]

const FILTERS = ["All", "Treasuries", "Private Credit", "Real Estate", "Commodities", "RWA"]

type PositionMap = Record<string, { supplied: number; borrowed: number }>

export default function RWALendingMarket() {
  // Wallet sync with Navbar
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)

  useEffect(() => {
    try {
      const connected = localStorage.getItem("walletConnected") === "true"
      setWalletConnected(connected)
      setWalletAddress(connected ? localStorage.getItem("walletAddress") || "0x1234...5678" : null)
    } catch {}
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent).detail as { connected: boolean; address: string }
      setWalletConnected(detail.connected)
      setWalletAddress(detail.connected ? detail.address : null)
    }
    window.addEventListener("wallet-connection-change", onChange as EventListener)
    return () => window.removeEventListener("wallet-connection-change", onChange as EventListener)
  }, [])

  // Filters and search
  const [activeFilter, setActiveFilter] = useState<string>("All")
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    return RWA_ASSETS.filter((a) => {
      const inFilter = activeFilter === "All" ? true : a.tags.includes(activeFilter)
      const inSearch =
        !query ||
        a.symbol.toLowerCase().includes(query.toLowerCase()) ||
        a.name.toLowerCase().includes(query.toLowerCase())
      return inFilter && inSearch
    })
  }, [activeFilter, query])

  // Positions and health
  const [positions, setPositions] = useState<PositionMap>({})
  const [healthLtv, setHealthLtv] = useState(35) // affects "borrow limit" calc

  const totals = useMemo(() => {
    const supplied = Object.values(positions).reduce((s, p) => s + (p.supplied || 0), 0)
    const borrowed = Object.values(positions).reduce((s, p) => s + (p.borrowed || 0), 0)
    const netWorth = supplied - borrowed
    const borrowLimit = supplied * (healthLtv / 100)
    return { supplied, borrowed, netWorth, borrowLimit }
  }, [positions, healthLtv])

  // Inline row action state
  const [expandedRow, setExpandedRow] = useState<{ symbol: string; mode: "supply" | "borrow" } | null>(null)
  const [actionAmount, setActionAmount] = useState<number>(0)
  const [loading, setLoading] = useState(false)

  const openRow = (symbol: string, mode: "supply" | "borrow") => {
    setExpandedRow({ symbol, mode })
    setActionAmount(0)
  }

  const confirmAction = async () => {
    if (!expandedRow) return
    if (!walletConnected) {
      toast({ title: "Connect Wallet", description: "Please connect your wallet to proceed." })
      return
    }
    if (actionAmount <= 0) {
      toast({ title: "Enter Amount", description: "Amount must be greater than zero." })
      return
    }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 900))
    setLoading(false)
    const key = expandedRow.symbol
    setPositions((prev) => {
      const curr = prev[key] || { supplied: 0, borrowed: 0 }
      if (expandedRow.mode === "supply") {
        return { ...prev, [key]: { ...curr, supplied: curr.supplied + actionAmount } }
      } else {
        return { ...prev, [key]: { ...curr, borrowed: curr.borrowed + actionAmount } }
      }
    })
    toast({
      title: "Action Simulated on Testnet",
      description: `${expandedRow.mode === "supply" ? "Supplied" : "Borrowed"} $${actionAmount.toLocaleString()} ${expandedRow.symbol}`,
    })
    setExpandedRow(null)
    setActionAmount(0)
  }

  // Helpers
  const fmt = (n: number) => `$${n.toLocaleString()}`
  const fmtPct = (n: number) => `${n.toFixed(3)}%`

  return (
    <main className="relative min-h-screen bg-black text-white">
      <Navbar />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pt-24 pb-10">
        {/* Top heading and summary metrics */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl md:text-4xl font-bold">RWA Lending Market</h1>
          <div className="flex flex-wrap items-center gap-6 text-sm text-white/80">
            <div>
              <span className="text-white/60">TVL</span> <span className="font-semibold">{fmt(626_950_000)}</span>
            </div>
            <div>
              <span className="text-white/60">Total Supply</span>{" "}
              <span className="font-semibold">{fmt(914_260_000)}</span>
            </div>
            <div>
              <span className="text-white/60">Total Borrow</span>{" "}
              <span className="font-semibold">{fmt(287_300_000)}</span>
            </div>
          </div>
        </div>

        {/* Monochrome banner (no gradients, minimal) */}
        <div className="mt-4 w-full rounded-xl bg-white/5 p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="text-sm md:text-base">
              <span className="font-semibold">RWA Supply & Borrow Campaign</span> — Earn boosted APY on Treasuries and
              Private Credit allocations during testnet.
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                className="bg-white text-black hover:opacity-90"
                onClick={() => toast({ title: "Campaign", description: "Campaign details coming soon." })}
              >
                View Details
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-white/25 text-white hover:bg-white/10 bg-transparent"
                onClick={() => toast({ title: "Bonus", description: "Bonus enrollment simulated." })}
              >
                Enroll
              </Button>
            </div>
          </div>
        </div>

        {/* Filters + Search */}
        <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 text-sm rounded-[20px] transition ${
                  activeFilter === f ? "bg-white text-black font-semibold" : "bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="w-full md:w-80">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search RWAs"
              className="w-full bg-white/5 px-3 py-2 text-sm placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-white/30"
            />
          </div>
        </div>

        {/* Main 2-column layout */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_360px]">
          {/* Left: Table */}
          <section aria-label="RWA table">
            <div className="w-full overflow-x-auto rounded-xl bg-white/5">
              <div className="min-w-[920px]">
                {/* Header row */}
                <div className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_160px] px-4 py-3 text-xs uppercase tracking-wide text-white/60">
                  <div>Assets</div>
                  <div>Supply</div>
                  <div>Borrow</div>
                  <div>Supply APR</div>
                  <div>Borrow APR</div>
                  <div className="text-right pr-2">Actions</div>
                </div>
                {/* Body */}
                <div className="divide-y divide-white/10">
                  {filtered.map((a) => {
                    const pos = positions[a.symbol] || { supplied: 0, borrowed: 0 }
                    const isExpanded = expandedRow?.symbol === a.symbol
                    return (
                      <div key={a.symbol} className="px-4">
                        <div className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_160px] items-center py-4">
                          {/* Asset */}
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="h-8 w-8 grid place-items-center rounded-full bg-white/10 text-xs font-bold">
                              {a.symbol}
                            </div>
                            <div className="min-w-0">
                              <div className="truncate font-medium">{a.name}</div>
                              <div className="text-xs text-white/60">{fmt(a.price)}</div>
                            </div>
                          </div>
                          {/* Supply */}
                          <div className="min-w-0">
                            <div className="truncate">{a.supply.toLocaleString()}</div>
                            <div className="text-xs text-white/60">{fmt(a.supplyUSD)}</div>
                          </div>
                          {/* Borrow */}
                          <div className="min-w-0">
                            <div className="truncate">{a.borrow.toLocaleString()}</div>
                            <div className="text-xs text-white/60">{fmt(a.borrowUSD)}</div>
                          </div>
                          {/* APRs */}
                          <div className="min-w-0">{fmtPct(a.supplyAPR)}</div>
                          <div className="min-w-0">{fmtPct(a.borrowAPR)}</div>
                          {/* Actions */}
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              className="bg-white text-black hover:opacity-90"
                              onClick={() => openRow(a.symbol, "borrow")}
                            >
                              Borrow
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-white/25 hover:bg-white/10 bg-transparent"
                              onClick={() => openRow(a.symbol, "supply")}
                            >
                              Supply
                            </Button>
                          </div>
                        </div>

                        {/* Inline row expander (no card borders) */}
                        {isExpanded && (
                          <div className="pb-4">
                            <div className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto]">
                              <div>
                                <label className="mb-1 block text-xs text-white/70">
                                  {expandedRow?.mode === "supply" ? "Supply Amount (USD)" : "Borrow Amount (USD)"}
                                </label>
                                <input
                                  type="number"
                                  min={0}
                                  value={actionAmount || ""}
                                  onChange={(e) => setActionAmount(Number(e.target.value))}
                                  className="w-full bg-white/5 px-3 py-2 text-sm placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-white/30"
                                  placeholder="0.00"
                                />
                                <div className="mt-1 text-xs text-white/60">
                                  Current Position — Supplied {fmt(pos.supplied)} • Borrowed {fmt(pos.borrowed)}
                                </div>
                              </div>
                              <div className="flex items-end justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-white/25 hover:bg-white/10 bg-transparent"
                                  onClick={() => setExpandedRow(null)}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={confirmAction}
                                  disabled={loading || !walletConnected}
                                  className={
                                    loading || !walletConnected
                                      ? "bg-white/20 text-white/70 cursor-not-allowed"
                                      : "bg-white text-black hover:opacity-90"
                                  }
                                >
                                  {loading ? "Processing…" : "Confirm"}
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Right: Sidebar */}
          <aside className="space-y-6">
            {/* Your Account */}
            <div className="rounded-xl bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-white/60">Net Worth</div>
                  <div className="text-3xl font-bold">{fmt(totals.netWorth)}</div>
                </div>
                <Button
                  size="sm"
                  className="bg-white text-black font-semibold hover:opacity-90"
                  onClick={() => {
                    if (!walletConnected) {
                      toast({
                        title: "Connect Wallet",
                        description: "Please connect your wallet to use 1-Click Allocate.",
                      })
                      return
                    }
                    toast({ title: "Simulated", description: "1-Click Allocation simulated for testnet." })
                  }}
                >
                  1-Click Allocate
                </Button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-white/60">Your Borrowed</div>
                  <div className="text-lg font-semibold">{fmt(totals.borrowed)}</div>
                </div>
                <div>
                  <div className="text-xs text-white/60">Your Supplied</div>
                  <div className="text-lg font-semibold">{fmt(totals.supplied)}</div>
                </div>
              </div>

              <div className="mt-4">
                <div className="text-xs text-white/60 mb-1">Health Factor / LTV</div>
                <input
                  className="w-full"
                  type="range"
                  min={0}
                  max={70}
                  step={5}
                  value={healthLtv}
                  onChange={(e) => setHealthLtv(Number(e.target.value))}
                />
                <div className="mt-2 grid grid-cols-3 text-xs text-white/60">
                  <div>
                    <div>H.F.</div>
                    <div className="text-white">{(100 - healthLtv).toFixed(2)}</div>
                  </div>
                  <div>
                    <div>Borrow Limit</div>
                    <div className="text-white">{fmt(totals.borrowLimit)}</div>
                  </div>
                  <div>
                    <div>Liq. Level</div>
                    <div className="text-white">{fmt(Math.max(0, totals.borrowed - totals.borrowLimit))}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Claim Box */}
            <div className="rounded-xl bg-white/5 p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-xs text-white/60">Available To Claim</div>
                  <div className="text-lg font-semibold">$0.00</div>
                </div>
                <div>
                  <div className="text-xs text-white/60">Total Rewards Claimed</div>
                  <div className="text-lg font-semibold">$0.00</div>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 border-white/25 hover:bg-white/10 bg-transparent">
                  Claim
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-white text-black font-semibold hover:opacity-90"
                  onClick={() => toast({ title: "Claim & Re-Allocate", description: "Simulated for testnet." })}
                >
                  Claim & Re-Allocate
                </Button>
              </div>
            </div>

            {/* Positions */}
            <div className="rounded-xl bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <div className="font-semibold">Your Positions</div>
                <div className="text-xs text-white/60">Net APR — simulated</div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <button className="rounded-[20px] bg-white/10 px-3 py-1.5">
                  Supply ({Object.values(positions).filter((p) => p.supplied > 0).length})
                </button>
                <button className="rounded-[20px] bg-white/10 px-3 py-1.5">
                  Borrow ({Object.values(positions).filter((p) => p.borrowed > 0).length})
                </button>
              </div>
              <div className="mt-3 space-y-2 text-sm">
                {Object.entries(positions).length === 0 && (
                  <div className="text-white/60">No positions yet. Supply or borrow to see them here.</div>
                )}
                {Object.entries(positions).map(([sym, p]) => (
                  <div key={sym} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
                    <div className="flex items-center gap-3">
                      <div className="h-6 w-6 grid place-items-center rounded-full bg-white/10 text-[10px] font-bold">
                        {sym}
                      </div>
                      <div className="text-white/90">{sym}</div>
                    </div>
                    <div className="text-xs text-white/70">
                      Supplied {fmt(p.supplied)} • Borrowed {fmt(p.borrowed)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* Wallet overlay for entire page interactions (only blocks actions; UI remains visible) */}
        {!walletConnected && (
          <div className="pointer-events-none fixed bottom-6 right-6 z-10 rounded-lg bg-black/50 px-3 py-2 text-xs backdrop-blur">
            Connect Wallet to perform actions
          </div>
        )}
      </div>
    </main>
  )
}
