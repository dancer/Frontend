"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UpcomingMatches from "@/components/upcoming-matches"
import LiveMatches from "@/components/live-matches"
import LoadingSpinner from "@/components/loading-spinner"
import { Button } from "@/components/ui/button"
import { Heart, Plus, Star, Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getFavoriteTeams, addFavoriteTeam, removeFavoriteTeam, getAvailableTeams, type FavoriteTeam } from "@/services/api"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export default function FavoritesPage() {
  const [loading, setLoading] = useState(true)
  const [favoriteTeams, setFavoriteTeams] = useState<FavoriteTeam[]>([])
  const [availableTeams, setAvailableTeams] = useState<FavoriteTeam[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddingFavorite, setIsAddingFavorite] = useState(false)
  const { toast } = useToast()

  const fetchFavorites = async () => {
    try {
      const data = await getFavoriteTeams()
      setFavoriteTeams(data)
    } catch (error) {
      console.error("Failed to fetch favorites:", error)
      toast({
        title: "Error",
        description: "Failed to load favorite teams",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchAvailableTeams = async () => {
    try {
      const data = await getAvailableTeams()
      setAvailableTeams(data)
    } catch (error) {
      console.error("Failed to fetch available teams:", error)
      toast({
        title: "Error",
        description: "Failed to load available teams",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchFavorites()
    fetchAvailableTeams()
  }, [])

  const handleAddFavorite = async (teamId: string) => {
    try {
      setIsAddingFavorite(true)
      const newTeam = await addFavoriteTeam(teamId)
      setFavoriteTeams([...favoriteTeams, newTeam])
      toast({
        title: "Success",
        description: "Team added to favorites",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add team to favorites",
        variant: "destructive",
      })
    } finally {
      setIsAddingFavorite(false)
    }
  }

  const handleRemoveFavorite = async (teamId: string) => {
    try {
      await removeFavoriteTeam(teamId)
      setFavoriteTeams(favoriteTeams.filter(team => team.id !== teamId))
      toast({
        title: "Success",
        description: "Team removed from favorites",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove team from favorites",
        variant: "destructive",
      })
    }
  }

  // Group teams by league
  const groupedTeams = availableTeams.reduce((acc, team) => {
    if (!acc[team.league]) {
      acc[team.league] = []
    }
    if (
      searchQuery === "" ||
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.league.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      acc[team.league].push(team)
    }
    return acc
  }, {} as Record<string, FavoriteTeam[]>)

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8 bg-gradient-to-b from-zinc-950 to-black">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent flex items-center gap-2">
          <Heart className="h-6 w-6 text-red-500" /> My Favorites
        </h1>
        <p className="text-zinc-400">Track your favorite teams and matches</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {loading ? (
          Array(4)
            .fill(0)
            .map((_, i) => <div key={i} className="bg-zinc-800/30 rounded-lg h-32 animate-pulse"></div>)
        ) : (
          <>
            {favoriteTeams.map((team) => (
              <div
                key={team.id}
                className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-lg p-4 hover:border-red-500/30 transition-all duration-300 flex flex-col items-center relative group"
              >
                <button
                  onClick={() => handleRemoveFavorite(team.id)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-red-500"
                >
                  <Heart className="h-4 w-4 fill-current" />
                </button>
                <div className="relative h-16 w-16 mb-2">
                  <Image
                    src={team.logo}
                    alt={team.name}
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                </div>
                <div className="font-medium text-center">{team.name}</div>
                <div className="flex items-center gap-1 text-xs text-zinc-400 mt-1">
                  <Image
                    src={team.leagueLogo}
                    alt={team.league}
                    width={12}
                    height={12}
                    className="object-contain"
                  />
                  {team.league}
                </div>
              </div>
            ))}
            <Dialog>
              <DialogTrigger asChild>
                <button className="bg-zinc-900/30 border border-zinc-800/50 border-dashed rounded-lg p-4 hover:border-red-500/30 transition-all duration-300 flex flex-col items-center justify-center h-full">
                  <div className="bg-zinc-800/50 rounded-full p-3 mb-2">
                    <Plus className="h-6 w-6 text-zinc-400" />
                  </div>
                  <div className="text-sm text-zinc-400">Add Favorite</div>
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Add Favorite Team</DialogTitle>
                </DialogHeader>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                  <Input
                    placeholder="Search teams or leagues..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="overflow-y-auto max-h-[60vh] pr-2 -mr-2">
                  {Object.entries(groupedTeams).map(([league, teams]) => (
                    teams.length > 0 && (
                      <div key={league} className="mb-6 last:mb-0">
                        <div className="flex items-center gap-2 mb-3">
                          <Image
                            src={teams[0].leagueLogo}
                            alt={league}
                            width={20}
                            height={20}
                            className="object-contain"
                          />
                          <h3 className="font-semibold text-sm">{league}</h3>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {teams.map((team) => (
                            <button
                              key={team.id}
                              onClick={() => handleAddFavorite(team.id)}
                              disabled={isAddingFavorite || favoriteTeams.some(t => t.id === team.id)}
                              className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-lg p-3 hover:border-red-500/30 transition-all duration-300 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                              <div className="relative h-10 w-10 flex-shrink-0">
                                <Image
                                  src={team.logo}
                                  alt={team.name}
                                  width={40}
                                  height={40}
                                  className="object-contain"
                                />
                              </div>
                              <div className="flex-1 text-left">
                                <div className="font-medium text-sm">{team.name}</div>
                              </div>
                              <Plus className="h-4 w-4 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>

      <Tabs defaultValue="matches" className="w-full">
        <TabsList className="mb-6 bg-zinc-900/50 p-1">
          <TabsTrigger value="matches" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            Favorite Matches
          </TabsTrigger>
          <TabsTrigger value="live" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            Live Now
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            Upcoming
          </TabsTrigger>
        </TabsList>

        <TabsContent value="matches" className="space-y-6 mt-0">
          {loading ? (
            <LoadingSpinner />
          ) : favoriteTeams.length > 0 ? (
            <UpcomingMatches />
          ) : (
            <div className="text-center py-12 space-y-4">
              <Star className="h-12 w-12 text-zinc-700 mx-auto" />
              <div className="text-xl font-medium">No favorite matches yet</div>
              <p className="text-zinc-400 max-w-md mx-auto">
                Add teams to your favorites to see their upcoming matches here
              </p>
              <Button className="bg-red-600 hover:bg-red-700 text-white mt-2">Browse Teams</Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="live" className="space-y-6 mt-0">
          {loading ? <LoadingSpinner /> : <LiveMatches />}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-6 mt-0">
          {loading ? <LoadingSpinner /> : <UpcomingMatches />}
        </TabsContent>
      </Tabs>
    </div>
  )
}

