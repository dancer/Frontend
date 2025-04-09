"use client"

import { useEffect, useState } from "react"
import { getFeaturedLeagues, getFeaturedMatches, getLiveMatches, type League, type Match } from "@/services/leagues"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MatchCard from "@/components/match-card"
import LoadingSpinner from "@/components/loading-spinner"
import Link from "next/link"

export default function HomePage() {
  const [featuredLeagues, setFeaturedLeagues] = useState<League[]>([])
  const [featuredMatches, setFeaturedMatches] = useState<Match[]>([])
  const [liveMatches, setLiveMatches] = useState<Match[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true)
        setError(null)
        const [leagues, featured, live] = await Promise.all([
          getFeaturedLeagues(),
          getFeaturedMatches(),
          getLiveMatches()
        ])
        setFeaturedLeagues(leagues)
        setFeaturedMatches(featured)
        setLiveMatches(live)
      } catch (err) {
        setError("Failed to load matches")
        console.error("Error loading matches:", err)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex-1 p-6 md:p-8 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 p-6 md:p-8 flex items-center justify-center text-red-500">
        {error}
      </div>
    )
  }

  return (
    <div className="flex-1 p-6 md:p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
          Featured Leagues
        </h1>
        <p className="text-zinc-400">Top leagues with active matches</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {featuredLeagues.map(league => (
          <Link
            key={league.id}
            href={`/leagues/${league.id}`}
            className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-lg p-4 hover:bg-zinc-800/50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <img src={league.logo} alt={league.name} className="h-10 w-10" />
              <div>
                <div className="font-medium">{league.name}</div>
                <div className="text-sm text-zinc-400">{league.country}</div>
              </div>
            </div>
            {league.activeMatches > 0 && (
              <div className="mt-3 text-sm">
                <span className="text-red-500 font-medium">{league.activeMatches}</span>
                <span className="text-zinc-400"> active matches</span>
              </div>
            )}
          </Link>
        ))}
      </div>

      <Tabs defaultValue="featured" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="featured">Featured Matches</TabsTrigger>
          <TabsTrigger value="live" className="relative">
            Live
            {liveMatches.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {liveMatches.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="featured" className="space-y-4">
          {featuredMatches.length === 0 ? (
            <p className="text-center text-zinc-500">No featured matches</p>
          ) : (
            featuredMatches.map(match => (
              <MatchCard key={match.id} match={match} />
            ))
          )}
        </TabsContent>

        <TabsContent value="live" className="space-y-4">
          {liveMatches.length === 0 ? (
            <p className="text-center text-zinc-500">No live matches</p>
          ) : (
            liveMatches.map(match => (
              <MatchCard key={match.id} match={match} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

