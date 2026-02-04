import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useProducts } from '@/contexts/ProductsContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const productSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  description: z.string().max(500, 'Description must be under 500 characters').optional(),
  length: z.number().min(1, 'Length is required').max(500, 'Max 500cm'),
  width: z.number().min(1, 'Width is required').max(500, 'Max 500cm'),
  height: z.number().min(1, 'Height is required').max(500, 'Max 500cm'),
  weight: z.number().min(0).max(100).optional(),
  materials: z.string().max(500).optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddProductModal({ open, onClose }: AddProductModalProps) {
  const { addProduct } = useProducts();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      length: 0,
      width: 0,
      height: 0,
      weight: undefined,
      materials: '',
    },
  });

  const watchedValues = watch();

  // Calculate compliance preview
  const preview = useMemo(() => {
    const { length, width, height } = watchedValues;
    if (!length || !width || !height) return null;

    const productVolume = length * width * height;
    const boxLength = length + 4;
    const boxWidth = width + 4;
    const boxHeight = height + 4;
    const boxVolume = boxLength * boxWidth * boxHeight;
    const voidSpace = Math.round(((boxVolume - productVolume) / boxVolume) * 100);
    const isCompliant = voidSpace < 40;

    return {
      productVolume,
      boxDimensions: `${boxLength}×${boxWidth}×${boxHeight} cm`,
      voidSpace,
      isCompliant,
    };
  }, [watchedValues.length, watchedValues.width, watchedValues.height]);

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    addProduct({
      name: data.name,
      description: data.description,
      length: data.length,
      width: data.width,
      height: data.height,
      weight: data.weight,
      materials: data.materials,
    });

    toast({
      title: '✅ Product added successfully!',
      description: `${data.name} has been added to your catalog.`,
    });

    setIsSubmitting(false);
    reset();
    onClose();
  };

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-[500px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Add New Product
          </SheetTitle>
          <p className="text-sm text-muted-foreground">
            Enter product details for compliance check
          </p>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
          {/* Product Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Blue Cotton T-Shirt"
              {...register('name')}
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief product description..."
              rows={3}
              {...register('description')}
            />
            <p className="text-xs text-muted-foreground">
              {watchedValues.description?.length || 0} / 500
            </p>
          </div>

          {/* Dimensions */}
          <div className="space-y-2">
            <Label>Dimensions (cm) *</Label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Input
                  type="number"
                  placeholder="Length"
                  {...register('length', { valueAsNumber: true })}
                  className={errors.length ? 'border-destructive' : ''}
                />
              </div>
              <div>
                <Input
                  type="number"
                  placeholder="Width"
                  {...register('width', { valueAsNumber: true })}
                  className={errors.width ? 'border-destructive' : ''}
                />
              </div>
              <div>
                <Input
                  type="number"
                  placeholder="Height"
                  {...register('height', { valueAsNumber: true })}
                  className={errors.height ? 'border-destructive' : ''}
                />
              </div>
            </div>
            {(errors.length || errors.width || errors.height) && (
              <p className="text-xs text-destructive">All dimensions are required</p>
            )}
          </div>

          {/* Weight */}
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register('weight', { valueAsNumber: true })}
            />
          </div>

          {/* Materials */}
          <div className="space-y-2">
            <Label htmlFor="materials">Materials</Label>
            <Textarea
              id="materials"
              placeholder="e.g., 95% cotton, 5% elastane"
              rows={2}
              {...register('materials')}
            />
            <p className="text-xs text-muted-foreground">For DPP generation</p>
          </div>

          {/* Live Preview */}
          <AnimatePresence>
            {preview && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-xl border border-border bg-muted/30 p-4 space-y-4"
              >
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Compliance Preview
                </h4>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Product Volume</p>
                    <p className="font-medium">{preview.productVolume.toLocaleString()} cm³</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Recommended Box</p>
                    <p className="font-medium">{preview.boxDimensions}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Void Space</span>
                    <span className={cn(
                      "font-medium",
                      preview.voidSpace >= 40 && "text-destructive"
                    )}>
                      {preview.voidSpace}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${preview.voidSpace}%` }}
                      className={cn(
                        "h-full rounded-full",
                        preview.isCompliant ? "bg-emerald-500" : "bg-destructive"
                      )}
                    />
                  </div>
                </div>

                <div className={cn(
                  "flex items-center gap-2 p-3 rounded-lg",
                  preview.isCompliant ? "bg-emerald-500/10" : "bg-destructive/10"
                )}>
                  {preview.isCompliant ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                      <span className="text-sm font-medium text-emerald-600">PPWR Compliant</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      <span className="text-sm font-medium text-destructive">Non-Compliant (void &gt; 40%)</span>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-gradient-to-r from-primary to-primary/80"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Product'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
