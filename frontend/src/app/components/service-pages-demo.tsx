import React, { useState } from 'react';
import { ServicePageTemplate } from './service-page-template';
import { webDevelopmentService } from '../data/web-development-service';
import { mobileAppService } from '../data/mobile-app-service';
import { Navbar } from './navbar';
import { Footer } from './footer';

/**
 * SERVICE PAGES DEMO
 * 
 * This component demonstrates how the reusable ServicePageTemplate works
 * with different service data. In production, you would:
 * 
 * 1. Use React Router to create routes like:
 *    - /services/web-development
 *    - /services/mobile-app-development
 *    - /services/ui-ux-design
 *    etc.
 * 
 * 2. Fetch service data from:
 *    - CMS (Contentful, Sanity, Strapi)
 *    - API endpoint
 *    - Database
 *    - Static JSON files
 * 
 * 3. Pass the data to ServicePageTemplate component
 * 
 * This demo uses a simple tab switcher to show both examples.
 */

export function ServicePagesDemo() {
  const [activeService, setActiveService] = useState<'web' | 'mobile'>('web');

  const services = {
    web: webDevelopmentService,
    mobile: mobileAppService
  };

  const slugMap: Record<'web' | 'mobile', string> = {
    web: 'web-development',
    mobile: 'mobile-app-development',
  };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }} className="min-h-screen bg-[#0B0F14]">
      <Navbar />

      {/* Service Switcher (Demo Only) */}
      <div className="fixed top-24 left-1/2 -translate-x-1/2 z-40 bg-[#1F2937] border border-[#374151] rounded-full p-1 flex gap-2 shadow-lg">
        <button
          onClick={() => setActiveService('web')}
          className={`px-6 py-2 rounded-full text-[14px] font-medium transition-colors ${
            activeService === 'web'
              ? 'bg-[#22C55E] text-[#0B0F14]'
              : 'text-[#9CA3AF] hover:text-[#F9FAFB]'
          }`}
        >
          Web Development
        </button>
        <button
          onClick={() => setActiveService('mobile')}
          className={`px-6 py-2 rounded-full text-[14px] font-medium transition-colors ${
            activeService === 'mobile'
              ? 'bg-[#22C55E] text-[#0B0F14]'
              : 'text-[#9CA3AF] hover:text-[#F9FAFB]'
          }`}
        >
          Mobile App Dev
        </button>
      </div>

      {/* Render the appropriate service page */}
      <ServicePageTemplate
        data={services[activeService]}
        serviceSlug={slugMap[activeService]}
        onBackHome={() => { window.location.hash = ''; window.scrollTo({ top: 0, behavior: 'smooth' }); }}
      />

      <Footer />
    </div>
  );
}

/**
 * PRODUCTION IMPLEMENTATION EXAMPLES
 * 
 * Example 1: With React Router
 * ------------------------------
 * import { useParams } from 'react-router';
 * 
 * function ServicePage() {
 *   const { serviceSlug } = useParams();
 *   const [serviceData, setServiceData] = useState(null);
 * 
 *   useEffect(() => {
 *     // Fetch from API
 *     fetch(`/api/services/${serviceSlug}`)
 *       .then(res => res.json())
 *       .then(data => setServiceData(data));
 *   }, [serviceSlug]);
 * 
 *   return serviceData ? <ServicePageTemplate data={serviceData} /> : <Loading />;
 * }
 * 
 * 
 * Example 2: With CMS (Contentful)
 * ---------------------------------
 * import { getServiceBySlug } from '../lib/contentful';
 * 
 * export async function getStaticProps({ params }) {
 *   const serviceData = await getServiceBySlug(params.slug);
 *   return { props: { serviceData } };
 * }
 * 
 * export default function ServicePage({ serviceData }) {
 *   return <ServicePageTemplate data={serviceData} />;
 * }
 * 
 * 
 * Example 3: With Static Data
 * ----------------------------
 * const servicesMap = {
 *   'web-development': webDevelopmentService,
 *   'mobile-app-development': mobileAppService,
 *   'ui-ux-design': uiUxDesignService,
 *   // ... more services
 * };
 * 
 * function ServicePage({ slug }) {
 *   const serviceData = servicesMap[slug];
 *   return <ServicePageTemplate data={serviceData} />;
 * }
 */
