// components/AuthPatternWrapper.tsx

import React from 'react';

interface Props {
  children: React.ReactNode;
}

const AuthPatternWrapper: React.FC<Props> = ({ children }) => (
  <div className="w-full relative">
    {/* Pattern Background */}
    <div
      className="w-full h-[320px] md:h-[700px] bg-repeat"
      style={{
        backgroundImage: 'url("/pattern.png")',
        backgroundSize: 'auto',
      }}
    />

    {/* Card Container */}
    <div className="absolute top-[120px] w-full flex justify-center px-4">
      {children}
    </div>
  </div>
);

export default AuthPatternWrapper;
