import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Package, 
  CheckCircle, 
  FileText, 
  AlertTriangle,
  PlusCircle,
  Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { RecentProductsTable } from '@/components/dashboard/RecentProductsTable';
import { AddProductModal } from '@/components/dashboard/AddProductModal';
import { ImportCSVModal } from '@/components/dashboard/ImportCSVModal';
import { GenerateReportModal } from '@/components/dashboard/GenerateReportModal';
import { useProducts } from '@/contexts/ProductsContext';
import { useReports } from '@/contexts/ReportsContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { products } = useProducts();
  const { reports } = useReports();
  
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [importCSVOpen, setImportCSVOpen] = useState(false);
  const [generateReportOpen, setGenerateReportOpen] = useState(false);

  const compliantProducts = products.filter(p => p.ppwrCompliant).length;
  const nonCompliantProducts = products.filter(p => !p.ppwrCompliant).length;
  const complianceRate = products.length > 0 
    ? Math.round((compliantProducts / products.length) * 100) 
    : 0;

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <StatsCard
            icon={Package}
            label="Total Products"
            value={products.length}
            change="+12 this month"
            changeType="positive"
            color="blue"
            delay={0}
          />
          <StatsCard
            icon={CheckCircle}
            label="Compliant Products"
            value={compliantProducts}
            color="green"
            showProgress
            progressValue={complianceRate}
            delay={50}
          />
          <StatsCard
            icon={FileText}
            label="Reports Generated"
            value={reports.length}
            change="+23 this week"
            changeType="positive"
            color="amber"
            delay={100}
          />
          <StatsCard
            icon={AlertTriangle}
            label="Non-Compliant"
            value={nonCompliantProducts}
            color="red"
            action={{
              label: "Fix Now",
              onClick: () => navigate('/dashboard/products?filter=non-compliant')
            }}
            delay={150}
          />
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-3"
        >
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
          <Button 
            variant="outline" 
            onClick={() => setGenerateReportOpen(true)}
            className="gap-2"
          >
            <FileText className="h-4 w-4" />
            Generate Report
          </Button>
        </motion.div>
      </section>

      {/* Recent Products */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Recent Products</h2>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <RecentProductsTable limit={5} />
        </motion.div>
      </section>

      {/* Modals */}
      <AddProductModal open={addProductOpen} onClose={() => setAddProductOpen(false)} />
      <ImportCSVModal open={importCSVOpen} onClose={() => setImportCSVOpen(false)} />
      <GenerateReportModal open={generateReportOpen} onClose={() => setGenerateReportOpen(false)} />
    </div>
  );
}
