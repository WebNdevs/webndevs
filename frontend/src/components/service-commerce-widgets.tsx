"use client";
import { useMemo, useState } from 'react';
import { Check } from 'lucide-react';
import { DSButton, DSCard, DSInput, DSBadge} from './pages';


export type ServiceCommercePlan = {
  id: number;
  plan_key?: string;
  name: string;
  price: number;
  billing_cycle: 'one_time' | 'monthly';
  delivery_days: number | null;
  description: string | null;
  features: string[];
  is_featured: boolean;
  custom_config?: {
    offer_label?: string;
    offer_type?: 'flat' | 'percent';
    offer_value?: number;
    offer_active?: boolean;
  };
};

type PackageSelectorProps = {
  title: string;
  subtitle: string;
  plans: ServiceCommercePlan[];
  onChoosePlan: (plan: ServiceCommercePlan) => void;
};

type ComparisonTableProps = {
  plans: ServiceCommercePlan[];
};

type PricingCalculatorProps = {
  plans: ServiceCommercePlan[];
  selectedPlanKey: string;
  onSelectPlanKey: (planKey: string) => void;
};

type BookingFormModel = {
  name: string;
  email: string;
  phone: string;
  company: string;
  budget: string;
  project_brief: string;
};

type BookingInteractionProps = {
  plans: ServiceCommercePlan[];
  selectedPlanKey: string;
  onSelectPlanKey: (planKey: string) => void;
  form: BookingFormModel;
  errors: Record<string, string>;
  onChange: (key: keyof BookingFormModel, value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  status: { loading: boolean; error: string; success: string };
  submitLabel: string;
};

function normalizeKey(plan: ServiceCommercePlan): string {
  return plan.plan_key ?? plan.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

export function ServicePackageSelector({ title, subtitle, plans, onChoosePlan }: PackageSelectorProps) {
  return (
    <section className="py-20 px-6 bg-[#0B0F14]">
      <div className="max-w-6xl mx-auto ">
        <h2 style={{ fontSize: '42px' }} className="font-bold text-[#F9FAFB] text-center mb-4">
          {title}
        </h2>
        <p style={{ fontSize: '18px' }} className="text-[#9CA3AF] text-center mb-12 max-w-3xl mx-auto">
          {subtitle}
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const hasOffer = Boolean(plan.custom_config?.offer_active && plan.custom_config?.offer_type && plan.custom_config?.offer_value);
            const originalPrice = Number(plan.price);
            const discountedPrice =
              hasOffer && plan.custom_config?.offer_type === "percent"
                ? Math.round(originalPrice - originalPrice * (Number(plan.custom_config?.offer_value) / 100))
                : hasOffer && plan.custom_config?.offer_type === "flat"
                  ? Math.max(originalPrice - Number(plan.custom_config?.offer_value), 0)
                  : originalPrice;

            return (
            <DSCard key={plan.id} hover className={`relative overflow-visible border transition-all duration-300 hover:-translate-y-3 hover:border-[#22C55E] hover:shadow-[0_20px_50px_-20px_rgba(34,197,94,0.55)]
                ${plan.is_featured ? 'border-[#22C55E] shadow-[0_20px_50px_-20px_rgba(34,197,94,0.55)]' : 'border-transparent'}`}>
              {plan.custom_config?.offer_active && plan.custom_config?.offer_label && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-linear-to-r from-[#22C55E] to-[#06B6D4] px-4 py-1 text-[12px] font-semibold text-[#0B0F14] shadow-lg z-20">
                  {plan.custom_config?.offer_label}
                </div>
              )}

              {plan.is_featured && !plan.custom_config?.offer_active && (
                <DSBadge variant="success" className="mb-4">
                  Most Popular
                </DSBadge>
              )}
              <h3 style={{ fontSize: '24px' }} className="font-semibold text-[#F9FAFB] mb-2">
                {plan.name}
              </h3>
              {hasOffer ? (
                <div className="mb-2">
                  <p className="text-[16px] text-[#9CA3AF] line-through">
                    ${originalPrice.toLocaleString()}
                  </p>
                  <p style={{ fontSize: '34px' }} className="font-bold text-[#22C55E]">
                    ${discountedPrice.toLocaleString()}
                  </p>
                </div>
              ) : (
                <p style={{ fontSize: '34px' }} className="font-bold text-[#22C55E] mb-2">
                  ${originalPrice.toLocaleString()}
                </p>
              )}
              <p className="text-[14px] text-[#9CA3AF] mb-4">
                {plan.billing_cycle === 'monthly' ? 'Monthly plan' : 'One-time project pricing'}
                {plan.delivery_days ? ` • ${plan.delivery_days} days delivery` : ''}
              </p>
              {plan.description && <p className="text-[14px] text-[#9CA3AF] mb-4 leading-relaxed">{plan.description}</p>}
              <div className="space-y-2 mb-6">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#22C55E] mt-0.5" />
                    <p className="text-[14px] text-[#F9FAFB]">{feature}</p>
                  </div>
                ))}
              </div>
              <DSButton className="w-full" onClick={() => onChoosePlan(plan)}>
                Choose {plan.name}
              </DSButton>
            </DSCard>
          )})}
        </div>
      </div>
    </section>
  );
}

