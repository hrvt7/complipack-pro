import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Upload, CheckCircle, Download } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Upload,
    title: 'Upload Your Products',
    description: 'Import via CSV file or paste product data directly. Enter dimensions (L×W×H cm), weight, and materials. Compatible with Shopify exports.',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    number: '02',
    icon: CheckCircle,
    title: 'Automated Calculations',
    description: 'Our system analyzes dimensions, calculates optimal box size, checks void space against PPWR thresholds, and generates documentation for your records.',
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
  {
    number: '03',
    icon: Download,
    title: 'Download Documentation',
    description: 'Download professional PDF reports with compliance calculations and print-ready QR code labels for your documentation needs.',
    color: 'text-warning',
    bgColor: 'bg-warning/10',
  },
];

export function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="how-it-works" className="py-24 relative bg-accent/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            How <span className="gradient-text">CompliPack</span> Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Generate professional compliance documentation in three simple steps. No technical setup. No integrations required.
          </p>
        </motion.div>

        {/* Steps */}
        <div ref={ref} className="relative max-w-5xl mx-auto">
          {/* Connecting Line - Desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2" />
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
            className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-success to-warning -translate-y-1/2 origin-left"
          />

          {/* Steps Grid */}
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative"
              >
                {/* Card */}
                <div className="glass rounded-2xl p-6 h-full">
                  {/* Number Badge */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ duration: 0.3, delay: index * 0.2 + 0.3, type: 'spring' }}
                    className={`absolute -top-4 left-6 w-12 h-12 rounded-full ${step.bgColor} flex items-center justify-center ${step.color} text-xl font-bold shadow-lg`}
                  >
                    {step.number}
                  </motion.div>

                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ duration: 0.3, delay: index * 0.2 + 0.4, type: 'spring' }}
                    className={`w-16 h-16 rounded-2xl ${step.bgColor} ${step.color} flex items-center justify-center mb-4 mt-6`}
                  >
                    <step.icon className="w-8 h-8" />
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold mb-3 text-foreground">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow - Mobile */}
                {index < steps.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.3, delay: index * 0.2 + 0.5 }}
                    className="lg:hidden flex justify-center my-4"
                  >
                    <svg
                      className="w-6 h-6 text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
