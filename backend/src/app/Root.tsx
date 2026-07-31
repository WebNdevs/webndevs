import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import { ThemeProvider } from "@figma/astraui";
import { clearStoredAuth, getStoredToken } from "./auth";
import { API_BASE_URL } from "../config/api.config";
import { Sidebar, UserInfo } from "./components/Sidebar";

export function Root() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  // Session timeout states
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(60);
  const [reloginEmail, setReloginEmail] = useState("");
  const [reloginPassword, setReloginPassword] = useState("");
  const [reloginError, setReloginError] = useState("");
  const [isReloggingIn, setIsReloggingIn] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      if (location.pathname === "/login") {
        setIsAuthLoading(false);
        return;
      }

      const token = getStoredToken();
      const headers: HeadersInit = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          method: "GET",
          headers,
          credentials: "include",
        });
        if (!response.ok) {
          clearStoredAuth();
          navigate("/login", { replace: true });
          return;
        }
        
        const data = await response.json();
        if (data.success && data.data?.user) {
          setUserInfo(data.data.user);
          // Initialize session expiry if not present
          if (!localStorage.getItem("wnd_session_expiry")) {
            localStorage.setItem("wnd_session_expiry", String(Date.now() + 60 * 60 * 1000));
          }
        }
      } catch {
        clearStoredAuth();
        navigate("/login", { replace: true });
        return;
      }
      setIsAuthLoading(false);
    }

    void checkAuth();
  }, [location.pathname, navigate]);

  async function handleLogout() {
    if (isLoggingOut) {
      return;
    }
    setIsLoggingOut(true);
    const token = getStoredToken();
    const headers: HeadersInit = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers,
        credentials: "include",
      });
    } catch {
      // Ignore logout errors
    } finally {
      clearStoredAuth();
      document.cookie = "XSRF-TOKEN=; Max-Age=0; path=/";
      document.cookie = "laravel_session=; Max-Age=0; path=/";
      window.location.href = "/login";
      setIsLoggingOut(false);
    }
  }

  // Session timeout checking logic (periodically each hour, checking wnd_session_expiry)
  useEffect(() => {
    if (location.pathname === "/login") {
      setShowTimeoutModal(false);
      return;
    }

    const interval = setInterval(() => {
      const storedToken = getStoredToken();
      if (!storedToken) {
        setShowTimeoutModal(false);
        return;
      }

      const expiryStr = localStorage.getItem("wnd_session_expiry");
      const expiry = expiryStr ? Number(expiryStr) : 0;

      if (!expiry) {
        localStorage.setItem("wnd_session_expiry", String(Date.now() + 60 * 60 * 1000));
        return;
      }

      if (Date.now() >= expiry) {
        if (!showTimeoutModal) {
          setShowTimeoutModal(true);
          let graceEndStr = localStorage.getItem("wnd_session_grace_end");
          if (!graceEndStr) {
            const graceEnd = Date.now() + 60 * 1000;
            localStorage.setItem("wnd_session_grace_end", String(graceEnd));
            graceEndStr = String(graceEnd);
          }
          const remaining = Math.max(0, Math.ceil((Number(graceEndStr) - Date.now()) / 1000));
          setSecondsRemaining(remaining);
        } else {
          const graceEndStr = localStorage.getItem("wnd_session_grace_end");
          if (graceEndStr) {
            const remaining = Math.max(0, Math.ceil((Number(graceEndStr) - Date.now()) / 1000));
            setSecondsRemaining(remaining);
            if (remaining <= 0) {
              localStorage.removeItem("wnd_session_grace_end");
              setShowTimeoutModal(false);
              void handleLogout();
            }
          }
        }
      } else {
        if (showTimeoutModal) {
          setShowTimeoutModal(false);
          localStorage.removeItem("wnd_session_grace_end");
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [showTimeoutModal, location.pathname]);

  function keepLoggedIn() {
    localStorage.setItem("wnd_session_expiry", String(Date.now() + 60 * 60 * 1000));
    localStorage.removeItem("wnd_session_grace_end");
    setShowTimeoutModal(false);
    setReloginEmail("");
    setReloginPassword("");
    setReloginError("");
  }

  async function handleRelogin(e: React.FormEvent) {
    e.preventDefault();
    if (!reloginEmail.trim() || !reloginPassword.trim()) {
      setReloginError("Please enter both email and password.");
      return;
    }
    setIsReloggingIn(true);
    setReloginError("");
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: reloginEmail.trim(),
          password: reloginPassword,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Invalid credentials.");
      }

      if (data.data?.token) {
        localStorage.setItem("wnd_admin_token", data.data.token);
        localStorage.setItem("wnd_session_expiry", String(Date.now() + 60 * 60 * 1000));
        localStorage.removeItem("wnd_session_grace_end");
        if (data.data.user) {
          setUserInfo(data.data.user);
        }
        window.dispatchEvent(new CustomEvent("auth:change"));
      }

      setShowTimeoutModal(false);
      setReloginEmail("");
      setReloginPassword("");
      setReloginError("");
    } catch (err) {
      setReloginError(err instanceof Error ? err.message : "Re-login failed.");
    } finally {
      setIsReloggingIn(false);
    }
  }

  if (isAuthLoading) {
    return (
      <ThemeProvider>
        <div className="h-screen w-full flex items-center justify-center bg-brand-tertiary">
          <p className="text-label text-text-secondary">Checking authentication...</p>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar
          userInfo={userInfo}
          isLoggingOut={isLoggingOut}
          handleLogout={handleLogout}
        />
        <main className="flex-1 bg-brand-tertiary overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {showTimeoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-surface-bg border border-border-primary rounded-xl max-w-md w-full p-6 shadow-2xl flex flex-col gap-4 animate-zoom-in text-text-primary">
            {/* Modal Header */}
            <div className="flex items-center gap-3 border-b border-border-secondary pb-3">
              <div className="bg-danger/10 text-danger p-2 rounded-lg flex items-center justify-center">
                <span className="text-xl">⚠️</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-text-primary">Session Expiry Warning</h3>
                <p className="text-xs text-text-tertiary">Remember to save your work!</p>
              </div>
            </div>

            {/* Countdown Display */}
            <div className="bg-danger/10 border border-danger/20 rounded-lg p-4 flex flex-col items-center justify-center gap-1 text-center">
              <span className="text-xs text-danger font-semibold uppercase tracking-wider">Logging out in</span>
              <span className="text-3xl font-mono font-bold text-danger">
                00:{secondsRemaining < 10 ? `0${secondsRemaining}` : secondsRemaining}
              </span>
            </div>

            {/* Warning Message */}
            <p className="text-xs text-text-secondary leading-relaxed">
              Your session is about to expire in 1 minute. Please save your progress in any active editors, then click <strong>Keep Logged In</strong> to extend your session by another hour, or re-authenticate below.
            </p>

            {/* Re-authenticate Form */}
            <form onSubmit={handleRelogin} className="flex flex-col gap-3 mt-1 border-t border-border-secondary pt-4">
              <span className="text-xs font-semibold text-text-secondary">Or Re-Authenticate Directly:</span>
              
              {reloginError && (
                <div className="p-2.5 bg-danger/10 border border-danger/20 text-danger rounded-lg text-xs leading-relaxed">
                  {reloginError}
                </div>
              )}

              <div className="flex flex-col gap-2">
                <input
                  type="email"
                  placeholder="Admin Email"
                  className="w-full h-9 rounded-lg border border-border-primary bg-bg-faint px-3 text-xs text-text-primary focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none"
                  value={reloginEmail}
                  onChange={(e) => setReloginEmail(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full h-9 rounded-lg border border-border-primary bg-bg-faint px-3 text-xs text-text-primary focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none"
                  value={reloginPassword}
                  onChange={(e) => setReloginPassword(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={isReloggingIn || !reloginEmail.trim() || !reloginPassword.trim()}
                className="w-full h-9 rounded-lg bg-brand-primary hover:bg-brand-primary/95 text-white font-medium text-xs transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
              >
                {isReloggingIn ? "Verifying..." : "Verify & Re-authenticate"}
              </button>
            </form>

            {/* Buttons Group */}
            <div className="flex justify-between gap-3 mt-2 border-t border-border-secondary pt-4">
              <button
                type="button"
                onClick={handleLogout}
                className="h-9 px-4 rounded-lg border border-border-primary hover:bg-bg-faint text-text-secondary text-xs transition-colors"
              >
                Sign Out
              </button>
              <button
                type="button"
                onClick={keepLoggedIn}
                className="h-9 px-4 rounded-lg bg-brand-primary hover:bg-brand-primary/95 text-white font-semibold text-xs transition-colors"
              >
                Keep Logged In (+1 Hour)
              </button>
            </div>
          </div>
        </div>
      )}
    </ThemeProvider>
  );
}
