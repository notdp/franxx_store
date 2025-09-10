import { supabase } from '@/lib/supabase/client';

export function createSupabaseBrowser() {
  // 返回统一的单例实例，避免多实例并发导致的不确定行为
  return supabase;
}
