import { Match } from "@/services/leagues"
import { formatDistanceToNow, parseISO } from "date-fns"
import { Button } from "./ui/button"
import { useBettingSlip } from "@/context/betting-slip-context"

interface MatchCardProps {
  match: Match
}

export default function MatchCard({ match }: MatchCardProps) {
  const { addBet } = useBettingSlip()

  const isLive = match.status === "Live"
  const isFinished = match.status === "Finished"
  const isScheduled = match.status === "Scheduled"

  return (
    <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <img src={match.league.logo} alt={match.league.name} className="h-6 w-6" />
          <span className="text-sm text-zinc-400">{match.league.name}</span>
        </div>
        <div className="flex items-center space-x-2">
          {isLive && (
            <>
              <span className="animate-pulse h-2 w-2 bg-red-500 rounded-full"></span>
              <span className="text-red-500 text-sm font-medium">{match.minute}&apos;</span>
            </>
          )}
          {isScheduled && (
            <span className="text-zinc-400 text-sm">
              {formatDistanceToNow(parseISO(match.kickoffTime), { addSuffix: true })}
            </span>
          )}
          {isFinished && (
            <span className="text-zinc-400 text-sm">FT</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4 items-center mb-4">
        <div className="col-span-3 flex items-center space-x-3">
          <img src={match.homeTeamLogo} alt={match.homeTeamName} className="h-8 w-8" />
          <span className="font-medium truncate">{match.homeTeamName}</span>
        </div>
        <div className="col-span-1 text-center">
          {(isLive || isFinished) ? (
            <div className="text-lg font-bold">
              {match.homeTeamScore} - {match.awayTeamScore}
            </div>
          ) : (
            <div className="text-sm text-zinc-400">vs</div>
          )}
        </div>
        <div className="col-span-3 flex items-center space-x-3 justify-end">
          <span className="font-medium truncate">{match.awayTeamName}</span>
          <img src={match.awayTeamLogo} alt={match.awayTeamName} className="h-8 w-8" />
        </div>
      </div>

      {!isFinished && (
        <div className="grid grid-cols-3 gap-3">
          <Button
            variant="outline"
            className="bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-700"
            onClick={() => addBet({
              matchId: match.id,
              type: "1",
              odds: match.homeWinOdds,
              homeTeam: match.homeTeamName,
              awayTeam: match.awayTeamName
            })}
          >
            1 <span className="ml-2 text-zinc-400">{match.homeWinOdds}</span>
          </Button>
          <Button
            variant="outline"
            className="bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-700"
            onClick={() => addBet({
              matchId: match.id,
              type: "X",
              odds: match.drawOdds,
              homeTeam: match.homeTeamName,
              awayTeam: match.awayTeamName
            })}
          >
            X <span className="ml-2 text-zinc-400">{match.drawOdds}</span>
          </Button>
          <Button
            variant="outline"
            className="bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-700"
            onClick={() => addBet({
              matchId: match.id,
              type: "2",
              odds: match.awayWinOdds,
              homeTeam: match.homeTeamName,
              awayTeam: match.awayTeamName
            })}
          >
            2 <span className="ml-2 text-zinc-400">{match.awayWinOdds}</span>
          </Button>
        </div>
      )}
    </div>
  )
}

