import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, X, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const plans = [
  {
    name: 'Basic',
    badge: 'PPWR Compliance Tools',
    badgeColor: 'bg-success/10 text-success',
    subtitle: 'Start building compliance records',
    price: '€19',
    featured: false,
    features: [
      { text: 'PPWR empty space calculations', included: true },
      { text: 'Manual product import (CSV or copy-paste)', included: true },
      { text: '1-page PPWR compliance PDF', included: true },
      { text: '1 unique PPWR QR code', included: true },
      { text: 'Public information page', included: true },
      { text: 'Up to 50 products/month', included: true },
      { text: 'Email support', included: true },
      { text: 'DPP-ready documentation', included: false },
      { text: 'Bulk CSV import', included: false },
    ],
  },
  {
    name: 'Standard',
    badge: 'PPWR + DPP Documentation',
    badgeColor: 'bg-primary/10 text-primary',
    subtitle: 'Complete product documentation tools',
    price: '€39',
    featured: true,
    features: [
      { text: 'Everything in Basic', included: true },
      { text: 'DPP-ready documentation', included: true, highlight: true },
      { text: 'Manual DPP data entry', included: true },
      { text: '2-page documentation PDF (PPWR + DPP)', included: true },
      { text: '2 QR codes (PPWR + DPP)', included: true },
      { text: 'Separate information pages', included: true },
      { text: 'Material composition tracking', included: true },
      { text: 'Carbon footprint estimates', included: true },
      { text: 'Up to 200 products/month', included: true },
      { text: 'Priority email support', included: true },
    ],
  },
  {
    name: 'Pro',
    badge: 'Full Documentation Suite',
    badgeColor: 'bg-success/10 text-success',
    subtitle: 'Complete EU compliance documentation',
    price: '€69',
    featured: false,
    features: [
      { text: 'Everything in Standard', included: true },
      { text: 'Bulk CSV import (up to 1,000 products)', included: true, highlight: true },
      { text: 'Extended DPP data fields', included: true },
      { text: 'Durability ratings', included: true },
      { text: 'Care instructions generator', included: true },
      { text: 'End-of-life disposal guidance', included: true },
      { text: '3-page professional report', included: true },
      { text: 'Custom branding (logo on PDFs)', included: true },
      { text: 'Unlimited products', included: true },
      { text: 'API access (beta)', included: true },
      { text: 'Dedicated support (<24h response)', included: true },
    ],
  },
];

const comparisonData = [
  { feature: 'PPWR Compliance', basic: true, standard: true, pro: true },
  { feature: 'DPP Generation', basic: false, standard: true, pro: true },
  { feature: 'Products/month', basic: '50', standard: '200', pro: 'Unlimited' },
  { feature: 'PDF Pages', basic: '1', standard: '2', pro: '3' },
  { feature: 'QR Codes', basic: '1', standard: '2', pro: '2' },
  { feature: 'Bulk Import', basic: false, standard: false, pro: true },
  { feature: 'Custom Branding', basic: false, standard: false, pro: true },
  { feature: 'API Access', basic: false, standard: false, pro: true },
  { feature: 'Support', basic: 'Email', standard: 'Priority', pro: 'Dedicated' },
];

export function Pricing() {
  const [showComparison, setShowComparison] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const navigate = useNavigate();

  return (
    <section id="pricing" className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Simple, <span className="gradient-text">Transparent</span> Pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start with a 14-day free trial. Upload products and generate compliance documentation in minutes. Professional tools for compliance record-keeping.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div ref={ref} className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: plan.featured ? -12 : -8 }}
              className={`relative glass rounded-2xl p-6 ${
                plan.featured
                  ? 'border-2 border-primary lg:-mt-4 lg:mb-4 shadow-glow'
                  : 'border border-border'
              }`}
            >
              {/* Featured Badge */}
              {plan.featured && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                  className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5"
                >
                  <Star className="w-4 h-4" />
                  Most Popular
                </motion.div>
              )}

              {/* Plan Header */}
              <div className="mb-6">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${plan.badgeColor} mb-3`}>
                  {plan.badge}
                </span>
                <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.subtitle}</p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground">/month</span>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-5 h-5 text-muted-foreground/50 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={`text-sm ${
                      feature.included 
                        ? feature.highlight 
                          ? 'text-foreground font-medium' 
                          : 'text-muted-foreground'
                        : 'text-muted-foreground/50 line-through'
                    }`}>
                      {feature.text}
                      {feature.highlight && (
                        <span className="ml-1.5 px-1.5 py-0.5 bg-success/10 text-success text-xs rounded">NEW</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={() => navigate('/auth')}
                  variant={plan.featured ? 'default' : 'outline'}
                  className={`w-full rounded-full h-12 ${
                    plan.featured
                      ? 'btn-gradient-blue text-white shadow-lg hover:shadow-glow'
                      : ''
                  }`}
                >
                  Start Free Trial
                </Button>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Comparison Toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
          >
            Compare all features
            {showComparison ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={false}
          animate={{
            height: showComparison ? 'auto' : 0,
            opacity: showComparison ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="mt-8 max-w-4xl mx-auto glass rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-semibold text-foreground">Feature</th>
                  <th className="text-center p-4 font-semibold text-foreground">Basic</th>
                  <th className="text-center p-4 font-semibold text-primary bg-primary/5">Standard</th>
                  <th className="text-center p-4 font-semibold text-foreground">Pro</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, i) => (
                  <tr key={row.feature} className={i !== comparisonData.length - 1 ? 'border-b border-border' : ''}>
                    <td className="p-4 text-muted-foreground">{row.feature}</td>
                    <td className="p-4 text-center">
                      {typeof row.basic === 'boolean' ? (
                        row.basic ? (
                          <Check className="w-5 h-5 text-success mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-muted-foreground/50 mx-auto" />
                        )
                      ) : (
                        <span className="text-sm text-muted-foreground">{row.basic}</span>
                      )}
                    </td>
                    <td className="p-4 text-center bg-primary/5">
                      {typeof row.standard === 'boolean' ? (
                        row.standard ? (
                          <Check className="w-5 h-5 text-success mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-muted-foreground/50 mx-auto" />
                        )
                      ) : (
                        <span className="text-sm font-medium text-foreground">{row.standard}</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {typeof row.pro === 'boolean' ? (
                        row.pro ? (
                          <Check className="w-5 h-5 text-success mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-muted-foreground/50 mx-auto" />
                        )
                      ) : (
                        <span className="text-sm text-muted-foreground">{row.pro}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* FAQ Link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center mt-8 text-muted-foreground"
        >
          Have questions?{' '}
          <a href="#faq" className="text-primary hover:underline">
            Check our FAQ →
          </a>
        </motion.p>
      </div>
    </section>
  );
}
