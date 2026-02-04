import { useState, useMemo } from 'react';
import { formatDistanceToNow, format, subDays, isWithinInterval } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Copy, 
  Trash2, 
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
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
import { GenerateReportModal } from '@/components/dashboard/GenerateReportModal';
import { useReports, Report } from '@/contexts/ReportsContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type DateRange = 'all' | 'today' | 'week' | 'month';
type ReportTypeFilter = 'all' | 'ppwr' | 'dpp' | 'combined';
type StatusFilter = 'all' | 'complete' | 'pending' | 'failed';

const statusConfig = {
  complete: { icon: CheckCircle, label: 'Complete', className: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
  pending: { icon: Clock, label: 'Pending', className: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
  failed: { icon: XCircle, label: 'Failed', className: 'bg-destructive/10 text-destructive border-destructive/20' },
};

const typeLabels = {
  ppwr: 'PPWR',
  dpp: 'DPP',
  combined: 'Combined',
};

export default function Reports() {
  const { reports, deleteReport } = useReports();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<DateRange>('all');
  const [typeFilter, setTypeFilter] = useState<ReportTypeFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  
  const [generateReportOpen, setGenerateReportOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<Report | null>(null);

  const filteredReports = useMemo(() => {
    let result = [...reports];

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(r => 
        r.id.toLowerCase().includes(query) ||
        r.productName.toLowerCase().includes(query)
      );
    }

    // Date range
    if (dateRange !== 'all') {
      const now = new Date();
      let start: Date;
      
      switch (dateRange) {
        case 'today':
          start = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'week':
          start = subDays(now, 7);
          break;
        case 'month':
          start = subDays(now, 30);
          break;
        default:
          start = new Date(0);
      }
      
      result = result.filter(r => new Date(r.generatedAt) >= start);
    }

    // Type filter
    if (typeFilter !== 'all') {
      result = result.filter(r => r.type === typeFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(r => r.status === statusFilter);
    }

    return result;
  }, [reports, searchQuery, dateRange, typeFilter, statusFilter]);

  const handleCopyLink = (report: Report) => {
    navigator.clipboard.writeText(report.verificationUrl);
    toast({
      title: 'Link copied!',
      description: 'Verification link copied to clipboard.',
    });
  };

  const handleDelete = (report: Report) => {
    setReportToDelete(report);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (reportToDelete) {
      deleteReport(reportToDelete.id);
      toast({
        title: 'Report deleted',
        description: `Report ${reportToDelete.id} has been removed.`,
      });
      setReportToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Compliance Reports</h2>
          <p className="text-sm text-muted-foreground">
            View and download compliance reports
          </p>
        </div>
        <Button 
          onClick={() => setGenerateReportOpen(true)}
          className="gap-2 bg-gradient-to-r from-primary to-primary/80"
        >
          <FileText className="h-4 w-4" />
          Generate New Report
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search by ID or product..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="sm:max-w-xs"
        />
        
        <Select value={dateRange} onValueChange={(v: DateRange) => setDateRange(v)}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">Last 7 Days</SelectItem>
            <SelectItem value="month">Last 30 Days</SelectItem>
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={(v: ReportTypeFilter) => setTypeFilter(v)}>
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="ppwr">PPWR Only</SelectItem>
            <SelectItem value="dpp">DPP Only</SelectItem>
            <SelectItem value="combined">Combined</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={(v: StatusFilter) => setStatusFilter(v)}>
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="complete">Complete</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reports Table */}
      {filteredReports.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-4">
            <FileText className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No reports found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {searchQuery || typeFilter !== 'all' || statusFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Generate your first compliance report'}
          </p>
          <Button onClick={() => setGenerateReportOpen(true)}>
            Generate Report
          </Button>
        </motion.div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead>Report ID</TableHead>
                <TableHead>Product</TableHead>
                <TableHead className="hidden sm:table-cell">Type</TableHead>
                <TableHead className="hidden md:table-cell">Generated</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report, index) => {
                const StatusIcon = statusConfig[report.status].icon;
                
                return (
                  <motion.tr
                    key={report.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.02 }}
                    className="group hover:bg-muted/30 transition-colors border-b border-border last:border-0"
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="text-sm font-mono">{report.id}</code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100"
                          onClick={() => {
                            navigator.clipboard.writeText(report.id);
                            toast({ title: 'Copied!' });
                          }}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium max-w-[200px] truncate">
                      {report.productName}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline">{typeLabels[report.type]}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      <Popover>
                        <PopoverTrigger className="hover:underline cursor-pointer">
                          {formatDistanceToNow(new Date(report.generatedAt), { addSuffix: true })}
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-2">
                          <p className="text-sm">{format(new Date(report.generatedAt), 'PPpp')}</p>
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline"
                        className={cn("gap-1", statusConfig[report.status].className)}
                      >
                        {report.status === 'pending' ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <StatusIcon className="h-3 w-3" />
                        )}
                        {statusConfig[report.status].label}
                      </Badge>
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
                          disabled={report.status !== 'complete'}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleCopyLink(report)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(report)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Modals */}
      <GenerateReportModal 
        open={generateReportOpen} 
        onClose={() => setGenerateReportOpen(false)} 
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Report</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete report "{reportToDelete?.id}"? This action cannot be undone.
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
