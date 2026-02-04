import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  Leaf, 
  Droplets, 
  Recycle, 
  ArrowLeft,
  Calendar,
  AlertTriangle,
  Ruler,
  Wrench
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { DPPData } from '@/services/complianceService';

interface DPPReport {
  id: string;
  created_at: string;
  dpp_data: DPPData;
  products: {
    name: string;
    description?: string;
  };
}

export default function DPPVerify() {
  const { reportId } = useParams<{ reportId: string }>();
  const [report, setReport] = useState<DPPReport | null>(null);
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
        const { data, error: fetchError } = await supabase
          .from('compliance_reports')
          .select(`
            id,
            created_at,
            dpp_data,
            products (name, description)
          `)
          .eq('id', reportId)
          .maybeSingle();

        if (fetchError) throw fetchError;
        if (!data) {
          setError('Report not found');
        } else {
          setReport(data as unknown as DPPReport);
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

  if (error || !report || !report.dpp_data) {
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

  const dpp = report.dpp_data;
  const generatedDate = new Date(report.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <>
      <Helmet>
        <title>Digital Product Passport - CompliPack</title>
        <meta name="description" content={`Digital Product Passport for ${report.products?.name || 'product'}`} />
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
              <Badge variant="outline" className="mb-4 bg-primary/10 text-primary border-primary/20">
                Digital Product Passport
              </Badge>
              <h1 className="text-3xl font-bold mb-2">{report.products?.name || dpp.productName}</h1>
              <p className="text-muted-foreground flex items-center justify-center gap-2">
                <Calendar className="h-4 w-4" />
                Generated on {generatedDate}
              </p>
            </div>

            {/* Sustainability Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid gap-4"
            >
              {/* Carbon Footprint */}
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-emerald-500/10">
                    <Leaf className="h-5 w-5 text-emerald-500" />
                  </div>
                  <h3 className="font-semibold">Carbon Footprint</h3>
                </div>
                <p className="text-3xl font-bold text-emerald-600 mb-1">
                  {dpp.carbonFootprintKg} kg CO₂
                </p>
                <p className="text-sm text-muted-foreground">
                  Estimated carbon emissions from production
                </p>
              </div>

              {/* Water Usage */}
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Droplets className="h-5 w-5 text-blue-500" />
                  </div>
                  <h3 className="font-semibold">Water Usage</h3>
                </div>
                <p className="text-3xl font-bold text-blue-600 mb-1">
                  {dpp.waterUsageLiters} L
                </p>
                <p className="text-sm text-muted-foreground">
                  Estimated water consumption in production
                </p>
              </div>

              {/* Recyclability */}
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-amber-500/10">
                    <Recycle className="h-5 w-5 text-amber-500" />
                  </div>
                  <h3 className="font-semibold">Recyclability Score</h3>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Progress value={dpp.recyclabilityScore} className="h-3" />
                  </div>
                  <span className="text-2xl font-bold text-amber-600">
                    {dpp.recyclabilityScore}%
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Based on material composition
                </p>
              </div>
            </motion.div>

            {/* Product Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              {/* Dimensions */}
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Ruler className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Dimensions</h3>
                </div>
                <p className="text-lg font-mono">{dpp.dimensions}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Volume: {dpp.volume.toLocaleString()} cm³
                </p>
              </div>

              {/* Materials */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-semibold mb-3">Materials</h3>
                <p className="text-muted-foreground">{dpp.materials}</p>
              </div>

              {/* Care Instructions */}
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Wrench className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Care Instructions</h3>
                </div>
                <p className="text-muted-foreground">{dpp.careInstructions}</p>
              </div>

              {/* End of Life */}
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Recycle className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">End of Life Options</h3>
                </div>
                <p className="text-muted-foreground">{dpp.endOfLifeOptions}</p>
              </div>
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
                This Digital Product Passport is generated by CompliPack for informational purposes only. 
                Environmental impact values are estimates based on product dimensions and materials. 
                This does not constitute official EU DPP certification. Please consult compliance experts 
                for official verification.
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
