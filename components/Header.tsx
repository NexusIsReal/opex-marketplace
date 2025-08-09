import React from 'react';

// Server Component: Site Header
// Props allow opting into fixed positioning when needed
export default function Header({ fixed = true }: { fixed?: boolean }) {
  return (
    <div className={fixed ? 'fixed top-0 left-0 right-0 z-50 py-3' : 'py-3'}>
      <div className="w-[90%] max-w-[1000px] mx-auto">
        <header className="flex justify-between items-center p-4 rounded-xl backdrop-blur-md bg-[#0a0a0a]/70 border border-[#222]/50 shadow-lg">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-white mr-2">OPEX</h1>
            <span className="text-sm text-[#999]">Freelance</span>
          </div>
          <nav className="hidden md:flex space-x-5">
            <a href="#" className="text-sm text-[#ccc] hover:text-white transition-colors duration-300">Dashboard</a>
            <a href="#" className="text-sm text-[#ccc] hover:text-white transition-colors duration-300">Hiring</a>
            <a href="#" className="text-sm text-[#ccc] hover:text-white transition-colors duration-300">Projects</a>
          </nav>
          <div className="flex items-center space-x-4">
            <a href="#" className="text-sm text-[#ccc] hover:text-white transition-colors duration-300">Login</a>
            <a href="#" className="px-4 py-2 rounded-md bg-[#9945FF] text-white text-sm hover:bg-[#7A35D9] transition-all duration-300 hover:shadow-[0_0_15px_rgba(153,69,255,0.5)]">Sign Up</a>
          </div>
        </header>
      </div>
    </div>
  );
}
