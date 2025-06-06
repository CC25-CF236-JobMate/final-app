import React from 'react';
import AuthHeader from '../components/AuthComp/AuthHeader';
import JobSearchStatus from "../components/JobSearchStatus.tsx";

const JobSearchStatusPage: React.FC = () => {
    return (
        <div className="relative min-h-screen flex flex-col drop-shadow-sm">
            <AuthHeader />
            <main className="flex-grow flex flex-col">
                <JobSearchStatus />
            </main>
        </div>
    );
};

export default JobSearchStatusPage;
