import React from 'react';
import AuthHeader from '../components/AuthComp/AuthHeader';
import FillPendidikan from '../components/fillpendidikan';

const FillPendidikanPage: React.FC = () => {
    return (
        <div className="relative min-h-screen flex flex-col drop-shadow-sm">
            <AuthHeader />
            <main className="flex-grow flex flex-col">
            <FillPendidikan />
            </main>
        </div>
    );
};

export default FillPendidikanPage;
