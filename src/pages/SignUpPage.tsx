// src/pages/SignUpPage.tsx
import React from 'react';
import AuthHeader from '../components/AuthComp/AuthHeader';
import AuthPatternWrapper from '../components/AuthComp/AuthPatternWrapper';
import SignUpForm from '../components/AuthComp/SignUpForm';

const SignUpPage: React.FC = () => {
  return (
    <div className="relative min-h-screen flex flex-col drop-shadow-sm">
      <AuthHeader />
      <main className="flex-grow flex flex-col">
        <AuthPatternWrapper>
          <SignUpForm />
        </AuthPatternWrapper>
      </main>
    </div>
  );
};

export default SignUpPage;
