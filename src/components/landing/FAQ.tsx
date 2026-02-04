import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'What is PPWR Article 24?',
    answer: 'PPWR (Packaging and Packaging Waste Regulation) Article 24 requires all EU packaging to have less than 40% empty space by August 12, 2026. Non-compliance results in fines of €10,000-500,000 per violation.',
  },
  {
    question: 'What is a Digital Product Passport (DPP)?',
    answer: 'A DPP is a digital record containing product information like materials, carbon footprint, recyclability, and repair instructions. DPPs are mandatory for batteries (Feb 2027), textiles (Jul 2028), and electronics (2030+).',
  },
  {
    question: 'Do I need to integrate with Shopify or Etsy?',
    answer: 'No integrations required. Simply export your products to CSV from Shopify/Etsy or copy-paste product data directly into CompliPack. Upload, check, download. That\'s it.',
  },
  {
    question: 'How accurate are the void space calculations?',
    answer: 'CompliPack uses precise geometric calculations based on your product dimensions. We recommend 8 standard EU box sizes and calculate void space to 2 decimal places. Accuracy: 99.9%.',
  },
  {
    question: 'Can I use the QR codes on my packaging?',
    answer: 'Yes! Print the QR code labels at 300 DPI and attach them to your packaging. Customers scan to verify PPWR compliance and view DPP data. Public verification pages require no login.',
  },
  {
    question: 'What if I have more than 200 products?',
    answer: 'Upgrade to Pro for unlimited products. Pro also includes bulk CSV import (up to 1,000 products at once), custom branding, and API access.',
  },
  {
    question: 'Is there a free trial?',
    answer: 'Yes! 14-day free trial on all plans. No credit card required. Full access to all features during trial period.',
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Absolutely. Cancel anytime from your account settings. No questions asked. No cancellation fees.',
  },
];

export function FAQ() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="faq" className="py-24 relative bg-accent/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about CompliPack and EU compliance
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="glass rounded-xl px-6 border-none data-[state=open]:shadow-lg transition-shadow"
                >
                  <AccordionTrigger className="text-left font-semibold hover:text-primary transition-colors py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
