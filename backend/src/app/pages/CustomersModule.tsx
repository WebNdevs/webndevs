import { useState } from "react";
import {
  Button,
  Badge,
  InputField,
  TextareaField,
  SelectField,
  Modal,
  Avatar,
  Tabs,
} from "@figma/astraui";
import {
  Plus,
  Pencil,
  Trash2,
  Download,
  Search,
  Mail,
  Phone,
  MessageSquare,
  DollarSign,
  Clock,
} from "lucide-react";

type Project = { name: string; status: string; value: number };

type Customer = {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  category: "enterprise" | "business" | "startup" | "individual";
  status: "active" | "inactive" | "prospect";
  totalProjects: number;
  totalPaid: number;
  outstandingBalance: number;
  joinDate: string;
  lastContact: string;
  notes: string;
  projects: Project[];
};

const initialCustomers: Customer[] = [
  {
    id: "CUS-001",
    name: "James Harrison",
    company: "TechCorp Ltd",
    email: "james@techcorp.com",
    phone: "+1 555-0142",
    category: "enterprise",
    status: "active",
    totalProjects: 5,
    totalPaid: 28500,
    outstandingBalance: 4200,
    joinDate: "2023-03-15",
    lastContact: "2024-12-20",
    notes: "Long-term client. Prefers weekly status updates. Always pays on time.",
    projects: [
      { name: "Corporate Website Redesign", status: "completed", value: 12000 },
      { name: "E-Commerce Platform", status: "active", value: 18500 },
    ],
  },
  {
    id: "CUS-002",
    name: "Sarah Mitchell",
    company: "StartupHub Inc",
    email: "sarah@startuphub.io",
    phone: "+1 555-0289",
    category: "startup",
    status: "active",
    totalProjects: 2,
    totalPaid: 8200,
    outstandingBalance: 1800,
    joinDate: "2024-06-01",
    lastContact: "2024-12-18",
    notes: "Fast-growing startup. Budget-conscious but quality focused.",
    projects: [
      { name: "MVP Landing Page", status: "completed", value: 3200 },
      { name: "Dashboard App", status: "active", value: 8500 },
    ],
  },
  {
    id: "CUS-003",
    name: "David Chen",
    company: "RetailMax Solutions",
    email: "david@retailmax.com",
    phone: "+1 555-0371",
    category: "business",
    status: "active",
    totalProjects: 3,
    totalPaid: 15600,
    outstandingBalance: 0,
    joinDate: "2023-09-20",
    lastContact: "2024-12-15",
    notes: "E-commerce specialist. Interested in AI-driven personalization features.",
    projects: [
      { name: "Online Store Setup", status: "completed", value: 7500 },
      { name: "SEO Campaign Q4", status: "active", value: 3600 },
    ],
  },
  {
    id: "CUS-004",
    name: "Emma Watson",
    company: "Creative Studio",
    email: "emma@creativestudio.co",
    phone: "+1 555-0498",
    category: "individual",
    status: "prospect",
    totalProjects: 0,
    totalPaid: 0,
    outstandingBalance: 0,
    joinDate: "2024-12-10",
    lastContact: "2024-12-10",
    notes: "Potential client. Interested in portfolio website and branding package.",
    projects: [],
  },
  {
    id: "CUS-005",
    name: "Robert Kim",
    company: "MedTech Innovations",
    email: "robert@medtech.ai",
    phone: "+1 555-0563",
    category: "enterprise",
    status: "inactive",
    totalProjects: 1,
    totalPaid: 22000,
    outstandingBalance: 5500,
    joinDate: "2023-01-10",
    lastContact: "2024-09-05",
    notes: "Large medical tech company. Project paused due to internal restructuring.",
    projects: [{ name: "Healthcare Portal", status: "on-hold", value: 22000 }],
  },
];

const categoryColors = {
  enterprise: "brand" as const,
  business: "success" as const,
  startup: "warning" as const,
  individual: "secondary" as const,
};

const statusColors = {
  active: "success" as const,
  inactive: "default" as const,
  prospect: "warning" as const,
};

type FormData = {
  name: string;
  company: string;
  email: string;
  phone: string;
  category: "enterprise" | "business" | "startup" | "individual";
  status: "active" | "inactive" | "prospect";
  notes: string;
};

