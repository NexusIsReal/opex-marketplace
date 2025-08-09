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
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Enhanced DarkVeil background with subtle gradient overlay */}
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
          {/* Subtle gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#0a0a0a]/20 to-[#1a0033]/30"></div>
        </div>
      </div>

      {/* Header spacer */}
      <div className="h-20" />

      {/* Professional Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden z-10">
        {/* Subtle background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-r from-[#9945FF]/5 to-[#00a2ff]/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-[#00a2ff]/3 to-[#9945FF]/3 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          {/* Professional Badge */}
          <FadeIn delay={0.2} duration={0.8} direction="up" className="mb-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#9945FF]/10 backdrop-blur-sm border border-[#9945FF]/20 text-sm font-medium text-white">
              <span className="w-2 h-2 bg-[#9945FF] rounded-full mr-3"></span>
              Now available worldwide - Join thousands of creators
            </div>
          </FadeIn>

          {/* Main headline - Clean and readable */}
          <div className="mb-6 relative">
            <BlurText
              text="Complete freelance services, all in one place."
              delay={100}
              animateBy="words"
              direction="top"
              onAnimationComplete={handleAnimationComplete}
              className="text-4xl md:text-6xl lg:text-7xl text-white font-golos font-bold tracking-tight leading-[1.1] inline-block"
            />
          </div>
          
          {/* Clean subheading */}
          <div className="mb-12">
            <BlurText 
              text="Ready to Turn Your Ideas into Reality" 
              delay={200} 
              animateBy="words" 
              direction="top" 
              className="text-xl md:text-2xl lg:text-3xl font-golos text-gray-300 leading-relaxed inline-block max-w-4xl mx-auto"
            />
          </div>
          
          {/* Clean search section */}
          <FadeIn delay={0.8} duration={0.8} direction="up" className="relative max-w-2xl mx-auto mb-10">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#9945FF]/10 to-[#00a2ff]/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <SearchInput />
              </div>
            </div>
          </FadeIn>

          {/* Professional CTA section */}
          <FadeIn delay={1.0} duration={0.8} direction="up">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              {/* Main CTA button */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#9945FF] to-[#00a2ff] rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
                <LiquidButton
                  variant="default"
                  size="lg"
                  className="relative [--primary:#9945FF] text-white !bg-[#0f0f0f] border border-[#9945FF]/30 px-12 py-4 text-lg font-semibold rounded-xl hover:border-[#9945FF]/50 transition-all duration-300"
                >
                  Get Started
                </LiquidButton>
              </div>

              {/* Secondary action */}
              <div className="flex items-center px-8 py-4 rounded-xl bg-transparent border border-[#2a2a2a] text-white hover:border-[#00a2ff]/30 hover:bg-[#00a2ff]/5 transition-all duration-300 cursor-pointer">
                <svg className="w-5 h-5 mr-2 text-[#00a2ff]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                <span className="text-lg font-medium">Watch Demo</span>
              </div>
            </div>

            {/* Trust indicators - Professional layout */}
            <div className="flex flex-col items-center">
              <p className="text-sm text-gray-400 mb-4 font-medium">Trusted by 50,000+ creators worldwide</p>
              <div className="flex items-center justify-center space-x-8 text-sm text-gray-300">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-[#9945FF] flex items-center justify-center">
                    <span className="text-xs font-bold text-white">★</span>
                  </div>
                  <span>4.9/5 Rating</span>
                </div>
                <div className="w-px h-4 bg-gray-600"></div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-[#00a2ff] flex items-center justify-center">
                    <span className="text-xs font-bold text-white">✓</span>
                  </div>
                  <span>100% Secure</span>
                </div>
                <div className="w-px h-4 bg-gray-600"></div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-[#9945FF] flex items-center justify-center">
                    <span className="text-xs font-bold text-white">∞</span>
                  </div>
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Enhanced Selectable Service Categories */}
      <section className="py-16 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <FadeIn delay={0.2} duration={0.8} direction="up" className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="w-1.5 h-8 bg-gradient-to-b from-[#9945FF] to-[#00a2ff] mr-4 rounded-full"></div>
                <h2 className="text-2xl md:text-3xl font-bold text-white font-geist-sans">Popular Categories</h2>
              </div>
              <button className="text-gray-400 hover:text-white transition-colors duration-300 text-sm font-medium">
                View All Categories →
              </button>
            </div>
          </FadeIn>
          
          <FadeIn delay={0.4} duration={0.8} direction="up">
            <div className="bg-gradient-to-br from-[#1a1a1a]/60 via-[#151515]/60 to-[#0f0f0f]/60 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-[#2a2a2a]/30">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { 
                    icon: "M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9Z", 
                    title: "Design", 
                    desc: "UI/UX design services",
                    count: "1,200+ services",
                    color: "from-[#9945FF] to-[#B975FF]",
                    bgColor: "from-[#9945FF]/10 to-[#B975FF]/5"
                  },
                  { 
                    icon: "m16 18 6-6-6-6M8 6l-6 6 6 6", 
                    title: "Development", 
                    desc: "Web & mobile development",
                    count: "2,100+ services",
                    color: "from-[#00a2ff] to-[#0080cc]",
                    bgColor: "from-[#00a2ff]/10 to-[#0080cc]/5"
                  },
                  { 
                    icon: "M12 20V10M18 20V4M6 20v-4", 
                    title: "Marketing", 
                    desc: "Digital marketing solutions",
                    count: "850+ services",
                    color: "from-[#FF6B9D] to-[#FF8E9B]",
                    bgColor: "from-[#FF6B9D]/10 to-[#FF8E9B]/5"
                  },
                  { 
                    icon: "m12 19 7-7 3 3-7 7-3-3zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5zM2 2l7.586 7.586M11 11a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z", 
                    title: "Writing", 
                    desc: "Content writing services",
                    count: "950+ services",
                    color: "from-[#4ECDC4] to-[#44A08D]",
                    bgColor: "from-[#4ECDC4]/10 to-[#44A08D]/5"
                  },
                  { 
                    icon: "M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3ZM19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8", 
                    title: "Audio", 
                    desc: "Voice & audio production",
                    count: "480+ services",
                    color: "from-[#F093FB] to-[#F5576C]",
                    bgColor: "from-[#F093FB]/10 to-[#F5576C]/5"
                  },
                  { 
                    icon: "m23 7-6 5 6 5VMx1 5h15v14H1z", 
                    title: "Video", 
                    desc: "Video production",
                    count: "720+ services",
                    color: "from-[#FDBB2D] to-[#22C1C3]",
                    bgColor: "from-[#FDBB2D]/10 to-[#22C1C3]/5"
                  }
                ].map((category, index) => (
                  <div 
                    key={index} 
                    className={`
                      group relative bg-gradient-to-br ${category.bgColor} backdrop-blur-sm 
                      rounded-xl p-6 cursor-pointer transition-all duration-500 
                      border border-transparent hover:border-white/10
                      hover:-translate-y-2 hover:shadow-xl hover:shadow-black/20
                      active:scale-95 select-none
                    `}
                    onClick={() => console.log(`Selected category: ${category.title}`)}
                  >
                    {/* Selection indicator */}
                    <div className="absolute top-2 right-2 w-4 h-4 rounded-full border-2 border-gray-600 group-hover:border-white/50 transition-colors duration-300 opacity-0 group-hover:opacity-100">
                      <div className="w-full h-full rounded-full bg-gradient-to-r from-[#9945FF] to-[#00a2ff] opacity-0 group-active:opacity-100 transition-opacity duration-200"></div>
                    </div>

                    {/* Category Icon */}
                    <div className={`mb-4 transform group-hover:scale-110 group-active:scale-105 transition-transform duration-300`}>
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} p-3 group-hover:shadow-lg transition-shadow duration-300`}>
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="24" 
                          height="24" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="white" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        >
                          <path d={category.icon}></path>
                        </svg>
                      </div>
                    </div>

                    {/* Category Info */}
                    <div className="space-y-2">
                      <h3 className="text-white font-semibold text-lg group-hover:text-white transition-colors duration-300">
                        {category.title}
                      </h3>
                      <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300 leading-snug">
                        {category.desc}
                      </p>
                      <div className={`text-xs font-medium bg-gradient-to-r ${category.color} bg-clip-text text-transparent group-hover:opacity-100 opacity-80 transition-opacity duration-300`}>
                        {category.count}
                      </div>
                    </div>

                    {/* Hover overlay effect */}
                    <div className={`
                      absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 
                      group-hover:opacity-5 group-active:opacity-10 
                      rounded-xl transition-opacity duration-300 pointer-events-none
                    `}></div>

                    {/* Click ripple effect */}
                    <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                      <div className={`
                        absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 
                        group-active:opacity-20 group-active:animate-ping 
                        transition-opacity duration-200
                      `}></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom section with popular searches */}
              <div className="mt-8 pt-6 border-t border-[#2a2a2a]/50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h4 className="text-white font-medium mb-2">Popular searches:</h4>
                    <div className="flex flex-wrap gap-2">
                      {["Logo Design", "Website Development", "Social Media", "Video Editing", "SEO"].map((tag, index) => (
                        <button 
                          key={index}
                          className="px-3 py-1.5 text-xs font-medium text-gray-300 bg-[#2a2a2a]/50 rounded-full hover:bg-[#9945FF]/20 hover:text-white border border-transparent hover:border-[#9945FF]/30 transition-all duration-300"
                          onClick={() => console.log(`Searched for: ${tag}`)}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    6,000+ categories available
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
          
          {/* Enhanced TrueFocus component */}
          <div className="w-full flex justify-center items-center my-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#9945FF]/20 to-[#00a2ff]/20 rounded-full blur-2xl"></div>
              <TrueFocus
                sentence="turn your ideas into reality"
                manualMode={false}
                blurAmount={2}
                borderColor="#9945FF"
                glowColor="rgba(153, 69, 255, 0.8)"
                animationDuration={0.4}
                pauseBetweenAnimations={0.2}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Featured Freelancers section */}
      <section className="py-8 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <FadeIn delay={0.2} duration={0.8} direction="up" className="mb-12">
            <div className="flex items-center mb-8">
              <div className="w-1.5 h-8 bg-gradient-to-b from-[#9945FF] to-[#00a2ff] mr-4 rounded-full"></div>
              <h2 className="text-2xl md:text-3xl font-bold text-white font-geist-sans">Popular</h2>
            </div>
          </FadeIn>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
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
                distance={30}
              >
                <div className="bg-gradient-to-br from-[#1a1a1a]/80 via-[#151515]/80 to-[#0f0f0f]/80 backdrop-blur-xl rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-[#9945FF]/10 transition-all duration-500 border border-[#2a2a2a]/50 hover:border-[#9945FF]/50 group hover:-translate-y-2">
                  <div className="aspect-video bg-gradient-to-br from-[#333]/50 to-[#222]/50 relative overflow-hidden">
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-[#9945FF] to-[#00a2ff] px-3 py-1.5 rounded-full text-xs text-white font-medium z-10 shadow-lg">
                      {freelancer.level}
                    </div>
                    <div className="w-full h-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-700">
                      <div className="text-4xl font-bold text-[#444] group-hover:text-[#666] transition-colors duration-500">
                        {freelancer.name.split(" ")[0][0]}{freelancer.name.split(" ")[1]?.[0] || ""}
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#9945FF] to-[#00a2ff] flex items-center justify-center text-sm text-white font-medium mr-3 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        {freelancer.name.split(" ")[0][0]}
                      </div>
                      <span className="text-base text-white font-medium">{freelancer.name}</span>
                    </div>
                    <p className="text-sm text-gray-300 mb-4 line-clamp-2 h-10 group-hover:text-white transition-colors duration-300 leading-relaxed">
                      {freelancer.title}
                    </p>
                    <div className="flex items-center mb-4">
                      <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                      <span className="text-base text-gray-200 ml-2 font-medium">{freelancer.rating}</span>
                      <span className="text-sm text-gray-400 ml-2">{freelancer.reviews}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-[#2a2a2a]/50 pt-4 group-hover:border-[#9945FF]/30 transition-colors duration-300">
                      <span className="text-sm text-gray-400 font-medium">From</span>
                      <span className="text-xl font-bold bg-gradient-to-r from-[#9945FF] to-[#00a2ff] bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                        {freelancer.price}
                      </span>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Recent Activity section */}
      <section className="py-16 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <FadeIn delay={0.2} duration={0.8} direction="up" className="mb-12">
            <div className="flex items-center mb-8">
              <div className="w-1.5 h-8 bg-gradient-to-b from-[#9945FF] to-[#00a2ff] mr-4 rounded-full"></div>
              <h2 className="text-2xl md:text-3xl font-bold text-white font-geist-sans">Popular</h2>
            </div>
          </FadeIn>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
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
                distance={30}
              >
                <div className="bg-gradient-to-br from-[#1a1a1a]/80 via-[#151515]/80 to-[#0f0f0f]/80 backdrop-blur-xl rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-[#9945FF]/10 transition-all duration-500 border border-[#2a2a2a]/50 hover:border-[#9945FF]/50 group hover:-translate-y-2">
                  <div className="aspect-video bg-gradient-to-br from-[#333]/50 to-[#222]/50 relative overflow-hidden">
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-[#9945FF] to-[#00a2ff] px-3 py-1.5 rounded-full text-xs text-white font-medium z-10 shadow-lg">
                      {service.level}
                    </div>
                    <div className="w-full h-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-700">
                      <div className="text-4xl font-bold text-[#444] group-hover:text-[#666] transition-colors duration-500">
                        {service.name.split(" ")[0][0]}{service.name.split(" ")[1]?.[0] || ""}
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#9945FF] to-[#00a2ff] flex items-center justify-center text-sm text-white font-medium mr-3 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        {service.name.split(" ")[0][0]}
                      </div>
                      <span className="text-base text-white font-medium">{service.name}</span>
                    </div>
                    <p className="text-sm text-gray-300 mb-4 line-clamp-2 h-10 group-hover:text-white transition-colors duration-300 leading-relaxed">
                      {service.title}
                    </p>
                    <div className="flex items-center mb-4">
                      <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                      <span className="text-base text-gray-200 ml-2 font-medium">{service.rating}</span>
                      <span className="text-sm text-gray-400 ml-2">{service.reviews}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-[#2a2a2a]/50 pt-4 group-hover:border-[#9945FF]/30 transition-colors duration-300">
                      <span className="text-sm text-gray-400 font-medium">From</span>
                      <span className="text-xl font-bold bg-gradient-to-r from-[#9945FF] to-[#B975FF] bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                        {service.price}
                      </span>
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