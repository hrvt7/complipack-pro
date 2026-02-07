import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Package,
  CheckCircle,
  FileText,
  AlertTriangle,
  PlusCircle,
  Upload,
  Store,
  KeyRound,
  Copy,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { RecentProductsTable } from '@/components/dashboard/RecentProductsTable';
import { AddProductModal } from '@/components/dashboard/AddProductModal';
import { ImportCSVModal } from '@/components/dashboard/ImportCSVModal';
import { GenerateReportModal } from '@/components/dashboard/GenerateReportModal';
import { useProducts } from '@/contexts/ProductsContext';
import { useReports } from '@/contexts/ReportsContext';
import { createShop } from '@/api/shops';

export default function Dashboard() {
  const navigate = useNavigate();
  const { products } = useProducts();
  const { reports } = useReports();

  const [addProductOpen, setAddProductOpen] = useState(false);
  const [importCSVOpen, setImportCSVOpen] = useState(false);
  const [generateReportOpen, setGenerateReportOpen] = useState(false);

  // Create Shop UI state
  const [shopName, setShopName] = useState('');
  const [creatingShop, setCreatingShop] = useState(false);
  const [shopApiKey, setShopApiKey] = useState<string | null>(null);
  const [shopMessage, setShopMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const compliantProducts = products.filter(p => p.ppwrCompliant).length;
  const nonCompliantProducts = products.filter(p => !p.ppwrCompliant).length;
  const complianceRate =
    products.length > 0
      ? Math.round((compliantProducts / products.length) * 100)
      : 0;

  const onCreateShop = async () => {
    setShopMessage(null);
    setShopApiKey(null);

    const name = shopName.trim();
    if (!name) {
      setShopMessage({ type: 'error', text: 'Please enter a shop name.' });
      return;
    }

    setCreatingShop(true);
    try {
      const res = await createShop({ name });
      const key = res.api_key || res.shop?.api_key || null;

      setShopApiKey(key);
      setShopMessage({ type: 'success', text: 'Shop created successfully.' });
      setShopName('');
    } catch (e: any) {
      setShopMessage({ type: 'error', text: e?.message ?? 'Create shop failed.' });
    } finally {
      setCreatingShop(false);
    }
  };

  const copyKey = async () => {
    if (!shopApiKey) return;
    try {
      await navigator.clipboard.writeText(shopApiKey);
      setShopMessage({ type: 'success', text: 'API key copied to clipboard.' });
    } catch {
      setShopMessage({ type: 'error', text: 'Copy failed. Please copy manually.' });
    }
  };

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
              label: 'Fix Now',
              onClick: () => navigate('/dashboard/products?filter=non-compliant'),
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

      {/* Create Shop */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Create Shop</h2>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="rounded-xl border bg-background p-4 lg:p-6 space-y-4"
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 text-muted-foreground">
              <Store className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="font-medium">Create a new shop</div>
              <div className="text-sm text-muted-foreground">
                This will generate an API key for your integrations.
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              placeholder="Shop name (e.g. MyStore EU)"
              disabled={creatingShop}
              className="flex-1 h-10 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <Button onClick={onCreateShop} disabled={creatingShop || !shopName.trim()} className="gap-2">
              <KeyRound className="h-4 w-4" />
              {creatingShop ? 'Creating...' : 'Create Shop'}
            </Button>
          </div>

          {shopMessage && (
            <div
              className={`text-sm rounded-md border px-3 py-2 ${
                shopMessage.type === 'success'
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                  : 'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300'
              }`}
            >
              {shopMessage.text}
            </div>
          )}

          {shopApiKey && (
            <div className="rounded-md border p-3 space-y-2">
              <div className="text-sm font-medium">API Key</div>
              <div className="text-xs text-muted-foreground">
                Copy this key now. Treat it like a password.
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <code className="flex-1 text-xs break-all rounded-md bg-muted px-3 py-2">
                  {shopApiKey}
                </code>
                <Button variant="outline" onClick={copyKey} className="gap-2">
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>
              </div>
            </div>
          )}
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
