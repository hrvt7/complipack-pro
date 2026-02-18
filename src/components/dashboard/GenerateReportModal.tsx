import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  CheckCircle, 
  Download, 
  ArrowRight, 
  ArrowLeft,
  Search,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useProducts, Product } from '@/contexts/ProductsContext';
import { useReports } from '@/contexts/ReportsContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  finalizeReport,
  generateReport,
} from '@/api/reports';

interface GenerateReportModalProps {
  open: boolean;
  onClose: () => void;
  preselectedProductId?: string;
}

type Step = 'select' | 'options' | 'generating' | 'success';
type DppResult = {
  reportId?: string;
  pdfUrl?: string;
  qrUrl?: string;
  publicDppUrl?: string;
  carbonLightTotal?: number | string;
  disclaimer?: string;
};

export function GenerateReportModal({ open, onClose, preselectedProductId }: GenerateReportModalProps) {
  const { products } = useProducts();
  const { addReport } = useReports();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [step, setStep] = useState<Step>('select');
  const [selectedProducts, setSelectedProducts] = useState<string[]>(
    preselectedProductId ? [preselectedProductId] : []
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [reportType, setReportType] = useState<'ppwr' | 'dpp' | 'combined'>('combined');
  const [options, setOptions] = useState({
    qrCodes: true,
    verificationLinks: true,
    materialCharts: false,
    companyLogo: false,
  });
  const [generatedReport, setGeneratedReport] = useState<{ id: string } | null>(null);
  const [dppResult, setDppResult] = useState<DppResult | null>(null);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };

  const handleGenerate = async () => {
    setStep('generating');
    setDppResult(null);

    try {
      if (reportType === 'dpp' || reportType === 'combined') {
        const primaryProductId = selectedProducts[0];
        const product = products.find(p => p.id === primaryProductId);

        if (!primaryProductId || !product) {
          throw new Error('Please select at least one product.');
        }
        if (!user?.id) {
          throw new Error('Please sign in again to generate a DPP.');
        }

        const generated = await generateReport({
          product_id: primaryProductId,
        });
        const reportId =
          generated.report?.id || generated.report_id || generated.id;

        let reportPayload = generated.report ?? generated;

        if (!reportId) {
          throw new Error('Missing report_id from backend response.');
        }

        if (!reportPayload.pdf_url && !reportPayload.qr_url && !reportPayload.public_dpp_url) {
          const finalized = await finalizeReport({
            report_id: reportId,
            actor_id: user.id,
          });
          reportPayload = finalized.report ?? finalized;
        }
        setDppResult({
          reportId,
          pdfUrl: reportPayload.pdf_url,
          qrUrl: reportPayload.qr_url,
          publicDppUrl: reportPayload.public_dpp_url || reportPayload.public_url,
          carbonLightTotal: reportPayload.carbon_light_total,
          disclaimer: reportPayload.disclaimer,
        });
      }

      // Create reports for each selected product (local history)
      selectedProducts.forEach(productId => {
        const product = products.find(p => p.id === productId);
        if (product) {
          addReport({
            productId,
            productName: product.name,
            type: reportType,
            status: 'complete',
          });
        }
      });

      setGeneratedReport({ id: `RPT-${Date.now()}` });
      setStep('success');

      toast({
        title: '✅ Report generated successfully!',
        description: `${selectedProducts.length} report(s) have been created.`,
      });
    } catch (error: any) {
      console.error('Failed to generate report:', error);
      setStep('options');
      const message =
        typeof error?.message === 'string'
          ? error.message
          : 'Please try again.';
      const needsConfirmation = message.toLowerCase().includes('packaging dimensions must be confirmed');

      toast({
        title: 'Report generation failed',
        description: needsConfirmation
          ? 'Méreteket még nem erősítetted meg. Kattints a Confirm Dimensions gombra!'
          : message,
        variant: 'destructive',
      });
    }
  };

  const handleClose = () => {
    setStep('select');
    setSelectedProducts(preselectedProductId ? [preselectedProductId] : []);
    setSearchQuery('');
    setReportType('combined');
    setGeneratedReport(null);
    setDppResult(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generate Compliance Report
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {/* Step 1: Select Products */}
            {step === 'select' && (
              <motion.div
                key="select"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Button variant="ghost" size="sm" onClick={handleSelectAll}>
                    {selectedProducts.length === filteredProducts.length ? 'Deselect All' : 'Select All'}
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {selectedProducts.length} selected
                  </span>
                </div>

                <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
                  {filteredProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer",
                        selectedProducts.includes(product.id)
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-muted-foreground/30"
                      )}
                      onClick={() => handleSelectProduct(product.id)}
                    >
                      <Checkbox 
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => {}}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {product.length}×{product.width}×{product.height} cm
                        </p>
                      </div>
                      <Badge 
                        variant={product.ppwrCompliant ? 'default' : 'destructive'}
                        className={cn(
                          "text-xs",
                          product.ppwrCompliant && 'bg-emerald-500/10 text-emerald-600'
                        )}
                      >
                        {product.ppwrCompliant ? 'Compliant' : 'Non-Compliant'}
                      </Badge>
                    </motion.div>
                  ))}
                </div>

                <Button 
                  onClick={() => setStep('options')} 
                  className="w-full gap-2"
                  disabled={selectedProducts.length === 0}
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            )}

            {/* Step 2: Report Options */}
            {step === 'options' && (
              <motion.div
                key="options"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Report Type</Label>
                  <RadioGroup value={reportType} onValueChange={(v: any) => setReportType(v)}>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/30 cursor-pointer">
                        <RadioGroupItem value="ppwr" id="ppwr" />
                        <div>
                          <Label htmlFor="ppwr" className="cursor-pointer font-medium">PPWR Only</Label>
                          <p className="text-sm text-muted-foreground">EU Packaging compliance report (1 page)</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/30 cursor-pointer">
                        <RadioGroupItem value="dpp" id="dpp" />
                        <div>
                          <Label htmlFor="dpp" className="cursor-pointer font-medium">DPP Only</Label>
                          <p className="text-sm text-muted-foreground">Digital Product Passport (1 page)</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg border border-primary/50 bg-primary/5 cursor-pointer">
                        <RadioGroupItem value="combined" id="combined" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Label htmlFor="combined" className="cursor-pointer font-medium">Combined PPWR + DPP</Label>
                            <Badge className="bg-primary/20 text-primary text-xs">Recommended</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">Complete compliance package (2 pages)</p>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-semibold">Include Options</Label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        id="qrCodes" 
                        checked={options.qrCodes}
                        onCheckedChange={(checked) => setOptions(o => ({ ...o, qrCodes: !!checked }))}
                      />
                      <Label htmlFor="qrCodes" className="cursor-pointer">QR codes (print-ready labels)</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        id="verificationLinks" 
                        checked={options.verificationLinks}
                        onCheckedChange={(checked) => setOptions(o => ({ ...o, verificationLinks: !!checked }))}
                      />
                      <Label htmlFor="verificationLinks" className="cursor-pointer">Public verification links</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        id="materialCharts" 
                        checked={options.materialCharts}
                        onCheckedChange={(checked) => setOptions(o => ({ ...o, materialCharts: !!checked }))}
                        disabled={reportType === 'ppwr'}
                      />
                      <Label htmlFor="materialCharts" className={cn("cursor-pointer", reportType === 'ppwr' && "text-muted-foreground")}>
                        Material composition charts (DPP only)
                      </Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        id="companyLogo" 
                        checked={options.companyLogo}
                        disabled
                      />
                      <Label htmlFor="companyLogo" className="cursor-pointer text-muted-foreground flex items-center gap-2">
                        Company logo
                        <Badge variant="outline" className="text-xs">Pro</Badge>
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep('select')} className="flex-1 gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                  <Button onClick={handleGenerate} className="flex-1">
                    Generate Report
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Generating */}
            {step === 'generating' && (
              <motion.div
                key="generating"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="py-12 text-center space-y-6"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <Loader2 className="h-16 w-16 mx-auto text-primary" />
                </motion.div>
                
                <div className="space-y-2">
                  <p className="text-lg font-semibold">Generating report...</p>
                  <p className="text-sm text-muted-foreground">This may take a few seconds</p>
                </div>
              </motion.div>
            )}

            {/* Step 4: Success */}
            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="py-12 text-center space-y-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                >
                  <CheckCircle className="h-20 w-20 mx-auto text-emerald-500" />
                </motion.div>
                
              <div className="space-y-2">
                <p className="text-xl font-semibold">Report Generated!</p>
                <p className="text-sm text-muted-foreground">
                  {selectedProducts.length} report(s) have been created
                </p>
              </div>

              {dppResult && (
                <div className="rounded-lg border border-border p-4 text-left space-y-3">
                  <div className="text-sm font-medium">DPP Output</div>
                  <div className="flex flex-wrap gap-2">
                    {dppResult.pdfUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(dppResult.pdfUrl, '_blank')}
                      >
                        Open PDF
                      </Button>
                    )}
                    {dppResult.qrUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(dppResult.qrUrl, '_blank')}
                      >
                        Open QR
                      </Button>
                    )}
                    {dppResult.publicDppUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(dppResult.publicDppUrl, '_blank')}
                      >
                        Open Public DPP
                      </Button>
                    )}
                  </div>
                  {dppResult.carbonLightTotal !== undefined && (
                    <div className="text-xs text-muted-foreground">
                      Carbon total: {dppResult.carbonLightTotal}
                    </div>
                  )}
                  {dppResult.disclaimer && (
                    <div className="text-xs text-muted-foreground">
                      {dppResult.disclaimer}
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-col gap-3 max-w-xs mx-auto">
                <Button
                  className="w-full gap-2"
                  onClick={() => dppResult?.pdfUrl && window.open(dppResult.pdfUrl, '_blank')}
                  disabled={!dppResult?.pdfUrl}
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
                  <Button variant="outline" onClick={handleClose}>
                    Done
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
