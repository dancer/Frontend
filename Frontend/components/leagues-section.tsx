import Image from "next/image"

export default function LeaguesSection() {
  const leagues = [
    {
      name: "Premier League",
      logo: "/placeholder.svg?height=32&width=32",
      teams: "Manchester United",
      matches: 31,
    },
    {
      name: "La Liga",
      logo: "/placeholder.svg?height=32&width=32",
      teams: "Real Madrid",
      matches: 29,
    },
    {
      name: "Serie A",
      logo: "/placeholder.svg?height=32&width=32",
      teams: "AC Milan",
      matches: 18,
    },
    {
      name: "League 1",
      logo: "/placeholder.svg?height=32&width=32",
      teams: "PSG",
      matches: 23,
    },
    {
      name: "Bundesliga",
      logo: "/placeholder.svg?height=32&width=32",
      teams: "Bayern Munich",
      matches: 11,
    },
  ]

  return (
    <div className="bg-zinc-800 rounded-lg p-4">
      <h2 className="text-lg font-bold mb-4">Top 5 Leagues</h2>

      <div className="space-y-4">
        {leagues.map((league, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src={league.logo || "/placeholder.svg"}
                alt={league.name}
                width={32}
                height={32}
                className="object-contain"
              />
              <div>
                <div className="font-medium">{league.name}</div>
                <div className="text-xs text-zinc-400">{league.teams}</div>
              </div>
            </div>
            <div className="bg-zinc-700 px-2 py-1 rounded text-sm">{league.matches}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

