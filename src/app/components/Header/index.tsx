"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MinicartIcon } from "@/app/assets/minicart";
import Link from 'next/link';

export function Header() {
  const router = useRouter();
  const [activeLink, setActiveLink] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.split('/').pop();
      setActiveLink(path || '');
    }
  }, [router]);

  const handleLinkClick = (link: string) => {
    setActiveLink(link);
  };

  return (
    <header className="h-[7.188rem] bg-lightBlue rounded-b-[0.625rem] flex items-center">
      <div className="flex items-center justify-between w-full max-w-[90rem] px-8 mx-auto">
        <p className="text-[1.25rem] font-bold text-white">
          Dev<span className="text-yellow">Market</span>
        </p>

        <nav className="flex gap-3">
          <Link
            href="/dashboard/Home"
            className={`text-[0.875rem] font-medium text-white relative ${
              activeLink === 'Home' ? 'text-yellow' : ''
            }`}
            onClick={() => handleLinkClick('Home')}
          >
            Início
            <span
              className={`absolute left-0 bottom-0 w-full h-[2px] bg-yellow transform transition-all duration-300 ${
                activeLink === 'Home' ? 'scale-x-100' : 'scale-x-0'
              }`}
            />
          </Link>

          <Link
            href="/dashboard/Products"
            className={`text-[0.875rem] font-medium text-white relative ${
              activeLink === 'Products' ? 'text-yellow' : ''
            }`}
            onClick={() => handleLinkClick('Products')}
          >
            Produtos
            <span
              className={`absolute left-0 bottom-0 w-full h-[2px] bg-yellow transform transition-all duration-300 ${
                activeLink === 'Products' ? 'scale-x-100' : 'scale-x-0'
              }`}
            />
          </Link>
        </nav>

        <button>
          <MinicartIcon />
        </button>
      </div>
    </header>
  );
}
