import React from 'react';
import { AlertTriangle, Zap, TrendingDown, Eye } from 'lucide-react';

const issues = [
    {
        title: 'Missing Quantified Achievements',
        description: 'Only 23% of your bullet points contain specific numbers or metrics. Top-performing resumes average 67% quantified statements.',
        badge: 'High Impact',
        badgeColor: 'from-red-500 to-red-600',
        badgeBg: 'from-red-100 to-red-200',
        button: 'See Detailed Fix',
        icon: TrendingDown,
        severity: 'high'
    },
    {
        title: 'Weak Professional Summary',
        description: 'Your summary is too generic and doesn\'t highlight your unique value proposition. It reads like a job description rather than a compelling personal brand statement.',
        badge: 'High Impact',
        badgeColor: 'from-red-500 to-red-600',
        badgeBg: 'from-red-100 to-red-200',
        button: 'See Detailed Fix',
        icon: Eye,
        severity: 'high'
    },
    {
        title: 'Inconsistent Formatting',
        description: 'Multiple formatting inconsistencies detected that could confuse ATS systems and hurt readability.',
        badge: 'Medium Impact',
        badgeColor: 'from-amber-500 to-orange-500',
        badgeBg: 'from-amber-100 to-orange-100',
        button: 'See Detailed Fix',
        icon: AlertTriangle,
        severity: 'medium'
    },
    {
        title: 'Missing Industry Keywords',
        description: 'Your resume lacks 73% of the most important keywords for your target role, significantly reducing your chances of passing ATS screening.',
        badge: 'High Impact',
        badgeColor: 'from-red-500 to-red-600',
        badgeBg: 'from-red-100 to-red-200',
        button: 'See Complete Keyword Analysis',
        icon: TrendingDown,
        severity: 'high'
    },
    {
        title: 'Outdated Contact Information Format',
        description: 'Your contact section uses an outdated format that doesn\'t optimize for modern ATS parsing and mobile viewing.',
        badge: 'Low Impact',
        badgeColor: 'from-yellow-400 to-yellow-500',
        badgeBg: 'from-yellow-100 to-yellow-200',
        button: 'See Modern Format',
        icon: AlertTriangle,
        severity: 'low'
    },
];

const CriticalIssues: React.FC = () => {
    const getSeverityColors = (severity: string) => {
        switch (severity) {
            case 'high':
                return {
                    bg: 'from-red-50 to-red-100/50',
                    border: 'border-red-200/50',
                    iconBg: 'from-red-500 to-red-600'
                };
            case 'medium':
                return {
                    bg: 'from-amber-50 to-orange-50',
                    border: 'border-amber-200/50',
                    iconBg: 'from-amber-500 to-orange-500'
                };
            case 'low':
                return {
                    bg: 'from-yellow-50 to-yellow-100/50',
                    border: 'border-yellow-200/50',
                    iconBg: 'from-yellow-400 to-yellow-500'
                };
            default:
                return {
                    bg: 'from-gray-50 to-gray-100/50',
                    border: 'border-gray-200/50',
                    iconBg: 'from-gray-500 to-gray-600'
                };
        }
    };

    const highImpactCount = issues.filter(issue => issue.severity === 'high').length;

    return (
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl shadow-xl shadow-red-900/10 p-8 mt-10 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-100 to-orange-100 rounded-full opacity-30 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-yellow-100 to-red-100 rounded-full opacity-30 blur-2xl"></div>
            
            <div className="relative">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <AlertTriangle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">Critical Issues Analysis</h3>
                            <p className="text-sm text-gray-600">Masalah yang perlu segera diperbaiki untuk meningkatkan performa resume</p>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-red-100 to-orange-100 border border-red-200/50 text-red-700 px-4 py-2 rounded-full text-sm font-semibold shadow-sm">
                        <Zap size={14} className="text-red-600" />
                        <span>{highImpactCount} High Priority</span>
                    </div>
                </div>

                {/* Issues Grid */}
                <div className="space-y-4">
                    {issues.map((issue, idx) => {
                        const IconComponent = issue.icon;
                        const colors = getSeverityColors(issue.severity);
                        
                        return (
                            <div 
                                key={idx} 
                                className={`group bg-gradient-to-br ${colors.bg} border ${colors.border} rounded-2xl p-6 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl relative overflow-hidden`}
                            >
                                {/* Background decoration */}
                                <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-6 translate-x-6 blur-sm"></div>
                                
                                <div className="relative">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-4 flex-1">
                                            {/* Icon */}
                                            <div className={`w-10 h-10 bg-gradient-to-r ${colors.iconBg} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0 mt-1`}>
                                                <IconComponent className="w-5 h-5 text-white" />
                                            </div>
                                            
                                            {/* Content */}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h4 className="text-base font-bold text-gray-800 leading-tight">{issue.title}</h4>
                                                </div>
                                                <p className="text-sm text-gray-600 leading-relaxed mb-4">{issue.description}</p>
                                                
                                                {/* Action Button */}
                                                <button className="inline-flex items-center gap-2 text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg group-hover:scale-105">
                                                    <Zap size={14} />
                                                    <span>{issue.button}</span>
                                                </button>
                                            </div>
                                        </div>
                                        
                                        {/* Impact Badge */}
                                        <div className={`inline-flex items-center space-x-1 bg-gradient-to-r ${issue.badgeBg} border border-current/20 text-gray-700 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm flex-shrink-0`}>
                                            <div className={`w-1.5 h-1.5 bg-gradient-to-r ${issue.badgeColor} rounded-full`}></div>
                                            <span>{issue.badge}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Summary Footer */}
                <div className="mt-8 bg-gradient-to-r from-red-50 to-orange-50/50 border border-red-200/50 rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                            <AlertTriangle className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h4 className="text-base font-bold text-gray-800 mb-2">Priority Action Required</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Terdapat {highImpactCount} masalah dengan dampak tinggi yang perlu segera diperbaiki. 
                                Mengatasi issue-issue ini dapat meningkatkan peluang lolos ATS screening hingga 40-60%.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CriticalIssues;