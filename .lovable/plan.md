

# CompliPack Phase 3 - Legal Compliance & GDPR Implementation Plan

## Overview
This phase implements comprehensive legal compliance including GDPR-compliant cookie consent, legally safe copywriting across all pages, full Terms of Service and Privacy Policy pages, and GDPR tools in the Settings page. This protects CompliPack from liability claims and ensures EU regulatory compliance.

---

## Architecture Overview

```text
+----------------------------------------------------------+
|                     Legal Compliance System               |
+----------------------------------------------------------+
|                                                           |
|  +-------------------+  +-----------------------------+   |
|  | Cookie Consent    |  |      Legal Pages            |   |
|  | Banner Component  |  | /legal/terms                |   |
|  | (CookieConsent.tsx)|  | /legal/privacy              |   |
|  +-------------------+  | /legal/cookies              |   |
|           |             | /legal/disclaimer           |   |
|           v             +-----------------------------+   |
|  +-------------------+              |                     |
|  | CookieContext.tsx |              v                     |
|  | (consent state)   |  +-----------------------------+   |
|  +-------------------+  |    Settings Privacy Tab     |   |
|                         |  - Cookie preferences        |   |
|                         |  - Data export               |   |
|                         |  - Account deletion          |   |
|                         |  - GDPR rights info          |   |
|                         +-----------------------------+   |
+----------------------------------------------------------+
```

---

## Part 1: Copywriting Updates (Legally Safe Language)

### Files to Modify

**1. Hero.tsx - Landing Page Hero**
Updates to headline and subheadline:
- Headline: Add "DPP-Ready Documentation" instead of "Digital Product Passports"
- Subheadline: Replace "legally compliant" with softer language, add "for informational purposes - not legal advice"
- Feature pills: Update to "PPWR Compliance Tools", "DPP Documentation", "Compliance Reports"

**2. Features.tsx - Feature Cards**
Update all 6 feature cards with legally safe descriptions:
- Card 1: "PPWR Article 24 Compliance Tools" - emphasize "documentation tool"
- Card 2: "DPP-Ready Documentation" - clarify "not official certification"
- Card 3: "Compliance QR Code Labels" - change "verification" to "information"
- Card 5: "Professional Compliance Reports" - add "not legal certification"
- Card 6: "Public Information Pages" - change "verification" to "information"

**3. HowItWorks.tsx - Steps**
- Step 2: Change "checks compliance" to "generates documentation for your records"
- Step 3: Change "compliance data" to "compliance calculations"

**4. Pricing.tsx - Pricing Cards**
- Update section subtitle to mention "documentation in minutes" and "Professional tools for compliance record-keeping"
- Update badge text: "PPWR + DPP Documentation", "Full Documentation Suite"
- Update subtitles: "Start building compliance records", "Complete product documentation tools"

**5. FAQ.tsx - Questions and Answers**
Expand to 8+ questions with legally accurate answers:
- Q1: Add "CompliPack provides calculation tools... We recommend consulting legal professionals"
- Q2: Add "This is not official certification - please consult legal advisors"
- Q3 (NEW): "Are these official certifications?" - Clear NO with bullet points
- Q4: Add "for informational purposes" disclaimer
- Q5: Add "informational tools only... do not constitute official regulatory compliance"
- Q8 (NEW): "What is your liability for fines or penalties?" - Clear liability limitation

**6. Footer.tsx - Add Legal Links**
Add new "Legal" column with:
- Terms of Service (/legal/terms)
- Privacy Policy (/legal/privacy)
- Cookie Policy (/legal/cookies)
- Compliance Disclaimer (/legal/disclaimer)
- Add disclaimer badge at bottom: "Documentation tools for EU compliance - not legal advice"

---

## Part 2: New Legal Pages

