"use client"

import { useState, useEffect } from "react"
import { Coins, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { placeBet } from "@/services/api"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"

interface BettingModalProps {
    isOpen: boolean
    onClose: () => void
    bet: {
        id: string
        matchId: string
        match: string
        selection: string
        odds: number
        isLive: boolean
    } | null
}

export default function BettingModal({ isOpen, onClose, bet }: BettingModalProps) {
    const [stake, setStake] = useState<string>("")
    const { user } = useAuth()
    const { toast } = useToast()

    useEffect(() => {
        if (isOpen) {
            setStake("")
        }
    }, [isOpen])

    const handleStakeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        // Allow empty string or positive integers only
        if (value === "" || /^\d+$/.test(value)) {
            const stakeAmount = value === "" ? 0 : parseInt(value)

            if (stakeAmount > (user?.balance || 0)) {
                toast({
                    title: "Insufficient Balance",
                    description: "You don't have enough coins for this bet.",
                    variant: "destructive",
                })
                return
            }

            setStake(value)
        }
    }

    const handlePlaceBet = async () => {
        if (!bet || !user) return

        const stakeAmount = parseInt(stake)
        if (!stakeAmount || stakeAmount <= 0) {
            toast({
                title: "Invalid Amount",
                description: "Please enter a valid amount of coins to bet.",
                variant: "destructive",
            })
            return
        }

        if (stakeAmount > user.balance) {
            toast({
                title: "Insufficient Balance",
                description: "You don't have enough coins for this bet.",
                variant: "destructive",
            })
            return
        }

        try {
            await placeBet(bet.matchId, bet.selection, stakeAmount)

            toast({
                title: "Bet Placed Successfully",
                description: `${stakeAmount} coins on ${bet.selection}`,
            })

            onClose()
        } catch (error) {
            console.error("Failed to place bet:", error)
            toast({
                title: "Failed to Place Bet",
                description: "Please try again later.",
                variant: "destructive",
            })
        }
    }

    if (!bet) return null

    const potentialWin = stake ? parseInt(stake) * bet.odds : 0

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Place Bet</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-zinc-400">Your Balance</span>
                        <div className="flex items-center gap-1 font-medium">
                            <Coins className="h-4 w-4" />
                            <span>{user?.balance || 0}</span>
                        </div>
                    </div>

                    <div className="bg-zinc-800/50 rounded-lg p-3 space-y-3">
                        <div className="text-sm font-medium">{bet.match}</div>

                        <div className="text-xs text-zinc-400">
                            {bet.isLive && <span className="text-red-500 mr-1">LIVE</span>}
                            Selected: <span className="text-white">{bet.selection}</span>
                        </div>

                        <div className="flex items-center justify-between bg-zinc-700/50 rounded p-2">
                            <div className="text-sm">Odds</div>
                            <div className="text-red-500">{bet.odds.toFixed(2)}</div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-zinc-400">Bet Amount</label>
                        <Input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={stake}
                            onChange={handleStakeChange}
                            className="bg-zinc-800/50 border-zinc-700/50 focus:border-red-500 focus:ring-red-500"
                            placeholder="Enter coins amount"
                        />
                    </div>

                    {parseInt(stake) > 0 && (
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-zinc-400">Potential Win</span>
                            <div className="flex items-center gap-1 text-red-500 font-medium">
                                <Coins className="h-4 w-4" />
                                <span>{potentialWin.toFixed(0)}</span>
                            </div>
                        </div>
                    )}

                    <Button
                        onClick={handlePlaceBet}
                        disabled={!stake || parseInt(stake) <= 0 || parseInt(stake) > (user?.balance || 0)}
                        className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-medium"
                    >
                        Place Bet
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
} 