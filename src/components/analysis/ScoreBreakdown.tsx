import React from 'react';

const ScoreBreakdown: React.FC = () => {
    return (
        <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-xl">
            <h3 className="font-semibold text-sm text-blue-900 mb-3 flex items-center gap-2">
                📊 How We Calculate Your Score
            </h3>
            <p className="text-gray-600 text-sm mb-4">
                Our AI analyzes your resume across 47 different factors, weighted by importance based on recruiter feedback and ATS requirements.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
                    <p className="font-bold text-gray-900">35% – Content Quality</p>
                    <p className="text-gray-600">Quantified achievements, action verbs, relevance to role</p>
                </div>
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
                    <p className="font-bold text-gray-900">25% – ATS Optimization</p>
                    <p className="text-gray-600">Keyword density, formatting compatibility, parsing accuracy</p>
                </div>
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
                    <p className="font-bold text-gray-900">20% – Impact & Results</p>
                    <p className="text-gray-600">Measurable outcomes, leadership examples, skill demonstration</p>
                </div>
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
                    <p className="font-bold text-gray-900">20% – Structure & Format</p>
                    <p className="text-gray-600">Section organization, white space, readability</p>
                </div>
            </div>
        </div>
    );
};

export default ScoreBreakdown;
