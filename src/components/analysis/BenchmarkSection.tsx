// components/analysis/BenchmarkSection.tsx
import React from 'react';
import { BarChart2 } from 'lucide-react';

const benchmarks = [
    {
        title: 'Quantified Achievements',
        yourValue: 23,
        topValue: 67,
        barColor: 'bg-red-500',
        bgColor: 'bg-red-50',
        topColor: 'text-green-600',
    },
    {
        title: 'Action Verb Usage',
        yourValue: 85,
        topValue: 78,
        barColor: 'bg-green-600',
        bgColor: 'bg-green-50',
        topColor: 'text-green-600',
    },
    {
        title: 'Keyword Density',
        yourValue: 27,
        topValue: 54,
        barColor: 'bg-red-500',
        bgColor: 'bg-red-50',
        topColor: 'text-green-600',
    },
    {
        title: 'ATS Compatibility',
        yourValue: 82,
        topValue: 88,
        barColor: 'bg-yellow-500',
        bgColor: 'bg-yellow-50',
        topColor: 'text-green-600',
    },
];

const BenchmarkSection: React.FC = () => {
    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mt-10">
            <div className="flex items-center gap-2 mb-6">
                <BarChart2 className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-lg text-gray-800">Benchmarking Against Top Performers</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {benchmarks.map((item, idx) => {
                    const barWidth = `${item.yourValue}%`;
                    return (
                        <div key={idx} className={`rounded-xl p-4 ${item.bgColor}`}>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">{item.title}</h4>
                            <div className="text-xs text-gray-600">Your Resume: <span className="font-bold text-gray-900">{item.yourValue}%</span></div>
                            <div className="text-xs text-gray-600 mb-2">Top 10%: <span className={`font-bold ${item.topColor}`}>{item.topValue}%</span></div>
                            <div className="h-2 w-full bg-gray-200 rounded">
                                <div
                                    className={`h-2 rounded ${item.barColor}`}
                                    style={{ width: barWidth }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default BenchmarkSection;