### Route Structure
```typescript
// Add to App.tsx
<Route path="/legal/terms" element={<TermsOfService />} />
<Route path="/legal/privacy" element={<PrivacyPolicy />} />
<Route path="/legal/cookies" element={<CookiePolicy />} />
<Route path="/legal/disclaimer" element={<Disclaimer />} />
```

### Page Components to Create

**1. src/pages/legal/TermsOfService.tsx**
Full Terms of Service with 14 sections:
1. Acceptance of Terms
2. Description of Service (with NOT LEGAL ADVICE disclaimer)
3. User Accounts
4. Subscription Plans & Billing
5. User Data & Content
6. Intellectual Property
7. Acceptable Use Policy
8. Disclaimers & Limitation of Liability (CRITICAL section with "AS IS" warranty disclaimer)
9. Modifications to Service & Terms
10. Termination
11. Privacy & Data Protection
12. Dispute Resolution
13. General Provisions
14. Contact Information

Design: Centered column, max-width 800px, readable typography, table of contents with anchor links

**2. src/pages/legal/PrivacyPolicy.tsx**
GDPR-compliant Privacy Policy with 11 sections:
1. Introduction (with Data Controller information)
2. Data We Collect (Account, Product, Usage, Cookies, Communications)
3. How We Use Your Data
4. Data Sharing & Third Parties (Supabase, Stripe, Vercel)
5. International Data Transfers
6. Data Retention periods
7. Your GDPR Rights (Access, Rectification, Erasure, Portability, Object, Withdraw Consent, Complaint)
8. Data Security measures
9. Children's Privacy
10. Changes to Privacy Policy
11. Contact Us (DPO email)

**3. src/pages/legal/CookiePolicy.tsx**
Cookie Policy explaining:
- What cookies are
- Essential cookies (authentication, security)
- Preference cookies (theme, language)
- Analytics cookies (Plausible - optional)
- How to manage cookies
- Cookie consent banner behavior

**4. src/pages/legal/Disclaimer.tsx**
Compliance Disclaimer page with:
- Clear statement that CompliPack is NOT legal advice
- Explanation of what the platform does/doesn't do
- User responsibilities
- Liability limitations
- Recommendation to consult professionals

### Shared Component: LegalPageLayout.tsx
- Consistent layout for all legal pages
- Header with title and "Last Updated" date
- Table of contents with smooth scroll
- "Download PDF" button (generates static PDF)
- Footer with contact information
- Back to home link

---

## Part 3: Cookie Consent System

### New Files

**1. src/contexts/CookieConsentContext.tsx**
Manages cookie consent state:
```typescript
interface CookieConsent {
  essential: boolean;      // Always true
  preferences: boolean;    // Theme, language
  analytics: boolean;      // Plausible analytics
  consentDate: number;     // Timestamp
  version: string;         // Consent version for re-prompting
}
```

Features:
- Check localStorage on mount
- Show banner if no consent or consent > 365 days old
- Persist consent to localStorage
- Expose consent state and update functions

**2. src/components/CookieConsentBanner.tsx**
Floating banner component:

Design:
- Fixed to bottom of screen
- Full width on mobile, centered card on desktop (max-width 600px)
- Glass-morphism background with backdrop blur
- z-index: 9999 (above all content)
- Slide-up animation on mount

Content:
- Cookie emoji icon
- Headline: "We use cookies"
- Explanatory text about essential and optional cookies
- Three buttons:
  1. "Reject Non-Essential" (outline) - Sets only essential
  2. "Customize" (outline) - Opens modal
  3. "Accept All" (primary blue) - Accepts all cookies
- Link to Cookie Policy

**3. src/components/CookiePreferencesModal.tsx**
Detailed preferences modal (opened from "Customize" button):

Sections with toggle switches:
1. Essential Cookies - Always Active badge, no toggle, disabled
2. Preference Cookies - Toggle ON/OFF, default ON
3. Analytics Cookies - Toggle ON/OFF, default OFF

Buttons:
- "Save Preferences" (primary)
- "Accept All" (secondary)
- "Reject All Non-Essential" (link)

