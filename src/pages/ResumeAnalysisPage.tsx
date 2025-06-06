import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import OverallScoreCard from '../components/analysis/OverallScoreCard';
import ScoreBreakdown from '../components/analysis/ScoreBreakdown';
import CriticalIssues from '../components/analysis/CriticalIssues';
import Strengths from '../components/analysis/Strengths';
import KeywordAnalysis from "../components/analysis/KeywordAnalysis.tsx";
import LineAnalysis from '../components/analysis/LineAnalysis';
import BenchmarkSection from '../components/analysis/BenchmarkSection';
import { BarChart3, Target, Sparkles, CheckCircle, AlertTriangle } from 'lucide-react';

const ResumeAnalysisPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('Critical Issues');

    const getTabIcon = (tabName: string) => {
        switch (tabName) {
            case 'Critical Issues':
                return <AlertTriangle size={16} className="text-red-600" />;
            case 'Strengths':
                return <CheckCircle size={16} className="text-green-600" />;
            case 'Keywords':
                return <Target size={16} className="text-blue-600" />;
            case 'Line Analysis':
                return <BarChart3 size={16} className="text-purple-600" />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-32 left-20 w-40 h-40 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
                <div className="absolute top-20 right-32 w-36 h-36 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
                <div className="absolute bottom-40 left-1/4 w-32 h-32 bg-green-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-500"></div>
                <div className="absolute bottom-32 right-1/4 w-28 h-28 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-700"></div>
                <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-300"></div>
            </div>

            <Navbar />

            <main className="max-w-6xl mx-auto px-4 py-16 relative z-10">
                {/* Header Section */}
                <section className="text-center mb-16">
                    <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200/50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-sm">
                        <BarChart3 size={14} className="text-blue-600" />
                        <span>Analisis Komprehensif</span>
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent leading-tight mb-4">
                        Complete Resume Analysis
                    </h1>
                    
                    <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200/50 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-sm">
                        <Sparkles size={14} className="text-green-600" />
                        <span>Hasil Analisis Mendalam</span>
                    </div>
                    
                    <p className="text-gray-600 text-sm md:text-base max-w-3xl mx-auto leading-relaxed">
                        Breakdown komprehensif dari performa resume Anda di semua metrik kunci dengan rekomendasi perbaikan yang actionable
                    </p>
                </section>

                {/* Score Cards Section */}
                <section className="mb-12">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="transform hover:scale-105 transition-all duration-300">
                            <OverallScoreCard />
                        </div>
                        <div className="transform hover:scale-105 transition-all duration-300">
                            <ScoreBreakdown />
                        </div>
                    </div>
                </section>

                {/* Analysis Tabs Section */}
                <section className="mb-8">
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-blue-900/10 p-8 border border-gray-200/50">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200/50 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-sm">
                                <Target size={14} className="text-purple-600" />
                                <span>Analisis Detail</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-blue-900 bg-clip-text text-transparent leading-tight">
                                Breakdown Analisis Resume
                            </h2>
                            <p className="text-gray-600 text-sm mt-2">
                                Pilih kategori untuk melihat analisis mendalam
                            </p>
                        </div>

                        {/* Enhanced Tabs */}
                        <div className="mb-8">
                            <div className="flex flex-wrap justify-center gap-2 p-2 bg-gray-100/80 rounded-2xl backdrop-blur-sm">
                                {['Critical Issues', 'Strengths', 'Keywords', 'Line Analysis'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`group flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                                            activeTab === tab
                                                ? 'bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-lg shadow-blue-900/30'
                                                : 'bg-white/80 text-gray-700 hover:bg-white hover:text-blue-600 shadow-sm hover:shadow-md'
                                        }`}
                                    >
                                        <div className={`transition-transform duration-300 ${activeTab === tab ? 'scale-110' : 'group-hover:scale-110'}`}>
                                            {getTabIcon(tab)}
                                        </div>
                                        <span>{tab}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tab Content with Animation */}
                        <div className="animate-fade-in-up">
                            {activeTab === 'Critical Issues' && (
                                <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 border border-red-200/30">
                                    <CriticalIssues />
                                </div>
                            )}
                            {activeTab === 'Strengths' && (
                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200/30">
                                    <Strengths />
                                </div>
                            )}
                            {activeTab === 'Keywords' && (
                                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200/30">
                                    <KeywordAnalysis />
                                </div>
                            )}
                            {activeTab === 'Line Analysis' && (
                                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200/30">
                                    <LineAnalysis />
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Benchmark Section */}
                <section className="mb-8">
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-blue-900/10 p-8 border border-gray-200/50 transform hover:scale-105 transition-all duration-300">
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-200/50 text-yellow-700 px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-sm">
                                <BarChart3 size={14} className="text-yellow-600" />
                                <span>Perbandingan Industri</span>
                            </div>
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-yellow-900 to-orange-900 bg-clip-text text-transparent">
                                Benchmark Analysis
                            </h3>
                        </div>
                        <BenchmarkSection />
                    </div>
                </section>

                {/* Call to Action */}
                <section className="text-center">
                    <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-3xl p-8 text-white shadow-xl shadow-blue-900/20">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Sparkles size={32} className="text-white" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3">Resume Anda Sudah Dianalisis!</h3>
                        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                            Gunakan insight dan rekomendasi di atas untuk meningkatkan kualitas resume Anda. 
                            Semakin tinggi skor ATS, semakin besar peluang Anda lolos screening awal.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <button className="bg-white text-blue-900 font-bold py-3 px-8 rounded-xl hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg">
                                Download Report
                            </button>
                            <button className="bg-white/20 backdrop-blur-sm text-white font-bold py-3 px-8 rounded-xl hover:bg-white/30 transition-all duration-300 transform hover:scale-105 border border-white/30">
                                Analisis Ulang
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />

            <style jsx>{`
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fade-in-up {
                    animation: fade-in-up 0.5s ease-out;
                }
            `}</style>
        </div>
    );
};

export default ResumeAnalysisPage;