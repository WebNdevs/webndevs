import { FormEvent, useMemo, useState } from "react";
import { Badge, InputField } from "@figma/astraui";
import { Mail, Lock, ShieldCheck, AlertCircle, CheckCircle } from "lucide-react";
import { setStoredToken } from "../auth";
import { API_BASE_URL } from "../../config/api.config";
import { useNavigate } from "react-router";
import { BadgeButton, Input, Button } from "../components/blocks";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  errors: Record<string, string[]> | string[] | [];
};

type AuthPayload = {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
    role: string;
    permissions: string[];
  };
};

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState("");
  const [successText, setSuccessText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const isValid = useMemo(() => email.trim().length > 0 && password.trim().length > 0, [email, password]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!isValid) {
      setErrorText("Please enter both email and password.");
      return;
    }

    setIsSubmitting(true);
    setErrorText("");
    setSuccessText("");
    setFieldErrors({});
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });
      const payload: ApiResponse<AuthPayload> = await response.json().catch(() => {
        throw new Error(`Server error (${response.status}). Please try again.`);
      });
      if (!response.ok || !payload.success) {
        if (payload.errors && typeof payload.errors === "object" && !Array.isArray(payload.errors)) {
          const errorsObj = payload.errors as Record<string, string[]>;
          const errors: Record<string, string> = {};
          Object.keys(errorsObj).forEach((key) => {
            if (errorsObj[key] && errorsObj[key].length > 0) {
              errors[key] = errorsObj[key][0];
            }
          });
          setFieldErrors(errors);
        } else if (response.status === 401 || payload.message?.toLowerCase().includes("credential")) {
          setFieldErrors({
            email: "Please check your email address.",
            password: "Please check your password.",
          });
        }
        throw new Error(payload.message || "Login failed.");
      }

      // Any authenticated user can access - role-based permissions control what they see
      if (payload.data?.token) {
        setStoredToken(payload.data.token);
        // Broadcast auth change so TokenStatus and other components update
        window.dispatchEvent(new CustomEvent("auth:change"));
      }

      setSuccessText("Login successful. Redirecting...");
      setTimeout(() => navigate("/"), 500);
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Unable to login.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 md:p-8 bg-[#09081a] overflow-hidden select-none">
      {/* Premium background radial glow & blurred light rings */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.2),rgba(255,255,255,0))]" />
      <div className="absolute -top-40 -left-40 w-[30rem] h-[30rem] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[30rem] h-[30rem] rounded-full bg-purple-500/10 blur-[100px] pointer-events-none" />

      {/* Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-[460px] bg-[#110f27]/60 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 md:p-10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] flex flex-col gap-6 md:gap-8 transition-all duration-300 hover:border-white/[0.12]">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-tr from-indigo-600 to-purple-600 p-1.5 rounded-lg text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold tracking-wider uppercase text-indigo-400">WebNDevs Login</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent tracking-tight mt-1">
              CMS Login
            </h1>
            <p className="text-xs md:text-sm text-neutral-400 leading-relaxed">
              Login with your email and password to access the dashboard.
            </p>
          </div>
          <BadgeButton label="Secure Access" variant="secondary" />
        </div>

        {/* Notifications */}
        {errorText && (
          <div className="p-3 bg-red-950/40 border border-red-500/20 text-red-200 rounded-lg text-xs flex items-center gap-2.5 animate-pulse">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{errorText}</span>
          </div>
        )}
        {successText && (
          <div className="p-3 bg-green-950/40 border border-green-500/20 text-green-200 rounded-lg text-xs flex items-center gap-2.5">
            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
            <span>{successText}</span>
          </div>
        )}

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <Input
            label="Email"
            prefix={<Mail className="w-4 h-4 text-neutral-400" />}
            suffix="admin@example.com"
            value={email}
            onChange={setEmail}
            errorText={fieldErrors.email}
            className="!bg-white/5 !border-white/10 !text-white placeholder-neutral-500"
          />
          <Input
            label="Password"
            type="password"
            prefix={<Lock className="w-4 h-4 text-neutral-400" />}
            suffix="••••••••"
            value={password}
            onChange={setPassword}
            errorText={fieldErrors.password}
            className="!bg-white/5 !border-white/10 !text-white placeholder-neutral-500"
          />
          <Button
            variant="primary"
            type="submit"
            disabled={isSubmitting || !isValid}
            isLoading={isSubmitting}
            className="w-full h-11"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}

