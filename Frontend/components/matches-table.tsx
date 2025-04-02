import Image from "next/image"

export default function MatchesTable() {
  const matches = [
    {
      time: "9:00",
      status: "LIVE",
      team1: {
        name: "Manchester City",
        logo: "/placeholder.svg?height=24&width=24",
      },
      team2: {
        name: "Inter Milan",
        logo: "/placeholder.svg?height=24&width=24",
      },
      score: "2 : 1",
      odds: {
        "1X": "1.63",
        X2: "2.13",
        "12": "1.82",
      },
    },
    {
      time: "9:30",
      status: "LIVE",
      team1: {
        name: "Borussia Dortmund",
        logo: "/placeholder.svg?height=24&width=24",
      },
      team2: {
        name: "Manchester United",
        logo: "/placeholder.svg?height=24&width=24",
      },
      score: "0 : 1",
      odds: {
        "1X": "1.22",
        X2: "1.74",
        "12": "2.61",
      },
    },
    {
      time: "8:45",
      status: "Today",
      team1: {
        name: "Schalke 04",
        logo: "/placeholder.svg?height=24&width=24",
      },
      team2: {
        name: "Atletico Madrid",
        logo: "/placeholder.svg?height=24&width=24",
      },
      score: "- : -",
      odds: {
        "1X": "5.37",
        X2: "1.10",
        "12": "1.80",
      },
    },
    {
      time: "11:45",
      status: "Today",
      team1: {
        name: "Chelsea",
        logo: "/placeholder.svg?height=24&width=24",
      },
      team2: {
        name: "Bayern Munich",
        logo: "/placeholder.svg?height=24&width=24",
      },
      score: "- : -",
      odds: {
        "1X": "1.43",
        X2: "2.80",
        "12": "1.73",
      },
    },
    {
      time: "12:00",
      status: "Today",
      team1: {
        name: "Barcelona",
        logo: "/placeholder.svg?height=24&width=24",
      },
      team2: {
        name: "Arsenal",
        logo: "/placeholder.svg?height=24&width=24",
      },
      score: "- : -",
      odds: {
        "1X": "3.63",
        X2: "1.13",
        "12": "2.82",
      },
    },
  ]

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-zinc-400 border-b border-zinc-700">
            <th className="text-left py-2 font-medium">Date</th>
            <th className="text-left py-2 font-medium">Match</th>
            <th className="text-center py-2 font-medium">1X</th>
            <th className="text-center py-2 font-medium">X</th>
            <th className="text-center py-2 font-medium">X2</th>
          </tr>
        </thead>
        <tbody>
          {matches.map((match, index) => (
            <tr key={index} className="border-b border-zinc-700 hover:bg-zinc-700/50">
              <td className="py-3">
                <div>{match.time}</div>
                <div className={`text-xs ${match.status === "LIVE" ? "text-red-500" : "text-zinc-400"}`}>
                  {match.status}
                </div>
              </td>
              <td className="py-3">
                <div className="flex items-center gap-2 mb-1">
                  <Image
                    src={match.team1.logo || "/placeholder.svg"}
                    alt={match.team1.name}
                    width={20}
                    height={20}
                    className="object-contain"
                  />
                  <span>{match.team1.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Image
                    src={match.team2.logo || "/placeholder.svg"}
                    alt={match.team2.name}
                    width={20}
                    height={20}
                    className="object-contain"
                  />
                  <span>{match.team2.name}</span>
                </div>
              </td>
              <td className="text-center">
                <button className="bg-zinc-700 hover:bg-zinc-600 rounded py-1 px-2 min-w-[40px]">
                  {match.odds["1X"]}
                </button>
              </td>
              <td className="text-center">
                <div className="text-center font-medium">{match.score}</div>
              </td>
              <td className="text-center">
                <button className="bg-zinc-700 hover:bg-zinc-600 rounded py-1 px-2 min-w-[40px]">
                  {match.odds["X2"]}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

