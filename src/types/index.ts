export interface User {
    walletAddress: string;
    cookieScore: number;
    burns: number;
}

export interface BurnEvent {
    user: User;
    timestamp: number;
    amountBurned: number;
}

export interface LeaderboardEntry {
    username: string;
    walletAddress: string;
    cookieScore: number;
}