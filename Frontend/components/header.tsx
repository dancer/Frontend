"use client"

import { ChevronDown, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/auth-context"

type Player = {
  id: number
  name: string
  commonName?: string
  position?: string
  currentTeam?: string
  imageUrl?: string
}

export default function Header() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Player[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    setShowResults(true)

    if (query.trim().length < 2) {
      setSearchResults([])
      return
    }

    try {
      setIsSearching(true)
      const response = await fetch(`http://localhost:5000/api/football/players/search?query=${encodeURIComponent(query)}`)
      const data = await response.json()
      setSearchResults(data.players || [])
    } catch (error) {
      console.error('Search failed:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const searchContainer = document.getElementById('search-container')
      if (searchContainer && !searchContainer.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header
      className={`border-b border-zinc-800/50 py-3 px-4 transition-all duration-300 ${scrolled ? "bg-black/90 backdrop-blur-md" : "bg-black"
        }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center space-x-1">
          </nav>
        </div>

        <div id="search-container" className="hidden md:flex items-center gap-3 relative max-w-md w-full">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Search players..."
              className="pl-10 bg-zinc-800/50 border-zinc-700/50 focus:border-red-500 focus:ring-red-500 rounded-full"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => setShowResults(true)}
            />

            {/* Search Results Dropdown */}
            {showResults && (searchResults.length > 0 || isSearching) && (
              <div className="absolute mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-lg shadow-lg overflow-hidden z-50">
                {isSearching ? (
                  <div className="p-4 text-center text-zinc-400">
                    Searching...
                  </div>
                ) : (
                  <div className="max-h-96 overflow-y-auto">
                    {searchResults.map((player) => (
                      <div
                        key={player.id}
                        className="p-3 hover:bg-zinc-800 cursor-pointer flex items-center gap-3 transition-colors"
                        onClick={() => {
                          setSearchQuery("")
                          setShowResults(false)
                          // Handle player selection - you can add navigation here if needed
                        }}
                      >
                        <div className="relative h-10 w-10 rounded-full overflow-hidden bg-zinc-800">
                          <Image
                            src={player.imageUrl || "/placeholder.svg"}
                            alt={player.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{player.name}</div>
                          {player.currentTeam && (
                            <div className="text-sm text-zinc-400">{player.currentTeam}</div>
                          )}
                        </div>
                        {player.position && (
                          <span className="ml-auto text-sm text-zinc-400">{player.position}</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-zinc-800/50 rounded-full px-3 py-1.5">
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
                <span className="text-sm font-medium">{user?.balance || 0} coins</span>
              </div>

              <div className="relative group">
                <div className="flex items-center gap-2 cursor-pointer">
                  <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-red-500 bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white font-medium">
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:inline text-sm font-medium">{user?.username}</span>
                  <ChevronDown className="h-4 w-4 text-zinc-400" />
                </div>
                <div className="absolute right-0 mt-2 w-48 bg-zinc-800 rounded-md shadow-lg overflow-hidden z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="py-1">
                    <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-zinc-700">
                      My Profile
                    </Link>
                    <Link href="/my-bets" className="block px-4 py-2 text-sm hover:bg-zinc-700">
                      My Bets
                    </Link>
                    <button
                      onClick={() => logout()}
                      className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-zinc-700"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="outline" size="sm" className="bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-700">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  variant="default"
                  size="sm"
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white"
                >
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

