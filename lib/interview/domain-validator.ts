const MEDICAL_KEYWORDS = [
  'ayurveda',
  'ayurvedic',
  'pharmacovigilance',
  'panchakarma',
  'hptlc',
  'clinical research',
  'pharmacology',
  'herbal',
  'bams',
  'botanical',
  'clinical trial',
  'drug standardization',
  'crf documentation',
  'phytochemical',
];

const UNIVERSAL_TRANSFERABLE_SKILLS = [
  'communication',
  'leadership',
  'teamwork',
  'problem solving',
  'conflict resolution',
  'time management',
  'professionalism',
  'critical thinking',
  'adaptability',
  'work ethic',
  'project management',
];

export function isQuestionDomainValid(params: {
  questionText: string;
  academicBranch?: string;
  targetRole?: string;
  studentSkills?: string[];
}): boolean {
  const { questionText, academicBranch = '', targetRole = '', studentSkills = [] } = params;
  const lowerQ = questionText.toLowerCase();
  const lowerBranch = academicBranch.toLowerCase();
  const lowerRole = targetRole.toLowerCase();
  const lowerSkills = studentSkills.map((s) => s.toLowerCase());

  // Check if student profile genuinely belongs to Medical / AYUSH / Pharmacy / Health domain
  const isMedicalProfile =
    lowerBranch.includes('ayurveda') ||
    lowerBranch.includes('medical') ||
    lowerBranch.includes('pharmacy') ||
    lowerBranch.includes('healthcare') ||
    lowerBranch.includes('nursing') ||
    lowerBranch.includes('bams') ||
    lowerRole.includes('clinical') ||
    lowerRole.includes('pharmac') ||
    lowerRole.includes('ayurved') ||
    lowerSkills.some((s) => MEDICAL_KEYWORDS.some((mk) => s.includes(mk)));

  // If student is NOT a medical profile, question MUST NOT contain medical/AYUSH keywords
  if (!isMedicalProfile) {
    const hasMedicalKeyword = MEDICAL_KEYWORDS.some((mk) => lowerQ.includes(mk));
    if (hasMedicalKeyword) {
      return false;
    }
  }

  return true;
}

export function filterDomainValidQuestions(params: {
  questions: any[];
  academicBranch?: string;
  targetRole?: string;
  studentSkills?: string[];
}): any[] {
  const { questions, academicBranch, targetRole, studentSkills } = params;
  return questions.filter((q) =>
    isQuestionDomainValid({
      questionText: typeof q === 'string' ? q : q.question || '',
      academicBranch,
      targetRole,
      studentSkills,
    })
  );
}
