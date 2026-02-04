import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusCircle, 
  Upload, 
  Search, 
  Grid3X3, 
  List,
  Package,
  FileText,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ProductCard } from '@/components/dashboard/ProductCard';
import { ProductTable } from '@/components/dashboard/ProductTable';
import { AddProductModal } from '@/components/dashboard/AddProductModal';
import { ImportCSVModal } from '@/components/dashboard/ImportCSVModal';
import { GenerateReportModal } from '@/components/dashboard/GenerateReportModal';
import { useProducts, Product } from '@/contexts/ProductsContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type ViewMode = 'grid' | 'table';
type FilterType = 'all' | 'compliant' | 'non-compliant' | 'missing-dpp';
type SortType = 'name-asc' | 'name-desc' | 'updated-desc' | 'updated-asc';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { products, deleteProduct } = useProducts();
  const { toast } = useToast();
  
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>((searchParams.get('filter') as FilterType) || 'all');
  const [sort, setSort] = useState<SortType>('updated-desc');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  const [addProductOpen, setAddProductOpen] = useState(searchParams.get('action') === 'new');
  const [importCSVOpen, setImportCSVOpen] = useState(false);
  const [generateReportOpen, setGenerateReportOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Apply search
    if (debouncedSearch) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    // Apply filter
    switch (filter) {
      case 'compliant':
        result = result.filter(p => p.ppwrCompliant);
        break;
      case 'non-compliant':
        result = result.filter(p => !p.ppwrCompliant);
        break;
      case 'missing-dpp':
        result = result.filter(p => !p.hasDPP);
        break;
    }

    // Apply sort
    switch (sort) {
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'updated-desc':
        result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        break;
      case 'updated-asc':
        result.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
        break;
    }

    return result;
  }, [products, debouncedSearch, filter, sort]);

  const handleDelete = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id);
      toast({
        title: 'Product deleted',
        description: `${productToDelete.name} has been removed.`,
      });
      setProductToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const handleBulkDelete = () => {
    selectedIds.forEach(id => deleteProduct(id));
    toast({
      title: 'Products deleted',
      description: `${selectedIds.length} products have been removed.`,
    });
    setSelectedIds([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Products</h2>
          <p className="text-sm text-muted-foreground">
            Manage your product catalog and compliance status
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={() => setAddProductOpen(true)}
            className="gap-2 bg-gradient-to-r from-primary to-primary/80"
          >
            <PlusCircle className="h-4 w-4" />
            Add Product
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setImportCSVOpen(true)}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            Import CSV
          </Button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={filter} onValueChange={(v: FilterType) => setFilter(v)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Products</SelectItem>
            <SelectItem value="compliant">Compliant</SelectItem>
            <SelectItem value="non-compliant">Non-Compliant</SelectItem>
            <SelectItem value="missing-dpp">Missing DPP</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sort} onValueChange={(v: SortType) => setSort(v)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="updated-desc">Recently Updated</SelectItem>
            <SelectItem value="updated-asc">Oldest First</SelectItem>
            <SelectItem value="name-asc">Name (A-Z)</SelectItem>
            <SelectItem value="name-desc">Name (Z-A)</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex border border-border rounded-lg overflow-hidden">
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('grid')}
            className="rounded-none"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'table' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('table')}
            className="rounded-none"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Bulk Actions */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 border border-border"
          >
            <span className="text-sm font-medium">
              {selectedIds.length} product(s) selected
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={() => setGenerateReportOpen(true)}
            >
              <FileText className="h-4 w-4" />
              Generate Reports
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 text-destructive hover:text-destructive"
              onClick={handleBulkDelete}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSelectedIds([])}
            >
              Deselect All
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products Display */}
      {filteredProducts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-4">
            <Package className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No products found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {searchQuery || filter !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Add your first product to get started'}
          </p>
          <Button onClick={() => setAddProductOpen(true)}>
            Add Product
          </Button>
        </motion.div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              onDelete={() => handleDelete(product)}
              onGenerateReport={() => {
                setSelectedIds([product.id]);
                setGenerateReportOpen(true);
              }}
              delay={index * 50}
            />
          ))}
        </div>
      ) : (
        <ProductTable
          products={filteredProducts}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          onDelete={handleDelete}
          onGenerateReport={(product) => {
            setSelectedIds([product.id]);
            setGenerateReportOpen(true);
          }}
        />
      )}

      {/* Modals */}
      <AddProductModal open={addProductOpen} onClose={() => setAddProductOpen(false)} />
      <ImportCSVModal open={importCSVOpen} onClose={() => setImportCSVOpen(false)} />
      <GenerateReportModal 
        open={generateReportOpen} 
        onClose={() => {
          setGenerateReportOpen(false);
          setSelectedIds([]);
        }}
        preselectedProductId={selectedIds[0]}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
