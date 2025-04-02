"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LiveMatches from "@/components/live-matches"
import LoadingSpinner from "@/components/loading-spinner"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

export default function LivePage() {
  const [loading, setLoading] = useState(true)
  const [liveCount, setLiveCount] = useState(0)

  const handleMatchesLoaded = (count: number) => {
    setLiveCount(count)
    setLoading(false)
  }

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8 bg-gradient-to-b from-zinc-950 to-black">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
            Live Matches
          </h1>
          <div className="bg-red-600 text-white text-xs px-2 py-1 rounded-full animate-pulse">
            {loading ? "..." : liveCount} LIVE
          </div>
        </div>
        <p className="text-zinc-400">Watch and bet on live football matches happening right now</p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6 bg-zinc-900/50 p-1">
          <TabsTrigger value="all" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            All Live
          </TabsTrigger>
          <TabsTrigger value="top" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            Top Leagues
          </TabsTrigger>
          <TabsTrigger value="featured" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            Featured
          </TabsTrigger>
        </TabsList>

        <div className="flex justify-end mb-4">
          <Button variant="outline" size="sm" className="bg-zinc-800/50 border-zinc-700/50 flex items-center gap-1">
            Sort by: Popular <ChevronDown className="h-4 w-4" />
          </Button>
        </div>

        <TabsContent value="all" className="space-y-6 mt-0">
          <LiveMatches onMatchesLoaded={handleMatchesLoaded} />
        </TabsContent>

        <TabsContent value="top" className="space-y-6 mt-0">
          <LiveMatches onMatchesLoaded={handleMatchesLoaded} />
        </TabsContent>

        <TabsContent value="featured" className="space-y-6 mt-0">
          <LiveMatches onMatchesLoaded={handleMatchesLoaded} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

