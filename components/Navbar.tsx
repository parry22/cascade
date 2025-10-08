"use client"

import { useState, useEffect } from "react"

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isWalletConnected, setIsWalletConnected] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleMobileNavClick = (sectionId: string) => {
    setIsMobileMenuOpen(false)
    const element = document.getElementById(sectionId)
    if (element) {
      const headerOffset = 120
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementPosition - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }

  const handleWalletConnect = () => {
    setIsWalletConnected(!isWalletConnected)
  }

  return (
    <>
      {/* Desktop Header */}
      <header
        className={`fixed top-4 z-[9999] mx-auto hidden w-full flex-row items-center justify-between self-start rounded-full backdrop-blur-md md:flex border transition-all duration-300 ${
          isScrolled ? "max-w-4xl px-2 border-white/20 shadow-lg" : "max-w-6xl px-4 border-transparent shadow-none"
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
        <a
          className={`z-50 flex items-center justify-center gap-2 transition-all duration-300 ${
            isScrolled ? "ml-4" : ""
          }`}
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

        <div className="absolute inset-0 hidden flex-1 flex-row items-center justify-center space-x-2 text-sm font-medium text-white/70 transition duration-200 hover:text-white md:flex md:space-x-2">
          <a className="relative px-4 py-2 text-white/70 hover:text-white transition-colors cursor-pointer" href="/">
            <span className="relative z-20">Create Token</span>
          </a>
          <a className="relative px-4 py-2 text-white/70 hover:text-white transition-colors cursor-pointer" href="/">
            <span className="relative z-20">Create Pool</span>
          </a>
          <a className="relative px-4 py-2 text-white/70 hover:text-white transition-colors cursor-pointer" href="/">
            <span className="relative z-20">Swap</span>
          </a>
          <a className="relative px-4 py-2 text-white/70 hover:text-white transition-colors cursor-pointer" href="/">
            <span className="relative z-20">Registry</span>
          </a>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleWalletConnect}
            className={`rounded-lg font-medium relative cursor-pointer hover:-translate-y-0.5 transition-all duration-200 inline-block text-center px-4 py-2 text-sm border ${
              isWalletConnected
                ? "bg-green-500/20 border-green-400/30 text-green-300 hover:bg-green-500/30"
                : "bg-gradient-to-r from-blue-900 to-blue-600 border-blue-400/30 text-white hover:from-blue-800 hover:to-blue-500"
            }`}
          >
            {isWalletConnected ? "0x1234...5678" : "Connect Wallet"}
          </button>
        </div>
      </header>

      {/* Mobile Header */}
      <header
        className={`fixed top-4 z-[9999] mx-4 flex w-auto flex-row items-center justify-between rounded-full backdrop-blur-md md:hidden px-4 py-3 border transition-all duration-300 ${
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

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 transition-colors hover:bg-white/10"
          aria-label="Toggle menu"
          style={{ background: "rgba(255, 255, 255, 0.05)" }}
        >
          <div className="flex flex-col items-center justify-center w-5 h-5 space-y-1">
            <span
              className={`block w-4 h-0.5 bg-foreground transition-all duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""}`}
            ></span>
            <span
              className={`block w-4 h-0.5 bg-foreground transition-all duration-300 ${isMobileMenuOpen ? "opacity-0" : ""}`}
            ></span>
            <span
              className={`block w-4 h-0.5 bg-foreground transition-all duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
            ></span>
          </div>
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm md:hidden">
          <div
            className="absolute top-24 left-4 right-4 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-6"
            style={{ background: "rgba(255, 255, 255, 0.1)" }}
          >
            <nav className="flex flex-col space-y-4">
              <a
                href="/"
                className="text-left px-4 py-3 text-lg font-medium text-white/80 hover:text-white transition-colors rounded-lg hover:bg-white/10"
              >
                Create Token
              </a>
              <a
                href="/"
                className="text-left px-4 py-3 text-lg font-medium text-white/80 hover:text-white transition-colors rounded-lg hover:bg-white/10"
              >
                Create Pool
              </a>
              <a
                href="/"
                className="text-left px-4 py-3 text-lg font-medium text-white/80 hover:text-white transition-colors rounded-lg hover:bg-white/10"
              >
                Swap
              </a>
              <a
                href="/"
                className="text-left px-4 py-3 text-lg font-medium text-white/80 hover:text-white transition-colors rounded-lg hover:bg-white/10"
              >
                Registry
              </a>
              <div className="border-t border-white/20 pt-4 mt-4 flex flex-col space-y-3">
                <button
                  onClick={handleWalletConnect}
                  className={`px-4 py-3 text-lg font-bold text-center rounded-lg transition-all duration-200 border ${
                    isWalletConnected
                      ? "bg-green-500/20 border-green-400/30 text-green-300"
                      : "bg-gradient-to-r from-blue-900 to-blue-600 border-blue-400/30 text-white"
                  }`}
                >
                  {isWalletConnected ? "0x1234...5678" : "Connect Wallet"}
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
