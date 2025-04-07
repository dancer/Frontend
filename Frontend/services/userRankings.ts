interface UserRanking {
    username: string;
    coins: number;
}

export const fetchUserRankings = async (): Promise<UserRanking[]> => {
    const response = await fetch('http://localhost:5000/api/userrankings/sorted');
    if (!response.ok) {
        throw new Error('Failed to fetch user rankings');
    }
    const rankings = await response.json();
    return rankings.reverse(); // Reverse to show highest to lowest
}; 