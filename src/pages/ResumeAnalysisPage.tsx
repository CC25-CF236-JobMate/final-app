import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import OverallScoreCard from '../components/analysis/OverallScoreCard';
import ScoreBreakdown from '../components/analysis/ScoreBreakdown';
import AnalysisTabs from '../components/analysis/AnalysisTabs';
import CriticalIssues from '../components/analysis/CriticalIssues';
import Strengths from '../components/analysis/Strengths';
import KeywordAnalysis from "../components/analysis/KeywordAnalysis.tsx";
import LineAnalysis from '../components/analysis/LineAnalysis';
import BenchmarkSection from '../components/analysis/BenchmarkSection';

const ResumeAnalysisPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('Critical Issues');

    return (
        <div className="bg-blue-50 min-h-screen">
            <Navbar isLoggedIn={true} />

            <main className="max-w-6xl mx-auto px-4 py-16">
                <h1 className="text-3xl md:text-5xl font-bold text-center text-gray-900 mb-4">
                    Complete Resume Analysis
                </h1>
                <p className="text-center text-sm text-gray-600 mb-10">
                    Comprehensive breakdown of your resume’s performance across all key metrics
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-10">
                    <OverallScoreCard />
                    <ScoreBreakdown />
                </div>

                <AnalysisTabs activeTab={activeTab} setActiveTab={setActiveTab} />

                <div className="mt-6">
                    {activeTab === 'Critical Issues' && <CriticalIssues />}
                    {activeTab === 'Strengths' && <Strengths />}
                     {activeTab === 'Keywords' && <KeywordAnalysis />}
                     {activeTab === 'Line Analysis' && <LineAnalysis />}
                </div>

                <BenchmarkSection />
            </main>

            <Footer />
        </div>
    );
};

export default ResumeAnalysisPage;
