"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

type SportCategory = {
  id: number
  name: string
  count: number
  image: string
  slug: string
}

export default function SportsCategories() {
  const [categories, setCategories] = useState<SportCategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // This would be replaced with your actual API call
    const fetchCategories = async () => {
      try {
        // Simulating API call
        // Replace with: const response = await fetch('/api/sports-categories')
        // const data = await response.json()

        // Mock data
        const mockData = [
          { id: 1, name: "SOCCER", count: 230, image: "/placeholder.svg?height=80&width=80", slug: "soccer" },
          { id: 2, name: "CRICKET", count: 218, image: "/placeholder.svg?height=80&width=80", slug: "cricket" },
          { id: 3, name: "TENNIS", count: 35, image: "/placeholder.svg?height=80&width=80", slug: "tennis" },
          { id: 4, name: "RACING", count: 16, image: "/placeholder.svg?height=80&width=80", slug: "racing" },
          { id: 5, name: "BOXING", count: 21, image: "/placeholder.svg?height=80&width=80", slug: "boxing" },
          { id: 6, name: "RUGBY", count: 27, image: "/placeholder.svg?height=80&width=80", slug: "rugby" },
        ]

        setCategories(mockData)
        setLoading(false)
      } catch (error) {
        console.error("Failed to fetch sports categories:", error)
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-zinc-800 rounded-lg h-40 animate-pulse"></div>
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category) => (
          <Link
            href={`/sports/${category.slug}`}
            key={category.id}
            className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-900 h-40"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="font-bold text-white">{category.name}</div>
              <div className="text-xs text-zinc-400">{category.count}</div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <Image
                src={category.image || "/placeholder.svg"}
                alt={category.name}
                width={80}
                height={80}
                className="object-contain opacity-70 group-hover:opacity-100 transition-opacity"
              />
            </div>
          </Link>
        ))}
      </div>

      <div className="flex justify-end mt-2">
        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-400 hover:bg-zinc-800">
          See all <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

