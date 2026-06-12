import { RefreshCw, Clock, AlertTriangle, XCircle, LogIn, Lock } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { API_BASE_URL } from "../../config/api.config";
import { useAuthListener } from "../context/AuthContext";
import { getStoredToken, setStoredToken } from "../auth";

interface TokenInfo {
  token_id: number;
  name: string;
  created_at: string;
  expires_at: string;
  is_expired: boolean;
  is_expiring_soon: boolean;
  minutes_remaining: number | null;
  abilities: string[];
}

function formatTimeRemaining(minutes: number | null): string {
  if (minutes === null) return "Unknown";
  if (minutes <= 0) return "Expired";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours < 24) return `${hours}h ${mins}m`;
  const days = Math.floor(hours / 24);
  return `${days}d ${hours % 24}h`;
}

function getTokenStatusColor(tokenInfo: TokenInfo | null): string {
  if (!tokenInfo) return "#6B7280";
  if (tokenInfo.is_expired) return "#EF4444";
  if (tokenInfo.is_expiring_soon) return "#F59E0B";
  return "#10B981";
}

function getTokenStatusText(tokenInfo: TokenInfo | null): string {
  if (!tokenInfo) return "Unknown";
  if (tokenInfo.is_expired) return "Expired";
  if (tokenInfo.is_expiring_soon) return "Expiring Soon";
  return "Valid";
}

