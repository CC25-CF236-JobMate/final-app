import React from 'react';
import AuthHeader from '../components/AuthComp/AuthHeader';
import PengalamanFill from '../components/PengalamanFill';

const PengalamanFillPage: React.FC = () => {
    return (
        <div className="relative min-h-screen flex flex-col drop-shadow-sm">
            <AuthHeader />
            <main className="flex-grow flex flex-col">
            <PengalamanFill />
            </main>
        </div>
    );
};

export default PengalamanFillPage;
