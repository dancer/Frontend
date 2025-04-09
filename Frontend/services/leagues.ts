import api from './api';

export interface League {
  id: string;
  name: string;
  country: string;
  logo: string;
  isFeatured: boolean;
  activeMatches: number;
}

export interface Match {
  id: string;
  homeTeamId: string;
  homeTeamName: string;
  homeTeamLogo: string;
  homeTeamScore: number | null;
  awayTeamId: string;
  awayTeamName: string;
  awayTeamLogo: string;
  awayTeamScore: number | null;
  kickoffTime: string;
  status: string;
  minute: number | null;
  homeWinOdds: number;
  drawOdds: number;
  awayWinOdds: number;
  isFeatured: boolean;
  isLive: boolean;
  league: {
    id: string;
    name: string;
    logo: string;
  };
}

export async function getLeagues() {
  const response = await api.get<League[]>('/api/leagues');
  return response.data;
}

export async function getFeaturedLeagues() {
  const response = await api.get<League[]>('/api/leagues/featured');
  return response.data;
}

export async function getLeagueMatches(leagueId: string, status?: string) {
  const response = await api.get<Match[]>(`/api/leagues/${leagueId}/matches`, {
    params: { status }
  });
  return response.data;
}

export async function getMatches(status?: string) {
  const response = await api.get<Match[]>('/api/matches', {
    params: { status }
  });
  return response.data;
}

export async function getLiveMatches() {
  const response = await api.get<Match[]>('/api/matches/live');
  return response.data;
}

export async function getFeaturedMatches() {
  const response = await api.get<Match[]>('/api/matches/featured');
  return response.data;
} 