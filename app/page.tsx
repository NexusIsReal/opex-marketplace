"use client";

import AnimatedText from "@/components/AnimatedText";
import FadeIn from "@/components/FadeIn";
import BlurText from "@/components/BlurText";
import ShinyText from "@/components/ShinyText";
import TrueFocus from "@/components/TrueFocus";
import DarkVeil from "@/components/DarkVeil";
export default function Home() {
  const handleAnimationComplete = () => {
    console.log("Animation complete");
  };
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* DarkVeil background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
          <DarkVeil 
            hueShift={15} 
            noiseIntensity={0.00} 
            scanlineIntensity={0.00} 
            speed={0.00} 
            scanlineFrequency={0.00} 
            warpAmount={0.00} 
            resolutionScale={1} 
          />
        </div>
      </div>
      {/* Floating translucent header with rounded borders - horizontally compact */}
      <div className="sticky top-0 z-50 py-3 w-[90%] max-w-[1000px] mx-auto">
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

      {/* Hero Section - Transparent with enhanced GSAP animations */}
      <section className="py-16 px-4 overflow-hidden relative z-10">
        <div className="max-w-6xl mx-auto text-center ">
          <div className="text-shadow-subtle mb-8">
            <BlurText
              text="Complete freelance services, all in one place."
              delay={100}
              animateBy="words"
              direction="top"
              onAnimationComplete={handleAnimationComplete}
              className="text-3xl md:text-5xl text-white font-golos tracking-tight leading-tight inline-block"
            />
          </div>
          
          {/* <FadeIn delay={0.4} duration={0.8} direction="up" className="mb-6">
            <AnimatedText 
              text="Marketing Advertising"
              className="text-2xl md:text-3xl font-bold text-[#9945FF]"
              type="chars"
              stagger={0.03}
              as="h2"
            />
          </FadeIn> */}
          
          <BlurText text="Ready to Turn Your Ideas into Reality" 
          delay={100} 
          animateBy="words" 
          direction="top" 
          className="mb-10 text-2xl font-golos tracking-tight leading-tight inline-block"
          />
          
          <FadeIn delay={0.8} duration={0.8} direction="up" className="relative max-w-xl mx-auto mb-8">
            <div className="group relative">
              <input 
                type="text" 
                placeholder="Search for a service project" 
                className="w-full p-4 pl-12 rounded-md bg-[#151515] text-white border border-[#333] focus:border-[#9945FF] focus:outline-none placeholder-[#666] transition-all duration-300 hover:border-[#444] focus:shadow-lg focus:shadow-[#9945FF]/20 font-geist-sans"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 rounded-md bg-[#9945FF] text-white text-sm hover:bg-[#7A35D9] transition-all duration-300 hover:shadow-[0_0_10px_rgba(153,69,255,0.4)]">
                Search
              </button>
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#666] group-hover:text-[#9945FF] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Service Categories - Modern animated version with transparent background */}
      <section className="py-8 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <FadeIn delay={0.2} duration={0.8} direction="up" className="mb-6">
            <div className="flex items-center mb-4">
              <div className="w-1 h-6 bg-[#9945FF] mr-3"></div>
              <h2 className="text-xl font-bold text-white font-geist-sans">Popular Categories</h2>
            </div>
          </FadeIn>
          
          <FadeIn delay={0.4} duration={0.8} direction="up">
            <div className="bg-[#151515] rounded-lg p-6 shadow-lg border border-[#222] backdrop-blur-sm">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 text-center">
                {[
                  { 
                    icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>,
                    name: "Popular" 
                  },
                  { 
                    icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path></svg>,
                    name: "Illustration" 
                  },
                  { 
                    icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>,
                    name: "UI/UX Design" 
                  },
                  { 
                    icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>,
                    name: "Web Dev" 
                  },
                  { 
                    icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>,
                    name: "Marketing" 
                  },
                  { 
                    icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>,
                    name: "Content" 
                  },
                  { 
                    icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>,
                    name: "Video" 
                  },
                  { 
                    icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>,
                    name: "Product Design" 
                  }
                ].map((category, index) => (
                  <div 
                    key={index} 
                    className="p-3 flex flex-col items-center justify-center hover:bg-[#1a1a1a] transition-all duration-300 rounded-lg cursor-pointer group"
                  >
                    <div className="mb-3 text-[#9945FF] group-hover:text-[#B975FF] transform group-hover:scale-110 transition-all duration-300">
                      {category.icon}
                    </div>
                    <div className="text-sm font-medium text-[#ccc] group-hover:text-white transition-colors duration-300">
                      {category.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
          
          <div className="w-full flex justify-center items-center my-6">
            <TrueFocus
              sentence="turn your ideas into reality"
              manualMode={false}
              blurAmount={2}
              borderColor="#9945FF"
              glowColor="rgba(153, 69, 255, 0.5)"
              animationDuration={0.4}
              pauseBetweenAnimations={0.2}
            />
          </div>

        </div>
      </section>

      {/* Featured Freelancers - Fiverr/Fastwork style with transparent background and animations */}
      <section className="py-12 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <FadeIn delay={0.2} duration={0.8} direction="up" className="mb-6">
            <div className="flex items-center mb-6">
              <div className="w-1 h-6 bg-[#9945FF] mr-3"></div>
              <h2 className="text-xl font-bold text-white font-geist-sans">Popular</h2>
            </div>
          </FadeIn>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[
              {
                name: "Alex J.",
                level: "Level 2",
                rating: "4.9",
                reviews: "(120)",
                price: "$20",
                title: "I will create custom graphics and illustrations for your project"
              },
              {
                name: "Peng",
                level: "Level 2",
                rating: "4.8",
                reviews: "(107)",
                price: "$5",
                title: "I will create any video source for your needs"
              },
              {
                name: "Alex T.",
                level: "Level 2",
                rating: "4.8",
                reviews: "(93)",
                price: "$5",
                title: "I will create custom scripts for your project"
              },
              {
                name: "Ripper Design",
                level: "Level 2",
                rating: "4.9",
                reviews: "(254)",
                price: "$15",
                title: "I will do professional motion graphics for you"
              }
            ].map((freelancer, index) => (
              <FadeIn 
                key={index} 
                delay={0.3 + index * 0.1} 
                duration={0.8} 
                direction="up" 
                distance={20}
              >
                <div className="bg-[#151515] rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-transparent hover:border-[#333] group">
                  <div className="aspect-video bg-[#222] relative overflow-hidden">
                    <div className="absolute top-2 left-2 bg-[#0a0a0a] px-2 py-1 rounded text-xs text-white z-10">{freelancer.level}</div>
                    <div className="w-full h-full flex items-center justify-center transform group-hover:scale-105 transition-transform duration-700">
                      <div className="text-2xl font-bold text-[#444]">{freelancer.name.split(" ")[0][0]}{freelancer.name.split(" ")[1]?.[0] || ""}</div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center mb-2">
                      <div className="w-6 h-6 rounded-full bg-[#333] flex items-center justify-center text-xs text-white mr-2 group-hover:bg-[#9945FF] transition-colors duration-300">
                        {freelancer.name.split(" ")[0][0]}
                      </div>
                      <span className="text-sm text-white">{freelancer.name}</span>
                    </div>
                    <p className="text-sm text-[#ccc] mb-3 line-clamp-2 h-10 group-hover:text-white transition-colors duration-300">{freelancer.title}</p>
                    <div className="flex items-center mb-2">
                      <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                      <span className="text-sm text-[#ccc] ml-1">{freelancer.rating}</span>
                      <span className="text-xs text-[#999] ml-1">{freelancer.reviews}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-[#222] pt-2 group-hover:border-[#333] transition-colors duration-300">
                      <span className="text-xs text-[#999]">From</span>
                      <span className="text-sm font-medium text-[#9945FF] group-hover:text-[#00a2ff] transition-colors duration-300">{freelancer.price}</span>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Activity - Fiverr/Fastwork style with transparent background and animations */}
      <section className="py-12 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <FadeIn delay={0.2} duration={0.8} direction="up" className="mb-6">
            <div className="flex items-center mb-6">
              <div className="w-1 h-6 bg-[#9945FF] mr-3"></div>
              <h2 className="text-xl font-bold text-white font-geist-sans">Popular</h2>
            </div>
          </FadeIn>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[
              {
                name: "James O.",
                level: "Level 4",
                rating: "4.9",
                reviews: "(120)",
                price: "$20",
                title: "I will develop any roblox game, lua scripting"
              },
              {
                name: "Treyos",
                level: "Level 4",
                rating: "4.8",
                reviews: "(107)",
                price: "$5",
                title: "I will create roblox ugc"
              },
              {
                name: "Orinxal",
                level: "Level 3",
                rating: "4.8",
                reviews: "(93)",
                price: "$5",
                title: "I will be a professional roblox scripter"
              },
              {
                name: "Terabyte",
                level: "Level 2",
                rating: "4.9",
                reviews: "(254)",
                price: "$15",
                title: "I will create roblox ugc"
              }
            ].map((service, index) => (
              <FadeIn 
                key={index} 
                delay={0.3 + index * 0.1} 
                duration={0.8} 
                direction="up" 
                distance={20}
              >
                <div className="bg-[#151515] rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-transparent hover:border-[#333] group">
                  <div className="aspect-video bg-[#222] relative overflow-hidden">
                    <div className="absolute top-2 left-2 bg-[#0a0a0a] px-2 py-1 rounded text-xs text-white z-10">{service.level}</div>
                    <div className="w-full h-full flex items-center justify-center transform group-hover:scale-105 transition-transform duration-700">
                      <div className="text-2xl font-bold text-[#444]">{service.name.split(" ")[0][0]}{service.name.split(" ")[1]?.[0] || ""}</div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center mb-2">
                      <div className="w-6 h-6 rounded-full bg-[#333] flex items-center justify-center text-xs text-white mr-2 group-hover:bg-[#9945FF] transition-colors duration-300">
                        {service.name.split(" ")[0][0]}
                      </div>
                      <span className="text-sm text-white">{service.name}</span>
                    </div>
                    <p className="text-sm text-[#ccc] mb-3 line-clamp-2 h-10 group-hover:text-white transition-colors duration-300">{service.title}</p>
                    <div className="flex items-center mb-2">
                      <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                      <span className="text-sm text-[#ccc] ml-1">{service.rating}</span>
                      <span className="text-xs text-[#999] ml-1">{service.reviews}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-[#222] pt-2 group-hover:border-[#333] transition-colors duration-300">
                      <span className="text-xs text-[#999]">From</span>
                      <span className="text-sm font-medium text-[#9945FF] group-hover:text-[#B975FF] transition-colors duration-300">{service.price}</span>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Footer - Minimalistic transparent theme with animations */}
      <footer className="mt-auto py-10 px-4 border-t border-[#222] relative z-10">
        <div className="max-w-6xl mx-auto">
          <FadeIn delay={0.2} duration={0.8} direction="up">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-6 md:mb-0">
                <h1 className="text-xl font-bold text-[#9945FF] font-geist-sans">OPEX Freelance</h1>
                <p className="text-xs text-[#666] mt-1 font-geist-sans">© 2025 OPEX Freelance. All rights reserved.</p>
              </div>
              <div className="flex flex-wrap justify-center md:justify-end gap-4 md:gap-6">
                <a href="#" className="text-sm text-[#999] hover:text-[#9945FF] transition-colors duration-300 font-geist-sans">Dashboard</a>
                <a href="#" className="text-sm text-[#999] hover:text-[#9945FF] transition-colors duration-300 font-geist-sans">Hiring</a>
                <a href="#" className="text-sm text-[#999] hover:text-[#9945FF] transition-colors duration-300 font-geist-sans">Projects</a>
                <a href="#" className="text-sm text-[#999] hover:text-[#9945FF] transition-colors duration-300 font-geist-sans">About</a>
                <a href="#" className="text-sm text-[#999] hover:text-[#9945FF] transition-colors duration-300 font-geist-sans">Terms</a>
                <a href="#" className="text-sm text-[#999] hover:text-[#9945FF] transition-colors duration-300 font-geist-sans">Privacy</a>
                <a href="#" className="text-sm text-[#999] hover:text-[#9945FF] transition-colors duration-300 font-geist-sans">Contact</a>
              </div>
            </div>
          </FadeIn>
        </div>
      </footer>
    </div>
  );
}
