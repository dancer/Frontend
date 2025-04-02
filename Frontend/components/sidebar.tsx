"use client"

import type React from "react"

import { Home, Calendar, Trophy, Menu, Clock, Wallet, Star, BarChart3 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"

export default function Sidebar() {
  const pathname = usePathname()
  const [expanded, setExpanded] = useState(true)

  const toggleSidebar = () => {
    setExpanded(!expanded)
  }

  // Collapse sidebar on mobile by default
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setExpanded(false)
      } else {
        setExpanded(true)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div
      className={`bg-zinc-900/50 backdrop-blur-md border-r border-zinc-800/50 transition-all duration-300 ${expanded ? "w-56" : "w-16"}`}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 flex items-center justify-between">
          {expanded && (
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-red-600 to-red-700 text-white h-8 w-8 rounded-md flex items-center justify-center font-bold">
                F
              </div>
              <span className="font-bold text-lg">FootballX</span>
            </Link>
          )}
          {!expanded && (
            <div className="w-full flex justify-center">
              <button
                onClick={toggleSidebar}
                className="bg-gradient-to-br from-red-600 to-red-700 text-white h-8 w-8 rounded-md flex items-center justify-center font-bold hover:from-red-500 hover:to-red-600 transition-colors"
              >
                F
              </button>
            </div>
          )}
          {expanded && (
            <button onClick={toggleSidebar} className="text-zinc-400 hover:text-white">
              <Menu className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-1 px-3">
            <SidebarItem
              icon={<Home className="h-5 w-5" />}
              label="Home"
              href="/"
              active={pathname === "/"}
              expanded={expanded}
            />
            <SidebarItem
              icon={<Clock className="h-5 w-5" />}
              label="Live Matches"
              href="/live"
              active={pathname === "/live"}
              expanded={expanded}
            />
            <SidebarItem
              icon={<Calendar className="h-5 w-5" />}
              label="Upcoming"
              href="/upcoming"
              active={pathname === "/upcoming"}
              expanded={expanded}
            />
            <SidebarItem
              icon={<Wallet className="h-5 w-5" />}
              label="My Bets"
              href="/my-bets"
              active={pathname === "/my-bets"}
              expanded={expanded}
            />
            <SidebarItem
              icon={<Star className="h-5 w-5" />}
              label="Favorites"
              href="/favorites"
              active={pathname === "/favorites"}
              expanded={expanded}
            />
            <SidebarItem
              icon={<BarChart3 className="h-5 w-5" />}
              label="Statistics"
              href="/statistics"
              active={pathname === "/statistics"}
              expanded={expanded}
            />
          </div>

          <div className="mt-6 px-4">
            {expanded && <div className="text-xs font-medium text-zinc-500 mb-2">TOP LEAGUES</div>}
            <div className="space-y-1">
              <LeagueItem
                name="Premier League"
                href="/leagues/premier-league"
                active={pathname === "/leagues/premier-league"}
                expanded={expanded}
              />
              <LeagueItem
                name="La Liga"
                href="/leagues/la-liga"
                active={pathname === "/leagues/la-liga"}
                expanded={expanded}
              />
              <LeagueItem
                name="Bundesliga"
                href="/leagues/bundesliga"
                active={pathname === "/leagues/bundesliga"}
                expanded={expanded}
              />
              <LeagueItem
                name="Serie A"
                href="/leagues/serie-a"
                active={pathname === "/leagues/serie-a"}
                expanded={expanded}
              />
              <LeagueItem
                name="Ligue 1"
                href="/leagues/ligue-1"
                active={pathname === "/leagues/ligue-1"}
                expanded={expanded}
              />
              <LeagueItem
                name="Champions League"
                href="/leagues/champions-league"
                active={pathname === "/leagues/champions-league"}
                expanded={expanded}
              />
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-zinc-800/50">
          <div className={`flex items-center gap-2 ${expanded ? "justify-start" : "justify-center"}`}>
            <Trophy className="h-5 w-5 text-red-500" />
            {expanded && <span className="text-sm text-zinc-400">VIP Status</span>}
          </div>
        </div>
      </div>
    </div>
  )
}

function SidebarItem({
  icon,
  label,
  href,
  active,
  expanded,
}: {
  icon: React.ReactNode
  label: string
  href: string
  active: boolean
  expanded: boolean
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 p-2 rounded-md ${expanded ? "justify-start" : "justify-center"} ${
        active ? "bg-zinc-800/70" : "hover:bg-zinc-800/40"
      } transition-all duration-200`}
    >
      <div className={active ? "text-red-500" : "text-zinc-400"}>{icon}</div>
      {expanded && <span className={active ? "text-white" : "text-zinc-400"}>{label}</span>}
    </Link>
  )
}

function LeagueItem({
  name,
  href,
  active,
  expanded,
}: {
  name: string
  href: string
  active: boolean
  expanded: boolean
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 p-2 rounded-md ${expanded ? "justify-start" : "justify-center"} ${
        active ? "bg-zinc-800/70" : "hover:bg-zinc-800/40"
      } transition-all duration-200`}
    >
      <div className="relative h-5 w-5 flex items-center justify-center">
        <Image src="/placeholder.svg?height=20&width=20" alt={name} width={20} height={20} className="object-contain" />
      </div>
      {expanded && <span className={active ? "text-white" : "text-zinc-400"}>{name}</span>}
    </Link>
  )
}

