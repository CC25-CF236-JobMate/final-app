import React from 'react';

interface Props {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const tabs = [
    { label: 'Critical Issues', count: 12 },
    { label: 'Strengths', count: 8 },
    { label: 'Keywords' },
    { label: 'Line Analysis' },
];

const AnalysisTabs: React.FC<Props> = ({ activeTab, setActiveTab }) => {
    return (
        <div className="flex gap-6 text-sm font-medium text-gray-700 border-b border-gray-300">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.label;
                return (
                    <button
                        key={tab.label}
                        onClick={() => setActiveTab(tab.label)}
                        className={`pb-2 ${
                            isActive ? 'text-blue-900 border-b-2 border-blue-900' : ''
                        }`}
                    >
                        {tab.label}
                        {tab.count !== undefined && (
                            <span className="ml-1 font-semibold">({tab.count})</span>
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export default AnalysisTabs;
