-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('avatars', 'avatars', false),
  ('compliance-assets', 'compliance-assets', true);

-- Storage policies for avatars (private)
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own avatar"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for compliance assets (public read)
CREATE POLICY "Users can upload own compliance assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'compliance-assets' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own compliance assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'compliance-assets' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Anyone can view compliance assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'compliance-assets');

CREATE POLICY "Users can delete own compliance assets"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'compliance-assets' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add public SELECT policy for compliance_reports (for verification pages)
CREATE POLICY "Anyone can view reports by id for verification"
ON public.compliance_reports
FOR SELECT
USING (true);