import { Helmet } from 'react-helmet-async';
import { LegalPageLayout } from './LegalPageLayout';
import { AlertTriangle } from 'lucide-react';

export default function Disclaimer() {
  return (
    <>
      <Helmet>
        <title>Compliance Disclaimer - CompliPack</title>
        <meta name="description" content="CompliPack Compliance Disclaimer - Important information about our documentation tools and their limitations." />
      </Helmet>
      
      <LegalPageLayout title="Compliance Disclaimer" lastUpdated="February 4, 2026">
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6 mb-12">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-8 h-8 text-amber-500 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Important Notice</h2>
              <p className="text-muted-foreground leading-relaxed">
                CompliPack is a software tool that provides documentation and calculation features. 
                It is NOT a substitute for professional legal, regulatory, or compliance advice.
              </p>
            </div>
          </div>
        </div>

        <section id="what-we-provide" className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-4">What CompliPack Provides</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>Software tools for calculating packaging void space based on user-provided dimensions</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>Documentation templates structured according to PPWR and DPP guidelines</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>QR code generation linking to product information pages</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>PDF report generation for internal record-keeping</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>Estimated calculations based on industry averages (carbon footprint, recyclability)</span>
            </li>
          </ul>
        </section>

        <section id="what-we-dont-provide" className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-4">What CompliPack Does NOT Provide</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">✗</span>
              <span><strong className="text-foreground">Legal advice</strong> – We do not provide legal opinions or regulatory guidance</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">✗</span>
              <span><strong className="text-foreground">Official certifications</strong> – Our reports are not official stamps of approval or regulatory clearances</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">✗</span>
              <span><strong className="text-foreground">Official EU Digital Product Passports</strong> – We provide DPP-ready documentation, not official DPPs as defined by EU regulations</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">✗</span>
              <span><strong className="text-foreground">Compliance guarantees</strong> – We cannot guarantee that using our tools will result in regulatory compliance</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">✗</span>
              <span><strong className="text-foreground">Laboratory testing</strong> – Carbon footprint, recyclability, and durability scores are estimates, not measured values</span>
            </li>
          </ul>
        </section>

        <section id="user-responsibilities" className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Your Responsibilities</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">As a CompliPack user, you are responsible for:</p>
          <ul className="space-y-2 text-muted-foreground list-disc list-inside">
            <li>Ensuring the accuracy of all product data you input</li>
            <li>Verifying that your products meet all applicable EU regulations</li>
            <li>Consulting with qualified legal and compliance professionals</li>
            <li>Keeping your documentation up to date as regulations change</li>
            <li>Understanding that CompliPack reports are for informational purposes only</li>
            <li>Not relying solely on CompliPack for regulatory compliance decisions</li>
          </ul>
        </section>

        <section id="accuracy" className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Calculation Accuracy</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            CompliPack uses precise geometric formulas to calculate void space and recommend optimal box sizes. However:
          </p>
          <ul className="space-y-2 text-muted-foreground list-disc list-inside">
            <li>Results depend entirely on the accuracy of user-provided dimensions</li>
            <li>Real-world packaging may differ from mathematical models</li>
            <li>Material estimates are based on industry averages, not specific product testing</li>
            <li>Carbon footprint calculations are estimates and not certified measurements</li>
          </ul>
        </section>

        <section id="liability" className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Limitation of Liability</h2>
          <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-6">
            <p className="text-muted-foreground leading-relaxed mb-4">
              CompliPack, its officers, directors, employees, and agents shall NOT be liable for:
            </p>
            <ul className="space-y-2 text-muted-foreground list-disc list-inside">
              <li>Any fines, penalties, or legal consequences resulting from regulatory non-compliance</li>
              <li>Decisions made based on CompliPack reports or calculations</li>
              <li>Any indirect, incidental, consequential, special, or punitive damages</li>
              <li>Loss of profits, revenue, data, or business opportunities</li>
              <li>Third-party claims arising from your use of CompliPack</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4 font-semibold">
              Our total liability shall not exceed the amount you paid to CompliPack in the 12 months preceding any claim, or €100, whichever is less.
            </p>
          </div>
        </section>

        <section id="recommendations" className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Our Recommendations</h2>
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
            <p className="text-muted-foreground leading-relaxed mb-4">
              We strongly recommend that you:
            </p>
            <ul className="space-y-2 text-muted-foreground list-disc list-inside">
              <li><strong className="text-foreground">Consult legal professionals</strong> who specialize in EU packaging and product regulations</li>
              <li><strong className="text-foreground">Verify all data</strong> before submitting products to regulatory authorities</li>
              <li><strong className="text-foreground">Stay informed</strong> about changes to PPWR, DPP, and other EU regulations</li>
              <li><strong className="text-foreground">Use CompliPack as a starting point</strong>, not as your sole source of compliance documentation</li>
              <li><strong className="text-foreground">Conduct proper testing</strong> for material composition, carbon footprint, and recyclability claims</li>
            </ul>
          </div>
        </section>

        <section id="regulatory-context" className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Regulatory Context</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            CompliPack is designed to help you prepare for:
          </p>
          <ul className="space-y-3 text-muted-foreground">
            <li>
              <strong className="text-foreground">PPWR (Packaging and Packaging Waste Regulation)</strong> – Article 24 requires packaging void space to be under 40% by August 12, 2026.
            </li>
            <li>
              <strong className="text-foreground">Digital Product Passports</strong> – Mandatory for batteries (Feb 2027), textiles (Jul 2028), and electronics (2030+).
            </li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-4">
            These regulations are complex and subject to change. Always refer to official EU sources and consult qualified professionals for the most current requirements.
          </p>
        </section>

        <section id="contact" className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Questions</h2>
          <p className="text-muted-foreground leading-relaxed">
            If you have questions about this disclaimer or CompliPack's capabilities and limitations, please contact us at{' '}
            <a href="mailto:legal@complipack.io" className="text-primary hover:underline">legal@complipack.io</a>.
          </p>
        </section>
      </LegalPageLayout>
    </>
  );
}
