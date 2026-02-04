import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { Eye, FileText, Trash2, Package } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useProducts } from '@/contexts/ProductsContext';
import { cn } from '@/lib/utils';

interface RecentProductsTableProps {
  limit?: number;
}

export function RecentProductsTable({ limit = 5 }: RecentProductsTableProps) {
  const { products } = useProducts();
  const navigate = useNavigate();

  const recentProducts = products
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, limit);

  if (recentProducts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-12 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
          <Package className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-foreground mb-1">No products yet</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Add your first product to get started.
        </p>
        <Button onClick={() => navigate('/dashboard/products/new')}>
          Add Product
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30">
            <TableHead>Product Name</TableHead>
            <TableHead className="hidden sm:table-cell">Dimensions</TableHead>
            <TableHead>PPWR Status</TableHead>
            <TableHead className="hidden md:table-cell">DPP Status</TableHead>
            <TableHead className="hidden lg:table-cell">Last Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentProducts.map((product, index) => (
            <motion.tr
              key={product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group hover:bg-muted/30 transition-colors border-b border-border last:border-0"
            >
              <TableCell className="font-medium max-w-[200px] truncate">
                {product.name}
              </TableCell>
              <TableCell className="hidden sm:table-cell text-muted-foreground">
                {product.length}×{product.width}×{product.height} cm
              </TableCell>
              <TableCell>
                <Badge 
                  variant={product.ppwrCompliant ? 'default' : 'destructive'}
                  className={cn(
                    product.ppwrCompliant 
                      ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20' 
                      : ''
                  )}
                >
                  {product.ppwrCompliant ? '✓ Compliant' : '✗ Non-Compliant'}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Badge 
                  variant="outline"
                  className={cn(
                    product.hasDPP 
                      ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {product.hasDPP ? '✓ DPP' : '✗ No DPP'}
                </Badge>
              </TableCell>
              <TableCell className="hidden lg:table-cell text-muted-foreground">
                {formatDistanceToNow(new Date(product.updatedAt), { addSuffix: true })}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => navigate(`/dashboard/reports?product_id=${product.id}`)}
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>

      <div className="p-3 border-t border-border bg-muted/20">
        <Button 
          variant="link" 
          className="p-0 h-auto text-primary"
          onClick={() => navigate('/dashboard/products')}
        >
          View all products →
        </Button>
      </div>
    </div>
  );
}
