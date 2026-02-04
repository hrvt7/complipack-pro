import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cookie, Shield, BarChart3, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useCookieConsent } from '@/contexts/CookieConsentContext';

export function CookiePreferencesModal() {
  const { 
    consent, 
    showPreferencesModal, 
    setShowPreferencesModal, 
    savePreferences, 
    acceptAll, 
    rejectNonEssential 
  } = useCookieConsent();

  const [preferences, setPreferences] = useState({
    essential: true,
    preferences: consent?.preferences ?? true,
    analytics: consent?.analytics ?? false,
  });

  useEffect(() => {
    if (consent) {
      setPreferences({
        essential: true,
        preferences: consent.preferences,
        analytics: consent.analytics,
      });
    }
  }, [consent]);

  const handleSave = () => {
    savePreferences(preferences);
  };

  const handleAcceptAll = () => {
    acceptAll();
  };

  const handleRejectAll = () => {
    rejectNonEssential();
  };

  return (
    <AnimatePresence>
      {showPreferencesModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowPreferencesModal(false)}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative w-full max-w-lg glass rounded-2xl shadow-2xl border border-border overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Cookie className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Cookie Preferences</h2>
              </div>
              <button
                onClick={() => setShowPreferencesModal(false)}
                className="p-2 rounded-lg hover:bg-accent transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              {/* Essential Cookies */}
              <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-muted/50">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-foreground">Essential Cookies</h3>
                      <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-600">
                        Always Active
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Required for authentication and core functionality. Cannot be disabled.
                    </p>
                  </div>
                </div>
                <Switch checked disabled className="opacity-50" />
              </div>

              {/* Preference Cookies */}
              <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-muted/50">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <Settings className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1">Preference Cookies</h3>
                    <p className="text-sm text-muted-foreground">
                      Remember your settings like theme and language preferences.
                    </p>
                  </div>
                </div>
                <Switch
                  checked={preferences.preferences}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, preferences: checked }))
                  }
                />
              </div>

              {/* Analytics Cookies */}
              <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-muted/50">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1">Analytics Cookies</h3>
                    <p className="text-sm text-muted-foreground">
                      Help us understand how you use CompliPack to improve your experience. 
                      Privacy-friendly, no personal data collected.
                    </p>
                  </div>
                </div>
                <Switch
                  checked={preferences.analytics}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, analytics: checked }))
                  }
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border bg-muted/30">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="link"
                  className="text-sm text-muted-foreground"
                  onClick={handleRejectAll}
                >
                  Reject All Non-Essential
                </Button>
                <div className="flex-1" />
                <Button
                  variant="outline"
                  onClick={handleAcceptAll}
                >
                  Accept All
                </Button>
                <Button
                  onClick={handleSave}
                  className="btn-gradient-blue text-white"
                >
                  Save Preferences
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
