import React from 'react';
import { AlertTriangle } from 'lucide-react';

const issues = [
    {
        title: 'Missing Quantified Achievements',
        description:
            'Only 23% of your bullet points contain specific numbers or metrics. Top-performing resumes average 67% quantified statements.',
        badge: 'High Impact',
        badgeColor: 'bg-red-500',
        button: 'See Detailed Fix',
    },
    {
        title: 'Weak Professional Summary',
        description:
            'Your summary is too generic and doesn’t highlight your unique value proposition. It reads like a job description rather than a compelling personal brand statement.',
        badge: 'High Impact',
        badgeColor: 'bg-red-500',
        button: 'See Detailed Fix',
    },
    {
        title: 'Inconsistent Formatting',
        description:
            'Multiple formatting inconsistencies detected that could confuse ATS systems and hurt readability.',
        badge: 'Medium Impact',
        badgeColor: 'bg-yellow-400',
        button: 'See Detailed Fix',
    },
    {
        title: 'Missing Industry Keywords',
        description:
            'Your resume lacks 73% of the most important keywords for your target role, significantly reducing your chances of passing ATS screening.',
        badge: 'High Impact',
        badgeColor: 'bg-red-500',
        button: 'See Complete Keyword Analysis',
    },
    {
        title: 'Outdated Contact Information Format',
        description:
            'Your contact section uses an outdated format that doesn’t optimize for modern ATS parsing and mobile viewing.',
        badge: 'Low Impact',
        badgeColor: 'bg-yellow-300',
        button: 'See Modern Format',
    },
];

const CriticalIssues: React.FC = () => {
    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <h3 className="font-semibold text-lg text-gray-800">
                    Critical Issues That Need Immediate Attention
                </h3>
            </div>

            {issues.map((issue, idx) => (
                <div key={idx} className="bg-red-50 border border-red-100 rounded-lg p-4">
                    <div className="flex justify-between items-start gap-4">
                        <div>
                            <h4 className="text-sm font-semibold text-red-700">{issue.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{issue.description}</p>
                        </div>
                        <span
                            className={`text-white text-xs px-2 py-1 rounded-full h-fit ${issue.badgeColor}`}
                        >
              {issue.badge}
            </span>
                    </div>
                    <button className="mt-3 text-xs bg-blue-900 text-white px-3 py-1 rounded hover:bg-blue-800">
                        {issue.button}
                    </button>
                </div>
            ))}
        </div>
    );
};

export default CriticalIssues;
