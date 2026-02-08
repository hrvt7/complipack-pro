import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Download, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useProducts } from '@/contexts/ProductsContext';
import { useToast } from '@/hooks/use-toast';
import {
  commitCsvImport,
  previewCsvImport,
  type CsvImportRow,
} from '@/api/csvImport';

interface ImportCSVModalProps {
  open: boolean;
  onClose: () => void;
}

type Step = 'instructions' | 'upload' | 'preview' | 'importing' | 'complete';

const formatBackendError = (error: unknown): string => {
  const fallback = error instanceof Error ? error.message : 'Unexpected error';
  if (!error || typeof error !== 'object') {
    return fallback;
  }

  const err = error as { message?: string; details?: any };
  const details = err.details;

  if (!details || typeof details !== 'object') {
    return fallback;
  }

  const message = details.message ?? err.message ?? fallback;
  const code = details.code ? `code: ${details.code}` : null;
  const extra = details.details ?? details.error ?? details.meta ?? null;
  const extraText =
    extra !== null && extra !== undefined
      ? `details: ${typeof extra === 'string' ? extra : JSON.stringify(extra)}`
      : null;

  return [message, code, extraText].filter(Boolean).join(' | ');
};

export function ImportCSVModal({ open, onClose }: ImportCSVModalProps) {
  const { refreshProducts } = useProducts();
  const { toast } = useToast();
  const [step, setStep] = useState<Step>('instructions');
  const [parsedData, setParsedData] = useState<CsvImportRow[]>([]);
  const [previewSummary, setPreviewSummary] = useState({
    validCount: 0,
    invalidCount: 0,
    errors: [] as string[],
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importProgress, setImportProgress] = useState(0);
  const [importResults, setImportResults] = useState({ success: 0, failed: 0 });

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleFile = useCallback(
    async (file: File) => {
      setSelectedFile(file);

      try {
        const preview = await previewCsvImport(file);
        setParsedData(preview.rows);
        setPreviewSummary({
          validCount: preview.validCount,
          invalidCount: preview.invalidCount,
          errors: preview.errors,
        });
        setStep('preview');
      } catch (error) {
        console.error('CSV preview failed:', error);
        const message = formatBackendError(error);
        toast({
          title: 'CSV preview failed',
          description: message,
          variant: 'destructive',
        });
        setParsedData([]);
        setPreviewSummary({ validCount: 0, invalidCount: 0, errors: [] });
        setStep('upload');
      }
    },
    [toast]
  );

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.csv')) {
      void handleFile(file);
    } else {
      toast({
        title: 'Invalid file',
        description: 'Please upload a .csv file.',
        variant: 'destructive',
      });
    }
  }, [handleFile, toast]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith('.csv')) {
      void handleFile(file);
    } else if (file) {
      toast({
        title: 'Invalid file',
        description: 'Please upload a .csv file.',
        variant: 'destructive',
      });
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      toast({
        title: 'No CSV selected',
        description: 'Please upload a CSV file first.',
        variant: 'destructive',
      });
      return;
    }

    setStep('importing');
    setImportProgress(20);

    try {
      const result = await commitCsvImport(selectedFile);
      setImportProgress(100);
      setImportResults({ success: result.success, failed: result.failed });
      await refreshProducts();
      setStep('complete');
    } catch (error) {
      console.error('CSV import failed:', error);
      const message = formatBackendError(error);
      toast({
        title: 'Import failed',
        description: message,
        variant: 'destructive',
      });
      setImportProgress(0);
      setStep('preview');
    }
  };

  const downloadTemplate = () => {
    const template = 'product_name,length_cm,width_cm,height_cm,weight_kg,materials,description\nBlue Cotton T-Shirt,25,20,5,0.3,100% Cotton,Classic fit t-shirt\nCeramic Coffee Mug,12,10,10,0.4,Ceramic,350ml capacity';
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'complipack_import_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClose = () => {
    setStep('instructions');
    setParsedData([]);
    setPreviewSummary({ validCount: 0, invalidCount: 0, errors: [] });
    setSelectedFile(null);
    setImportProgress(0);
    setImportResults({ success: 0, failed: 0 });
    onClose();
  };

  const validCount = previewSummary.validCount;
  const invalidCount = previewSummary.invalidCount;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Products from CSV
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {/* Step 1: Instructions */}
          {step === 'instructions' && (
            <motion.div
              key="instructions"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="rounded-lg bg-muted/30 p-4 space-y-3">
                <p className="text-sm font-medium">Upload a CSV file with these columns:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <code className="text-primary">product_name</code> (required)</li>
                  <li>• <code className="text-primary">length_cm</code> (required)</li>
                  <li>• <code className="text-primary">width_cm</code> (required)</li>
                  <li>• <code className="text-primary">height_cm</code> (required)</li>
                  <li>• <code className="text-muted-foreground">weight_kg</code> (optional)</li>
                  <li>• <code className="text-muted-foreground">materials</code> (optional)</li>
                  <li>• <code className="text-muted-foreground">description</code> (optional)</li>
                </ul>
              </div>

              <Button variant="outline" onClick={downloadTemplate} className="w-full gap-2">
                <Download className="h-4 w-4" />
                Download CSV Template
              </Button>

              <Button onClick={() => setStep('upload')} className="w-full">
                Continue to Upload
              </Button>
            </motion.div>
          )}

          {/* Step 2: Upload */}
          {step === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div
                onDragOver={handleDragOver}
                onDrop={handleFileDrop}
                className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer"
              >
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="csv-upload"
                />
                <label htmlFor="csv-upload" className="cursor-pointer">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="font-medium">Drag & drop CSV file here</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    or <span className="text-primary">click to browse</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    .csv files only, max 5 MB
                  </p>
                </label>
              </div>

              <Button variant="outline" onClick={() => setStep('instructions')} className="w-full">
                Back
              </Button>
            </motion.div>
          )}

          {/* Step 3: Preview */}
          {step === 'preview' && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span>{validCount} valid</span>
                </div>
                {invalidCount > 0 && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <span>{invalidCount} with errors</span>
                  </div>
                )}
              </div>

              <div className="max-h-[300px] overflow-auto rounded-lg border border-border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead>Status</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Dimensions</TableHead>
                      <TableHead>Weight</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parsedData.slice(0, 10).map((row, index) => (
                      <TableRow key={index} className={!row.isValid ? 'bg-destructive/5' : ''}>
                        <TableCell>
                          {row.isValid ? (
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-destructive" />
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{row.product_name || '-'}</TableCell>
                        <TableCell>
                          {row.length_cm}×{row.width_cm}×{row.height_cm} cm
                        </TableCell>
                        <TableCell>{row.weight_kg ? `${row.weight_kg} kg` : '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {parsedData.length > 10 && (
                <p className="text-sm text-muted-foreground text-center">
                  Showing first 10 of {parsedData.length} products
                </p>
              )}

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep('upload')} className="flex-1">
                  Back
                </Button>
                <Button 
                  onClick={handleImport} 
                  className="flex-1"
                  disabled={validCount === 0}
                >
                  Import {validCount} Products
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Importing */}
          {step === 'importing' && (
            <motion.div
              key="importing"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="py-8 text-center space-y-6"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <FileText className="h-12 w-12 mx-auto text-primary" />
              </motion.div>
              
              <div className="space-y-2">
                <p className="font-medium">Importing products...</p>
                <p className="text-sm text-muted-foreground">{importProgress}% complete</p>
              </div>
              
              <Progress value={importProgress} className="max-w-xs mx-auto" />
            </motion.div>
          )}

          {/* Step 5: Complete */}
          {step === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="py-8 text-center space-y-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
              >
                <CheckCircle className="h-16 w-16 mx-auto text-emerald-500" />
              </motion.div>
              
              <div className="space-y-2">
                <p className="text-lg font-semibold">Import Complete!</p>
                <p className="text-sm text-muted-foreground">
                  {importResults.success} products imported successfully
                  {importResults.failed > 0 && `, ${importResults.failed} failed`}
                </p>
              </div>

              <Button onClick={handleClose} className="w-full max-w-xs mx-auto">
                Done
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
