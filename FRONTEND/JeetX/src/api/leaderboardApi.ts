
import { CONFIG, getAccessToken } from './config';

export interface LeaderboardEntry {
    rank: number;
    user_id: string;
    full_name: string;
    profile_url?: string | null;
    points: number;
    wins: number;
    total_prize_won: number;
}

export interface LeaderboardResponse {
    success: boolean;
    data: {
        period_type: string;
        period_start: string;
        period_end: string;
        category_id: string | null;
        top_3: LeaderboardEntry[];
        rankings: LeaderboardEntry[];
        user_ranking: LeaderboardEntry;
        total_users: number;
    };
}

export const getLeaderboard = async (
    type: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ALL_TIME',
    categoryId?: string,
    limit: number = 100
): Promise<LeaderboardResponse> => {
    try {
        const token = getAccessToken();
        console.log('Using Token for Leaderboard:', token ? `${token.substring(0, 10)}...` : 'NULL');
        const baseUrl = CONFIG.BASE_URL.endsWith('/') ? CONFIG.BASE_URL.slice(0, -1) : CONFIG.BASE_URL;
        let url = `${baseUrl}/api/v1/leaderboard?type=${type}&limit=${limit}`;

        if (categoryId) {
            url += `&category_id=${categoryId}`;
        }

        const params = {
            type,
            category_id: categoryId,
            limit
        };
        console.log('--- Leaderboard API Request ---');
        console.log('URL:', url);
        console.log('Payload (Query Params):', JSON.stringify(params, null, 2));
        console.log('Headers:', JSON.stringify({
            'Authorization': `Bearer ${token ? `${token.substring(0, 10)}...` : 'NULL'}`,
            'Content-Type': 'application/json'
        }, null, 2));

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });

        console.log('--- Leaderboard API Response ---');
        console.log('Status:', response.status, response.statusText);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error Body:', errorText);
            throw new Error(`Failed to fetch leaderboard: ${response.status} ${response.statusText}`);
        }

        const rawData: any = await response.json();
        console.log('Response JSON:', JSON.stringify(rawData, null, 2));

        // Unwrap double nesting if it exists
        if (rawData.success && rawData.data && rawData.data.success && rawData.data.data) {
            return {
                success: true,
                data: rawData.data.data
            } as LeaderboardResponse;
        }

        return rawData as LeaderboardResponse;
    } catch (error: any) {
        console.error('Leaderboard API Fetch Exception:', error.message || error);
        if (error.stack) console.log('Stack trace:', error.stack);
        throw error;
    }
};

export interface UserStats {
    period_type: string;
    total_points: number;
    total_coins_won: number;
    matches_played: number;
    wins: number;
}

export interface UserStatsResponse {
    success: boolean;
    data: UserStats;
}

export const getUserLeaderboardStats = async (
    type: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ALL_TIME',
    categoryId?: string
): Promise<UserStatsResponse> => {
    try {
        const token = getAccessToken();
        const baseUrl = CONFIG.BASE_URL.endsWith('/') ? CONFIG.BASE_URL.slice(0, -1) : CONFIG.BASE_URL;
        let url = `${baseUrl}/api/v1/leaderboard/stats?type=${type}`;

        if (categoryId) {
            url += `&category_id=${categoryId}`;
        }

        const params = {
            type,
            category_id: categoryId
        };
        console.log('--- User Stats API Request ---');
        console.log('URL:', url);
        console.log('Payload (Query Params):', JSON.stringify(params, null, 2));
        console.log('Headers:', JSON.stringify({
            'Authorization': `Bearer ${token ? `${token.substring(0, 10)}...` : 'NULL'}`,
            'Content-Type': 'application/json'
        }, null, 2));

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });

        console.log('--- User Stats API Response ---');
        console.log('Status:', response.status, response.statusText);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error Body:', errorText);
            throw new Error(`Failed to fetch user stats: ${response.status} ${response.statusText}`);
        }

        const rawData: any = await response.json();
        console.log('Response JSON:', JSON.stringify(rawData, null, 2));

        // Unwrap double nesting if it exists
        if (rawData.success && rawData.data && rawData.data.success && rawData.data.data) {
            return {
                success: true,
                data: rawData.data.data
            } as UserStatsResponse;
        }

        return rawData as UserStatsResponse;
    } catch (error) {
        console.error('Error fetching user stats:', error);
        throw error;
    }
};
