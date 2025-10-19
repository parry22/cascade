"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

type Rwa = {
  symbol: string
  name: string
  apy: number
  tvl: number
  available: number
  minLock: string
  risk: "Low" | "Medium" | "High"
  image: string
}

const RWAS: Rwa[] = [
  {
    symbol: "UST",
    name: "US Treasuries (T-Bills)",
    apy: 4.2,
    tvl: 128.4,
    available: 36.2,
    minLock: "7d",
    risk: "Low",
    image: "/images/rwas/treasuries.jpg",
  },
  {
    symbol: "PC1",
    name: "Private Credit Pool A",
    apy: 8.1,
    tvl: 72.8,
    available: 12.4,
    minLock: "30d",
    risk: "Medium",
    image: "/images/rwas/private-credit.jpg",
  },
  {
    symbol: "REIT",
    name: "Tokenized Real Estate Fund",
    apy: 5.6,
    tvl: 54.9,
    available: 8.7,
    minLock: "14d",
    risk: "Medium",
    image: "/images/rwas/real-estate.jpg",
  },
  {
    symbol: "GLD",
    name: "Gold-Backed Notes",
    apy: 3.3,
    tvl: 21.5,
    available: 9.4,
    minLock: "7d",
    risk: "Low",
    image: "/images/rwas/gold.jpg",
  },
]

export default function EarnPage() {
  const [amounts, setAmounts] = useState<Record<string, string>>({})

  return (
    <main className="mx-auto w-full max-w-7xl px-4 md:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Earn</h1>
        <p className="text-sm text-white/60 mt-2">Supply / stake your RWAs to earn yield.</p>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {RWAS.map((a) => (
          <article key={a.symbol} className="rounded-[20px] bg-muted/20 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={a.image || "/placeholder.svg"}
                  alt={a.name}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded object-cover"
                />
                <div>
                  <h3 className="text-base font-medium">{a.name}</h3>
                  <p className="text-xs text-muted-foreground">{a.symbol}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">APY</div>
                <div className="font-mono tabular-nums">{a.apy.toFixed(2)}%</div>
              </div>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">TVL</dt>
                <dd className="font-mono tabular-nums">${a.tvl.toFixed(1)}M</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Available</dt>
                <dd className="font-mono tabular-nums">${a.available.toFixed(1)}M</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Min Lock</dt>
                <dd className="font-mono tabular-nums">{a.minLock}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Risk</dt>
                <dd className="font-mono tabular-nums">{a.risk}</dd>
              </div>
            </dl>

            <div className="mt-4 flex items-center gap-3">
              <input
                type="number"
                inputMode="decimal"
                placeholder="Amount"
                value={amounts[a.symbol] || ""}
                onChange={(e) => setAmounts((s) => ({ ...s, [a.symbol]: e.target.value }))}
                className="w-full rounded-[20px] bg-background border border-border px-3 py-2 text-sm outline-none"
              />
              <Button className="rounded-[20px]">Stake</Button>
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}