---

## Part 4: Terms Acceptance Modal (Signup Flow)

### Modify: src/components/auth/SignupForm.tsx

Add terms acceptance step:
- After form validation, BEFORE account creation
- Show modal with:
  - Title: "Terms & Privacy Agreement"
  - Two required checkboxes:
    1. "I have read and agree to the Terms of Service" (link to /legal/terms)
    2. "I have read and understand the Privacy Policy" (link to /legal/privacy)
  - Fine print about liability, 18+ requirement
  - "Cancel" and "Accept & Create Account" buttons
  - Account creation only proceeds after both checkboxes checked

### New Component: src/components/auth/TermsAcceptanceModal.tsx
Modal with:
- Scales emoji header
- Scrollable abbreviated terms summary
- Two checkbox fields with links
- Disabled submit until both checked

---

## Part 5: GDPR Tools in Settings

### Modify: src/pages/Settings.tsx

Add new "Privacy" tab to existing 4-tab structure (now 5 tabs):
- Account
- Billing
- Preferences
- **Privacy** (NEW)
- Integrations

### Privacy Tab Content

**Section 1: Cookie Preferences**
- Reuse CookiePreferencesModal content
- Current status badges (Analytics: Enabled/Disabled)
- Toggle switches for preferences and analytics

**Section 2: Download Your Data**
- Headline: "Data Portability"
- Explanation text
- "Request Data Export" button
- On click: Generate JSON files (account.json, products.json, reports.json)
- Show toast: "Preparing your data export..."
- Create downloadable ZIP file
- Toast: "Data export ready! Check your email for download link."

**Section 3: Delete Your Account**
- Headline: "Right to Be Forgotten"
- Warning box (red/amber) explaining consequences
- List of what will be deleted vs retained
- "Delete My Account" button (red/danger)
- Opens confirmation modal:
  - Type "DELETE" to confirm
  - Checkbox: "I understand this is permanent"
  - "Cancel" and "Permanently Delete Account" buttons
- On confirm: Log out, show confirmation toast, mark account for deletion

**Section 4: Privacy Rights**
- GDPR rights explanation
- Link to contact DPO
- Link to EU Data Protection Authorities list

---

## Part 6: Navigation Updates

### Modify: src/components/landing/Navbar.tsx

Add to Compliance dropdown menu:
- PPWR Article 24 Info
- Digital Product Passport Info
- EU Regulations Overview
- Divider
- Compliance Disclaimer (NEW) - links to /legal/disclaimer

---

## File Structure Summary

### New Files to Create
```text
src/
├── contexts/
│   └── CookieConsentContext.tsx
├── components/
│   ├── CookieConsentBanner.tsx
│   ├── CookiePreferencesModal.tsx
│   └── auth/
│       └── TermsAcceptanceModal.tsx
└── pages/
    └── legal/
        ├── TermsOfService.tsx
        ├── PrivacyPolicy.tsx
        ├── CookiePolicy.tsx
        ├── Disclaimer.tsx
        └── LegalPageLayout.tsx
```

### Files to Modify
```text
src/
├── App.tsx                         # Add legal routes, CookieConsentProvider
├── components/
│   ├── landing/
│   │   ├── Hero.tsx               # Update copy
│   │   ├── Features.tsx           # Update copy
│   │   ├── HowItWorks.tsx         # Update copy
│   │   ├── Pricing.tsx            # Update copy
│   │   ├── FAQ.tsx                # Update/expand Q&As
│   │   ├── Footer.tsx             # Add legal links
│   │   └── Navbar.tsx             # Add compliance disclaimer link
│   └── auth/
│       └── SignupForm.tsx         # Add terms acceptance flow
└── pages/
    └── Settings.tsx               # Add Privacy tab
```

---

## Implementation Order

### Phase A: Foundation
1. Create CookieConsentContext
2. Create CookieConsentBanner component
3. Create CookiePreferencesModal component
4. Wrap App with CookieConsentProvider
5. Add banner to App.tsx (shows conditionally)

### Phase B: Legal Pages
6. Create LegalPageLayout shared component
7. Create TermsOfService page
8. Create PrivacyPolicy page
9. Create CookiePolicy page
10. Create Disclaimer page
11. Add routes to App.tsx

### Phase C: Copywriting Updates
12. Update Hero.tsx
13. Update Features.tsx
14. Update HowItWorks.tsx
15. Update Pricing.tsx
16. Update FAQ.tsx
17. Update Footer.tsx with legal links
18. Update Navbar.tsx with disclaimer link

### Phase D: Auth Flow
19. Create TermsAcceptanceModal
20. Modify SignupForm to show modal before account creation

### Phase E: Settings Privacy Tab
21. Add Privacy tab to Settings
22. Implement Cookie Preferences section
23. Implement Data Export section
24. Implement Account Deletion section
25. Implement GDPR Rights section

---

## Technical Considerations

### Cookie Consent Logic
```typescript
// On app load
const consent = localStorage.getItem('cookieConsent');
const consentDate = localStorage.getItem('cookieConsentDate');

// Show banner if:
// 1. No consent ever given
// 2. Consent older than 365 days
if (!consent || (consentDate && Date.now() - consentDate > 365 * 24 * 60 * 60 * 1000)) {
  showBanner = true;
}

// If analytics accepted, initialize Plausible (future)
if (consent === 'all' || (parsed && parsed.analytics)) {
  // initPlausible();
}
```

### Data Export Format
```typescript
// Generate ZIP with:
// - account.json (user profile)
// - products.json (all products)
// - reports.json (all reports)
// - export_metadata.json (timestamp, version)

// Use JSZip library or browser API
```

### Terms Version Tracking
```typescript
// Store acceptance record locally (until backend):
interface TermsAcceptance {
  termsVersion: string;    // "v1.0"
  privacyVersion: string;  // "v1.0"
  acceptedAt: string;      // ISO timestamp
  userId: string;
}
localStorage.setItem('termsAcceptance', JSON.stringify(acceptance));
```

---

## Design Consistency

### Legal Pages Styling
- Serif font for readability (Lora or Georgia fallback)
- Max-width 800px, centered
- Large paragraph spacing (1.75em line-height)
- Section headings with anchor links
- Smooth scroll navigation
- Sticky table of contents on desktop
- Mobile-friendly accordion sections

### Cookie Banner Styling
- Glass-morphism: `backdrop-blur-xl bg-card/95 border border-border`
- Rounded corners: `rounded-2xl`
- Shadow: `shadow-2xl`
- Animation: `animate-slide-up` (custom Framer Motion)
- Buttons match existing button styles from landing page

### Modal Styling
- Consistent with existing AddProductModal and GenerateReportModal
- Backdrop blur
- Scale-in animation
- Focus trap for accessibility

---

## Accessibility Considerations

- All modals include focus trap
- Cookie banner is keyboard navigable
- Links to legal pages have proper aria-labels
- Checkboxes in terms modal are properly labeled
- Skip links for legal page content
- Screen reader announcements for toast notifications

---

## Deliverables Summary

1. Cookie consent banner with "Accept All", "Reject", "Customize" options
2. Cookie preferences modal for granular control
3. CookieConsentContext for managing consent state
4. Terms of Service page (14 sections)
5. Privacy Policy page (GDPR-compliant, 11 sections)
6. Cookie Policy page
7. Compliance Disclaimer page
8. LegalPageLayout shared component
9. Updated Hero, Features, HowItWorks, Pricing, FAQ copy
10. Footer with legal links and disclaimer badge
11. Navbar with Compliance Disclaimer link
12. Terms Acceptance modal in signup flow
13. Settings Privacy tab with:
    - Cookie preferences
    - Data export
    - Account deletion
    - GDPR rights info
14. All legal routes added to App.tsx

