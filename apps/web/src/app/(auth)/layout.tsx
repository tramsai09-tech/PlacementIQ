import * as React from 'react';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg flex flex-col justify-center items-center relative overflow-hidden p-4">
      {/* Background glow mesh */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <div
          className="w-[800px] h-[600px] opacity-[0.15] rounded-full"
          style={{ background: 'radial-gradient(ellipse at center, #18BADD 0%, transparent 70%)' }}
        />
        <div
          className="absolute top-1/4 right-1/4 w-[500px] h-[400px] opacity-[0.1] rounded-full"
          style={{ background: 'radial-gradient(ellipse at center, #3039A1 0%, transparent 70%)' }}
        />
      </div>

      <div className="w-full max-w-md relative z-10 flex flex-col items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mb-8 group">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-primary shadow-glow-sm transition-transform group-hover:scale-105">
            <span className="text-bg font-display font-bold text-sm">P</span>
          </div>
          <span className="font-display font-semibold text-text text-xl">PlacementIQ</span>
        </Link>

        {children}
      </div>
    </div>
  );
}
