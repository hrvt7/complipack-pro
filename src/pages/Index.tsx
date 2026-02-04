import { Helmet } from 'react-helmet-async';
import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Pricing } from '@/components/landing/Pricing';
import { FAQ } from '@/components/landing/FAQ';
import { CTA } from '@/components/landing/CTA';
import { Footer } from '@/components/landing/Footer';

const Index = () => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'CompliPack',
    applicationCategory: 'BusinessApplication',
    description: 'PPWR Packaging Compliance & Digital Product Passport platform for EU E-commerce',
    offers: {
      '@type': 'Offer',
      price: '19',
      priceCurrency: 'EUR',
    },
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is PPWR Article 24?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'PPWR (Packaging and Packaging Waste Regulation) Article 24 requires all EU packaging to have less than 40% empty space by August 12, 2026.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is a Digital Product Passport (DPP)?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A DPP is a digital record containing product information like materials, carbon footprint, recyclability, and repair instructions.',
        },
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>CompliPack - PPWR Compliance & Digital Product Passports for EU E-commerce</title>
        <meta
          name="description"
          content="Automate EU PPWR Article 24 packaging compliance and generate Digital Product Passports. Avoid €10K-500K fines. Get audit-ready PDF reports and QR codes in minutes. 14-day free trial."
        />
        <meta
          name="keywords"
          content="PPWR compliance, Digital Product Passport, DPP, EU packaging regulations, PPWR Article 24, void space calculator, EU compliance"
        />
        
        {/* Open Graph */}
        <meta property="og:title" content="CompliPack - PPWR Compliance & Digital Product Passports" />
        <meta
          property="og:description"
          content="Automate EU PPWR compliance and generate Digital Product Passports. Avoid €10K-500K fines."
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/og-image.png" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="CompliPack - EU Compliance Made Simple" />
        <meta
          name="twitter:description"
          content="PPWR packaging compliance and Digital Product Passports for EU E-commerce"
        />
        
        {/* Structured Data */}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <Hero />
          <Features />
          <HowItWorks />
          <Pricing />
          <FAQ />
          <CTA />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
