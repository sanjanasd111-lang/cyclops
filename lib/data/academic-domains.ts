export interface AcademicDepartment {
  id: string;
  name: string;
  streamId: string;
  streamName: string;
  popularDegrees: string[];
  suggestedSkills: string[];
  suggestedRoles: string[];
}

export interface AcademicStream {
  id: string;
  name: string;
  description: string;
  departments: AcademicDepartment[];
}

export const UNIVERSAL_ACADEMIC_STREAMS: AcademicStream[] = [
  {
    id: 'eng',
    name: 'Engineering & Technology',
    description: 'Computer science, mechanical, electrical, electronics, civil, biotech, AI, and related engineering disciplines.',
    departments: [
      {
        id: 'eng-cs',
        name: 'Computer Science & Engineering',
        streamId: 'eng',
        streamName: 'Engineering & Technology',
        popularDegrees: ['B.Tech', 'M.Tech', 'B.E.', 'B.Sc Computer Science', 'BCA', 'MCA'],
        suggestedSkills: ['Python', 'Java', 'C++', 'React', 'Node.js', 'SQL', 'MongoDB', 'Machine Learning', 'Data Structures & Algorithms', 'Cloud Computing'],
        suggestedRoles: ['Software Engineer', 'Full Stack Developer', 'Data Analyst', 'ML Engineer', 'Backend Developer'],
      },
      {
        id: 'eng-it',
        name: 'Information Technology',
        streamId: 'eng',
        streamName: 'Engineering & Technology',
        popularDegrees: ['B.Tech IT', 'B.Sc IT', 'MCA'],
        suggestedSkills: ['Python', 'Web Development', 'SQL', 'Cybersecurity', 'Cloud Computing', 'Networking'],
        suggestedRoles: ['IT Associate', 'Cloud Analyst', 'Cybersecurity Analyst', 'DevOps Engineer'],
      },
      {
        id: 'eng-ai',
        name: 'Artificial Intelligence & Machine Learning',
        streamId: 'eng',
        streamName: 'Engineering & Technology',
        popularDegrees: ['B.Tech AI & ML', 'M.Tech AI'],
        suggestedSkills: ['Python', 'PyTorch', 'TensorFlow', 'Machine Learning', 'Deep Learning', 'Data Analysis', 'SQL'],
        suggestedRoles: ['ML Engineer', 'AI Research Intern', 'Data Scientist'],
      },
      {
        id: 'eng-ds',
        name: 'Data Science & Analytics',
        streamId: 'eng',
        streamName: 'Engineering & Technology',
        popularDegrees: ['B.Tech Data Science', 'B.Sc Data Science', 'M.Sc Data Science'],
        suggestedSkills: ['Python', 'R', 'SQL', 'Power BI', 'Tableau', 'Statistics', 'Data Mining'],
        suggestedRoles: ['Data Analyst', 'Business Analytics Associate', 'Data Scientist'],
      },
      {
        id: 'eng-mech',
        name: 'Mechanical Engineering',
        streamId: 'eng',
        streamName: 'Engineering & Technology',
        popularDegrees: ['B.Tech Mechanical', 'M.Tech Mechanical', 'B.E.'],
        suggestedSkills: ['AutoCAD', 'SolidWorks', 'CATIA', 'Thermodynamics', 'CAD/CAM', 'Manufacturing Processes', 'Mechanical Design'],
        suggestedRoles: ['Mechanical Design Engineer', 'CAD Engineer', 'Manufacturing Engineering Intern', 'Product Design Engineer'],
      },
      {
        id: 'eng-civil',
        name: 'Civil Engineering',
        streamId: 'eng',
        streamName: 'Engineering & Technology',
        popularDegrees: ['B.Tech Civil', 'M.Tech Structural'],
        suggestedSkills: ['AutoCAD', 'Revit', 'STAAD.Pro', 'Structural Analysis', 'Construction Management', 'Surveying'],
        suggestedRoles: ['Structural Engineer', 'Site Engineer', 'Civil Design Analyst', 'Construction Management Associate'],
      },
      {
        id: 'eng-ece',
        name: 'Electronics & Communication Engineering',
        streamId: 'eng',
        streamName: 'Engineering & Technology',
        popularDegrees: ['B.Tech ECE', 'M.Tech VLSI'],
        suggestedSkills: ['Embedded Systems', 'Verilog', 'MATLAB', 'PCB Design', 'VLSI', 'Microcontrollers', 'C/C++'],
        suggestedRoles: ['Embedded Systems Engineer', 'VLSI Design Associate', 'Hardware Engineer'],
      },
      {
        id: 'eng-eee',
        name: 'Electrical & Electronics Engineering',
        streamId: 'eng',
        streamName: 'Engineering & Technology',
        popularDegrees: ['B.Tech EEE', 'M.Tech Power Systems'],
        suggestedSkills: ['Power Systems', 'Electrical Machines', 'MATLAB', 'PLC & SCADA', 'Circuit Design'],
        suggestedRoles: ['Electrical Engineer', 'Power Systems Intern', 'Control Systems Analyst'],
      },
      {
        id: 'eng-biotech',
        name: 'Biotechnology & Biomedical',
        streamId: 'eng',
        streamName: 'Engineering & Technology',
        popularDegrees: ['B.Tech Biotechnology', 'B.Tech Biomedical', 'M.Sc Biotech'],
        suggestedSkills: ['Bioinformatics', 'Bioprocess Engineering', 'Molecular Biology', 'Medical Instrumentation', 'Python'],
        suggestedRoles: ['Biotech Research Assistant', 'Biomedical Engineer', 'Bioinformatics Analyst'],
      },
    ],
  },
  {
    id: 'sci',
    name: 'Science & Mathematics',
    description: 'Physics, chemistry, mathematics, statistics, life sciences, and biological sciences.',
    departments: [
      {
        id: 'sci-math',
        name: 'Mathematics & Statistics',
        streamId: 'sci',
        streamName: 'Science & Mathematics',
        popularDegrees: ['B.Sc Mathematics', 'B.Sc Statistics', 'M.Sc Applied Math'],
        suggestedSkills: ['Python', 'R', 'Statistics', 'Probability', 'SQL', 'Quantitative Analysis', 'Data Analysis'],
        suggestedRoles: ['Data Analyst', 'Statistical Analyst', 'Risk Analyst', 'Quantitative Intern'],
      },
      {
        id: 'sci-chem',
        name: 'Chemistry & Biochemistry',
        streamId: 'sci',
        streamName: 'Science & Mathematics',
        popularDegrees: ['B.Sc Chemistry', 'M.Sc Chemistry', 'B.Sc Biochemistry'],
        suggestedSkills: ['Analytical Chemistry', 'HPLC', 'Spectroscopy', 'Organic Synthesis', 'Quality Control', 'Laboratory Safety'],
        suggestedRoles: ['QC Analyst', 'Research Assistant', 'Analytical Chemist'],
      },
      {
        id: 'sci-bio',
        name: 'Biological Sciences & Life Sciences',
        streamId: 'sci',
        streamName: 'Science & Mathematics',
        popularDegrees: ['B.Sc Life Sciences', 'M.Sc Microbiology', 'B.Sc Zoology'],
        suggestedSkills: ['Microbiology', 'Cell Biology', 'Research Methodology', 'Scientific Writing', 'Lab Techniques'],
        suggestedRoles: ['Laboratory Analyst', 'Research Associate', 'Microbiologist'],
      },
    ],
  },
  {
    id: 'med',
    name: 'Medical, AYUSH & Healthcare',
    description: 'Medicine, AYUSH systems (Ayurveda, Unani, Siddha, Homeopathy), Pharmacy, Nursing, Public Health, and Clinical Research.',
    departments: [
      {
        id: 'med-ayush',
        name: 'Ayurvedic Medicine & Surgery (AYUSH)',
        streamId: 'med',
        streamName: 'Medical, AYUSH & Healthcare',
        popularDegrees: ['BAMS', 'MD (Ayurveda)', 'MS (Ayurveda)', 'Diploma in Ayurvedic Pharmacy'],
        suggestedSkills: ['Clinical Research', 'Ayurvedic Pharmacology', 'Research Methodology', 'Scientific Writing', 'Drug Standardization', 'Biostatistics'],
        suggestedRoles: ['Clinical Research Associate', 'Ayurvedic Pharmacologist', 'Pharmacovigilance Officer', 'Integrative Healthcare Consultant'],
      },
      {
        id: 'med-pharm',
        name: 'Pharmacy & Pharmaceutical Sciences',
        streamId: 'med',
        streamName: 'Medical, AYUSH & Healthcare',
        popularDegrees: ['B.Pharm', 'M.Pharm', 'Pharm.D'],
        suggestedSkills: ['Pharmacology', 'Drug Formulations', 'Pharmacovigilance', 'Clinical Research', 'Regulatory Affairs'],
        suggestedRoles: ['Pharmacovigilance Associate', 'Regulatory Affairs Specialist', 'Clinical Research Coordinator', 'Formulation Scientist'],
      },
      {
        id: 'med-clin',
        name: 'Clinical Research & Public Health',
        streamId: 'med',
        streamName: 'Medical, AYUSH & Healthcare',
        popularDegrees: ['M.Sc Clinical Research', 'MPH (Master of Public Health)', 'B.Sc Clinical Research'],
        suggestedSkills: ['Clinical Trial Management', 'GCP Guidelines', 'Biostatistics', 'Epidemiology', 'Regulatory Knowledge'],
        suggestedRoles: ['Clinical Research Associate', 'Epidemiology Analyst', 'Public Health Officer'],
      },
      {
        id: 'med-nurs',
        name: 'Nursing & Allied Healthcare',
        streamId: 'med',
        streamName: 'Medical, AYUSH & Healthcare',
        popularDegrees: ['B.Sc Nursing', 'MPT', 'BPT', 'B.Sc MLT'],
        suggestedSkills: ['Patient Care Management', 'Clinical Assessment', 'Healthcare Administration', 'Emergency Protocols'],
        suggestedRoles: ['Clinical Coordinator', 'Healthcare Administrator', 'Physiotherapist Associate'],
      },
    ],
  },
  {
    id: 'comm',
    name: 'Commerce, Finance & Management',
    description: 'Accounting, finance, economics, business administration, marketing, HR, and analytics.',
    departments: [
      {
        id: 'comm-fin',
        name: 'Accounting & Finance',
        streamId: 'comm',
        streamName: 'Commerce, Finance & Management',
        popularDegrees: ['B.Com', 'M.Com', 'B.Com (Hons)', 'CA Inter', 'CFA'],
        suggestedSkills: ['Accounting', 'Financial Analysis', 'Tally Prime', 'Advanced Excel', 'Taxation', 'Auditing', 'Financial Modeling'],
        suggestedRoles: ['Financial Analyst', 'Accounting Associate', 'Audit Associate', 'Tax Analyst'],
      },
      {
        id: 'comm-mgmt',
        name: 'Business Administration & Management',
        streamId: 'comm',
        streamName: 'Commerce, Finance & Management',
        popularDegrees: ['BBA', 'MBA', 'BMS'],
        suggestedSkills: ['Business Strategy', 'Project Management', 'Market Research', 'Advanced Excel', 'Communication', 'Leadership'],
        suggestedRoles: ['Business Analyst', 'Operations Associate', 'Management Trainee', 'Product Coordinator'],
      },
      {
        id: 'comm-mktg',
        name: 'Marketing & Digital Business',
        streamId: 'comm',
        streamName: 'Commerce, Finance & Management',
        popularDegrees: ['BBA Marketing', 'MBA Marketing', 'B.Com Digital Marketing'],
        suggestedSkills: ['Digital Marketing', 'SEO / SEM', 'Content Strategy', 'Google Analytics', 'Social Media Marketing', 'Copywriting'],
        suggestedRoles: ['Marketing Analyst', 'Digital Marketing Specialist', 'Content Strategist', 'Brand Associate'],
      },
      {
        id: 'comm-hr',
        name: 'Human Resources & Talent Management',
        streamId: 'comm',
        streamName: 'Commerce, Finance & Management',
        popularDegrees: ['BBA HR', 'MBA HR'],
        suggestedSkills: ['Talent Acquisition', 'HR Analytics', 'Employee Engagement', 'Labor Law Compliance', 'Communication'],
        suggestedRoles: ['HR Executive', 'Talent Acquisition Associate', 'People Analytics Intern'],
      },
    ],
  },
  {
    id: 'arts',
    name: 'Arts, Humanities & Social Sciences',
    description: 'Psychology, sociology, journalism, political science, literature, and media.',
    departments: [
      {
        id: 'arts-psych',
        name: 'Psychology & Behavioral Sciences',
        streamId: 'arts',
        streamName: 'Arts, Humanities & Social Sciences',
        popularDegrees: ['B.A. Psychology', 'M.A. Applied Psychology', 'B.Sc Psychology'],
        suggestedSkills: ['Research Methodology', 'Psychometrics', 'Counseling Techniques', 'Statistical Analysis (SPSS)', 'Behavioral Analysis'],
        suggestedRoles: ['Psychology Research Assistant', 'Behavioral Analyst', 'Counseling Assistant', 'HR Analytics Associate'],
      },
      {
        id: 'arts-jour',
        name: 'Journalism & Mass Communication',
        streamId: 'arts',
        streamName: 'Arts, Humanities & Social Sciences',
        popularDegrees: ['BJMC', 'MJMC', 'B.A. Mass Comm'],
        suggestedSkills: ['Scientific Writing', 'Content Editing', 'Media Relations', 'Digital Publishing', 'Investigative Research'],
        suggestedRoles: ['Content Specialist', 'Media Associate', 'Technical Writer', 'PR Assistant'],
      },
      {
        id: 'arts-soc',
        name: 'Sociology & Political Science',
        streamId: 'arts',
        streamName: 'Arts, Humanities & Social Sciences',
        popularDegrees: ['B.A. Sociology', 'B.A. Political Science', 'M.A. Public Policy'],
        suggestedSkills: ['Policy Research', 'Qualitative Analysis', 'Survey Design', 'Report Writing', 'Public Policy'],
        suggestedRoles: ['Policy Research Assistant', 'Social Impact Analyst', 'NGO Program Associate'],
      },
    ],
  },
  {
    id: 'law',
    name: 'Law & Legal Studies',
    description: 'Corporate law, cyber law, intellectual property, constitutional law, and legal research.',
    departments: [
      {
        id: 'law-corp',
        name: 'Corporate & Cyber Law',
        streamId: 'law',
        streamName: 'Law & Legal Studies',
        popularDegrees: ['BA LL.B', 'BBA LL.B', 'LL.M Corporate Law'],
        suggestedSkills: ['Legal Research', 'Contract Drafting', 'Corporate Compliance', 'Cyber Law', 'Intellectual Property', 'Due Diligence'],
        suggestedRoles: ['Corporate Legal Associate', 'Legal Research Assistant', 'Compliance Associate', 'IP Legal Analyst'],
      },
    ],
  },
  {
    id: 'des',
    name: 'Design, Media & Creative Arts',
    description: 'UI/UX design, graphic design, product design, animation, and visual communication.',
    departments: [
      {
        id: 'des-uiux',
        name: 'UI/UX & Digital Product Design',
        streamId: 'des',
        streamName: 'Design, Media & Creative Arts',
        popularDegrees: ['B.Des', 'M.Des UI/UX', 'B.Sc Visual Communication'],
        suggestedSkills: ['Figma', 'User Research', 'Wireframing & Prototyping', 'Design Systems', 'Usability Testing', 'Visual Design'],
        suggestedRoles: ['UI/UX Designer', 'Product Designer', 'Interaction Design Intern'],
      },
      {
        id: 'des-graph',
        name: 'Graphic Design & Visual Communication',
        streamId: 'des',
        streamName: 'Design, Media & Creative Arts',
        popularDegrees: ['B.FA', 'B.Des Graphic Design'],
        suggestedSkills: ['Adobe Photoshop', 'Adobe Illustrator', 'Branding', 'Typography', 'Visual Storytelling'],
        suggestedRoles: ['Graphic Designer', 'Brand Designer', 'Visual Content Creator'],
      },
    ],
  },
  {
    id: 'arch',
    name: 'Architecture & Urban Planning',
    description: 'Architecture, interior architecture, landscape design, and urban planning.',
    departments: [
      {
        id: 'arch-main',
        name: 'Architecture & Construction Management',
        streamId: 'arch',
        streamName: 'Architecture & Urban Planning',
        popularDegrees: ['B.Arch', 'M.Arch', 'B.Plan'],
        suggestedSkills: ['AutoCAD', 'Revit Architectural', 'SketchUp', '3D Visualization', 'Building Codes', 'Sustainable Design'],
        suggestedRoles: ['Architectural Assistant', 'Urban Planning Intern', 'Interior Architect Associate'],
      },
    ],
  },
  {
    id: 'agri',
    name: 'Agriculture & Environmental Sciences',
    description: 'Agronomy, food technology, horticulture, forestry, and environmental management.',
    departments: [
      {
        id: 'agri-main',
        name: 'Agriculture & Food Technology',
        streamId: 'agri',
        streamName: 'Agriculture & Environmental Sciences',
        popularDegrees: ['B.Sc Agriculture', 'B.Tech Food Tech', 'M.Sc Agronomy'],
        suggestedSkills: ['Crop Science', 'Food Quality Analysis', 'Soil Testing', 'Agri-Business Management', 'Precision Farming'],
        suggestedRoles: ['Agronomist Associate', 'Food Quality Analyst', 'Agri-Tech Specialist'],
      },
    ],
  },
];

export function getAllAcademicStreams(): AcademicStream[] {
  return UNIVERSAL_ACADEMIC_STREAMS;
}

export function getDepartmentById(deptId: string): AcademicDepartment | undefined {
  for (const stream of UNIVERSAL_ACADEMIC_STREAMS) {
    const found = stream.departments.find((d) => d.id === deptId);
    if (found) return found;
  }
  return undefined;
}

export function findDepartmentByName(name: string): AcademicDepartment | undefined {
  const query = name.toLowerCase();
  for (const stream of UNIVERSAL_ACADEMIC_STREAMS) {
    const found = stream.departments.find((d) => d.name.toLowerCase().includes(query) || query.includes(d.name.toLowerCase()));
    if (found) return found;
  }
  return undefined;
}

export function getSuggestedSkillsForDepartment(deptNameOrId: string): string[] {
  const dept = getDepartmentById(deptNameOrId) || findDepartmentByName(deptNameOrId);
  if (dept) return dept.suggestedSkills;
  return ['Communication', 'Research Methodology', 'Data Analysis', 'Project Management', 'Problem Solving'];
}
