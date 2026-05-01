import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiArrowDown, FiGithub, FiLinkedin, FiMail, FiZap, FiDownload } from 'react-icons/fi';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const descriptionRef = useRef(null);
  const buttonsRef = useRef(null);
  const socialRef = useRef(null);
  const floatingElementsRef = useRef(null);
  const profileRef = useRef(null);

  const [profileData, setProfileData] = useState({ title: 'Full Stack Developer', resumeLink: '#', profileImage: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profSnap = await getDoc(doc(db, 'profile', 'main'));
        if (profSnap.exists()) {
          setProfileData(prev => ({ ...prev, ...profSnap.data() }));
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

  const scrollToAbout = () => {
    const element = document.querySelector('#about');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial animation timeline
      const tl = gsap.timeline();

      // Animate title with typewriter effect
      tl.fromTo(titleRef.current, 
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      )
      .fromTo(subtitleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
        "-=0.5"
      )
      .fromTo(descriptionRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
        "-=0.3"
      )
      .fromTo(buttonsRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
        "-=0.3"
      )
      .fromTo(socialRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
        "-=0.3"
      )
      .fromTo(profileRef.current,
        { opacity: 0, scale: 0.8, rotationY: -15 },
        { opacity: 1, scale: 1, rotationY: 0, duration: 1.2, ease: "back.out(1.7)" },
        "-=0.5"
      );

      // Floating elements animation
      gsap.to(floatingElementsRef.current, {
        y: -20,
        duration: 3,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1
      });

      // Parallax effect on scroll
      gsap.to(heroRef.current, {
        yPercent: -30,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

      // Stagger animation for floating icons
      gsap.fromTo(".floating-icon", 
        { opacity: 0, scale: 0, rotation: -180 },
        { 
          opacity: 1, 
          scale: 1, 
          rotation: 0, 
          duration: 1, 
          stagger: 0.2,
          ease: "back.out(1.7)",
          delay: 2
        }
      );

    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={heroRef}
      id="home" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0A0A0B] pt-20"
    >
      {/* Premium Minimalist Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Abstract floating gradients */}
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-primary-600/5 blur-[150px]"></div>
        <div className="absolute top-[40%] -right-[10%] w-[50%] h-[50%] rounded-full bg-secondary-600/5 blur-[150px]"></div>
        <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[60%] rounded-full bg-accent-600/5 blur-[150px]"></div>
        
        {/* Fine dotted mesh overlay for texture */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        {/* Vignette effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0A0A0B_100%)]"></div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-screen py-32">
          {/* Left Content - Text Section */}
          <div className="text-center lg:text-left space-y-8">
            {/* Greeting */}
            <div 
              ref={titleRef}
              className="space-y-4"
            >
            </div>

            {/* Main Title */}
            <div ref={subtitleRef} className="space-y-6">
              {/* Sleek Subtitle Tag */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
                <span className="text-sm sm:text-base text-gray-300 font-medium tracking-wide">{profileData.title}</span>
              </div>

              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-500 leading-[1.1] tracking-tight">
                Kuldeep Sengar.
              </h1>
            </div>
            
            {/* Description */}
            <p 
              ref={descriptionRef}
              className="text-lg sm:text-xl text-gray-400 max-w-2xl leading-relaxed mx-auto lg:mx-0 font-light"
            >
              Building exceptional digital experiences. I specialize in scalable web applications, beautiful interfaces, and robust backend architectures.
            </p>
            
            {/* Action Buttons */}
            <div 
              ref={buttonsRef}
              className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start pt-4"
            >
              <button
                onClick={scrollToAbout}
                className="group flex items-center justify-center gap-3 px-8 py-4 bg-white text-black font-bold rounded-full transition-all duration-300 hover:scale-105 hover:bg-gray-100 shadow-[0_0_40px_rgba(255,255,255,0.15)]"
              >
                <span>Explore Work</span>
                <FiZap className="group-hover:rotate-12 transition-transform" />
              </button>
              
              <a href={profileData.resumeLink} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-center gap-3 px-8 py-4 bg-transparent border border-gray-600 text-gray-300 font-bold rounded-full transition-all duration-300 hover:border-white hover:text-white hover:bg-white/5">
                <span>Download CV</span>
                <FiDownload className="group-hover:-translate-y-1 transition-transform" />
              </a>
            </div>
            
            {/* Social Links */}
            <div 
              ref={socialRef}
              className="flex justify-center lg:justify-start gap-6 pt-6"
            >
              <a
                href="https://github.com/kuldeep2thakur"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-300 hover:-translate-y-1 transform"
              >
                <FiGithub size={28} />
              </a>
              
              <a
                href="https://www.linkedin.com/in/kuldeep-sengar-1a12a9330?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-300 hover:-translate-y-1 transform"
              >
                <FiLinkedin size={28} />
              </a>
              
              <a
                href="mailto:kuldeepsengar5678@gmail.com"
                className="text-gray-400 hover:text-white transition-colors duration-300 hover:-translate-y-1 transform"
              >
                <FiMail size={28} />
              </a>
            </div>
          </div>
          
          {/* Right Content - 3D Profile Section */}
          <div className="flex justify-center lg:justify-end items-center">
            <div ref={profileRef} className="relative">
              {/* Main Profile Container */}
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
                {/* Glowing Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 via-secondary-500/20 to-accent-500/20 rounded-full blur-3xl animate-glow"></div>
                
                {/* Profile Image Container */}
                <div className="relative w-full h-full rounded-full p-[2px] bg-gradient-to-b from-gray-500/30 to-transparent backdrop-blur-md">
                  <div className="w-full h-full rounded-full bg-[#0A0A0B] p-2">
                    <div className="w-full h-full rounded-full flex items-center justify-center relative overflow-hidden border border-gray-800 bg-gray-900/50">
                      {/* Profile Image */}
                      <div className="w-full h-full relative group">
                        <img
                           src={profileData.profileImage || "/portfolio.jpg"}
                           alt="Kuldeep Sengar"
                           className="w-full h-full object-cover rounded-full shadow-2xl filter contrast-[1.05] brightness-95 transition-transform duration-700 group-hover:scale-105 group-hover:brightness-105"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements (Replaced emojis with sleek UI elements) */}
              <div ref={floatingElementsRef} className="absolute inset-0 pointer-events-none">
                {/* Decorative glowing dots instead of emojis */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary-500/30 rounded-full blur-md animate-pulse"></div>
                <div className="absolute -bottom-8 left-4 w-12 h-12 bg-secondary-500/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 -left-8 w-6 h-6 bg-accent-500/40 rounded-full blur-sm animate-pulse" style={{ animationDelay: '2s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <button
          onClick={scrollToAbout}
          className="p-3 rounded-full bg-primary-500/20 backdrop-blur-sm border border-primary-500/30 text-primary-400 hover:bg-primary-500 hover:text-white transition-all duration-300 hover:scale-110"
        >
          <FiArrowDown size={24} />
        </button>
      </div>
    </section>
  );
};

export default Hero;
