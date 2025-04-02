"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import Link from "next/link"

type LeagueStats = {
  id: string
  name: string
  logo: string
  region: string
  teams: number
  matches: number
  goalsPerMatch: number
  avgCards: number
  topScorer: {
    name: string
    goals: number
  }
}

export default function LeagueStatsTable() {
  const [leagues, setLeagues] = useState<LeagueStats[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState("goalsPerMatch")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  useEffect(() => {
    // This would be replaced with your actual API call
    const fetchLeagueStats = async () => {
      try {
        // Simulating API call
        // Replace with: const response = await fetch('/api/statistics/leagues')
        // const data = await response.json()

        // Mock data
        const mockData = [
          {
            id: "pl",
            name: "Premier League",
            logo: "/placeholder.svg?height=32&width=32",
            region: "England",
            teams: 20,
            matches: 380,
            goalsPerMatch: 2.8,
            avgCards: 3.5,
            topScorer: {
              name: "Erling Haaland",
              goals: 36,
            },
          },
          {
            id: "laliga",
            name: "La Liga",
            logo: "/placeholder.svg?height=32&width=32",
            region: "Spain",
            teams: 20,
            matches: 380,
            goalsPerMatch: 2.5,
            avgCards: 4.2,
            topScorer: {
              name: "Robert Lewandowski",
              goals: 23,
            },
          },
          {
            id: "bundesliga",
            name: "Bundesliga",
            logo: "/placeholder.svg?height=32&width=32",
            region: "Germany",
            teams: 18,
            matches: 306,
            goalsPerMatch: 3.1,
            avgCards: 3.8,
            topScorer: {
              name: "Harry Kane",
              goals: 32,
            },
          },
          {
            id: "seriea",
            name: "Serie A",
            logo: "/placeholder.svg?height=32&width=32",
            region: "Italy",
            teams: 20,
            matches: 380,
            goalsPerMatch: 2.6,
            avgCards: 4.5,
            topScorer: {
              name: "Lautaro Martinez",
              goals: 24,
            },
          },
          {
            id: "ligue1",
            name: "Ligue 1",
            logo: "/placeholder.svg?height=32&width=32",
            region: "France",
            teams: 18,
            matches: 306,
            goalsPerMatch: 2.7,
            avgCards: 3.9,
            topScorer: {
              name: "Kylian Mbappé",
              goals: 27,
            },
          },
        ]

        setLeagues(mockData)
        setLoading(false)
      } catch (error) {
        console.error("Failed to fetch league statistics:", error)
        setLoading(false)
      }
    }

    fetchLeagueStats()
  }, [])

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("desc")
    }
  }

  const sortedLeagues = [...leagues].sort((a, b) => {
    const aValue = a[sortBy as keyof LeagueStats]
    const bValue = b[sortBy as keyof LeagueStats]

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue
    }

    return 0
  })

  if (loading) {
    return <div className="animate-pulse bg-zinc-800/30 h-64 rounded-lg"></div>
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-end mb-4">
        <Button variant="outline" size="sm" className="bg-zinc-800/50 border-zinc-700/50 flex items-center gap-1">
          Sort by: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)} <ChevronDown className="h-4 w-4" />
        </Button>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-zinc-400 border-b border-zinc-700">
            <th className="text-left py-2 font-medium">League</th>
            <th className="text-center py-2 font-medium cursor-pointer" onClick={() => handleSort("teams")}>
              Teams
            </th>
            <th className="text-center py-2 font-medium cursor-pointer" onClick={() => handleSort("matches")}>
              Matches
            </th>
            <th className="text-center py-2 font-medium cursor-pointer" onClick={() => handleSort("goalsPerMatch")}>
              Goals/Match
            </th>
            <th className="text-center py-2 font-medium cursor-pointer" onClick={() => handleSort("avgCards")}>
              Avg Cards
            </th>
            <th className="text-left py-2 font-medium">Top Scorer</th>
          </tr>
        </thead>
        <tbody>
          {sortedLeagues.map((league) => (
            <tr key={league.id} className="border-b border-zinc-700 hover:bg-zinc-800/30">
              <td className="py-3">
                <Link href={`/leagues/${league.id}`} className="flex items-center gap-2">
                  <Image
                    src={league.logo || "/placeholder.svg"}
                    alt={league.name}
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                  <div>
                    <div>{league.name}</div>
                    <div className="text-xs text-zinc-400">{league.region}</div>
                  </div>
                </Link>
              </td>
              <td className="text-center">{league.teams}</td>
              <td className="text-center">{league.matches}</td>
              <td className="text-center font-medium">{league.goalsPerMatch.toFixed(1)}</td>
              <td className="text-center">{league.avgCards.toFixed(1)}</td>
              <td className="py-3">
                <div className="flex items-center gap-1">
                  <span className="font-medium">{league.topScorer.name}</span>
                  <span className="text-red-500 text-xs">({league.topScorer.goals} goals)</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

