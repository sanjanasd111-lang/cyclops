export interface InterviewReportData {
  id: string;
  session_id: string;
  user_id: string;
  target_role: string;
  academic_branch: string;
  overall_score: number;
  technical_score: number;
  communication_score: number;
  relevance_score: number;
  clarity_score: number;
  structure_score: number;
  problem_solving_score: number;
  role_alignment_score: number;
  total_questions: number;
  answered_questions: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  skill_performance: Array<{
    skill_name: string;
    score: number;
    status: 'Strong' | 'Developing' | 'Needs Improvement';
    category: string;
  }>;
  created_at: string;
}

export function generateInterviewReport(params: {
  sessionId: string;
  userId: string;
  session: any;
  questions: any[];
  evaluations: any[];
  profile?: any;
}): InterviewReportData {
  const { sessionId, userId, session, questions, evaluations, profile } = params;

  const totalQuestions = questions.length || 1;
  const answeredQuestions = evaluations.length;

  let sumTech = 0;
  let sumRel = 0;
  let sumClar = 0;
  let sumStruct = 0;
  let sumComp = 0;
  let sumAlign = 0;
  let sumSituation = 0;
  let sumTask = 0;
  let sumAction = 0;
  let sumResult = 0;

  const strengthsSet = new Set<string>();
  const weaknessesSet = new Set<string>();
  const skillScoreMap = new Map<string, { total: number; count: number }>();

  evaluations.forEach((e: any, idx: number) => {
    const q = questions[idx] || {};
    const skillName = q.category || q.expected_topics?.[0] || 'Domain Knowledge';

    sumTech += e.technical_score ?? e.technicalAccuracy ?? 75;
    sumRel += e.relevance_score ?? e.relevance ?? 75;
    sumClar += e.clarity_score ?? e.clarity ?? 75;
    sumStruct += e.structure_score ?? e.structure ?? 75;
    sumComp += e.completeness_score ?? e.completeness ?? 75;
    sumAlign += e.role_alignment_score ?? e.roleAlignment ?? 75;

    sumSituation += e.star_situation_score ?? e.starSituation ?? 75;
    sumTask += e.star_task_score ?? e.starTask ?? 70;
    sumAction += e.star_action_score ?? e.starAction ?? 80;
    sumResult += e.star_result_score ?? e.starResult ?? 65;

    (e.strengths || []).forEach((s: string) => strengthsSet.add(s));
    (e.improvements || e.weaknesses || []).forEach((w: string) => weaknessesSet.add(w));

    const curr = skillScoreMap.get(skillName) || { total: 0, count: 0 };
    curr.total += e.overall_score ?? e.score ?? 75;
    curr.count += 1;
    skillScoreMap.set(skillName, curr);
  });

  const count = Math.max(1, evaluations.length);

  const technical_score = Math.round(sumTech / count);
  const relevance_score = Math.round(sumRel / count);
  const clarity_score = Math.round(sumClar / count);
  const structure_score = Math.round(sumStruct / count);
  const problem_solving_score = Math.round(sumComp / count);
  const role_alignment_score = Math.round(sumAlign / count);
  const communication_score = Math.round((clarity_score + sumSituation / count + sumTask / count) / 3);

  const overall_score = Math.round(
    technical_score * 0.30 +
    communication_score * 0.20 +
    relevance_score * 0.15 +
    clarity_score * 0.10 +
    structure_score * 0.10 +
    problem_solving_score * 0.10 +
    role_alignment_score * 0.05
  );

  const strengths = Array.from(strengthsSet);
  if (strengths.length === 0) {
    if (technical_score >= 80) strengths.push('Strong domain technical foundation');
    if (communication_score >= 75) strengths.push('Clear articulation and professional tone');
    if (relevance_score >= 75) strengths.push('Direct response to prompt without fluff');
  }

  const weaknesses = Array.from(weaknessesSet);
  if (weaknesses.length === 0) {
    if (technical_score < 75) weaknesses.push('Deepen domain specific technical knowledge');
    if (sumResult / count < 70) weaknesses.push('Include more quantifiable metrics in STAR Result statements');
  }

  const recommendations: string[] = [];
  if (technical_score < 75) {
    recommendations.push(`Review core domain principles for ${session?.target_role || 'your target role'}.`);
  }
  if (communication_score < 75) {
    recommendations.push('Practice structuring answers using the STAR Method (Situation, Task, Action, Result).');
  }
  if (problem_solving_score < 75) {
    recommendations.push('Elaborate on edge-case handling and implementation trade-offs.');
  }
  recommendations.push('Schedule a follow-up practice interview targeting identified skill gaps.');

  const skill_performance: Array<{
    skill_name: string;
    score: number;
    status: 'Strong' | 'Developing' | 'Needs Improvement';
    category: string;
  }> = [];

  skillScoreMap.forEach((val, key) => {
    const avg = Math.round(val.total / val.count);
    let status: 'Strong' | 'Developing' | 'Needs Improvement' = 'Developing';
    if (avg >= 80) status = 'Strong';
    else if (avg < 60) status = 'Needs Improvement';

    skill_performance.push({
      skill_name: key,
      score: avg,
      status,
      category: key,
    });
  });

  if (skill_performance.length === 0) {
    skill_performance.push({
      skill_name: session?.target_role || 'Technical Competency',
      score: overall_score,
      status: overall_score >= 80 ? 'Strong' : overall_score >= 60 ? 'Developing' : 'Needs Improvement',
      category: 'Core',
    });
  }

  return {
    id: `rep-${sessionId}`,
    session_id: sessionId,
    user_id: userId,
    target_role: session?.target_role || profile?.target_role || 'Professional',
    academic_branch: profile?.academic_stream || profile?.department || 'Engineering',
    overall_score,
    technical_score,
    communication_score,
    relevance_score,
    clarity_score,
    structure_score,
    problem_solving_score,
    role_alignment_score,
    total_questions: totalQuestions,
    answered_questions: answeredQuestions,
    strengths,
    weaknesses,
    recommendations,
    skill_performance,
    created_at: new Date().toISOString(),
  };
}
