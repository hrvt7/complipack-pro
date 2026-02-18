import { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Ruler } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Product } from '@/contexts/ProductsContext';
import { confirmProductDimensions } from '@/api/products';
import { useToast } from '@/hooks/use-toast';

interface ConfirmDimensionsModalProps {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onConfirmed?: () => void;
}

const toErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object') {
    const maybeMessage = (error as { message?: unknown }).message;
    if (typeof maybeMessage === 'string' && maybeMessage.trim()) return maybeMessage;
    try {
      return JSON.stringify(error);
    } catch {
      return 'Dimension confirmation failed.';
    }
  }
  return 'Dimension confirmation failed.';
};

const isPositive = (value: string) => Number.isFinite(Number(value)) && Number(value) > 0;

export function ConfirmDimensionsModal({
  open,
  product,
  onClose,
  onConfirmed,
}: ConfirmDimensionsModalProps) {
  const { toast } = useToast();
  const [lengthCm, setLengthCm] = useState('');
  const [widthCm, setWidthCm] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!product) return;
    setLengthCm(String(product.length || ''));
    setWidthCm(String(product.width || ''));
    setHeightCm(String(product.height || ''));
  }, [product]);

  const hasValidValues = isPositive(lengthCm) && isPositive(widthCm) && isPositive(heightCm);

  const handleSave = async () => {
    if (!product || !hasValidValues) return;

    setSaving(true);
    try {
      await confirmProductDimensions({
        product_id: product.id,
        length_cm: Number(lengthCm),
        width_cm: Number(widthCm),
        height_cm: Number(heightCm),
      });

      toast({
        title: 'Dimensions confirmed',
        description: `${product.name} is now ready for finalization.`,
      });

      onConfirmed?.();
      onClose();
    } catch (error: unknown) {
      toast({
        title: 'Confirmation failed',
        description: toErrorMessage(error),
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="sm:max-w-[460px] border-border/60 bg-background/95 backdrop-blur">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Ruler className="h-5 w-5 text-emerald-500" />
            Confirm Dimensions
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Confirm packaging dimensions for <span className="font-medium text-foreground">{product?.name ?? 'product'}</span>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="confirm-length">Length (cm)</Label>
              <Input
                id="confirm-length"
                type="number"
                min="0.1"
                step="0.1"
                value={lengthCm}
                onChange={(e) => setLengthCm(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-width">Width (cm)</Label>
              <Input
                id="confirm-width"
                type="number"
                min="0.1"
                step="0.1"
                value={widthCm}
                onChange={(e) => setWidthCm(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-height">Height (cm)</Label>
              <Input
                id="confirm-height"
                type="number"
                min="0.1"
                step="0.1"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
              />
            </div>
          </div>

          {!hasValidValues && (
            <p className="text-xs text-destructive">Please enter positive numbers for all dimensions.</p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
            <Button
              onClick={handleSave}
              disabled={!hasValidValues || saving}
              className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              Confirm & Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