const emptyForm: FormData = {
  name: "",
  company: "",
  email: "",
  phone: "",
  category: "business",
  status: "prospect",
  notes: "",
};

function custToForm(c: Customer): FormData {
  return {
    name: c.name,
    company: c.company,
    email: c.email,
    phone: c.phone,
    category: c.category,
    status: c.status,
    notes: c.notes,
  };
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function CustomerCard({
  customer,
  onEdit,
  onDelete,
}: {
  customer: Customer;
  onEdit: (c: Customer) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="bg-surface-bg rounded-corner-lg p-xl border border-border-primary flex flex-col gap-lg">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-lg">
          <Avatar type="initial" initials={getInitials(customer.name)} size="large" shape="circle" />
          <div>
            <p className="text-label text-text-primary font-semibold">{customer.name}</p>
            <p className="text-label-sm text-text-secondary">{customer.company}</p>
            <p className="text-video-title text-text-tertiary">{customer.id}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-xs">
          <Badge label={customer.status} variant={statusColors[customer.status]} />
          <Badge label={customer.category} variant={categoryColors[customer.category]} />
        </div>
      </div>

      <div className="flex flex-col gap-sm">
        <div className="flex items-center gap-sm text-text-secondary">
          <Mail size={14} />
          <span className="text-label-sm">{customer.email}</span>
        </div>
        <div className="flex items-center gap-sm text-text-secondary">
          <Phone size={14} />
          <span className="text-label-sm">{customer.phone}</span>
        </div>
        <div className="flex items-center gap-sm text-text-secondary">
          <Clock size={14} />
          <span className="text-video-title">Last contact: {customer.lastContact}</span>
        </div>
      </div>

      <div className="bg-bg-faint rounded-corner-md p-lg grid grid-cols-3 gap-md">
        <div className="text-center">
          <p className="text-label text-text-primary">{customer.totalProjects}</p>
          <p className="text-video-title text-text-tertiary">Projects</p>
        </div>
        <div className="text-center">
          <p className="text-label text-text-primary">${customer.totalPaid.toLocaleString()}</p>
          <p className="text-video-title text-text-tertiary">Paid</p>
        </div>
        <div className="text-center">
          <p className={`text-label ${customer.outstandingBalance > 0 ? "text-warning" : "text-success"}`}>
            ${customer.outstandingBalance.toLocaleString()}
          </p>
          <p className="text-video-title text-text-tertiary">Outstanding</p>
        </div>
      </div>

      {customer.notes && (
        <div className="bg-bg-faint rounded-corner-md p-md">
          <p className="text-video-title text-text-secondary">{customer.notes}</p>
        </div>
      )}

      <div className="flex gap-sm">
        <Button variant="primary" size="small" iconStart={<MessageSquare size={16} />}>
          Contact
        </Button>
        <Button variant="neutral" size="small" iconStart={<DollarSign size={16} />}>
          Invoice
        </Button>
        <Button variant="neutral" size="small" iconStart={<Pencil size={16} />} onClick={() => onEdit(customer)}>
          Edit
        </Button>
        <Button variant="subtle" size="small" iconStart={<Trash2 size={16} />} onClick={() => onDelete(customer.id)}>
          Delete
        </Button>
      </div>
    </div>
  );
}

function CustomersTable({
  customers,
  onEdit,
  onDelete,
}: {
  customers: Customer[];
  onEdit: (c: Customer) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="bg-surface-bg rounded-corner-lg overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border-secondary">
            <th className="text-left p-lg text-label-sm text-text-secondary font-medium">Customer</th>
            <th className="text-left p-lg text-label-sm text-text-secondary font-medium">Contact</th>
            <th className="text-left p-lg text-label-sm text-text-secondary font-medium">Category</th>
            <th className="text-left p-lg text-label-sm text-text-secondary font-medium">Projects</th>
            <th className="text-left p-lg text-label-sm text-text-secondary font-medium">Total Paid</th>
            <th className="text-left p-lg text-label-sm text-text-secondary font-medium">Outstanding</th>
            <th className="text-left p-lg text-label-sm text-text-secondary font-medium">Status</th>
            <th className="text-right p-lg text-label-sm text-text-secondary font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c, i) => (
            <tr
              key={c.id}
              className={`${i !== customers.length - 1 ? "border-b border-border-secondary" : ""} hover:bg-bg-faint transition-colors`}
            >
              <td className="p-lg">
                <div className="flex items-center gap-md">
                  <Avatar type="initial" initials={getInitials(c.name)} size="small" shape="circle" />
                  <div>
                    <p className="text-label-sm text-text-primary font-medium">{c.name}</p>
                    <p className="text-video-title text-text-tertiary">{c.company}</p>
                  </div>
                </div>
              </td>
              <td className="p-lg">
                <p className="text-label-sm text-text-secondary">{c.email}</p>
                <p className="text-video-title text-text-tertiary">{c.phone}</p>
              </td>
              <td className="p-lg">
                <Badge label={c.category} variant={categoryColors[c.category]} />
              </td>
              <td className="p-lg text-label-sm text-text-primary">{c.totalProjects}</td>
              <td className="p-lg text-label-sm text-text-primary">${c.totalPaid.toLocaleString()}</td>
              <td className="p-lg">
                <span className={`text-label-sm ${c.outstandingBalance > 0 ? "text-warning" : "text-success"}`}>
                  ${c.outstandingBalance.toLocaleString()}
                </span>
              </td>
              <td className="p-lg">
                <Badge label={c.status} variant={statusColors[c.status]} />
              </td>
              <td className="p-lg">
                <div className="flex justify-end gap-sm">
                  <Button variant="subtle" size="small" iconStart={<Pencil size={16} />} onClick={() => onEdit(c)}>
                    Edit
                  </Button>
                  <Button variant="subtle" size="small" iconStart={<Trash2 size={16} />} onClick={() => onDelete(c.id)}>
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CustomersModule() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [viewMode, setViewMode] = useState<"cards" | "table">("table");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);

  const filtered = customers.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || c.status === filterStatus;
    const matchCat = !filterCategory || c.category === filterCategory;
    return matchSearch && matchStatus && matchCat;
  });

  const openCreate = () => {
    setEditingCustomer(null);
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  const openEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData(custToForm(customer));
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  };

  const handleSave = () => {
    if (editingCustomer) {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === editingCustomer.id
            ? {
                ...c,
                name: formData.name,
                company: formData.company,
                email: formData.email,
                phone: formData.phone,
                category: formData.category,
                status: formData.status,
                notes: formData.notes,
              }
            : c
        )
      );
    } else {
      const today = new Date().toISOString().split("T")[0];
      const newCustomer: Customer = {
        id: `CUS-${String(customers.length + 1).padStart(3, "0")}`,
        name: formData.name,
        company: formData.company,
        email: formData.email,
        phone: formData.phone,
        category: formData.category,
        status: formData.status,
        notes: formData.notes,
        totalProjects: 0,
        totalPaid: 0,
        outstandingBalance: 0,
        joinDate: today,
        lastContact: today,
        projects: [],
      };
      setCustomers((prev) => [...prev, newCustomer]);
    }
    setIsModalOpen(false);
  };

  const updateForm = (key: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-2xl flex flex-col gap-xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-title text-text-primary">Customers</h1>
          <p className="text-label-sm text-text-secondary mt-xs">
            Manage customer profiles, projects, and communication history.
          </p>
        </div>
        <div className="flex items-center gap-lg">
          <Button variant="neutral" iconStart={<Download size={16} />}>
            Export
          </Button>
          <Button variant="primary" iconStart={<Plus size={16} />} onClick={openCreate}>
            Add Customer
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-xl">
        {[
          { label: "Total Customers", value: customers.length },
          { label: "Active", value: customers.filter((c) => c.status === "active").length },
          { label: "Prospects", value: customers.filter((c) => c.status === "prospect").length },
          {
            label: "Total Revenue",
            value: "$" + customers.reduce((a, c) => a + c.totalPaid, 0).toLocaleString(),
          },
          {
            label: "Outstanding",
            value: "$" + customers.reduce((a, c) => a + c.outstandingBalance, 0).toLocaleString(),
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-surface-bg rounded-corner-lg p-xl flex-1 text-center"
          >
            <span className="text-title text-text-primary">{stat.value}</span>
            <p className="text-video-title text-text-secondary mt-xs">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-surface-bg rounded-corner-lg p-xl flex gap-xl items-center">
        <div className="flex-1">
          <InputField
            prefix={<Search size={16} />}
            placeholder="Search customers..."
            value={search}
            onChange={setSearch}
          />
        </div>
        <SelectField
          label=""
          placeholder="All Statuses"
          options={[
            { value: "", label: "All Statuses" },
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
            { value: "prospect", label: "Prospect" },
          ]}
          value={filterStatus}
          onChange={setFilterStatus}
          className="w-[160px]"
        />
        <SelectField
          label=""
          placeholder="All Categories"
          options={[
            { value: "", label: "All Categories" },
            { value: "enterprise", label: "Enterprise" },
            { value: "business", label: "Business" },
            { value: "startup", label: "Startup" },
            { value: "individual", label: "Individual" },
          ]}
          value={filterCategory}
          onChange={setFilterCategory}
          className="w-[160px]"
        />
        <div className="flex gap-sm">
          <Button
            variant={viewMode === "cards" ? "neutral" : "subtle"}
            size="small"
            onClick={() => setViewMode("cards")}
          >
            Cards
          </Button>
          <Button
            variant={viewMode === "table" ? "neutral" : "subtle"}
            size="small"
            onClick={() => setViewMode("table")}
          >
            Table
          </Button>
        </div>
      </div>

      {viewMode === "cards" ? (
        <div className="grid grid-cols-2 gap-xl">
          {filtered.map((c) => (
            <CustomerCard key={c.id} customer={c} onEdit={openEdit} onDelete={handleDelete} />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-2 bg-surface-bg rounded-corner-lg p-2xl text-center">
              <p className="text-label text-text-secondary">No customers found.</p>
            </div>
          )}
        </div>
      ) : (
        <>
          <CustomersTable customers={filtered} onEdit={openEdit} onDelete={handleDelete} />
          {filtered.length === 0 && (
            <div className="bg-surface-bg rounded-corner-lg p-2xl text-center">
              <p className="text-label text-text-secondary">No customers found.</p>
            </div>
          )}
        </>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCustomer ? "Edit Customer" : "Add New Customer"}
        size="large"
        footer={
          <>
            <Button variant="neutral" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              {editingCustomer ? "Save Changes" : "Add Customer"}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-lg">
          <div className="flex gap-xl">
            <div className="flex-1">
              <InputField
                label="Full Name"
                placeholder="John Smith"
                value={formData.name}
                onChange={(v) => updateForm("name", v)}
              />
            </div>
            <div className="flex-1">
              <InputField
                label="Company"
                placeholder="ACME Corp"
                value={formData.company}
                onChange={(v) => updateForm("company", v)}
              />
            </div>
          </div>
          <div className="flex gap-xl">
            <div className="flex-1">
              <InputField
                label="Email"
                placeholder="john@company.com"
                value={formData.email}
                onChange={(v) => updateForm("email", v)}
              />
            </div>
            <div className="flex-1">
              <InputField
                label="Phone"
                placeholder="+1 555-0000"
                value={formData.phone}
                onChange={(v) => updateForm("phone", v)}
              />
            </div>
          </div>
          <div className="flex gap-xl">
            <div className="flex-1">
              <SelectField
                label="Category"
                options={[
                  { value: "enterprise", label: "Enterprise" },
                  { value: "business", label: "Business" },
                  { value: "startup", label: "Startup" },
                  { value: "individual", label: "Individual" },
                ]}
                value={formData.category}
                onChange={(v) => updateForm("category", v as FormData["category"])}
              />
            </div>
            <div className="flex-1">
              <SelectField
                label="Status"
                options={[
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                  { value: "prospect", label: "Prospect" },
                ]}
                value={formData.status}
                onChange={(v) => updateForm("status", v as FormData["status"])}
              />
            </div>
          </div>
          <TextareaField
            label="Notes"
            placeholder="Customer notes..."
            value={formData.notes}
            rows={4}
            onChange={(v) => updateForm("notes", v)}
          />
        </div>
      </Modal>
    </div>
  );
}
