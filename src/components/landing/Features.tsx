import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Package, FileText, Tag, Upload, FileCheck, CheckCircle } from 'lucide-react';

const features = [
  {
    icon: Package,
    title: 'PPWR Article 24 Compliance Tools',
    description: 'Automatic box optimization calculations to help you stay under 40% void space threshold. EU PPWR-aligned packaging recommendations with cost analysis. Documentation tool for compliance records.',
    color: 'bg-primary/10 text-primary',
    borderColor: 'group-hover:border-primary/50',
  },
  {
    icon: FileText,
    title: 'DPP-Ready Documentation',
    description: 'Generate structured DPP-ready reports with material composition, estimated carbon footprint, and recyclability scores. Prepares documentation to help meet upcoming EU DPP requirements. Not official certification.',
    color: 'bg-success/10 text-success',
    borderColor: 'group-hover:border-success/50',
  },
  {
    icon: Tag,
    title: 'Compliance QR Code Labels',
    description: 'Print-ready labels with PPWR and DPP information QR codes. Customers scan for compliance documentation. High-resolution 300 DPI for professional printing.',
    color: 'bg-warning/10 text-warning',
    borderColor: 'group-hover:border-warning/50',
  },
  {
    icon: Upload,
    title: 'Easy Import',
    description: 'Upload CSV files or paste product data directly. Compatible with Shopify exports. Bulk import up to 1,000 products.',
    color: 'bg-primary/10 text-primary',
    borderColor: 'group-hover:border-primary/50',
  },
  {
    icon: FileCheck,
    title: 'Professional Compliance Reports',
    description: 'Audit-ready documentation with executive summaries, void space calculations, DPP-ready data, and embedded QR codes. For internal compliance records and supplier communication. Not legal certification.',
    color: 'bg-purple-500/10 text-purple-500',
    borderColor: 'group-hover:border-purple-500/50',
  },
  {
    icon: CheckCircle,
    title: 'Public Information Pages',
    description: 'Each QR code links to a public information page displaying compliance data. Customers and stakeholders can view product information 24/7. Documentation tool only.',
    color: 'bg-success/10 text-success',
    borderColor: 'group-hover:border-success/50',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="features" className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Everything You Need for{' '}
            <span className="gradient-text">EU Compliance Documentation</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive documentation tools designed specifically for EU e-commerce packaging regulations. Professional record-keeping for PPWR and DPP preparation.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`group relative glass rounded-2xl p-6 transition-all duration-300 border border-transparent ${feature.borderColor} hover:shadow-xl`}
            >
              {/* Icon */}
              <motion.div
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
                className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mb-4`}
              >
                <feature.icon className="w-8 h-8" />
              </motion.div>

              {/* Title */}
              <h3 className="text-xl font-semibold mb-3 text-foreground">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>

              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
