import { Suspense } from "react"
import FootballLeagues from "@/components/football-leagues"
import UpcomingMatches from "@/components/upcoming-matches"
import LiveMatches from "@/components/live-matches"
import TopTournaments from "@/components/top-tournaments"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LoadingSpinner from "@/components/loading-spinner"
import FeaturedMatch from "@/components/featured-match"

export default function Home() {
  return (
    <div className="flex-1 space-y-8 p-6 md:p-8 bg-gradient-to-b from-zinc-950 to-black">
      <FeaturedMatch />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
            Top Leagues
          </h2>
          <span className="text-xs text-zinc-500 px-2 py-1 bg-zinc-900/50 rounded-full">ELITE FOOTBALL</span>
        </div>
        <Suspense fallback={<LoadingSpinner />}>
          <FootballLeagues />
        </Suspense>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6 bg-zinc-900/50 p-1">
          <TabsTrigger value="all" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            All Matches
          </TabsTrigger>
          <TabsTrigger value="live" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            Live Now
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            Today's Matches
          </TabsTrigger>
          <TabsTrigger value="tournaments" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            Tournaments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6 mt-0">
          <Suspense fallback={<LoadingSpinner />}>
            <UpcomingMatches />
          </Suspense>
        </TabsContent>

        <TabsContent value="live" className="space-y-6 mt-0">
          <Suspense fallback={<LoadingSpinner />}>
            <LiveMatches />
          </Suspense>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-6 mt-0">
          <Suspense fallback={<LoadingSpinner />}>
            <UpcomingMatches />
          </Suspense>
        </TabsContent>

        <TabsContent value="tournaments" className="space-y-6 mt-0">
          <Suspense fallback={<LoadingSpinner />}>
            <TopTournaments />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}

