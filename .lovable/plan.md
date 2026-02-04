

# CompliPack Phase 4 - Complete Backend Integration

## Overview

This phase transforms CompliPack from a mock-data application into a fully functional platform with real Supabase authentication, database persistence, PDF generation, QR codes, and compliance calculations.

**Current State:**
- Auth uses localStorage mock (`src/contexts/AuthContext.tsx`)
- Products/Reports use localStorage with 47/127 mock items
- No Supabase integration exists (`src/lib/` only has `utils.ts`)
- No compliance engine exists (`src/compliance/` directory doesn't exist)
- No service layer exists (`src/services/` directory doesn't exist)

**Target State:**
- Real Supabase authentication with email/password
- Database persistence for all data
- Real PPWR calculations with standard EU box sizes
- Real DPP data generation
- PDF generation with @react-pdf/renderer
- QR code generation with qrcode library
- File storage in Supabase Storage

---

## Architecture Overview

```text
+-------------------------------------------------------------------+
|                         Frontend (React)                          |
+-------------------------------------------------------------------+
|  Pages        |  Components      |  Contexts                      |
|  - Dashboard  |  - AddProduct    |  - AuthContext (Supabase)     |
|  - Products   |  - GenerateReport|  - ProductsContext (hooks)    |
|  - Reports    |  - Settings      |  - ReportsContext (hooks)     |
|  - Settings   |                  |                                |
+-------------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------------+
|                      Service Layer (NEW)                          |
+-------------------------------------------------------------------+
|  src/lib/                                                         |
|  - supabase.ts (client)                                           |
|                                                                   |
|  src/services/                                                    |
|  - complianceService.ts (PPWR + DPP calculations)                |
|  - qrService.ts (QR code generation + upload)                    |
|  - pdfService.ts (PDF generation + upload)                       |
|  - reportService.ts (orchestrates report generation)             |
|                                                                   |
|  src/hooks/                                                       |
|  - useProducts.ts (CRUD with Supabase)                           |
|  - useReports.ts (CRUD + generation with Supabase)               |
|  - useUserProfile.ts (profile + subscription)                    |
|  - useDashboardStats.ts (real-time stats)                        |
+-------------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------------+
|                    Supabase Backend (Cloud)                       |
+-------------------------------------------------------------------+
|  Auth          |  Database                |  Storage              |
|  - Email/Pass  |  - user_profiles         |  - avatars (private) |
|  - Session     |  - subscriptions         |  - compliance-assets |
|  - Password    |  - products              |    (public QR/PDF)   |
|    Reset       |  - compliance_reports    |                       |
|                |  - standard_boxes        |                       |
|                |  - terms_acceptances     |                       |
+-------------------------------------------------------------------+
```

---

## Part 1: Supabase Setup & Configuration

### 1.1 Enable Lovable Cloud
- Enable "Built-in backend" in Lovable Settings
- This provisions Supabase automatically with auth, database, and storage

### 1.2 Create Supabase Client
**File: `src/lib/supabase.ts`** (NEW)

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### 1.3 Install Dependencies
```bash
npm install @react-pdf/renderer qrcode papaparse
npm install --save-dev @types/papaparse
```

---

## Part 2: Database Schema

### 2.1 Core Tables Migration

**Tables to create:**
1. `user_profiles` - User profile data (linked to auth.users)
2. `subscriptions` - Subscription tier and usage
3. `standard_boxes` - Pre-populated EU standard box sizes
4. `products` - User's products
5. `compliance_reports` - Generated reports with PPWR/DPP data
6. `terms_acceptances` - Legal compliance records

### 2.2 Key Schema Details

**user_profiles:**
- id (UUID, references auth.users)
- full_name, company_name, avatar_url
- language ('en'|'de'|'hu'), theme ('dark'|'light'|'system')
- created_at, updated_at

**subscriptions:**
- user_id (references user_profiles)
- tier ('basic'|'standard'|'pro'|'enterprise')
- products_limit, products_used
- status ('active'|'canceled'|'trialing')
- current_period_start, current_period_end

**standard_boxes (pre-populated):**
| Name | L×W×H (cm) | Volume | Cost |
|------|------------|--------|------|
| XS   | 15×10×8    | 1,200  | €0.25|
| S    | 20×15×10   | 3,000  | €0.35|
| M    | 25×20×15   | 7,500  | €0.50|
| L    | 30×25×20   | 15,000 | €0.75|
| XL   | 40×30×25   | 30,000 | €1.10|
| XXL  | 50×40×30   | 60,000 | €1.50|
| Maxi | 60×50×40   | 120,000| €2.20|
| Giant| 80×60×50   | 240,000| €3.50|

**products:**
- user_id, name, description
- length_cm, width_cm, height_cm, weight_kg
- materials
- created_at, updated_at

**compliance_reports:**
- user_id, product_id, report_type ('ppwr'|'dpp'|'combined')
- recommended_box_id (references standard_boxes)
- void_space_percent, is_ppwr_compliant
- dpp_data (JSONB - flexible DPP structure)
- ppwr_qr_url, dpp_qr_url, pdf_url
- status ('pending'|'generating'|'complete'|'failed')

### 2.3 Row Level Security (RLS)

All tables will have RLS enabled with policies:
- Users can only SELECT/INSERT/UPDATE/DELETE their own data
- `standard_boxes` is public read-only
- Auto-create profile and subscription on signup via database trigger

### 2.4 Storage Buckets

**Buckets:**
1. `avatars` - Private, user avatars organized by `{user_id}/avatar.{ext}`
2. `compliance-assets` - Public, organized by `{user_id}/qr/{filename}.png` and `{user_id}/reports/{report_id}.pdf`

---

## Part 3: Authentication Integration

### 3.1 Update AuthContext
**File: `src/contexts/AuthContext.tsx`** (MODIFY)

Replace mock localStorage auth with real Supabase:

**Key changes:**
- Use `supabase.auth.signUp()` with email/password
- Use `supabase.auth.signInWithPassword()`
- Use `supabase.auth.signOut()`
- Use `supabase.auth.getSession()` for initial load
- Use `supabase.auth.onAuthStateChange()` for reactive updates
- Store `full_name` in `user_meta_data` during signup
- Record terms acceptance in `terms_acceptances` table

**New interface:**
```typescript
interface AuthContextType {
  user: User | null
  session: Session | null
  isLoading: boolean
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: string | null }>
}
```

### 3.2 Update SignupForm
**File: `src/components/auth/SignupForm.tsx`** (MODIFY)

- Connect to new AuthContext signUp method
- Pass termsAccepted flag
- Handle Supabase errors properly

### 3.3 Update LoginForm
**File: `src/components/auth/LoginForm.tsx`** (MODIFY)

- Connect to new AuthContext signIn method
- Handle Supabase auth errors

### 3.4 Update ProtectedRoute
**File: `src/components/ProtectedRoute.tsx`** (MODIFY)

- Check for Supabase session instead of mock user
- Handle loading state properly

---

## Part 4: Products CRUD

### 4.1 Create Products Hook
**File: `src/hooks/useProducts.ts`** (NEW)

Functions:
- `fetchProducts()` - Load user's products from Supabase
- `addProduct(data)` - Insert new product
- `updateProduct(id, updates)` - Update existing product
- `deleteProduct(id)` - Delete product
- `importCSV(file)` - Parse CSV and bulk insert

### 4.2 Update ProductsContext
**File: `src/contexts/ProductsContext.tsx`** (MODIFY)

Replace localStorage mock with calls to useProducts hook:
- Remove mock data generation
- Use Supabase queries via hook
- Keep same interface for backward compatibility

### 4.3 CSV Import
**File: `src/services/csvService.ts`** (NEW)

- Parse CSV using PapaParse
- Validate required columns (product_name, length_cm, width_cm, height_cm)
- Transform to product objects
- Return parsed data or errors

---

## Part 5: Compliance Calculations

### 5.1 PPWR Engine
**File: `src/services/complianceService.ts`** (NEW)

**PPWR Calculation Logic:**
```typescript
function calculatePPWRCompliance(product, boxes) {
  const productVolume = product.length * product.width * product.height
  
  // Find smallest box that fits product (with padding)
  const paddedDimensions = {
    length: product.length + 2,
    width: product.width + 2,
    height: product.height + 2
  }
  
  const fittingBoxes = boxes.filter(box => 
    box.length >= paddedDimensions.length &&
    box.width >= paddedDimensions.width &&
    box.height >= paddedDimensions.height
  )
  
  const recommendedBox = fittingBoxes[0] // Smallest fitting box
  const boxVolume = recommendedBox.length * recommendedBox.width * recommendedBox.height
  const voidSpace = ((boxVolume - productVolume) / boxVolume) * 100
  const isCompliant = voidSpace < 40
  
  return {
    recommendedBox,
    voidSpace: Math.round(voidSpace * 100) / 100,
    isCompliant,
    productVolume,
    boxVolume,
    explanation: isCompliant 
      ? `Compliant: ${voidSpace.toFixed(1)}% void space is under 40% threshold`
      : `Non-compliant: ${voidSpace.toFixed(1)}% void space exceeds 40% threshold`
  }
}
```

### 5.2 DPP Data Generation
**File: `src/services/complianceService.ts`** (continuation)

**DPP Data Structure:**
```typescript
interface DPPData {
  productName: string
  dimensions: string
  volume: number
  materials: string
  carbonFootprintKg: number  // Estimated from volume/materials
  waterUsageLiters: number   // Estimated
  recyclabilityScore: number // 0-100 based on materials
  durabilityRating: number   // 1-10 estimated
  careInstructions: string
  repairInstructions: string
  endOfLifeOptions: string
}
```

**Estimation logic:**
- Carbon footprint: `volume / 1000 * materialFactor`
- Water usage: `volume / 10`
- Recyclability: Material-based lookup (glass=100, metal=90, paper=95, plastic=40, etc.)

---

## Part 6: QR Code Generation

### 6.1 QR Service
**File: `src/services/qrService.ts`** (NEW)

Functions:
- `generateQRCode(data, filename, userId)` - Generate QR as PNG, upload to Supabase Storage
- `generatePPWRQR(reportId, userId, ppwrData)` - Create PPWR-specific QR
- `generateDPPQR(reportId, userId, dppData)` - Create DPP-specific QR

**QR Data Structure:**
```json
{
  "type": "PPWR",
  "report_id": "uuid",
  "verification_url": "https://complipack.io/verify/ppwr/{id}",
  "box": "M",
  "void_space": 23.5,
  "compliant": true
}
```

### 6.2 Storage Upload
- Use `supabase.storage.from('compliance-assets').upload()`
- Return public URL via `getPublicUrl()`

---

## Part 7: PDF Generation

### 7.1 PDF Service
**File: `src/services/pdfService.ts`** (NEW)

Using @react-pdf/renderer:

**PDF Structure:**
- Page 1: Cover with product name, report ID, generation date
- Page 2: PPWR Analysis (box recommendation, void space chart, compliance status)
- Page 3: DPP Summary (carbon footprint, recyclability, materials)
- Page 4: QR Codes (embedded as images)
- Footer on all pages: Disclaimer text

### 7.2 PDF Component
**File: `src/components/compliance/ComplianceReportPDF.tsx`** (NEW)

React-PDF document component with:
- Styled header with CompliPack branding
- PPWR section with void space visualization
- DPP section with sustainability metrics
- QR code images
- Legal disclaimers

### 7.3 PDF Upload
- Generate blob via `pdf(<Component />).toBlob()`
- Upload to Supabase Storage
- Return public URL

---

## Part 8: Report Generation Workflow

### 8.1 Reports Hook
**File: `src/hooks/useReports.ts`** (NEW)

**generateReport(productId, reportType):**
1. Fetch product from database
2. Fetch standard boxes from database
3. Calculate PPWR compliance
4. Generate DPP data
5. Create report record (status: 'generating')
6. Generate PPWR QR code → upload → get URL
7. Generate DPP QR code → upload → get URL
8. Generate PDF with all data → upload → get URL
9. Update report record with URLs (status: 'complete')
10. Return complete report

### 8.2 Update ReportsContext
**File: `src/contexts/ReportsContext.tsx`** (MODIFY)

Replace mock data with Supabase queries:
- `fetchReports()` - Load from database with product/box relations
- `addReport()` - Delegate to generateReport in hook
- `deleteReport()` - Delete from database + storage files

### 8.3 Update GenerateReportModal
**File: `src/components/dashboard/GenerateReportModal.tsx`** (MODIFY)

- Call real `generateReport()` function
- Show actual progress (generating QR, generating PDF, etc.)
- Enable real PDF download from returned URL

---

## Part 9: Dashboard Stats

### 9.1 Dashboard Stats Hook
**File: `src/hooks/useDashboardStats.ts`** (NEW)

Real-time stats from Supabase:
```typescript
const stats = {
  totalProducts: await count('products'),
  compliantProducts: await count('compliance_reports', { is_ppwr_compliant: true }),
  reportsGenerated: await count('compliance_reports'),
  nonCompliant: await count('compliance_reports', { is_ppwr_compliant: false })
}
```

### 9.2 Update Dashboard Page
**File: `src/pages/Dashboard.tsx`** (MODIFY)

- Use useDashboardStats hook instead of mock numbers
- Keep count-up animations

---

## Part 10: User Profile & Settings

### 10.1 User Profile Hook
**File: `src/hooks/useUserProfile.ts`** (NEW)

Functions:
- `fetchProfile()` - Get profile and subscription
- `updateProfile(updates)` - Update profile fields
- `updatePassword(newPassword)` - Supabase password update
- `uploadAvatar(file)` - Upload to avatars bucket

### 10.2 Update Settings Page
**File: `src/pages/Settings.tsx`** (MODIFY)

Connect to real data:
- Profile info from `user_profiles` table
- Subscription from `subscriptions` table
- Avatar upload to Supabase Storage
- Theme/language preferences saved to profile

---

## Part 11: GDPR Data Export & Deletion

### 11.1 Data Export
**File: `src/services/gdprService.ts`** (NEW)

```typescript
async function exportUserData(userId: string) {
  const data = {
    profile: await fetch('user_profiles'),
    products: await fetch('products'),
    reports: await fetch('compliance_reports'),
    terms: await fetch('terms_acceptances'),
    exported_at: new Date().toISOString()
  }
  
  // Create downloadable JSON
  downloadAsJSON(data, `complipack-export-${date}.json`)
}
```

### 11.2 Account Deletion
```typescript
async function deleteAccount(userId: string) {
  // Delete in order (respecting foreign keys)
  await delete('compliance_reports')
  await delete('products')
  await delete('subscriptions')
  await delete('terms_acceptances')
  await delete('user_profiles')
  await supabase.auth.signOut()
}
```

---

## Part 12: Verification Pages

### 12.1 Public Verification Routes
**Files: `src/pages/verify/PPWRVerify.tsx`, `src/pages/verify/DPPVerify.tsx`** (NEW)

Public pages (no auth required) that display:
- Report details from QR code data
- Compliance status
- Generation date
- Disclaimer text

Routes:
- `/verify/ppwr/:reportId`
- `/verify/dpp/:reportId`

---

## File Structure Summary

### New Files to Create
```text
src/
├── lib/
│   └── supabase.ts                    # Supabase client
├── services/
│   ├── complianceService.ts           # PPWR + DPP calculations
│   ├── qrService.ts                   # QR generation + upload
│   ├── pdfService.ts                  # PDF generation + upload
│   ├── csvService.ts                  # CSV parsing
│   └── gdprService.ts                 # Data export/deletion
├── hooks/
│   ├── useProducts.ts                 # Products CRUD
│   ├── useReports.ts                  # Reports CRUD + generation
│   ├── useUserProfile.ts              # Profile + subscription
│   └── useDashboardStats.ts           # Real-time stats
├── components/
│   └── compliance/
│       └── ComplianceReportPDF.tsx    # PDF document component
└── pages/
    └── verify/
        ├── PPWRVerify.tsx             # Public PPWR verification
        └── DPPVerify.tsx              # Public DPP verification
```

### Files to Modify
```text
src/
├── contexts/
│   ├── AuthContext.tsx                # Supabase auth
│   ├── ProductsContext.tsx            # Use hooks
│   └── ReportsContext.tsx             # Use hooks
├── components/
│   ├── ProtectedRoute.tsx             # Supabase session
│   ├── auth/
│   │   ├── SignupForm.tsx             # Supabase signup
│   │   └── LoginForm.tsx              # Supabase login
│   └── dashboard/
│       ├── AddProductModal.tsx        # Real compliance preview
│       ├── ImportCSVModal.tsx         # Real CSV parsing
│       └── GenerateReportModal.tsx    # Real generation
├── pages/
│   ├── Dashboard.tsx                  # Real stats
│   ├── Products.tsx                   # Real CRUD
│   ├── Reports.tsx                    # Real reports
│   └── Settings.tsx                   # Real profile
└── App.tsx                            # Add verify routes
```

---

## Database Migration Order

Execute in this order:
1. Enable UUID extension
2. Create `user_profiles` table
3. Create `subscriptions` table
4. Create `standard_boxes` table + insert data
5. Create `products` table
6. Create `compliance_reports` table
7. Create `terms_acceptances` table
8. Create indexes
9. Enable RLS on all tables
10. Create RLS policies
11. Create `handle_new_user()` trigger function
12. Create trigger on `auth.users`
13. Create storage buckets
14. Create storage policies

---

## Implementation Phases

### Phase A: Foundation (First)
1. Enable Lovable Cloud
2. Create Supabase client
3. Run database migrations
4. Create storage buckets

### Phase B: Authentication
5. Update AuthContext with Supabase
6. Update SignupForm and LoginForm
7. Update ProtectedRoute
8. Test auth flow end-to-end

### Phase C: Products
9. Create useProducts hook
10. Update ProductsContext
11. Create csvService
12. Update ImportCSVModal
13. Test products CRUD

### Phase D: Compliance Services
14. Create complianceService (PPWR + DPP)
15. Update AddProductModal preview to use real calculations
16. Create qrService
17. Create pdfService
18. Create PDF component

### Phase E: Reports
19. Create useReports hook
20. Update ReportsContext
21. Update GenerateReportModal
22. Test full report generation workflow

### Phase F: Dashboard & Settings
23. Create useDashboardStats hook
24. Update Dashboard with real stats
25. Create useUserProfile hook
26. Update Settings page

### Phase G: GDPR & Verification
27. Create gdprService
28. Add data export to Settings
29. Add account deletion to Settings
30. Create verification pages
31. Add verify routes

---

## Testing Checklist

**Authentication:**
- [ ] Signup creates real Supabase account
- [ ] Profile and subscription created automatically
- [ ] Login works with correct credentials
- [ ] Login fails gracefully with wrong credentials
- [ ] Session persists on page refresh
- [ ] Logout clears session
- [ ] Protected routes redirect unauthenticated users

**Products:**
- [ ] Add product saves to database
- [ ] Products list loads from database
- [ ] Edit product updates database
- [ ] Delete product removes from database
- [ ] CSV import parses and saves multiple products
- [ ] Products persist after refresh

**Compliance:**
- [ ] PPWR calculation selects correct box size
- [ ] Void space calculation is accurate
- [ ] DPP data generates with estimates
- [ ] Live preview in AddProductModal uses real calculation

**Reports:**
- [ ] Generate report creates database record
- [ ] QR codes generate and upload to storage
- [ ] PDF generates with all sections
- [ ] PDF uploads to storage
- [ ] Report status updates correctly
- [ ] PDF downloads successfully
- [ ] QR codes scan to verification pages

**Dashboard:**
- [ ] Stats show real counts from database
- [ ] Stats update after adding/deleting products
- [ ] Recent products table shows real data

**Settings:**
- [ ] Profile updates save to database
- [ ] Password change works
- [ ] Avatar upload works
- [ ] Data export downloads complete JSON
- [ ] Account deletion works (with confirmation)

**Verification:**
- [ ] PPWR verify page loads report data
- [ ] DPP verify page loads report data
- [ ] Pages work without authentication

---

## Deliverables Summary

1. Supabase client configuration
2. Complete database schema with 6 tables
3. Storage buckets for avatars and compliance assets
4. Real Supabase authentication (signup, login, logout, password reset)
5. Products CRUD with database persistence
6. CSV import with PapaParse
7. PPWR compliance calculation engine
8. DPP data generation with estimates
9. QR code generation with qrcode library
10. PDF generation with @react-pdf/renderer
11. Complete report generation workflow
12. Real-time dashboard statistics
13. User profile management
14. GDPR data export and account deletion
15. Public verification pages
16. All hooks for database operations
17. Updated contexts using real data
18. Loading states and error handling throughout

