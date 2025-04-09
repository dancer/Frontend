import { Suspense } from "react";
import { notFound } from "next/navigation";
import UpcomingMatches from "@/components/upcoming-matches";
import LiveMatches from "@/components/live-matches";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoadingSpinner from "@/components/loading-spinner";
import Image from "next/image";

export default function LeaguePage({ params }: { params: { league: string } }) {
  const leagueInfo = getLeagueInfo(params.league);

  if (!leagueInfo) {
    notFound();
  }

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8 bg-gradient-to-b from-zinc-950 to-black">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative h-16 w-16">
          <Image
            src={leagueInfo.logo || "/placeholder.svg"}
            alt={leagueInfo.name}
            width={64}
            height={64}
            className="object-contain"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{leagueInfo.name}</h1>
          <p className="text-zinc-400">
            {leagueInfo.region} • {leagueInfo.season}
          </p>
        </div>
      </div>

      <Tabs defaultValue="matches" className="w-full">
        <TabsList className="mb-6 bg-zinc-900/50 p-1">
          <TabsTrigger
            value="matches"
            className="data-[state=active]:bg-red-600 data-[state=active]:text-white"
          >
            Matches
          </TabsTrigger>
          <TabsTrigger
            value="live"
            className="data-[state=active]:bg-red-600 data-[state=active]:text-white"
          >
            Live
          </TabsTrigger>
          <TabsTrigger
            value="standings"
            className="data-[state=active]:bg-red-600 data-[state=active]:text-white"
          >
            Standings
          </TabsTrigger>
          <TabsTrigger
            value="stats"
            className="data-[state=active]:bg-red-600 data-[state=active]:text-white"
          >
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

        <TabsContent value="standings" className="space-y-6 mt-0">
          <div className="text-center py-8 text-zinc-400">
            Standings will be available soon
          </div>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6 mt-0">
          <div className="text-center py-8 text-zinc-400">
            Statistics will be available soon
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function getLeagueInfo(slug: string) {
  const leagues: Record<
    string,
    { name: string; region: string; season: string; logo: string }
  > = {
    "premier-league": {
      name: "Premier League",
      region: "England",
      season: "2023/24",
      logo: "https://media.api-sports.io/football/leagues/39.png",
    },
    "la-liga": {
      name: "La Liga",
      region: "Spain",
      season: "2023/24",
      logo: "https://media.api-sports.io/football/leagues/140.png",
    },
    bundesliga: {
      name: "Bundesliga",
      region: "Germany",
      season: "2023/24",
      logo: "https://media.api-sports.io/football/leagues/78.png",
    },
    "serie-a": {
      name: "Serie A",
      region: "Italy",
      season: "2023/24",
      logo: "https://media.api-sports.io/football/leagues/135.png",
    },
    "ligue-1": {
      name: "Ligue 1",
      region: "France",
      season: "2023/24",
      logo: "https://media.api-sports.io/football/leagues/61.png",
    },
    "champions-league": {
      name: "UEFA Champions League",
      region: "Europe",
      season: "2023/24",
      logo: "https://media.api-sports.io/football/leagues/2.png",
    },
  };

  return leagues[slug] || null;
}
