import { FormEvent, useMemo, useState } from "react";
import { Badge, Button, InputField } from "@figma/astraui";
import { setStoredToken } from "../auth";
import { API_BASE_URL } from "../../config/api.config";
import { useNavigate } from "react-router";

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
    <div className="min-h-screen bg-brand-tertiary flex items-center justify-center p-xl">
      <div className="w-full max-w-[520px] bg-surface-bg rounded-corner-lg border border-border-primary p-2xl flex flex-col gap-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-title text-text-primary">CMS Login</h1>
            <p className="text-label-sm text-text-secondary mt-xs">Login with your email and password to access the dashboard.</p>
          </div>
          <Badge label="Secure Access" variant="secondary" />
        </div>

        {errorText && <p className="text-label-sm text-danger">{errorText}</p>}
        {successText && <p className="text-label-sm text-success">{successText}</p>}

        <form className="flex flex-col gap-lg" onSubmit={handleSubmit}>
          <InputField label="Email" placeholder="admin@example.com" value={email} onChange={setEmail} />
          <InputField label="Password" type="password" placeholder="••••••••" value={password} onChange={setPassword} />
          <Button variant="primary" type="submit" disabled={isSubmitting || !isValid}>
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
