import { RefreshCw, Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useTokenManager, formatTimeRemaining, getTokenStatusColor, getTokenStatusText } from '../hooks/useTokenManager';

export function TokenStatus() {
  const { tokenInfo, isLoading, error, refreshToken, clearError } = useTokenManager();

  const handleRefresh = async () => {
    clearError();
    await refreshToken();
  };

  if (isLoading && !tokenInfo) {
    return (
      <div className="flex items-center gap-2 text-[#6B7280]">
        <RefreshCw className="w-4 h-4 animate-spin" />
        <span className="text-sm">Checking token...</span>
      </div>
    );
  }

  const statusColor = getTokenStatusColor(tokenInfo);
  const statusText = getTokenStatusText(tokenInfo);

  return (
    <div className="flex items-center gap-4 px-4 py-2 bg-[#1F2937] rounded-lg border border-[#374151]">
      {/* Status Indicator */}
      <div className="flex items-center gap-2">
        <div 
          className="w-2 h-2 rounded-full" 
          style={{ backgroundColor: statusColor }}
        />
        <span className="text-sm font-medium" style={{ color: statusColor }}>
          {statusText}
        </span>
      </div>

      {/* Time Remaining */}
      <div className="flex items-center gap-2 text-[#9CA3AF]">
        <Clock className="w-4 h-4" />
        <span className="text-sm">
          {formatTimeRemaining(tokenInfo?.minutes_remaining ?? null)}
        </span>
      </div>

      {/* Expires At */}
      {tokenInfo?.expires_at && (
        <div className="hidden md:flex items-center gap-2 text-[#6B7280]">
          <span className="text-xs">
            Expires: {new Date(tokenInfo.expires_at).toLocaleString()}
          </span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 text-red-400">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Refresh Button */}
      <button
        onClick={handleRefresh}
        disabled={isLoading}
        className="flex items-center gap-1 px-3 py-1 bg-[#374151] hover:bg-[#4B5563] rounded-md text-[#F9FAFB] text-sm transition-colors disabled:opacity-50"
      >
        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        <span>Refresh</span>
      </button>

      {/* Expiring Soon Warning */}
      {tokenInfo?.is_expiring_soon && (
        <div className="flex items-center gap-2 px-2 py-1 bg-yellow-500/10 rounded text-yellow-400">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-xs font-medium">Token expiring soon!</span>
        </div>
      )}

      {/* Expired State */}
      {tokenInfo?.is_expired && (
        <div className="flex items-center gap-2 px-2 py-1 bg-red-500/10 rounded text-red-400">
          <XCircle className="w-4 h-4" />
          <span className="text-xs font-medium">Token expired!</span>
        </div>
      )}
    </div>
  );
}

// Compact version for navbar or small spaces
export function TokenStatusCompact() {
  const { tokenInfo, isLoading, refreshToken } = useTokenManager();

  if (isLoading && !tokenInfo) {
    return (
      <div className="flex items-center">
        <RefreshCw className="w-4 h-4 animate-spin text-[#6B7280]" />
      </div>
    );
  }

  const statusColor = getTokenStatusColor(tokenInfo);

  return (
    <button
      onClick={refreshToken}
      className="flex items-center gap-2 px-2 py-1 hover:bg-[#374151] rounded transition-colors"
      title={`Token ${getTokenStatusText(tokenInfo)} - ${formatTimeRemaining(tokenInfo?.minutes_remaining ?? null)}`}
    >
      <div 
        className="w-2 h-2 rounded-full" 
        style={{ backgroundColor: statusColor }}
      />
      <span className="text-xs text-[#9CA3AF]">
        {formatTimeRemaining(tokenInfo?.minutes_remaining ?? null)}
      </span>
    </button>
  );
}

// Detailed debug panel for development
export function TokenDebugPanel() {
  const { tokenInfo, isLoading, refreshToken } = useTokenManager();

  if (isLoading && !tokenInfo) {
    return <div className="p-4 text-[#6B7280]">Loading...</div>;
  }

  return (
    <div className="p-4 bg-[#111827] rounded-lg border border-[#374151] font-mono text-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[#F9FAFB] font-semibold">Token Debug</h3>
        <button
          onClick={refreshToken}
          className="px-2 py-1 bg-[#374151] hover:bg-[#4B5563] rounded text-[#F9FAFB] text-xs"
        >
          Refresh
        </button>
      </div>
      
      <div className="space-y-2 text-[#9CA3AF]">
        <div>
          <span className="text-[#6B7280]">Token ID:</span> {tokenInfo?.token_id ?? 'N/A'}
        </div>
        <div>
          <span className="text-[#6B7280]">Name:</span> {tokenInfo?.name ?? 'N/A'}
        </div>
        <div>
          <span className="text-[#6B7280]">Created:</span> {tokenInfo?.created_at ? new Date(tokenInfo.created_at).toLocaleString() : 'N/A'}
        </div>
        <div>
          <span className="text-[#6B7280]">Expires:</span> {tokenInfo?.expires_at ? new Date(tokenInfo.expires_at).toLocaleString() : 'N/A'}
        </div>
        <div>
          <span className="text-[#6B7280]">Status:</span> 
          <span style={{ color: getTokenStatusColor(tokenInfo) }}>
            {getTokenStatusText(tokenInfo)}
          </span>
        </div>
        <div>
          <span className="text-[#6B7280]">Minutes Left:</span> {tokenInfo?.minutes_remaining ?? 'N/A'}
        </div>
        <div>
          <span className="text-[#6B7280]">Expiring Soon:</span> {tokenInfo?.is_expiring_soon ? 'Yes' : 'No'}
        </div>
        <div>
          <span className="text-[#6B7280]">Abilities:</span> 
          {tokenInfo?.abilities ? JSON.stringify(tokenInfo.abilities) : 'N/A'}
        </div>
      </div>
    </div>
  );
}