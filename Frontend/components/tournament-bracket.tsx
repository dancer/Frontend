"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import LoadingSpinner from "@/components/loading-spinner"

type Match = {
  id: string
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
  date: string
  time: string
  status: "upcoming" | "live" | "finished"
}

type Round = {
  name: string
  matches: Match[]
}

export default function TournamentBracket({ tournamentId }: { tournamentId: string }) {
  const [rounds, setRounds] = useState<Round[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // This would be replaced with your actual API call
    const fetchBracket = async () => {
      try {
        // Simulating API call
        // Replace with: const response = await fetch(`/api/tournaments/${tournamentId}/bracket`)
        // const data = await response.json()

        // Mock data
        const mockData = [
          {
            name: "Quarter Finals",
            matches: [
              {
                id: "qf1",
                team1: {
                  id: "rm",
                  name: "Real Madrid",
                  logo: "/placeholder.svg?height=24&width=24",
                  score: 3,
                },
                team2: {
                  id: "mc",
                  name: "Manchester City",
                  logo: "/placeholder.svg?height=24&width=24",
                  score: 2,
                },
                date: "12 Apr 2024",
                time: "20:45",
                status: "finished",
              },
              {
                id: "qf2",
                team1: {
                  id: "bay",
                  name: "Bayern Munich",
                  logo: "/placeholder.svg?height=24&width=24",
                  score: 1,
                },
                team2: {
                  id: "psg",
                  name: "PSG",
                  logo: "/placeholder.svg?height=24&width=24",
                  score: 0,
                },
                date: "12 Apr 2024",
                time: "20:45",
                status: "finished",
              },
              {
                id: "qf3",
                team1: {
                  id: "liv",
                  name: "Liverpool",
                  logo: "/placeholder.svg?height=24&width=24",
                  score: 2,
                },
                team2: {
                  id: "bar",
                  name: "Barcelona",
                  logo: "/placeholder.svg?height=24&width=24",
                  score: 1,
                },
                date: "13 Apr 2024",
                time: "20:45",
                status: "finished",
              },
              {
                id: "qf4",
                team1: {
                  id: "atm",
                  name: "Atletico Madrid",
                  logo: "/placeholder.svg?height=24&width=24",
                  score: 0,
                },
                team2: {
                  id: "dor",
                  name: "Borussia Dortmund",
                  logo: "/placeholder.svg?height=24&width=24",
                  score: 1,
                },
                date: "13 Apr 2024",
                time: "20:45",
                status: "finished",
              },
            ],
          },
          {
            name: "Semi Finals",
            matches: [
              {
                id: "sf1",
                team1: {
                  id: "rm",
                  name: "Real Madrid",
                  logo: "/placeholder.svg?height=24&width=24",
                  score: 2,
                },
                team2: {
                  id: "bay",
                  name: "Bayern Munich",
                  logo: "/placeholder.svg?height=24&width=24",
                  score: 1,
                },
                date: "30 Apr 2024",
                time: "20:45",
                status: "finished",
              },
              {
                id: "sf2",
                team1: {
                  id: "liv",
                  name: "Liverpool",
                  logo: "/placeholder.svg?height=24&width=24",
                  score: 3,
                },
                team2: {
                  id: "dor",
                  name: "Borussia Dortmund",
                  logo: "/placeholder.svg?height=24&width=24",
                  score: 2,
                },
                date: "1 May 2024",
                time: "20:45",
                status: "finished",
              },
            ],
          },
          {
            name: "Final",
            matches: [
              {
                id: "final",
                team1: {
                  id: "rm",
                  name: "Real Madrid",
                  logo: "/placeholder.svg?height=24&width=24",
                },
                team2: {
                  id: "liv",
                  name: "Liverpool",
                  logo: "/placeholder.svg?height=24&width=24",
                },
                date: "1 Jun 2024",
                time: "20:45",
                status: "upcoming",
              },
            ],
          },
        ]

        setRounds(mockData)
        setLoading(false)
      } catch (error) {
        console.error("Failed to fetch tournament bracket:", error)
        setLoading(false)
      }
    }

    fetchBracket()
  }, [tournamentId])

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-[800px] justify-between gap-4 p-4">
        {rounds.map((round, roundIndex) => (
          <div key={roundIndex} className="flex flex-col gap-4 flex-1">
            <div className="text-center font-medium bg-zinc-800/50 py-2 rounded-md">{round.name}</div>

            <div className="flex flex-col gap-8 justify-around h-full">
              {round.matches.map((match, matchIndex) => (
                <Link
                  href={`/matches/${match.id}`}
                  key={match.id}
                  className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-lg p-3 hover:border-red-500/30 transition-all duration-300"
                >
                  <div className="text-xs text-zinc-400 mb-2 flex justify-between">
                    <span>{match.date}</span>
                    {match.status === "live" && <span className="text-red-500">LIVE</span>}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Image
                          src={match.team1.logo || "/placeholder.svg"}
                          alt={match.team1.name}
                          width={20}
                          height={20}
                          className="object-contain"
                        />
                        <span>{match.team1.name}</span>
                      </div>
                      {match.team1.score !== undefined && (
                        <span className={match.team1.score > (match.team2.score || 0) ? "font-bold text-red-500" : ""}>
                          {match.team1.score}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Image
                          src={match.team2.logo || "/placeholder.svg"}
                          alt={match.team2.name}
                          width={20}
                          height={20}
                          className="object-contain"
                        />
                        <span>{match.team2.name}</span>
                      </div>
                      {match.team2.score !== undefined && (
                        <span className={match.team2.score > (match.team1.score || 0) ? "font-bold text-red-500" : ""}>
                          {match.team2.score}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

