import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CookieConsent {
  essential: boolean;
  preferences: boolean;
  analytics: boolean;
}

interface CookieConsentContextType {
  consent: CookieConsent | null;
  showBanner: boolean;
  setShowBanner: (show: boolean) => void;
  acceptAll: () => void;
  rejectNonEssential: () => void;
  savePreferences: (preferences: CookieConsent) => void;
  openPreferences: () => void;
  showPreferencesModal: boolean;
  setShowPreferencesModal: (show: boolean) => void;
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

const CONSENT_KEY = 'complipack_cookie_consent';
const CONSENT_DATE_KEY = 'complipack_cookie_consent_date';
const CONSENT_VERSION = 'v1.0';
const CONSENT_EXPIRY_DAYS = 365;

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);

  useEffect(() => {
    const storedConsent = localStorage.getItem(CONSENT_KEY);
    const consentDate = localStorage.getItem(CONSENT_DATE_KEY);

    if (storedConsent && consentDate) {
      const parsedConsent = JSON.parse(storedConsent);
      const dateNum = parseInt(consentDate, 10);
      const daysSinceConsent = (Date.now() - dateNum) / (1000 * 60 * 60 * 24);

      if (daysSinceConsent < CONSENT_EXPIRY_DAYS) {
        setConsent(parsedConsent);
        setShowBanner(false);
      } else {
        // Consent expired, show banner again
        setShowBanner(true);
      }
    } else {
      // No consent given yet
      setShowBanner(true);
    }
  }, []);

  const saveConsentToStorage = (newConsent: CookieConsent) => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(newConsent));
    localStorage.setItem(CONSENT_DATE_KEY, Date.now().toString());
    setConsent(newConsent);
    setShowBanner(false);
    setShowPreferencesModal(false);
  };

  const acceptAll = () => {
    saveConsentToStorage({
      essential: true,
      preferences: true,
      analytics: true,
    });
  };

  const rejectNonEssential = () => {
    saveConsentToStorage({
      essential: true,
      preferences: false,
      analytics: false,
    });
  };

  const savePreferences = (preferences: CookieConsent) => {
    saveConsentToStorage({
      ...preferences,
      essential: true, // Essential always true
    });
  };

  const openPreferences = () => {
    setShowPreferencesModal(true);
  };

  return (
    <CookieConsentContext.Provider
      value={{
        consent,
        showBanner,
        setShowBanner,
        acceptAll,
        rejectNonEssential,
        savePreferences,
        openPreferences,
        showPreferencesModal,
        setShowPreferencesModal,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (context === undefined) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider');
  }
  return context;
}
