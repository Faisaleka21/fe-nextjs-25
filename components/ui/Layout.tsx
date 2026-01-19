import Image from 'next/image';
import React from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
      <main className="flex min-h-screen w-full flex-col items-center py-8 px-16 bg-white sm:items-start">
        <Navbar />
        {children}
      </main>
    </div>
  );
}
