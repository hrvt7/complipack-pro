import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Check } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SignupForm } from './SignupForm';
import { LoginForm } from './LoginForm';

const features = [
  '📦 PPWR Article 24 compliance',
  '📄 Digital Product Passports',
  '✓ Avoid €10K-500K fines',
];

export function AuthLayout() {
  const [activeTab, setActiveTab] = useState<'signup' | 'login'>('signup');

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Brand Showcase (Hidden on mobile) */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
      >
        {/* Background */}
        <div className="absolute inset-0 btn-gradient-blue" />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/20 to-transparent" />
        
        {/* Animated Shapes */}
        <motion.div
          animate={{ y: [0, -30, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 mb-12">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
            >
              <Package className="w-8 h-8 text-white" />
            </motion.div>
            <span className="text-3xl font-bold text-white">
              CompliPack
            </span>
          </Link>

          {/* Headline */}
          <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
            EU Compliance
            <br />
            Made Simple
          </h1>

          {/* Features */}
          <div className="space-y-4 mb-12">
            {features.map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-3 text-white/90 text-lg"
              >
                <span>{feature}</span>
              </motion.div>
            ))}
          </div>

          {/* Testimonial */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
          >
            <p className="text-white/90 text-lg mb-4 italic">
              "CompliPack saved us from a €45K fine. Setup took 10 minutes."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold">
                S
              </div>
              <div>
                <p className="text-white font-medium">Sarah M.</p>
                <p className="text-white/70 text-sm">Fashion E-commerce</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Auth Forms */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-background"
      >
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Package className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Compli<span className="text-primary">Pack</span>
            </span>
          </Link>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'signup' | 'login')} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 h-12">
              <TabsTrigger value="signup" className="text-base">Sign Up</TabsTrigger>
              <TabsTrigger value="login" className="text-base">Log In</TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <TabsContent value="signup" className="mt-0">
                <motion.div
                  key="signup"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <h2 className="text-2xl font-bold text-foreground mb-2">Create your account</h2>
                  <p className="text-muted-foreground mb-6">Start your 14-day free trial. No credit card required.</p>
                  <SignupForm />
                  <p className="text-center text-muted-foreground mt-6">
                    Already have an account?{' '}
                    <button
                      onClick={() => setActiveTab('login')}
                      className="text-primary hover:underline font-medium"
                    >
                      Log in
                    </button>
                  </p>
                </motion.div>
              </TabsContent>

              <TabsContent value="login" className="mt-0">
                <motion.div
                  key="login"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <h2 className="text-2xl font-bold text-foreground mb-2">Welcome back</h2>
                  <p className="text-muted-foreground mb-6">Enter your credentials to access your account.</p>
                  <LoginForm />
                  <p className="text-center text-muted-foreground mt-6">
                    Don't have an account?{' '}
                    <button
                      onClick={() => setActiveTab('signup')}
                      className="text-primary hover:underline font-medium"
                    >
                      Sign up
                    </button>
                  </p>
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </div>
      </motion.div>
    </div>
  );
}
