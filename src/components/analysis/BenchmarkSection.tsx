import React from 'react';
import { BarChart2, TrendingUp, Award, Target } from 'lucide-react';

const benchmarks = [
    {
        title: 'Quantified Achievements',
        yourValue: 23,
        topValue: 67,
        barColor: 'from-red-500 to-red-600',
        bgColor: 'from-red-50 to-red-100/50',
        borderColor: 'border-red-200/50',
        topColor: 'text-green-600',
        icon: Award,
        iconBg: 'from-red-500 to-red-600',
        status: 'needs-improvement'
    },
    {
        title: 'Action Verb Usage',
        yourValue: 85,
        topValue: 78,
        barColor: 'from-green-500 to-green-600',
        bgColor: 'from-green-50 to-green-100/50',
        borderColor: 'border-green-200/50',
        topColor: 'text-green-600',
        icon: TrendingUp,
        iconBg: 'from-green-500 to-green-600',
        status: 'excellent'
    },
    {
        title: 'Keyword Density',
        yourValue: 27,
        topValue: 54,
        barColor: 'from-orange-500 to-red-500',
        bgColor: 'from-orange-50 to-red-50',
        borderColor: 'border-orange-200/50',
        topColor: 'text-green-600',
        icon: Target,
        iconBg: 'from-orange-500 to-red-500',
        status: 'needs-improvement'
    },
    {
        title: 'ATS Compatibility',
        yourValue: 82,
        topValue: 88,
        barColor: 'from-yellow-500 to-amber-500',
        bgColor: 'from-yellow-50 to-amber-50',
        borderColor: 'border-yellow-200/50',
        topColor: 'text-green-600',
        icon: BarChart2,
        iconBg: 'from-yellow-500 to-amber-500',
        status: 'good'
    },
];

const BenchmarkSection: React.FC = () => {
    const getStatusBadge = (status: string, yourValue: number, topValue: number) => {
        if (yourValue > topValue) {
            return (
                <div className="inline-flex items-center space-x-1 bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200/50 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Excellent</span>
                </div>
            );
        } else if (yourValue >= topValue * 0.8) {
            return (
                <div className="inline-flex items-center space-x-1 bg-gradient-to-r from-blue-100 to-cyan-100 border border-blue-200/50 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span>Good</span>
                </div>
            );
        } else if (yourValue >= topValue * 0.6) {
            return (
                <div className="inline-flex items-center space-x-1 bg-gradient-to-r from-yellow-100 to-amber-100 border border-yellow-200/50 text-yellow-700 px-2 py-1 rounded-full text-xs font-semibold">
                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                    <span>Average</span>
                </div>
            );
        } else {
            return (
                <div className="inline-flex items-center space-x-1 bg-gradient-to-r from-red-100 to-orange-100 border border-red-200/50 text-red-700 px-2 py-1 rounded-full text-xs font-semibold">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                    <span>Needs Work</span>
                </div>
            );
        }
    };

    return (
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl shadow-xl shadow-blue-900/10 p-8 mt-10 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-30 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-green-100 to-yellow-100 rounded-full opacity-30 blur-2xl"></div>
            
            <div className="relative">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <BarChart2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">Benchmarking Analysis</h3>
                            <p className="text-sm text-gray-600">Perbandingan dengan top 10% performer di industri</p>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200/50 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold shadow-sm">
                        <TrendingUp size={14} className="text-purple-600" />
                        <span>Industry Standards</span>
                    </div>
                </div>

                {/* Benchmark Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {benchmarks.map((item, idx) => {
                        const barWidth = `${Math.min(item.yourValue, 100)}%`;
                        const IconComponent = item.icon;
                        const performance = (item.yourValue / item.topValue) * 100;
                        
                        return (
                            <div 
                                key={idx} 
                                className={`group bg-gradient-to-br ${item.bgColor} border ${item.borderColor} rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-xl relative overflow-hidden`}
                            >
                                {/* Background decoration */}
                                <div className="absolute top-0 right-0 w-16 h-16 bg-white/20 rounded-full -translate-y-4 translate-x-4 blur-sm"></div>
                                
                                <div className="relative">
                                    {/* Icon and Status */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`w-10 h-10 bg-gradient-to-r ${item.iconBg} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                            <IconComponent className="w-5 h-5 text-white" />
                                        </div>
                                        {getStatusBadge(item.status, item.yourValue, item.topValue)}
                                    </div>

                                    {/* Title */}
                                    <h4 className="text-base font-bold text-gray-800 mb-4 leading-tight">{item.title}</h4>
                                    
                                    {/* Stats */}
                                    <div className="space-y-3 mb-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-gray-600">Resume Anda:</span>
                                            <span className="text-lg font-bold text-gray-900">{item.yourValue}%</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-gray-600">Top 10%:</span>
                                            <span className={`text-lg font-bold ${item.topColor}`}>{item.topValue}%</span>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs text-gray-500">
                                            <span>Progress</span>
                                            <span>{Math.round(performance)}% dari target</span>
                                        </div>
                                        <div className="h-3 w-full bg-white/60 rounded-full shadow-inner overflow-hidden">
                                            <div
                                                className={`h-full bg-gradient-to-r ${item.barColor} rounded-full transition-all duration-700 ease-out shadow-sm relative`}
                                                style={{ width: barWidth }}
                                            >
                                                <div className="absolute inset-0 bg-white/20 rounded-full"></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Performance Gap */}
                                    {item.yourValue < item.topValue && (
                                        <div className="mt-3 text-xs text-gray-600 bg-white/50 backdrop-blur-sm rounded-lg p-2">
                                            <span className="font-medium">Gap:</span> {item.topValue - item.yourValue}% untuk mencapai standar top performer
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Summary Footer */}
                <div className="mt-8 bg-gradient-to-r from-gray-50 to-blue-50/50 border border-gray-200/50 rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                            <TrendingUp className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h4 className="text-base font-bold text-gray-800 mb-2">Insight & Rekomendasi</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Benchmark ini menunjukkan posisi resume Anda dibandingkan dengan top 10% kandidat di industri. 
                                Focus pada area yang masih di bawah standar untuk meningkatkan peluang lolos screening ATS.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BenchmarkSection;