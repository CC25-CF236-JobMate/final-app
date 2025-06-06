import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const LineAnalysis: React.FC = () => {
    const sections = [
        {
            title: 'Introduction',
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
                'Clichéd phrases like “hardworking” and “team player”',
                'No mention of industry specialization',
            ],
        },
    ];

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6">
            <h3 className="font-semibold text-lg flex items-center gap-2 text-gray-800">
                <XCircle className="text-blue-500 w-5 h-5" />
                Line-by-Line Resume Analysis
            </h3>
            <p className="text-sm text-gray-600 mb-4">
                Detailed breakdown of each section and line in your resume with specific improvement suggestions.
            </p>

            {sections.map((section, idx) => (
                <div key={idx} className="border rounded-xl p-4 space-y-4">
                    <h4 className="font-medium text-gray-800">{section.title}</h4>
                    <div className="bg-gray-50 border px-4 py-3 rounded text-sm text-gray-700 space-y-1">
                        {section.content}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                            <h5 className="font-medium text-green-700 flex items-center gap-2 mb-2">
                                <CheckCircle className="w-4 h-4" /> What's Working:
                            </h5>
                            <ul className="list-disc pl-5 text-sm text-green-800">
                                {section.working.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>

                        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                            <h5 className="font-medium text-red-700 flex items-center gap-2 mb-2">
                                <XCircle className="w-4 h-4" /> Needs Improvement:
                            </h5>
                            <ul className="list-disc pl-5 text-sm text-red-800">
                                {section.improvement.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default LineAnalysis;
