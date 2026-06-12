import React, { useEffect, useMemo, useState } from 'react';
import { ServicePageData } from '../types/service-page';
import { DSButton } from './ds-button';
import { DSCard } from './ds-card';
import { DSInput } from './ds-input';
import { API_BASE_URL } from '../../config/api.config';
import { ServiceBookingInteraction, ServiceComparisonTable, ServicePackageSelector, ServicePricingCalculator } from './service-commerce-widgets';
import { 
  ArrowLeft,
  ArrowRight, 
  Check, 
  ChevronDown,
  ExternalLink,
  Quote,
  Plus,
  Save,
  TrendingUp,
  Trash2,
  Shield,
  Rocket,
  Zap,
  Star,
  CheckCircle,
  BadgeCheck,
  Target,
  Handshake,
  Award,
  Gauge,
  Workflow,
  Sparkles,
  Lightbulb,
  Gem,
  Crown,
  Medal,
  ThumbsUp,
  Lock,
  ShieldCheck,
} from 'lucide-react';
import { DSBadge } from './ds-badge';

interface ServicePageTemplateProps {
  data: ServicePageData;
  serviceSlug: string;
  onBackHome: () => void;
  initialSyncToken?: string | null;
  plans?: {
    id: number;
    plan_key?: string;
    name: string;
    price: number;
    billing_cycle: 'one_time' | 'monthly';
    delivery_days: number | null;
    description: string | null;
    features: string[];
    is_featured: boolean;
    is_active: boolean;
    custom_config?: {
      offer_label?: string;
      offer_type?: "flat" | "percent";
      offer_value?: number;
      offer_active?: boolean;
    };
  }[];
}

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  errors: Record<string, string[]> | string[] | [];
};

type EditablePlan = {
  row_id: string;
  plan_key: string;
  name: string;
  price: string;
  billing_cycle: 'one_time' | 'monthly';
  delivery_days: string;
  description: string;
  features_text: string;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
};

type ServicePlanSyncPayload = {
  sync_token: string | null;
  plans: Array<{
    id: number;
    plan_key: string;
    name: string;
    price: string | number;
    billing_cycle: 'one_time' | 'monthly';
    delivery_days: number | null;
    description: string | null;
    features: string[] | null;
    is_featured: boolean;
    is_active: boolean;
    display_order: number;
  }>;
};

type ManagedSectionItem = {
  title?: string | null;
  description?: string | null;
  value?: string | null;
  question?: string | null;
  answer?: string | null;
  name?: string | null;
  role?: string | null;
  quote?: string | null;
  metric?: string | null;
  author_name?: string | null;
  author_title?: string | null;
  company?: string | null;
  content?: string | null;
  rating?: number | string | null;
  category?: string | null;
  results?: string[] | null;
  technologies?: string[] | null;
  icon?: string | null;
  number?: string | null;
  project_url?: string | null;
  url?: string | null;
};

type ManagedSection = {
  section_key: string;
  heading: string | null;
  subheading: string | null;
  is_active: boolean;
  items: ManagedSectionItem[];
};

type PackageOffer = {
  plan_key: string | null;
  name: string;
  offer_type: "percentage_discount" | "fixed_discount" | "bundle";
  discount_value: string | number | null;
  is_active: boolean;
};

type ServiceSectionsPayload = {
  service: {
    id: number;
    name: string;
    slug: string;
  };
  locale: string;
  stage: "draft" | "published";
  sections: ManagedSection[];
};

const TOKEN_KEYS = ['wnd_admin_token', 'admin_token', 'auth_token', 'token', 'access_token'];
const EMPTY_SERVICE_PLANS: ServicePageTemplateProps['plans'] = [];

const defaultTestimonials = [
  {
    name: 'Amit Sharma',
    role: 'Founder, FinanceFlow',
    quote: 'WebNDevs delivered a production-ready platform with clean architecture, better UX, and zero launch delays.',
  },
  {
    name: 'Sara Khan',
    role: 'Marketing Head, EcoShop',
    quote: 'The team improved page speed and conversion flow. Our paid campaigns started performing much better.',
  },
  {
    name: 'Rohit Verma',
    role: 'COO, HealthHub',
    quote: 'From planning to deployment, communication stayed clear and execution quality remained top-notch.',
  },
];

function resolveStoredToken(): string {
  for (const key of TOKEN_KEYS) {
    const value = localStorage.getItem(key)?.trim();
    if (value) {
      if (key !== TOKEN_KEYS[0]) {
        localStorage.setItem(TOKEN_KEYS[0], value);
      }
      return value;
    }
  }
  return '';
}

