'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Brain, GraduationCap, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

export default function StudentOnboardingPage() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);

  // Profile Onboarding State
  const [degree, setDegree] = useState('Bachelor of Technology (B.Tech)');
  const [branch, setBranch] = useState('Computer Science & Engineering');
  const [year, setYear] = useState('4');
  const [careerGoal, setCareerGoal] = useState('Full Stack Software Engineer');
  const [primarySkill, setPrimarySkill] = useState('JavaScript');
  const [loading, setLoading] = useState(false);

  const handleFinishOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Update profile in backend
      await fetch('/api/student/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: {
            degree,
            academic_stream: branch,
            department: branch,
            year: parseInt(year, 10),
            career_goal: careerGoal,
            target_role: careerGoal,
            profile_completed: true,
          },
        }),
      });
    } catch {} finally {
      setLoading(false);
      router.push('/student/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 md:p-8 text-slate-100 font-sans">
      <div className="w-full max-w-xl space-y-6">
        {/* Step Progress Bar */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-teal-400">Student Profile Onboarding</span>
            <span className="text-slate-400">Step {currentStep} of 2</span>
          </div>
          <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-teal-500 rounded-full transition-all duration-300" style={{ width: currentStep === 1 ? '50%' : '100%' }} />
          </div>
        </div>

        {/* Step 1: Academic Background */}
        {currentStep === 1 && (
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-2xl">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <GraduationCap className="w-5 h-5 text-teal-400" />
                <span>Academic Stream & Degree</span>
              </h2>
              <p className="text-xs text-slate-400">Specify your academic branch to ground your skill twin and question pools</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Academic Degree / Program</label>
                <input
                  type="text"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Academic Branch / Specialization</label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-teal-500"
                >
                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Ayurvedic Medicine & Surgery (BAMS)">Ayurvedic Medicine & Surgery (BAMS)</option>
                  <option value="Pharmacy & Pharmaceutical Sciences">Pharmacy & Pharmaceutical Sciences</option>
                  <option value="Management & MBA">Management & MBA</option>
                  <option value="Commerce & Finance">Commerce & Finance</option>
                  <option value="Corporate Law & Legal Studies">Corporate Law & Legal Studies</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Current Academic Year</label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-teal-500"
                >
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year / Final Year</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => setCurrentStep(2)}
              className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center space-x-2"
            >
              <span>Next: Career Goals</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Career Goals */}
        {currentStep === 2 && (
          <form onSubmit={handleFinishOnboarding} className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-2xl">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-teal-400" />
                <span>Target Career Goal & Skills</span>
              </h2>
              <p className="text-xs text-slate-400">Define your target position for personalized job matching and AI mock interviews</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Target Career Goal / Role</label>
                <input
                  type="text"
                  required
                  value={careerGoal}
                  onChange={(e) => setCareerGoal(e.target.value)}
                  placeholder="e.g. Full Stack Developer, Data Analyst"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Primary Core Skill</label>
                <input
                  type="text"
                  required
                  value={primarySkill}
                  onChange={(e) => setPrimarySkill(e.target.value)}
                  placeholder="e.g. JavaScript, Python, SolidWorks"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="py-3 px-5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                {loading ? <span>Finalizing Profile...</span> : <span>Complete Profile & Go to Dashboard</span>}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
