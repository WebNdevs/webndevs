"use client";

import React, { useState } from "react";
import { Calculator, Zap, DollarSign, Clock, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";

export function FreeCalculators() {
  const [activeTab, setActiveTab] = useState<"cost" | "roi">("cost");

  // Cost Calculator State
  const [projectType, setProjectType] = useState<"website" | "webapp" | "ecommerce" | "ai_automation">("webapp");
  const [scope, setScope] = useState<"basic" | "growth" | "enterprise">("growth");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    "auth",
    "cms",
    "seo",
  ]);
  const [designComplexity, setDesignComplexity] = useState<"standard" | "custom" | "premium">("custom");

  // ROI Calculator State
  const [teamSize, setTeamSize] = useState<number>(5);
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(10);
  const [hourlyRate, setHourlyRate] = useState<number>(45);
  const [automationPct, setAutomationPct] = useState<number>(60);

  // Base Prices
  const basePrices = {
    website: { basic: 1500, growth: 3500, enterprise: 7500 },
    webapp: { basic: 3500, growth: 7500, enterprise: 15000 },
    ecommerce: { basic: 2500, growth: 5500, enterprise: 12000 },
    ai_automation: { basic: 2000, growth: 5000, enterprise: 10000 },
  };

  const featureCosts: Record<string, number> = {
    auth: 500,
    cms: 800,
    seo: 600,
    payment: 700,
    analytics: 400,
    ai_bot: 1500,
    integrations: 1200,
  };

  const designMultipliers = {
    standard: 1.0,
    custom: 1.25,
    premium: 1.6,
  };

  const toggleFeature = (id: string) => {
    if (selectedFeatures.includes(id)) {
      setSelectedFeatures(selectedFeatures.filter((f) => f !== id));
    } else {
      setSelectedFeatures([...selectedFeatures, id]);
    }
  };

  // Compute Cost
  const baseCost = basePrices[projectType][scope];
  const featuresTotal = selectedFeatures.reduce(
    (acc, f) => acc + (featureCosts[f] || 0),
    0
  );
  const estimatedCostMin = Math.round(
    (baseCost + featuresTotal) * designMultipliers[designComplexity]
  );
  const estimatedCostMax = Math.round(estimatedCostMin * 1.35);

  // Compute ROI
  const weeklyHoursSpent = teamSize * hoursPerWeek;
  const yearlyHoursSpent = weeklyHoursSpent * 52;
  const yearlyCurrentCost = yearlyHoursSpent * hourlyRate;
  
  const yearlyHoursSaved = Math.round(yearlyHoursSpent * (automationPct / 100));
  const yearlyCostSaved = Math.round(yearlyCurrentCost * (automationPct / 100));
  const monthlyCostSaved = Math.round(yearlyCostSaved / 12);

  return (
    <div className="w-full max-w-5xl mx-auto my-12 p-6 md:p-8 rounded-2xl bg-[#111827] border border-[#1F2937] shadow-2xl text-[#F9FAFB]">
      <div className="flex flex-col md:flex-row items-center justify-between pb-6 mb-8 border-b border-[#1F2937] gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#22C55E]/10 text-[#22C55E] text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Interactive Business Utilities
          </div>
          <h2 className="text-2xl md:text-3xl font-bold">
            Free Project Cost & ROI Estimator
          </h2>
          <p className="text-[#9CA3AF] text-sm mt-1">
            Calculate your custom software project cost or evaluate potential AI automation savings instantly.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#1F2937] p-1.5 rounded-xl border border-[#374151]">
          <button
            onClick={() => setActiveTab("cost")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "cost"
                ? "bg-[#22C55E] text-[#090D11] shadow-lg font-semibold"
                : "text-[#9CA3AF] hover:text-[#F9FAFB]"
            }`}
          >
            <Calculator className="w-4 h-4" /> Cost Estimator
          </button>
          <button
            onClick={() => setActiveTab("roi")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "roi"
                ? "bg-[#22C55E] text-[#090D11] shadow-lg font-semibold"
                : "text-[#9CA3AF] hover:text-[#F9FAFB]"
            }`}
          >
            <Zap className="w-4 h-4" /> AI ROI Calculator
          </button>
        </div>
      </div>

      {activeTab === "cost" ? (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Controls */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Type */}
            <div>
              <label className="block text-sm font-semibold text-[#E5E7EB] mb-2">
                1. Select Project Category
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { id: "website", label: "Business Site" },
                  { id: "webapp", label: "Custom Web App" },
                  { id: "ecommerce", label: "E-Commerce" },
                  { id: "ai_automation", label: "AI Automation" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setProjectType(item.id as any)}
                    className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                      projectType === item.id
                        ? "border-[#22C55E] bg-[#22C55E]/10 text-[#22C55E]"
                        : "border-[#374151] bg-[#1F2937]/50 text-[#9CA3AF] hover:border-[#4B5563]"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Scope */}
            <div>
              <label className="block text-sm font-semibold text-[#E5E7EB] mb-2">
                2. Project Scale & Complexity
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "basic", label: "MVP / Starter", desc: "Core essentials" },
                  { id: "growth", label: "Growth / Business", desc: "Feature rich" },
                  { id: "enterprise", label: "Enterprise", desc: "Custom scale" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setScope(item.id as any)}
                    className={`p-3 rounded-xl text-left border transition-all ${
                      scope === item.id
                        ? "border-[#22C55E] bg-[#22C55E]/10 text-[#F9FAFB]"
                        : "border-[#374151] bg-[#1F2937]/50 text-[#9CA3AF] hover:border-[#4B5563]"
                    }`}
                  >
                    <div className="text-xs font-bold text-[#F9FAFB]">{item.label}</div>
                    <div className="text-[11px] text-[#9CA3AF] mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Features Checkboxes */}
            <div>
              <label className="block text-sm font-semibold text-[#E5E7EB] mb-2">
                3. Additional Integrations & Modules
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { id: "auth", label: "Auth & User Roles", price: "+$500" },
                  { id: "cms", label: "Custom CMS Admin", price: "+$800" },
                  { id: "seo", label: "Advanced SEO & Schemas", price: "+$600" },
                  { id: "payment", label: "Stripe/Payment Gateway", price: "+$700" },
                  { id: "ai_bot", label: "AI Chatbot / Assistant", price: "+$1,500" },
                  { id: "integrations", label: "CRM / API Connections", price: "+$1,200" },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => toggleFeature(f.id)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs text-left transition-all ${
                      selectedFeatures.includes(f.id)
                        ? "border-[#22C55E] bg-[#22C55E]/10 text-[#F9FAFB]"
                        : "border-[#374151] bg-[#1F2937]/50 text-[#9CA3AF] hover:border-[#4B5563]"
                    }`}
                  >
                    <span className="font-medium">{f.label}</span>
                    <span className="text-[10px] text-[#22C55E] font-semibold">{f.price}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Design Level */}
            <div>
              <label className="block text-sm font-semibold text-[#E5E7EB] mb-2">
                4. Design Polish & Micro-Animations
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "standard", label: "Standard UI" },
                  { id: "custom", label: "Custom UX/UI" },
                  { id: "premium", label: "Bespoke & Micro-Motion" },
                ].map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setDesignComplexity(d.id as any)}
                    className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                      designComplexity === d.id
                        ? "border-[#22C55E] bg-[#22C55E]/10 text-[#22C55E]"
                        : "border-[#374151] bg-[#1F2937]/50 text-[#9CA3AF] hover:border-[#4B5563]"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="flex flex-col justify-between p-6 rounded-2xl bg-gradient-to-br from-[#1F2937] to-[#111827] border border-[#374151] shadow-xl">
            <div>
              <div className="text-xs uppercase font-bold tracking-wider text-[#9CA3AF] mb-1">
                Estimated Project Budget
              </div>
              <div className="text-3xl lg:text-4xl font-extrabold text-[#22C55E] my-3">
                ${estimatedCostMin.toLocaleString()} – ${estimatedCostMax.toLocaleString()}
              </div>
              <p className="text-xs text-[#9CA3AF] leading-relaxed mb-6">
                Includes design system architecture, modern Next.js/Laravel stack, full SEO optimization, and 30-day post-launch warranty.
              </p>

              <div className="space-y-3 pt-4 border-t border-[#374151] text-xs">
                <div className="flex justify-between text-[#D1D5DB]">
                  <span>Estimated Delivery:</span>
                  <span className="font-semibold text-[#F9FAFB]">
                    {scope === "basic" ? "2-3 Weeks" : scope === "growth" ? "4-6 Weeks" : "8-12 Weeks"}
                  </span>
                </div>
                <div className="flex justify-between text-[#D1D5DB]">
                  <span>Included Support:</span>
                  <span className="font-semibold text-[#22C55E]">30 Days Free</span>
                </div>
                <div className="flex justify-between text-[#D1D5DB]">
                  <span>Code Ownership:</span>
                  <span className="font-semibold text-[#F9FAFB]">100% Client Owned</span>
                </div>
              </div>
            </div>

            <a
              href={`/contact?project=${projectType}&scope=${scope}&est=${estimatedCostMin}`}
              className="mt-8 flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl bg-[#22C55E] hover:bg-[#16A34A] text-[#090D11] font-bold text-sm transition-all shadow-lg hover:shadow-green-500/20"
            >
              Get Exact Proposal Quote <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Controls for ROI */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex justify-between text-sm font-semibold text-[#E5E7EB] mb-2">
                <span>Team Members Performing Repetitive Tasks:</span>
                <span className="text-[#22C55E] font-bold">{teamSize} People</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                value={teamSize}
                onChange={(e) => setTeamSize(Number(e.target.value))}
                className="w-full accent-[#22C55E] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm font-semibold text-[#E5E7EB] mb-2">
                <span>Hours Spent Per Person / Week on Manual Tasks:</span>
                <span className="text-[#22C55E] font-bold">{hoursPerWeek} Hours/wk</span>
              </div>
              <input
                type="range"
                min="2"
                max="30"
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                className="w-full accent-[#22C55E] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm font-semibold text-[#E5E7EB] mb-2">
                <span>Average Hourly Cost per Employee ($):</span>
                <span className="text-[#22C55E] font-bold">${hourlyRate}/hr</span>
              </div>
              <input
                type="range"
                min="20"
                max="150"
                step="5"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                className="w-full accent-[#22C55E] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm font-semibold text-[#E5E7EB] mb-2">
                <span>Target Workflow Automation Rate:</span>
                <span className="text-[#22C55E] font-bold">{automationPct}% Automated</span>
              </div>
              <input
                type="range"
                min="30"
                max="90"
                step="5"
                value={automationPct}
                onChange={(e) => setAutomationPct(Number(e.target.value))}
                className="w-full accent-[#22C55E] cursor-pointer"
              />
            </div>
          </div>

          {/* ROI Summary Box */}
          <div className="flex flex-col justify-between p-6 rounded-2xl bg-gradient-to-br from-[#1F2937] to-[#111827] border border-[#374151] shadow-xl">
            <div>
              <div className="text-xs uppercase font-bold tracking-wider text-[#9CA3AF] mb-1">
                Estimated Annual Savings
              </div>
              <div className="text-3xl lg:text-4xl font-extrabold text-[#22C55E] my-3">
                ${yearlyCostSaved.toLocaleString()} <span className="text-xs text-[#9CA3AF] font-normal">/ year</span>
              </div>

              <div className="grid grid-cols-2 gap-3 my-4 p-3 bg-[#111827]/80 rounded-xl border border-[#374151]">
                <div>
                  <div className="text-[10px] text-[#9CA3AF] uppercase font-semibold">Monthly Saved</div>
                  <div className="text-lg font-bold text-[#F9FAFB]">${monthlyCostSaved.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#9CA3AF] uppercase font-semibold">Hours Saved</div>
                  <div className="text-lg font-bold text-[#22C55E]">{yearlyHoursSaved.toLocaleString()} hrs</div>
                </div>
              </div>

              <p className="text-xs text-[#9CA3AF] leading-relaxed">
                By automating repetitive data entry, reporting, customer inquiries, and document processing with WebNDevs custom AI workflows.
              </p>
            </div>

            <a
              href={`/contact?reason=ai_automation&savings=${yearlyCostSaved}`}
              className="mt-8 flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl bg-[#22C55E] hover:bg-[#16A34A] text-[#090D11] font-bold text-sm transition-all shadow-lg hover:shadow-green-500/20"
            >
              Automate My Workflows <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
