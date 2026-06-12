import { Badge, Button } from "@figma/astraui";
import {
  TrendingUp,
  Users,
  FileText,
  DollarSign,
  Package,
  Briefcase,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  BarChart3,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useNavigate } from "react-router";

const revenueData = [
  { month: "Jan", revenue: 4200, invoices: 8 },
  { month: "Feb", revenue: 5800, invoices: 11 },
  { month: "Mar", revenue: 4900, invoices: 9 },
  { month: "Apr", revenue: 7200, invoices: 14 },
  { month: "May", revenue: 6500, invoices: 12 },
  { month: "Jun", revenue: 8900, invoices: 17 },
  { month: "Jul", revenue: 9400, invoices: 18 },
  { month: "Aug", revenue: 8100, invoices: 16 },
  { month: "Sep", revenue: 10200, invoices: 21 },
  { month: "Oct", revenue: 11500, invoices: 23 },
  { month: "Nov", revenue: 9800, invoices: 19 },
  { month: "Dec", revenue: 13200, invoices: 26 },
];

const serviceData = [
  { name: "Web Dev", value: 45 },
  { name: "SEO", value: 25 },
  { name: "Design", value: 20 },
  { name: "Maintenance", value: 10 },
];

const COLORS = ["#5250f3", "#818cf8", "#a5b4fc", "#c7d2fe"];

const recentActivity = [
  { id: 1, type: "invoice", desc: "Invoice #INV-2024-089 sent to TechCorp Ltd", time: "2h ago", status: "sent" },
  { id: 2, type: "customer", desc: "New customer: Sarah Mitchell onboarded", time: "4h ago", status: "new" },
  { id: 3, type: "blog", desc: "Blog post 'Next.js Best Practices' published", time: "6h ago", status: "published" },
  { id: 4, type: "policy", desc: "Google Policy update detected — review needed", time: "1d ago", status: "warning" },
  { id: 5, type: "invoice", desc: "Payment received from StartupHub — $3,200", time: "1d ago", status: "paid" },
  { id: 6, type: "package", desc: "Enterprise Package pricing updated", time: "2d ago", status: "updated" },
];

const statsCards = [
  { label: "Total Revenue", value: "$98,400", change: "+18.2%", icon: DollarSign, color: "text-brand-primary" },
  { label: "Active Customers", value: "142", change: "+12 this month", icon: Users, color: "text-success" },
  { label: "Pending Invoices", value: "23", change: "$45,200 outstanding", icon: FileText, color: "text-warning" },
  { label: "Active Packages", value: "8", change: "3 tiers available", icon: Package, color: "text-brand-primary" },
];

const quickActions = [
  { label: "New Invoice", path: "/invoicing", icon: FileText },
  { label: "Add Customer", path: "/customers", icon: Users },
  { label: "New Blog Post", path: "/blog", icon: Briefcase },
  { label: "Check Policies", path: "/policies", icon: AlertTriangle },
];

export function DashboardHome() {
  const navigate = useNavigate();

  return (
    <div className="p-2xl flex flex-col gap-2xl">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-title text-text-primary">Dashboard</h1>
          <p className="text-label-sm text-text-secondary mt-xs">
            Welcome back! Here's an overview of WebNDevs IT Solutions.
          </p>
        </div>
        <div className="flex items-center gap-lg">
          <Badge label="Live" variant="success" />
          <Button variant="primary" iconStart={<BarChart3 size={16} />}>
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-xl">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-surface-bg rounded-corner-lg p-xl flex flex-col gap-md">
              <div className="flex items-center justify-between">
                <span className="text-label-sm text-text-secondary">{stat.label}</span>
                <div className={`${stat.color} bg-bg-faint p-sm rounded-corner-md`}>
                  <Icon size={16} />
                </div>
              </div>
              <div>
                <span className="text-title text-text-primary">{stat.value}</span>
                <p className="text-video-title text-text-tertiary mt-xs">{stat.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="flex gap-xl">
        {/* Revenue Chart */}
        <div className="flex-1 bg-surface-bg rounded-corner-lg p-xl">
          <div className="flex items-center justify-between mb-lg">
            <h2 className="text-label text-text-primary font-semibold">Revenue Overview</h2>
            <Badge label="2024" variant="secondary" />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5250f3" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#5250f3" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#717182" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#717182" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: "#fff", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 8, fontSize: 12 }}
                formatter={(val) => [`$${val.toLocaleString()}`, "Revenue"]}
              />
              <Area type="monotone" dataKey="revenue" stroke="#5250f3" strokeWidth={2} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Service Distribution */}
        <div className="w-[280px] bg-surface-bg rounded-corner-lg p-xl">
          <h2 className="text-label text-text-primary font-semibold mb-lg">Service Mix</h2>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={serviceData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" strokeWidth={0}>
                {serviceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-sm mt-md">
            {serviceData.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-sm">
                  <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />
                  <span className="text-video-title text-text-secondary">{item.name}</span>
                </div>
                <span className="text-video-title text-text-primary font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="flex gap-xl">
        {/* Recent Activity */}
        <div className="flex-1 bg-surface-bg rounded-corner-lg p-xl">
          <div className="flex items-center justify-between mb-lg">
            <h2 className="text-label text-text-primary font-semibold">Recent Activity</h2>
            <Button variant="subtle" size="small" iconEnd={<ArrowRight size={16} />}>
              View all
            </Button>
          </div>
          <div className="flex flex-col gap-md">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-start gap-lg p-md rounded-corner-md bg-bg-faint">
                <div className="flex-1">
                  <p className="text-label-sm text-text-primary">{item.desc}</p>
                  <span className="text-video-title text-text-tertiary">{item.time}</span>
                </div>
                <Badge
                  label={item.status}
                  variant={
                    item.status === "warning" ? "warning" :
                    item.status === "paid" || item.status === "published" ? "success" :
                    item.status === "new" ? "brand" : "default"
                  }
                />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions + Monthly Invoices */}
        <div className="flex flex-col gap-xl w-[280px]">
          <div className="bg-surface-bg rounded-corner-lg p-xl">
            <h2 className="text-label text-text-primary font-semibold mb-lg">Quick Actions</h2>
            <div className="flex flex-col gap-sm">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    onClick={() => navigate(action.path)}
                    className="flex items-center gap-lg p-md rounded-corner-md bg-bg-faint hover:bg-bg-hover transition-colors text-left"
                  >
                    <div className="text-brand-primary">
                      <Icon size={16} />
                    </div>
                    <span className="text-label-sm text-text-primary">{action.label}</span>
                    <ArrowRight size={14} className="ml-auto text-text-tertiary" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-surface-bg rounded-corner-lg p-xl">
            <h2 className="text-label text-text-primary font-semibold mb-lg">Monthly Invoices</h2>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={revenueData.slice(-6)} barSize={16}>
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#717182" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                <Bar dataKey="invoices" fill="#5250f3" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
