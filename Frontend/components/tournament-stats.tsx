"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LoadingSpinner from "@/components/loading-spinner"
import Link from "next/link"

type TopScorer = {
  id: string
  name: string
  team: string
  teamLogo: string
  goals: number
  matches: number
}

type TopAssist = {
  id: string
  name: string
  team: string
  teamLogo: string
  assists: number
  matches: number
}

type TeamStat = {
  id: string
  name: string
  logo: string
  matches: number
  wins: number
  draws: number
  losses: number
  goalsFor: number
  goalsAgainst: number
}

export default function TournamentStats({ tournamentId }: { tournamentId: string }) {
  const [topScorers, setTopScorers] = useState<TopScorer[]>([])
  const [topAssists, setTopAssists] = useState<TopAssist[]>([])
  const [teamStats, setTeamStats] = useState<TeamStat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // This would be replaced with your actual API call
    const fetchStats = async () => {
      try {
        // Simulating API call
        // Replace with: const response = await fetch(`/api/tournaments/${tournamentId}/stats`)
        // const data = await response.json()

        // Mock data
        const mockScorers = [
          {
            id: "p1",
            name: "Erling Haaland",
            team: "Manchester City",
            teamLogo: "/placeholder.svg?height=24&width=24",
            goals: 12,
            matches: 10,
          },
          {
            id: "p2",
            name: "Kylian Mbappé",
            team: "PSG",
            teamLogo: "/placeholder.svg?height=24&width=24",
            goals: 8,
            matches: 8,
          },
          {
            id: "p3",
            name: "Vinicius Jr",
            team: "Real Madrid",
            teamLogo: "/placeholder.svg?height=24&width=24",
            goals: 7,
            matches: 12,
          },
          {
            id: "p4",
            name: "Mohamed Salah",
            team: "Liverpool",
            teamLogo: "/placeholder.svg?height=24&width=24",
            goals: 6,
            matches: 10,
          },
          {
            id: "p5",
            name: "Robert Lewandowski",
            team: "Barcelona",
            teamLogo: "/placeholder.svg?height=24&width=24",
            goals: 5,
            matches: 8,
          },
        ]

        const mockAssists = [
          {
            id: "p6",
            name: "Kevin De Bruyne",
            team: "Manchester City",
            teamLogo: "/placeholder.svg?height=24&width=24",
            assists: 9,
            matches: 10,
          },
          {
            id: "p7",
            name: "Trent Alexander-Arnold",
            team: "Liverpool",
            teamLogo: "/placeholder.svg?height=24&width=24",
            assists: 7,
            matches: 10,
          },
          {
            id: "p3",
            name: "Vinicius Jr",
            team: "Real Madrid",
            teamLogo: "/placeholder.svg?height=24&width=24",
            assists: 6,
            matches: 12,
          },
          {
            id: "p8",
            name: "Bruno Fernandes",
            team: "Manchester United",
            teamLogo: "/placeholder.svg?height=24&width=24",
            assists: 5,
            matches: 8,
          },
          {
            id: "p9",
            name: "Lionel Messi",
            team: "PSG",
            teamLogo: "/placeholder.svg?height=24&width=24",
            assists: 5,
            matches: 8,
          },
        ]

        const mockTeamStats = [
          {
            id: "rm",
            name: "Real Madrid",
            logo: "/placeholder.svg?height=24&width=24",
            matches: 12,
            wins: 9,
            draws: 2,
            losses: 1,
            goalsFor: 28,
            goalsAgainst: 12,
          },
          {
            id: "mc",
            name: "Manchester City",
            logo: "/placeholder.svg?height=24&width=24",
            matches: 10,
            wins: 7,
            draws: 2,
            losses: 1,
            goalsFor: 25,
            goalsAgainst: 10,
          },
          {
            id: "liv",
            name: "Liverpool",
            logo: "/placeholder.svg?height=24&width=24",
            matches: 10,
            wins: 7,
            draws: 1,
            losses: 2,
            goalsFor: 22,
            goalsAgainst: 11,
          },
          {
            id: "bay",
            name: "Bayern Munich",
            logo: "/placeholder.svg?height=24&width=24",
            matches: 10,
            wins: 6,
            draws: 2,
            losses: 2,
            goalsFor: 24,
            goalsAgainst: 13,
          },
          {
            id: "psg",
            name: "PSG",
            logo: "/placeholder.svg?height=24&width=24",
            matches: 8,
            wins: 5,
            draws: 1,
            losses: 2,
            goalsFor: 18,
            goalsAgainst: 10,
          },
        ]

        setTopScorers(mockScorers)
        setTopAssists(mockAssists)
        setTeamStats(mockTeamStats)
        setLoading(false)
      } catch (error) {
        console.error("Failed to fetch tournament stats:", error)
        setLoading(false)
      }
    }

    fetchStats()
  }, [tournamentId])

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <Tabs defaultValue="scorers" className="w-full">
      <TabsList className="mb-6 bg-zinc-900/50 p-1">
        <TabsTrigger value="scorers" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
          Top Scorers
        </TabsTrigger>
        <TabsTrigger value="assists" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
          Top Assists
        </TabsTrigger>
        <TabsTrigger value="teams" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
          Team Stats
        </TabsTrigger>
      </TabsList>

      <TabsContent value="scorers" className="space-y-6 mt-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-zinc-400 border-b border-zinc-700">
                <th className="text-left py-2 font-medium">Player</th>
                <th className="text-left py-2 font-medium">Team</th>
                <th className="text-center py-2 font-medium">Matches</th>
                <th className="text-center py-2 font-medium">Goals</th>
              </tr>
            </thead>
            <tbody>
              {topScorers.map((player, index) => (
                <tr key={player.id} className="border-b border-zinc-700 hover:bg-zinc-800/30">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 flex items-center justify-center font-medium">{index + 1}.</div>
                      <Link href={`/players/${player.id}`}>{player.name}</Link>
                    </div>
                  </td>
                  <td className="py-3">
                    <Link href={`/teams/${player.team}`} className="flex items-center gap-2">
                      <Image
                        src={player.teamLogo || "/placeholder.svg"}
                        alt={player.team}
                        width={20}
                        height={20}
                        className="object-contain"
                      />
                      {player.team}
                    </Link>
                  </td>
                  <td className="text-center">{player.matches}</td>
                  <td className="text-center font-medium text-red-500">{player.goals}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TabsContent>

      <TabsContent value="assists" className="space-y-6 mt-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-zinc-400 border-b border-zinc-700">
                <th className="text-left py-2 font-medium">Player</th>
                <th className="text-left py-2 font-medium">Team</th>
                <th className="text-center py-2 font-medium">Matches</th>
                <th className="text-center py-2 font-medium">Assists</th>
              </tr>
            </thead>
            <tbody>
              {topAssists.map((player, index) => (
                <tr key={player.id} className="border-b border-zinc-700 hover:bg-zinc-800/30">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 flex items-center justify-center font-medium">{index + 1}.</div>
                      <Link href={`/players/${player.id}`}>{player.name}</Link>
                    </div>
                  </td>
                  <td className="py-3">
                    <Link href={`/teams/${player.team}`} className="flex items-center gap-2">
                      <Image
                        src={player.teamLogo || "/placeholder.svg"}
                        alt={player.team}
                        width={20}
                        height={20}
                        className="object-contain"
                      />
                      {player.team}
                    </Link>
                  </td>
                  <td className="text-center">{player.matches}</td>
                  <td className="text-center font-medium text-red-500">{player.assists}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TabsContent>

      <TabsContent value="teams" className="space-y-6 mt-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-zinc-400 border-b border-zinc-700">
                <th className="text-left py-2 font-medium">Team</th>
                <th className="text-center py-2 font-medium">MP</th>
                <th className="text-center py-2 font-medium">W</th>
                <th className="text-center py-2 font-medium">D</th>
                <th className="text-center py-2 font-medium">L</th>
                <th className="text-center py-2 font-medium">GF</th>
                <th className="text-center py-2 font-medium">GA</th>
                <th className="text-center py-2 font-medium">GD</th>
              </tr>
            </thead>
            <tbody>
              {teamStats.map((team) => (
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
                      {team.name}
                    </Link>
                  </td>
                  <td className="text-center">{team.matches}</td>
                  <td className="text-center">{team.wins}</td>
                  <td className="text-center">{team.draws}</td>
                  <td className="text-center">{team.losses}</td>
                  <td className="text-center">{team.goalsFor}</td>
                  <td className="text-center">{team.goalsAgainst}</td>
                  <td className="text-center font-medium">
                    {team.goalsFor - team.goalsAgainst > 0 ? "+" : ""}
                    {team.goalsFor - team.goalsAgainst}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TabsContent>
    </Tabs>
  )
}

