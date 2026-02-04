import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface TermsAcceptanceModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onCancel: () => void;
}

export function TermsAcceptanceModal({ isOpen, onAccept, onCancel }: TermsAcceptanceModalProps) {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const canProceed = termsAccepted && privacyAccepted;

  const handleAccept = () => {
    if (canProceed) {
      // Store acceptance record
      const acceptance = {
        termsVersion: 'v1.0',
        privacyVersion: 'v1.0',
        acceptedAt: new Date().toISOString(),
      };
      localStorage.setItem('termsAcceptance', JSON.stringify(acceptance));
      onAccept();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
            <div className="p-6 text-center border-b border-border">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Scale className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Terms & Privacy Agreement</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Before creating your account, please review and accept our Terms of Service and Privacy Policy.
              </p>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 max-h-[40vh] overflow-y-auto">
              {/* Checkboxes */}
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50">
                  <Checkbox
                    id="terms"
                    checked={termsAccepted}
                    onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                    className="mt-1"
                  />
                  <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                    I have read and agree to the{' '}
                    <a 
                      href="/legal/terms" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      Terms of Service
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </Label>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50">
                  <Checkbox
                    id="privacy"
                    checked={privacyAccepted}
                    onCheckedChange={(checked) => setPrivacyAccepted(checked === true)}
                    className="mt-1"
                  />
                  <Label htmlFor="privacy" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                    I have read and understand the{' '}
                    <a 
                      href="/legal/privacy" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      Privacy Policy
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </Label>
                </div>
              </div>

              {/* Fine print */}
              <div className="text-xs text-muted-foreground bg-muted/30 rounded-lg p-4">
                <p className="mb-2 font-medium text-foreground">By checking these boxes and creating an account, you acknowledge that:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>CompliPack is a documentation tool, not legal advice</li>
                  <li>You are responsible for ensuring regulatory compliance</li>
                  <li>CompliPack is not liable for fines or penalties</li>
                  <li>You must be 18+ and authorized to accept these terms</li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border bg-muted/30">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={onCancel}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAccept}
                  disabled={!canProceed}
                  className="flex-1 btn-gradient-blue text-white"
                >
                  Accept & Create Account
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
