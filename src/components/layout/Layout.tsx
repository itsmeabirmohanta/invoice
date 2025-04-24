import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import NavBar from './NavBar';
import { Heart } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title = 'Invoice Simple' }) => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    
    // Make sure dark mode is disabled
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, []);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Modern invoice management application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
        <NavBar />
        
        <main className="flex-grow container mx-auto px-4 pt-20 pb-12">
          {children}
        </main>
        
        <footer className="py-6 bg-white text-gray-600">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <div className="flex items-center justify-center md:justify-start">
                  <span className="text-sm">&copy; {isClient ? new Date().getFullYear() : '2023'} InvoiceSimple. All rights reserved.</span>
                </div>
                <div className="flex items-center justify-center md:justify-start mt-2 text-sm">
                  <span className="flex items-center">
                    Made with <Heart size={14} className="mx-1 text-red-500" /> by the InvoiceSimple Team
                  </span>
                </div>
              </div>
              
              <div className="flex space-x-6">
                <Link href="/privacy" className="text-sm hover:underline">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-sm hover:underline">
                  Terms of Service
                </Link>
                <Link href="/contact" className="text-sm hover:underline">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Layout; 