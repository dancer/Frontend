import { Suspense } from "react"
import { notFound } from "next/navigation"
import UpcomingMatches from "@/components/upcoming-matches"
import LiveMatches from "@/components/live-matches"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LoadingSpinner from "@/components/loading-spinner"

export default function SportPage({ params }: { params: { sport: string } }) {
  const sportName = getSportName(params.sport)

  if (!sportName) {
    notFound()
  }

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">{sportName}</h1>
        <p className="text-zinc-400">Browse all {sportName.toLowerCase()} matches and tournaments</p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Games</TabsTrigger>
          <TabsTrigger value="live">Live</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="tournaments">Tournaments</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <Suspense fallback={<LoadingSpinner />}>
            <UpcomingMatches />
          </Suspense>
        </TabsContent>

        <TabsContent value="live" className="space-y-6">
          <Suspense fallback={<LoadingSpinner />}>
            <LiveMatches />
          </Suspense>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-6">
          <Suspense fallback={<LoadingSpinner />}>
            <UpcomingMatches />
          </Suspense>
        </TabsContent>

        <TabsContent value="tournaments" className="space-y-6">
          <div className="text-center py-8 text-zinc-400">No tournaments available at the moment</div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function getSportName(slug: string): string | null {
  const sports: Record<string, string> = {
    soccer: "Soccer",
    football: "Football",
    cricket: "Cricket",
    tennis: "Tennis",
    basketball: "Basketball",
    rugby: "Rugby",
    boxing: "Boxing",
    racing: "Racing",
    volleyball: "Volleyball",
  }

  return sports[slug] || null
}

