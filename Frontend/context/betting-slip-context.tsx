"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface Bet {
  id: string;
  matchId: string;
  type: "1" | "X" | "2";  // 1 = Home Win, X = Draw, 2 = Away Win
  odds: number;
  homeTeam: string;
  awayTeam: string;
  stake?: number;
  potentialWin?: number;
}

interface BettingSlipContextType {
  bets: Bet[];
  addBet: (bet: Omit<Bet, "id" | "stake" | "potentialWin">) => void;
  removeBet: (id: string) => void;
  updateStake: (id: string, stake: number) => void;
  clearBets: () => void;
  totalStake: number;
  totalPotentialWin: number;
}

const BettingSlipContext = createContext<BettingSlipContextType | undefined>(undefined)

export function useBettingSlip() {
  const context = useContext(BettingSlipContext)
  if (!context) {
    throw new Error("useBettingSlip must be used within a BettingSlipProvider")
  }
  return context
}

export default function BettingSlipProvider({ children }: { children: ReactNode }) {
  const [bets, setBets] = useState<Bet[]>([])

  const addBet = (bet: Omit<Bet, "id" | "stake" | "potentialWin">) => {
    const existingBet = bets.find(b => b.matchId === bet.matchId)
    if (existingBet) {
      setBets(bets.map(b => 
        b.id === existingBet.id 
          ? { ...b, type: bet.type, odds: bet.odds }
          : b
      ))
    } else {
      const newBet: Bet = {
        ...bet,
        id: Math.random().toString(36).substring(7),
        stake: 0,
        potentialWin: 0
      }
      setBets([...bets, newBet])
    }
  }

  const removeBet = (id: string) => {
    setBets(bets.filter(bet => bet.id !== id))
  }

  const updateStake = (id: string, stake: number) => {
    setBets(bets.map(bet => 
      bet.id === id 
        ? { ...bet, stake, potentialWin: stake * bet.odds }
        : bet
    ))
  }

  const clearBets = () => {
    setBets([])
  }

  const totalStake = bets.reduce((sum, bet) => sum + (bet.stake || 0), 0)
  const totalPotentialWin = bets.reduce((sum, bet) => sum + (bet.potentialWin || 0), 0)

  return (
    <BettingSlipContext.Provider value={{
      bets,
      addBet,
      removeBet,
      updateStake,
      clearBets,
      totalStake,
      totalPotentialWin
    }}>
      {children}
    </BettingSlipContext.Provider>
  )
}

