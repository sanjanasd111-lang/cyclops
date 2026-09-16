import { OpportunityProvider } from './provider';
import { DatabaseOpportunityProvider } from './database-provider';
import { Opportunity } from '@/lib/types';

export class OpportunityProviderRegistry {
  private providers: OpportunityProvider[] = [
    new DatabaseOpportunityProvider(),
  ];

  async getCombinedOpportunities(): Promise<Opportunity[]> {
    const allResults: Opportunity[] = [];

    for (const provider of this.providers) {
      if (provider.isEnabled) {
        try {
          const opps = await provider.fetchOpportunities();
          allResults.push(...opps);
        } catch {
          // Graceful provider failure: log internally and continue
        }
      }
    }

    return allResults;
  }
}

export const registry = new OpportunityProviderRegistry();
