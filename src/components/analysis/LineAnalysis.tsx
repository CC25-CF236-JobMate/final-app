import React from 'react';
import { CheckCircle, XCircle, FileText, Eye, User } from 'lucide-react';

const LineAnalysis: React.FC = () => {
    const sections = [
        {
            title: 'Introduction',
            icon: User,
            content: (
                <>
                    <p><strong>John Smith</strong></p>
                    <p>Project Manager</p>
                    <p>john.smith@email.com | (555) 123–4567</p>
                    <p>123 Main Street, Anytown, ST 12345</p>
                </>
            ),
            working: [
                'Clear, professional name formatting',
                'Job title immediately visible',
                'Contact info is complete',
            ],
            improvement: [
                'Full address is unnecessary – use city/state',
                'Missing LinkedIn profile URL',
                'Could add professional subtitle for specialization',
            ],
        },
        {
            title: 'Work Summary',
            icon: FileText,
            content: (
                <>
                    <p><strong>Product Manager – DOKU</strong></p>
                    <p>
                        Experienced project manager with a strong background in leading teams and managing projects.
                        Hardworking professional who is dedicated to delivering results and working well with others.
                    </p>
                </>
            ),
            working: [
                'Section is properly labeled',
                'Mentions relevant experience',
            ],
            improvement: [
                'Too generic – could apply to anyone',
                'No specific years of experience mentioned',
                'Missing quantified achievements',
                'Clichéd phrases like "hardworking" and "team player"',
                'No mention of industry specialization',
            ],
        },
    ];

    const totalIssues = sections.reduce((sum, section) => sum + section.improvement.length, 0);
    const totalWorking = sections.reduce((sum, section) => sum + section.working.length, 0);

    return (
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl shadow-xl shadow-blue-900/10 p-8 mt-10 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full opacity-30 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full opacity-30 blur-2xl"></div>
            
            <div className="relative">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <Eye className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">Line-by-Line Resume Analysis</h3>
                            <p className="text-sm text-gray-600">Analisis detail setiap bagian resume dengan saran perbaikan spesifik</p>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200/50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold shadow-sm">
                        <FileText size={14} className="text-blue-600" />
                        <span>{sections.length} Sections</span>
                    </div>
                </div>

                {/* Sections */}
                <div className="space-y-6">
                    {sections.map((section, idx) => {
                        const IconComponent = section.icon;
                        
                        return (
                            <div 
                                key={idx} 
                                className="group bg-gradient-to-br from-gray-50 to-blue-50/30 border border-gray-200/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg relative overflow-hidden"
                            >
                                {/* Background decoration */}
                                <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-6 translate-x-6 blur-sm"></div>
                                
                                <div className="relative space-y-4">
                                    {/* Section Header */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-md">
                                            <IconComponent className="w-4 h-4 text-white" />
                                        </div>
                                        <h4 className="text-lg font-bold text-gray-800">{section.title}</h4>
                                    </div>

                                    {/* Content Preview */}
                                    <div className="bg-white/60 backdrop-blur-sm border border-gray-200/50 px-4 py-3 rounded-xl text-sm text-gray-700 space-y-1 shadow-sm">
                                        {section.content}
                                    </div>

                                    {/* Analysis Grid */}
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {/* What's Working */}
                                        <div className="bg-gradient-to-br from-green-50 to-emerald-100/50 border border-green-200/50 p-4 rounded-xl transition-all duration-300 hover:shadow-md relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-12 h-12 bg-white/20 rounded-full -translate-y-3 translate-x-3 blur-sm"></div>
                                            
                                            <div className="relative">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                                        <CheckCircle className="w-3 h-3 text-white" />
                                                    </div>
                                                    <h5 className="font-bold text-green-700">What's Working</h5>
                                                    <span className="text-xs bg-green-200/50 text-green-700 px-2 py-0.5 rounded-full font-medium">
                                                        {section.working.length}
                                                    </span>
                                                </div>
                                                <div className="space-y-2">
                                                    {section.working.map((item, i) => (
                                                        <div key={i} className="flex items-start gap-2 text-sm text-green-800">
                                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                                            <span>{item}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Needs Improvement */}
                                        <div className="bg-gradient-to-br from-red-50 to-orange-100/50 border border-red-200/50 p-4 rounded-xl transition-all duration-300 hover:shadow-md relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-12 h-12 bg-white/20 rounded-full -translate-y-3 translate-x-3 blur-sm"></div>
                                            
                                            <div className="relative">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                                                        <XCircle className="w-3 h-3 text-white" />
                                                    </div>
                                                    <h5 className="font-bold text-red-700">Needs Improvement</h5>
                                                    <span className="text-xs bg-red-200/50 text-red-700 px-2 py-0.5 rounded-full font-medium">
                                                        {section.improvement.length}
                                                    </span>
                                                </div>
                                                <div className="space-y-2">
                                                    {section.improvement.map((item, i) => (
                                                        <div key={i} className="flex items-start gap-2 text-sm text-red-800">
                                                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                                                            <span>{item}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Summary Footer */}
                <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50/50 border border-blue-200/50 rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Eye className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h4 className="text-base font-bold text-gray-800 mb-2">Analysis Summary</h4>
                            <div className="flex items-center gap-6 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <span className="text-gray-600">{totalWorking} strengths identified</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                    <span className="text-gray-600">{totalIssues} areas for improvement</span>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed mt-2">
                                Focus on addressing the improvement areas to significantly enhance your resume's impact and ATS compatibility.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LineAnalysis;