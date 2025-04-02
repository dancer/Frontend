"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type Bet = {
  id: string
  matchId: string
  match: string
  selection: string
  odds: number
  stake: number
  potentialWin: number
  isLive?: boolean
}

type BettingSlipContextType = {
  bets: Bet[]
  addBet: (bet: Bet) => void
  removeBet: (id: string) => void
  updateStake: (id: string, stake: number) => void
  clearBets: () => void
}

const BettingSlipContext = createContext<BettingSlipContextType | undefined>(undefined)

export function useBettingSlip() {
  const context = useContext(BettingSlipContext)
  if (context === undefined) {
    throw new Error("useBettingSlip must be used within a BettingSlipProvider")
  }
  return context
}

export default function BettingSlipProvider({ children }: { children: ReactNode }) {
  const [bets, setBets] = useState<Bet[]>([])

  const addBet = (bet: Bet) => {
    setBets((prevBets) => {
      // Check if bet already exists
      const existingBetIndex = prevBets.findIndex((b) => b.id === bet.id)

      if (existingBetIndex >= 0) {
        // Update existing bet
        const updatedBets = [...prevBets]
        updatedBets[existingBetIndex] = {
          ...bet,
          stake: prevBets[existingBetIndex].stake,
        }
        return updatedBets
      } else {
        // Add new bet
        return [...prevBets, bet]
      }
    })
  }

  const removeBet = (id: string) => {
    setBets((prevBets) => prevBets.filter((bet) => bet.id !== id))
  }

  const updateStake = (id: string, stake: number) => {
    setBets((prevBets) =>
      prevBets.map((bet) => (bet.id === id ? { ...bet, stake, potentialWin: stake * bet.odds } : bet)),
    )
  }

  const clearBets = () => {
    setBets([])
  }

  return (
    <BettingSlipContext.Provider value={{ bets, addBet, removeBet, updateStake, clearBets }}>
      {children}
    </BettingSlipContext.Provider>
  )
}

