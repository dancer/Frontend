"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

type League = {
  id: number
  name: string
  count: number
  image: string
  slug: string
}

export default function FootballLeagues() {
  const [leagues, setLeagues] = useState<League[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // This would be replaced with your actual API call
    const fetchLeagues = async () => {
      try {
        // Simulating API call
        // Replace with: const response = await fetch('/api/football/leagues')
        // const data = await response.json()

        // Mock data
        const mockData = [
          {
            id: 1,
            name: "PREMIER LEAGUE",
            count: 230,
            image: "/placeholder.svg?height=80&width=80",
            slug: "premier-league",
          },
          { id: 2, name: "LA LIGA", count: 218, image: "/placeholder.svg?height=80&width=80", slug: "la-liga" },
          { id: 3, name: "BUNDESLIGA", count: 185, image: "/placeholder.svg?height=80&width=80", slug: "bundesliga" },
          { id: 4, name: "SERIE A", count: 176, image: "/placeholder.svg?height=80&width=80", slug: "serie-a" },
          { id: 5, name: "LIGUE 1", count: 161, image: "/placeholder.svg?height=80&width=80", slug: "ligue-1" },
          {
            id: 6,
            name: "CHAMPIONS LEAGUE",
            count: 127,
            image: "/placeholder.svg?height=80&width=80",
            slug: "champions-league",
          },
        ]

        setLeagues(mockData)
        setLoading(false)
      } catch (error) {
        console.error("Failed to fetch football leagues:", error)
        setLoading(false)
      }
    }

    fetchLeagues()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-zinc-800/30 rounded-lg h-40 animate-pulse"></div>
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {leagues.map((league) => (
          <Link
            href={`/leagues/${league.slug}`}
            key={league.id}
            className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 h-40 backdrop-blur-sm border border-zinc-800/30 hover:border-red-500/30 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="font-bold text-white group-hover:text-red-400 transition-colors duration-300">
                {league.name}
              </div>
              <div className="text-xs text-zinc-400">{league.count} matches</div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform transition-transform duration-300 group-hover:scale-110">
              <Image
                src={league.image || "/placeholder.svg"}
                alt={league.name}
                width={80}
                height={80}
                className="object-contain opacity-70 group-hover:opacity-100 transition-opacity"
              />
            </div>
          </Link>
        ))}
      </div>

      <div className="flex justify-end mt-2">
        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-400 hover:bg-zinc-800/50 group">
          See all leagues <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
        </Button>
      </div>
    </div>
  )
}

