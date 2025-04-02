"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useBettingSlip } from "@/context/betting-slip-context"
import { Play, Star } from "lucide-react"

type FeaturedMatch = {
  id: string
  tournament: string
  tournamentLogo: string
  date: string
  time: string
  team1: {
    id: string
    name: string
    logo: string
    shortName: string
  }
  team2: {
    id: string
    name: string
    logo: string
    shortName: string
  }
  odds: {
    team1Win: number
    draw: number
    team2Win: number
  }
}

export default function FeaturedMatch() {
  const [match, setMatch] = useState<FeaturedMatch | null>(null)
  const [loading, setLoading] = useState(true)
  const { addBet } = useBettingSlip()

  useEffect(() => {
    // This would be replaced with your actual API call
    const fetchFeaturedMatch = async () => {
      try {
        // Simulating API call
        // Replace with: const response = await fetch('/api/matches/featured')
        // const data = await response.json()

        // Mock data
        const mockData = {
          id: "featured-1",
          tournament: "UEFA Champions League",
          tournamentLogo: "/placeholder.svg?height=24&width=24",
          date: "Today",
          time: "20:45",
          team1: {
            id: "rm",
            name: "Real Madrid",
            shortName: "RMA",
            logo: "/placeholder.svg?height=64&width=64",
          },
          team2: {
            id: "liv",
            name: "Liverpool",
            shortName: "LIV",
            logo: "/placeholder.svg?height=64&width=64",
          },
          odds: {
            team1Win: 2.1,
            draw: 3.5,
            team2Win: 3.2,
          },
        }

        setMatch(mockData)
        setLoading(false)
      } catch (error) {
        console.error("Failed to fetch featured match:", error)
        setLoading(false)
      }
    }

    fetchFeaturedMatch()
  }, [])

  const handleBetClick = (betType: "team1Win" | "draw" | "team2Win") => {
    if (!match) return

    let selection = ""
    let odds = 0

    if (betType === "team1Win") {
      selection = match.team1.name
      odds = match.odds.team1Win
    } else if (betType === "draw") {
      selection = "Draw"
      odds = match.odds.draw
    } else {
      selection = match.team2.name
      odds = match.odds.team2Win
    }

    addBet({
      id: `${match.id}-${betType}`,
      matchId: match.id,
      match: `${match.team1.name} vs ${match.team2.name}`,
      selection,
      odds,
      stake: 0,
      potentialWin: 0,
    })
  }

  if (loading || !match) {
    return <div className="bg-zinc-800/30 rounded-lg h-48 animate-pulse"></div>
  }

  return (
    <div className="relative overflow-hidden rounded-lg">
      <div className="absolute inset-0 bg-gradient-to-r from-red-900/30 to-zinc-900/30 z-0"></div>
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=1200')] bg-cover bg-center opacity-20 z-0"></div>

      <div className="relative z-10 p-6">
        <div className="flex items-center gap-2 text-xs text-zinc-300 mb-4">
          <Image
            src={match.tournamentLogo || "/placeholder.svg"}
            alt={match.tournament}
            width={16}
            height={16}
            className="object-contain"
          />
          <span className="font-medium">{match.tournament}</span>
          <span>|</span>
          <span>{match.date}</span>
          <span>|</span>
          <span>{match.time}</span>
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-zinc-800/50 border-zinc-700/50 hover:bg-red-600 hover:text-white hover:border-red-600 rounded-full gap-1"
            >
              <Play className="h-3 w-3" /> Watch Live
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-700 hover:text-white hover:border-zinc-600 rounded-full p-1 h-8 w-8"
            >
              <Star className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div className="flex flex-col items-center">
              <div className="relative h-16 w-16 mb-2">
                <Image
                  src={match.team1.logo || "/placeholder.svg"}
                  alt={match.team1.name}
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>
              <span className="font-bold text-lg">{match.team1.name}</span>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold mb-1">VS</div>
              <div className="text-xs text-zinc-400">FEATURED MATCH</div>
            </div>

            <div className="flex flex-col items-center">
              <div className="relative h-16 w-16 mb-2">
                <Image
                  src={match.team2.logo || "/placeholder.svg"}
                  alt={match.team2.name}
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>
              <span className="font-bold text-lg">{match.team2.name}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="text-sm text-zinc-400 mb-1 text-right">Match Winner</div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="bg-zinc-800/70 border-zinc-700/50 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-200 flex-1"
                onClick={() => handleBetClick("team1Win")}
              >
                <div className="flex flex-col items-center">
                  <span className="text-xs text-zinc-400">{match.team1.shortName}</span>
                  <span className="font-bold">{match.odds.team1Win.toFixed(2)}</span>
                </div>
              </Button>
              <Button
                variant="outline"
                className="bg-zinc-800/70 border-zinc-700/50 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-200 flex-1"
                onClick={() => handleBetClick("draw")}
              >
                <div className="flex flex-col items-center">
                  <span className="text-xs text-zinc-400">DRAW</span>
                  <span className="font-bold">{match.odds.draw.toFixed(2)}</span>
                </div>
              </Button>
              <Button
                variant="outline"
                className="bg-zinc-800/70 border-zinc-700/50 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-200 flex-1"
                onClick={() => handleBetClick("team2Win")}
              >
                <div className="flex flex-col items-center">
                  <span className="text-xs text-zinc-400">{match.team2.shortName}</span>
                  <span className="font-bold">{match.odds.team2Win.toFixed(2)}</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

