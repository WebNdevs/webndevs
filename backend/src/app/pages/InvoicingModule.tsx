import { useState } from "react";
import {
  Button,
  Badge,
  InputField,
  SelectField,
  Modal,
  TextareaField,
} from "@figma/astraui";
import {
  Plus,
  Download,
  Search,
  Printer,
  Send,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

type InvoiceItem = { description: string; qty: number; rate: number };

type Invoice = {
  id: string;
  customer: string;
  company: string;
  issueDate: string;
  dueDate: string;
  status: "paid" | "pending" | "overdue" | "draft";
  items: InvoiceItem[];
  taxRate: number;
  notes: string;
  paymentMethod?: string;
  paidDate?: string;
};

function calcTotal(items: InvoiceItem[], taxRate: number) {
  const subtotal = items.reduce((a, i) => a + i.qty * i.rate, 0);
  return {
    subtotal,
    tax: subtotal * (taxRate / 100),
    total: subtotal * (1 + taxRate / 100),
  };
}

const initialInvoices: Invoice[] = [
  {
    id: "INV-2024-089",
    customer: "James Harrison",
    company: "TechCorp Ltd",
    issueDate: "2024-12-01",
    dueDate: "2024-12-31",
    status: "pending",
    taxRate: 10,
    items: [
      { description: "Corporate Website Redesign", qty: 1, rate: 8000 },
      { description: "SEO Setup & Configuration", qty: 1, rate: 1200 },
      { description: "Monthly Maintenance (3 months)", qty: 3, rate: 299 },
    ],
    notes: "Payment due within 30 days. Late fees may apply.",
  },
  {
    id: "INV-2024-088",
    customer: "Sarah Mitchell",
    company: "StartupHub Inc",
    issueDate: "2024-11-15",
    dueDate: "2024-12-15",
    status: "paid",
    taxRate: 10,
    items: [
      { description: "MVP Landing Page", qty: 1, rate: 3200 },
      { description: "Domain Registration (1 year)", qty: 1, rate: 45 },
    ],
    notes: "Thank you for your business!",
    paymentMethod: "Bank Transfer",
    paidDate: "2024-12-10",
  },
  {
    id: "INV-2024-085",
    customer: "Robert Kim",
    company: "MedTech Innovations",
    issueDate: "2024-10-01",
    dueDate: "2024-10-31",
    status: "overdue",
    taxRate: 10,
    items: [{ description: "Healthcare Portal Development", qty: 1, rate: 22000 }],
    notes: "Payment overdue. Please contact us immediately.",
  },
  {
    id: "INV-2024-092",
    customer: "David Chen",
    company: "RetailMax Solutions",
    issueDate: "2024-12-20",
    dueDate: "2025-01-20",
    status: "draft",
    taxRate: 10,
    items: [
      { description: "E-Commerce Platform Development", qty: 1, rate: 5500 },
      { description: "Payment Gateway Integration", qty: 1, rate: 800 },
      { description: "Product Import & Setup", qty: 1, rate: 400 },
    ],
    notes: "Draft — not yet sent to customer.",
  },
];

const statusColors = {
  paid: "success" as const,
  pending: "warning" as const,
  overdue: "danger" as const,
  draft: "default" as const,
};

const statusIcons = {
  paid: <CheckCircle size={14} className="text-success" />,
  pending: <Clock size={14} className="text-warning" />,
  overdue: <AlertTriangle size={14} className="text-danger" />,
  draft: <Pencil size={14} className="text-text-tertiary" />,
};

function InvoicePreview({ invoice }: { invoice: Invoice }) {
  const { subtotal, tax, total } = calcTotal(invoice.items, invoice.taxRate);
  return (
    <div className="bg-surface-bg rounded-corner-lg p-xl border border-border-primary">
      <div className="flex justify-between mb-xl pb-xl border-b border-border-secondary">
        <div>
          <h2 className="text-label text-brand-primary font-semibold">WebNDevs IT Solutions</h2>
          <p className="text-video-title text-text-secondary">123 Tech Street, Silicon Valley, CA</p>
          <p className="text-video-title text-text-secondary">contact@webdevs.io | +1 555-0100</p>
        </div>
        <div className="text-right">
          <p className="text-heading text-text-primary font-semibold">{invoice.id}</p>
          <div className="flex items-center gap-sm justify-end mt-xs">
            {statusIcons[invoice.status]}
            <Badge label={invoice.status.toUpperCase()} variant={statusColors[invoice.status]} />
          </div>
        </div>
      </div>

      <div className="flex justify-between mb-xl">
        <div>
          <p className="text-video-title text-text-secondary mb-xs">Bill To:</p>
          <p className="text-label-sm text-text-primary font-medium">{invoice.customer}</p>
          <p className="text-label-sm text-text-secondary">{invoice.company}</p>
        </div>
        <div className="text-right">
          <div className="flex flex-col gap-xs">
            <div className="flex items-center gap-xl justify-end">
              <span className="text-video-title text-text-secondary">Issue Date:</span>
              <span className="text-video-title text-text-primary">{invoice.issueDate}</span>
            </div>
            <div className="flex items-center gap-xl justify-end">
              <span className="text-video-title text-text-secondary">Due Date:</span>
              <span
                className={`text-video-title ${invoice.status === "overdue" ? "text-danger" : "text-text-primary"}`}
              >
                {invoice.dueDate}
              </span>
            </div>
            {invoice.paidDate && (
              <div className="flex items-center gap-xl justify-end">
                <span className="text-video-title text-text-secondary">Paid Date:</span>
                <span className="text-video-title text-success">{invoice.paidDate}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <table className="w-full mb-xl">
        <thead>
          <tr className="bg-bg-faint">
            <th className="text-left p-md text-video-title text-text-secondary">Description</th>
            <th className="text-right p-md text-video-title text-text-secondary">Qty</th>
            <th className="text-right p-md text-video-title text-text-secondary">Rate</th>
            <th className="text-right p-md text-video-title text-text-secondary">Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, i) => (
            <tr key={i} className="border-b border-border-secondary">
              <td className="p-md text-label-sm text-text-primary">{item.description}</td>
              <td className="p-md text-label-sm text-text-secondary text-right">{item.qty}</td>
              <td className="p-md text-label-sm text-text-secondary text-right">
                ${item.rate.toLocaleString()}
              </td>
              <td className="p-md text-label-sm text-text-primary text-right">
                ${(item.qty * item.rate).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end">
        <div className="w-[240px] flex flex-col gap-sm">
          <div className="flex justify-between">
            <span className="text-label-sm text-text-secondary">Subtotal</span>
            <span className="text-label-sm text-text-primary">${subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-label-sm text-text-secondary">Tax ({invoice.taxRate}%)</span>
            <span className="text-label-sm text-text-primary">${tax.toLocaleString()}</span>
          </div>
          <div className="flex justify-between pt-sm border-t border-border-primary">
            <span className="text-label text-text-primary font-semibold">Total</span>
            <span className="text-label text-brand-primary font-semibold">
              ${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {invoice.notes && (
        <div className="mt-xl pt-xl border-t border-border-secondary">
          <p className="text-video-title text-text-secondary">{invoice.notes}</p>
        </div>
      )}
    </div>
  );
}

type CreateFormItem = { description: string; qty: string; rate: string };

type CreateForm = {
  customer: string;
  company: string;
  taxRate: string;
  issueDate: string;
  dueDate: string;
  notes: string;
  status: "draft" | "pending";
  items: CreateFormItem[];
};

const emptyCreateForm: CreateForm = {
  customer: "",
  company: "",
  taxRate: "10",
  issueDate: "",
  dueDate: "",
  notes: "",
  status: "draft",
  items: [{ description: "", qty: "1", rate: "" }],
};

const customerOptions = [
  { value: "James Harrison|TechCorp Ltd", label: "James Harrison — TechCorp Ltd" },
  { value: "Sarah Mitchell|StartupHub Inc", label: "Sarah Mitchell — StartupHub Inc" },
  { value: "David Chen|RetailMax Solutions", label: "David Chen — RetailMax Solutions" },
  { value: "Emma Watson|Creative Studio", label: "Emma Watson — Creative Studio" },
  { value: "Robert Kim|MedTech Innovations", label: "Robert Kim — MedTech Innovations" },
];

export function InvoicingModule() {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<CreateForm>(emptyCreateForm);

  const filtered = invoices.filter((inv) => {
    const matchSearch =
      inv.id.toLowerCase().includes(search.toLowerCase()) ||
      inv.customer.toLowerCase().includes(search.toLowerCase()) ||
      inv.company.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || inv.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalOutstanding = invoices
    .filter((i) => i.status !== "paid")
    .reduce((a, i) => a + calcTotal(i.items, i.taxRate).total, 0);
  const totalPaid = invoices
    .filter((i) => i.status === "paid")
    .reduce((a, i) => a + calcTotal(i.items, i.taxRate).total, 0);

  const updateCreateForm = (key: keyof CreateForm, value: string) => {
    setCreateForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateItem = (idx: number, key: keyof CreateFormItem, value: string) => {
    setCreateForm((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => (i === idx ? { ...item, [key]: value } : item)),
    }));
  };

  const addItem = () => {
    setCreateForm((prev) => ({
      ...prev,
      items: [...prev.items, { description: "", qty: "1", rate: "" }],
    }));
  };

  const removeItem = (idx: number) => {
    setCreateForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx),
    }));
  };

  const handleCreate = (asDraft: boolean) => {
    const [customer, company] = createForm.customer.split("|");
    const items: InvoiceItem[] = createForm.items
      .filter((item) => item.description.trim())
      .map((item) => ({
        description: item.description,
        qty: parseInt(item.qty) || 1,
        rate: parseFloat(item.rate) || 0,
      }));

    const newInvoice: Invoice = {
      id: `INV-${new Date().getFullYear()}-${String(93 + invoices.length).padStart(3, "0")}`,
      customer: customer || "Unknown",
      company: company || "",
      issueDate: createForm.issueDate || new Date().toISOString().split("T")[0],
      dueDate: createForm.dueDate,
      status: asDraft ? "draft" : "pending",
      taxRate: parseFloat(createForm.taxRate) || 10,
      items: items.length ? items : [{ description: "Service", qty: 1, rate: 0 }],
      notes: createForm.notes,
    };

    setInvoices((prev) => [newInvoice, ...prev]);
    setCreateForm(emptyCreateForm);
    setIsCreateOpen(false);
  };

  const getLineTotal = (item: CreateFormItem) => {
    const qty = parseInt(item.qty) || 0;
    const rate = parseFloat(item.rate) || 0;
    return qty * rate;
  };

  const getFormTotals = () => {
    const subtotal = createForm.items.reduce((a, item) => a + getLineTotal(item), 0);
    const tax = subtotal * ((parseFloat(createForm.taxRate) || 0) / 100);
    return { subtotal, tax, total: subtotal + tax };
  };

  const { subtotal: fSubtotal, tax: fTax, total: fTotal } = getFormTotals();

  return (
    <div className="p-2xl flex flex-col gap-xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-title text-text-primary">Invoicing</h1>
          <p className="text-label-sm text-text-secondary mt-xs">
            Create, manage, and track invoices and payments.
          </p>
        </div>
        <div className="flex items-center gap-lg">
          <Button variant="neutral" iconStart={<Download size={16} />}>
            Export
          </Button>
          <Button
            variant="primary"
            iconStart={<Plus size={16} />}
            onClick={() => {
              setCreateForm(emptyCreateForm);
              setIsCreateOpen(true);
            }}
          >
            New Invoice
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-xl">
        {[
          { label: "Total Invoices", value: invoices.length },
          { label: "Paid", value: invoices.filter((i) => i.status === "paid").length },
          { label: "Pending", value: invoices.filter((i) => i.status === "pending").length },
          { label: "Overdue", value: invoices.filter((i) => i.status === "overdue").length },
          { label: "Total Collected", value: `$${totalPaid.toLocaleString()}` },
          { label: "Outstanding", value: `$${totalOutstanding.toLocaleString()}` },
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

      {/* Search */}
      <div className="bg-surface-bg rounded-corner-lg p-xl flex gap-xl items-center">
        <div className="flex-1">
          <InputField
            prefix={<Search size={16} />}
            placeholder="Search invoices..."
            value={search}
            onChange={setSearch}
          />
        </div>
        <SelectField
          label=""
          placeholder="All Statuses"
          options={[
            { value: "", label: "All Statuses" },
            { value: "paid", label: "Paid" },
            { value: "pending", label: "Pending" },
            { value: "overdue", label: "Overdue" },
            { value: "draft", label: "Draft" },
          ]}
          value={filterStatus}
          onChange={setFilterStatus}
          className="w-[160px]"
        />
      </div>

      {/* Invoice Table */}
      <div className="bg-surface-bg rounded-corner-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-secondary">
              <th className="text-left p-lg text-label-sm text-text-secondary font-medium">
                Invoice #
              </th>
              <th className="text-left p-lg text-label-sm text-text-secondary font-medium">
                Customer
              </th>
              <th className="text-left p-lg text-label-sm text-text-secondary font-medium">
                Issue Date
              </th>
              <th className="text-left p-lg text-label-sm text-text-secondary font-medium">
                Due Date
              </th>
              <th className="text-right p-lg text-label-sm text-text-secondary font-medium">
                Amount
              </th>
              <th className="text-left p-lg text-label-sm text-text-secondary font-medium">
                Status
              </th>
              <th className="text-right p-lg text-label-sm text-text-secondary font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((inv, i) => {
              const { total } = calcTotal(inv.items, inv.taxRate);
              return (
                <tr
                  key={inv.id}
                  className={`${i !== filtered.length - 1 ? "border-b border-border-secondary" : ""} hover:bg-bg-faint transition-colors`}
                >
                  <td className="p-lg text-label-sm text-brand-primary font-medium">{inv.id}</td>
                  <td className="p-lg">
                    <p className="text-label-sm text-text-primary">{inv.customer}</p>
                    <p className="text-video-title text-text-tertiary">{inv.company}</p>
                  </td>
                  <td className="p-lg text-label-sm text-text-secondary">{inv.issueDate}</td>
                  <td className="p-lg">
                    <span
                      className={`text-label-sm ${inv.status === "overdue" ? "text-danger" : "text-text-secondary"}`}
                    >
                      {inv.dueDate}
                    </span>
                  </td>
                  <td className="p-lg text-label-sm text-text-primary text-right font-medium">
                    $
                    {total.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="p-lg">
                    <Badge label={inv.status} variant={statusColors[inv.status]} />
                  </td>
                  <td className="p-lg">
                    <div className="flex items-center justify-end gap-sm">
                      <Button
                        variant="subtle"
                        size="small"
                        iconStart={<Eye size={16} />}
                        onClick={() => {
                          setSelectedInvoice(inv);
                          setIsViewOpen(true);
                        }}
                      >
                        View
                      </Button>
                      <Button variant="subtle" size="small" iconStart={<Send size={16} />}>
                        Send
                      </Button>
                      <Button variant="subtle" size="small" iconStart={<Printer size={16} />}>
                        Print
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-2xl text-center">
            <p className="text-label text-text-secondary">No invoices found.</p>
          </div>
        )}
      </div>

      {/* View Modal */}
      {selectedInvoice && (
        <Modal
          isOpen={isViewOpen}
          onClose={() => setIsViewOpen(false)}
          title={`Invoice ${selectedInvoice.id}`}
          size="large"
          footer={
            <>
              <Button variant="neutral" onClick={() => setIsViewOpen(false)}>
                Close
              </Button>
              <Button variant="neutral" iconStart={<Printer size={16} />}>
                Print
              </Button>
              <Button variant="primary" iconStart={<Send size={16} />}>
                Send to Customer
              </Button>
            </>
          }
        >
          <InvoicePreview invoice={selectedInvoice} />
        </Modal>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New Invoice"
        size="large"
        footer={
          <>
            <Button variant="neutral" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button variant="neutral" onClick={() => handleCreate(true)}>
              Save as Draft
            </Button>
            <Button variant="primary" onClick={() => handleCreate(false)}>
              Create & Send
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-lg">
          <div className="flex gap-xl">
            <div className="flex-1">
              <SelectField
                label="Customer"
                placeholder="Select customer..."
                options={customerOptions}
                value={createForm.customer}
                onChange={(v) => updateCreateForm("customer", v)}
              />
            </div>
            <div className="flex-1">
              <InputField
                label="Tax Rate (%)"
                placeholder="10"
                value={createForm.taxRate}
                onChange={(v) => updateCreateForm("taxRate", v)}
              />
            </div>
          </div>
          <div className="flex gap-xl">
            <div className="flex-1">
              <InputField
                label="Issue Date"
                type="date"
                value={createForm.issueDate}
                onChange={(v) => updateCreateForm("issueDate", v)}
              />
            </div>
            <div className="flex-1">
              <InputField
                label="Due Date"
                type="date"
                value={createForm.dueDate}
                onChange={(v) => updateCreateForm("dueDate", v)}
              />
            </div>
          </div>

          {/* Line Items */}
          <div className="bg-bg-faint rounded-corner-md p-lg">
            <div className="flex items-center justify-between mb-lg">
              <p className="text-label text-text-primary font-semibold">Line Items</p>
              <Button variant="neutral" size="small" iconStart={<Plus size={16} />} onClick={addItem}>
                Add Item
              </Button>
            </div>
            <div className="flex flex-col gap-sm">
              {/* Header */}
              <div className="grid gap-sm" style={{ gridTemplateColumns: "1fr 80px 100px 100px 36px" }}>
                <span className="text-video-title text-text-secondary">Description</span>
                <span className="text-video-title text-text-secondary text-center">Qty</span>
                <span className="text-video-title text-text-secondary text-right">Rate ($)</span>
                <span className="text-video-title text-text-secondary text-right">Amount</span>
                <span />
              </div>
              {createForm.items.map((item, idx) => (
                <div
                  key={idx}
                  className="grid gap-sm items-center"
                  style={{ gridTemplateColumns: "1fr 80px 100px 100px 36px" }}
                >
                  <InputField
                    placeholder="Service description..."
                    value={item.description}
                    onChange={(v) => updateItem(idx, "description", v)}
                  />
                  <InputField
                    placeholder="1"
                    value={item.qty}
                    onChange={(v) => updateItem(idx, "qty", v)}
                  />
                  <InputField
                    placeholder="0.00"
                    value={item.rate}
                    onChange={(v) => updateItem(idx, "rate", v)}
                  />
                  <div className="text-label-sm text-text-primary text-right font-medium">
                    ${getLineTotal(item).toLocaleString()}
                  </div>
                  <button
                    onClick={() => removeItem(idx)}
                    className="text-text-tertiary hover:text-danger transition-colors flex items-center justify-center"
                    disabled={createForm.items.length === 1}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {/* Totals */}
              <div className="mt-md pt-md border-t border-border-secondary flex flex-col items-end gap-xs">
                <div className="flex gap-xl">
                  <span className="text-label-sm text-text-secondary">Subtotal:</span>
                  <span className="text-label-sm text-text-primary w-[100px] text-right">
                    ${fSubtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex gap-xl">
                  <span className="text-label-sm text-text-secondary">
                    Tax ({createForm.taxRate || 0}%):
                  </span>
                  <span className="text-label-sm text-text-primary w-[100px] text-right">
                    ${fTax.toFixed(2)}
                  </span>
                </div>
                <div className="flex gap-xl">
                  <span className="text-label text-text-primary font-semibold">Total:</span>
                  <span className="text-label text-brand-primary font-semibold w-[100px] text-right">
                    ${fTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <TextareaField
            label="Payment Notes"
            placeholder="Payment terms and notes..."
            value={createForm.notes}
            rows={2}
            onChange={(v) => updateCreateForm("notes", v)}
          />
        </div>
      </Modal>
    </div>
  );
}
