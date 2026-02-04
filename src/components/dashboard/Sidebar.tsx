import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  Settings, 
  ChevronLeft,
  X,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface SidebarProps {
  collapsed: boolean;
  onCollapse: () => void;
  onClose?: () => void;
  isMobile?: boolean;
}

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { path: '/dashboard/products', icon: Package, label: 'Products' },
  { path: '/dashboard/reports', icon: FileText, label: 'Reports' },
  { path: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar({ collapsed, onCollapse, onClose, isMobile }: SidebarProps) {
  const location = useLocation();
  const productsUsed = 47;
  const productsLimit = 200;
  const usagePercentage = (productsUsed / productsLimit) * 100;

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed && !isMobile ? 72 : 240 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className={cn(
        "h-screen bg-card border-r border-border flex flex-col",
        "backdrop-blur-xl bg-card/80"
      )}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center flex-shrink-0">
            <Package className="h-4 w-4 text-primary-foreground" />
          </div>
          {(!collapsed || isMobile) && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-bold text-foreground whitespace-nowrap"
            >
              CompliPack
            </motion.span>
          )}
        </div>
        
        {isMobile ? (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        ) : (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onCollapse}
            className="flex-shrink-0"
          >
            <motion.div
              animate={{ rotate: collapsed ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronLeft className="h-4 w-4" />
            </motion.div>
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = item.end 
            ? location.pathname === item.path 
            : location.pathname.startsWith(item.path);
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                "hover:bg-muted/50",
                isActive && "bg-gradient-to-r from-primary/15 to-primary/5 border-l-4 border-primary text-primary"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 flex-shrink-0",
                isActive ? "text-primary" : "text-muted-foreground"
              )} />
              {(!collapsed || isMobile) && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={cn(
                    "text-sm font-medium whitespace-nowrap",
                    isActive ? "text-primary" : "text-foreground"
                  )}
                >
                  {item.label}
                </motion.span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-border space-y-3">
        {/* Plan Badge */}
        <div className={cn(
          "flex items-center gap-2",
          collapsed && !isMobile && "justify-center"
        )}>
          <span className="px-2.5 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full whitespace-nowrap">
            {collapsed && !isMobile ? 'Std' : 'Standard Plan'}
          </span>
        </div>

        {/* Upgrade Button */}
        {(!collapsed || isMobile) && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full gap-2 border-primary/30 text-primary hover:bg-primary/10"
          >
            <Sparkles className="h-4 w-4" />
            Upgrade to Pro
          </Button>
        )}

        {/* Usage Indicator */}
        {(!collapsed || isMobile) && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Products</span>
              <span className="font-medium">{productsUsed} / {productsLimit}</span>
            </div>
            <Progress value={usagePercentage} className="h-1.5" />
          </div>
        )}
      </div>
    </motion.aside>
  );
}
