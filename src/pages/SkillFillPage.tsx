import React from 'react';
import AuthHeader from '../components/AuthComp/AuthHeader';
import SkillFill from '../components/SkillFill';

const SkillFillPage: React.FC = () => {
    return (
        <div className="relative min-h-screen flex flex-col drop-shadow-sm">
            <AuthHeader />
            <main className="flex-grow flex flex-col">
            <SkillFill />
            </main>
        </div>
    );
};

export default SkillFillPage;
