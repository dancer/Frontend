'use client';

import { useEffect, useState } from 'react';
import { fetchUserRankings } from '@/services/userRankings';
import LoadingSpinner from "@/components/loading-spinner";

interface UserRanking {
    username: string;
    coins: number;
}

export default function UserRankingsPage() {
    const [rankings, setRankings] = useState<UserRanking[]>([]);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadRankings = async () => {
            try {
                const data = await fetchUserRankings();
                setRankings(data);
            } catch (err) {
                setError('Failed to load rankings');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadRankings();
    }, []);

    if (loading) {
        return (
            <div className="flex-1 p-6 md:p-8 bg-gradient-to-b from-zinc-950 to-black min-h-screen">
                <div className="max-w-4xl mx-auto flex items-center justify-center h-64">
                    <LoadingSpinner />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 p-6 md:p-8 bg-gradient-to-b from-zinc-950 to-black min-h-screen">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-red-950/20 border border-red-900/50 rounded-lg p-4 text-red-500">
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 p-6 md:p-8 bg-gradient-to-b from-zinc-950 to-black min-h-screen">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                        User Rankings
                    </h1>
                    <span className="text-xs text-zinc-500 px-2 py-1 bg-zinc-900/50 rounded-full">
                        LEADERBOARD
                    </span>
                </div>

                <div className="space-y-4">
                    {/* Header */}
                    <div className="grid grid-cols-12 gap-4 text-sm text-zinc-500 px-4 py-2">
                        <div className="col-span-2 text-center">Rank</div>
                        <div className="col-span-6">Username</div>
                        <div className="col-span-4 text-right">Balance</div>
                    </div>

                    {/* Rankings */}
                    {rankings.map((ranking, index) => (
                        <div
                            key={ranking.username}
                            className="grid grid-cols-12 gap-4 bg-zinc-900/50 rounded-lg px-4 py-3 items-center hover:bg-zinc-900/70 transition-colors"
                        >
                            {/* Rank */}
                            <div className="col-span-2 text-center">
                                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full 
                                    ${index === 0 ? 'bg-red-500/20 text-red-500' :
                                        index === 1 ? 'bg-zinc-500/20 text-zinc-400' :
                                            index === 2 ? 'bg-red-900/20 text-red-900' :
                                                'bg-zinc-800/20 text-zinc-500'}`}>
                                    #{index + 1}
                                </span>
                            </div>

                            {/* Username */}
                            <div className="col-span-6 font-medium text-zinc-100">
                                {ranking.username}
                            </div>

                            {/* Coins */}
                            <div className="col-span-4 text-right font-mono">
                                <span className="text-red-500">{ranking.coins.toLocaleString()}</span>
                                <span className="text-zinc-600 ml-2">coins</span>
                            </div>
                        </div>
                    ))}
                </div>

                {rankings.length === 0 && (
                    <div className="text-center text-zinc-500 mt-8 bg-zinc-900/50 rounded-lg p-8">
                        No rankings available
                    </div>
                )}
            </div>
        </div>
    );
} 