"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import LoadingSpinner from "@/components/loading-spinner"
import { getUserBets, cashoutBet } from "@/services/api"
import { useToast } from "@/components/ui/use-toast"
import type { BetData } from "@/services/api"
import { useAuth } from "@/context/auth-context"

export default function MyBetsPage() {
  const [bets, setBets] = useState<BetData[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchBets = async () => {
    try {
      setLoading(true)
      const data = await getUserBets()
      setBets(data)
    } catch (error) {
      console.error("Failed to fetch bets:", error)
      toast({
        title: "Error",
        description: "Failed to load your bets. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBets()
  }, [toast])

  const activeBets = bets.filter((bet) => bet.status === "active")
  const settledBets = bets.filter((bet) => bet.status !== "active")

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8 bg-gradient-to-b from-zinc-950 to-black">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
          My Bets
        </h1>
        <p className="text-zinc-400">View and manage your betting history</p>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="mb-6 bg-zinc-900/50 p-1">
          <TabsTrigger value="active" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            Active ({activeBets.length})
          </TabsTrigger>
          <TabsTrigger value="settled" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            Settled ({settledBets.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6 mt-0">
          {loading ? (
            <LoadingSpinner />
          ) : activeBets.length > 0 ? (
            <div className="space-y-4">
              {activeBets.map((bet) => (
                <BetCard
                  key={bet.id}
                  bet={bet}
                  onStatusChange={() => fetchBets()}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-zinc-400">You don't have any active bets</div>
          )}
        </TabsContent>

        <TabsContent value="settled" className="space-y-6 mt-0">
          {loading ? (
            <LoadingSpinner />
          ) : settledBets.length > 0 ? (
            <div className="space-y-4">
              {settledBets.map((bet) => (
                <BetCard
                  key={bet.id}
                  bet={bet}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-zinc-400">You don't have any settled bets</div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface BetCardProps {
  bet: BetData
  onStatusChange?: () => void
}

function BetCard({ bet, onStatusChange }: BetCardProps) {
  const { toast } = useToast()
  const { refreshUser } = useAuth()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleCashout = async () => {
    try {
      setIsProcessing(true)
      await cashoutBet(bet.id)

      // Refresh user data to update balance
      await refreshUser()

      toast({
        title: "Success",
        description: "Bet cashed out successfully!",
      })

      // Trigger parent component to refresh bets
      onStatusChange?.()
    } catch (error) {
      console.error("Failed to cashout bet:", error)
      toast({
        title: "Error",
        description: "Failed to cashout bet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-lg overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="text-xs text-zinc-400">{new Date(bet.createdAt).toLocaleString()}</div>
          <div
            className={`text-xs px-2 py-0.5 rounded-full ${bet.status === "active"
              ? "bg-blue-600 text-white"
              : bet.status === "won"
                ? "bg-green-600 text-white"
                : bet.status === "lost"
                  ? "bg-red-600 text-white"
                  : "bg-yellow-600 text-white"
              }`}
          >
            {bet.status.toUpperCase()}
          </div>
        </div>

        <div className="mb-3">
          <div className="font-medium mb-1">{bet.matchName}</div>
          <div className="text-sm">
            Selection: <span className="text-red-500">{bet.selection}</span>
          </div>
          {bet.settledAt && (
            <div className="text-sm text-zinc-400">
              Settled: {new Date(bet.settledAt).toLocaleString()}
            </div>
          )}
        </div>

        <div className="flex justify-between text-sm">
          <div>
            <div className="text-zinc-400">Stake</div>
            <div>{bet.stake.toFixed(2)} coins</div>
          </div>
          <div>
            <div className="text-zinc-400">Odds</div>
            <div>{bet.odds.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-zinc-400">Potential Win</div>
            <div className="text-red-500">{bet.potentialWin?.toFixed(2) || "0.00"} coins</div>
          </div>
        </div>

        {bet.status === "active" && !bet.isLive && (
          <div className="mt-4 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCashout}
              disabled={isProcessing}
              className="bg-zinc-800/50 border-zinc-700/50 hover:bg-red-600 hover:text-white hover:border-red-600"
            >
              {isProcessing ? "Processing..." : "Cashout"}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

