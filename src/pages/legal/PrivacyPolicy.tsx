import { Helmet } from 'react-helmet-async';
import { LegalPageLayout } from './LegalPageLayout';

export default function PrivacyPolicy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - CompliPack</title>
        <meta name="description" content="CompliPack Privacy Policy - Learn how we collect, use, and protect your personal data in compliance with GDPR." />
      </Helmet>
      
      <LegalPageLayout title="Privacy Policy" lastUpdated="February 4, 2026">
        <section id="introduction" className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-4">1. Introduction</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            CompliPack ("we", "us", "our") is committed to protecting your privacy and personal data in accordance with the EU General Data Protection Regulation (GDPR) and other applicable data protection laws.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            This Privacy Policy explains what personal data we collect, why we collect it (legal basis), how we use, store, and protect it, your rights regarding your data, and how to contact us about privacy.
          </p>
          
          <div className="bg-muted rounded-xl p-6 my-6">
            <h3 className="font-semibold text-foreground mb-3">Data Controller</h3>
            <p className="text-muted-foreground">
              CompliPack Ltd.<br />
              Email: privacy@complipack.io
            </p>
          </div>
        </section>

        <section id="data-collection" className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-4">2. Data We Collect</h2>
          
          <h3 className="text-xl font-medium text-foreground mt-6 mb-3">2.1 Account Information (provided by you)</h3>
          <ul className="space-y-2 text-muted-foreground list-disc list-inside mb-4">
            <li>Full name</li>
            <li>Email address</li>
            <li>Password (encrypted, never stored in plain text)</li>
            <li>Company name (optional)</li>
            <li>Phone number (optional)</li>
            <li>Billing address</li>
            <li>Payment information (processed by Stripe, not stored by us)</li>
          </ul>
          <p className="text-sm text-muted-foreground italic">
            Legal Basis: Contract performance (providing Service), Legitimate interest (business operations)
          </p>

          <h3 className="text-xl font-medium text-foreground mt-6 mb-3">2.2 Product Data (provided by you)</h3>
          <ul className="space-y-2 text-muted-foreground list-disc list-inside mb-4">
            <li>Product names and descriptions</li>
            <li>Product dimensions, weight, materials</li>
            <li>Any other information you voluntarily input</li>
          </ul>
          <p className="text-sm text-muted-foreground italic">
            Legal Basis: Contract performance (generating reports as requested)<br />
            Retention: Until account deletion or 30 days after subscription ends
          </p>

          <h3 className="text-xl font-medium text-foreground mt-6 mb-3">2.3 Usage Data (automatically collected)</h3>
          <ul className="space-y-2 text-muted-foreground list-disc list-inside mb-4">
            <li>IP address</li>
            <li>Browser type and version</li>
            <li>Device information</li>
            <li>Pages visited, time spent</li>
            <li>Referring website</li>
            <li>Login timestamps</li>
          </ul>
          <p className="text-sm text-muted-foreground italic">
            Legal Basis: Legitimate interest (service improvement, security, analytics)<br />
            Retention: 13 months
          </p>

          <h3 className="text-xl font-medium text-foreground mt-6 mb-3">2.4 Cookies</h3>
          <p className="text-muted-foreground leading-relaxed">
            Please see our <a href="/legal/cookies" className="text-primary hover:underline">Cookie Policy</a> for details on cookies we use.
          </p>

          <h3 className="text-xl font-medium text-foreground mt-6 mb-3">2.5 Communications</h3>
          <ul className="space-y-2 text-muted-foreground list-disc list-inside mb-4">
            <li>Support ticket messages</li>
            <li>Email correspondence</li>
            <li>Survey responses (voluntary)</li>
          </ul>
          <p className="text-sm text-muted-foreground italic">
            Legal Basis: Consent, Contract performance<br />
            Retention: 3 years for support records
          </p>
        </section>

        <section id="data-use" className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-4">3. How We Use Your Data</h2>
          
          <h3 className="text-lg font-medium text-foreground mt-4 mb-2">Provide the Service</h3>
          <ul className="space-y-1 text-muted-foreground list-disc list-inside mb-4">
            <li>Authenticate your account</li>
            <li>Process your product data</li>
            <li>Generate compliance reports</li>
            <li>Display your dashboard</li>
            <li>Send service notifications</li>
          </ul>

          <h3 className="text-lg font-medium text-foreground mt-4 mb-2">Billing & Payments</h3>
          <ul className="space-y-1 text-muted-foreground list-disc list-inside mb-4">
            <li>Process subscription payments (via Stripe)</li>
            <li>Send invoices and receipts</li>
            <li>Manage subscription status</li>
          </ul>

          <h3 className="text-lg font-medium text-foreground mt-4 mb-2">Communications</h3>
          <ul className="space-y-1 text-muted-foreground list-disc list-inside mb-4">
            <li>Respond to support requests</li>
            <li>Send important service updates</li>
            <li>Notify of account activity</li>
            <li>Send optional marketing (with consent, unsubscribe anytime)</li>
          </ul>

          <h3 className="text-lg font-medium text-foreground mt-4 mb-2">Improve Service</h3>
          <ul className="space-y-1 text-muted-foreground list-disc list-inside mb-4">
            <li>Analyze usage patterns (anonymized)</li>
            <li>Fix bugs and errors</li>
            <li>Develop new features</li>
          </ul>

          <h3 className="text-lg font-medium text-foreground mt-4 mb-2">Security & Legal</h3>
          <ul className="space-y-1 text-muted-foreground list-disc list-inside">
            <li>Detect and prevent unauthorized access</li>
            <li>Investigate violations of Terms</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section id="data-sharing" className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-4">4. Data Sharing & Third Parties</h2>
          
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6">
            <p className="text-foreground font-medium">We do NOT sell your personal data.</p>
          </div>

          <p className="text-muted-foreground mb-4">We share data only with these trusted service providers:</p>

          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium text-foreground">Supabase (Database & Authentication)</h4>
              <p className="text-sm text-muted-foreground">Purpose: Store account and product data. Location: EU data centers (GDPR-compliant).</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium text-foreground">Stripe (Payment Processing)</h4>
              <p className="text-sm text-muted-foreground">Purpose: Process subscription payments. Data shared: Email, name, billing address. EU-US Data Privacy Framework certified.</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium text-foreground">Vercel (Hosting)</h4>
              <p className="text-sm text-muted-foreground">Purpose: Host platform infrastructure. Location: EU data centers.</p>
            </div>
          </div>

          <p className="text-muted-foreground mt-6">
            We may also disclose data to comply with legal obligations, protect our rights or safety, or in connection with business transfer (you will be notified).
          </p>
        </section>

        <section id="international-transfers" className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-4">5. International Data Transfers</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            <strong className="text-foreground">Within EU:</strong> Primary data storage is in EU data centers.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            <strong className="text-foreground">Outside EU:</strong> Some service providers may transfer data outside the EU under EU-US Data Privacy Framework or Standard Contractual Clauses approved by EU Commission.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Your Rights:</strong> You may object to international transfers. Contact privacy@complipack.io.
          </p>
        </section>

        <section id="data-retention" className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-4">6. Data Retention</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">We retain personal data only as long as necessary:</p>
          <ul className="space-y-2 text-muted-foreground list-disc list-inside">
            <li>Account data: Until account deletion + 30 days</li>
            <li>Product data: Until account deletion + 30 days</li>
            <li>Usage logs: 13 months</li>
            <li>Support tickets: 3 years</li>
            <li>Financial records: 7 years (legal requirement)</li>
            <li>Backups: 90 days (then permanently deleted)</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-4">
            After retention period, data is permanently and irreversibly deleted.
          </p>
        </section>

        <section id="gdpr-rights" className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-4">7. Your Rights (GDPR)</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">Under GDPR, you have the following rights:</p>
          
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium text-foreground">Right to Access</h4>
              <p className="text-sm text-muted-foreground">Request copy of your personal data, provided in machine-readable format (JSON or CSV), delivered within 30 days.</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium text-foreground">Right to Rectification</h4>
              <p className="text-sm text-muted-foreground">Correct inaccurate data. Update anytime in account settings or email privacy@complipack.io.</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium text-foreground">Right to Erasure ("Right to be Forgotten")</h4>
              <p className="text-sm text-muted-foreground">Delete your account and all data. Available in Settings → Privacy → Delete Account. Exceptions: Data required for legal/accounting purposes.</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium text-foreground">Right to Restrict Processing</h4>
              <p className="text-sm text-muted-foreground">Limit how we use your data. Request via privacy@complipack.io.</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium text-foreground">Right to Data Portability</h4>
              <p className="text-sm text-muted-foreground">Export your data in structured format. Available in Settings → Privacy → Export Data.</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium text-foreground">Right to Object</h4>
              <p className="text-sm text-muted-foreground">Object to data processing based on legitimate interest. Object to marketing (unsubscribe link in emails).</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium text-foreground">Right to Withdraw Consent</h4>
              <p className="text-sm text-muted-foreground">Withdraw cookie consent anytime. Withdraw marketing consent anytime.</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium text-foreground">Right to Lodge Complaint</h4>
              <p className="text-sm text-muted-foreground">File complaint with your national data protection authority. Hungary: naih.hu</p>
            </div>
          </div>

          <p className="text-muted-foreground leading-relaxed mt-6">
            <strong className="text-foreground">To Exercise Rights:</strong> Email privacy@complipack.io with subject "GDPR Request" and proof of identity. We respond within 30 days.
          </p>
        </section>

        <section id="data-security" className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-4">8. Data Security</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">We implement appropriate technical and organizational measures:</p>
          
          <h3 className="text-lg font-medium text-foreground mt-4 mb-2">Technical Measures</h3>
          <ul className="space-y-1 text-muted-foreground list-disc list-inside mb-4">
            <li>Encryption in transit (TLS 1.3)</li>
            <li>Encryption at rest (AES-256)</li>
            <li>Password hashing (bcrypt)</li>
            <li>Secure session management</li>
            <li>Regular security updates</li>
            <li>Automated backups (encrypted)</li>
          </ul>

          <h3 className="text-lg font-medium text-foreground mt-4 mb-2">Organizational Measures</h3>
          <ul className="space-y-1 text-muted-foreground list-disc list-inside mb-4">
            <li>Access controls (role-based)</li>
            <li>Employee training on data protection</li>
            <li>Incident response plan</li>
            <li>Regular security audits</li>
            <li>Data Processing Agreements with vendors</li>
          </ul>

          <p className="text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Breach Notification:</strong> In case of data breach affecting your rights, we will notify you and relevant authorities within 72 hours as required by GDPR.
          </p>
        </section>

        <section id="children" className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-4">9. Children's Privacy</h2>
          <p className="text-muted-foreground leading-relaxed">
            CompliPack is not intended for individuals under 18. We do not knowingly collect data from children. If we become aware of data collected from a child, we will delete it immediately. Parents/guardians: Contact privacy@complipack.io if you believe a child has provided data.
          </p>
        </section>

        <section id="changes" className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-4">10. Changes to Privacy Policy</h2>
          <p className="text-muted-foreground leading-relaxed">
            We may update this Privacy Policy periodically. Material changes will be notified via email notification (30 days advance), banner on platform, and updated "Last Updated" date. Continued use after changes constitutes acceptance. If you disagree, please delete your account.
          </p>
        </section>

        <section id="contact" className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-4">11. Contact Us</h2>
          <div className="bg-muted rounded-xl p-6">
            <p className="text-muted-foreground mb-2"><strong className="text-foreground">Data Protection Officer (DPO):</strong> privacy@complipack.io</p>
            <p className="text-muted-foreground"><strong className="text-foreground">General Support:</strong> support@complipack.io</p>
          </div>
        </section>
      </LegalPageLayout>
    </>
  );
}
