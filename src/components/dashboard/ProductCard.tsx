import { motion } from 'framer-motion';
import { Package, MoreVertical, FileText, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Product } from '@/contexts/ProductsContext';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  onView?: () => void;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onGenerateReport?: () => void;
  onConfirmDimensions?: () => void;
  delay?: number;
}

export function ProductCard({
  product,
  onView,
  onEdit,
  onDuplicate,
  onDelete,
  onGenerateReport,
  onConfirmDimensions,
  delay = 0,
}: ProductCardProps) {
  const voidSpaceColor = product.voidSpace < 40 ? 'bg-emerald-500' : 'bg-destructive';

  const needsDimensionConfirmation =
    product.packagingStatus === 'estimated' || product.packagingStatus === 'missing' || !product.packagingStatus;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: delay / 1000 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="group relative rounded-xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      {/* Image Placeholder */}
      <div className="aspect-video bg-muted/30 flex items-center justify-center">
        <Package className="h-12 w-12 text-muted-foreground/50" />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{product.name}</h3>
            <Badge variant="secondary" className="mt-1 text-xs">
              {product.length}×{product.width}×{product.height} cm
            </Badge>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={onDuplicate}>Duplicate</DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Status Badges */}
        <div className="flex gap-2">
          <Badge 
            variant={product.ppwrCompliant ? 'default' : 'destructive'}
            className={cn(
              "text-xs",
              product.ppwrCompliant && 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20'
            )}
          >
            {product.ppwrCompliant ? '✓ Compliant' : '✗ Non-Compliant'}
          </Badge>
          <Badge 
            variant="outline"
            className={cn(
              "text-xs",
              product.hasDPP 
                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                : 'bg-muted text-muted-foreground'
            )}
          >
            {product.hasDPP ? '✓ DPP' : '✗ No DPP'}
          </Badge>

          <Badge
            variant="outline"
            className={cn(
              "text-xs",
              product.packagingStatus === 'confirmed'
                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
            )}
          >
            {product.packagingStatus || 'missing'}
          </Badge>
        </div>

        {/* Void Space */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Void Space</span>
            <span className={cn(
              "font-medium",
              product.voidSpace >= 40 && "text-destructive"
            )}>
              {product.voidSpace}%
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${product.voidSpace}%` }}
              transition={{ duration: 0.5, delay: delay / 1000 + 0.2 }}
              className={cn("h-full rounded-full", voidSpaceColor)}
            />
          </div>
        </div>

        {/* Hover Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileHover={{ opacity: 1, y: 0 }}
          className="pt-2 space-y-2"
        >
          {needsDimensionConfirmation && (
            <Button
              size="sm"
              className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={onConfirmDimensions}
            >
              <CheckCircle2 className="h-4 w-4" />
              Confirm Dimensions
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full gap-2"
            onClick={onGenerateReport}
          >
            <FileText className="h-4 w-4" />
            View Report
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
