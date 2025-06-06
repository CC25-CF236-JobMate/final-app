import React from 'react';
import { BarChart3, Award, Target, Zap } from 'lucide-react';

const ScoreBreakdown: React.FC = () => {
    const scoreFactors = [
        {
            title: 'Content Quality',
            percentage: 35,
            description: 'Quantified achievements, action verbs, relevance to role',
            color: 'from-blue-500 to-blue-600',
            bgColor: 'from-blue-50 to-blue-100/50',
            borderColor: 'border-blue-200/50',
            icon: Award
        },
        {
            title: 'ATS Optimization',
            percentage: 25,
            description: 'Keyword density, formatting compatibility, parsing accuracy',
            color: 'from-purple-500 to-purple-600',
            bgColor: 'from-purple-50 to-purple-100/50',
            borderColor: 'border-purple-200/50',
            icon: Target
        },
        {
            title: 'Impact & Results',
            percentage: 20,
            description: 'Measurable outcomes, leadership examples, skill demonstration',
            color: 'from-green-500 to-green-600',
            bgColor: 'from-green-50 to-green-100/50',
            borderColor: 'border-green-200/50',
            icon: Zap
        },
        {
            title: 'Structure & Format',
            percentage: 20,
            description: 'Section organization, white space, readability',
            color: 'from-orange-500 to-orange-600',
            bgColor: 'from-orange-50 to-orange-100/50',
            borderColor: 'border-orange-200/50',
            icon: BarChart3
        }
    ];

    return (
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl shadow-xl shadow-blue-900/10 p-8 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-30 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-green-100 to-yellow-100 rounded-full opacity-30 blur-2xl"></div>
            
            <div className="relative">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <BarChart3 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">Score Calculation</h3>
                            <p className="text-sm text-gray-600">47 faktor analisis berdasarkan feedback recruiter</p>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200/50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold shadow-sm">
                        <BarChart3 size={14} className="text-blue-600" />
                        <span>AI Analysis</span>
                    </div>
                </div>

                {/* Score Factors Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {scoreFactors.map((factor, idx) => {
                        const IconComponent = factor.icon;
                        
                        return (
                            <div 
                                key={idx} 
                                className={`group bg-gradient-to-br ${factor.bgColor} border ${factor.borderColor} rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-xl relative overflow-hidden`}
                            >
                                {/* Background decoration */}
                                <div className="absolute top-0 right-0 w-16 h-16 bg-white/20 rounded-full -translate-y-4 translate-x-4 blur-sm"></div>
                                
                                <div className="relative">
                                    {/* Icon and Percentage */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`w-10 h-10 bg-gradient-to-r ${factor.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                            <IconComponent className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-gray-900">{factor.percentage}%</div>
                                            <div className="text-xs text-gray-500">weight</div>
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h4 className="text-base font-bold text-gray-800 mb-2 leading-tight">{factor.title}</h4>
                                    
                                    {/* Description */}
                                    <p className="text-sm text-gray-600 leading-relaxed">{factor.description}</p>

                                    {/* Progress Bar */}
                                    <div className="mt-4">
                                        <div className="h-2 w-full bg-white/60 rounded-full shadow-inner overflow-hidden">
                                            <div
                                                className={`h-full bg-gradient-to-r ${factor.color} rounded-full transition-all duration-700 ease-out shadow-sm relative`}
                                                style={{ width: `${factor.percentage * 2.5}%` }}
                                            >
                                                <div className="absolute inset-0 bg-white/20 rounded-full"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Summary Footer */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50/50 border border-gray-200/50 rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                            <BarChart3 className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h4 className="text-base font-bold text-gray-800 mb-2">Metodologi Penilaian</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                AI kami menganalisis resume Anda menggunakan 47 faktor berbeda, dengan bobot yang disesuaikan berdasarkan 
                                feedback dari recruiter dan requirement ATS untuk memastikan akurasi penilaian yang optimal.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScoreBreakdown;