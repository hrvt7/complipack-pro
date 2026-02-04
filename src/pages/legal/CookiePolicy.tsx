import { Helmet } from 'react-helmet-async';
import { LegalPageLayout } from './LegalPageLayout';

export default function CookiePolicy() {
  return (
    <>
      <Helmet>
        <title>Cookie Policy - CompliPack</title>
        <meta name="description" content="CompliPack Cookie Policy - Learn about the cookies we use and how to manage your preferences." />
      </Helmet>
      
      <LegalPageLayout title="Cookie Policy" lastUpdated="February 4, 2026">
        <section id="introduction" className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-4">What Are Cookies?</h2>
          <p className="text-muted-foreground leading-relaxed">
            Cookies are small text files stored on your device when you visit our website. They help us recognize you, remember your preferences, and improve your experience.
          </p>
        </section>

        <section id="cookies-we-use" className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Cookies We Use</h2>
          
          <div className="space-y-6">
            <div className="p-6 bg-muted rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-lg font-semibold text-foreground">1. Essential Cookies</h3>
                <span className="px-2 py-1 text-xs font-medium bg-green-500/10 text-green-600 rounded-full">Required</span>
              </div>
              <ul className="space-y-2 text-muted-foreground list-disc list-inside mb-4">
                <li>Authentication session (keeps you logged in)</li>
                <li>Security tokens (CSRF protection)</li>
                <li>Load balancing (distribute traffic)</li>
              </ul>
              <div className="text-sm text-muted-foreground space-y-1">
                <p><strong>Purpose:</strong> Enable core functionality</p>
                <p><strong>Duration:</strong> Session (deleted when you close browser) or 30 days (if "Remember me")</p>
                <p><strong>Legal basis:</strong> Legitimate interest (necessary for Service)</p>
                <p className="text-amber-600"><strong>Cannot be disabled:</strong> Service won't work without these</p>
              </div>
            </div>

            <div className="p-6 bg-muted rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-lg font-semibold text-foreground">2. Preference Cookies</h3>
                <span className="px-2 py-1 text-xs font-medium bg-blue-500/10 text-blue-600 rounded-full">Optional</span>
              </div>
              <ul className="space-y-2 text-muted-foreground list-disc list-inside mb-4">
                <li>Theme selection (dark/light mode)</li>
                <li>Language preference</li>
                <li>Dashboard layout choices</li>
              </ul>
              <div className="text-sm text-muted-foreground space-y-1">
                <p><strong>Purpose:</strong> Remember your settings</p>
                <p><strong>Duration:</strong> 1 year</p>
                <p><strong>Legal basis:</strong> Consent</p>
                <p><strong>Disable:</strong> Clear browser cookies or opt-out in Cookie Settings</p>
              </div>
            </div>

            <div className="p-6 bg-muted rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-lg font-semibold text-foreground">3. Analytics Cookies</h3>
                <span className="px-2 py-1 text-xs font-medium bg-amber-500/10 text-amber-600 rounded-full">Optional</span>
              </div>
              <ul className="space-y-2 text-muted-foreground list-disc list-inside mb-4">
                <li>Privacy-friendly analytics</li>
                <li>No personal data collected</li>
                <li>No cross-site tracking</li>
                <li>EU-hosted</li>
              </ul>
              <div className="text-sm text-muted-foreground space-y-1">
                <p><strong>Purpose:</strong> Understand how users interact with platform (improve UX)</p>
                <p><strong>Duration:</strong> 13 months</p>
                <p><strong>Legal basis:</strong> Consent</p>
                <p><strong>Disable:</strong> Opt-out in Cookie Settings or use browser privacy mode</p>
              </div>
            </div>
          </div>
        </section>

        <section id="not-used" className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Cookies We Do NOT Use</h2>
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
            <ul className="space-y-2 text-muted-foreground">
              <li>❌ Advertising cookies</li>
              <li>❌ Social media cookies</li>
              <li>❌ Third-party tracking cookies</li>
              <li>❌ Cross-site tracking</li>
            </ul>
          </div>
        </section>

        <section id="manage" className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-4">How to Manage Cookies</h2>
          
          <h3 className="text-lg font-medium text-foreground mt-6 mb-3">In CompliPack</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Settings → Privacy → Cookie Preferences
          </p>
          <ul className="space-y-1 text-muted-foreground list-disc list-inside">
            <li>Toggle analytics cookies on/off</li>
            <li>Clear all non-essential cookies</li>
          </ul>

          <h3 className="text-lg font-medium text-foreground mt-6 mb-3">In Your Browser</h3>
          <ul className="space-y-1 text-muted-foreground list-disc list-inside">
            <li><strong>Chrome:</strong> Settings → Privacy → Cookies</li>
            <li><strong>Firefox:</strong> Settings → Privacy → Cookies and Site Data</li>
            <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
            <li><strong>Edge:</strong> Settings → Cookies and site permissions</li>
          </ul>
          <p className="text-amber-600 text-sm mt-4">
            Note: Blocking essential cookies will prevent you from using CompliPack.
          </p>
        </section>

        <section id="consent-banner" className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Cookie Consent Banner</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            First-time visitors see a cookie consent banner. You can:
          </p>
          <ul className="space-y-1 text-muted-foreground list-disc list-inside mb-4">
            <li>Accept all cookies</li>
            <li>Reject non-essential cookies</li>
            <li>Customize preferences</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            Your choice is stored for 1 year. Change anytime in Settings.
          </p>
        </section>

        <section id="updates" className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Updates</h2>
          <p className="text-muted-foreground leading-relaxed">
            We may update this Cookie Policy. Changes will be posted here with updated date.
          </p>
        </section>

        <section id="contact" className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Questions</h2>
          <p className="text-muted-foreground leading-relaxed">
            Email: <a href="mailto:privacy@complipack.io" className="text-primary hover:underline">privacy@complipack.io</a>
          </p>
        </section>
      </LegalPageLayout>
    </>
  );
}
