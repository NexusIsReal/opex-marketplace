"use client";

import AnimatedText from "@/components/AnimatedText";
import FadeIn from "@/components/FadeIn";
import BlurText from "@/components/BlurText";
import ShinyText from "@/components/ShinyText";
import TrueFocus from "@/components/TrueFocus";
import DarkVeil from "@/components/DarkVeil";
import GlowCard from "@/components/GlowCard";
import SearchInput from "@/components/SearchInput";
import { LiquidButton } from "@/components/animate-ui/buttons/liquid";
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
      {/* Header is rendered globally in RootLayout; spacer to offset fixed header */}
      <div className="h-20" />

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
            <div className="flex justify-center">
              <SearchInput />
            </div>
          </FadeIn>

          <FadeIn delay={1.0} duration={0.8} direction="up">
            <div className="mt-4 flex justify-center">
              <LiquidButton
                variant="default"
                size="lg"
                className="[--primary:#9945FF] text-white !bg-[#0f0f0f] border border-[#2a2a2a] px-8"
              >
                Get Started
              </LiquidButton>
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
            <GlowCard className="p-0 overflow-hidden" glowIntensity="0" glowSize="600px" enableTilt={false}>
              <div className="bg-[#151515] rounded-lg p-6 shadow-lg backdrop-blur-sm">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                <div className="bg-[#060010] rounded-xl p-4 aspect-square flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-1 group">
                  <div className="text-[#9945FF] mb-3 transform group-hover:scale-110 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                      <line x1="9" y1="9" x2="9.01" y2="9"></line>
                      <line x1="15" y1="9" x2="15.01" y2="9"></line>
                    </svg>
                  </div>
                  <h3 className="text-white text-center font-medium">Design</h3>
                  <p className="text-xs text-[#999] text-center mt-1">UI/UX design services</p>
                </div>
                
                <div className="bg-[#060010] rounded-xl p-4 aspect-square flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-1 group">
                  <div className="text-[#9945FF] mb-3 transform group-hover:scale-110 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="16 18 22 12 16 6"></polyline>
                      <polyline points="8 6 2 12 8 18"></polyline>
                    </svg>
                  </div>
                  <h3 className="text-white text-center font-medium">Development</h3>
                  <p className="text-xs text-[#999] text-center mt-1">Web & mobile development</p>
                </div>
                
                <div className="bg-[#060010] rounded-xl p-4 aspect-square flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-1 group">
                  <div className="text-[#9945FF] mb-3 transform group-hover:scale-110 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 20V10"></path>
                      <path d="M18 20V4"></path>
                      <path d="M6 20v-4"></path>
                    </svg>
                  </div>
                  <h3 className="text-white text-center font-medium">Marketing</h3>
                  <p className="text-xs text-[#999] text-center mt-1">Digital marketing solutions</p>
                </div>
                
                <div className="bg-[#060010] rounded-xl p-4 aspect-square flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-1 group">
                  <div className="text-[#9945FF] mb-3 transform group-hover:scale-110 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                      <path d="M2 2l7.586 7.586"></path>
                      <circle cx="11" cy="11" r="2"></circle>
                    </svg>
                  </div>
                  <h3 className="text-white text-center font-medium">Writing</h3>
                  <p className="text-xs text-[#999] text-center mt-1">Content writing services</p>
                </div>
                
                <div className="bg-[#060010] rounded-xl p-4 aspect-square flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-1 group">
                  <div className="text-[#9945FF] mb-3 transform group-hover:scale-110 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                      <line x1="12" y1="19" x2="12" y2="23"></line>
                      <line x1="8" y1="23" x2="16" y2="23"></line>
                    </svg>
                  </div>
                  <h3 className="text-white text-center font-medium">Audio</h3>
                  <p className="text-xs text-[#999] text-center mt-1">Voice & audio production</p>
                </div>
                
                <div className="bg-[#060010] rounded-xl p-4 aspect-square flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-1 group">
                  <div className="text-[#9945FF] mb-3 transform group-hover:scale-110 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="23 7 16 12 23 17 23 7"></polygon>
                      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                    </svg>
                  </div>
                  <h3 className="text-white text-center font-medium">Video</h3>
                  <p className="text-xs text-[#999] text-center mt-1">Video production</p>
                </div>
              </div>  
            </div>
            </GlowCard>
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

      {/* Footer is rendered globally in RootLayout */}
    </div>
  );
}
