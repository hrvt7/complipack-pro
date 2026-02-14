import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { MoreVertical, ArrowUpDown } from 'lucide-react';
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
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Product } from '@/contexts/ProductsContext';
import { PackagingCell } from './PackagingCell';
import { cn } from '@/lib/utils';

interface ProductTableProps {
  products: Product[];
  onEdit?: (product: Product) => void;
  onDuplicate?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onGenerateReport?: (product: Product) => void;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
}

type SortField = 'name' | 'dimensions' | 'voidSpace' | 'updatedAt';
type SortDirection = 'asc' | 'desc';

export function ProductTable({
  products,
  onEdit,
  onDuplicate,
  onDelete,
  onGenerateReport,
  selectedIds = [],
  onSelectionChange,
}: ProductTableProps) {
  const [sortField, setSortField] = useState<SortField>('updatedAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    const multiplier = sortDirection === 'asc' ? 1 : -1;
    
    switch (sortField) {
      case 'name':
        return multiplier * a.name.localeCompare(b.name);
      case 'dimensions':
        const volA = a.length * a.width * a.height;
        const volB = b.length * b.width * b.height;
        return multiplier * (volA - volB);
      case 'voidSpace':
        return multiplier * (a.voidSpace - b.voidSpace);
      case 'updatedAt':
        return multiplier * (new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
      default:
        return 0;
    }
  });

  const allSelected = products.length > 0 && selectedIds.length === products.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < products.length;

  const handleSelectAll = () => {
    if (allSelected) {
      onSelectionChange?.([]);
    } else {
      onSelectionChange?.(products.map(p => p.id));
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectionChange?.(selectedIds.filter(i => i !== id));
    } else {
      onSelectionChange?.([...selectedIds, id]);
    }
  };

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      className="h-auto p-0 font-medium hover:bg-transparent"
      onClick={() => handleSort(field)}
    >
      {children}
      <ArrowUpDown className="ml-2 h-3 w-3" />
    </Button>
  );

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30">
            <TableHead className="w-12">
              <Checkbox
                checked={allSelected}
                onCheckedChange={handleSelectAll}
                aria-label="Select all"
                className={someSelected ? 'data-[state=checked]:bg-primary' : ''}
              />
            </TableHead>
            <TableHead>
              <SortableHeader field="name">Name</SortableHeader>
            </TableHead>
            <TableHead className="hidden sm:table-cell">
              <SortableHeader field="dimensions">Dimensions</SortableHeader>
            </TableHead>
            <TableHead className="hidden md:table-cell">Weight</TableHead>
            <TableHead className="hidden lg:table-cell">Packaging</TableHead>
            <TableHead>PPWR Status</TableHead>
            <TableHead className="hidden lg:table-cell">DPP Status</TableHead>
            <TableHead className="hidden xl:table-cell">
              <SortableHeader field="voidSpace">Void Space</SortableHeader>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedProducts.map((product, index) => (
            <motion.tr
              key={product.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.02 }}
              className={cn(
                "group transition-colors border-b border-border last:border-0",
                selectedIds.includes(product.id) ? "bg-primary/5" : "hover:bg-muted/30"
              )}
            >
              <TableCell>
                <Checkbox
                  checked={selectedIds.includes(product.id)}
                  onCheckedChange={() => handleSelectOne(product.id)}
                  aria-label={`Select ${product.name}`}
                />
              </TableCell>
              <TableCell className="font-medium max-w-[200px] truncate">
                {product.name}
              </TableCell>
              <TableCell className="hidden sm:table-cell text-muted-foreground">
                {product.length}×{product.width}×{product.height} cm
              </TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground">
                {product.weight ? `${product.weight} kg` : '-'}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <PackagingCell product={product} />
              </TableCell>
              <TableCell>
                <Badge 
                  variant={product.ppwrCompliant ? 'default' : 'destructive'}
                  className={cn(
                    "text-xs",
                    product.ppwrCompliant && 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20'
                  )}
                >
                  {product.ppwrCompliant ? '✓ Compliant' : '✗ Non-Compliant'}
                </Badge>
              </TableCell>
              <TableCell className="hidden lg:table-cell">
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
              </TableCell>
              <TableCell className="hidden xl:table-cell">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full",
                        product.voidSpace < 40 ? "bg-emerald-500" : "bg-destructive"
                      )}
                      style={{ width: `${product.voidSpace}%` }}
                    />
                  </div>
                  <span className={cn(
                    "text-xs font-medium",
                    product.voidSpace >= 40 && "text-destructive"
                  )}>
                    {product.voidSpace}%
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onGenerateReport?.(product)}>
                      Generate Report
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit?.(product)}>Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDuplicate?.(product)}>Duplicate</DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDelete?.(product)}
                      className="text-destructive"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
