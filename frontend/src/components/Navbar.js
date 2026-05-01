import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { isDarkMode, toggleDarkMode } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Determine active section based on scroll position
      const sections = ['home', 'about', 'projects', 'contact'];
      let current = '';
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // If the section is currently in the viewport
          if (rect.top <= 100 && rect.bottom >= 100) {
            current = section;
            break;
          }
        }
      }
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '#home', id: 'home' },
    { name: 'About', href: '#about', id: 'about' },
    { name: 'Projects', href: '#projects', id: 'projects' },
    { name: 'Contact', href: '#contact', id: 'contact' }
  ];

  const scrollToSection = (href, id) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
    setIsOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 md:top-6 left-0 right-0 z-50 transition-all duration-500 flex justify-center px-4 sm:px-6`}
    >
      <div 
        className={`w-full max-w-5xl transition-all duration-500 flex items-center justify-between px-6 py-3 
          ${scrolled 
            ? 'bg-white/70 dark:bg-dark-900/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-200/50 dark:border-white/10 md:rounded-full rounded-2xl' 
            : 'bg-transparent border border-transparent'
          }`}
      >
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-2xl font-black tracking-tighter"
        >
          <Link to="/" className="flex items-center gap-2">
            <span className={`transition-colors ${(!scrolled || isDarkMode) ? 'text-white' : 'text-gray-900'}`}>KUL</span>
            <span className="text-primary-600 dark:text-primary-500">DEEP.</span>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1 relative">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => scrollToSection(item.href, item.id)}
              className={`relative px-5 py-2 text-sm font-semibold transition-colors duration-300 rounded-full
                ${activeSection === item.id 
                  ? 'text-white' 
                  : (!scrolled || isDarkMode)
                    ? 'text-gray-300 hover:text-primary-400'
                    : 'text-gray-600 hover:text-primary-600'
                }`}
            >
              {activeSection === item.id && (
                <motion.div
                  layoutId="active-nav-pill"
                  className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full -z-10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{item.name}</span>
            </button>
          ))}
          
          <div className={`w-px h-6 mx-2 ${(!scrolled || isDarkMode) ? 'bg-dark-600' : 'bg-gray-300'}`}></div>
          
          {/* Dark Mode Toggle */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleDarkMode}
            className={`p-2.5 rounded-full transition-colors duration-200 shadow-inner
              ${(!scrolled || isDarkMode) 
                ? 'bg-dark-800/80 text-gray-300 hover:bg-dark-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
          </motion.button>
        </div>

        {/* Mobile Menu Buttons */}
        <div className="md:hidden flex items-center space-x-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleDarkMode}
            className={`p-2.5 rounded-full shadow-inner transition-colors
              ${(!scrolled || isDarkMode) 
                ? 'bg-dark-800/80 text-gray-300' 
                : 'bg-gray-100 text-gray-700'
              }`}
          >
            {isDarkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(!isOpen)}
            className={`p-2.5 rounded-full transition-colors
              ${(!scrolled || isDarkMode) 
                ? 'bg-primary-900/50 text-primary-400' 
                : 'bg-primary-100 text-primary-600'
              }`}
          >
            {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-[110%] left-4 right-4 bg-white/95 dark:bg-dark-900/95 backdrop-blur-xl shadow-2xl rounded-2xl border border-gray-200/50 dark:border-white/10 overflow-hidden md:hidden"
          >
            <div className="flex flex-col p-4 space-y-1">
              {navItems.map((item, i) => (
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={item.name}
                  onClick={() => scrollToSection(item.href, item.id)}
                  className={`px-4 py-3 text-left rounded-xl font-semibold transition-all
                    ${activeSection === item.id 
                      ? 'bg-gradient-to-r from-primary-600/10 to-secondary-600/10 text-primary-600 dark:text-primary-400' 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-800'
                    }`}
                >
                  {item.name}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
