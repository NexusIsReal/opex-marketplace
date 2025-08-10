"use client";
import React, { useState, useEffect } from 'react';

// Professional Glass Effect Header Component
export default function Header({ fixed = true }: { fixed?: boolean }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    if (fixed) {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [fixed]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className={fixed ? 'fixed top-0 left-0 right-0 z-50 py-3 sm:py-4 md:py-6' : 'py-3 sm:py-4 md:py-6'}>
      <div className="w-[95%] max-w-[1400px] mx-auto px-2 sm:px-4">
        <header 
          className={`
            flex justify-between items-center px-3 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 rounded-2xl sm:rounded-3xl 
            backdrop-blur-2xl bg-black/[0.4] border border-gray-500/[0.15]
            shadow-[0_8px_32px_rgba(0,0,0,0.25)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.35)]
            transition-all duration-700 ease-out relative overflow-hidden
            ${isScrolled ? 'backdrop-blur-3xl bg-black/[0.5] border-gray-400/[0.2]' : ''}
          `}
        >
          {/* Glass reflection overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-400/[0.08] via-transparent to-transparent opacity-60 pointer-events-none"></div>
          
          {/* Subtle border glow */}
          <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-gray-300/10 via-silver/10 to-gray-400/10 opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none blur-xl"></div>

          {/* Enhanced Logo Section */}
          <div className="flex items-center group cursor-pointer relative z-10 flex-shrink-0">
            <div className="relative mr-2 sm:mr-3 md:mr-4">
              {/* Main logo container with enhanced glass effect */}
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl sm:rounded-2xl backdrop-blur-xl bg-gradient-to-br from-gray-600/30 via-gray-500/25 to-gray-400/30 border border-gray-400/30 flex items-center justify-center shadow-lg group-hover:shadow-[0_0_32px_rgba(156,163,175,0.4)] transition-all duration-500">
                <span className="text-white font-bold text-sm sm:text-lg md:text-xl bg-gradient-to-br from-gray-100 to-gray-300 bg-clip-text text-transparent">O</span>
                
                {/* Inner glow */}
                <div className="absolute inset-1 rounded-lg sm:rounded-xl bg-gradient-to-br from-gray-300/15 to-transparent opacity-50"></div>
              </div>
              
              {/* Animated glow effect */}
              <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 opacity-0 group-hover:opacity-25 blur-lg transition-all duration-500 -z-10"></div>
              
              {/* Floating particles effect */}
              <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gray-300/70 opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-500"></div>
            </div>
            
            <div className="relative">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 bg-clip-text text-transparent group-hover:from-gray-200 group-hover:via-gray-100 group-hover:to-white transition-all duration-500">
                OPEX
              </h1>
              <span className="text-xs sm:text-sm text-gray-400 font-medium tracking-wide hidden xs:block">
                Freelance Platform
              </span>
              
              {/* Underline animation */}
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-gray-300 to-gray-100 group-hover:w-full transition-all duration-500 rounded-full"></div>
            </div>
          </div>

          {/* Enhanced Navigation - Hidden on small screens */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-10 relative z-10">
            {[
              { name: 'Dashboard', href: '#', active: false },
              { name: 'Hiring', href: '#', active: true },
              { name: 'Projects', href: '#', active: false },
              { name: 'Talent', href: '#', active: false }
            ].map((item, index) => (
              <div key={index} className="relative group">
                <a 
                  href={item.href} 
                  className={`
                    text-sm font-semibold transition-all duration-400 relative py-2 px-3 xl:py-3 xl:px-4 rounded-xl
                    hover:backdrop-blur-sm hover:bg-gray-800/[0.3] border border-transparent
                    hover:border-gray-400/[0.2] hover:shadow-lg
                    ${item.active 
                      ? 'text-white bg-gray-800/[0.4] border-gray-400/[0.15] shadow-md backdrop-blur-sm' 
                      : 'text-gray-300 hover:text-gray-100'
                    }
                  `}
                >
                  {item.name}
                  
                  {/* Active indicator with glass effect */}
                  {item.active && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 xl:w-8 h-1 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-100 rounded-full shadow-lg shadow-gray-300/30"></div>
                  )}
                  
                  {/* Hover indicator */}
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-gray-300 to-gray-100 rounded-full opacity-0 group-hover:opacity-100 group-hover:w-5 xl:group-hover:w-6 transition-all duration-400 shadow-lg shadow-gray-300/30"></div>
                </a>
              </div>
            ))}
          </nav>

          {/* Enhanced Auth Section - Hidden on mobile */}
          <div className="hidden lg:flex items-center space-x-6 relative z-10">
            {/* Login Button */}
            <a 
              href="#" 
              className="group text-sm font-semibold text-gray-300 hover:text-gray-100 transition-all duration-400 px-6 py-3 rounded-xl hover:backdrop-blur-sm hover:bg-gray-800/[0.3] border border-transparent hover:border-gray-400/[0.15] hover:shadow-lg relative overflow-hidden"
            >
              <span className="relative z-10">Login</span>
              <div className="absolute inset-0 bg-gradient-to-r from-gray-700/[0.1] to-gray-600/[0.1] opacity-0 group-hover:opacity-100 transition-opacity duration-400"></div>
            </a>
            
            {/* Enhanced Sign Up Button with premium glass effect */}
            <div className="relative group">
              {/* Animated background glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-gray-400 via-gray-300 to-gray-500 rounded-2xl blur-sm opacity-25 group-hover:opacity-50 transition-all duration-500 animate-pulse"></div>
              
              <a 
                href="#" 
                className="relative px-8 py-3.5 rounded-2xl bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 backdrop-blur-xl text-white text-sm font-bold border border-gray-400/30 hover:border-gray-300/40 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-gray-500/20 hover:scale-105 active:scale-95 overflow-hidden"
              >
                {/* Inner glass reflection */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-300/20 via-transparent to-transparent opacity-60"></div>
                
                {/* Button text */}
                <span className="relative z-10 bg-gradient-to-r from-gray-100 to-white bg-clip-text text-transparent">
                  Sign Up Free
                </span>
                
                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-gray-500/20 via-gray-400/20 to-gray-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-400"></div>
                
                {/* Shimmer effect */}
                <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-gray-200/15 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse"></div>
              </a>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 sm:p-3 rounded-xl sm:rounded-2xl text-gray-300 hover:text-gray-100 backdrop-blur-sm hover:bg-gray-800/[0.3] border border-transparent hover:border-gray-400/[0.15] transition-all duration-300 relative z-10 ml-2"
          >
            <svg 
              className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-90' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </header>

        {/* Enhanced Mobile Navigation Menu */}
        <div 
          className={`
            lg:hidden mt-2 sm:mt-4 p-4 sm:p-6 rounded-2xl sm:rounded-3xl backdrop-blur-2xl bg-black/[0.4] 
            border border-gray-500/[0.15] shadow-[0_8px_32px_rgba(0,0,0,0.25)]
            transition-all duration-500 ease-out relative overflow-hidden
            ${isMobileMenuOpen 
              ? 'opacity-100 translate-y-0 pointer-events-auto' 
              : 'opacity-0 -translate-y-4 pointer-events-none'
            }
          `}
        >
          {/* Glass reflection overlay for mobile menu */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-400/[0.06] via-transparent to-transparent opacity-60 pointer-events-none"></div>
          
          <nav className="flex flex-col space-y-1 sm:space-y-2 relative z-10">
            {['Dashboard', 'Hiring', 'Projects', 'Talent'].map((item, index) => (
              <a 
                key={index}
                href="#" 
                className="text-sm font-semibold text-gray-300 hover:text-gray-100 transition-all duration-400 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl hover:backdrop-blur-sm hover:bg-gray-800/[0.3] border border-transparent hover:border-gray-400/[0.15] hover:shadow-lg"
              >
                {item}
              </a>
            ))}
            
            <div className="pt-3 sm:pt-4 border-t border-gray-500/[0.15] flex flex-col space-y-2 sm:space-y-3">
              {/* Login and Sign Up buttons for mobile */}
              <a 
                href="#" 
                className="text-sm font-semibold text-gray-300 hover:text-gray-100 transition-all duration-400 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl hover:backdrop-blur-sm hover:bg-gray-800/[0.3] border border-transparent hover:border-gray-400/[0.15] hover:shadow-lg"
              >
                Login
              </a>
              <a 
                href="#" 
                className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 backdrop-blur-xl text-white text-sm font-bold text-center border border-gray-400/25 shadow-lg relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-300/20 via-transparent to-transparent opacity-60"></div>
                <span className="relative z-10 bg-gradient-to-r from-gray-100 to-white bg-clip-text text-transparent">Sign Up Free</span>
              </a>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}