export function TokenStatus() {
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReauthModal, setShowReauthModal] = useState(false);
  const [reauthEmail, setReauthEmail] = useState("");
  const [reauthPassword, setReauthPassword] = useState("");
  const [reauthError, setReauthError] = useState<string | null>(null);
  const [isReauthing, setIsReauthing] = useState(false);
  
  // Live countdown state
  const [liveMinutes, setLiveMinutes] = useState<number | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchTokenInfo = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const storedToken = getStoredToken();
      const headers: Record<string, string> = {
        Accept: "application/json",
      };
      
      // Include the stored token in the Authorization header
      if (storedToken) {
        headers.Authorization = `Bearer ${storedToken}`;
      }

      const response = await fetch(`${API_BASE_URL}/auth/token-info`, {
        credentials: "include",
        headers,
      });

      if (!response.ok) {
        // 401 means no valid token - this is okay, we just show unknown status
        if (response.status === 401) {
          setTokenInfo(null);
          setLiveMinutes(null);
          setIsLoading(false);
          return;
        }
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Failed to fetch token info");
      }

      const data = await response.json();
      setTokenInfo(data.data);
      setLiveMinutes(data.data?.minutes_remaining ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setTokenInfo(null);
      setLiveMinutes(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const storedToken = getStoredToken();
      const headers: Record<string, string> = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };
      
      // Include the stored token in the Authorization header
      if (storedToken) {
        headers.Authorization = `Bearer ${storedToken}`;
      }

      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
        headers,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Failed to refresh token");
      }

      const data = await response.json();

      if (data.data?.token) {
        setStoredToken(data.data.token);
        // Broadcast auth change so other components update
        window.dispatchEvent(new CustomEvent("auth:change"));
      }

      await fetchTokenInfo();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to refresh token");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchTokenInfo]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Live countdown timer - decrements every minute
  useEffect(() => {
    if (tokenInfo && tokenInfo.minutes_remaining !== null && !tokenInfo.is_expired) {
      // Clear any existing interval
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
      
      // Set up live countdown
      countdownRef.current = setInterval(() => {
        setLiveMinutes((prev) => {
          if (prev === null || prev <= 0) {
            // Token expired, refresh the data
            void fetchTokenInfo();
            return prev;
          }
          return prev - 1;
        });
      }, 60000); // Update every minute (60000ms)
      
      return () => {
        if (countdownRef.current) {
          clearInterval(countdownRef.current);
        }
      };
    }
  }, [tokenInfo, fetchTokenInfo]);

  // Listen for auth changes from other components (like LoginPage)
  useAuthListener(fetchTokenInfo);

  useEffect(() => {
    void fetchTokenInfo();
  }, [fetchTokenInfo]);

  const handleRefresh = async () => {
    clearError();
    await refreshToken();
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-[#6B7280]">
        <RefreshCw className="w-4 h-4 animate-spin" />
        <span className="text-sm">Checking token...</span>
      </div>
    );
  }

  const statusColor = getTokenStatusColor(tokenInfo);
  const statusText = getTokenStatusText(tokenInfo);
  
  // Use live countdown for display if available, otherwise fall back to tokenInfo
  const displayMinutes = liveMinutes !== null ? liveMinutes : tokenInfo?.minutes_remaining ?? null;

  return (
    <div className="flex items-center gap-3 px-3 py-2 bg-[#1F2937] rounded-lg border border-[#374151]">
      {/* Status Indicator */}
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: statusColor }} />
        <span className="text-sm font-medium" style={{ color: statusColor }}>
          {statusText}
        </span>
      </div>

      {/* Time Remaining - Live Countdown */}
      <div className="flex items-center gap-1 text-[#9CA3AF]" title={tokenInfo?.expires_at ? `Expires: ${new Date(tokenInfo.expires_at).toLocaleString()}` : ""}>
        <Clock className="w-4 h-4" />
        <span className="text-sm font-mono">
          {formatTimeRemaining(displayMinutes)}
        </span>
      </div>

      {/* Refresh Button */}
      <button
        onClick={handleRefresh}
        className="flex items-center gap-1 px-2 py-1 bg-[#374151] hover:bg-[#4B5563] rounded text-[#F9FAFB] text-xs transition-colors"
        title="Refresh token"
      >
        <RefreshCw className="w-3 h-3" />
        <span>Refresh</span>
      </button>

      {/* Re-auth Button */}
      <button
        onClick={() => setShowReauthModal(true)}
        className="flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white text-xs transition-colors"
        title="Re-authenticate"
      >
        <LogIn className="w-3 h-3" />
        <span>Re-auth</span>
      </button>

      {/* Error Display */}
      {error && (
        <span className="text-xs text-red-400">{error}</span>
      )}

      {/* Re-auth Modal */}
      {showReauthModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowReauthModal(false)}
        >
          <div 
            className="bg-[#1F2937] rounded-lg p-6 w-full max-w-sm border border-[#374151]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#F9FAFB] flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Re-authenticate
              </h3>
              <button 
                onClick={() => setShowReauthModal(false)}
                className="text-[#9CA3AF] hover:text-white text-xl leading-none"
              >
                ×
              </button>
            </div>
            
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs text-[#9CA3AF] block mb-1">Email</label>
                <input
                  type="email"
                  value={reauthEmail}
                  onChange={(e) => setReauthEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-[#374151] border border-[#4B5563] rounded text-[#F9FAFB] text-sm"
                  placeholder="admin@example.com"
                />
              </div>
              <div>
                <label className="text-xs text-[#9CA3AF] block mb-1">Password</label>
                <input
                  type="password"
                  value={reauthPassword}
                  onChange={(e) => setReauthPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-[#374151] border border-[#4B5563] rounded text-[#F9FAFB] text-sm"
                  placeholder="••••••••"
                />
              </div>
              
              {reauthError && (
                <p className="text-sm text-red-400">{reauthError}</p>
              )}
              
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => setShowReauthModal(false)}
                  className="px-3 py-1.5 text-[#9CA3AF] hover:text-white text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (!reauthEmail || !reauthPassword) {
                      setReauthError("Please fill in all fields");
                      return;
                    }
                    setIsReauthing(true);
                    setReauthError(null);
                    try {
                      const url = `${API_BASE_URL}/auth/login`;
                      const payload = { email: reauthEmail, password: reauthPassword };
                      
                      const response = await fetch(url, {
                        method: "POST",
                        credentials: "include",
                        headers: {
                          "Content-Type": "application/json",
                          Accept: "application/json",
                        },
                        body: JSON.stringify(payload),
                      });
                      
                      const data = await response.json();
                      
                      if (response.ok && data.data?.token) {
                        setStoredToken(data.data.token);
                        setShowReauthModal(false);
                        setReauthEmail("");
                        setReauthPassword("");
                        // Broadcast auth change to sync all components
                        window.dispatchEvent(new CustomEvent("auth:change"));
                        await fetchTokenInfo();
                      } else {
                        setReauthError(data.message || `Login failed (${response.status})`);
                      }
                    } catch (err) {
                      console.error("Login error:", err);
                      setReauthError("Network error. Please try again.");
                    } finally {
                      setIsReauthing(false);
                    }
                  }}
                  disabled={isReauthing}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white text-sm rounded flex items-center gap-1"
                >
                  {isReauthing && <RefreshCw className="w-3 h-3 animate-spin" />}
                  {isReauthing ? "Logging in..." : "Login"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function TokenStatusCompact() {
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/auth/token-info`, {
      credentials: "include",
      headers: { Accept: "application/json" },
    })
      .then((res) => res.ok ? res.json() : null)
      .then((data) => data && setTokenInfo(data.data))
      .catch(() => {});
  }, []);

  const statusColor = getTokenStatusColor(tokenInfo);

  return (
    <button
      onClick={() => window.location.reload()}
      className="flex items-center gap-1.5 px-2 py-1 hover:bg-[#374151] rounded transition-colors"
      title={`Token: ${getTokenStatusText(tokenInfo)}`}
    >
      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColor }} />
      <span className="text-xs text-[#9CA3AF]">
        {formatTimeRemaining(tokenInfo?.minutes_remaining ?? null)}
      </span>
    </button>
  );
}

export function TokenDebugPanel() {
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/auth/token-info`, {
      credentials: "include",
      headers: { Accept: "application/json" },
    })
      .then((res) => res.ok ? res.json() : null)
      .then((data) => data && setTokenInfo(data.data))
      .catch(() => {});
  }, []);

  return (
    <div className="p-4 bg-[#111827] rounded-lg border border-[#374151] font-mono text-xs">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[#F9FAFB] font-semibold">Token Debug</h3>
        <button
          onClick={() => window.location.reload()}
          className="px-2 py-1 bg-[#374151] hover:bg-[#4B5563] rounded text-[#F9FAFB]"
        >
          Refresh
        </button>
      </div>

      <div className="space-y-1.5 text-[#9CA3AF]">
        <div>Token ID: {tokenInfo?.token_id ?? "N/A"}</div>
        <div>Name: {tokenInfo?.name ?? "N/A"}</div>
        <div>Created: {tokenInfo?.created_at ? new Date(tokenInfo.created_at).toLocaleString() : "N/A"}</div>
        <div>Expires: {tokenInfo?.expires_at ? new Date(tokenInfo.expires_at).toLocaleString() : "N/A"}</div>
        <div>
          Status: <span style={{ color: getTokenStatusColor(tokenInfo) }}>{getTokenStatusText(tokenInfo)}</span>
        </div>
        <div>Minutes Left: {tokenInfo?.minutes_remaining ?? "N/A"}</div>
      </div>
    </div>
  );
}