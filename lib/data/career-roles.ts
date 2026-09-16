export interface CareerRoleRequirement {
  role_id: string;
  role_name: string;
  category: string;
  academic_domains: string[];
  description: string;
  required_skills: Array<{
    skill_id: string;
    skill_name: string;
    min_proficiency: number;
    weight: number; // 1 - 10
    importance: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  }>;
  transferable_from?: string[];
}

export interface CentralizedSkill {
  id: string;
  name: string;
  category: string;
  is_active: boolean;
}

export const UNIVERSAL_SKILL_TAXONOMY: CentralizedSkill[] = [
  { id: 's01', name: 'Clinical Research', category: 'Clinical', is_active: true },
  { id: 's03', name: 'Ayurvedic Pharmacology', category: 'Pharmacology', is_active: true },
  { id: 's02', name: 'Research Methodology', category: 'Clinical', is_active: true },
  { id: 's04', name: 'Drug Standardization', category: 'Pharmacology', is_active: true },
  { id: 's08', name: 'Biostatistics', category: 'Analytics', is_active: true },
  { id: 's12', name: 'Scientific Writing', category: 'Communication', is_active: true },
  { id: 's15', name: 'Data Analysis', category: 'Analytics', is_active: true },
  { id: 's-cs-01', name: 'Python', category: 'Programming', is_active: true },
  { id: 's-cs-02', name: 'React', category: 'Web Development', is_active: true },
  { id: 's-cs-03', name: 'SQL', category: 'Databases', is_active: true },
  { id: 's-cs-05', name: 'Machine Learning', category: 'AI & Data', is_active: true },
  { id: 's-mech-01', name: 'SolidWorks', category: 'CAD & Design', is_active: true },
  { id: 's-mech-02', name: 'AutoCAD', category: 'CAD & Design', is_active: true },
  { id: 's-comm-01', name: 'Financial Analysis', category: 'Finance', is_active: true },
  { id: 's-comm-04', name: 'Advanced Excel', category: 'Analytics', is_active: true },
  { id: 's-law-01', name: 'Legal Research', category: 'Legal', is_active: true },
  { id: 's-law-02', name: 'Contract Drafting', category: 'Legal', is_active: true },
  { id: 's-ayur-01', name: 'Pharmacovigilance', category: 'Drug Safety & Clinical', is_active: true },
  { id: 's-ayur-02', name: 'Herbal Quality Control', category: 'Pharmacology', is_active: true },
  { id: 's-ayur-03', name: 'Panchakarma Protocol Design', category: 'Clinical Therapeutics', is_active: true },
  { id: 's-ayur-04', name: 'Ayurvedic Clinical Trials', category: 'Clinical Research', is_active: true },
  { id: 's-ayur-05', name: 'Herbal Drug Formulation', category: 'Pharmacology', is_active: true },
];

