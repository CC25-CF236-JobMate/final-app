// components/analysis/KeywordAnalysis.tsx
import React from 'react';
import { Sparkles, Lightbulb } from 'lucide-react';

const usedKeywords = [
    'Project Management', 'Data Analysis', 'Team Leadership', 'Strategic Planning',
    'Budget Management', 'Risk Assessment', 'Quality Assurance', 'Client Relations',
    'Process Improvement', 'Microsoft Excel', 'Timeline Management',
];

const missingKeywords = [
    'Agile Methodology', 'Stakeholder Management', 'Process Improvement', 'Cross-functional',
    'KPI Tracking', 'Change Management', 'Performance Metrics', 'Digital Transformation',
];

const suggestedKeywords = [
    'Business Intelligence', 'ROI Analysis', 'Lean Six Sigma', 'JIRA/Confluence',
    'Gantt Charts', 'Cost–Benefit Analysis', 'Deliverable Management',
    'Risk Mitigation', 'Scope Management',
];

const KeywordAnalysis: React.FC = () => {
    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-600" />
                <h3 className="font-semibold text-lg text-gray-800">Complete Keyword Analysis</h3>
            </div>

            <div>
                <h4 className="text-sm font-semibold text-green-600 mb-2">Keywords You're Using Effectively:</h4>
                <div className="flex flex-wrap gap-2">
                    {usedKeywords.map((kw) => (
                        <span key={kw} className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">{kw}</span>
                    ))}
                </div>
            </div>

            <div>
                <h4 className="text-sm font-semibold text-red-600 mb-2">Missing Important Keywords ({missingKeywords.length} identified):</h4>
                <div className="flex flex-wrap gap-2">
                    {missingKeywords.map((kw) => (
                        <span key={kw} className="bg-red-400 text-white px-3 py-1 rounded-full text-sm">{kw}</span>
                    ))}
                </div>
            </div>

            <div>
                <h4 className="text-sm font-semibold text-yellow-600 mb-2">Suggested Keywords for Your Industry ({suggestedKeywords.length} recommendations):</h4>
                <div className="flex flex-wrap gap-2">
                    {suggestedKeywords.map((kw) => (
                        <span key={kw} className="bg-yellow-400 text-white px-3 py-1 rounded-full text-sm">{kw}</span>
                    ))}
                </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mt-6 text-sm text-gray-700 space-y-2">
                <div className="flex items-center font-semibold mb-2">
                    <Lightbulb className="w-4 h-4 text-yellow-500 mr-2" />
                    Keyword Optimization Tips:
                </div>
                <ul className="list-disc pl-5 space-y-1">
                    <li>Aim for 2–3 mentions of your most important keywords throughout your resume</li>
                    <li>Use keywords naturally in context, don’t just list them</li>
                    <li>Match keywords from job descriptions you’re targeting</li>
                    <li>Include both acronyms and full forms (e.g., “KPI” and “Key Performance Indicators”)</li>
                </ul>
            </div>
        </div>
    );
};

export default KeywordAnalysis;
