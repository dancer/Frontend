"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronRight, Star } from "lucide-react"
import { getLiveMatches, LiveMatch } from "@/services/api"
import BettingModal from "@/components/betting-modal"

interface LiveMatchesProps {
  onMatchesLoaded?: (count: number) => void;
}

export default function LiveMatches({ onMatchesLoaded }: LiveMatchesProps) {
  const [liveMatches, setLiveMatches] = useState<LiveMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedBet, setSelectedBet] = useState<any>(null)
  const [isBettingModalOpen, setIsBettingModalOpen] = useState(false)

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true)
        const data = await getLiveMatches()
        setLiveMatches(data)
        onMatchesLoaded?.(data.length)
        setError(null)
      } catch (err) {
        console.error("Failed to fetch live matches:", err)
        setError("Failed to load live matches. Please try again later.")
        onMatchesLoaded?.(0)
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()

    // Set up polling for live updates every 30 seconds
    const interval = setInterval(fetchMatches, 30000)

    return () => clearInterval(interval)
  }, [onMatchesLoaded])

  const handleBetClick = (match: LiveMatch, betType: "team1Win" | "draw" | "team2Win") => {
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

    setSelectedBet({
      id: `${match.id}-${betType}`,
      matchId: match.id,
      match: `${match.team1.name} vs ${match.team2.name}`,
      selection,
      odds,
      isLive: true,
    })
    setIsBettingModalOpen(true)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-zinc-800/30 rounded-lg h-24 animate-pulse"></div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Retry
        </Button>
      </div>
    )
  }

  if (liveMatches.length === 0) {
    return (
      <div className="text-center py-8 text-zinc-400">
        <p>No live matches available at the moment.</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {liveMatches.map((match) => (
          <div
            key={match.id}
            className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-lg overflow-hidden hover:border-red-500/30 transition-all duration-300 group"
          >
            <div className="p-4">
              <div className="flex items-center gap-2 text-xs text-zinc-400 mb-3">
                <Image
                  src={match.tournamentLogo || "/placeholder.svg"}
                  alt={match.tournament}
                  width={16}
                  height={16}
                  className="object-contain"
                />
                <span>{match.region}</span>
                <span>-</span>
                <span>{match.tournament}</span>
                <div className="ml-2 px-2 py-0.5 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs rounded-full">
                  LIVE
                </div>
                <span>{match.minute}'</span>
                <button className="ml-auto text-zinc-500 hover:text-red-500 transition-colors">
                  <Star className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="relative h-6 w-6">
                      <Image
                        src={match.team1.logo || "/placeholder.svg"}
                        alt={match.team1.name}
                        width={24}
                        height={24}
                        className="object-contain"
                      />
                    </div>
                    <span className="font-medium">{match.team1.name}</span>
                    <span className="font-bold ml-1 text-red-500">{match.team1.score}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative h-6 w-6">
                      <Image
                        src={match.team2.logo || "/placeholder.svg"}
                        alt={match.team2.name}
                        width={24}
                        height={24}
                        className="object-contain"
                      />
                    </div>
                    <span className="font-medium">{match.team2.name}</span>
                    <span className="font-bold ml-1 text-red-500">{match.team2.score}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-zinc-800/50 border-zinc-700/50 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-200"
                    onClick={() => handleBetClick(match, "team1Win")}
                  >
                    {match.odds.team1Win.toFixed(2)}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-zinc-800/50 border-zinc-700/50 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-200"
                    onClick={() => handleBetClick(match, "draw")}
                  >
                    {match.odds.draw.toFixed(2)}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-zinc-800/50 border-zinc-700/50 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-200"
                    onClick={() => handleBetClick(match, "team2Win")}
                  >
                    {match.odds.team2Win.toFixed(2)}
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-zinc-800/50 py-2 px-4 flex justify-end">
              <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white hover:bg-zinc-700/50 group">
                Live Stats <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <BettingModal
        isOpen={isBettingModalOpen}
        onClose={() => setIsBettingModalOpen(false)}
        bet={selectedBet}
      />
    </>
  )
}

