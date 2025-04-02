"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UpcomingMatches from "@/components/upcoming-matches"
import { Button } from "@/components/ui/button"
import { Calendar, ChevronDown, Filter } from "lucide-react"

export default function UpcomingPage() {
  const [loading, setLoading] = useState(true)
  const [matchCount, setMatchCount] = useState(0)
  const [selectedDate, setSelectedDate] = useState("today")

  const handleMatchesLoaded = (count: number) => {
    setMatchCount(count)
    setLoading(false)
  }

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8 bg-gradient-to-b from-zinc-950 to-black">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
            Upcoming Matches
          </h1>
          <div className="bg-zinc-800 text-white text-xs px-2 py-1 rounded-full">
            {loading ? "..." : matchCount} MATCHES
          </div>
        </div>
        <p className="text-zinc-400">Browse and bet on upcoming football matches</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { label: "Today", value: "today" },
          { label: "Tomorrow", value: "tomorrow" },
          { label: "This Week", value: "week" },
          { label: "This Month", value: "month" }
        ].map(({ label, value }) => (
          <Button
            key={value}
            variant={selectedDate === value ? "default" : "outline"}
            size="sm"
            className={
              selectedDate === value
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-700"
            }
            onClick={() => setSelectedDate(value)}
          >
            {label}
          </Button>
        ))}
        <Button variant="outline" size="sm" className="bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-700 ml-auto">
          <Calendar className="h-4 w-4 mr-1" /> Calendar
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6 bg-zinc-900/50 p-1">
          <TabsTrigger value="all" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            All Matches
          </TabsTrigger>
          <TabsTrigger value="top" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            Top Leagues
          </TabsTrigger>
          <TabsTrigger value="featured" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            Featured
          </TabsTrigger>
        </TabsList>

        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            size="sm"
            className="bg-zinc-800/50 border-zinc-700/50 flex items-center gap-1 mr-2"
          >
            <Filter className="h-4 w-4" /> Filters
          </Button>
          <Button variant="outline" size="sm" className="bg-zinc-800/50 border-zinc-700/50 flex items-center gap-1">
            Sort by: Time <ChevronDown className="h-4 w-4" />
          </Button>
        </div>

        <TabsContent value="all" className="space-y-6 mt-0">
          <UpcomingMatches onMatchesLoaded={handleMatchesLoaded} date={selectedDate} />
        </TabsContent>

        <TabsContent value="top" className="space-y-6 mt-0">
          <UpcomingMatches onMatchesLoaded={handleMatchesLoaded} date={selectedDate} />
        </TabsContent>

        <TabsContent value="featured" className="space-y-6 mt-0">
          <UpcomingMatches onMatchesLoaded={handleMatchesLoaded} date={selectedDate} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

