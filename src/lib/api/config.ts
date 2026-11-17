import { DataSourceMode } from '@/src/types/common';

export const APP_CONFIG = {
  dataMode: ((import.meta.env.VITE_DATA_MODE as DataSourceMode) || 'demo') as DataSourceMode,
  isDemoMode: (import.meta.env.VITE_DATA_MODE || 'demo') === 'demo',
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  freeShippingThreshold: 999,
  standardShippingFee: 79,
  marketplaceCommissionRate: 0.12,
};

export async function simulateLatency(ms = 140): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}
