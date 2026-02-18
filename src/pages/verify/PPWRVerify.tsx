import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  Package, 
  CheckCircle, 
  AlertTriangle, 
  ArrowLeft,
  Box,
  Ruler,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { backendFetch } from '@/lib/backendClient';
import { cn } from '@/lib/utils';

interface PPWRReport {
  id: string;
  created_at: string;
  void_space_percent: number;
  is_ppwr_compliant: boolean;
  products: {
    name: string;
    length_cm: number;
    width_cm: number;
    height_cm: number;
  };
  standard_boxes: {
    name: string;
    length_cm: number;
    width_cm: number;
    height_cm: number;
  };
}

export default function PPWRVerify() {
  const { reportId } = useParams<{ reportId: string }>();
  const [report, setReport] = useState<PPWRReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      if (!reportId) {
        setError('Invalid report ID');
        setLoading(false);
        return;
      }

      try {
        const data = await backendFetch<PPWRReport | { report?: PPWRReport }>(`/api/compliance/report/${reportId}`, {
          method: 'GET',
        });

        const reportPayload = (data as { report?: PPWRReport }).report ?? (data as PPWRReport);

        if (!reportPayload) {
          setError('Report not found');
        } else {
          setReport(reportPayload);
        }
      } catch (err) {
        console.error('Failed to fetch report:', err);
        setError('Failed to load report');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [reportId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold mb-2">Report Not Found</h1>
        <p className="text-muted-foreground mb-6">{error || 'This report does not exist or has been removed.'}</p>
        <Button asChild>
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>
      </div>
    );
  }

  const generatedDate = new Date(report.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <>
      <Helmet>
        <title>PPWR Compliance Verification - CompliPack</title>
        <meta name="description" content={`PPWR compliance verification for ${report.products?.name || 'product'}`} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
        <div className="container max-w-2xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="text-center">
              <Badge variant="outline" className="mb-4">
                PPWR Compliance Report
              </Badge>
              <h1 className="text-3xl font-bold mb-2">{report.products?.name || 'Unknown Product'}</h1>
              <p className="text-muted-foreground flex items-center justify-center gap-2">
                <Calendar className="h-4 w-4" />
                Generated on {generatedDate}
              </p>
            </div>

            {/* Compliance Status */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className={cn(
                "rounded-2xl p-8 text-center",
                report.is_ppwr_compliant
                  ? "bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20"
                  : "bg-gradient-to-br from-destructive/10 to-destructive/5 border border-destructive/20"
              )}
            >
              {report.is_ppwr_compliant ? (
                <>
                  <CheckCircle className="h-16 w-16 mx-auto text-emerald-500 mb-4" />
                  <h2 className="text-2xl font-bold text-emerald-600 mb-2">PPWR Compliant</h2>
                  <p className="text-muted-foreground">
                    This product's packaging meets EU PPWR Article 24 requirements
                  </p>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-16 w-16 mx-auto text-destructive mb-4" />
                  <h2 className="text-2xl font-bold text-destructive mb-2">Non-Compliant</h2>
                  <p className="text-muted-foreground">
                    This product's packaging exceeds the 40% void space threshold
                  </p>
                </>
              )}
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid gap-4"
            >
              {/* Void Space */}
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Package className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Void Space Analysis</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Void Space Percentage</span>
                    <span className={cn(
                      "font-bold",
                      report.is_ppwr_compliant ? "text-emerald-600" : "text-destructive"
                    )}>
                      {report.void_space_percent}%
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        report.is_ppwr_compliant ? "bg-emerald-500" : "bg-destructive"
                      )}
                      style={{ width: `${Math.min(report.void_space_percent, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    PPWR Article 24 requires void space to be under 40%
                  </p>
                </div>
              </div>

              {/* Product Dimensions */}
              {report.products && (
                <div className="rounded-xl border border-border bg-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Ruler className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Product Dimensions</h3>
                  </div>
                  <p className="text-2xl font-mono">
                    {report.products.length_cm} × {report.products.width_cm} × {report.products.height_cm} cm
                  </p>
                </div>
              )}

              {/* Recommended Box */}
              {report.standard_boxes && (
                <div className="rounded-xl border border-border bg-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Box className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Recommended Box</h3>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Badge className="mb-2">{report.standard_boxes.name}</Badge>
                      <p className="text-lg font-mono">
                        {report.standard_boxes.length_cm} × {report.standard_boxes.width_cm} × {report.standard_boxes.height_cm} cm
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Disclaimer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="rounded-lg bg-muted/50 p-4 text-xs text-muted-foreground"
            >
              <p className="font-medium mb-1">Disclaimer</p>
              <p>
                This compliance report is generated by CompliPack for informational purposes only. 
                It does not constitute official certification or legal advice. Please consult with 
                compliance experts for official verification.
              </p>
            </motion.div>

            {/* Back Link */}
            <div className="text-center">
              <Button variant="outline" asChild>
                <Link to="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to CompliPack
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
