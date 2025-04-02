"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LoadingSpinner from "@/components/loading-spinner"
import { Button } from "@/components/ui/button"
import { BarChart3, ChevronDown, Filter } from "lucide-react"
import TeamStatsTable from "@/components/team-stats-table"
import PlayerStatsTable from "@/components/player-stats-table"
import LeagueStatsTable from "@/components/league-stats-table"

export default function StatisticsPage() {
  const [loading, setLoading] = useState(true)
  const [selectedLeague, setSelectedLeague] = useState("All Leagues")

  useEffect(() => {
    // This would be replaced with your actual API call
    const fetchStats = async () => {
      try {
        // Simulating API call
        // Replace with: const response = await fetch('/api/statistics')
        // const data = await response.json()

        // Mock data loading
        setTimeout(() => {
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Failed to fetch statistics:", error)
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8 bg-gradient-to-b from-zinc-950 to-black">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-red-500" /> Football Statistics
        </h1>
        <p className="text-zinc-400">Analyze team and player performance data</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          variant="outline"
          size="sm"
          className="bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-700 flex items-center gap-1"
          onClick={() => {}}
        >
          {selectedLeague} <ChevronDown className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-700 flex items-center gap-1 ml-auto"
        >
          <Filter className="h-4 w-4 mr-1" /> Filters
        </Button>
      </div>

      <Tabs defaultValue="teams" className="w-full">
        <TabsList className="mb-6 bg-zinc-900/50 p-1">
          <TabsTrigger value="teams" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            Teams
          </TabsTrigger>
          <TabsTrigger value="players" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            Players
          </TabsTrigger>
          <TabsTrigger value="leagues" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            Leagues
          </TabsTrigger>
        </TabsList>

        <TabsContent value="teams" className="space-y-6 mt-0">
          {loading ? <LoadingSpinner /> : <TeamStatsTable />}
        </TabsContent>

        <TabsContent value="players" className="space-y-6 mt-0">
          {loading ? <LoadingSpinner /> : <PlayerStatsTable />}
        </TabsContent>

        <TabsContent value="leagues" className="space-y-6 mt-0">
          {loading ? <LoadingSpinner /> : <LeagueStatsTable />}
        </TabsContent>
      </Tabs>
    </div>
  )
}

