"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LoadingSpinner from "@/components/loading-spinner"

type Player = {
  id: string
  name: string
  number: number
  position: string
  isCaptain?: boolean
}

type Lineup = {
  formation: string
  startingXI: Player[]
  substitutes: Player[]
  coach: string
}

type MatchLineup = {
  team1: {
    id: string
    name: string
    logo: string
    lineup: Lineup
  }
  team2: {
    id: string
    name: string
    logo: string
    lineup: Lineup
  }
}

export default function MatchLineups({ matchId }: { matchId: string }) {
  const [lineups, setLineups] = useState<MatchLineup | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLineups = async () => {
      try {
        // Simulating API call
        // Replace with: const response = await fetch(`/api/matches/${matchId}/lineups`)
        // const data = await response.json()

        // Mock data
        const mockData = {
          team1: {
            id: "rm",
            name: "Real Madrid",
            logo: "/placeholder.svg?height=48&width=48",
            lineup: {
              formation: "4-3-3",
              startingXI: [
                { id: "p1", name: "Courtois", number: 1, position: "GK" },
                { id: "p2", name: "Carvajal", number: 2, position: "RB" },
                { id: "p3", name: "Militão", number: 3, position: "CB" },
                { id: "p4", name: "Alaba", number: 4, position: "CB" },
                { id: "p5", name: "Mendy", number: 23, position: "LB" },
                { id: "p6", name: "Kroos", number: 8, position: "CM" },
                { id: "p7", name: "Casemiro", number: 14, position: "CDM" },
                { id: "p8", name: "Modric", number: 10, position: "CM", isCaptain: true },
                { id: "p9", name: "Rodrygo", number: 21, position: "RW" },
                { id: "p10", name: "Benzema", number: 9, position: "ST" },
                { id: "p11", name: "Vinicius Jr", number: 20, position: "LW" },
              ],
              substitutes: [
                { id: "p12", name: "Lunin", number: 13, position: "GK" },
                { id: "p13", name: "Vallejo", number: 5, position: "CB" },
                { id: "p14", name: "Nacho", number: 6, position: "CB" },
                { id: "p15", name: "Valverde", number: 15, position: "CM" },
                { id: "p16", name: "Camavinga", number: 25, position: "CM" },
                { id: "p17", name: "Asensio", number: 11, position: "RW" },
                { id: "p18", name: "Jovic", number: 16, position: "ST" },
              ],
              coach: "Carlo Ancelotti",
            },
          },
          team2: {
            id: "liv",
            name: "Liverpool",
            logo: "/placeholder.svg?height=48&width=48",
            lineup: {
              formation: "4-3-3",
              startingXI: [
                { id: "p19", name: "Alisson", number: 1, position: "GK" },
                { id: "p20", name: "Alexander-Arnold", number: 66, position: "RB" },
                { id: "p21", name: "Konaté", number: 5, position: "CB" },
                { id: "p22", name: "Van Dijk", number: 4, position: "CB", isCaptain: true },
                { id: "p23", name: "Robertson", number: 26, position: "LB" },
                { id: "p24", name: "Henderson", number: 14, position: "CM" },
                { id: "p25", name: "Fabinho", number: 3, position: "CDM" },
                { id: "p26", name: "Thiago", number: 6, position: "CM" },
                { id: "p27", name: "Salah", number: 11, position: "RW" },
                { id: "p28", name: "Mané", number: 10, position: "ST" },
                { id: "p29", name: "Luis Díaz", number: 23, position: "LW" },
              ],
              substitutes: [
                { id: "p30", name: "Kelleher", number: 62, position: "GK" },
                { id: "p31", name: "Gomez", number: 12, position: "CB" },
                { id: "p32", name: "Matip", number: 32, position: "CB" },
                { id: "p33", name: "Milner", number: 7, position: "CM" },
                { id: "p34", name: "Keita", number: 8, position: "CM" },
                { id: "p35", name: "Jones", number: 17, position: "CM" },
                { id: "p36", name: "Jota", number: 20, position: "ST" },
              ],
              coach: "Jürgen Klopp",
            },
          },
        }

        setLineups(mockData)
        setLoading(false)
      } catch (error) {
        console.error("Failed to fetch match lineups:", error)
        setLoading(false)
      }
    }

    fetchLineups()
  }, [matchId])

  if (loading) {
    return <LoadingSpinner />
  }

  if (!lineups) {
    return <div className="text-center py-8 text-zinc-400">No lineup information available for this match</div>
  }

  return (
    <Tabs defaultValue="team1" className="w-full">
      <TabsList className="mb-6 bg-zinc-900/50 p-1">
        <TabsTrigger value="team1" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
          <div className="flex items-center gap-2">
            <Image
              src={lineups.team1.logo || "/placeholder.svg"}
              alt={lineups.team1.name}
              width={20}
              height={20}
              className="object-contain"
            />
            {lineups.team1.name}
          </div>
        </TabsTrigger>
        <TabsTrigger value="team2" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
          <div className="flex items-center gap-2">
            <Image
              src={lineups.team2.logo || "/placeholder.svg"}
              alt={lineups.team2.name}
              width={20}
              height={20}
              className="object-contain"
            />
            {lineups.team2.name}
          </div>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="team1" className="space-y-6 mt-0">
        <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-zinc-400">Formation: {lineups.team1.lineup.formation}</div>
            <div className="text-sm text-zinc-400">Coach: {lineups.team1.lineup.coach}</div>
          </div>

          <div className="mb-6">
            <div className="text-sm font-medium mb-2">Starting XI</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {lineups.team1.lineup.startingXI.map((player) => (
                <div key={player.id} className="flex items-center gap-2 p-2 bg-zinc-800/50 rounded-md">
                  <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-xs font-medium">
                    {player.number}
                  </div>
                  <div>
                    <span className="font-medium">{player.name}</span>
                    {player.isCaptain && <span className="ml-1 text-yellow-500">(C)</span>}
                  </div>
                  <div className="ml-auto text-xs text-zinc-400">{player.position}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm font-medium mb-2">Substitutes</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {lineups.team1.lineup.substitutes.map((player) => (
                <div key={player.id} className="flex items-center gap-2 p-2 bg-zinc-800/50 rounded-md">
                  <div className="w-6 h-6 bg-zinc-700 rounded-full flex items-center justify-center text-xs font-medium">
                    {player.number}
                  </div>
                  <div>
                    <span>{player.name}</span>
                  </div>
                  <div className="ml-auto text-xs text-zinc-400">{player.position}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="team2" className="space-y-6 mt-0">
        <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-zinc-400">Formation: {lineups.team2.lineup.formation}</div>
            <div className="text-sm text-zinc-400">Coach: {lineups.team2.lineup.coach}</div>
          </div>

          <div className="mb-6">
            <div className="text-sm font-medium mb-2">Starting XI</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {lineups.team2.lineup.startingXI.map((player) => (
                <div key={player.id} className="flex items-center gap-2 p-2 bg-zinc-800/50 rounded-md">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                    {player.number}
                  </div>
                  <div>
                    <span className="font-medium">{player.name}</span>
                    {player.isCaptain && <span className="ml-1 text-yellow-500">(C)</span>}
                  </div>
                  <div className="ml-auto text-xs text-zinc-400">{player.position}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm font-medium mb-2">Substitutes</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {lineups.team2.lineup.substitutes.map((player) => (
                <div key={player.id} className="flex items-center gap-2 p-2 bg-zinc-800/50 rounded-md">
                  <div className="w-6 h-6 bg-zinc-700 rounded-full flex items-center justify-center text-xs font-medium">
                    {player.number}
                  </div>
                  <div>
                    <span>{player.name}</span>
                  </div>
                  <div className="ml-auto text-xs text-zinc-400">{player.position}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}

