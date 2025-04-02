"use client"

import { useState, useEffect } from "react"
import LoadingSpinner from "@/components/loading-spinner"

type MatchStatistics = {
  team1: {
    possession: number
    shots: number
    shotsOnTarget: number
    corners: number
    fouls: number
    yellowCards: number
    redCards: number
    offsides: number
    passes: number
    passAccuracy: number
  }
  team2: {
    possession: number
    shots: number
    shotsOnTarget: number
    corners: number
    fouls: number
    yellowCards: number
    redCards: number
    offsides: number
    passes: number
    passAccuracy: number
  }
}

export default function MatchStats({ matchId }: { matchId: string }) {
  const [stats, setStats] = useState<MatchStatistics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // This would be replaced with your actual API call
    const fetchMatchStats = async () => {
      try {
        // Simulating API call
        // Replace with: const response = await fetch(`/api/matches/${matchId}/stats`)
        // const data = await response.json()

        // Mock data
        const mockData = {
          team1: {
            possession: 58,
            shots: 15,
            shotsOnTarget: 7,
            corners: 8,
            fouls: 10,
            yellowCards: 2,
            redCards: 0,
            offsides: 3,
            passes: 542,
            passAccuracy: 89,
          },
          team2: {
            possession: 42,
            shots: 9,
            shotsOnTarget: 4,
            corners: 4,
            fouls: 14,
            yellowCards: 3,
            redCards: 0,
            offsides: 2,
            passes: 398,
            passAccuracy: 82,
          },
        }

        setStats(mockData)
        setLoading(false)
      } catch (error) {
        console.error("Failed to fetch match statistics:", error)
        setLoading(false)
      }
    }

    fetchMatchStats()
  }, [matchId])

  if (loading) {
    return <LoadingSpinner />
  }

  if (!stats) {
    return <div className="text-center py-8 text-zinc-400">No statistics available for this match</div>
  }

  const statItems = [
    { label: "Possession", value1: `${stats.team1.possession}%`, value2: `${stats.team2.possession}%`, type: "bar" },
    { label: "Shots", value1: stats.team1.shots, value2: stats.team2.shots, type: "bar" },
    { label: "Shots on Target", value1: stats.team1.shotsOnTarget, value2: stats.team2.shotsOnTarget, type: "bar" },
    { label: "Corners", value1: stats.team1.corners, value2: stats.team2.corners, type: "bar" },
    { label: "Fouls", value1: stats.team1.fouls, value2: stats.team2.fouls, type: "bar" },
    { label: "Yellow Cards", value1: stats.team1.yellowCards, value2: stats.team2.yellowCards, type: "bar" },
    { label: "Red Cards", value1: stats.team1.redCards, value2: stats.team2.redCards, type: "bar" },
    { label: "Offsides", value1: stats.team1.offsides, value2: stats.team2.offsides, type: "bar" },
    { label: "Passes", value1: stats.team1.passes, value2: stats.team2.passes, type: "bar" },
    {
      label: "Pass Accuracy",
      value1: `${stats.team1.passAccuracy}%`,
      value2: `${stats.team2.passAccuracy}%`,
      type: "bar",
    },
  ]

  return (
    <div className="space-y-4">
      {statItems.map((item, index) => (
        <div key={index} className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="text-right font-medium">{item.value1}</div>
            <div className="text-center text-sm text-zinc-400 px-4">{item.label}</div>
            <div className="text-left font-medium">{item.value2}</div>
          </div>

          <div className="flex h-2 bg-zinc-800 rounded-full overflow-hidden">
            {item.type === "bar" && (
              <>
                <div
                  className="bg-red-600 h-full"
                  style={{
                    width: `${
                      typeof item.value1 === "string"
                        ? Number.parseInt(item.value1)
                        : (
                            item.value1 /
                              (item.value1 +
                                (typeof item.value2 === "string" ? Number.parseInt(item.value2) : item.value2))
                          ) * 100
                    }%`,
                  }}
                ></div>
                <div
                  className="bg-blue-600 h-full"
                  style={{
                    width: `${
                      typeof item.value2 === "string"
                        ? Number.parseInt(item.value2)
                        : (
                            item.value2 /
                              (item.value2 +
                                (typeof item.value1 === "string" ? Number.parseInt(item.value1) : item.value1))
                          ) * 100
                    }%`,
                  }}
                ></div>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

