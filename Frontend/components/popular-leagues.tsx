"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

type League = {
  id: string
  name: string
  logo: string
  region: string
  matchCount: number
}

export default function PopularLeagues() {
  const [leagues, setLeagues] = useState<League[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // This would be replaced with your actual API call
    const fetchLeagues = async () => {
      try {
        // Simulating API call
        // Replace with: const response = await fetch('/api/leagues/popular')
        // const data = await response.json()

        // Mock data
        const mockData = [
          {
            id: "pl",
            name: "Premier League",
            logo: "/placeholder.svg?height=40&width=40",
            region: "England",
            matchCount: 31,
          },
          {
            id: "laliga",
            name: "La Liga",
            logo: "/placeholder.svg?height=40&width=40",
            region: "Spain",
            matchCount: 29,
          },
          {
            id: "seriea",
            name: "Serie A",
            logo: "/placeholder.svg?height=40&width=40",
            region: "Italy",
            matchCount: 18,
          },
          {
            id: "bundesliga",
            name: "Bundesliga",
            logo: "/placeholder.svg?height=40&width=40",
            region: "Germany",
            matchCount: 11,
          },
          {
            id: "ligue1",
            name: "Ligue 1",
            logo: "/placeholder.svg?height=40&width=40",
            region: "France",
            matchCount: 23,
          },
        ]

        setLeagues(mockData)
        setLoading(false)
      } catch (error) {
        console.error("Failed to fetch popular leagues:", error)
        setLoading(false)
      }
    }

    fetchLeagues()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-zinc-800 rounded-lg h-16 animate-pulse"></div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {leagues.map((league) => (
        <Link
          href={`/leagues/${league.id}`}
          key={league.id}
          className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Image
              src={league.logo || "/placeholder.svg"}
              alt={league.name}
              width={40}
              height={40}
              className="object-contain"
            />
            <div>
              <div className="font-medium">{league.name}</div>
              <div className="text-xs text-zinc-400">{league.region}</div>
            </div>
          </div>
          <div className="bg-zinc-800 px-3 py-1 rounded text-sm">{league.matchCount}</div>
        </Link>
      ))}
    </div>
  )
}

