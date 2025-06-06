import React from 'react';
import { BadgeCheck } from 'lucide-react';

const strengthsData = [
    {
        title: 'Strong Action Verbs',
        description: 'Your resume uses a strong variety of action verbs, showing initiative and ownership.',
    },
    {
        title: 'Relevant Industry Keywords',
        description: 'Your resume contains key industry terms that help you pass ATS and impress recruiters.',
    },
    {
        title: 'Good Formatting',
        description: 'Your resume layout is clean, organized, and easy to scan.',
    },
    {
        title: 'Concise Bullet Points',
        description: 'Bullet points are direct and results-oriented, with minimal fluff.',
    },
    {
        title: 'Professional Summary',
        description: 'Your summary clearly outlines your value proposition in a compelling way.',
    },
    {
        title: 'Skills Section',
        description: 'Your skills section is well-structured and highlights technical strengths effectively.',
    },
];

const Strengths: React.FC = () => {
    return (
        <section className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BadgeCheck className="w-5 h-5 text-green-600" />
                Top Strengths Identified
            </h2>

            <div className="space-y-4">
                {strengthsData.map((item, index) => (
                    <div
                        key={index}
                        className="border border-green-200 bg-green-50 rounded-lg px-4 py-3"
                    >
                        <h3 className="text-sm font-semibold text-green-800 mb-1">
                            {item.title}
                        </h3>
                        <p className="text-xs text-green-700">{item.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Strengths;
