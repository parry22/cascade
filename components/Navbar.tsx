"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const pathname = usePathname()

  const NavItem = ({ href, label }: { href: string; label: string }) => {
    const active = pathname === href
    return (
      <Link
        href={href}
        className={`rounded-[20px] px-3 py-1 text-sm transition-colors ${
          active ? "bg-foreground text-background" : "text-muted-foreground hover:bg-foreground/10"
        }`}
      >
        {label}
      </Link>
    )
  }

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    try {
      const stored = localStorage.getItem("walletConnected") === "true"
      setIsWalletConnected(stored)
    } catch {}
  }, [])

  const handleWalletConnect = () => {
    const next = !isWalletConnected
    setIsWalletConnected(next)
    try {
      localStorage.setItem("walletConnected", next ? "true" : "false")
      localStorage.setItem("walletAddress", next ? "0x1234...5678" : "")
    } catch {}
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("wallet-connection-change", {
          detail: { connected: next, address: next ? "0x1234...5678" : "" },
        }),
      )
    }
  }

  return (
    <>
      {/* Desktop Header - logo left, nav centered, wallet right */}
      <header
        className={`fixed top-4 z-[9999] mx-auto hidden w-full items-center justify-between rounded-full backdrop-blur-md md:flex border transition-all duration-300 ${
          isScrolled ? "max-w-4xl px-4 border-white/20 shadow-lg" : "max-w-6xl px-6 border-transparent shadow-none"
        } py-2`}
        style={{
          willChange: "transform",
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
          perspective: "1000px",
          background: isScrolled ? "rgba(15, 15, 15, 0.8)" : "transparent",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        {/* v0 logo */}
        <a
          className="z-50 flex items-center justify-center gap-2"
          href="https://v0.app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            fill="white"
            viewBox="0 0 147 70"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="text-foreground rounded-full size-8 w-8"
          >
            <path d="M56 50.2031V14H70V60.1562C70 65.5928 65.5928 70 60.1562 70C57.5605 70 54.9982 68.9992 53.1562 67.1573L0 14H19.7969L56 50.2031Z"></path>
            <path d="M147 56H133V23.9531L100.953 56H133V70H96.6875C85.8144 70 77 61.1856 77 50.3125V14H91V46.1562L123.156 14H91V0H127.312C138.186 0 147 8.81439 147 19.6875V56Z"></path>
          </svg>
        </a>

        {/* Centered nav with Borrow/Earn/Dashboard */}
        <nav className="hidden md:flex items-center gap-2">
          <NavItem href="/testnet" label="Borrow" />
          <NavItem href="/earn" label="Earn" />
          <NavItem href="/dashboard" label="Dashboard" />
        </nav>

        {/* Wallet button only */}
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            onClick={handleWalletConnect}
            className={`rounded-[20px] ${
              isWalletConnected
                ? "bg-white text-black hover:bg-white"
                : "bg-black text-white hover:bg-white hover:text-black"
            }`}
          >
            {isWalletConnected ? "0x1234...5678" : "Connect Wallet"}
          </Button>
        </div>
      </header>

      {/* Mobile Header - logo left, compact nav on mobile, wallet right */}
      <header
        className={`fixed top-4 z-[9999] mx-4 flex w-auto items-center justify-between rounded-full backdrop-blur-md md:hidden px-4 py-3 border transition-all duration-300 ${
          isScrolled ? "border-white/20 shadow-lg" : "border-transparent shadow-none"
        }`}
        style={{
          background: isScrolled ? "rgba(15, 15, 15, 0.8)" : "transparent",
          left: "1rem",
          right: "1rem",
          width: "calc(100% - 2rem)",
        }}
      >
        <a className="flex items-center justify-center gap-2" href="/">
          <svg
            width="28"
            height="28"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-white"
          >
            <path d="M20 30L35 60L50 30L35 45L20 30Z" fill="currentColor" />
            <rect x="55" y="30" width="8" height="30" fill="currentColor" />
            <rect x="68" y="30" width="8" height="30" fill="currentColor" />
            <path d="M80 30H95C97.2 30 99 31.8 99 34V56C99 58.2 97.2 60 95 60H80V30Z" fill="currentColor" />
            <path d="M80 45L95 30H80V45Z" fill="white" />
          </svg>
          <span className="text-white font-semibold">v0</span>
        </a>

        {/* Compact nav on mobile */}
        <nav className="hidden sm:flex items-center gap-2">
          <NavItem href="/testnet" label="Borrow" />
          <NavItem href="/earn" label="Earn" />
          <NavItem href="/dashboard" label="Dashboard" />
        </nav>

        {/* Wallet button only */}
        <Button
          onClick={handleWalletConnect}
          size="sm"
          className={`rounded-[20px] ${
            isWalletConnected
              ? "bg-white text-black hover:bg-white"
              : "bg-black text-white hover:bg-white hover:text-black"
          }`}
        >
          {isWalletConnected ? "0x1234...5678" : "Connect Wallet"}
        </Button>
      </header>
    </>
  )
}
