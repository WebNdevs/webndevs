// import { useState, useEffect, useCallback } from 'react';
// import { API_ROOT } from '../config/api';

// export interface TokenInfo {
//   token_id: number;
//   name: string;
//   created_at: string;
//   expires_at: string;
//   is_expired: boolean;
//   is_expiring_soon: boolean;
//   minutes_remaining: number | null;
//   abilities: string[];
// }

// export interface TokenManagerResult {
//   tokenInfo: TokenInfo | null;
//   isLoading: boolean;
//   error: string | null;
//   refreshToken: () => Promise<boolean>;
//   clearError: () => void;
// }

// const API_BASE_URL = API_ROOT;

// export function useTokenManager(): TokenManagerResult {
//   const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchTokenInfo = useCallback(async () => {
//     try {
//       setIsLoading(true);
//       setError(null);
      
//       const response = await fetch(`${API_BASE_URL}/v1/auth/token-info`, {
//         credentials: 'include',
//         headers: {
//           'Accept': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         const data = await response.json().catch(() => ({}));
//         throw new Error(data.message || 'Failed to fetch token info');
//       }

//       const data = await response.json();
//       setTokenInfo(data.data);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Unknown error');
//       setTokenInfo(null);
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   const refreshToken = useCallback(async (): Promise<boolean> => {
//     try {
//       setIsLoading(true);
//       setError(null);

//       const response = await fetch(`${API_BASE_URL}/v1/auth/refresh`, {
//         method: 'POST',
//         credentials: 'include',
//         headers: {
//           'Accept': 'application/json',
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         const data = await response.json().catch(() => ({}));
//         throw new Error(data.message || 'Failed to refresh token');
//       }

//       const data = await response.json();
      
//       // Update the stored token
//       if (data.data?.token) {
//         localStorage.setItem('wnd_admin_token', data.data.token);
//       }

//       // Fetch new token info
//       await fetchTokenInfo();
//       return true;
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to refresh token');
//       return false;
//     } finally {
//       setIsLoading(false);
//     }
//   }, [fetchTokenInfo]);

//   const clearError = useCallback(() => {
//     setError(null);
//   }, []);

//   // Initial fetch
//   useEffect(() => {
//     fetchTokenInfo();
//   }, [fetchTokenInfo]);

//   // Auto-refresh when token is expiring soon (every 5 minutes if expiring within 30 mins)
//   useEffect(() => {
//     if (!tokenInfo || tokenInfo.is_expired || !tokenInfo.is_expiring_soon) {
//       return;
//     }

//     const interval = setInterval(() => {
//       refreshToken();
//     }, 5 * 60 * 1000); // Check every 5 minutes

//     return () => clearInterval(interval);
//   }, [tokenInfo, refreshToken]);

//   return {
//     tokenInfo,
//     isLoading,
//     error,
//     refreshToken,
//     clearError,
//   };
// }

// // Helper function to format time remaining
// export function formatTimeRemaining(minutes: number | null): string {
//   if (minutes === null) return 'Unknown';
//   if (minutes <= 0) return 'Expired';
//   if (minutes < 60) return `${minutes} min`;
//   const hours = Math.floor(minutes / 60);
//   const mins = minutes % 60;
//   if (hours < 24) return `${hours}h ${mins}m`;
//   const days = Math.floor(hours / 24);
//   return `${days}d ${hours % 24}h`;
// }

// // Helper function to get status color
// export function getTokenStatusColor(tokenInfo: TokenInfo | null): string {
//   if (!tokenInfo) return '#6B7280'; // gray
//   if (tokenInfo.is_expired) return '#EF4444'; // red
//   if (tokenInfo.is_expiring_soon) return '#F59E0B'; // yellow/amber
//   return '#10B981'; // green
// }

// // Helper function to get status text
// export function getTokenStatusText(tokenInfo: TokenInfo | null): string {
//   if (!tokenInfo) return 'Unknown';
//   if (tokenInfo.is_expired) return 'Expired';
//   if (tokenInfo.is_expiring_soon) return 'Expiring Soon';
//   return 'Valid';
// }
