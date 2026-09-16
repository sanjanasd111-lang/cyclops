import { OpportunityProvider } from './provider';
import { Opportunity } from '@/lib/types';
import { OPPORTUNITIES_DATA } from '@/lib/db/seed-data';

export class DatabaseOpportunityProvider implements OpportunityProvider {
  name = 'Database / Industry Portal';
  isEnabled = true;

  async fetchOpportunities(): Promise<Opportunity[]> {
    try {
      // In production, queries Supabase `opportunities` table
      return OPPORTUNITIES_DATA;
    } catch {
      return [];
    }
  }
}
