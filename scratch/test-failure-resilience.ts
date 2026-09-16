import fs from 'fs';
import path from 'path';

// Parse .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      process.env[key] = value.trim();
    }
  });
}

import { generateGroundedAIAnalysis, generateGeminiResponse } from '../lib/gemini/analyzer';
import { registry } from '../lib/opportunities/providers/provider-registry';
import { getStudentProfile } from '../lib/db/db-client';
import { matchStudentToOpportunity } from '../lib/matching/engine';

async function runFailureResilienceTest() {
  console.log('=== TEST 3: API FAILURE & RESILIENCE TEST ===');

  // 1. Simulate Invalid/Expired Gemini API Key
  const originalKey = process.env.GEMINI_API_KEY;
  process.env.GEMINI_API_KEY = 'invalid-expired-key-12345';
  process.env.GOOGLE_GENERATIVE_AI_API_KEY = 'invalid-expired-key-12345';

  console.log('Simulating Gemini API Timeout / Failure...');
  const geminiResponse = await generateGeminiResponse('How do I bridge my biostatistics gap?');
  console.log('Resilient Gemini Output Received:', geminiResponse ? 'SUCCESS (Fallback text produced)' : 'FAIL');

  const { profile, skills } = await getStudentProfile('usr-test-resilience');
  const aiAnalysis = await generateGroundedAIAnalysis(profile, skills, [{ skill_name: 'Biostatistics', current_score: 40, required_score: 75, gap: 35 }], []);
  console.log('Grounded Analysis Source:', aiAnalysis.source, '| Career Paths:', aiAnalysis.data.careerPaths.join(', '));

  if (!aiAnalysis.data || aiAnalysis.data.careerPaths.length === 0) {
    throw new Error('FAIL: AI Analysis crashed on invalid API key!');
  }

  // Restore Key
  process.env.GEMINI_API_KEY = originalKey;

  // 2. Test Provider Registry Resilience
  console.log('Testing Opportunity Provider Registry Resilience...');
  const opps = await registry.getCombinedOpportunities();
  console.log(`Fetched ${opps.length} combined opportunities across active providers.`);

  if (!Array.isArray(opps)) {
    throw new Error('FAIL: Opportunity provider registry did not return valid opportunity array!');
  }

  // 3. Test Matching Engine Resilience on empty/missing profile fields
  const rawProfile: any = { id: 'sp-empty' };
  const rawSkills: any[] = [];
  const matchResult = matchStudentToOpportunity(rawProfile, rawSkills, opps[0] || { id: 'opp-1', title: 'Intern', company_name: 'Co', location: 'Delhi', duration_months: 3, stipend_amount: 10000, deadline: '2027-01-01', status: 'ACTIVE', created_at: '' });
  console.log('Resilient Match Engine Score for sparse profile:', matchResult.overallScore);

  console.log('✅ API FAILURE & RESILIENCE TEST PASSED CLEANLY!\n');
}

runFailureResilienceTest().catch((err) => {
  console.error('❌ API FAILURE & RESILIENCE TEST FAILED:', err);
  process.exit(1);
});
