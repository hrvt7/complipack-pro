

# CompliPack Phase 2 - Dashboard, Products, Reports & Settings

## Overview
Build the complete internal application with Dashboard, Products management, Reports generation, and Settings pages. This phase transforms CompliPack from a landing page into a fully functional compliance management platform with premium animations and glass-morphism design.

## Architecture Overview

```text
+--------------------------------------------------------------------+
|                        DashboardLayout                              |
|  +-------------+  +---------------------------------------------+  |
|  |   Sidebar   |  |              TopBar                          |  |
|  |-------------|  |  [Page Title]        [Search] [Bell] [Theme] |  |
|  | Logo        |  |                           [User Dropdown]    |  |
|  | Dashboard   |  +---------------------------------------------+  |
|  | Products    |  |                                              |  |
|  | Reports     |  |           Main Content Area                  |  |
|  | Settings    |  |                                              |  |
|  |-------------|  |    (Dashboard / Products / Reports / etc.)   |  |
|  | Plan Badge  |  |                                              |  |
|  | Usage Bar   |  |                                              |  |
|  +-------------+  +---------------------------------------------+  |
+--------------------------------------------------------------------+
```

---

## Technical Design

### 1. Protected Route System
- **ProtectedRoute Component**: Wraps all `/dashboard/*` routes
- Checks `useAuth()` for authenticated user
- Redirects unauthenticated users to `/auth`
- Shows loading spinner during auth check
- Auto-redirects authenticated users from `/auth` to `/dashboard`

### 2. Mock Data Layer
- **ProductsContext**: Manages products state with CRUD operations
- **ReportsContext**: Manages reports state and generation
- **Data stored in localStorage** for persistence across page refreshes
- Pre-populated with 47 demo products and 127 reports

### 3. Component Structure
```text
src/
  components/
    dashboard/
      DashboardLayout.tsx      # Main layout with sidebar + topbar
      Sidebar.tsx              # Collapsible sidebar navigation
      TopBar.tsx               # Header with search, notifications, user menu
      StatsCard.tsx            # Animated stat card component
      ProductCard.tsx          # Product grid card
      ProductTable.tsx         # Product table view
      RecentProductsTable.tsx  # Dashboard recent products
      AddProductModal.tsx      # Slide-in product form
      ImportCSVModal.tsx       # CSV import wizard
      GenerateReportModal.tsx  # Multi-step report wizard
      SettingsTabs.tsx         # Settings page content
  contexts/
    ProductsContext.tsx        # Products state management
    ReportsContext.tsx         # Reports state management
  pages/
    Dashboard.tsx              # Main dashboard page
    Products.tsx               # Products list page
    Reports.tsx                # Reports list page
    Settings.tsx               # Settings page with tabs
```

---

## Page 1: Dashboard (/dashboard)

### Stats Cards Section
Four animated cards in a responsive grid showing:
- **Total Products**: Package icon, blue, count-up animation, "+12 this month"
- **Compliant Products**: CheckCircle icon, green, circular progress ring (91%)
- **Reports Generated**: FileText icon, amber, count-up, "+23 this week"
- **Non-Compliant**: AlertTriangle icon, red, "Fix Now" action link

**Animations**:
- Fade-in-up with 50ms stagger between cards
- Number count-up using Framer Motion's `useMotionValue` and `useSpring`
- Progress ring animates on mount with `stroke-dashoffset` transition

### Quick Actions Section
Horizontal row of action buttons:
- "Add Product" (primary gradient, PlusCircle icon)
- "Import CSV" (secondary outline, Upload icon)
- "Generate Report" (secondary outline, FileText icon)

### Recent Products Table
- Shows last 5 products with columns: Name, Dimensions, PPWR Status, DPP Status, Last Updated, Actions
- Action icons visible on row hover (view, generate report, delete)
- Empty state with illustration when no products
- "View all products" link to /dashboard/products

---

## Page 2: Products (/dashboard/products)

### Header & Controls
- Page title with subtitle
- "Add Product" and "Import CSV" buttons (top right)
- Search input with debounce (500ms)
- Filter dropdown (All, Compliant, Non-Compliant, Missing DPP)
- Sort dropdown (Name A-Z/Z-A, Recently Updated, Oldest)
- View toggle (Grid/Table icons)

### Grid View (default)
- 3-column responsive grid (2 on tablet, 1 on mobile)
- Product cards with:
  - Image placeholder (gray box with Package icon)
  - Name, dimensions badge
  - PPWR/DPP status badges (green/red)
  - Void space progress bar (color-coded at 40% threshold)
  - Hover reveals "View Report" button and 3-dot menu
- Card hover: scale 1.03, shadow increase, actions slide-up

### Table View
- Full table with sortable columns and row checkboxes
- Bulk actions bar when items selected (Generate Reports, Delete)

### Add Product Modal (Sheet from right)
- 500px wide slide-in panel
- Form fields: Name, Description, Dimensions (L/W/H), Weight, Materials
- **Live Preview Panel**: Shows calculated void space and compliance status as user types
- Real-time void space calculation: `((boxVolume - productVolume) / boxVolume) * 100`
- Preview animates with debounce (300ms)