function toKey(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function defaultEditablePlans(): EditablePlan[] {
  return [
    { row_id: 'plan-default-basic', plan_key: 'basic', name: 'Basic', price: '999', billing_cycle: 'one_time', delivery_days: '7', description: 'Best for startups and quick launches.', features_text: 'Responsive design\nSEO basics\nContact form', is_featured: false, is_active: true, display_order: 0 },
    { row_id: 'plan-default-standard', plan_key: 'standard', name: 'Standard', price: '2499', billing_cycle: 'one_time', delivery_days: '14', description: 'Balanced package for growth-focused teams.', features_text: 'Everything in Basic\nCMS integration\nAnalytics setup', is_featured: true, is_active: true, display_order: 1 },
    { row_id: 'plan-default-premium', plan_key: 'premium', name: 'Premium', price: '4999', billing_cycle: 'one_time', delivery_days: '21', description: 'Advanced package for scale and performance.', features_text: 'Everything in Standard\nCustom integrations\nPriority support', is_featured: false, is_active: true, display_order: 2 },
  ];
}

function fromRemotePlan(plan: ServicePlanSyncPayload['plans'][number]): EditablePlan {
  return {
    row_id: `plan-${plan.id}`,
    plan_key: plan.plan_key,
    name: plan.name,
    price: String(plan.price ?? ''),
    billing_cycle: plan.billing_cycle,
    delivery_days: plan.delivery_days ? String(plan.delivery_days) : '',
    description: plan.description ?? '',
    features_text: (plan.features ?? []).join('\n'),
    is_featured: Boolean(plan.is_featured),
    is_active: Boolean(plan.is_active),
    display_order: plan.display_order ?? 0,
  };
}

export function ServicePageTemplate({ data, serviceSlug, onBackHome, initialSyncToken = null, plans = EMPTY_SERVICE_PLANS }: ServicePageTemplateProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [remotePlans, setRemotePlans] = useState<ServicePageTemplateProps["plans"]>([]);
  const [packageOffers, setPackageOffers] = useState<PackageOffer[]>([]);
  const [selectedPlanKey, setSelectedPlanKey] = useState<string>('');
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    budget: '',
    project_brief: '',
  });
  const [bookingErrors, setBookingErrors] = useState<Record<string, string>>({});
  const [bookingStatus, setBookingStatus] = useState({ loading: false, error: '', success: '' });
  const [isPlanManagerVisible, setIsPlanManagerVisible] = useState(false);
  const [canManagePlans, setCanManagePlans] = useState(false);
  const [editablePlans, setEditablePlans] = useState<EditablePlan[]>([]);
  const [syncToken, setSyncToken] = useState<string | null>(null);
  const [managerState, setManagerState] = useState({ saving: false, error: '', success: '' });
  const [managedSections, setManagedSections] = useState<ManagedSection[]>([]);

  const sourcePlans = remotePlans.length > 0 ? remotePlans : plans;

  const activePlans = useMemo(() => {
    if (sourcePlans.length === 0) {
      return defaultEditablePlans()
        .filter((plan) => plan.is_active)
        .map((plan, index) => ({
          id: index + 1,
          plan_key: plan.plan_key,
          name: plan.name,
          price: Number(plan.price),
          billing_cycle: plan.billing_cycle,
          delivery_days: plan.delivery_days ? Number(plan.delivery_days) : null,
          description: plan.description,
          features: plan.features_text.split('\n').map((item) => item.trim()).filter(Boolean),
          is_featured: plan.is_featured,
          is_active: plan.is_active,
        }));
    }

    return sourcePlans.filter((plan) => plan.is_active);
  }, [sourcePlans]);
  const activePlansWithOffers = useMemo(() => {
  return activePlans.map((plan) => {
    const offer = packageOffers.find(
      (item) => item.is_active && item.plan_key === plan.plan_key
    );

    if (!offer) return plan;

    return {
      ...plan,
      custom_config: {
        ...(plan.custom_config ?? {}),
        offer_label: offer.name,
        offer_type:
          offer.offer_type === "percentage_discount"
            ? "percent"
            : offer.offer_type === "fixed_discount"
              ? "flat"
              : undefined,
        offer_value: Number(offer.discount_value ?? 0),
        offer_active: true,
      },
    };
  });
}, [activePlans, packageOffers]);
  const activePlansSeed = useMemo(
    () =>
      JSON.stringify(
        activePlans.map((plan) => ({
          id: plan.id,
          plan_key: plan.plan_key ?? '',
          name: plan.name,
          price: plan.price,
          billing_cycle: plan.billing_cycle,
          delivery_days: plan.delivery_days,
          description: plan.description ?? '',
          features: plan.features ?? [],
          is_featured: Boolean(plan.is_featured),
          is_active: Boolean(plan.is_active),
        })),
      ),
    [activePlans],
  );

  const testimonials = data.testimonials && data.testimonials.length > 0 ? data.testimonials : defaultTestimonials;
  const technologies = data.technologies && data.technologies.length > 0
    ? data.technologies
    : ['React', 'Next.js', 'Laravel', 'Node.js', 'PostgreSQL', 'WordPress', 'Tailwind CSS', 'Docker'];
  const technologiesHeading = data.technologiesSection?.heading ?? 'Technologies We Use';
  const technologiesSubheading = data.technologiesSection?.subheading ?? 'Our team works with modern, battle-tested stacks to deliver secure and high-performing products.';
  const processHeading = data.processSection?.heading ?? 'How We Work';
  const processSubheading = data.processSection?.subheading ?? 'A proven process that delivers quality results on time, every time.';
  const resultsSubheading = data.results.subheading ?? 'See how we\'ve helped businesses like yours succeed.';
  const testimonialsHeading = data.testimonialsSection?.heading ?? 'Client Testimonials';
  const testimonialsSubheading =
    data.testimonialsSection?.subheading ??
    'Trusted by teams that need reliable delivery, transparent communication, and measurable outcomes.';
  const faqHeading = data.faqSection?.heading ?? 'Frequently Asked Questions';
  const faqSubheading = data.faqSection?.subheading ?? `Everything you need to know about our ${data.hero.serviceName.toLowerCase()}.`;
  const whyChooseHeading = data.whyChooseSection?.heading ?? `Why Choose Our ${data.hero.serviceName}?`;
  const whyChooseSubheading = data.whyChooseSection?.subheading ?? 'We deliver results that matter to your business.';
  const getManagedSection = (key: string) =>
  managedSections.find((section) => section.section_key === key && section.is_active);

  const testimonialSection = getManagedSection("client_testimonials");
  const faqSection = getManagedSection("frequently_asked_questions");
  const resultsSection = getManagedSection("real_results_delivered");
  const whyChooseSection = getManagedSection("why_choose_our_service");
  const processSectionManaged = getManagedSection("how_we_work");
  const technologiesSectionManaged = getManagedSection("technologies_we_use");
  const useCasesSectionManaged = getManagedSection("who_is_this_for");
  const deliverablesSection = getManagedSection("what_you_get");

  const ICON_MAP: Record<string, React.ElementType> = {
    Shield,
    Rocket,
    Zap,
    Star,
    CheckCircle,
    TrendingUp,
    BadgeCheck,
    Target,
    Handshake,
    Award,
    Gauge,
    Workflow,
    Sparkles,
    Lightbulb,
    Gem,
    Crown,
    Medal,
    ThumbsUp,
    Lock,
    ShieldCheck,
  };

  const frontendTestimonials = testimonialSection?.items?.length
    ? testimonialSection.items
        .filter((item) => item.author_name || item.content || item.name || item.quote)
        .map((item, index) => ({
          id: index + 1,
          author_name: item.author_name ?? item.name ?? "",
          author_title: item.author_title ?? item.role ?? "",
          company: item.company ?? item.metric ?? "",
          content: item.content ?? item.quote ?? "",
          rating: Number(item.rating ?? 5),
        }))
    : testimonials.map((item, index) => ({
        id: index + 1,
        author_name: item.name,
        author_title: item.role,
        company: "",
        content: item.quote,
        rating: 5,
      }));

  const frontendFaq = faqSection?.items?.length
    ? faqSection.items
        .filter((item) => item.question && item.answer)
        .map((item) => ({
          question: item.question ?? "",
          answer: item.answer ?? "",
        }))
    : data.faq;

  const frontendResults =
    resultsSection?.items?.length
      ? resultsSection.items
          .filter((item) => item.title || item.description)
            .map((item) => ({
              title: item.title ?? "",
              description: item.description ?? "",
              category: item.category ?? "",
              project_url: item.project_url ?? item.url ?? "",
              results: Array.isArray(item.results)
                ? item.results
                : [],
              tags: Array.isArray(item.technologies)
                ? item.technologies
                : [],
            }))
          : data.results.projects.map((project) => ({
              title: project.title,
              description: project.result,
              category: "",
              project_url: "",
              results: project.metric ? [project.metric] : [],
              tags: [],
            })
          );

  const frontendWhyChoose =
    whyChooseSection?.items?.length
      ? whyChooseSection.items
          .filter((item) => item.title || item.description)
          .map((item) => ({
            title: item.title ?? "",
            description: item.description ?? "",
            icon: item.icon ?? "",
          }))
      : data.keyBenefits;

  const frontendProcess =
    processSectionManaged?.items?.length
      ? processSectionManaged.items.map((item, index) => ({
          number: item.number ?? String(index + 1),
          title: item.title ?? "",
          description: item.description ?? "",
        }))
      : data.process;

  const frontendTechnologies =
    technologiesSectionManaged?.items?.length
      ? technologiesSectionManaged.items
          .map((item) => item.title ?? "")
          .filter(Boolean)
      : technologies;

  const frontendUseCases =
    useCasesSectionManaged?.items?.length
      ? useCasesSectionManaged.items.map((item) => ({
          title: item.title ?? "",
          description: item.description ?? "",
        }))
      : data.useCases.audiences;

  const frontendDeliverables =
    deliverablesSection?.items?.length
      ? deliverablesSection.items.map((item, index) => ({
          number: item.number ?? String(index + 1),
          title: item.title ?? "",
          description: item.description ?? "",
        }))
      : data.servicesBreakdown.items;

  useEffect(() => {
    document.title = data.seo.metaTitle;
    const upsertMeta = (name: string, content: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.head.querySelector(selector) as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement('meta');
        if (isProperty) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };
    upsertMeta('description', data.seo.metaDescription);
    upsertMeta('keywords', data.seo.keywords.join(', '));
    upsertMeta('og:title', data.seo.metaTitle, true);
    upsertMeta('og:description', data.seo.metaDescription, true);
    upsertMeta('og:type', 'website', true);
    upsertMeta('og:url', `${window.location.origin}/services/${serviceSlug}`, true);
    upsertMeta('twitter:card', 'summary_large_image');

    const schemaId = 'service-page-schema';
    const existing = document.getElementById(schemaId);
    if (existing) {
      existing.remove();
    }

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: data.hero.serviceName,
      description: data.seo.metaDescription,
      provider: {
        '@type': 'Organization',
        name: 'WebNDevs',
        url: window.location.origin,
      },
      serviceType: 'Web Development',
      areaServed: 'Worldwide',
      offers: activePlans.map((plan) => ({
        '@type': 'Offer',
        name: plan.name,
        price: Number(plan.price),
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      })),
      faq: data.faq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    };

    const script = document.createElement('script');
    script.id = schemaId;
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const scriptNode = document.getElementById(schemaId);
      if (scriptNode) {
        scriptNode.remove();
      }
    };
  }, [activePlans, data, serviceSlug]);

  useEffect(() => {
    async function fetchPlans() {
      try {
        const response = await fetch(`${API_BASE_URL}/services/${serviceSlug}/plans`);
        const payload: ApiResponse<{
          sync_token: string | null;
          plans: ServicePageTemplateProps["plans"];
        }> = await response.json();

        if (!response.ok || !payload.success) return;

        setRemotePlans(payload.data?.plans ?? []);
      } catch {
        setRemotePlans([]);
      }
    }

    void fetchPlans();
  }, [serviceSlug]);

  useEffect(() => {
  async function fetchPackageOffers() {
    try {
      const response = await fetch(`${API_BASE_URL}/services/${serviceSlug}/package-offers`);
      const payload: ApiResponse<{ offers: PackageOffer[] }> = await response.json();

      if (!response.ok || !payload.success) return;

      setPackageOffers(payload.data?.offers ?? []);
    } catch {
      setPackageOffers([]);
    }
  }

  void fetchPackageOffers();
}, [serviceSlug]);

  useEffect(() => {
    setSyncToken(initialSyncToken);
  }, [initialSyncToken]);

  useEffect(() => {
    async function fetchManagedSections() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/services/${serviceSlug}/sections?locale=en&stage=published`
        );

        const payload: ApiResponse<ServiceSectionsPayload> = await response.json();

        if (!response.ok || !payload.success) {
          return;
        }

        setManagedSections(payload.data?.sections ?? []);
      } catch {
        setManagedSections([]);
      }
    } 

    void fetchManagedSections();
  } , [serviceSlug]);

  useEffect(() => {
    setEditablePlans(
      activePlans.length > 0
        ? activePlans.map((plan, index) => ({
            row_id: plan.id ? `plan-${plan.id}` : `plan-active-${index}`,
            plan_key: plan.plan_key ?? toKey(plan.name),
            name: plan.name,
            price: String(plan.price),
            billing_cycle: plan.billing_cycle,
            delivery_days: plan.delivery_days ? String(plan.delivery_days) : '',
            description: plan.description ?? '',
            features_text: (plan.features ?? []).join('\n'),
            is_featured: Boolean(plan.is_featured),
            is_active: Boolean(plan.is_active),
            display_order: index,
          }))
        : defaultEditablePlans(),
    );
  }, [activePlansSeed]);

  useEffect(() => {
    setSelectedPlanKey(activePlans.find((plan) => plan.is_featured)?.plan_key ?? activePlans[0]?.plan_key ?? '');
  }, [activePlans]);

  useEffect(() => {
    async function checkAdminAccess() {
      const token = resolveStoredToken();
      const headers: HeadersInit = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          method: 'GET',
          headers,
          credentials: 'include',
        });
        setCanManagePlans(response.ok);
      } catch {
        setCanManagePlans(false);
      }
    }

    void checkAdminAccess();
  }, []);

  const handleCtaClick = () => {
    document.getElementById('service-contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const selectedPlan = activePlans.find((plan) => (plan.plan_key ?? toKey(plan.name)) === selectedPlanKey) ?? null;

  function validateBookingForm() {
    const errors: Record<string, string> = {};
    if (!bookingForm.name.trim()) errors.name = 'Name is required.';
    if (!bookingForm.email.trim()) errors.email = 'Email is required.';
    if (bookingForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookingForm.email)) errors.email = 'Enter a valid email.';
    if (!bookingForm.project_brief.trim()) errors.project_brief = 'Project brief is required.';
    if (bookingForm.project_brief.trim().length < 10) errors.project_brief = 'Project brief must be at least 10 characters.';
    setBookingErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function submitBooking(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validateBookingForm()) {
      setBookingStatus({ loading: false, error: 'Please fix the highlighted fields.', success: '' });
      return;
    }

    setBookingStatus({ loading: true, error: '', success: '' });
    try {
      const response = await fetch(`${API_BASE_URL}/service-inquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_slug: serviceSlug,
          plan_key: selectedPlan?.plan_key ?? null,
          plan_name: selectedPlan?.name ?? null,
          ...bookingForm,
        }),
      });
      const payload: ApiResponse<unknown> = await response.json();
      if (!response.ok || !payload.success) {
        const validationErrors = payload.errors as Record<string, string[]>;
        if (validationErrors && typeof validationErrors === 'object') {
          const mapped: Record<string, string> = {};
          Object.entries(validationErrors).forEach(([key, value]) => {
            if (Array.isArray(value) && value[0]) {
              mapped[key] = value[0];
            }
          });
          setBookingErrors(mapped);
        }
        throw new Error(payload.message || 'Unable to submit request.');
      }
      setBookingForm({ name: '', email: '', phone: '', company: '', budget: '', project_brief: '' });
      setBookingErrors({});
      setBookingStatus({ loading: false, error: '', success: 'Request submitted successfully. We will contact you soon.' });
    } catch (error) {
      setBookingStatus({ loading: false, error: error instanceof Error ? error.message : 'Unable to submit request.', success: '' });
    }
  }

  function updatePlan(index: number, key: keyof EditablePlan, value: string | boolean | number) {
    setEditablePlans((current) => {
      const next = [...current];
      next[index] = { ...next[index], [key]: value };
      if (key === 'name' && !next[index].plan_key) {
        next[index].plan_key = toKey(String(value));
      }
      return next;
    });
  }

  function addPlan() {
    const labels = ['Basic', 'Standard', 'Premium', `Plan ${editablePlans.length + 1}`];
    const label = labels[Math.min(editablePlans.length, labels.length - 1)];
    setEditablePlans((current) => [
      ...current,
      {
        row_id: `plan-new-${crypto.randomUUID()}`,
        plan_key: toKey(label),
        name: label,
        price: '',
        billing_cycle: 'one_time',
        delivery_days: '',
        description: '',
        features_text: '',
        is_featured: false,
        is_active: true,
        display_order: current.length,
      },
    ]);
  }

  function removePlan(index: number) {
    setEditablePlans((current) => current.filter((_, i) => i !== index).map((plan, order) => ({ ...plan, display_order: order })));
  }

  function validatePlans(): string | null {
    if (editablePlans.length === 0) {
      return 'At least one plan is required.';
    }
    const keySet = new Set<string>();
    for (const plan of editablePlans) {
      if (!plan.plan_key || !/^[a-z0-9-]+$/.test(plan.plan_key)) return 'Plan key must be lowercase kebab-case.';
      if (keySet.has(plan.plan_key)) return 'Plan keys must be unique.';
      keySet.add(plan.plan_key);
      if (!plan.name.trim()) return 'Plan name is required.';
      if (plan.price.trim() === '' || Number.isNaN(Number(plan.price)) || Number(plan.price) < 0) return 'Plan price must be a valid non-negative number.';
      if (plan.delivery_days && (!Number.isInteger(Number(plan.delivery_days)) || Number(plan.delivery_days) < 1)) return 'Delivery days must be a positive integer.';
    }
    return null;
  }

  async function savePlans() {
    const token = resolveStoredToken();
    const validationError = validatePlans();
    if (validationError) {
      setManagerState({ saving: false, error: validationError, success: '' });
      return;
    }

    setManagerState({ saving: true, error: '', success: '' });
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      const response = await fetch(`${API_BASE_URL}/services/${serviceSlug}/plans`, {
        method: 'PUT',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          sync_token: syncToken,
          plans: editablePlans.map((plan, index) => ({
            plan_key: plan.plan_key,
            name: plan.name,
            price: Number(plan.price),
            billing_cycle: plan.billing_cycle,
            delivery_days: plan.delivery_days ? Number(plan.delivery_days) : null,
            description: plan.description.trim() || null,
            features: plan.features_text.split('\n').map((item) => item.trim()).filter(Boolean),
            is_featured: plan.is_featured,
            is_active: plan.is_active,
            display_order: index,
          })),
        }),
      });
      const payload: ApiResponse<ServicePlanSyncPayload> = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.message || 'Unable to save plans.');
      }
      setSyncToken(payload.data?.sync_token ?? null);
      setEditablePlans((payload.data?.plans ?? []).map(fromRemotePlan));
      setManagerState({ saving: false, error: '', success: 'Plans saved successfully.' });
    } catch (error) {
      setManagerState({ saving: false, error: error instanceof Error ? error.message : 'Unable to save plans.', success: '' });
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0F14]">
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#22C55E]/5 rounded-full blur-3xl" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h1 style={{ fontSize: '56px' }} className="font-bold text-[#F9FAFB] mb-6 leading-tight">
            {data.hero.serviceName}
          </h1>

          <p style={{ fontSize: '22px' }} className="text-[#9CA3AF] mb-8 max-w-3xl mx-auto leading-relaxed">
            {data.hero.valueProposition}
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <DSButton size="lg" onClick={handleCtaClick}>
              {data.hero.ctaText}
              <ArrowRight className="ml-2 w-5 h-5" />
            </DSButton>
            {data.hero.ctaSecondaryText && (
              <DSButton variant="secondary" size="lg" onClick={() => document.getElementById('what-you-get')?.scrollIntoView({ behavior: 'smooth' })}>
                {data.hero.ctaSecondaryText}
              </DSButton>
            )}
          </div>

          {data.stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {data.stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p style={{ fontSize: '32px' }} className="font-bold bg-gradient-to-r from-[#22C55E] to-[#06B6D4] bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </p>
                  <p className="text-[14px] text-[#9CA3AF]">{stat.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 px-6 bg-[#111827]">
        <div className="max-w-5xl mx-auto">
          <p style={{ fontSize: '18px' }} className="text-[#9CA3AF] mb-6 leading-relaxed">
            {data.introduction.paragraph}
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {data.introduction.benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#22C55E]/20 border border-[#22C55E]/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-[#22C55E]" />
                </div>
                <p className="text-[16px] text-[#F9FAFB]">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-[#0B0F14]">
        <div className="max-w-6xl mx-auto">
          <h2 style={{ fontSize: '42px' }} className="font-bold text-[#F9FAFB] text-center mb-4">
            {whyChooseHeading}
          </h2>
          <p style={{ fontSize: '18px' }} className="text-[#9CA3AF] text-center mb-12 max-w-3xl mx-auto">
            {whyChooseSubheading}
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {frontendWhyChoose.map((benefit, index) => (
              <DSCard key={index} hover>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center flex-shrink-0">
                    {benefit.icon && (() => {
                      const IconComponent = ICON_MAP[benefit.icon];

                      return IconComponent ? (
                        <IconComponent className="w-7 h-7 text-[#22C55E]" />
                      ) : null;
                    })()}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '20px' }} className="font-semibold text-[#F9FAFB] mb-3">
                      {benefit.title}
                    </h3>
                    <p className="text-[14px] text-[#9CA3AF] leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </DSCard>
            ))}
          </div>
        </div>
      </section>

      <section id='what-you-get' className="py-20 px-6 bg-[#111827]">
        <div className="max-w-5xl mx-auto">
          <h2 style={{ fontSize: '42px' }} className="font-bold text-[#F9FAFB] text-center mb-12">
            {data.servicesBreakdown.heading}
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {frontendDeliverables.map((item, index) => (
              <DSCard key={index} hover>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#22C55E] font-bold">{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  <div className="flex-1">
                    <h3 style={{ fontSize: '18px' }} className="font-semibold text-[#F9FAFB] mb-2">
                      {item.title}
                    </h3>
                    <p className="text-[14px] text-[#9CA3AF] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </DSCard>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-[#0B0F14]">
        <div className="max-w-6xl mx-auto">
          <h2 style={{ fontSize: '42px' }} className="font-bold text-[#F9FAFB] text-center mb-4">
            {technologiesHeading}
          </h2>
          <p style={{ fontSize: '18px' }} className="text-[#9CA3AF] text-center mb-12 max-w-3xl mx-auto">
            {technologiesSubheading}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {frontendTechnologies.map((tech) => (
              <span key={tech} className="px-4 py-2 rounded-full border border-[#374151] bg-[#111827] text-[#F9FAFB] text-[14px] hover:border-[#22C55E] transition-colors">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {activePlans.length > 0 && (
        <>
          <ServicePackageSelector
            title={`${data.hero.serviceName} Plans`}
            subtitle="Pricing and delivery are synchronized directly from our service configuration."
            plans={activePlansWithOffers}
            onChoosePlan={(plan) => {
              setSelectedPlanKey(plan.plan_key ?? toKey(plan.name));
              handleCtaClick();
            }}
          />
          <ServiceComparisonTable plans={activePlansWithOffers} />
          <ServicePricingCalculator plans={activePlansWithOffers} selectedPlanKey={selectedPlanKey} onSelectPlanKey={setSelectedPlanKey} />
        </>
      )}

      <section className="py-20 px-6 bg-[#0B0F14]">
        <div className="max-w-5xl mx-auto">
          <div className="p-8 md:p-10 bg-[#111827] border border-[#334155]/40 rounded-none">
            <div className="text-center mb-16">
              <h2 style={{ fontSize: '42px' }} className="font-bold text-[#F9FAFB] mb-4">
                {processHeading}
              </h2>

              <p style={{ fontSize: '18px' }} className="text-[#9CA3AF] max-w-3xl mx-auto">
                {processSubheading}
              </p>
            </div>

            <div className="relative">
              <div className="hidden lg:block absolute left-[50%] top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#22C55E] to-[#06B6D4]" />

              <div className="space-y-12">
                {frontendProcess.map((step, index) => {
                  const isEven = index % 2 === 0;

                  return (
                    <div key={index} className="relative">
                      <div className="hidden lg:grid grid-cols-2 gap-12 items-center">
                        {isEven ? (
                          <>
                            <div className="text-right">
                              <DSCard hover>
                                <div className="flex items-start gap-4 flex-row-reverse">
                                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#22C55E]/10 to-[#06B6D4]/10 border border-[#22C55E]/20 flex items-center justify-center flex-shrink-0">
                                    <span className="text-[#22C55E] font-bold text-[20px]">{step.number}</span>
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-end gap-3 mb-3">
                                      <h3 style={{ fontSize: '24px' }} className="font-bold text-[#F9FAFB]">
                                        {step.title}
                                      </h3>
                                    </div>
                                    <p className="text-[14px] text-[#9CA3AF] mb-3 leading-relaxed">
                                      {step.description}
                                    </p>
                                  </div>
                                </div>
                              </DSCard>
                            </div>

                            <div className="absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#22C55E] border-4 border-[#0B0F14] z-10" />

                            <div />
                          </>
                        ) : (
                          <>
                            <div />

                            <div className="absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#22C55E] border-4 border-[#0B0F14] z-10" />

                            <div>
                              <DSCard hover>
                                <div className="flex items-start gap-4">
                                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#22C55E]/10 to-[#06B6D4]/10 border border-[#22C55E]/20 flex items-center justify-center flex-shrink-0">
                                    <span className="text-[#22C55E] font-bold text-[20px]">{step.number}</span>
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                      <h3 style={{ fontSize: '24px' }} className="font-bold text-[#F9FAFB]">
                                        {step.title}
                                      </h3>
                                    </div>
                                    <p className="text-[14px] text-[#9CA3AF] mb-3 leading-relaxed">
                                      {step.description}
                                    </p>
                                  </div>
                                </div>
                              </DSCard>
                            </div>
                          </>
                        )}
                      </div>

                      <div className="lg:hidden">
                        <DSCard hover>
                          <div className="flex items-start gap-4">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#22C55E]/10 to-[#06B6D4]/10 border border-[#22C55E]/20 flex items-center justify-center flex-shrink-0">
                              <span className="text-[#22C55E] font-bold text-[20px]">{step.number}</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <span className="text-[32px] font-bold text-[#22C55E]/20">
                                  {step.number}
                                </span>
                                <h3 style={{ fontSize: '20px' }} className="font-bold text-[#F9FAFB]">
                                  {step.title}
                                </h3>
                              </div>
                              <p className="text-[14px] text-[#9CA3AF] leading-relaxed">
                                {step.description}
                              </p>
                            </div>
                          </div>
                        </DSCard>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-[#111827]">
        <div className="max-w-6xl mx-auto">
          <h2 style={{ fontSize: '42px' }} className="font-bold text-[#F9FAFB] text-center mb-12">
            {data.useCases.heading}
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {frontendUseCases.map((audience, index) => (
              <DSCard key={index} hover className="text-center">
                <h3 style={{ fontSize: '20px' }} className="font-semibold text-[#F9FAFB] mb-3">
                  {audience.title}
                </h3>
                <p className="text-[14px] text-[#9CA3AF] leading-relaxed">
                  {audience.description}
                </p>
              </DSCard>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-[#0B0F14]">
        <div className="max-w-6xl mx-auto">
          <h2 style={{ fontSize: '42px' }} className="font-bold text-[#F9FAFB] text-center mb-4">
            {data.results.heading}
          </h2>
          <p style={{ fontSize: '18px' }} className="text-[#9CA3AF] text-center mb-12 max-w-3xl mx-auto">
            {resultsSubheading}
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {frontendResults.map((project, index) => (
              <DSCard key={index} hover className="flex flex-col">
                <div className="flex items-center justify-between mb-4">
                <DSBadge variant="success">
                  {project.category || "Result"}
                </DSBadge>
                <button className="text-[#9CA3AF] hover:text-[#22C55E] transition-colors">
                  <a href={project.project_url} target='_blank' rel='noopener noreferrer' aria-label={`Open ${project.title}`} >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </button>
                </div>

                <h3 style={{ fontSize: '20px' }} className="font-bold text-[#F9FAFB] mb-3">
                  {project.title}
                </h3>
                <p className="text-[14px] text-[#9CA3AF] mb-4 leading-relaxed">
                  {project.description}
                </p>

                <div className="bg-[#111827] rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-[#22C55E]" />
                    <span className="text-[12px] font-semibold text-[#22C55E] uppercase tracking-wider">
                      Results
                    </span>
                  </div>

                  <ul className="space-y-2">
                    {project.results.map((result, i) => (
                      <li key={i} className="text-[13px] text-[#9CA3AF] flex items-start gap-2">
                        <span className="text-[#22C55E] flex-shrink-0">✓</span>
                        <span>{result}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded bg-[#374151] text-[#9CA3AF] text-[12px]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </DSCard>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-[#0B0F14]">
        <div className="max-w-6xl mx-auto">
          <h2 style={{ fontSize: '42px' }} className="font-bold text-[#F9FAFB] text-center mb-4">
            {testimonialsHeading}
          </h2>
          <p style={{ fontSize: '18px' }} className="text-[#9CA3AF] text-center mb-12 max-w-3xl mx-auto">
            {testimonialsSubheading}
          </p>
          <div className="grid md:grid-cols-3 gap-6">
          {frontendTestimonials.map((testimonial) => (
            <DSCard key={testimonial.id} hover className="flex flex-col">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }, (_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                ))}
              </div>

              <Quote className="w-10 h-10 text-[#22C55E]/20 mb-4" />

              <p className="text-[14px] text-[#9CA3AF] leading-relaxed mb-6 flex-grow">
                "{testimonial.content}"
              </p>

              <div className="pt-4 border-t border-[#374151]">
                <p className="font-semibold text-[#F9FAFB] text-[15px] mb-1">
                  {testimonial.author_name}
                </p>

                <p className="text-[13px] text-[#9CA3AF] mb-2">
                  {testimonial.author_title}
                </p>

                {testimonial.company && (
                  <p className="text-[12px] text-[#22C55E]">
                    Company: {testimonial.company}
                  </p>
                )}
              </div>
            </DSCard>
          ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-[#111827]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-full mb-6">
              <span className="text-[14px] font-medium text-[#22C55E]">Questions & Answers</span>
            </div>
            <h2 style={{ fontSize: '42px' }} className="font-bold text-[#F9FAFB] mb-4">
              {faqHeading}
            </h2>
            <p style={{ fontSize: '18px' }} className="text-[#9CA3AF] max-w-2xl mx-auto">
              {faqSubheading}
            </p>
          </div>

          <div className="space-y-4">
            {frontendFaq.map((item, index) => (
              <DSCard 
                key={index}
                className="cursor-pointer"
                onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 style={{ fontSize: '18px' }} className="font-semibold text-[#F9FAFB] mb-2">
                      {item.question}
                    </h3>
                    <div 
                      className={`overflow-hidden transition-all duration-300 ${
                        openFaqIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <p className="text-[14px] text-[#9CA3AF] leading-relaxed pt-2">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                  <button className="flex-shrink-0 text-[#22C55E]">
                    <ChevronDown 
                      className={`w-5 h-5 transition-transform duration-300 ${
                        openFaqIndex === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                </div>
              </DSCard>
            ))}
          </div>
        </div>
      </section>

      {canManagePlans && (
        <section className="py-20 px-6 bg-[#111827]">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
              <h2 style={{ fontSize: '34px' }} className="font-bold text-[#F9FAFB]">
                Pricing Plans Management
              </h2>
              <div className="flex gap-3">
                <DSButton variant="secondary" size="sm" onClick={() => setIsPlanManagerVisible((current) => !current)}>
                  {isPlanManagerVisible ? 'Hide Manager' : 'Manage Plans'}
                </DSButton>
                {isPlanManagerVisible && (
                  <>
                    <DSButton variant="secondary" size="sm" onClick={addPlan}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Plan
                    </DSButton>
                    <DSButton size="sm" onClick={savePlans} disabled={managerState.saving}>
                      <Save className="w-4 h-4 mr-2" />
                      {managerState.saving ? 'Saving...' : 'Save Plans'}
                    </DSButton>
                  </>
                )}
              </div>
            </div>

            {isPlanManagerVisible && (
              <div className="space-y-4">
                {managerState.error && <div className="text-[#EF4444] text-[14px]">{managerState.error}</div>}
                {managerState.success && <div className="text-[#22C55E] text-[14px]">{managerState.success}</div>}
                {editablePlans.map((plan, index) => (
                  <DSCard key={plan.row_id}>
                    <div className="grid md:grid-cols-2 gap-4">
                      <DSInput label="Plan Key" value={plan.plan_key} onChange={(event) => updatePlan(index, 'plan_key', toKey(event.target.value))} />
                      <DSInput label="Plan Name" value={plan.name} onChange={(event) => updatePlan(index, 'name', event.target.value)} />
                      <DSInput label="Price" value={plan.price} onChange={(event) => updatePlan(index, 'price', event.target.value)} />
                      <div className="w-full">
                        <label className="block text-[#F9FAFB] text-[14px] font-medium mb-2">Billing Cycle</label>
                        <select
                          value={plan.billing_cycle}
                          onChange={(event) => updatePlan(index, 'billing_cycle', event.target.value as EditablePlan['billing_cycle'])}
                          className="w-full px-4 py-3 bg-[#111827] border border-[#374151] rounded-lg text-[#F9FAFB] text-[16px] outline-none focus:ring-2 focus:ring-[#22C55E]/20 focus:border-[#22C55E]"
                        >
                          <option value="one_time">One Time</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>
                      <DSInput label="Delivery Days" value={plan.delivery_days} onChange={(event) => updatePlan(index, 'delivery_days', event.target.value)} />
                      <DSInput label="Display Order" value={String(plan.display_order)} onChange={(event) => updatePlan(index, 'display_order', Number(event.target.value || '0'))} />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-[#F9FAFB] text-[14px] font-medium mb-2">Description</label>
                        <textarea
                          value={plan.description}
                          onChange={(event) => updatePlan(index, 'description', event.target.value)}
                          rows={3}
                          className="w-full px-4 py-3 bg-[#111827] border border-[#374151] rounded-lg text-[#F9FAFB] text-[16px] outline-none focus:ring-2 focus:ring-[#22C55E]/20 focus:border-[#22C55E]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#F9FAFB] text-[14px] font-medium mb-2">Features (one per line)</label>
                        <textarea
                          value={plan.features_text}
                          onChange={(event) => updatePlan(index, 'features_text', event.target.value)}
                          rows={3}
                          className="w-full px-4 py-3 bg-[#111827] border border-[#374151] rounded-lg text-[#F9FAFB] text-[16px] outline-none focus:ring-2 focus:ring-[#22C55E]/20 focus:border-[#22C55E]"
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 mt-4">
                      <label className="flex items-center gap-2 text-[#9CA3AF] text-[14px]">
                        <input type="checkbox" checked={plan.is_featured} onChange={(event) => updatePlan(index, 'is_featured', event.target.checked)} />
                        Featured
                      </label>
                      <label className="flex items-center gap-2 text-[#9CA3AF] text-[14px]">
                        <input type="checkbox" checked={plan.is_active} onChange={(event) => updatePlan(index, 'is_active', event.target.checked)} />
                        Active
                      </label>
                      <DSButton variant="outline" size="sm" onClick={() => removePlan(index)}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove
                      </DSButton>
                    </div>
                  </DSCard>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <section id="service-contact" className="py-20 px-6 bg-[#0B0F14] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#22C55E]/5 rounded-full blur-3xl" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <DSCard className="bg-gradient-to-br from-[#22C55E]/5 to-[#06B6D4]/5 border-2 border-[#22C55E]/30 text-center">
            <h2 style={{ fontSize: '42px' }} className="font-bold text-[#F9FAFB] mb-4">
              {data.finalCTA.headline}
            </h2>
            <p style={{ fontSize: '18px' }} className="text-[#9CA3AF] mb-8 max-w-2xl mx-auto">
              {data.finalCTA.subtext}
            </p>

            <ServiceBookingInteraction
              plans={activePlansWithOffers}
              selectedPlanKey={selectedPlanKey}
              onSelectPlanKey={setSelectedPlanKey}
              form={bookingForm}
              errors={bookingErrors}
              onChange={(key, value) => setBookingForm((current) => ({ ...current, [key]: value }))}
              onSubmit={submitBooking}
              status={bookingStatus}
              submitLabel={data.finalCTA.buttonText}
            />

            <p className="text-[12px] text-[#6B7280]">
              No commitment required. Get your free consultation today.
            </p>
          </DSCard>

          {data.seo.internalLinks.length > 0 && (
            <div className="mt-12 text-center">
              <p className="text-[14px] text-[#9CA3AF] mb-4">You might also be interested in:</p>
              <div className="flex flex-wrap gap-4 justify-center">
                {data.seo.internalLinks.map((link, index) => (
                  <a 
                    key={index}
                    href={link.url}
                    className="text-[14px] text-[#22C55E] hover:text-[#16A34A] transition-colors"
                  >
                    {link.text} →
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
