import { useState } from 'react';
import { Check, Pencil, Package, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useProducts, Product } from '@/contexts/ProductsContext';
import { calculateVoidSpace } from '@/services/packagingAlgorithm';
import { cn } from '@/lib/utils';

interface PackagingCellProps {
  product: Product;
}

export function PackagingCell({ product }: PackagingCellProps) {
  const { updatePackaging, confirmPackaging } = useProducts();
  const [open, setOpen] = useState(false);
  const [editL, setEditL] = useState(product.packLength?.toString() ?? '');
  const [editW, setEditW] = useState(product.packWidth?.toString() ?? '');
  const [editH, setEditH] = useState(product.packHeight?.toString() ?? '');
  const [saving, setSaving] = useState(false);

  const hasPackaging = product.packLength && product.packWidth && product.packHeight;

  // Preview void space while editing
  const previewVoid = (() => {
    const l = parseFloat(editL);
    const w = parseFloat(editW);
    const h = parseFloat(editH);
    if (!l || !w || !h) return null;
    return calculateVoidSpace(product.length, product.width, product.height, l, w, h);
  })();

  const previewCompliant = previewVoid !== null && previewVoid < 40;

  const handleOpen = (isOpen: boolean) => {
    if (isOpen) {
      setEditL(product.packLength?.toString() ?? '');
      setEditW(product.packWidth?.toString() ?? '');
      setEditH(product.packHeight?.toString() ?? '');
    }
    setOpen(isOpen);
  };

  const handleSave = async () => {
    const l = parseFloat(editL);
    const w = parseFloat(editW);
    const h = parseFloat(editH);
    if (!l || !w || !h) return;

    setSaving(true);
    await updatePackaging(product.id, l, w, h);
    setSaving(false);
    setOpen(false);
  };

  const handleConfirm = async () => {
    setSaving(true);
    // Save dimensions first if changed
    const l = parseFloat(editL);
    const w = parseFloat(editW);
    const h = parseFloat(editH);
    if (l && w && h && (l !== product.packLength || w !== product.packWidth || h !== product.packHeight)) {
      await updatePackaging(product.id, l, w, h);
    }
    await confirmPackaging([product.id]);
    setSaving(false);
    setOpen(false);
  };

  if (!hasPackaging) {
    return (
      <Badge variant="outline" className="text-xs text-muted-foreground">
        <AlertTriangle className="h-3 w-3 mr-1" />
        No packaging
      </Badge>
    );
  }

  return (
    <Popover open={open} onOpenChange={handleOpen}>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-1.5 text-left group cursor-pointer">
          <Badge
            variant="outline"
            className={cn(
              "text-xs transition-colors",
              product.packagingConfirmed
                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                : "bg-amber-500/10 text-amber-600 border-amber-500/20"
            )}
          >
            {product.packagingConfirmed ? (
              <Check className="h-3 w-3 mr-1" />
            ) : (
              <AlertTriangle className="h-3 w-3 mr-1" />
            )}
            {product.packagingConfirmed ? 'Confirmed' : 'Pending'}
          </Badge>
          <span className={cn(
            "text-xs",
            product.packagingConfirmed ? "text-muted-foreground" : "text-muted-foreground/60"
          )}>
            {product.packLength}×{product.packWidth}×{product.packHeight}
          </span>
          <Pencil className="h-3 w-3 text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="start">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Packaging Dimensions</span>
          </div>

          <div className="text-xs text-muted-foreground">
            Product: {product.length}×{product.width}×{product.height} cm
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label className="text-xs">Length</Label>
              <Input
                type="number"
                step="0.5"
                min="0"
                value={editL}
                onChange={(e) => setEditL(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs">Width</Label>
              <Input
                type="number"
                step="0.5"
                min="0"
                value={editW}
                onChange={(e) => setEditW(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs">Height</Label>
              <Input
                type="number"
                step="0.5"
                min="0"
                value={editH}
                onChange={(e) => setEditH(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
          </div>

          {previewVoid !== null && (
            <div className={cn(
              "text-xs px-2 py-1.5 rounded-md",
              previewCompliant
                ? "bg-emerald-500/10 text-emerald-600"
                : "bg-destructive/10 text-destructive"
            )}>
              Void space: {previewVoid}% — {previewCompliant ? '✓ PPWR Compliant' : '✗ Non-Compliant (≥40%)'}
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={handleSave}
              disabled={saving || !editL || !editW || !editH}
            >
              Save
            </Button>
            <Button
              size="sm"
              className="flex-1"
              onClick={handleConfirm}
              disabled={saving || !editL || !editW || !editH}
            >
              <Check className="h-3 w-3 mr-1" />
              Confirm
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
