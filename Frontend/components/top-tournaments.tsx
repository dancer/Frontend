"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trophy } from "lucide-react";

type Tournament = {
  id: string;
  name: string;
  logo: string;
  region: string;
  matchCount: number;
  teams: string[];
};

export default function TopTournaments() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This would be replaced with your actual API call
    const fetchTournaments = async () => {
      try {
        // Simulating API call
        // Replace with: const response = await fetch('/api/tournaments/top')
        // const data = await response.json()

        // Mock data with real logos
        const mockData = [
          {
            id: "ucl",
            name: "UEFA Champions League",
            logo: "https://media.api-sports.io/football/leagues/2.png",
            region: "Europe",
            matchCount: 31,
            teams: ["Real Madrid", "Manchester City", "Bayern Munich", "PSG"],
          },
          {
            id: "pl",
            name: "Premier League",
            logo: "https://media.api-sports.io/football/leagues/39.png",
            region: "England",
            matchCount: 29,
            teams: ["Manchester United", "Liverpool", "Arsenal", "Chelsea"],
          },
          {
            id: "laliga",
            name: "La Liga",
            logo: "https://media.api-sports.io/football/leagues/140.png",
            region: "Spain",
            matchCount: 28,
            teams: ["Barcelona", "Real Madrid", "Atletico Madrid", "Sevilla"],
          },
          {
            id: "bundesliga",
            name: "Bundesliga",
            logo: "https://media.api-sports.io/football/leagues/78.png",
            region: "Germany",
            matchCount: 27,
            teams: [
              "Bayern Munich",
              "Borussia Dortmund",
              "RB Leipzig",
              "Bayer Leverkusen",
            ],
          },
          {
            id: "seriea",
            name: "Serie A",
            logo: "https://media.api-sports.io/football/leagues/135.png",
            region: "Italy",
            matchCount: 26,
            teams: ["AC Milan", "Inter Milan", "Juventus", "Napoli"],
          },
        ];

        setTournaments(mockData);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch tournaments:", error);
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="bg-zinc-800/30 rounded-lg h-24 animate-pulse"
          ></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tournaments.map((tournament) => (
        <Link
          href={`/tournaments/${tournament.id}`}
          key={tournament.id}
          className="flex flex-col p-4 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-lg hover:border-red-500/30 hover:bg-zinc-800/30 transition-all duration-300"
        >
          <div className="flex items-center gap-3 mb-3">
            <Image
              src={tournament.logo || "/placeholder.svg"}
              alt={tournament.name}
              width={40}
              height={40}
              className="object-contain"
            />
            <div>
              <div className="font-medium flex items-center gap-2">
                {tournament.name}
                {tournament.id === "ucl" && (
                  <Trophy className="h-4 w-4 text-yellow-500" />
                )}
              </div>
              <div className="text-xs text-zinc-400">
                {tournament.region} • {tournament.matchCount} matches
              </div>
            </div>
            <div className="ml-auto bg-zinc-800/70 px-3 py-1 rounded-full text-sm">
              {tournament.matchCount}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {tournament.teams.map((team, index) => (
              <span
                key={index}
                className="text-xs bg-zinc-800/50 px-2 py-1 rounded-full text-zinc-400"
              >
                {team}
              </span>
            ))}
          </div>
        </Link>
      ))}
    </div>
  );
}
