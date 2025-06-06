import React from 'react';

const AuthHeader: React.FC = () => (
  <header className="bg-white shadow-sm py-4 px-6 md:px-12">
    <div className="container mx-auto flex items-center justify-between">
      <div className="flex items-center">
        <img src="/logo.png" alt="DisaBisa Logo" className="h-8 md:h-17 mr-3" />
      </div>
    </div>
  </header>
);

export default AuthHeader;
