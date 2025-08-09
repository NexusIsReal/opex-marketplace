import React from 'react';

// Server Component: Site Footer (static UI-only)
export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[#222] bg-black/40 relative z-10">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <h2 className="text-lg font-semibold text-white">OPEX Freelance</h2>
            <p className="mt-2 text-sm text-[#9aa0a6]">
              End‑to‑end freelance marketplace to hire experts and deliver projects with confidence.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wide">Product</h3>
            <ul className="mt-3 space-y-2">
              <li><a href="#" className="text-sm text-[#9aa0a6] hover:text-white">Browse</a></li>
              <li><a href="#" className="text-sm text-[#9aa0a6] hover:text-white">Projects</a></li>
              <li><a href="#" className="text-sm text-[#9aa0a6] hover:text-white">Hiring</a></li>
              <li><a href="#" className="text-sm text-[#9aa0a6] hover:text-white">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wide">Company</h3>
            <ul className="mt-3 space-y-2">
              <li><a href="#" className="text-sm text-[#9aa0a6] hover:text-white">About</a></li>
              <li><a href="#" className="text-sm text-[#9aa0a6] hover:text-white">Careers</a></li>
              <li><a href="#" className="text-sm text-[#9aa0a6] hover:text-white">Contact</a></li>
              <li><a href="#" className="text-sm text-[#9aa0a6] hover:text-white">Press</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wide">Stay up to date</h3>
            <p className="mt-3 text-sm text-[#9aa0a6]">Get product news and tips.</p>
            <form className="mt-4 flex gap-2">
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-md bg-[#0e0e0e] border border-[#2a2a2a] px-3 py-2 text-sm text-white placeholder:text-[#71717a] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
              />
              <button
                type="button"
                className="whitespace-nowrap rounded-md bg-white/10 border border-white/10 px-3 py-2 text-sm text-white hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-[#222] pt-6">
          <p className="text-xs text-[#6b7280]">© 2025 OPEX Freelance. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <a href="#" className="text-xs text-[#9aa0a6] hover:text-white">Terms</a>
            <a href="#" className="text-xs text-[#9aa0a6] hover:text-white">Privacy</a>
            <a href="#" className="text-xs text-[#9aa0a6] hover:text-white">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
