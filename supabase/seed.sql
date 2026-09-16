-- AYUSHSetu AI Seed Data
-- SIH Problem Statement 26044

-- Seed Core AYUSH Skills Taxonomy
INSERT INTO skills (id, name, category, description) VALUES
  ('s01', 'Clinical Research', 'Clinical', 'Methodology and design of clinical trials in AYUSH and integrative healthcare'),
  ('s02', 'Research Methodology', 'Clinical', 'Scientific protocol development, literature review, and experimental design'),
  ('s03', 'Ayurvedic Pharmacology', 'Ayurveda', 'Dravyaguna, herbal drug formulation, extraction, and bioactivity analysis'),
  ('s04', 'Drug Standardization', 'Ayurveda', 'HPTLC, HPLC, and physicochemical quality evaluation of herbal formulations'),
  ('s05', 'Quality Control', 'Manufacturing', 'GMP compliance, heavy metal testing, and microbial purity assurance'),
  ('s06', 'Medicinal Plant Research', 'Ayurveda', 'Ethnobotany, herbarium curation, and active phytochemical identification'),
  ('s07', 'Hospital Administration', 'Healthcare', 'Clinical workflow, NABH compliance, and AYUSH hospital management'),
  ('s08', 'Biostatistics', 'Data & Analytics', 'Statistical hypothesis testing, R/Python, SPSS, and clinical data analysis'),
  ('s09', 'Public Health', 'Healthcare', 'Epidemiology, community medicine, and national AYUSH health programs'),
  ('s10', 'Yoga & Wellness', 'Wellness', 'Therapeutic Yoga protocols, stress management, and lifestyle medicine'),
  ('s11', 'Pharmacovigilance', 'Clinical', 'Adverse drug reaction (ADR) reporting and drug safety surveillance'),
  ('s12', 'Scientific Writing', 'Communication', 'Peer-reviewed manuscript preparation, grant writing, and reporting'),
  ('s13', 'Health Informatics', 'Digital Health', 'Electronic Health Records (EHR), ICD-11 AYUSH terminology, and data systems'),
  ('s14', 'Digital Health', 'Digital Health', 'Telemedicine, remote patient monitoring, and digital wellness tools'),
  ('s15', 'AI & Data Analysis', 'Data & Analytics', 'Machine learning applications in drug discovery and diagnostic support'),
  ('s16', 'Communication', 'Soft Skills', 'Patient counseling, stakeholder engagement, and professional presentation'),
  ('s17', 'Leadership', 'Soft Skills', 'Clinical team coordination, project management, and institutional leadership'),
  ('s18', 'Problem Solving', 'Soft Skills', 'Analytical reasoning and diagnostic problem resolution'),
  ('s19', 'Documentation', 'Soft Skills', 'Clinical record keeping, trial case report forms (CRF), and audit trails'),
  ('s20', 'Regulatory Knowledge', 'Regulatory', 'AYUSH drug manufacturing regulations, Drugs & Cosmetics Act, and GCP')
ON CONFLICT (name) DO NOTHING;

-- Seed AIIA Institution
INSERT INTO institutions (id, name, code, type, location, state, website, total_students) VALUES
  ('inst-01', 'All India Institute of Ayurveda (AIIA)', 'AIIA-DEL', 'Autonomous National Institute', 'New Delhi', 'Delhi', 'https://aiia.gov.in', 1240)
ON CONFLICT (code) DO NOTHING;