### Import CSV Modal
- Multi-step wizard:
  1. Instructions with downloadable template
  2. Drag-drop upload zone (.csv only)
  3. Preview table with column validation
  4. Import progress bar
- Success toast with error log link

---

## Page 3: Reports (/dashboard/reports)

### Header & Filters
- Page title: "Compliance Reports"
- "Generate New Report" button (primary)
- Date range picker with presets (Today, Last 7 days, Last 30 days, Custom)
- Report type filter (All, PPWR Only, DPP Only, Combined)
- Status filter (All, Generated, Pending, Failed)

### Reports Table
- Columns: Report ID (monospace, copy icon), Product Name, Type badge, Generated Date, Status badge, Actions
- Status badges: Complete (green), Pending (amber + spinner), Failed (red)
- Action icons: View, Download PDF, Copy link, Delete
- Empty state with illustration

### Generate Report Modal (Multi-step)
**Step 1 - Select Products**:
- Searchable list with checkboxes
- Compact product cards showing name, dimensions, status
- "Select All" option
- Selected count display

**Step 2 - Report Options**:
- Radio buttons: PPWR Only, DPP Only, Combined (recommended badge)
- Checkboxes: QR codes, Verification links, Material charts, Company logo (Pro only)

**Step 3 - Generating**:
- Loading animation with spinning document icon
- Progress text: "Generating report... 15 seconds remaining"

**Step 4 - Success**:
- Green checkmark animation
- Download PDF button, View in Reports link, Generate Another button

---

## Page 4: Settings (/dashboard/settings)

### Tab Navigation (horizontal tabs or left sidebar)
Uses Radix Tabs component with 4 sections:

### Account Tab
- Avatar upload (circular, 120px)
- Full name (editable input)
- Email (read-only with "Verified" badge)
- Change password button (opens modal with current/new/confirm fields)
- Language dropdown (English, Deutsch, Magyar)
- Timezone dropdown (searchable)
- Save Changes button

### Billing Tab
- Current plan card (glass-morphism):
  - Plan name, price, status badge, renewal date
- Usage meter: "47 / 200 products" with progress bar
- Payment method card: card icon, last 4 digits, expiry, Update button
- Billing history table (last 5 invoices with download links)
- "Upgrade to Pro" button (if not Pro)
- "Cancel Subscription" button (danger, outline)

### Preferences Tab
- Theme selector (radio): Light, Dark, System
- Notification toggles (switches):
  - Email notifications
  - Product compliance alerts
  - Monthly usage summary
  - Marketing emails
- Default report format (radio): PPWR Only, DPP Only, Combined
- Save Preferences button

### Integrations Tab
- Coming soon section with disabled connect buttons:
  - Shopify card (logo + "Coming Soon" badge)
  - Etsy card (logo + "Coming Soon" badge)
- API Access card (Pro tier only):
  - Masked API key with copy button
  - Generate new key button
  - Docs link

---

## Layout Components

### DashboardLayout.tsx
- Wraps all dashboard pages
- Manages sidebar collapse state (persisted to localStorage)
- Responsive: hides sidebar on mobile, shows hamburger menu
- CSS Grid layout: `grid-cols-[auto_1fr]` for sidebar + content

### Sidebar.tsx (240px wide, collapsible to 60px)
**Top Section**:
- CompliPack logo (32px) + wordmark (hidden when collapsed)
- Collapse toggle button (chevron rotates 180deg)

**Navigation Links**:
- Dashboard (LayoutDashboard icon)
- Products (Package icon)
- Reports (FileText icon)
- Settings (Settings icon)

**Active State**:
- Blue gradient background: `from-primary/10 to-primary/5`
- Left border: `4px solid primary`
- Icon and text in primary color

**Bottom Section**:
- Plan badge ("Standard Plan" pill)
- "Upgrade to Pro" button (if applicable)
- Usage indicator: "47 / 200 products" with thin progress bar

**Mobile**:
- Hidden by default
- Slides in from left with overlay
- Close button (X) in top-right

### TopBar.tsx (sticky, full width)
**Left**: Page title (H3, font-weight 600)

**Right**:
- Search button (expands input on click)
- Notifications bell (with unread badge count)
- Dark/Light toggle (reuse from Navbar)
- User avatar dropdown:
  - Name + email
  - Account Settings
  - Billing
  - Help & Docs
  - Log Out (with confirm modal)

---

## Animation System

### Page Transitions
- Fade in/out (200ms) using Framer Motion `AnimatePresence`
- Content slides up slightly on enter

### Card Animations
- Stats cards: fade-in-up with 50ms stagger
- Product cards: hover scale(1.03), shadow increase
- Numbers: count-up from 0 using `useSpring`

### Modal Animations
- Sheet: slide-in from right with backdrop fade
- Dialog: scale-in with fade
- Multi-step: content cross-fades between steps

### Progress Indicators
- Progress bars: width animates from 0 to value
- Circular progress: stroke-dashoffset animation
- Loading spinners: Loader2 icon with spin animation

### Micro-interactions
- Buttons: scale on press (0.98), hover (1.02)
- Checkboxes: smooth check animation
- Switches: slide with subtle bounce
- Toasts: slide-in from top-right

---

## Mock Data Structure

### Products (47 demo products)
```typescript
interface Product {
  id: string;
  name: string;
  description?: string;
  length: number;      // cm
  width: number;       // cm
  height: number;      // cm
  weight?: number;     // kg
  materials?: string;
  ppwrCompliant: boolean;
  voidSpace: number;   // percentage
  hasDPP: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Reports (127 demo reports)
```typescript
interface Report {
  id: string;          // e.g., "RPT-12847"
  productId: string;
  productName: string;
  type: 'ppwr' | 'dpp' | 'combined';
  status: 'complete' | 'pending' | 'failed';
  generatedAt: string;
  verificationUrl: string;
}
```

### User Plan
```typescript
interface UserPlan {
  name: 'basic' | 'standard' | 'pro';
  productsLimit: number;
  productsUsed: number;
  renewalDate: string;
}
```

---

## Responsive Breakpoints

### Mobile (< 640px)
- Sidebar hidden, hamburger menu
- Stats: 1-column stack
- Products: 1-column grid, card view preferred
- Tables: horizontal scroll or card view
- Modals: full-screen
- Forms: single column

### Tablet (640px - 1024px)
- Sidebar collapsible (icon-only mode)
- Stats: 2-column grid
- Products: 2-column grid
- Tables: simplified columns
- Modals: 90% width

### Desktop (> 1024px)
- Full layout as designed
- Sidebar always visible (can collapse)
- Stats: 4-column grid
- Products: 3-column grid
- Modals: max-width 600-800px

---

## Routing Updates (App.tsx)

```typescript
// New routes to add:
<Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
<Route path="/dashboard/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
<Route path="/dashboard/products/new" element={<ProtectedRoute><Products /></ProtectedRoute>} />
<Route path="/dashboard/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
<Route path="/dashboard/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
```

---

## Files to Create

### Contexts
1. `src/contexts/ProductsContext.tsx` - Products state management with CRUD
2. `src/contexts/ReportsContext.tsx` - Reports state management

### Components
3. `src/components/dashboard/DashboardLayout.tsx` - Main layout wrapper
4. `src/components/dashboard/Sidebar.tsx` - Navigation sidebar
5. `src/components/dashboard/TopBar.tsx` - Header with user menu
6. `src/components/dashboard/StatsCard.tsx` - Animated stat card
7. `src/components/dashboard/RecentProductsTable.tsx` - Dashboard table
8. `src/components/dashboard/ProductCard.tsx` - Grid view card
9. `src/components/dashboard/ProductTable.tsx` - Table view
10. `src/components/dashboard/AddProductModal.tsx` - Add product sheet
11. `src/components/dashboard/ImportCSVModal.tsx` - CSV import wizard
12. `src/components/dashboard/GenerateReportModal.tsx` - Report wizard
13. `src/components/ProtectedRoute.tsx` - Auth guard

### Pages
14. `src/pages/Dashboard.tsx` - Main dashboard
15. `src/pages/Products.tsx` - Products management
16. `src/pages/Reports.tsx` - Reports management
17. `src/pages/Settings.tsx` - User settings

### Files to Modify
18. `src/App.tsx` - Add new routes and providers
19. `src/components/auth/SignupForm.tsx` - Redirect to /dashboard instead of /

---

## Implementation Phases

### Step 1: Foundation
- Create ProtectedRoute component
- Create ProductsContext and ReportsContext with mock data
- Update App.tsx with new routes and providers

### Step 2: Layout
- Build DashboardLayout, Sidebar, TopBar
- Implement collapsible sidebar with animations
- Add user dropdown with logout

### Step 3: Dashboard Page
- Build StatsCard with count-up animations
- Create RecentProductsTable
- Add quick actions section

### Step 4: Products Page
- Build ProductCard and ProductTable
- Implement search, filter, sort, view toggle
- Create AddProductModal with live preview
- Create ImportCSVModal wizard

### Step 5: Reports Page
- Build reports table with status badges
- Create GenerateReportModal multi-step wizard
- Implement report actions (view, download, copy link)

### Step 6: Settings Page
- Build tabbed interface
- Implement Account, Billing, Preferences, Integrations tabs
- Add form handling and save functionality

### Step 7: Polish
- Add all animations (page transitions, hover effects, stagger reveals)
- Ensure responsive design across breakpoints
- Test all flows and interactions

---

## Deliverables Summary

1. Dashboard with animated stats, quick actions, recent products
2. Products page with grid/table views, add product modal, CSV import
3. Reports page with list and multi-step generate wizard
4. Settings page with 4 tabs (Account, Billing, Preferences, Integrations)
5. Protected routing with auth checks
6. Sidebar navigation with active states and collapse
7. Top bar with user dropdown and logout
8. Full responsive design (mobile, tablet, desktop)
9. Mock data for demonstration (47 products, 127 reports)
10. Smooth Framer Motion animations throughout

