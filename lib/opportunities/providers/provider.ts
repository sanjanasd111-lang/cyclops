import { Opportunity } from '@/lib/types';

export interface OpportunityProvider {
  name: string;
  isEnabled: boolean;
  fetchOpportunities(): Promise<Opportunity[]>;
}
