'use client';

import React from 'react';
import Link from 'next/link';
import './logo.css';

interface LogoProps {
  href?: string;
  className?: string;
  variant?: 'light' | 'dark';
}

export const Logo: React.FC<LogoProps> = ({ href = '/', className = '', variant = 'dark' }) => {
  return (
    <Link href={href} className={`inline-block logo-group ${className}`}>
      <h1 className="text-3xl font-bold flex items-center transition-colors">
        <span className={variant === 'light' ? 'text-white' : 'text-black'}>Berk</span>
        <span className={variant === 'light' ? 'ai-text-light' : 'ai-text'}>
          AI
        </span>
      </h1>
    </Link>
  );
};

export default Logo;
