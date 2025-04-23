import { supabase } from './client';

export async function savePushToken({ user_id, expo_push_token }) {
  return await supabase.from('push_tokens').upsert([
    { user_id, expo_push_token },
  ], { onConflict: ['user_id'] });
}

export async function getPushToken(user_id) {
  const { data, error } = await supabase
    .from('push_tokens')
    .select('expo_push_token')
    .eq('user_id', user_id)
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data?.expo_push_token;
} 