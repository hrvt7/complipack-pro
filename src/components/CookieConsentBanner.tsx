import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCookieConsent } from '@/contexts/CookieConsentContext';
import { Link } from 'react-router-dom';

export function CookieConsentBanner() {
  const { showBanner, acceptAll, rejectNonEssential, openPreferences } = useCookieConsent();

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6"
        >
          <div className="max-w-2xl mx-auto">
            <div className="glass rounded-2xl p-6 shadow-2xl border border-border backdrop-blur-xl">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Cookie className="w-6 h-6 text-primary" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    We use cookies
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    We use essential cookies to make our site work. With your consent, we may also use 
                    non-essential cookies to improve user experience and analyze website traffic. 
                    By clicking "Accept All", you agree to our use of cookies.{' '}
                    <Link 
                      to="/legal/cookies" 
                      className="text-primary hover:underline"
                    >
                      Learn more in our Cookie Policy
                    </Link>
                  </p>
                  
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={rejectNonEssential}
                      className="text-sm"
                    >
                      Reject Non-Essential
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={openPreferences}
                      className="text-sm"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Customize
                    </Button>
                    <Button
                      size="sm"
                      onClick={acceptAll}
                      className="btn-gradient-blue text-white text-sm"
                    >
                      Accept All
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
