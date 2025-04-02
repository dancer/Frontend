import { Suspense } from "react"
import { notFound } from "next/navigation"
import UpcomingMatches from "@/components/upcoming-matches"
import LiveMatches from "@/components/live-matches"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LoadingSpinner from "@/components/loading-spinner"
import Image from "next/image"
import TournamentBracket from "@/components/tournament-bracket"
import TournamentStats from "@/components/tournament-stats"

export default function TournamentPage({ params }: { params: { tournament: string } }) {
  const tournamentInfo = getTournamentInfo(params.tournament)

  if (!tournamentInfo) {
    notFound()
  }

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8 bg-gradient-to-b from-zinc-950 to-black">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative h-16 w-16">
          <Image
            src={tournamentInfo.logo || "/placeholder.svg"}
            alt={tournamentInfo.name}
            width={64}
            height={64}
            className="object-contain"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{tournamentInfo.name}</h1>
          <p className="text-zinc-400">
            {tournamentInfo.region} • {tournamentInfo.season}
          </p>
        </div>
      </div>

      <Tabs defaultValue="matches" className="w-full">
        <TabsList className="mb-6 bg-zinc-900/50 p-1">
          <TabsTrigger value="matches" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            Matches
          </TabsTrigger>
          <TabsTrigger value="live" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            Live
          </TabsTrigger>
          <TabsTrigger value="bracket" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            Bracket
          </TabsTrigger>
          <TabsTrigger value="stats" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            Stats
          </TabsTrigger>
        </TabsList>

        <TabsContent value="matches" className="space-y-6 mt-0">
          <Suspense fallback={<LoadingSpinner />}>
            <UpcomingMatches />
          </Suspense>
        </TabsContent>

        <TabsContent value="live" className="space-y-6 mt-0">
          <Suspense fallback={<LoadingSpinner />}>
            <LiveMatches />
          </Suspense>
        </TabsContent>

        <TabsContent value="bracket" className="space-y-6 mt-0">
          <Suspense fallback={<LoadingSpinner />}>
            <TournamentBracket tournamentId={params.tournament} />
          </Suspense>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6 mt-0">
          <Suspense fallback={<LoadingSpinner />}>
            <TournamentStats tournamentId={params.tournament} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function getTournamentInfo(slug: string) {
  const tournaments: Record<string, { name: string; region: string; season: string; logo: string }> = {
    ucl: {
      name: "UEFA Champions League",
      region: "Europe",
      season: "2023/24",
      logo: "/placeholder.svg?height=64&width=64",
    },
    uel: {
      name: "UEFA Europa League",
      region: "Europe",
      season: "2023/24",
      logo: "/placeholder.svg?height=64&width=64",
    },
    "world-cup": {
      name: "FIFA World Cup",
      region: "International",
      season: "2026",
      logo: "/placeholder.svg?height=64&width=64",
    },
    euro: {
      name: "UEFA European Championship",
      region: "Europe",
      season: "2024",
      logo: "/placeholder.svg?height=64&width=64",
    },
    "copa-america": {
      name: "Copa America",
      region: "South America",
      season: "2024",
      logo: "/placeholder.svg?height=64&width=64",
    },
  }

  return tournaments[slug] || null
}

