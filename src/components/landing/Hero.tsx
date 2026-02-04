import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Check, Package, FileText, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

const featurePills = [
  { icon: Package, label: 'PPWR Compliance Tools', color: 'bg-primary/10 text-primary border-primary/20' },
  { icon: FileText, label: 'DPP Documentation', color: 'bg-success/10 text-success border-success/20' },
  { icon: Search, label: 'Compliance Reports', color: 'bg-warning/10 text-warning border-warning/20' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-radial" />
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating shapes */}
        <motion.div
          animate={{
            y: [0, -30, 0],
            rotate: [0, 5, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 right-[10%] w-72 h-72 bg-primary/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-20 left-[5%] w-96 h-96 bg-success/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, -15, 0],
            x: [0, 10, 0],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 right-[20%] w-48 h-48 bg-warning/5 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 mb-6">
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ✨
                </motion.span>
                EU Compliance Made Simple
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6"
            >
              <span className="gradient-text-blue">PPWR</span> Packaging Compliance &{' '}
              <span className="gradient-text-emerald">DPP-Ready Documentation</span> for EU E-commerce
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 mb-4 leading-relaxed"
            >
              Automate EU PPWR Article 24 void space calculations and generate DPP-ready compliance reports. 
              Professional documentation tools to help reduce risk of €10K-500K non-compliance penalties.
            </motion.p>
            
            {/* Legal disclaimer */}
            <motion.p
              variants={itemVariants}
              className="text-sm text-muted-foreground/70 max-w-2xl mx-auto lg:mx-0 mb-8"
            >
              For informational purposes – not legal advice. See our{' '}
              <Link to="/legal/disclaimer" className="text-primary hover:underline">disclaimer</Link>.
            </motion.p>

            {/* Feature Pills */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8"
            >
              {featurePills.map((pill, index) => (
                <motion.div
                  key={pill.label}
                  whileHover={{ scale: 1.05 }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border ${pill.color} text-sm font-medium`}
                >
                  <pill.icon className="w-4 h-4" />
                  {pill.label}
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  onClick={() => navigate('/auth')}
                  className="btn-gradient-blue text-white rounded-full px-8 h-14 text-lg shadow-lg hover:shadow-glow transition-all group"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-8 h-14 text-lg group"
                >
                  <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Watch Demo
                </Button>
              </motion.div>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2 text-sm text-muted-foreground mb-6"
            >
              {['14-day free trial', 'No credit card required', 'Cancel anytime'].map((text) => (
                <span key={text} className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-success" />
                  {text}
                </span>
              ))}
            </motion.div>

            {/* Social Proof */}
            <motion.p
              variants={itemVariants}
              className="text-sm text-muted-foreground"
            >
              Trusted by <span className="font-semibold text-foreground">500+</span> EU businesses · 
              <span className="font-semibold text-foreground"> 10,000+</span> compliance reports generated
            </motion.p>
          </motion.div>

          {/* Right Column - Mockup Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="relative"
            >
              {/* Glow Effect */}
              <div className="absolute -inset-4 bg-primary/20 rounded-3xl blur-2xl opacity-50" />
              
              {/* Main Card */}
              <div className="relative glass rounded-2xl p-6 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Package className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Order #12847</p>
                      <p className="text-xs text-muted-foreground">Premium Widget Set</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
                    Processing complete
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-accent/50">
                    <p className="text-sm text-muted-foreground mb-1">Recommended Box</p>
                    <p className="text-2xl font-bold text-foreground">30 × 25 × 15 cm</p>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Void Space</span>
                      <span className="font-semibold text-success">18%</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '18%' }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="h-full bg-success rounded-full"
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>0%</span>
                      <span className="text-destructive">40% limit</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="px-3 py-1 rounded-full bg-success/10 text-success text-sm font-medium">
                      82% efficient
                    </span>
                    <div className="flex gap-2">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium cursor-pointer"
                      >
                        PPWR ✓
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="px-3 py-1 rounded-lg bg-success/10 text-success text-xs font-medium cursor-pointer"
                      >
                        DPP ✓
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -8, 0], rotate: [0, 2, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-4 -right-4 glass rounded-xl p-3 shadow-lg"
              >
                <div className="w-16 h-16 bg-accent rounded-lg flex items-center justify-center">
                  <div className="w-12 h-12 bg-foreground/10 rounded grid grid-cols-3 grid-rows-3 gap-0.5 p-1">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className="bg-foreground rounded-sm" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-center mt-2 font-medium">QR Code</p>
              </motion.div>

              <motion.div
                animate={{ y: [0, 6, 0], rotate: [0, -2, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute -bottom-4 -left-4 glass rounded-xl p-3 shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-success" />
                  <span className="text-sm font-medium">Compliant</span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
