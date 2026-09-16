import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { getIndustryOpportunities, createIndustryOpportunity } from '@/lib/db/db-client';
import { CENTRALIZED_CAREER_ROLES } from '@/lib/data/career-roles';

const OpportunitySchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  opportunity_type: z.string(),
  location: z.string().min(2, 'Location is required'),
  is_remote: z.boolean().default(false),
  duration_months: z.number().min(1).max(36),
  stipend_amount: z.number().min(0),
  salary_amount: z.number().optional(),
  deadline: z.string().min(5, 'Deadline is required'),
  eligibility_criteria: z.object({
    min_cgpa: z.number().optional(),
    course: z.string().optional(),
    allowed_streams: z.array(z.string()).optional(),
    allowed_years: z.array(z.number()).optional(),
    graduation_year: z.number().optional(),
  }).optional(),
  required_skills: z.array(
    z.object({
      skill_id: z.string(),
      skill_name: z.string(),
      min_proficiency: z.number().min(0).max(100),
      is_required: z.boolean(),
    })
  ).min(1, 'At least one required skill must be selected from taxonomy'),
});

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || 'ind-demo-001';

    const opps = await getIndustryOpportunities(userId);
    return NextResponse.json({ success: true, data: opps });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch industry opportunities' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || 'ind-demo-001';

    const body = await req.json();

    // Zod validation guardrail
    const validated = OpportunitySchema.parse(body);

    const newOpp = await createIndustryOpportunity(userId, validated as any);

    return NextResponse.json({ success: true, data: newOpp });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation Error', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create opportunity' },
      { status: 500 }
    );
  }
}
