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
    answer: 'PPWR (Packaging and Packaging Waste Regulation) Article 24 requires all EU packaging to have less than 40% empty space by August 12, 2026. CompliPack provides calculation tools to help you document compliance with this threshold. We recommend consulting legal professionals for final verification.',
  },
  {
    question: 'What is a Digital Product Passport (DPP)?',
    answer: 'A DPP is a digital record containing product information like materials, carbon footprint, recyclability, and repair instructions. DPPs are mandatory for batteries (Feb 2027), textiles (Jul 2028), and electronics (2030+). CompliPack generates DPP-ready structured documentation to help you prepare for these requirements. This is not official certification – please consult legal advisors.',
  },
  {
    question: 'Are these official certifications?',
    answer: 'No. CompliPack is a documentation tool that helps you prepare compliance records. Our reports are for informational purposes and internal record-keeping. They do NOT constitute official EU Digital Product Passports, legal certification or guarantee, binding compliance verification, or substitute for legal advice. We strongly recommend consulting with legal professionals and compliance experts for final verification.',
  },
  {
    question: 'How accurate are the void space calculations?',
    answer: 'CompliPack uses precise geometric calculations based on your product dimensions to recommend optimal box sizes and calculate void space percentages. While our algorithms are mathematically accurate, the quality of results depends on accurate input data. You are responsible for verifying measurements and ensuring data accuracy. Results are for informational purposes.',
  },
  {
    question: 'Can I use the QR codes on my packaging?',
    answer: 'Yes, you can print and attach the QR code labels to your packaging. The QR codes link to information pages displaying the compliance data you have entered. However, these are informational tools only and do not constitute official regulatory compliance stamps or certifications. Ensure you meet all legal requirements before use.',
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
    question: 'What is your liability for fines or penalties?',
    answer: 'CompliPack is a software tool provided "as is" for documentation purposes. We are not liable for any fines, penalties, legal consequences, or regulatory actions resulting from use of our platform. Users are solely responsible for ensuring their products meet all applicable EU regulations. See our Terms of Service for complete liability limitations.',
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
