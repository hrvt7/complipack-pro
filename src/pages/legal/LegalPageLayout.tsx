import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LegalPageLayoutProps {
  title: string;
  lastUpdated: string;
  children: ReactNode;
}

export function LegalPageLayout({ title, lastUpdated, children }: LegalPageLayoutProps) {
  const handleDownloadPDF = () => {
    // In a real implementation, this would generate a PDF
    window.print();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Package className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">
                Compli<span className="text-primary">Pack</span>
              </span>
            </Link>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadPDF}
                className="hidden sm:flex"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-12">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          {/* Title */}
          <header className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">{title}</h1>
            <p className="text-muted-foreground">
              Last Updated: {lastUpdated}
            </p>
          </header>

          {/* Legal Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none legal-content">
            {children}
          </div>
        </motion.article>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm text-muted-foreground mb-4">
              By using CompliPack, you acknowledge that you have read and understood this document.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link to="/legal/terms" className="text-primary hover:underline">Terms of Service</Link>
              <Link to="/legal/privacy" className="text-primary hover:underline">Privacy Policy</Link>
              <Link to="/legal/cookies" className="text-primary hover:underline">Cookie Policy</Link>
              <Link to="/legal/disclaimer" className="text-primary hover:underline">Disclaimer</Link>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              Questions? Contact us at{' '}
              <a href="mailto:legal@complipack.io" className="text-primary hover:underline">
                legal@complipack.io
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
