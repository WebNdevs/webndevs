"use client";

import { useState, useId } from "react";
import { DSButton, DSInput } from "./DScomponents";
import { ArrowRight, Calendar } from "lucide-react";
import { API_BASE_URL } from "@/config/api";

const SERVICES = [
  "Web Development",
  "Mobile App Development",
  "UI/UX Design",
  "AI & Automation",
  "Data Analytics",
  "Digital Marketing",
  "Branding & Design",
  "Not Sure / Multiple Services",
];

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  service: SERVICES[0],
  message: "",
  address: "", // Honeypot field for spam prevention
};

type ContactFormData = typeof EMPTY_FORM;

type Status = { state: "idle" } | { state: "loading" } | { state: "success" } | { state: "error"; message: string };

export function CTAForm() {
  const [form, setForm] = useState(EMPTY_FORM);
  const serviceSelectId = useId();
  const projectBriefId = useId();
  const honeypotId = useId();

  const [status, setStatus] = useState<Status>({
    state: "idle",
  });

  const handleChange = (
    field: keyof ContactFormData,
    value: string
  ) => {
    let processedValue = value;
    if (field === "phone") {
      // Allow only numbers, plus, minus, parentheses and spaces for phone number
      processedValue = value.replace(/[^0-9+\-\(\)\s]/g, "");
    }
    setForm((prev) => ({
      ...prev,
      [field]: processedValue,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (status.state === "loading") return;

    setStatus({ state: "loading" });

    // Honeypot check: If the hidden honeypot field is filled, silently discard the request (acting as success)
    if (form.address) {
      setForm({ ...EMPTY_FORM });
      setStatus({ state: "success" });
      return;
    }

    try {
      const serviceSlug = form.service
        .toLowerCase()
        .replace(/ & /g, "-")
        .replace(/ \/ /g, "-")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const response = await fetch(`${API_BASE_URL}/service-inquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service_slug: serviceSlug,
          name: form.name,
          email: form.email,
          phone: form.phone || null,
          project_brief: form.message,
          address: form.address || null, // send honeypot field
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit request.");
      }

      setForm({ ...EMPTY_FORM });

      setStatus({
        state: "success",
      });
    } catch (error) {
      setStatus({
        state: "error",
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong.",
      });
    }
  };

  return (
    <div className="bg-[#1F2937] rounded-2xl p-8 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.5)] border border-[#374151]">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#22C55E] to-[#06B6D4] flex items-center justify-center">
          <Calendar className="w-6 h-6 text-white" />
        </div>

        <div>
          <h3
            style={{ fontSize: "22px" }}
            className="font-bold text-[#F9FAFB]"
          >
            Get Started Today
          </h3>
          <p className="text-[14px] text-[#9CA3AF]">
            Fill out the form below
          </p>
        </div>
      </div>

      {status.state === "success" ? (
        <div className="text-center py-8">
          <p className="text-[20px] font-semibold text-[#22C55E] mb-2">
            Request Sent Successfully!
          </p>

          <p className="text-[#9CA3AF] mb-6">
            We&apos;ll get back to you within 24 hours.
          </p>

          <button
            type="button"
            onClick={() => setStatus({ state: "idle" })}
            className="text-[#22C55E] hover:underline"
          >
            Send Another Request
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Honeypot field (hidden from users, will be filled by spam bots) */}
          <div className="hidden" aria-hidden="true">
            <input
              id={honeypotId}
              type="text"
              name="address"
              value={form.address}
              onChange={(e) =>
                handleChange("address", e.target.value)
              }
              tabIndex={-1}
              autoComplete="off"
              aria-label="Do not fill this field if you are a human"
            />
          </div>
          <DSInput
            label="Full Name"
            type="text"
            placeholder="John Smith"
            required
            value={form.name}
            onChange={(e) =>
              handleChange("name", e.target.value)
            }
          />

          <DSInput
            label="Email Address"
            type="email"
            placeholder="john@company.com"
            required
            value={form.email}
            onChange={(e) =>
              handleChange("email", e.target.value)
            }
          />

          <DSInput
            label="Phone Number"
            type="tel"
            placeholder="+1 (234) 567-890"
            value={form.phone}
            onChange={(e) =>
              handleChange("phone", e.target.value)
            }
          />

          <div>
            <label htmlFor={serviceSelectId} className="block text-[#F9FAFB] text-[14px] font-medium mb-2">
              What service are you interested in?
            </label>

            <select
              id={serviceSelectId}
              value={form.service}
              onChange={(e) =>
                handleChange("service", e.target.value)
              }
              className="w-full px-4 py-3 bg-[#111827] border border-[#374151] rounded-lg text-[#F9FAFB] text-[16px] outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 transition-colors"
            >
              {SERVICES.map((service) => (
                <option
                  key={service}
                  value={service}
                >
                  {service}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor={projectBriefId} className="block text-[#F9FAFB] text-[14px] font-medium mb-2">
              Tell us about your project
            </label>

            <textarea
              id={projectBriefId}
              rows={4}
              required
              minLength={10}
              value={form.message}
              onChange={(e) =>
                handleChange("message", e.target.value)
              }
              placeholder="Describe your project goals, timeline, and any specific requirements..."
              className="w-full px-4 py-3 bg-[#111827] border border-[#374151] rounded-lg text-[#F9FAFB] text-[16px] placeholder:text-[#6B7280] outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 transition-colors resize-none"
            />
          </div>

          {status.state === "error" && (
            <p className="text-[13px] text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
              {status.message}
            </p>
          )}

          <DSButton
            type="submit"
            size="lg"
            className="w-full"
            disabled={status.state === "loading"}
          >
            {status.state === "loading"
              ? "Sending..."
              : "Schedule Free Consultation"}

            {status.state !== "loading" && (
              <ArrowRight className="ml-2 w-5 h-5" />
            )}
          </DSButton>

          <p className="text-[12px] text-[#9CA3AF] text-center">
            By submitting, you agree to our privacy
            policy. We never share your information.
          </p>
        </form>
      )}
    </div>
  );
}