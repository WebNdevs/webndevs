import { useEffect, useState } from "react";
import { Badge, Button } from "@figma/astraui";
import { Download, RefreshCw, Search } from "lucide-react";
import { API_BASE_URL } from "../../config/api.config";
import { clearStoredAuth, fetchAuthenticatedUser, getStoredToken, setStoredToken, TOKEN_KEYS } from "../auth";

type Service = {
  id: number;
  name: string;
  slug: string;
  category: string;
  base_price: number;
  status: "active" | "inactive";
  description: string;
  features: string[];
  projects_completed: number;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  errors: Record<string, string[]> | string[] | [];
};

const categoryIcons: Record<string, string> = {
  "Web Development": "💻",
  "UI/UX Design": "🎨",
  "SEO & Marketing": "📊",
  Cybersecurity: "🛡️",
  "Mobile Apps": "📱",
  "Domain & Hosting": "🌐",
};

const categoryList = ["Web Development", "UI/UX Design", "SEO & Marketing", "Cybersecurity", "Mobile Apps", "Domain & Hosting"];

function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="bg-surface-bg rounded-corner-lg p-xl flex flex-col gap-lg border border-border-primary">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-lg">
          <div className="text-brand-primary bg-brand-muted p-md rounded-corner-md text-xl">
            {categoryIcons[service.category] || "🌐"}
          </div>
          <div>
            <p className="text-label text-text-primary font-semibold">{service.name}</p>
            <p className="text-video-title text-text-tertiary">{`SVC-${String(service.id).padStart(3, "0")}`}</p>
            <p className="text-label-sm text-brand-primary mt-xs">
              <span className="font-mono">/services/{service.slug}</span>
            </p>
          </div>
        </div>
        <Badge label={service.status} variant={service.status === "active" ? "success" : "default"} />
      </div>

      <p className="text-label-sm text-text-secondary">{service.description}</p>

      <div className="bg-bg-faint rounded-corner-md p-lg">
        <p className="text-video-title text-text-secondary mb-sm">Features</p>
        <div className="flex flex-wrap gap-sm">
          {(service.features ?? []).map((feature) => (
            <span key={feature} className="bg-surface-bg border border-border-secondary rounded-corner-md px-sm py-xs text-video-title text-text-primary">
              {feature}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-label text-text-primary">{`Starting from $${Number(service.base_price ?? 0).toLocaleString()}`}</p>
          <p className="text-video-title text-text-tertiary">{`${service.projects_completed ?? 0} projects completed`}</p>
        </div>
        <Badge label={service.category} variant="secondary" />
      </div>
    </div>
  );
}

export function ServicesModule() {
  const [services, setServices] = useState<Service[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(false);
  const [adminToken, setAdminToken] = useState(() => getStoredToken());
  const [hasSessionAuth, setHasSessionAuth] = useState(false);

  const hasToken = adminToken.trim().length > 0;
  const canManage = hasToken || hasSessionAuth;

  const filteredServices = services.filter((service) => {
    const matchSearch = service.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === "All" || service.category === activeCategory;
    return matchSearch && matchCategory;
  });

  async function fetchServices() {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/services`);
      const payload: ApiResponse<Service[]> = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Failed to fetch services.");
      }
      setServices(payload.data ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    async function syncAdminAuth() {
      const resolved = getStoredToken();
      setAdminToken(resolved);

      try {
        await fetchAuthenticatedUser(resolved || undefined);
        setHasSessionAuth(true);
      } catch {
        setHasSessionAuth(false);
      }
    }

    function handleStorageChange(event: StorageEvent) {
      if (!event.key || TOKEN_KEYS.includes(event.key as (typeof TOKEN_KEYS)[number])) {
        void syncAdminAuth();
      }
    }

    function handleWindowFocus() {
      void syncAdminAuth();
    }

    void syncAdminAuth();
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", handleWindowFocus);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleWindowFocus);
    };
  }, []);

  function setToken() {
    const value = window.prompt("Paste admin API token")?.trim() ?? "";
    if (!value) {
      return;
    }
    setStoredToken(value);
    setAdminToken(value);
    setHasSessionAuth(true);
  }

  function clearToken() {
    clearStoredAuth();
    setAdminToken("");
    setHasSessionAuth(false);
  }

  return (
    <div className="p-2xl flex flex-col gap-xl">
      <div className="flex items-start justify-between flex-wrap gap-md">
        <div>
          <h1 className="text-title text-text-primary">Services</h1>
          <p className="text-label-sm text-text-secondary mt-xs">View and manage your service catalog.</p>
        </div>
        <div className="flex items-center gap-md">
          <Button variant="neutral" iconStart={<RefreshCw size={16} />} onClick={fetchServices}>
            Refresh
          </Button>
          {!hasToken ? (
            <Button variant="neutral" onClick={setToken}>
              Set Admin Token
            </Button>
          ) : (
            <Button variant="neutral" onClick={clearToken}>
              Clear Token
            </Button>
          )}
        </div>
      </div>

      <div className="flex gap-xl items-center">
        {[
          { label: "Total Services", value: services.length },
          { label: "Active", value: services.filter((service) => service.status === "active").length },
          { label: "Categories", value: new Set(services.map((service) => service.category)).size },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface-bg rounded-corner-lg p-xl flex-1 text-center">
            <span className="text-title text-text-primary">{stat.value}</span>
            <p className="text-video-title text-text-secondary mt-xs">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-surface-bg rounded-corner-lg p-xl flex flex-col gap-lg">
        <div className="flex items-center gap-md">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-md top-1/2 -translate-y-1/2 text-text-secondary" />
            <input
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-xl pr-md py-sm rounded-corner-md border border-border-primary bg-bg-faint text-text-primary"
            />
          </div>
        </div>
        <div className="flex gap-sm flex-wrap">
          {["All", ...categoryList].map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-lg py-sm rounded-corner-full text-label-sm transition-colors ${
                activeCategory === category ? "bg-brand-primary text-on-brand" : "bg-bg-faint text-text-secondary hover:bg-brand-primary/10 hover:text-text-primary"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-xl">
        {isLoading && (
          <div className="col-span-2 bg-surface-bg rounded-corner-lg p-2xl text-center">
            <p className="text-label text-text-secondary">Loading services...</p>
          </div>
        )}
        {!isLoading &&
          filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        {!isLoading && filteredServices.length === 0 && (
          <div className="col-span-2 bg-surface-bg rounded-corner-lg p-2xl text-center">
            <p className="text-label text-text-secondary">No services found.</p>
          </div>
        )}
      </div>
    </div>
  );
}