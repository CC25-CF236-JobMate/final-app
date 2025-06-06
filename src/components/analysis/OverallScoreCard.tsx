import React from 'react';
import { Trophy, Star, Target, CheckCircle } from 'lucide-react';

const OverallScoreCard: React.FC = () => {
    const overallScore = 78;
    const scoreData = [
        { label: 'ATS Score', value: 85, icon: Target, color: 'from-green-500 to-emerald-500', bgColor: 'from-green-50 to-emerald-50' },
        { label: 'Content Score', value: 71, icon: Star, color: 'from-blue-500 to-cyan-500', bgColor: 'from-blue-50 to-cyan-50' },
        { label: 'Format Score', value: 82, icon: CheckCircle, color: 'from-purple-500 to-violet-500', bgColor: 'from-purple-50 to-violet-50' },
        { label: 'Impact Score', value: 65, icon: Trophy, color: 'from-orange-500 to-amber-500', bgColor: 'from-orange-50 to-amber-50' },
    ];

    const getScoreColor = (score: number) => {
        if (score >= 85) return 'text-green-600';
        if (score >= 70) return 'text-blue-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreGradient = (score: number) => {
        if (score >= 85) return 'from-green-500 to-emerald-500';
        if (score >= 70) return 'from-blue-500 to-cyan-500';
        if (score >= 60) return 'from-yellow-500 to-amber-500';
        return 'from-red-500 to-orange-500';
    };

    const getPerformanceText = (score: number) => {
        if (score >= 85) return { title: 'Excellent Performance', desc: 'Resume Anda sangat berkualitas dan siap untuk melamar pekerjaan impian. Anda berada di top 15% dari semua resume yang dianalisis.' };
        if (score >= 70) return { title: 'Good Performance', desc: 'Resume Anda di atas rata-rata namun masih ada ruang untuk peningkatan. Anda berada di top 35% dari semua resume yang dianalisis.' };
        if (score >= 60) return { title: 'Average Performance', desc: 'Resume Anda memerlukan beberapa perbaikan untuk meningkatkan daya saing. Focus pada area yang masih lemah.' };
        return { title: 'Needs Improvement', desc: 'Resume Anda memerlukan perbaikan signifikan untuk meningkatkan peluang lolos screening ATS.' };
    };

    const circumference = 2 * Math.PI * 45;
    const strokeDasharray = `${(overallScore / 100) * circumference} ${circumference}`;
    const performance = getPerformanceText(overallScore);

    return (
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl shadow-xl shadow-blue-900/10 p-8 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-30 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-green-100 to-yellow-100 rounded-full opacity-30 blur-2xl"></div>
            
            <div className="relative">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">Overall Score</h3>
                        <p className="text-sm text-gray-600">Skor keseluruhan resume Anda</p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex flex-col lg:flex-row items-center gap-8">
                    {/* Progress Circle */}
                    <div className="flex-shrink-0">
                        <div className="relative w-36 h-36">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                {/* Background Circle */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    stroke="#f3f4f6"
                                    strokeWidth="8"
                                    fill="none"
                                    className="drop-shadow-sm"
                                />
                                {/* Progress Circle */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    stroke="url(#scoreGradient)"
                                    strokeWidth="8"
                                    strokeDasharray={strokeDasharray}
                                    strokeLinecap="round"
                                    fill="none"
                                    className="transition-all duration-1000 ease-out drop-shadow-sm"
                                />
                                {/* Gradient Definition */}
                                <defs>
                                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#3b82f6" />
                                        <stop offset="100%" stopColor="#06b6d4" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <div className={`text-3xl font-bold ${getScoreColor(overallScore)}`}>{overallScore}</div>
                                <div className="text-xs text-gray-500 font-medium">Overall Score</div>
                            </div>
                        </div>
                    </div>

                    {/* Performance Description */}
                    <div className="flex-1 text-center lg:text-left">
                        <div className="mb-4">
                            <h4 className={`text-lg font-bold ${getScoreColor(overallScore)} mb-2`}>
                                {performance.title}
                            </h4>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {performance.desc}
                            </p>
                        </div>

                        {/* Score Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            {scoreData.map((item, index) => {
                                const IconComponent = item.icon;
                                return (
                                    <div
                                        key={index}
                                        className={`group bg-gradient-to-br ${item.bgColor} border border-gray-200/50 rounded-2xl p-4 transition-all duration-300 transform hover:scale-105 hover:shadow-lg relative overflow-hidden`}
                                    >
                                        {/* Background decoration */}
                                        <div className="absolute top-0 right-0 w-12 h-12 bg-white/20 rounded-full -translate-y-2 translate-x-2 blur-sm"></div>
                                        
                                        <div className="relative">
                                            {/* Icon */}
                                            <div className={`w-8 h-8 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center shadow-lg mb-2 group-hover:scale-110 transition-transform duration-300`}>
                                                <IconComponent className="w-4 h-4 text-white" />
                                            </div>
                                            
                                            {/* Score */}
                                            <div className={`text-xl font-bold ${getScoreColor(item.value)} mb-1`}>
                                                {item.value}
                                            </div>
                                            
                                            {/* Label */}
                                            <div className="text-xs text-gray-600 font-medium">
                                                {item.label}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Action Footer */}
                <div className="mt-8 bg-gradient-to-r from-gray-50 to-blue-50/50 border border-gray-200/50 rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Star className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h4 className="text-base font-bold text-gray-800 mb-2">Langkah Selanjutnya</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Review detail analisis di bawah untuk memahami area yang perlu diperbaiki. 
                                Focus pada komponen dengan skor terendah untuk hasil maksimal.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OverallScoreCard;