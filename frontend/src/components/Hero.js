import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiArrowDown, FiGithub, FiLinkedin, FiMail, FiZap, FiDownload } from 'react-icons/fi';

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
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800 pt-20"
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-aurora opacity-30"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.15),transparent_50%)]"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.1)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20"></div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-primary-400 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
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
            <div ref={subtitleRef} className="space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                I'm{' '}
                <span className="gradient-text-aurora animate-gradient">
                  Kuldeep Sengar
                </span>
              </h1>
              
              {/* Subtitle */}
              <h2 className="text-xl sm:text-2xl md:text-3xl text-gray-300 font-light">
                <span className="text-primary-400 font-semibold">Full Stack</span> Developer
              </h2>
            </div>
            
            {/* Description */}
            <p 
              ref={descriptionRef}
              className="text-base sm:text-lg text-gray-400 max-w-2xl leading-relaxed mx-auto lg:mx-0"
            >
              Crafting digital experiences with cutting-edge technology. 
              Passionate about clean code, innovative solutions, and pushing the boundaries of web development.
              Specializing in React, Node.js, and modern web technologies.
            </p>
            
            {/* Action Buttons */}
            <div 
              ref={buttonsRef}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <button
                onClick={scrollToAbout}
                className="group relative px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary-500/25 transform hover:-translate-y-1"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <FiZap className="group-hover:rotate-12 transition-transform" />
                  Explore My Work
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              
              <button className="group relative px-8 py-4 border-2 border-primary-500 text-primary-400 font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:bg-primary-500 hover:text-white hover:scale-105 transform hover:-translate-y-1">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <FiDownload className="group-hover:rotate-12 transition-transform" />
                  Download CV
                </span>
              </button>
            </div>
            
            {/* Social Links */}
            <div 
              ref={socialRef}
              className="flex justify-center lg:justify-start gap-4 pt-4"
            >
              <a
                href="https://github.com/kuldeep2thakur"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-primary-500/20 text-primary-400 hover:bg-primary-500 hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary-500/25 transform hover:-translate-y-1"
              >
                <FiGithub size={24} className="group-hover:rotate-12 transition-transform" />
              </a>
              
              <a
                href="https://www.linkedin.com/in/kuldeep-sengar-1a12a9330?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-secondary-500/20 text-secondary-400 hover:bg-secondary-500 hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-secondary-500/25 transform hover:-translate-y-1"
              >
                <FiLinkedin size={24} className="group-hover:rotate-12 transition-transform" />
              </a>
              
              <a
                href="mailto:kuldeepsengar5678@gmail.com"
                className="group p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-accent-500/20 text-accent-400 hover:bg-accent-500 hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-accent-500/25 transform hover:-translate-y-1"
              >
                <FiMail size={24} className="group-hover:rotate-12 transition-transform" />
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
                <div className="relative w-full h-full rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 p-1 animate-gradient">
                  <div className="w-full h-full rounded-full bg-dark-900 p-2">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-dark-800 to-dark-700 flex items-center justify-center relative overflow-hidden">
                      {/* Profile Image Placeholder */}
                      <div className="text-center p-8">
                        <img
                           src="/portfolio.jpg"
                           alt="Profile"
                           className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full object-cover mx-auto mb-4 shadow-lg animate-bounce"
                        />
                        <span className="text-gray-400 text-base sm:text-lg font-mono">
                          Kuldeep's Photo
                        </span>
                      </div>
                      
                      {/* Animated Border */}
                      {/* <div className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 bg-clip-border animate-gradient"></div> */}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div ref={floatingElementsRef} className="absolute inset-0">
                {/* Tech Stack Icons */}
                <div className="floating-icon absolute -top-6 -right-6 sm:-top-8 sm:-right-8 w-12 h-12 sm:w-16 sm:h-16 bg-primary-500/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-primary-500/30 animate-float">
                  <span className="text-lg sm:text-2xl">⚛️</span>
                </div>
                
                <div className="floating-icon absolute -bottom-6 -left-6 sm:-bottom-8 sm:-left-8 w-10 h-10 sm:w-12 sm:h-12 bg-secondary-500/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-secondary-500/30 animate-float" style={{animationDelay: '1s'}}>
                  <span className="text-base sm:text-xl">🟢</span>
                </div>
                
                <div className="floating-icon absolute top-1/2 -right-8 sm:-right-12 w-12 h-12 sm:w-14 sm:h-14 bg-accent-500/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-accent-500/30 animate-float" style={{animationDelay: '2s'}}>
                  <span className="text-base sm:text-xl">🔥</span>
                </div>
                
                <div className="floating-icon absolute top-1/4 -left-8 sm:-left-12 w-8 h-8 sm:w-10 sm:h-10 bg-primary-500/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-primary-500/30 animate-float" style={{animationDelay: '0.5s'}}>
                  <span className="text-sm sm:text-lg">⚡</span>
                </div>
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
