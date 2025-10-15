"use client"

type Position = {
  side: "Supply" | "Borrow"
  symbol: string
  name: string
  amountUSD: number
  rate: number // APY for supply, APR for borrow
}

const mockPortfolioValues = [300, 312, 320, 315, 330, 342, 355, 349, 361, 372, 381, 395]

const positions: Position[] = [
  { side: "Supply", symbol: "UST", name: "US Treasuries (T-Bills)", amountUSD: 12.3, rate: 4.2 },
  { side: "Supply", symbol: "REIT", name: "Tokenized Real Estate Fund", amountUSD: 8.7, rate: 5.6 },
  { side: "Borrow", symbol: "USDC", name: "Stablecoin Credit Line", amountUSD: 4.1, rate: 3.8 },
  { side: "Borrow", symbol: "PC1", name: "Private Credit Loan A", amountUSD: 2.3, rate: 8.9 },
]

export default function DashboardPage() {
  const totalSupplied = positions.filter((p) => p.side === "Supply").reduce((s, p) => s + p.amountUSD, 0)
  const totalBorrowed = positions.filter((p) => p.side === "Borrow").reduce((s, p) => s + p.amountUSD, 0)

  const latest = mockPortfolioValues.at(-1) ?? 0
  const prev = mockPortfolioValues.at(-2) ?? latest
  const delta = latest - prev
  const pct = prev ? ((delta / prev) * 100).toFixed(2) : "0.00"

  return (
    <main className="mx-auto w-full max-w-7xl px-4 md:px-6 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Aggregated view of your RWAs across the platform.</p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-[20px] bg-muted/20 p-4">
          <div className="text-sm text-muted-foreground">Total Portfolio Value</div>
          <div className="mt-1 text-2xl font-medium font-mono tabular-nums">${latest}k</div>
        </div>
        <div className="rounded-[20px] bg-muted/20 p-4">
          <div className="text-sm text-muted-foreground">Change (PnL)</div>
          <div className={`mt-1 text-2xl font-medium font-mono tabular-nums`}>
            {delta >= 0 ? "+" : ""}
            {delta}k ({pct}%)
          </div>
        </div>
        <div className="rounded-[20px] bg-muted/20 p-4">
          <div className="text-sm text-muted-foreground">Health Factor</div>
          <div className="mt-1 text-2xl font-medium font-mono tabular-nums">170.9</div>
        </div>
      </section>

      <section className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-[20px] bg-muted/20 p-4">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-base font-medium">Borrowed (Paying APR)</h2>
            <span className="text-sm text-muted-foreground">
              Total Borrowed: <span className="font-mono tabular-nums">${totalBorrowed.toFixed(2)}k</span>
            </span>
          </div>
          <ul className="divide-y divide-border/40">
            {positions
              .filter((p) => p.side === "Borrow")
              .map((p) => (
                <li key={p.symbol + p.side} className="flex items-center justify-between py-3">
                  <div>
                    <div className="text-sm">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.symbol}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono tabular-nums">${p.amountUSD.toFixed(2)}k</div>
                    <div className="text-xs text-muted-foreground font-mono tabular-nums">{p.rate.toFixed(2)}% APR</div>
                  </div>
                </li>
              ))}
          </ul>
        </div>

        <div className="rounded-[20px] bg-muted/20 p-4">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-base font-medium">Supplied / Staked (Earning APY)</h2>
            <span className="text-sm text-muted-foreground">
              Total Supplied: <span className="font-mono tabular-nums">${totalSupplied.toFixed(2)}k</span>
            </span>
          </div>
          <ul className="divide-y divide-border/40">
            {positions
              .filter((p) => p.side === "Supply")
              .map((p) => (
                <li key={p.symbol + p.side} className="flex items-center justify-between py-3">
                  <div>
                    <div className="text-sm">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.symbol}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono tabular-nums">${p.amountUSD.toFixed(2)}k</div>
                    <div className="text-xs text-muted-foreground font-mono tabular-nums">{p.rate.toFixed(2)}% APY</div>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </section>
    </main>
  )
}
