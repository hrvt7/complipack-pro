import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';

export interface UserProfile {
  id: string;
  full_name: string;
  company_name?: string;
  avatar_url?: string;
  language: 'en' | 'de' | 'hu';
  theme: 'dark' | 'light' | 'system';
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  tier: 'basic' | 'standard' | 'pro' | 'enterprise';
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  products_limit: number;
  products_used: number;
  current_period_start: string;
  current_period_end: string;
}

export function useUserProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch profile and subscription
  const fetchProfile = useCallback(async () => {
    if (!userId) {
      setProfile(null);
      setSubscription(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [profileResult, subscriptionResult] = await Promise.all([
        supabase.from('user_profiles').select('*').eq('id', userId).maybeSingle(),
        supabase.from('subscriptions').select('*').eq('user_id', userId).maybeSingle()
      ]);

      if (profileResult.error) throw profileResult.error;
      if (subscriptionResult.error) throw subscriptionResult.error;

      setProfile(profileResult.data as UserProfile | null);
      setSubscription(subscriptionResult.data as Subscription | null);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Update profile
  const updateProfile = async (updates: Partial<Pick<UserProfile, 'full_name' | 'company_name' | 'language' | 'theme'>>): Promise<boolean> => {
    if (!userId) return false;

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, ...updates } : null);
      toast({
        title: 'Settings saved',
        description: 'Your profile has been updated.'
      });

      return true;
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive'
      });
      return false;
    }
  };

  // Update password
  const updatePassword = async (newPassword: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: 'Password updated',
        description: 'Your password has been changed successfully.'
      });

      return true;
    } catch (error) {
      console.error('Failed to update password:', error);
      toast({
        title: 'Error',
        description: 'Failed to update password',
        variant: 'destructive'
      });
      return false;
    }
  };

  // Upload avatar
  const uploadAvatar = async (file: File): Promise<string | null> => {
    if (!userId) return null;

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile with avatar URL
      await supabase
        .from('user_profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId);

      setProfile(prev => prev ? { ...prev, avatar_url: publicUrl } : null);

      toast({
        title: 'Avatar updated',
        description: 'Your profile picture has been changed.'
      });

      return publicUrl;
    } catch (error) {
      console.error('Failed to upload avatar:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload avatar',
        variant: 'destructive'
      });
      return null;
    }
  };

  return {
    profile,
    subscription,
    loading,
    updateProfile,
    updatePassword,
    uploadAvatar,
    refreshProfile: fetchProfile
  };
}
