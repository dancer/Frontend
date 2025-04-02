"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import Link from "next/link"

type TeamStats = {
  id: string
  name: string
  logo: string
  league: string
  leagueLogo: string
  matches: number
  wins: number
  draws: number
  losses: number
  goalsFor: number
  goalsAgainst: number
  cleanSheets: number
  form: string[]
}

export default function TeamStatsTable() {
  const [teams, setTeams] = useState<TeamStats[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState("wins")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  useEffect(() => {
    // This would be replaced with your actual API call
    const fetchTeamStats = async () => {
      try {
        // Simulating API call
        // Replace with: const response = await fetch('/api/statistics/teams')
        // const data = await response.json()

        // Mock data
        const mockData = [
          {
            id: "rm",
            name: "Real Madrid",
            logo: "/placeholder.svg?height=32&width=32",
            league: "La Liga",
            leagueLogo: "/placeholder.svg?height=16&width=16",
            matches: 38,
            wins: 28,
            draws: 6,
            losses: 4,
            goalsFor: 89,
            goalsAgainst: 32,
            cleanSheets: 16,
            form: ["W", "W", "D", "W", "L"],
          },
          {
            id: "mc",
            name: "Manchester City",
            logo: "/placeholder.svg?height=32&width=32",
            league: "Premier League",
            leagueLogo: "/placeholder.svg?height=16&width=16",
            matches: 38,
            wins: 29,
            draws: 5,
            losses: 4,
            goalsFor: 94,
            goalsAgainst: 26,
            cleanSheets: 18,
            form: ["W", "W", "W", "D", "W"],
          },
          {
            id: "bay",
            name: "Bayern Munich",
            logo: "/placeholder.svg?height=32&width=32",
            league: "Bundesliga",
            leagueLogo: "/placeholder.svg?height=16&width=16",
            matches: 34,
            wins: 25,
            draws: 4,
            losses: 5,
            goalsFor: 92,
            goalsAgainst: 38,
            cleanSheets: 12,
            form: ["W", "L", "W", "W", "W"],
          },
          {
            id: "liv",
            name: "Liverpool",
            logo: "/placeholder.svg?height=32&width=32",
            league: "Premier League",
            leagueLogo: "/placeholder.svg?height=16&width=16",
            matches: 38,
            wins: 26,
            draws: 8,
            losses: 4,
            goalsFor: 85,
            goalsAgainst: 34,
            cleanSheets: 14,
            form: ["D", "W", "W", "W", "W"],
          },
          {
            id: "bar",
            name: "Barcelona",
            logo: "/placeholder.svg?height=32&width=32",
            league: "La Liga",
            leagueLogo: "/placeholder.svg?height=16&width=16",
            matches: 38,
            wins: 24,
            draws: 7,
            losses: 7,
            goalsFor: 78,
            goalsAgainst: 40,
            cleanSheets: 13,
            form: ["W", "D", "L", "W", "W"],
          },
        ]

        setTeams(mockData)
        setLoading(false)
      } catch (error) {
        console.error("Failed to fetch team statistics:", error)
        setLoading(false)
      }
    }

    fetchTeamStats()
  }, [])

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("desc")
    }
  }

  const sortedTeams = [...teams].sort((a, b) => {
    const aValue = a[sortBy as keyof TeamStats]
    const bValue = b[sortBy as keyof TeamStats]

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
            <th className="text-left py-2 font-medium">Team</th>
            <th className="text-center py-2 font-medium cursor-pointer" onClick={() => handleSort("matches")}>
              MP
            </th>
            <th className="text-center py-2 font-medium cursor-pointer" onClick={() => handleSort("wins")}>
              W
            </th>
            <th className="text-center py-2 font-medium cursor-pointer" onClick={() => handleSort("draws")}>
              D
            </th>
            <th className="text-center py-2 font-medium cursor-pointer" onClick={() => handleSort("losses")}>
              L
            </th>
            <th className="text-center py-2 font-medium cursor-pointer" onClick={() => handleSort("goalsFor")}>
              GF
            </th>
            <th className="text-center py-2 font-medium cursor-pointer" onClick={() => handleSort("goalsAgainst")}>
              GA
            </th>
            <th className="text-center py-2 font-medium cursor-pointer" onClick={() => handleSort("cleanSheets")}>
              CS
            </th>
            <th className="text-center py-2 font-medium">Form</th>
          </tr>
        </thead>
        <tbody>
          {sortedTeams.map((team) => (
            <tr key={team.id} className="border-b border-zinc-700 hover:bg-zinc-800/30">
              <td className="py-3">
                <Link href={`/teams/${team.id}`} className="flex items-center gap-2">
                  <Image
                    src={team.logo || "/placeholder.svg"}
                    alt={team.name}
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                  <div>
                    <div>{team.name}</div>
                    <div className="flex items-center gap-1 text-xs text-zinc-400">
                      <Image
                        src={team.leagueLogo || "/placeholder.svg"}
                        alt={team.league}
                        width={12}
                        height={12}
                        className="object-contain"
                      />
                      {team.league}
                    </div>
                  </div>
                </Link>
              </td>
              <td className="text-center">{team.matches}</td>
              <td className="text-center">{team.wins}</td>
              <td className="text-center">{team.draws}</td>
              <td className="text-center">{team.losses}</td>
              <td className="text-center">{team.goalsFor}</td>
              <td className="text-center">{team.goalsAgainst}</td>
              <td className="text-center">{team.cleanSheets}</td>
              <td className="text-center">
                <div className="flex items-center justify-center gap-1">
                  {team.form.map((result, index) => (
                    <span
                      key={index}
                      className={`inline-block w-5 h-5 rounded-full text-xs flex items-center justify-center ${
                        result === "W"
                          ? "bg-green-600 text-white"
                          : result === "D"
                            ? "bg-yellow-600 text-white"
                            : "bg-red-600 text-white"
                      }`}
                    >
                      {result}
                    </span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

