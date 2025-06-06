import React from 'react';
import { Sparkles, Lightbulb, CheckCircle, XCircle, Plus, Target } from 'lucide-react';

const usedKeywords = [
    'Project Management', 'Data Analysis', 'Team Leadership', 'Strategic Planning',
    'Budget Management', 'Risk Assessment', 'Quality Assurance', 'Client Relations',
    'Process Improvement', 'Microsoft Excel', 'Timeline Management',
];

const missingKeywords = [
    'Agile Methodology', 'Stakeholder Management', 'Process Improvement', 'Cross-functional',
    'KPI Tracking', 'Change Management', 'Performance Metrics', 'Digital Transformation',
];

const suggestedKeywords = [
    'Business Intelligence', 'ROI Analysis', 'Lean Six Sigma', 'JIRA/Confluence',
    'Gantt Charts', 'Cost–Benefit Analysis', 'Deliverable Management',
    'Risk Mitigation', 'Scope Management',
];

const KeywordAnalysis: React.FC = () => {
    const totalKeywords = usedKeywords.length + missingKeywords.length;
    const keywordCoverage = Math.round((usedKeywords.length / totalKeywords) * 100);

    return (
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl shadow-xl shadow-purple-900/10 p-8 mt-10 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-100 to-purple-100 rounded-full opacity-30 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-green-100 to-blue-100 rounded-full opacity-30 blur-2xl"></div>
            
            <div className="relative">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">Keyword Analysis</h3>
                            <p className="text-sm text-gray-600">Analisis kata kunci untuk optimasi ATS dan industry matching</p>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-yellow-100 to-purple-100 border border-yellow-200/50 text-yellow-700 px-4 py-2 rounded-full text-sm font-semibold shadow-sm">
                        <Target size={14} className="text-yellow-600" />
                        <span>{keywordCoverage}% Coverage</span>
                    </div>
                </div>

                {/* Keyword Sections */}
                <div className="space-y-6">
                    {/* Used Keywords */}
                    <div className="group bg-gradient-to-br from-green-50 to-emerald-100/50 border border-green-200/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-white/20 rounded-full -translate-y-4 translate-x-4 blur-sm"></div>
                        
                        <div className="relative">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-md">
                                    <CheckCircle className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h4 className="text-base font-bold text-gray-800">Keywords You're Using Effectively</h4>
                                    <p className="text-sm text-green-600 font-medium">{usedKeywords.length} kata kunci terdeteksi dengan baik</p>
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                                {usedKeywords.map((kw, idx) => (
                                    <span 
                                        key={kw} 
                                        className="inline-flex items-center gap-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
                                        style={{ animationDelay: `${idx * 0.1}s` }}
                                    >
                                        <CheckCircle size={12} />
                                        {kw}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Missing Keywords */}
                    <div className="group bg-gradient-to-br from-red-50 to-orange-100/50 border border-red-200/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-white/20 rounded-full -translate-y-4 translate-x-4 blur-sm"></div>
                        
                        <div className="relative">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
                                    <XCircle className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h4 className="text-base font-bold text-gray-800">Missing Important Keywords</h4>
                                    <p className="text-sm text-red-600 font-medium">{missingKeywords.length} kata kunci penting yang belum ada</p>
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                                {missingKeywords.map((kw, idx) => (
                                    <span 
                                        key={kw} 
                                        className="inline-flex items-center gap-1 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
                                        style={{ animationDelay: `${idx * 0.1}s` }}
                                    >
                                        <XCircle size={12} />
                                        {kw}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Suggested Keywords */}
                    <div className="group bg-gradient-to-br from-blue-50 to-purple-100/50 border border-blue-200/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-white/20 rounded-full -translate-y-4 translate-x-4 blur-sm"></div>
                        
                        <div className="relative">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
                                    <Plus className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h4 className="text-base font-bold text-gray-800">Suggested Keywords for Your Industry</h4>
                                    <p className="text-sm text-blue-600 font-medium">{suggestedKeywords.length} rekomendasi untuk meningkatkan relevansi</p>
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                                {suggestedKeywords.map((kw, idx) => (
                                    <span 
                                        key={kw} 
                                        className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
                                        style={{ animationDelay: `${idx * 0.1}s` }}
                                    >
                                        <Plus size={12} />
                                        {kw}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tips Section */}
                <div className="mt-8 bg-gradient-to-r from-yellow-50 to-amber-50/50 border border-yellow-200/50 rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Lightbulb className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h4 className="text-base font-bold text-gray-800 mb-3">Keyword Optimization Tips</h4>
                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <span>Aim for 2–3 mentions of your most important keywords throughout your resume</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <span>Use keywords naturally in context, don't just list them</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <span>Match keywords from job descriptions you're targeting</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <span>Include both acronyms and full forms (e.g., "KPI" and "Key Performance Indicators")</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KeywordAnalysis;