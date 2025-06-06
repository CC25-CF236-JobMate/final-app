import React from 'react';
import AuthHeader from '../components/AuthComp/AuthHeader';
import AuthPatternWrapper from '../components/AuthComp/AuthPatternWrapper';
import LoginForm from '../components/AuthComp/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col drop-shadow-sm">
      <AuthHeader />
      <main className="flex-grow flex flex-col">
        <AuthPatternWrapper>
          <LoginForm />
        </AuthPatternWrapper>
      </main>
    </div>
  );
};

export default LoginPage;
