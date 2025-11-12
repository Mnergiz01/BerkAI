'use client';

import React from 'react';
import './pageloader.css';

export const PageLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="text-5xl font-bold flex items-center">
        <span className="text-black">Berk</span>
        <span className="ai-loader">AI</span>
      </div>
    </div>
  );
};

export default PageLoader;
