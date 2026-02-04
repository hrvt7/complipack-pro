import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, 
  CreditCard, 
  Bell, 
  Plug,
  Camera,
  Check,
  Globe,
  Clock,
  Moon,
  Sun,
  Monitor,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function Settings() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  
  const defaultTab = searchParams.get('tab') || 'account';
  
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('Europe/Berlin');
  
  const [notifications, setNotifications] = useState({
    email: true,
    compliance: true,
    usage: true,
    marketing: false,
  });
  
  const [defaultReportFormat, setDefaultReportFormat] = useState('combined');

  const handleSaveAccount = () => {
    toast({
      title: 'Settings saved',
      description: 'Your account settings have been updated.',
    });
  };

  const handleSavePreferences = () => {
    toast({
      title: 'Preferences saved',
      description: 'Your preferences have been updated.',
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Mock billing data
  const plan = {
    name: 'Standard',
    price: '€39',
    status: 'Active',
    renewalDate: 'February 15, 2026',
    productsUsed: 47,
    productsLimit: 200,
  };

  const invoices = [
    { id: 'INV-001', date: 'Jan 15, 2026', amount: '€39.00', status: 'Paid' },
    { id: 'INV-002', date: 'Dec 15, 2025', amount: '€39.00', status: 'Paid' },
    { id: 'INV-003', date: 'Nov 15, 2025', amount: '€39.00', status: 'Paid' },
    { id: 'INV-004', date: 'Oct 15, 2025', amount: '€39.00', status: 'Paid' },
    { id: 'INV-005', date: 'Sep 15, 2025', amount: '€39.00', status: 'Paid' },
  ];

  return (
    <div className="max-w-4xl">
      <Tabs defaultValue={defaultTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
          <TabsTrigger value="account" className="gap-2">
            <User className="h-4 w-4 hidden sm:block" />
            Account
          </TabsTrigger>
          <TabsTrigger value="billing" className="gap-2">
            <CreditCard className="h-4 w-4 hidden sm:block" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="preferences" className="gap-2">
            <Bell className="h-4 w-4 hidden sm:block" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="integrations" className="gap-2">
            <Plug className="h-4 w-4 hidden sm:block" />
            Integrations
          </TabsTrigger>
        </TabsList>

        {/* Account Tab */}
        <TabsContent value="account">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="rounded-xl border border-border bg-card/50 p-6">
              <h3 className="text-lg font-semibold mb-6">Profile Information</h3>
              
              {/* Avatar */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                      {user ? getInitials(user.fullName) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <p className="font-medium">{user?.fullName}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex gap-2">
                    <Input
                      id="email"
                      value={user?.email || ''}
                      disabled
                      className="flex-1"
                    />
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                      <Check className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger>
                        <Globe className="h-4 w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                        <SelectItem value="hu">Magyar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={timezone} onValueChange={setTimezone}>
                      <SelectTrigger>
                        <Clock className="h-4 w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Europe/Berlin">Europe/Berlin (CET)</SelectItem>
                        <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                        <SelectItem value="Europe/Budapest">Europe/Budapest (CET)</SelectItem>
                        <SelectItem value="America/New_York">America/New York (EST)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-6 pt-6 border-t border-border">
                <Button variant="outline">Change Password</Button>
                <Button onClick={handleSaveAccount}>Save Changes</Button>
              </div>
            </div>
          </motion.div>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Current Plan */}
            <div className="rounded-xl border border-border bg-gradient-to-br from-primary/5 to-primary/10 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold">{plan.name} Plan</h3>
                  <p className="text-3xl font-bold mt-1">{plan.price}<span className="text-base font-normal text-muted-foreground">/month</span></p>
                </div>
                <div className="flex flex-col items-start sm:items-end gap-2">
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                    {plan.status}
                  </Badge>
                  <p className="text-sm text-muted-foreground">Renews {plan.renewalDate}</p>
                </div>
              </div>
            </div>

            {/* Usage */}
            <div className="rounded-xl border border-border bg-card/50 p-6">
              <h3 className="text-lg font-semibold mb-4">Usage</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Products</span>
                  <span className="font-medium">{plan.productsUsed} / {plan.productsLimit}</span>
                </div>
                <Progress value={(plan.productsUsed / plan.productsLimit) * 100} />
                <p className="text-xs text-muted-foreground">Usage resets on {plan.renewalDate}</p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="rounded-xl border border-border bg-card/50 p-6">
              <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-8 rounded bg-muted flex items-center justify-center">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">•••• •••• •••• 4242</p>
                    <p className="text-sm text-muted-foreground">Expires 12/2027</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Update</Button>
              </div>
            </div>

            {/* Billing History */}
            <div className="rounded-xl border border-border bg-card/50 p-6">
              <h3 className="text-lg font-semibold mb-4">Billing History</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-mono text-sm">{invoice.id}</TableCell>
                      <TableCell>{invoice.date}</TableCell>
                      <TableCell>{invoice.amount}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600">
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">Download</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600">
                <Sparkles className="h-4 w-4" />
                Upgrade to Pro
              </Button>
              <Button variant="outline" className="text-destructive hover:text-destructive">
                Cancel Subscription
              </Button>
            </div>
          </motion.div>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Theme */}
            <div className="rounded-xl border border-border bg-card/50 p-6">
              <h3 className="text-lg font-semibold mb-4">Theme</h3>
              <RadioGroup 
                value={theme} 
                onValueChange={(v: 'light' | 'dark' | 'system') => setTheme(v)}
                className="grid grid-cols-3 gap-4"
              >
                <Label
                  htmlFor="light"
                  className={cn(
                    "flex flex-col items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors",
                    theme === 'light' ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/30"
                  )}
                >
                  <RadioGroupItem value="light" id="light" className="sr-only" />
                  <Sun className="h-6 w-6" />
                  <span className="text-sm font-medium">Light</span>
                </Label>
                <Label
                  htmlFor="dark"
                  className={cn(
                    "flex flex-col items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors",
                    theme === 'dark' ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/30"
                  )}
                >
                  <RadioGroupItem value="dark" id="dark" className="sr-only" />
                  <Moon className="h-6 w-6" />
                  <span className="text-sm font-medium">Dark</span>
                </Label>
                <Label
                  htmlFor="system"
                  className={cn(
                    "flex flex-col items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors",
                    theme === 'system' ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/30"
                  )}
                >
                  <RadioGroupItem value="system" id="system" className="sr-only" />
                  <Monitor className="h-6 w-6" />
                  <span className="text-sm font-medium">System</span>
                </Label>
              </RadioGroup>
            </div>

            {/* Notifications */}
            <div className="rounded-xl border border-border bg-card/50 p-6">
              <h3 className="text-lg font-semibold mb-4">Notifications</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email notifications</p>
                    <p className="text-sm text-muted-foreground">Receive email updates about your account</p>
                  </div>
                  <Switch 
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications(n => ({ ...n, email: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Product compliance alerts</p>
                    <p className="text-sm text-muted-foreground">Get notified when products become non-compliant</p>
                  </div>
                  <Switch 
                    checked={notifications.compliance}
                    onCheckedChange={(checked) => setNotifications(n => ({ ...n, compliance: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Monthly usage summary</p>
                    <p className="text-sm text-muted-foreground">Receive a monthly summary of your usage</p>
                  </div>
                  <Switch 
                    checked={notifications.usage}
                    onCheckedChange={(checked) => setNotifications(n => ({ ...n, usage: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Marketing emails</p>
                    <p className="text-sm text-muted-foreground">Receive news and product updates</p>
                  </div>
                  <Switch 
                    checked={notifications.marketing}
                    onCheckedChange={(checked) => setNotifications(n => ({ ...n, marketing: checked }))}
                  />
                </div>
              </div>
            </div>

            {/* Default Report Format */}
            <div className="rounded-xl border border-border bg-card/50 p-6">
              <h3 className="text-lg font-semibold mb-4">Default Report Format</h3>
              <RadioGroup value={defaultReportFormat} onValueChange={setDefaultReportFormat}>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="ppwr" id="ppwr-default" />
                    <Label htmlFor="ppwr-default">PPWR Only</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="dpp" id="dpp-default" />
                    <Label htmlFor="dpp-default">DPP Only</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="combined" id="combined-default" />
                    <Label htmlFor="combined-default">Combined (Default)</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <Button onClick={handleSavePreferences}>Save Preferences</Button>
          </motion.div>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="rounded-xl border border-border bg-card/50 p-6">
              <h3 className="text-lg font-semibold mb-4">E-commerce Integrations</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Connect your online store to automatically sync products and generate compliance reports.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#96bf48] flex items-center justify-center text-white font-bold">
                      S
                    </div>
                    <div>
                      <p className="font-medium">Shopify</p>
                      <p className="text-sm text-muted-foreground">Sync products automatically</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Coming Soon</Badge>
                    <Button variant="outline" size="sm" disabled>Connect</Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#f56400] flex items-center justify-center text-white font-bold">
                      E
                    </div>
                    <div>
                      <p className="font-medium">Etsy</p>
                      <p className="text-sm text-muted-foreground">Sync products automatically</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Coming Soon</Badge>
                    <Button variant="outline" size="sm" disabled>Connect</Button>
                  </div>
                </div>
              </div>
            </div>

            {/* API Access */}
            <div className="rounded-xl border border-border bg-card/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">API Access</h3>
                <Badge variant="outline" className="gap-1">
                  <Sparkles className="h-3 w-3" />
                  Pro
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Use our REST API to integrate CompliPack into your own applications.
              </p>
              
              <div className="p-4 rounded-lg bg-muted/30 border border-border">
                <p className="text-sm text-muted-foreground mb-2">Your API Key</p>
                <div className="flex gap-2">
                  <Input 
                    value="sk_live_••••••••••••••••••••••••" 
                    disabled 
                    className="font-mono"
                  />
                  <Button variant="outline">Copy</Button>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" disabled>Generate New Key</Button>
                  <Button variant="link" size="sm">View Documentation →</Button>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mt-4">
                Upgrade to Pro to access the API and unlock advanced features.
              </p>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
