"use client"

import { useState } from 'react';
import { MinicartIcon } from "@/app/assets/minicart";
import Link from 'next/link';

export function Header() {
  const [activeLink, setActiveLink] = useState<string>('');

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
              activeLink === 'home' ? 'text-yellow' : ''
            }`}
            onClick={() => handleLinkClick('home')}
          >
            Início
            <span
              className={`absolute left-0 bottom-0 w-full h-[2px] bg-yellow transform scale-x-0 transition-all duration-300 ${
                activeLink === 'home' ? 'scale-x-100' : 'scale-x-0'
              }`}
            />
          </Link>

          <Link
            href="/dashboard/Products"
            className={`text-[0.875rem] font-medium text-white relative ${
              activeLink === 'products' ? 'text-yellow' : ''
            }`}
            onClick={() => handleLinkClick('products')}
          >
            Produtos
            <span
              className={`absolute left-0 bottom-0 w-full h-[2px] bg-yellow transform scale-x-0 transition-all duration-300 ${
                activeLink === 'products' ? 'scale-x-100' : 'scale-x-0'
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
