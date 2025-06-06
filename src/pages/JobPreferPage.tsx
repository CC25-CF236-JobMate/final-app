import React from 'react';
import AuthHeader from '../components/AuthComp/AuthHeader';
import JobPrefer from '../components/JobPrefer';

const JobPreferPage: React.FC = () => {
    return (
        <div className="relative min-h-screen flex flex-col drop-shadow-sm">
            <AuthHeader />
            <main className="flex-grow flex flex-col">
                <JobPrefer />
            </main>
        </div>
    );
};

export default JobPreferPage;