export const CENTRALIZED_CAREER_ROLES: CareerRoleRequirement[] = [
  // 1. COMPUTER SCIENCE & IT ROLES
  {
    role_id: 'cr-cs-01',
    role_name: 'Software Engineer',
    category: 'Engineering & Technology',
    academic_domains: ['Engineering & Technology', 'Computer Science & Engineering', 'Information Technology'],
    description: 'Builds production web applications, designs API architectures, and solves algorithmic problems.',
    required_skills: [
      { skill_id: 's-cs-01', skill_name: 'Python', min_proficiency: 75, weight: 10, importance: 'CRITICAL' },
      { skill_id: 's-cs-02', skill_name: 'React', min_proficiency: 70, weight: 8, importance: 'HIGH' },
      { skill_id: 's-cs-03', skill_name: 'SQL', min_proficiency: 70, weight: 8, importance: 'HIGH' },
      { skill_id: 's-cs-04', skill_name: 'Data Structures & Algorithms', min_proficiency: 75, weight: 9, importance: 'CRITICAL' },
    ],
  },
  {
    role_id: 'cr-cs-02',
    role_name: 'Data Analyst',
    category: 'Analytics & Data',
    academic_domains: ['Engineering & Technology', 'Science & Mathematics', 'Commerce, Finance & Management'],
    description: 'Analyzes business and operational data, creates dashboard insights, and performs statistical testing.',
    required_skills: [
      { skill_id: 's-cs-01', skill_name: 'Python', min_proficiency: 75, weight: 10, importance: 'CRITICAL' },
      { skill_id: 's-cs-03', skill_name: 'SQL', min_proficiency: 75, weight: 9, importance: 'CRITICAL' },
      { skill_id: 's-stat-01', skill_name: 'Statistics', min_proficiency: 70, weight: 8, importance: 'HIGH' },
      { skill_id: 's-comm-04', skill_name: 'Advanced Excel', min_proficiency: 70, weight: 7, importance: 'MEDIUM' },
    ],
    transferable_from: ['Mechanical Engineering', 'Commerce', 'Mathematics', 'Psychology'],
  },
  {
    role_id: 'cr-cs-03',
    role_name: 'ML Engineer',
    category: 'Artificial Intelligence',
    academic_domains: ['Engineering & Technology', 'Science & Mathematics'],
    description: 'Trains predictive models, builds neural networks, and deploys machine learning pipelines.',
    required_skills: [
      { skill_id: 's-cs-01', skill_name: 'Python', min_proficiency: 80, weight: 10, importance: 'CRITICAL' },
      { skill_id: 's-cs-05', skill_name: 'Machine Learning', min_proficiency: 75, weight: 10, importance: 'CRITICAL' },
      { skill_id: 's-stat-01', skill_name: 'Statistics', min_proficiency: 75, weight: 8, importance: 'HIGH' },
      { skill_id: 's-cs-03', skill_name: 'SQL', min_proficiency: 65, weight: 6, importance: 'MEDIUM' },
    ],
  },

  // 2. MECHANICAL & HARDWARE ROLES
  {
    role_id: 'cr-mech-01',
    role_name: 'Mechanical Design Engineer',
    category: 'Mechanical Engineering',
    academic_domains: ['Engineering & Technology', 'Mechanical Engineering'],
    description: 'Designs mechanical components, performs CAD 3D modeling, and analyzes thermal/stress tolerance.',
    required_skills: [
      { skill_id: 's-mech-01', skill_name: 'SolidWorks', min_proficiency: 75, weight: 10, importance: 'CRITICAL' },
      { skill_id: 's-mech-02', skill_name: 'AutoCAD', min_proficiency: 75, weight: 9, importance: 'CRITICAL' },
      { skill_id: 's-mech-03', skill_name: 'Thermodynamics', min_proficiency: 70, weight: 7, importance: 'MEDIUM' },
      { skill_id: 's-mech-04', skill_name: 'Mechanical Design', min_proficiency: 70, weight: 8, importance: 'HIGH' },
    ],
  },

  // 3. COMMERCE & FINANCE ROLES
  {
    role_id: 'cr-comm-01',
    role_name: 'Financial Analyst',
    category: 'Commerce & Finance',
    academic_domains: ['Commerce, Finance & Management', 'Science & Mathematics'],
    description: 'Evaluates financial statements, builds forecasting models, and performs corporate valuation.',
    required_skills: [
      { skill_id: 's-comm-01', skill_name: 'Financial Analysis', min_proficiency: 75, weight: 10, importance: 'CRITICAL' },
      { skill_id: 's-comm-02', skill_name: 'Accounting', min_proficiency: 75, weight: 9, importance: 'CRITICAL' },
      { skill_id: 's-comm-04', skill_name: 'Advanced Excel', min_proficiency: 80, weight: 9, importance: 'CRITICAL' },
      { skill_id: 's-comm-03', skill_name: 'Tally Prime', min_proficiency: 65, weight: 6, importance: 'MEDIUM' },
    ],
  },
  {
    role_id: 'cr-comm-02',
    role_name: 'Business Analyst',
    category: 'Management & Operations',
    academic_domains: ['Commerce, Finance & Management', 'Engineering & Technology'],
    description: 'Bridges business requirements with technology solutions, maps workflows, and analyzes KPIs.',
    required_skills: [
      { skill_id: 's-comm-05', skill_name: 'Business Strategy', min_proficiency: 70, weight: 8, importance: 'HIGH' },
      { skill_id: 's-cs-03', skill_name: 'SQL', min_proficiency: 65, weight: 7, importance: 'MEDIUM' },
      { skill_id: 's-comm-04', skill_name: 'Advanced Excel', min_proficiency: 75, weight: 9, importance: 'CRITICAL' },
      { skill_id: 's-gen-01', skill_name: 'Communication', min_proficiency: 75, weight: 8, importance: 'HIGH' },
    ],
  },

  // 4. LAW ROLES
  {
    role_id: 'cr-law-01',
    role_name: 'Corporate Legal Associate',
    category: 'Law & Legal Studies',
    academic_domains: ['Law & Legal Studies'],
    description: 'Drafts commercial contracts, performs legal due diligence, and manages regulatory compliance.',
    required_skills: [
      { skill_id: 's-law-01', skill_name: 'Legal Research', min_proficiency: 80, weight: 10, importance: 'CRITICAL' },
      { skill_id: 's-law-02', skill_name: 'Contract Drafting', min_proficiency: 75, weight: 9, importance: 'CRITICAL' },
      { skill_id: 's-law-03', skill_name: 'Corporate Compliance', min_proficiency: 70, weight: 8, importance: 'HIGH' },
    ],
  },

  // 5. PSYCHOLOGY ROLES
  {
    role_id: 'cr-arts-01',
    role_name: 'Psychology Research Assistant',
    category: 'Arts & Social Sciences',
    academic_domains: ['Arts, Humanities & Social Sciences', 'Psychology & Behavioral Sciences'],
    description: 'Conducts psychometric assessments, designs survey studies, and analyzes behavioral data.',
    required_skills: [
      { skill_id: 's-arts-01', skill_name: 'Research Methodology', min_proficiency: 75, weight: 10, importance: 'CRITICAL' },
      { skill_id: 's-arts-02', skill_name: 'Psychometrics', min_proficiency: 70, weight: 8, importance: 'HIGH' },
      { skill_id: 's-stat-01', skill_name: 'Statistics', min_proficiency: 70, weight: 8, importance: 'HIGH' },
    ],
  },

  // 6. HEALTHCARE & AYUSH ROLES
  {
    role_id: 'cr-med-01',
    role_name: 'Clinical Research Associate',
    category: 'Medical & Healthcare',
    academic_domains: ['Medical, AYUSH & Healthcare', 'Science & Mathematics'],
    description: 'Monitors clinical trials, standardizes trial documentation (CRF), and enforces GCP compliance.',
    required_skills: [
      { skill_id: 's01', skill_name: 'Clinical Research', min_proficiency: 75, weight: 10, importance: 'CRITICAL' },
      { skill_id: 's02', skill_name: 'Research Methodology', min_proficiency: 70, weight: 8, importance: 'HIGH' },
      { skill_id: 's08', skill_name: 'Biostatistics', min_proficiency: 70, weight: 8, importance: 'HIGH' },
      { skill_id: 's12', skill_name: 'Scientific Writing', min_proficiency: 70, weight: 7, importance: 'MEDIUM' },
    ],
  },
  {
    role_id: 'cr-med-02',
    role_name: 'Ayurvedic Pharmacologist',
    category: 'Medical & Healthcare',
    academic_domains: ['Medical, AYUSH & Healthcare', 'Ayurvedic Medicine & Surgery (AYUSH)'],
    description: 'Specializes in Dravyaguna, herbal extract bioactivity, and phytopharmacological testing.',
    required_skills: [
      { skill_id: 's03', skill_name: 'Ayurvedic Pharmacology', min_proficiency: 80, weight: 10, importance: 'CRITICAL' },
      { skill_id: 's04', skill_name: 'Drug Standardization', min_proficiency: 75, weight: 9, importance: 'CRITICAL' },
      { skill_id: 's05', skill_name: 'Quality Control', min_proficiency: 70, weight: 7, importance: 'MEDIUM' },
    ],
  },

  // 7. DESIGN ROLES
  {
    role_id: 'cr-des-01',
    role_name: 'UI/UX Designer',
    category: 'Design & Creative Arts',
    academic_domains: ['Design, Media & Creative Arts', 'Engineering & Technology'],
    description: 'Designs intuitive user interfaces, conducts user research, and builds Figma interactive prototypes.',
    required_skills: [
      { skill_id: 's-des-01', skill_name: 'Figma', min_proficiency: 80, weight: 10, importance: 'CRITICAL' },
      { skill_id: 's-des-02', skill_name: 'User Research', min_proficiency: 75, weight: 8, importance: 'HIGH' },
      { skill_id: 's-des-03', skill_name: 'Wireframing & Prototyping', min_proficiency: 75, weight: 9, importance: 'CRITICAL' },
    ],
  },
];

export function getRoleRequirement(roleName: string): CareerRoleRequirement {
  const found = CENTRALIZED_CAREER_ROLES.find(
    (r) => r.role_name.toLowerCase() === roleName.toLowerCase() || roleName.toLowerCase().includes(r.role_name.toLowerCase())
  );
  return found || CENTRALIZED_CAREER_ROLES[0];
}

export function getRolesForDomain(domainOrStream: string): CareerRoleRequirement[] {
  const query = domainOrStream.toLowerCase();
  return CENTRALIZED_CAREER_ROLES.filter((r) =>
    r.academic_domains.some((d) => d.toLowerCase().includes(query) || query.includes(d.toLowerCase()))
  );
}
