"use client"

import { useState, useEffect } from "react"
import { notFound, useParams } from "next/navigation"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import LoadingSpinner from "@/components/loading-spinner"
import { useBettingSlip } from "@/context/betting-slip-context"
import { Clock, Play, Star, Users } from "lucide-react"
import MatchStats from "@/components/match-stats"
import MatchLineups from "@/components/match-lineups"
import MatchOdds from "@/components/match-odds"
import MatchH2H from "@/components/match-h2h"

type MatchDetails = {
  id: string
  status: "upcoming" | "live" | "finished"
  tournament: string
  tournamentLogo: string
  date: string
  time: string
  stadium: string
  attendance: string
  referee: string
  team1: {
    id: string
    name: string
    logo: string
    score?: number
  }
  team2: {
    id: string
    name: string
    logo: string
    score?: number
  }
  minute?: number
  odds: {
    team1Win: number
    draw: number
    team2Win: number
  }
}

export default function MatchPage() {
  const params = useParams()
  const matchId = params.id as string
  const [match, setMatch] = useState<MatchDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const { addBet } = useBettingSlip()

  useEffect(() => {
    // This would be replaced with your actual API call
    const fetchMatchDetails = async () => {
      try {
        // Simulating API call
        // Replace with: const response = await fetch(`/api/matches/${matchId}`)
        // const data = await response.json()

        // Mock data
        const mockData = {
          id: matchId,
          status: "live",
          tournament: "UEFA Champions League",
          tournamentLogo: "/placeholder.svg?height=24&width=24",
          date: "Today",
          time: "20:45",
          stadium: "Santiago Bernabéu",
          attendance: "81,044",
          referee: "Anthony Taylor",
          team1: {
            id: "rm",
            name: "Real Madrid",
            logo: "/placeholder.svg?height=96&width=96",
            score: 2,
          },
          team2: {
            id: "liv",
            name: "Liverpool",
            logo: "/placeholder.svg?height=96&width=96",
            score: 1,
          },
          minute: 67,
          odds: {
            team1Win: 2.1,
            draw: 3.5,
            team2Win: 3.2,
          },
        }

        setMatch(mockData)
        setLoading(false)
      } catch (error) {
        console.error("Failed to fetch match details:", error)
        setLoading(false)
      }
    }

    fetchMatchDetails()
  }, [matchId])

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
      isLive: match.status === "live",
    })
  }

  if (loading) {
    return (
      <div className="flex-1 p-6 md:p-8 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!match) {
    notFound()
  }

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8 bg-gradient-to-b from-zinc-950 to-black">
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
            {match.status === "live" && (
              <div className="ml-2 px-2 py-0.5 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs rounded-full animate-pulse">
                LIVE {match.minute}'
              </div>
            )}
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

          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center justify-center gap-12 w-full md:w-auto">
              <div className="flex flex-col items-center">
                <div className="relative h-24 w-24 mb-2">
                  <Image
                    src={match.team1.logo || "/placeholder.svg"}
                    alt={match.team1.name}
                    width={96}
                    height={96}
                    className="object-contain"
                  />
                </div>
                <span className="font-bold text-lg">{match.team1.name}</span>
              </div>

              <div className="text-center">
                {match.status === "upcoming" ? (
                  <div className="text-3xl font-bold mb-1">VS</div>
                ) : (
                  <div className="text-4xl font-bold mb-1 text-red-500">
                    {match.team1.score} - {match.team2.score}
                  </div>
                )}
                <div className="text-xs text-zinc-400 uppercase">
                  {match.status === "upcoming" ? "UPCOMING" : match.status === "live" ? "LIVE" : "FINAL"}
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="relative h-24 w-24 mb-2">
                  <Image
                    src={match.team2.logo || "/placeholder.svg"}
                    alt={match.team2.name}
                    width={96}
                    height={96}
                    className="object-contain"
                  />
                </div>
                <span className="font-bold text-lg">{match.team2.name}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full md:w-auto">
              <div className="text-sm text-zinc-400 mb-1 text-center md:text-right">Match Winner</div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="bg-zinc-800/70 border-zinc-700/50 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-200 flex-1"
                  onClick={() => handleBetClick("team1Win")}
                >
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-zinc-400">{match.team1.name}</span>
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
                    <span className="text-xs text-zinc-400">{match.team2.name}</span>
                    <span className="font-bold">{match.odds.team2Win.toFixed(2)}</span>
                  </div>
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-6 text-xs text-zinc-400 justify-center md:justify-start">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" /> {match.date}, {match.time}
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" /> {match.attendance} Attendance
            </div>
            <div>{match.stadium}</div>
            <div>Referee: {match.referee}</div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="odds" className="w-full">
        <TabsList className="mb-6 bg-zinc-900/50 p-1">
          <TabsTrigger value="odds" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            Odds
          </TabsTrigger>
          <TabsTrigger value="stats" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            Stats
          </TabsTrigger>
          <TabsTrigger value="lineups" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            Lineups
          </TabsTrigger>
          <TabsTrigger value="h2h" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            H2H
          </TabsTrigger>
        </TabsList>

        <TabsContent value="odds" className="space-y-6 mt-0">
          <MatchOdds matchId={matchId} />
        </TabsContent>

        <TabsContent value="stats" className="space-y-6 mt-0">
          <MatchStats matchId={matchId} />
        </TabsContent>

        <TabsContent value="lineups" className="space-y-6 mt-0">
          <MatchLineups matchId={matchId} />
        </TabsContent>

        <TabsContent value="h2h" className="space-y-6 mt-0">
          <MatchH2H matchId={matchId} team1Id={match.team1.id} team2Id={match.team2.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

