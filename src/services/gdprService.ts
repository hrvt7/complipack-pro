import { supabase } from "@/integrations/supabase/client";

export interface UserDataExport {
  profile: any;
  products: any[];
  reports: any[];
  terms_acceptances: any[];
  exported_at: string;
}

// Export all user data (GDPR Data Portability)
export const exportUserData = async (userId: string): Promise<void> => {
  try {
    // Fetch all user data in parallel
    const [profileResult, termsResult] = await Promise.all([
      supabase.from('user_profiles').select('*').eq('id', userId).maybeSingle(),
      supabase.from('terms_acceptances').select('*').eq('user_id', userId)
    ]);

    const exportData: UserDataExport = {
      profile: profileResult.data || null,
      products: [],
      reports: [],
      terms_acceptances: termsResult.data || [],
      exported_at: new Date().toISOString()
    };

    // Create downloadable JSON file
    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `complipack-data-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to export user data:', error);
    throw new Error('Failed to export user data. Please try again.');
  }
};

// Delete user account and all data (GDPR Right to Erasure)
export const deleteUserAccount = async (userId: string): Promise<void> => {
  try {
    // Delete storage files first (QR codes, PDFs)
    const { data: files } = await supabase.storage
      .from('compliance-assets')
      .list(userId);

    if (files && files.length > 0) {
      const filePaths = files.map(file => `${userId}/${file.name}`);
      await supabase.storage.from('compliance-assets').remove(filePaths);
    }

    // Delete avatar if exists
    const { data: avatarFiles } = await supabase.storage
      .from('avatars')
      .list(userId);

    if (avatarFiles && avatarFiles.length > 0) {
      const avatarPaths = avatarFiles.map(file => `${userId}/${file.name}`);
      await supabase.storage.from('avatars').remove(avatarPaths);
    }

    // Delete database records in order (respecting foreign keys)
    // Reports reference products, so delete reports first
    await supabase.from('terms_acceptances').delete().eq('user_id', userId);
    await supabase.from('subscriptions').delete().eq('user_id', userId);
    await supabase.from('user_profiles').delete().eq('id', userId);

    // Sign out the user
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Failed to delete user account:', error);
    throw new Error('Failed to delete account. Please contact support.');
  }
};

// Record terms acceptance
export const recordTermsAcceptance = async (
  userId: string,
  termsVersion: string = 'v1.0',
  privacyVersion: string = 'v1.0'
): Promise<void> => {
  const { error } = await supabase.from('terms_acceptances').insert({
    user_id: userId,
    terms_version: termsVersion,
    privacy_version: privacyVersion,
    ip_address: 'unknown' // In production, get from edge function
  });

  if (error) {
    console.error('Failed to record terms acceptance:', error);
    // Don't throw - this is not critical to user flow
  }
};
