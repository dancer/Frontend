"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import Link from "next/link"
import { getPlayerStats } from "@/services/api"

type PlayerStats = {
  id: string
  name: string
  position: string
  team: string
  teamLogo: string
  league: string
  leagueLogo: string
  matches: number
  goals: number
  assists: number
  yellowCards: number
  redCards: number
  minutesPlayed: number
}

export default function PlayerStatsTable() {
  const [players, setPlayers] = useState<PlayerStats[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState("goals")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  useEffect(() => {
    const fetchPlayerStats = async () => {
      try {
        const data = await getPlayerStats()
        setPlayers(data)
      } catch (error) {
        console.error("failed to fetch player stats ", error)
      } finally {
        setLoading(false)
      }
    }
  
    fetchPlayerStats()
  }, [])

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("desc")
    }
  }

  const sortedPlayers = [...players].sort((a, b) => {
    const aValue = a[sortBy as keyof PlayerStats]
    const bValue = b[sortBy as keyof PlayerStats]

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
            <th className="text-left py-2 font-medium">Player</th>
            <th className="text-center py-2 font-medium">Pos</th>
            <th className="text-left py-2 font-medium">Team</th>
            <th className="text-center py-2 font-medium cursor-pointer" onClick={() => handleSort("matches")}>
              MP
            </th>
            <th className="text-center py-2 font-medium cursor-pointer" onClick={() => handleSort("goals")}>
              G
            </th>
            <th className="text-center py-2 font-medium cursor-pointer" onClick={() => handleSort("assists")}>
              A
            </th>
            <th className="text-center py-2 font-medium cursor-pointer" onClick={() => handleSort("yellowCards")}>
              YC
            </th>
            <th className="text-center py-2 font-medium cursor-pointer" onClick={() => handleSort("redCards")}>
              RC
            </th>
            <th className="text-center py-2 font-medium cursor-pointer" onClick={() => handleSort("minutesPlayed")}>
              Min
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedPlayers.map((player) => (
            <tr key={player.id} className="border-b border-zinc-700 hover:bg-zinc-800/30">
              <td className="py-3">
                <Link href={`/players/${player.id}`} className="flex items-center gap-2">
                  {player.name}
                </Link>
              </td>
              <td className="text-center">{player.position}</td>
              <td className="py-3">
                <Link href={`/teams/${player.team}`} className="flex items-center gap-2">
                  <Image
                    src={player.teamLogo || "/placeholder.svg"}
                    alt={player.team}
                    width={20}
                    height={20}
                    className="object-contain"
                  />
                  <div className="flex items-center gap-1">
                    <span>{player.team}</span>
                    <Image
                      src={player.leagueLogo || "/placeholder.svg"}
                      alt={player.league}
                      width={12}
                      height={12}
                      className="object-contain ml-1"
                    />
                  </div>
                </Link>
              </td>
              <td className="text-center">{player.matches}</td>
              <td className="text-center font-medium text-red-500">{player.goals}</td>
              <td className="text-center">{player.assists}</td>
              <td className="text-center">{player.yellowCards}</td>
              <td className="text-center">{player.redCards}</td>
              <td className="text-center">{player.minutesPlayed}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

