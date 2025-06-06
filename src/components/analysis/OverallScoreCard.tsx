import React from 'react';

const OverallScoreCard: React.FC = () => {
    return (
        <div className="bg-white rounded-2xl shadow p-6 w-full max-w-sm mx-auto flex flex-col items-center">
            {/* Progress Circle */}
            <div className="relative w-32 h-32 mb-4">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="#e5e7eb"
                        strokeWidth="10"
                        fill="none"
                    />
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="#22c55e"
                        strokeWidth="10"
                        strokeDasharray={`${(78 / 100) * 283} 283`}
                        strokeLinecap="round"
                        fill="none"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-green-600">
                    <div className="text-2xl font-bold">78</div>
                    <div className="text-xs text-gray-600">Overall Score</div>
                </div>
            </div>

            {/* Description */}
            <p className="text-sm font-semibold text-gray-800 mb-1">Good Performance</p>
            <p className="text-center text-sm text-gray-500 mb-6">
                Your resume is above average but has<br />
                significant room for improvement. You’re in<br />
                the top 35% of all resumes analyzed.
            </p>

            {/* Score Grid */}
            <div className="grid grid-cols-2 gap-3 w-full">
                {[
                    { label: 'ATS Score', value: 85 },
                    { label: 'Content Score', value: 71 },
                    { label: 'Format Score', value: 82 },
                    { label: 'Impact Score', value: 65 },
                ].map((item, index) => (
                    <div
                        key={index}
                        className="bg-blue-50 rounded-xl text-center py-3 shadow-sm border border-blue-100"
                    >
                        <p className="text-lg font-bold text-gray-900">{item.value}</p>
                        <p className="text-xs text-gray-600">{item.label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OverallScoreCard;
