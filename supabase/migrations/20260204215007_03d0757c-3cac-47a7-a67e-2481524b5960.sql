-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Profiles Table
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  company_name TEXT,
  avatar_url TEXT,
  language TEXT DEFAULT 'en' CHECK (language IN ('en', 'de', 'hu')),
  theme TEXT DEFAULT 'system' CHECK (theme IN ('dark', 'light', 'system')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions Table
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  tier TEXT NOT NULL DEFAULT 'basic' CHECK (tier IN ('basic', 'standard', 'pro', 'enterprise')),
  status TEXT NOT NULL DEFAULT 'trialing' CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
  products_limit INTEGER NOT NULL DEFAULT 50,
  products_used INTEGER DEFAULT 0,
  current_period_start TIMESTAMPTZ DEFAULT NOW(),
  current_period_end TIMESTAMPTZ DEFAULT NOW() + INTERVAL '14 days',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Standard Boxes (Pre-populated with EU standard sizes)
CREATE TABLE public.standard_boxes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  length_cm INTEGER NOT NULL,
  width_cm INTEGER NOT NULL,
  height_cm INTEGER NOT NULL,
  volume_cm3 INTEGER GENERATED ALWAYS AS (length_cm * width_cm * height_cm) STORED,
  cost_eur DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert standard EU boxes
INSERT INTO public.standard_boxes (name, length_cm, width_cm, height_cm, cost_eur) VALUES
  ('XS', 15, 10, 8, 0.25),
  ('S', 20, 15, 10, 0.35),
  ('M', 25, 20, 15, 0.50),
  ('L', 30, 25, 20, 0.75),
  ('XL', 40, 30, 25, 1.10),
  ('XXL', 50, 40, 30, 1.50),
  ('Maxi', 60, 50, 40, 2.20),
  ('Giant', 80, 60, 50, 3.50);

-- Products Table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  length_cm DECIMAL(10,2) NOT NULL,
  width_cm DECIMAL(10,2) NOT NULL,
  height_cm DECIMAL(10,2) NOT NULL,
  weight_kg DECIMAL(10,2),
  materials TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Compliance Reports Table
CREATE TABLE public.compliance_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  report_type TEXT NOT NULL CHECK (report_type IN ('ppwr', 'dpp', 'combined')),
  
  -- PPWR Data
  recommended_box_id UUID REFERENCES public.standard_boxes(id),
  void_space_percent DECIMAL(5,2),
  is_ppwr_compliant BOOLEAN,
  
  -- DPP Data (JSON for flexibility)
  dpp_data JSONB,
  
  -- QR Codes & PDF URLs
  ppwr_qr_url TEXT,
  dpp_qr_url TEXT,
  pdf_url TEXT,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'generating', 'complete', 'failed')),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Terms Acceptances (for GDPR legal compliance)
CREATE TABLE public.terms_acceptances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  terms_version TEXT NOT NULL,
  privacy_version TEXT NOT NULL,
  ip_address TEXT,
  accepted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_products_user_id ON public.products(user_id);
CREATE INDEX idx_reports_user_id ON public.compliance_reports(user_id);
CREATE INDEX idx_reports_product_id ON public.compliance_reports(product_id);
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_terms_user_id ON public.terms_acceptances(user_id);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.standard_boxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.terms_acceptances ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for subscriptions
CREATE POLICY "Users can view own subscription" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription" ON public.subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for standard_boxes (public read-only)
CREATE POLICY "Anyone can read standard boxes" ON public.standard_boxes
  FOR SELECT USING (true);

-- RLS Policies for products
CREATE POLICY "Users can view own products" ON public.products
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own products" ON public.products
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own products" ON public.products
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own products" ON public.products
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for compliance_reports
CREATE POLICY "Users can view own reports" ON public.compliance_reports
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reports" ON public.compliance_reports
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reports" ON public.compliance_reports
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reports" ON public.compliance_reports
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for terms_acceptances
CREATE POLICY "Users can view own terms acceptances" ON public.terms_acceptances
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own terms acceptances" ON public.terms_acceptances
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to automatically create user profile and subscription on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'));
  
  INSERT INTO public.subscriptions (user_id, tier, products_limit, status)
  VALUES (NEW.id, 'basic', 50, 'trialing');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to auto-create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Timestamp triggers
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_compliance_reports_updated_at
  BEFORE UPDATE ON public.compliance_reports
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();