export function ServiceComparisonTable({ plans }: ComparisonTableProps) {
  if (plans.length < 2) {
    return null;
  }

  const allFeatures = Array.from(new Set(plans.flatMap((plan) => plan.features)));

  return (
    <section className="py-20 px-6 bg-[#111827]">
      <div className="max-w-6xl mx-auto">
        <h3 style={{ fontSize: '34px' }} className="font-bold text-[#F9FAFB] text-center mb-8">
          Plan Comparison
        </h3>
        <div className="overflow-x-auto rounded-xl border border-[#374151]">
          <table className="w-full min-w-[720px] text-left">
            <thead className="bg-[#0B0F14]">
              <tr>
                <th className="px-4 py-3 text-[13px] text-[#9CA3AF] font-semibold">Feature</th>
                {plans.map((plan) => (
                  <th key={plan.id} className="px-4 py-3 text-[13px] text-[#F9FAFB] font-semibold">
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-[#374151]">
                <td className="px-4 py-3 text-[14px] text-[#9CA3AF]">Price</td>
                {plans.map((plan) => (
                  <td key={plan.id} className="px-4 py-3 text-[14px] text-[#F9FAFB]">${Number(plan.price).toLocaleString()}</td>
                ))}
              </tr>
              <tr className="border-t border-[#374151]">
                <td className="px-4 py-3 text-[14px] text-[#9CA3AF]">Delivery</td>
                {plans.map((plan) => (
                  <td key={plan.id} className="px-4 py-3 text-[14px] text-[#F9FAFB]">{plan.delivery_days ? `${plan.delivery_days} days` : 'Custom'}</td>
                ))}
              </tr>
              {allFeatures.map((feature) => (
                <tr key={feature} className="border-t border-[#374151]">
                  <td className="px-4 py-3 text-[14px] text-[#9CA3AF]">{feature}</td>
                  {plans.map((plan) => (
                    <td key={`${plan.id}-${feature}`} className="px-4 py-3 text-[14px] text-[#F9FAFB]">
                      {plan.features.includes(feature) ? 'Yes' : 'No'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export function ServicePricingCalculator({ plans, selectedPlanKey, onSelectPlanKey }: PricingCalculatorProps) {
  const [quantity, setQuantity] = useState('1');
  const [includeSupport, setIncludeSupport] = useState(false);
  const [includeRush, setIncludeRush] = useState(false);

  const selectedPlan = useMemo(
    () => plans.find((plan) => normalizeKey(plan) === selectedPlanKey) ?? plans[0] ?? null,
    [plans, selectedPlanKey],
  );

  if (!selectedPlan) {
    return null;
  }

  const qty = Math.max(Number.parseInt(quantity || '1', 10), 1);
  const base = getPlanPrice(selectedPlan) * qty;
  const supportFee = includeSupport ? 199 : 0;
  const rushFee = includeRush ? Math.round(base * 0.2) : 0;
  const total = base + supportFee + rushFee;

  function getPlanPrice(plan: ServiceCommercePlan): number {
    const price = Number(plan.price);
    const hasOffer = Boolean(plan.custom_config?.offer_active && plan.custom_config?.offer_type && plan.custom_config?.offer_value);
    const offerType = plan.custom_config?.offer_type;
    const offerValue = Number(plan.custom_config?.offer_value ?? 0);

    if (!hasOffer) return price;

    if (offerType === "percent") {
      return Math.round(price - price * (offerValue / 100));
    }

    if (offerType === "flat") {
      return Math.max(price - Number(offerValue), 0);
    }

    return price;
  }

  return (
    <section className="py-16 px-6 bg-[#0B0F14]">
      <div className="max-w-4xl mx-auto">
        <DSCard>
          <h3 style={{ fontSize: '28px' }} className="font-bold text-[#F9FAFB] mb-2">Pricing Calculator</h3>
          <p className="text-[14px] text-[#9CA3AF] mb-6">Estimate your budget before sending your project brief.</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#F9FAFB] text-[14px] font-medium mb-2">Plan</label>
              <select
                value={normalizeKey(selectedPlan)}
                onChange={(event) => onSelectPlanKey(event.target.value)}
                className="w-full px-4 py-3 bg-[#111827] border border-[#374151] rounded-lg text-[#F9FAFB] text-[16px] outline-none focus:ring-2 focus:ring-[#22C55E]/20 focus:border-[#22C55E]"
              >
                {plans.map((plan) => (
                  <option key={plan.id} value={normalizeKey(plan)}>
                    {plan.name}
                  </option>
                ))}
              </select>
            </div>
            <DSInput label="Project Quantity" value={quantity} onChange={(event) => setQuantity(event.target.value)} />
          </div>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <label className="flex items-center gap-2 text-[#9CA3AF] text-[14px]">
              <input type="checkbox" checked={includeSupport} onChange={(event) => setIncludeSupport(event.target.checked)} />
              Include monthly support (+$199)
            </label>
            <label className="flex items-center gap-2 text-[#9CA3AF] text-[14px]">
              <input type="checkbox" checked={includeRush} onChange={(event) => setIncludeRush(event.target.checked)} />
              Rush delivery (+20%)
            </label>
          </div>
          <div className="mt-6 pt-4 border-t border-[#374151]">
            <p className="text-[15px] text-[#9CA3AF]">Estimated Total</p>
            <p style={{ fontSize: '30px' }} className="font-bold text-[#22C55E]">${total.toLocaleString()}</p>
            {selectedPlan.custom_config?.offer_active && selectedPlan.custom_config?.offer_label && (
              <p className="mt-2 text-[13px] text-[#22C55E]">
                Offer applied: {selectedPlan.custom_config?.offer_label}
              </p>
            )}
          </div>
        </DSCard>
      </div>
    </section>
  );
}

export function ServiceBookingInteraction({
  plans,
  selectedPlanKey,
  onSelectPlanKey,
  form,
  errors,
  onChange,
  onSubmit,
  status,
  submitLabel,
}: BookingInteractionProps) {
  return (
    <form onSubmit={onSubmit} className="max-w-xl mx-auto space-y-4 mb-8 text-left">
      <div>
        <label className="block text-[#F9FAFB] text-[14px] font-medium mb-2">Selected Plan</label>
        <select
          value={selectedPlanKey}
          onChange={(event) => onSelectPlanKey(event.target.value)}
          className="w-full px-4 py-3 bg-[#111827] border border-[#374151] rounded-lg text-[#F9FAFB] text-[16px] outline-none focus:ring-2 focus:ring-[#22C55E]/20 focus:border-[#22C55E]"
        >
          {plans.map((plan) => (
            <option key={plan.id} value={normalizeKey(plan)}>
              {plan.name} - ${Number(plan.price).toLocaleString()}
            </option>
          ))}
        </select>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <DSInput label="Your Name" value={form.name} onChange={(event) => onChange('name', event.target.value)} error={errors.name} />
        <DSInput label="Email Address" type="email" value={form.email} onChange={(event) => onChange('email', event.target.value)} error={errors.email} />
        <DSInput label="Phone Number" value={form.phone} onChange={(event) => onChange('phone', event.target.value)} error={errors.phone} />
        <DSInput label="Company" value={form.company} onChange={(event) => onChange('company', event.target.value)} error={errors.company} />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <DSInput label="Budget Range" value={form.budget} onChange={(event) => onChange('budget', event.target.value)} error={errors.budget} />
      </div>
      <div>
        <label className="block text-[#F9FAFB] text-[14px] font-medium mb-2">Project Brief</label>
        <textarea
          value={form.project_brief}
          onChange={(event) => onChange('project_brief', event.target.value)}
          rows={4}
          className={`w-full px-4 py-3 bg-[#111827] border ${errors.project_brief ? 'border-[#EF4444]' : 'border-[#374151]'} rounded-lg text-[#F9FAFB] text-[16px] outline-none focus:ring-2 ${errors.project_brief ? 'focus:ring-[#EF4444]/20 focus:border-[#EF4444]' : 'focus:ring-[#22C55E]/20 focus:border-[#22C55E]'}`}
        />
        {errors.project_brief && <p className="mt-2 text-[14px] text-[#EF4444]">{errors.project_brief}</p>}
      </div>
      {status.error && <p className="text-[14px] text-[#EF4444]">{status.error}</p>}
      {status.success && <p className="text-[14px] text-[#22C55E]">{status.success}</p>}
      <DSButton type="submit" size="lg" className="w-full" disabled={status.loading}>
        {status.loading ? 'Submitting...' : submitLabel}
      </DSButton>
    </form>
  );
}
