'use client';

// Safeguard against window.fetch being defined as a read-only getter in sandboxed iframes
if (typeof window !== 'undefined') {
  try {
    const originalFetch = window.fetch;
    let customFetch = originalFetch;
    Object.defineProperty(window, 'fetch', {
      get() {
        return customFetch;
      },
      set(val) {
        customFetch = val;
      },
      configurable: true,
      enumerable: true
    });
  } catch (e) {
    // Ignore error silently to prevent boot failures
  }
}

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Lenis from 'lenis';
import { 
  Languages, 
  ChevronRight, 
  ChevronDown, 
  Check, 
  CheckCircle2, 
  ArrowRight, 
  Lock, 
  Bell, 
  Shield, 
  Info, 
  Phone, 
  MapPin, 
  Globe, 
  Copy, 
  ExternalLink, 
  FileText, 
  X, 
  Menu, 
  ArrowUpRight, 
  Download, 
  AlertTriangle, 
  Calendar, 
  ListTodo, 
  Bot, 
  Send, 
  Smartphone, 
  Sparkles, 
  Clock, 
  Compass, 
  HelpCircle, 
  Heart, 
  Smile 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { translations, languages, TranslationType } from '@/lib/translations';

import { SplitText } from '@/components/reactbits/SplitText';
import { ShinyText } from '@/components/reactbits/ShinyText';
import { BackgroundLines } from '@/components/aceternity/BackgroundLines';
import { HoverBorderGradient } from '@/components/aceternity/HoverBorderGradient';
import { HoverEffect } from '@/components/aceternity/HoverEffect';

export default function Home() {
  // State for selected language (null on start to prevent hydration mismatch)
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [isLangLoaded, setIsLangLoaded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'features' | 'sofia' | 'how-it-works' | 'faq' | 'roadmap'>('features');
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  // Active section tracking for highlighting menu
  const [activeSection, setActiveSection] = useState('hero');

  // FAQ expanded items state
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // INTERACTIVE PHONE MOCKUP STATES
  const [phoneScreen, setPhoneScreen] = useState<'stato' | 'portale' | 'ricevuta' | 'sofia'>('stato');
  const [isScanning, setIsScanning] = useState(false);
  const [scanCompleted, setScanCompleted] = useState(false);
  const [checkedDocs, setCheckedDocs] = useState<boolean[]>([false, false, false, false, false, false]);
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'sofia'; text: string }>>([]);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isSofiaTyping, setIsSofiaTyping] = useState(false);
  const [copiedPec, setCopiedPec] = useState(false);

  // Mouse interactive 3D tilt for mockup
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({
    transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg)',
    transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
  });
  const handlePhoneMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -12; // tilt max 12 degrees
    const rotateY = ((x - centerX) / centerX) * 12;
    setTiltStyle({
      transform: `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      transition: 'transform 0.1s ease-out'
    });
  };
  const handlePhoneMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg)',
      transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
    });
  };

  // References for scrolling
  const featuresRef = useRef<HTMLDivElement>(null);
  const sofiaRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);
  const roadmapRef = useRef<HTMLDivElement>(null);

  // Load language from LocalStorage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('soggiorno_lang');
    if (savedLang && translations[savedLang]) {
      setTimeout(() => {
        setSelectedLang(savedLang);
      }, 0);
    }
    setTimeout(() => {
      setIsLangLoaded(true);
    }, 0);
  }, []);

  // Initialize Lenis buttery smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Initialize chat history when language changes
  useEffect(() => {
    if (selectedLang) {
      const t = translations[selectedLang];
      setTimeout(() => {
        setChatHistory([{ sender: 'sofia', text: t.appSofiaWelcome }]);
      }, 0);
    }
  }, [selectedLang]);

  // Handle active section scrolling highlights
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 100;
      
      const sections = [
        { id: 'hero', top: 0 },
        { id: 'why-track', top: (document.getElementById('why-track')?.offsetTop || 0) - 200 },
        { id: 'features', top: (document.getElementById('features')?.offsetTop || 0) - 200 },
        { id: 'sofia', top: (document.getElementById('sofia')?.offsetTop || 0) - 200 },
        { id: 'how-it-works', top: (document.getElementById('how-it-works')?.offsetTop || 0) - 200 },
        { id: 'faq', top: (document.getElementById('faq')?.offsetTop || 0) - 200 },
        { id: 'roadmap', top: (document.getElementById('roadmap')?.offsetTop || 0) - 200 },
      ];

      for (let i = sections.length - 1; i >= 0; i--) {
        if (scrollPos >= sections[i].top) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Copy PEC email helper
  const handleCopyPec = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedPec(true);
    setTimeout(() => setCopiedPec(false), 2000);
  };

  // Document checklist toggle helper
  const handleToggleDoc = (index: number) => {
    const next = [...checkedDocs];
    next[index] = !next[index];
    setCheckedDocs(next);
  };

  // Triggering virtual scan animation
  const handleStartScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanCompleted(true);
      setPhoneScreen('stato');
    }, 2500);
  };

  // Triggering Sofia AI Chat
  const handleAskSofia = async (promptText: string) => {
    if (!promptText.trim() || isSofiaTyping) return;

    // Add user message to history
    const userMsg = promptText;
    setChatHistory(prev => [...prev, { sender: 'user', text: userMsg }]);
    setCustomPrompt('');
    setIsSofiaTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          language: selectedLang === 'ar' ? 'Arabic' : selectedLang === 'it' ? 'Italian' : selectedLang === 'fr' ? 'French' : selectedLang === 'es' ? 'Spanish' : 'English',
        }),
      });

      const data = await response.json();
      if (data.reply) {
        setChatHistory(prev => [...prev, { sender: 'sofia', text: data.reply }]);
      } else {
        setChatHistory(prev => [...prev, { sender: 'sofia', text: "I'm having trouble connecting right now. Please try again." }]);
      }
    } catch (err) {
      console.error(err);
      setChatHistory(prev => [...prev, { sender: 'sofia', text: "Connection error. Please verify your internet connection." }]);
    } finally {
      setIsSofiaTyping(false);
    }
  };

  // Helper translation object
  const t: TranslationType = selectedLang ? translations[selectedLang] : translations['it'];
  const isRTL = selectedLang === 'ar';

  const scrollToRef = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMobileMenuOpen(false);
  };

  // Select language handler
  const handleSelectLanguage = (langCode: string) => {
    setSelectedLang(langCode);
    localStorage.setItem('soggiorno_lang', langCode);
  };

  if (!isLangLoaded) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-[#008C45] border-t-transparent animate-spin"></div>
          <p className="text-gray-500 font-mono text-sm">Soggiorno Track...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen transition-all duration-300 bg-slate-50/50", isRTL ? "font-sans text-right" : "font-sans text-left")} dir={isRTL ? "rtl" : "ltr"}>
      
      {/* 1. FULL SCREEN LANGUAGE SELECTION OVERLAY */}
      <AnimatePresence>
        {!selectedLang && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xl flex flex-col items-center justify-center p-6 overflow-y-auto relative"
          >
            {/* Background Mesh Gradient */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden">
              <div className="absolute top-[-10%] left-[-10%] w-[700px] h-[700px] rounded-full bg-emerald-500/20 blur-[150px]"></div>
              <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] rounded-full bg-rose-500/20 blur-[150px]"></div>
            </div>

            <motion.div 
              initial={{ y: 30, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-xl w-full bg-white/95 backdrop-blur-md rounded-[2.5rem] shadow-[0_32px_80px_-16px_rgba(0,0,0,0.12)] border border-slate-100/80 p-8 md:p-12 text-center flex flex-col items-center relative overflow-hidden z-10"
            >
              {/* Decoration Top flag bar */}
              <div className="absolute top-0 left-0 w-full h-1.5 flex">
                <div className="flex-1 bg-emerald-600"></div>
                <div className="flex-1 bg-slate-100"></div>
                <div className="flex-1 bg-rose-600"></div>
              </div>

              {/* App Logo Emblem */}
              <div className="relative w-20 h-20 mb-8 rounded-[2rem] bg-gradient-to-tr from-emerald-50 to-rose-50 flex items-center justify-center shadow-xs border border-slate-100">
                <div className="w-14 h-14 rounded-[1.25rem] bg-white flex flex-col items-center justify-center relative overflow-hidden shadow-xs border border-slate-100">
                  {/* Subtle decorative ring */}
                  <div className="absolute inset-0 border border-dashed border-emerald-500/20 rounded-[1.25rem] animate-[spin_40s_linear_infinite]"></div>
                  
                  {/* Document graphic */}
                  <div className="relative w-6 h-8 border border-emerald-600 rounded-md bg-white flex flex-col justify-between p-1">
                    {/* Dog ear fold */}
                    <div className="absolute top-0 right-0 w-2 h-2 bg-emerald-600 rounded-bl-xs"></div>
                    {/* Document route path */}
                    <svg className="w-full h-full text-slate-200" viewBox="0 0 24 32">
                      <path d="M4 22 C 8 20, 12 14, 16 22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                      <circle cx="4" cy="22" r="3" fill="#059669" />
                      <circle cx="16" cy="22" r="3" fill="#e11d48" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Dynamic Welcome Heading */}
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
                Benvenuto
              </h2>
              
              <p className="text-slate-500 mb-8 text-sm md:text-base max-w-sm leading-relaxed font-medium">
                Choose your preferred language to begin your Permesso di Soggiorno journey.
              </p>

              {/* Language Selection Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md mb-8">
                {languages.map((lang, index) => (
                  <motion.button
                    key={lang.code}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 + index * 0.05, duration: 0.3 }}
                    onClick={() => handleSelectLanguage(lang.code)}
                    className="group relative flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 hover:bg-white border border-slate-100/80 hover:border-emerald-500/40 transition-all duration-300 text-left cursor-pointer shadow-2xs hover:shadow-md hover:-translate-y-0.5"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl filter drop-shadow-sm group-hover:scale-110 transition-transform duration-300">
                        {lang.flag}
                      </span>
                      <div>
                        <p className="font-bold text-slate-800 text-sm group-hover:text-emerald-700 transition-colors">
                          {lang.label}
                        </p>
                        <p className="text-[9px] text-slate-400 font-mono tracking-wider font-semibold">
                          {lang.code.toUpperCase()} • {lang.dir.toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                  </motion.button>
                ))}
              </div>

              {/* Secure note */}
              <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-4">
                Independent Immigration Companion • Non-Governmental App
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RENDER THE MAIN WEBSITE ONLY IF LANGUAGE IS SELECTED */}
      {selectedLang && (
        <div className="relative overflow-hidden bg-slate-50/40 min-h-screen">
          
          {/* Background Mesh Gradient */}
          <div className="absolute inset-0 z-0 opacity-15 pointer-events-none overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[700px] h-[700px] rounded-full bg-emerald-500/10 blur-[150px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] rounded-full bg-rose-500/10 blur-[150px]"></div>
          </div>
          
          {/* Italian flag top strip */}
          <div className="fixed top-0 left-0 w-full h-1 z-40 flex">
            <div className="w-1/3 h-full bg-emerald-600"></div>
            <div className="w-1/3 h-full bg-white"></div>
            <div className="w-1/3 h-full bg-rose-600"></div>
          </div>

          {/* 2. PREMIUM STICKY NAVBAR */}
          <header className="sticky top-1 left-0 w-full z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-[0_2px_20px_rgba(0,0,0,0.01)] transition-all">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
              
              {/* Logo branding */}
              <a href="#" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 via-slate-100 to-rose-600 p-0.5 shadow-xs">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                    <div className="relative w-5 h-7 border border-emerald-600 rounded bg-white flex items-center justify-center">
                      <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-emerald-600 rounded-bl-xs"></div>
                      <div className="w-3 h-0.5 bg-emerald-600/20 mb-1"></div>
                      <div className="w-3 h-0.5 bg-emerald-600/20"></div>
                    </div>
                  </div>
                </div>
                <div>
                  <span className="font-bold text-slate-900 tracking-tight text-lg group-hover:text-emerald-700 transition-colors block leading-tight">
                    Soggiorno Track
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono tracking-widest uppercase block mt-0.5">
                    Companion App
                  </span>
                </div>
              </a>

              {/* Desktop Menu links */}
              <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-semibold text-slate-600">
                <button 
                  onClick={() => scrollToRef(featuresRef)}
                  className={cn("hover:text-slate-900 cursor-pointer transition-all relative py-2", activeSection === 'features' ? "text-emerald-700 font-bold" : "text-slate-500")}
                >
                  {t.navFeatures}
                  {activeSection === 'features' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 rounded-full"></span>}
                </button>
                <button 
                  onClick={() => scrollToRef(sofiaRef)}
                  className={cn("hover:text-slate-900 cursor-pointer transition-all relative py-2", activeSection === 'sofia' ? "text-emerald-700 font-bold" : "text-slate-500")}
                >
                  {t.navSofia}
                  {activeSection === 'sofia' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 rounded-full"></span>}
                </button>
                <button 
                  onClick={() => scrollToRef(howItWorksRef)}
                  className={cn("hover:text-slate-900 cursor-pointer transition-all relative py-2", activeSection === 'how-it-works' ? "text-emerald-700 font-bold" : "text-slate-500")}
                >
                  {t.navHowItWorks}
                  {activeSection === 'how-it-works' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 rounded-full"></span>}
                </button>
                <button 
                  onClick={() => scrollToRef(faqRef)}
                  className={cn("hover:text-slate-900 cursor-pointer transition-all relative py-2", activeSection === 'faq' ? "text-emerald-700 font-bold" : "text-slate-500")}
                >
                  {t.navFAQ}
                  {activeSection === 'faq' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 rounded-full"></span>}
                </button>
                <button 
                  onClick={() => scrollToRef(roadmapRef)}
                  className={cn("hover:text-slate-900 cursor-pointer transition-all relative py-2", activeSection === 'roadmap' ? "text-emerald-700 font-bold" : "text-slate-500")}
                >
                  {t.navRoadmap}
                  {activeSection === 'roadmap' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 rounded-full"></span>}
                </button>
              </nav>

              {/* Header Right Actions */}
              <div className="hidden md:flex items-center gap-4">
                
                {/* Language Picker Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                    className="flex items-center gap-2 px-3.5 py-2 border border-slate-200 hover:border-emerald-500/30 rounded-full text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 transition-all shadow-2xs cursor-pointer"
                  >
                    <Languages className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{languages.find(l => l.code === selectedLang)?.flag}</span>
                    <span>{languages.find(l => l.code === selectedLang)?.label}</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>

                  <AnimatePresence>
                    {isLangDropdownOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className={cn("absolute top-full mt-2 w-44 bg-white border border-slate-100 rounded-2xl shadow-xl p-1.5 z-50", isRTL ? "left-0" : "right-0")}
                      >
                        {languages.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => {
                              handleSelectLanguage(lang.code);
                              setIsLangDropdownOpen(false);
                            }}
                            className={cn(
                              "flex items-center justify-between w-full px-3 py-2 text-xs rounded-xl hover:bg-slate-50 transition-colors cursor-pointer",
                              selectedLang === lang.code ? "text-emerald-700 bg-emerald-50/50 font-bold" : "text-slate-700 font-semibold"
                            )}
                          >
                            <span className="flex items-center gap-2">
                              <span>{lang.flag}</span>
                              <span>{lang.label}</span>
                            </span>
                            {selectedLang === lang.code && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Primary CTA button */}
                <button 
                  onClick={() => scrollToRef(faqRef)} // Download is further down, FAQ links to Play store
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-bold transition-all duration-300 shadow-sm hover:shadow shadow-emerald-600/15 hover:scale-102 cursor-pointer flex items-center gap-2"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{t.navDownload}</span>
                </button>
              </div>

              {/* Mobile Menu Trigger */}
              <div className="flex md:hidden items-center gap-3">
                <button 
                  onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                  className="flex items-center justify-center w-9 h-9 border border-slate-200 rounded-full bg-white shadow-2xs"
                >
                  <span className="text-lg">{languages.find(l => l.code === selectedLang)?.flag}</span>
                </button>
                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>

            </div>

            {/* Mobile language float panel */}
            <AnimatePresence>
              {isLangDropdownOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-150 p-4 shadow-xl z-50">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 text-center">Select Language</p>
                  <div className="grid grid-cols-2 gap-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          handleSelectLanguage(lang.code);
                          setIsLangDropdownOpen(false);
                        }}
                        className={cn(
                          "flex items-center gap-2 p-2.5 rounded-xl text-xs border transition-all justify-center font-bold",
                          selectedLang === lang.code ? "bg-emerald-600 text-white border-transparent" : "bg-slate-50 text-slate-700 border-slate-100"
                        )}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </AnimatePresence>

            {/* Mobile Menu expanded drawer */}
            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="md:hidden bg-white border-b border-slate-100 overflow-hidden"
                >
                  <div className="px-4 pt-2 pb-6 flex flex-col gap-4 text-sm font-bold text-slate-700">
                    <button 
                      onClick={() => scrollToRef(featuresRef)}
                      className="text-left py-2.5 hover:text-emerald-600 border-b border-slate-50"
                    >
                      {t.navFeatures}
                    </button>
                    <button 
                      onClick={() => scrollToRef(sofiaRef)}
                      className="text-left py-2.5 hover:text-emerald-600 border-b border-slate-50"
                    >
                      {t.navSofia}
                    </button>
                    <button 
                      onClick={() => scrollToRef(howItWorksRef)}
                      className="text-left py-2.5 hover:text-emerald-600 border-b border-slate-50"
                    >
                      {t.navHowItWorks}
                    </button>
                    <button 
                      onClick={() => scrollToRef(faqRef)}
                      className="text-left py-2.5 hover:text-emerald-600 border-b border-slate-50"
                    >
                      {t.navFAQ}
                    </button>
                    <button 
                      onClick={() => scrollToRef(roadmapRef)}
                      className="text-left py-2.5 hover:text-emerald-600 border-b border-slate-50"
                    >
                      {t.navRoadmap}
                    </button>

                    <button 
                      onClick={() => scrollToRef(faqRef)}
                      className="w-full mt-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-center shadow-md font-bold flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>{t.navDownload}</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </header>

          {/* 3. BREATHTAKING HERO SECTION */}
          <section id="hero" className="relative overflow-hidden border-b border-slate-100">
            <BackgroundLines className="pt-8 pb-20 md:py-24 lg:py-32">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                  
                  {/* Hero Information */}
                  <div className={cn(
                    "lg:col-span-7 flex flex-col items-center",
                    isRTL ? "lg:items-end text-center lg:text-right" : "lg:items-start text-center lg:text-left"
                  )}>
                    
                    {/* Premium floating badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full text-xs font-bold text-emerald-800 mb-6 shadow-2xs">
                      <Shield className="w-3.5 h-3.5 text-emerald-600" />
                      <ShinyText text={t.heroBadge} speed={4} className="text-emerald-800 text-xs font-extrabold" />
                    </div>
  
                    {/* Main Header Title */}
                    <h1 className={cn(
                      "text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 max-w-2xl",
                      isRTL ? "tracking-normal leading-normal sm:leading-normal lg:leading-relaxed" : "tracking-tight leading-[1.08]"
                    )}>
                      <SplitText text={t.heroHeadline} className="font-extrabold text-slate-900" />
                    </h1>
  
                    {/* Subtitle */}
                    <p className="text-base sm:text-lg text-slate-500 mb-8 max-w-xl leading-relaxed font-semibold">
                      {t.heroSubtitle}
                    </p>
  
                    {/* CTA Buttons */}
                    <div className={cn(
                      "flex flex-col sm:flex-row gap-3.5 w-full sm:w-auto mb-8 items-center justify-center",
                      isRTL ? "lg:justify-end" : "lg:justify-start"
                    )}>
                      <HoverBorderGradient 
                        onClick={() => {
                          const dl = document.getElementById('download');
                          if (dl) dl.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="text-emerald-900 bg-white hover:bg-emerald-50/40 rounded-2xl cursor-pointer"
                      >
                        <Download className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{t.heroDownloadCTA}</span>
                      </HoverBorderGradient>
  
                      <button 
                        onClick={() => scrollToRef(featuresRef)}
                        className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-2xl text-sm font-bold shadow-2xs hover:shadow-sm hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2 h-[52px]"
                      >
                        <span>{t.heroExploreCTA}</span>
                        <ArrowRight className={cn("w-4 h-4 text-slate-400", isRTL && "rotate-180")} />
                      </button>
                    </div>

                  {/* Trust warning subtext */}
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                    <Info className="w-4 h-4 text-slate-300" />
                    <span>{t.heroSubtext}</span>
                  </div>

                </div>

                {/* Hero Interactive Phone Mockup */}
                <div 
                  className="lg:col-span-5 flex justify-center"
                  onMouseMove={handlePhoneMouseMove}
                  onMouseLeave={handlePhoneMouseLeave}
                >
                  <motion.div 
                    className="relative w-full max-w-[320px]"
                    style={tiltStyle}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {/* Glowing flag decorative backdrop behind the phone */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-rose-500/10 rounded-[48px] filter blur-2xl transform rotate-3 -z-10 scale-105 opacity-80"></div>
                    
                    {/* PHONE WRAPPER */}
                    <div className="relative border-[8px] border-slate-900 bg-slate-900 rounded-[3rem] shadow-[0_30px_70px_rgba(15,23,42,0.18)] overflow-hidden w-full aspect-[9/19] flex flex-col select-none">
                      
                      {/* Notch / Dynamic Island */}
                      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-24 h-4.5 bg-slate-950 rounded-full z-30 flex items-center justify-center shadow-inner">
                        <div className="w-2 h-2 bg-slate-900 rounded-full ml-auto mr-3.5 border border-slate-800/40"></div>
                        <div className="w-1 h-1 bg-slate-900 rounded-full mr-3.5 border border-slate-800/40"></div>
                      </div>

                      {/* Status Bar */}
                      <div className="bg-slate-50/50 backdrop-blur-md h-9 px-6 pt-2.5 flex items-center justify-between text-[10px] font-bold text-slate-400 z-20 border-b border-slate-100">
                        <span>09:41</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px]">5G</span>
                          <div className="w-4 h-2.5 border border-slate-300 rounded-xs p-0.5 flex items-center">
                            <div className="w-full h-full bg-slate-400 rounded-3xs"></div>
                          </div>
                        </div>
                      </div>

                      {/* PHYSICAL SCREEN AREA */}
                      <div className="flex-1 bg-[#f8fafc] flex flex-col text-left relative overflow-hidden" dir="ltr">
                        <AnimatePresence mode="wait">
                          {phoneScreen === 'stato' && (
                            <motion.div 
                              key="stato"
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              transition={{ duration: 0.2 }}
                              className="p-4 flex flex-col gap-3.5 flex-1 overflow-y-auto"
                            >
                            
                            {/* App Header bar */}
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center p-1 border border-emerald-500/10">
                                  <svg className="w-full h-full text-emerald-600" viewBox="0 0 24 32" fill="none" stroke="currentColor" strokeWidth="3">
                                    <path d="M4 22 C 8 20, 12 14, 16 22" />
                                    <circle cx="4" cy="22" r="2" fill="currentColor" />
                                    <circle cx="16" cy="22" r="2" fill="currentColor" />
                                  </svg>
                                </div>
                                <span className="font-bold text-slate-800 text-xs tracking-tight">Soggiorno Track</span>
                              </div>
                              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[8px] font-black shadow-2xs">
                                KE
                              </div>
                            </div>

                            {/* Guideline Banner */}
                            <div className="bg-gradient-to-r from-emerald-50 to-white hover:from-emerald-100/50 border border-emerald-100 rounded-xl p-3 flex items-center justify-between shadow-2xs transition-colors cursor-pointer">
                              <div>
                                <span className="text-[9px] text-emerald-800 font-extrabold block mb-0.5">📚 {t.appGuideBanner}</span>
                                <span className="text-[9px] text-slate-500 leading-snug font-semibold block max-w-[170px]">{t.appGuideSubtitle}</span>
                              </div>
                              <ChevronRight className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            </div>

                            {/* App Horizontal Filter Tabs */}
                            <div className="flex gap-1 overflow-x-auto pb-0.5 scrollbar-none">
                              <span className="px-2.5 py-1 bg-emerald-600 text-white text-[9px] font-extrabold rounded-full shadow-2xs whitespace-nowrap">Stato</span>
                              <span className="px-2.5 py-1 bg-white text-slate-500 text-[9px] font-bold rounded-full border border-slate-100 whitespace-nowrap">Appuntamenti & AI</span>
                              <span className="px-2.5 py-1 bg-white text-slate-500 text-[9px] font-bold rounded-full border border-slate-100 whitespace-nowrap">Analisi & Portali</span>
                            </div>

                            {/* Core status card */}
                            <div className="bg-white border border-slate-100 rounded-xl p-3.5 shadow-2xs relative overflow-hidden">
                              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-rose-500"></div>
                              <div className="flex justify-between items-center mb-1.5">
                                <FileText className="w-4.5 h-4.5 text-emerald-600" />
                                <span className="text-[8px] bg-emerald-50 text-emerald-700 border border-emerald-100 font-extrabold px-1.5 py-0.5 rounded-full">Tracciamento Attivo</span>
                              </div>
                              <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">{t.appStatusTitle}</p>
                              <p className="text-xs font-extrabold text-slate-800 tracking-tight leading-snug mb-1.5">
                                {scanCompleted ? "Documento Pronto per Consegna" : t.appStatusWait}
                              </p>
                              {scanCompleted && (
                                <p className="text-[9px] text-emerald-800 font-bold flex items-center gap-1 bg-emerald-50 border border-emerald-100 p-1.5 rounded-lg leading-tight">
                                  <Check className="w-3 h-3 stroke-[3]" />
                                  <span>Il permesso è stampato e pronto!</span>
                                </p>
                              )}
                            </div>

                            {/* Portal status checker indicators */}
                            <div className="grid grid-cols-2 gap-2.5">
                              <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shadow-3xs hover:border-slate-200 transition-colors">
                                <span className="text-[8px] font-bold text-slate-400 tracking-wider">STATO PORTALE</span>
                                <span className="text-[10px] font-extrabold text-slate-700 mt-1 block">
                                  {scanCompleted ? "Pronto" : "Non Verificato"}
                                </span>
                                <span className="text-[8px] text-slate-400 font-semibold mt-0.5">{scanCompleted ? "Pratiche OK" : "Controlla ora"}</span>
                              </div>
                              <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shadow-3xs hover:border-slate-200 transition-colors">
                                <span className="text-[8px] font-bold text-slate-400 tracking-wider">POLIZIA STATO</span>
                                <span className="text-[10px] font-extrabold text-slate-700 mt-1 block">
                                  {scanCompleted ? "Pronto" : "Non Verificato"}
                                </span>
                                <span className="text-[8px] text-slate-400 font-semibold mt-0.5">{scanCompleted ? "Tessera stampata" : "Controlla ora"}</span>
                              </div>
                            </div>

                            {/* Piacenza Questura card inside mock */}
                            <div className="bg-white border border-slate-100 rounded-xl p-3.5 shadow-3xs flex flex-col gap-1 mt-auto">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                                  <span className="text-[10px] font-bold text-slate-800 leading-none">{t.appQuesturaPiacenza}</span>
                                </div>
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                              </div>
                              <p className="text-[9px] text-slate-400 leading-normal font-semibold -mt-0.5">{t.appAddress}</p>
                            </div>

                          </motion.div>
                        )}

                        {phoneScreen === 'portale' && (
                          <motion.div 
                            key="portale"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className="p-4 flex flex-col gap-3.5 flex-1 overflow-y-auto"
                          >
                            <span className="text-xs font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{t.appQuesturaPiacenza}</span>
                            </span>

                            <div className="grid grid-cols-3 gap-1.5">
                              <span className="py-1.5 bg-white hover:bg-emerald-50 rounded-lg border border-slate-100 text-[9px] font-extrabold text-center text-slate-600 block transition-all shadow-3xs cursor-pointer">
                                📞 {t.appCall}
                              </span>
                              <span className="py-1.5 bg-white hover:bg-emerald-50 rounded-lg border border-slate-100 text-[9px] font-extrabold text-center text-slate-600 block transition-all shadow-3xs cursor-pointer">
                                🗺️ {t.appMap}
                              </span>
                              <span className="py-1.5 bg-white hover:bg-emerald-50 rounded-lg border border-slate-100 text-[9px] font-extrabold text-center text-slate-600 block transition-all shadow-3xs cursor-pointer">
                                🌐 {t.appWeb}
                              </span>
                            </div>

                            <div className="bg-white border border-slate-100 rounded-xl p-3 shadow-3xs">
                              <span className="text-[9px] text-emerald-700 font-extrabold block mb-0.5">⏱️ {t.appHoursTitle}</span>
                              <span className="text-[9px] text-slate-500 leading-normal font-semibold block">{t.appHoursDesc}</span>
                            </div>

                            <div className="bg-slate-900 text-slate-100 rounded-xl p-3 shadow-xs flex items-center justify-between border border-slate-800">
                              <div className="overflow-hidden mr-2">
                                <span className="text-[7px] font-extrabold text-emerald-400 block tracking-wider uppercase">PEC CERTIFIED MAIL</span>
                                <span className="text-[9px] text-slate-300 block font-mono truncate">immig.quest.pc@pecps.poliziadistato.it</span>
                              </div>
                              <button 
                                onClick={() => handleCopyPec('immig.quest.pc@pecps.poliziadistato.it')}
                                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-colors"
                              >
                                {copiedPec ? <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                              </button>
                            </div>

                            <div className="bg-white border border-slate-100 rounded-xl p-3 shadow-3xs">
                              <span className="text-[9px] text-rose-700 font-extrabold block mb-0.5">📅 {t.appAvgWaitTitle}</span>
                              <span className="text-[9px] text-slate-500 block leading-normal font-semibold">{t.appAvgWaitDesc}</span>
                            </div>

                            {/* Floating scan click simulator */}
                            <div className="mt-auto pt-2">
                              {isScanning ? (
                                <div className="relative overflow-hidden w-full py-3.5 bg-gradient-to-r from-emerald-600 to-rose-600 text-white rounded-xl text-center text-[10px] font-bold shadow-md">
                                  {/* Scanning pulsing laser indicator */}
                                  <div className="absolute top-0 left-0 w-full h-full bg-emerald-500/20 animate-pulse"></div>
                                  <span className="relative z-10 flex items-center justify-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                                    <span>{t.appCheckNow}...</span>
                                  </span>
                                  <div className="absolute top-0 left-0 w-full h-0.5 bg-emerald-400 shadow-md animate-[bounce_2s_infinite]"></div>
                                </div>
                              ) : (
                                <button 
                                  onClick={handleStartScan}
                                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-center text-[10px] font-extrabold shadow-sm active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                                >
                                  <Sparkles className="w-3.5 h-3.5" />
                                  <span>{t.appCheckNow}</span>
                                </button>
                              )}
                            </div>

                          </motion.div>
                        )}

                        {phoneScreen === 'ricevuta' && (
                          <motion.div 
                            key="ricevuta"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className="p-4 flex flex-col gap-3.5 flex-1 overflow-y-auto"
                          >
                            
                            {/* Appointments block inside mock */}
                            <div className="bg-white border border-slate-100 rounded-xl p-3 shadow-3xs">
                              <span className="text-[8px] text-slate-400 font-bold tracking-wider block uppercase">{t.appAppointmentsTitle}</span>
                              <span className="text-[10px] text-slate-500 block leading-normal font-semibold mt-1">{t.appNoAppointment}</span>
                            </div>

                            {/* Checkbox item documents list with live progress */}
                            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-3xs flex-1 flex flex-col gap-2.5">
                              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                                <span className="text-xs font-bold text-slate-800 tracking-tight">{t.appChecklistTitle}</span>
                                <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-100/50 px-2 py-0.5 rounded-full">
                                  {checkedDocs.filter(Boolean).length}/6 Ready
                                </span>
                              </div>

                              {/* Progress loading bar */}
                              <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-emerald-500 transition-all duration-300"
                                  style={{ width: `${(checkedDocs.filter(Boolean).length / 6) * 100}%` }}
                                ></div>
                              </div>

                              {/* Interactive checkable documents */}
                              <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[140px] pr-1 mt-1">
                                {[
                                  t.appChecklistDoc1,
                                  t.appChecklistDoc2,
                                  t.appChecklistDoc3,
                                  t.appChecklistDoc4,
                                  t.appChecklistDoc5,
                                  t.appChecklistDoc6,
                                ].map((doc, idx) => (
                                  <div 
                                    key={idx}
                                    onClick={() => handleToggleDoc(idx)}
                                    className="flex items-center gap-2 py-1.5 px-2 bg-slate-50 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                                  >
                                    <div className={cn(
                                      "w-3.5 h-3.5 rounded border flex items-center justify-center transition-all shrink-0",
                                      checkedDocs[idx] ? "bg-emerald-600 border-transparent text-white" : "border-slate-300 bg-white"
                                    )}>
                                      {checkedDocs[idx] && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                    </div>
                                    <span className={cn(
                                      "text-[9.5px] font-bold leading-snug",
                                      checkedDocs[idx] ? "text-slate-400 line-through" : "text-slate-600"
                                    )}>
                                      {doc}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                          </motion.div>
                        )}

                        {phoneScreen === 'sofia' && (
                          <motion.div 
                            key="sofia"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className="p-3 flex flex-col gap-3 flex-1 overflow-y-auto"
                          >
                            {/* Sofia avatar card */}
                            <div className="bg-white border border-slate-100 rounded-xl p-2.5 shadow-3xs flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-white relative shadow-2xs">
                                <Bot className="w-4 h-4" />
                                <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-400 border border-white rounded-full"></span>
                              </div>
                              <div>
                                <span className="text-[9px] font-extrabold text-slate-800 block leading-tight">{t.appSofiaExpert}</span>
                                <span className="text-[7.5px] text-slate-400 block leading-none">Specialized Companion AI</span>
                              </div>
                            </div>

                            {/* Conversational container history */}
                            <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2 max-h-[170px]">
                              {chatHistory.map((chat, i) => (
                                <div 
                                  key={i}
                                  className={cn(
                                    "p-2.5 rounded-xl text-[9px] leading-relaxed max-w-[85%] shadow-3xs font-semibold",
                                    chat.sender === 'user' 
                                      ? "bg-emerald-600 text-white ml-auto" 
                                      : "bg-white text-slate-600 border border-slate-100"
                                  )}
                                >
                                  {chat.text}
                                </div>
                              ))}
                              {isSofiaTyping && (
                                <div className="p-2.5 rounded-xl text-[9px] bg-white border border-slate-100 text-slate-400 max-w-[85%] self-start flex items-center gap-1 shadow-3xs">
                                  <span className="w-1 h-1 bg-emerald-600 rounded-full animate-bounce"></span>
                                  <span className="w-1 h-1 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                  <span className="w-1 h-1 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                </div>
                              )}
                            </div>

                            {/* Quick Suggestion Chips */}
                            <div className="flex gap-1 overflow-x-auto pb-0.5 scrollbar-none">
                              {[
                                selectedLang === 'ar' ? 'هل إيصال البريد كافٍ للسفر؟' : selectedLang === 'it' ? 'Posso viaggiare?' : 'Can I travel?',
                                selectedLang === 'ar' ? 'ما هي الأوراق المطلوبة؟' : selectedLang === 'it' ? 'Documenti necessari?' : 'What documents?',
                                selectedLang === 'ar' ? 'كم تكلفة الإقامة؟' : selectedLang === 'it' ? 'Quanto costa?' : 'How much is it?',
                              ].map((chip, idx) => (
                                <button 
                                  key={idx}
                                  onClick={() => handleAskSofia(chip)}
                                  disabled={isSofiaTyping}
                                  className="px-2.5 py-1 bg-white hover:bg-emerald-50 rounded-lg border border-slate-100 text-[8.5px] font-bold text-slate-500 whitespace-nowrap cursor-pointer transition-colors active:scale-95"
                                >
                                  {chip}
                                </button>
                              ))}
                            </div>

                            {/* Custom prompt text submission box */}
                            <div className="flex gap-1 mt-auto pt-1">
                              <input 
                                type="text"
                                value={customPrompt}
                                onChange={(e) => setCustomPrompt(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAskSofia(customPrompt)}
                                placeholder="Ask Sofia..."
                                className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-[9px] focus:outline-none focus:border-emerald-500 font-semibold"
                                disabled={isSofiaTyping}
                              />
                              <button 
                                onClick={() => handleAskSofia(customPrompt)}
                                disabled={isSofiaTyping}
                                className="w-6.5 h-6.5 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white flex items-center justify-center cursor-pointer transition-all shrink-0 shadow-2xs"
                              >
                                <Send className="w-3 h-3" />
                              </button>
                            </div>

                          </motion.div>
                        )}
                        </AnimatePresence>

                      </div>

                      {/* BOTTOM SMARTPHONE BAR NAVIGATION */}
                      <div className="bg-white border-t border-slate-100 px-4 py-2 flex items-center justify-between text-slate-400 z-20">
                        <button 
                          onClick={() => setPhoneScreen('stato')}
                          className={cn("flex flex-col items-center gap-0.5 cursor-pointer transition-colors", phoneScreen === 'stato' ? "text-emerald-600" : "hover:text-slate-500")}
                        >
                          <Smartphone className="w-3.5 h-3.5" />
                          <span className="text-[7px] font-extrabold uppercase tracking-wide">Stato</span>
                        </button>
                        <button 
                          onClick={() => setPhoneScreen('portale')}
                          className={cn("flex flex-col items-center gap-0.5 cursor-pointer transition-colors", phoneScreen === 'portale' ? "text-emerald-600" : "hover:text-slate-500")}
                        >
                          <MapPin className="w-3.5 h-3.5" />
                          <span className="text-[7px] font-extrabold uppercase tracking-wide">Questura</span>
                        </button>
                        <button 
                          onClick={() => setPhoneScreen('ricevuta')}
                          className={cn("flex flex-col items-center gap-0.5 cursor-pointer transition-colors", phoneScreen === 'ricevuta' ? "text-emerald-600" : "hover:text-slate-500")}
                        >
                          <ListTodo className="w-3.5 h-3.5" />
                          <span className="text-[7px] font-extrabold uppercase tracking-wide">Ricevuta</span>
                        </button>
                        <button 
                          onClick={() => setPhoneScreen('sofia')}
                          className={cn("flex flex-col items-center gap-0.5 cursor-pointer transition-colors", phoneScreen === 'sofia' ? "text-emerald-600" : "hover:text-slate-500")}
                        >
                          <Bot className="w-3.5 h-3.5" />
                          <span className="text-[7px] font-extrabold uppercase tracking-wide">Sofia AI</span>
                        </button>
                      </div>

                      {/* Apple Home Indicator */}
                      <div className="bg-white h-4.5 flex items-center justify-center z-20">
                        <div className="w-20 h-1 bg-slate-900 rounded-full mb-1"></div>
                      </div>

                    </div>
                  </motion.div>
                </div>

              </div>
            </div>
            </BackgroundLines>
          </section>

          {/* EXTRA: "WHY SOGGIORNO TRACK?" COMPARISON SECTION */}
          <section id="why-track" className="py-24 bg-white border-t border-b border-slate-100 relative overflow-hidden">
            {/* Background glowing effects */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none overflow-hidden">
              <div className="absolute top-[10%] left-[5%] w-[450px] h-[450px] rounded-full bg-rose-500/5 blur-[120px]"></div>
              <div className="absolute bottom-[10%] right-[5%] w-[450px] h-[450px] rounded-full bg-emerald-500/5 blur-[120px]"></div>
            </div>

            <motion.div 
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              
              {/* Section Header */}
              <div className="text-center max-w-3xl mx-auto mb-16">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-100">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    {selectedLang === 'it' ? 'Il Nostro Valore' : 
                     selectedLang === 'fr' ? 'Notre Valeur' : 
                     selectedLang === 'es' ? 'Nuestro Valor' : 
                     selectedLang === 'ar' ? 'قيمتنا' : 'Our Value'}
                  </span>
                </div>
                <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
                  {t.compareTitle}
                </h2>
                <p className="text-base sm:text-lg text-slate-500 leading-relaxed max-w-xl mx-auto font-medium">
                  {t.compareSubtitle}
                </p>
              </div>

              {/* Head-to-Head Key Metrics Bar */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
                <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-6 flex items-center justify-between shadow-2xs">
                  <div>
                    <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest font-mono">
                      {selectedLang === 'it' ? 'Livello di Ansia' : 
                       selectedLang === 'fr' ? "Niveau d'Anxiété" : 
                       selectedLang === 'es' ? 'Nivel de Ansiedad' : 
                       selectedLang === 'ar' ? 'مستوى القلق' : 'Anxiety Level'}
                    </p>
                    <div className="flex items-baseline gap-2.5 mt-1.5">
                      <span className="text-rose-500 font-bold line-through text-xs">95%</span>
                      <span className="text-emerald-600 font-black text-2xl tracking-tight">5%</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                    <Smile className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-6 flex items-center justify-between shadow-2xs">
                  <div>
                    <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest font-mono">
                      {selectedLang === 'it' ? 'Barriera Linguistica' : 
                       selectedLang === 'fr' ? 'Barrière de la Langue' : 
                       selectedLang === 'es' ? 'Barrera Lingüística' : 
                       selectedLang === 'ar' ? 'عائق اللغة' : 'Language Barrier'}
                    </p>
                    <div className="flex items-baseline gap-2.5 mt-1.5">
                      <span className="text-rose-500 font-bold line-through text-xs">Solo ITA</span>
                      <span className="text-emerald-600 font-black text-2xl tracking-tight">5 Lingue</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                    <Languages className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-6 flex items-center justify-between shadow-2xs">
                  <div>
                    <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest font-mono">
                      {selectedLang === 'it' ? 'Pronto all\'Uso' : 
                       selectedLang === 'fr' ? 'Prêt à l\'Emploi' : 
                       selectedLang === 'es' ? 'Listo para Usar' : 
                       selectedLang === 'ar' ? 'جاهز للاستخدام' : 'Ready to Go'}
                    </p>
                    <div className="flex items-baseline gap-2.5 mt-1.5">
                      <span className="text-rose-500 font-bold line-through text-xs">Incertezza</span>
                      <span className="text-emerald-600 font-black text-2xl tracking-tight">100% Offline</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                    <Lock className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Grid Side-by-Side Comparison */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl mx-auto">
                
                {/* TRADITIONAL WAY (Red Accent) */}
                <div className="bg-gradient-to-br from-rose-50/10 via-white to-white border border-rose-100/50 rounded-[2rem] p-8 md:p-10 relative overflow-hidden shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 shadow-3xs">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <span className="text-[9px] font-black tracking-widest text-rose-700 bg-rose-50 px-3 py-1 rounded-full uppercase border border-rose-100/60">
                        {selectedLang === 'it' ? 'CONFUZIONE E ANSIA' : 
                         selectedLang === 'fr' ? 'CONFUS & STRESSANT' : 
                         selectedLang === 'es' ? 'CONFUSO Y ESTRESANTE' : 
                         selectedLang === 'ar' ? 'مربك ومجهد' : 'CONFUSING & STRESSFUL'}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-black text-slate-800 mb-6">{t.compareTraditional}</h3>
                    
                    <ul className="space-y-4 mb-8 text-sm text-slate-500 leading-relaxed font-semibold">
                      <li className="flex gap-3 items-start">
                        <span className="text-rose-600 font-bold text-lg leading-none mt-0.5">✕</span>
                        <span>{t.compareTrad1}</span>
                      </li>
                      <li className="flex gap-3 items-start">
                        <span className="text-rose-600 font-bold text-lg leading-none mt-0.5">✕</span>
                        <span>{t.compareTrad2}</span>
                      </li>
                      <li className="flex gap-3 items-start">
                        <span className="text-rose-600 font-bold text-lg leading-none mt-0.5">✕</span>
                        <span>{t.compareTrad3}</span>
                      </li>
                    </ul>
                  </div>

                  {/* High Fidelity Mockup - The Traditional Experience */}
                  <div className="mt-4 pt-6 border-t border-rose-50 bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-rose-400"></div>
                        <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                        <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                      </div>
                      <span className="text-[9px] font-bold font-mono text-slate-400">portale.immigrazione.it</span>
                    </div>
                    
                    {/* Simulated crash banner */}
                    <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-4 text-center">
                      <AlertTriangle className="w-7 h-7 text-rose-600 mx-auto mb-2 animate-[pulse_2s_infinite]" />
                      <p className="text-xs font-extrabold text-slate-800">
                        {selectedLang === 'it' ? 'Sito non raggiungibile' : 
                         selectedLang === 'fr' ? 'Site inaccessible' : 
                         selectedLang === 'es' ? 'Sitio no accesible' : 
                         selectedLang === 'ar' ? 'الموقع غير متاح' : 'Site is temporarily unavailable'}
                      </p>
                      <p className="text-[9px] text-slate-400 font-bold font-mono mt-1 uppercase tracking-wider">
                        ERR_CONNECTION_TIMED_OUT (Error 504)
                      </p>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 opacity-30">
                      <div className="h-4.5 bg-slate-200 rounded-xs"></div>
                      <div className="h-4.5 bg-slate-200 rounded-xs"></div>
                    </div>
                  </div>
                </div>

                {/* SOGGIORNO TRACK WAY (Green Accent) */}
                <div className="bg-gradient-to-br from-emerald-50/10 via-white to-white border border-emerald-100 rounded-[2rem] p-8 md:p-10 relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-3xs">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <span className="text-[9px] font-black tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase border border-emerald-100/60">
                        {selectedLang === 'it' ? 'CHIARO E TRANQUILLO' : 
                         selectedLang === 'fr' ? 'CLAIR & SÈREIN' : 
                         selectedLang === 'es' ? 'CLARO Y TRANQUILO' : 
                         selectedLang === 'ar' ? 'واضح وهادئ' : 'STREAMLINED & CALM'}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-black text-slate-800 mb-6">{t.compareApp}</h3>
                    
                    <ul className="space-y-4 mb-8 text-sm text-slate-500 leading-relaxed font-semibold">
                      <li className="flex gap-3 items-start">
                        <span className="text-emerald-600 font-bold text-lg leading-none mt-0.5">✓</span>
                        <span>{t.compareApp1}</span>
                      </li>
                      <li className="flex gap-3 items-start">
                        <span className="text-emerald-600 font-bold text-lg leading-none mt-0.5">✓</span>
                        <span>{t.compareApp2}</span>
                      </li>
                      <li className="flex gap-3 items-start">
                        <span className="text-emerald-600 font-bold text-lg leading-none mt-0.5">✓</span>
                        <span>{t.compareApp3}</span>
                      </li>
                    </ul>
                  </div>

                  {/* High Fidelity Mockup - Soggiorno Track Experience */}
                  <div className="mt-4 pt-6 border-t border-emerald-50 bg-emerald-50/10 rounded-xl p-4 border border-emerald-50/40 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-emerald-100/50">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-600"></div>
                        <span className="text-[9px] font-black tracking-wider text-emerald-700 font-mono">SOGGIORNO TRACK</span>
                      </div>
                      <span className="text-[8px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full uppercase">
                        {selectedLang === 'it' ? 'ATTIVO' : 
                         selectedLang === 'fr' ? 'ACTIF' : 
                         selectedLang === 'es' ? 'ACTIVO' : 
                         selectedLang === 'ar' ? 'نشط' : 'ACTIVE'}
                      </span>
                    </div>

                    {/* App mini notification */}
                    <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-2xs flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[11px] font-extrabold text-slate-800 leading-none">
                          {selectedLang === 'it' ? 'Permesso Pronto!' : 
                           selectedLang === 'fr' ? 'Permis Prêt !' : 
                           selectedLang === 'es' ? '¡Permiso Listo!' : 
                           selectedLang === 'ar' ? 'التصريح جاهز!' : 'Permit Ready!'}
                        </p>
                        <p className="text-[9px] text-slate-500 font-semibold mt-1">
                          {selectedLang === 'it' ? 'Pronto per il ritiro alla Questura.' : 
                           selectedLang === 'fr' ? 'Prêt à être récupéré à la Questure.' : 
                           selectedLang === 'es' ? 'Listo para recoger en la Questura.' : 
                           selectedLang === 'ar' ? 'جاهز للاستلام من الكويستورا.' : 'Ready for collection at the Questura.'}
                        </p>
                      </div>
                    </div>

                    {/* Sofia AI bubble */}
                    <div className="mt-3 bg-emerald-500/5 rounded-xl p-2.5 border border-emerald-500/10 flex items-start gap-2.5">
                      <Bot className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <p className="text-[10px] text-slate-600 leading-tight font-semibold">
                        <span className="font-bold text-emerald-700">Sofia AI: </span>
                        {selectedLang === 'it' ? 'Ho controllato i documenti per te. Porta 4 fototessere e la marca da bollo!' : 
                         selectedLang === 'fr' ? 'J\'ai vérifié vos documents. Apportez 4 photos et le timbre fiscal !' : 
                         selectedLang === 'es' ? 'Revisé tus documentos. ¡Lleva 4 fotos y la marca da bollo!' : 
                         selectedLang === 'ar' ? 'لقد راجعت مستنداتك. أحضر 4 صور شخصية وطابع البريد!' : 'I verified your checklist. Bring 4 recent photos and your tax stamp!'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>

          {/* 4. APP FEATURE SERVICES SECTION (BENTO GRID STYLE) */}
          <section id="features" ref={featuresRef} className="py-24 bg-slate-50 relative overflow-hidden">
            {/* Ambient pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a03_1px,transparent_1px),linear-gradient(to_bottom,#0f172a03_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
            
            <motion.div 
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              
              {/* Features header */}
              <div className="text-center max-w-3xl mx-auto mb-20">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200/60 text-slate-800 text-xs font-bold uppercase tracking-wider mb-4 border border-slate-300/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Designed for Immigrants</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                  {t.featuresTitle}
                </h2>
                <p className="text-base sm:text-lg text-slate-500 max-w-xl mx-auto font-medium">
                  {t.featuresSubtitle}
                </p>
              </div>

              {/* Bento Grid Design Layout */}
              <HoverEffect 
                items={[
                  {
                    title: t.featStatusTitle,
                    description: t.featStatusDesc,
                    icon: <Smartphone className="w-5 h-5" />,
                    badge: "Interactive Demo: Stato",
                    colSpan: "md:col-span-3",
                    onClick: () => setPhoneScreen('stato')
                  },
                  {
                    title: t.featChecklistTitle,
                    description: t.featChecklistDesc,
                    icon: <ListTodo className="w-5 h-5" />,
                    badge: "Interactive Demo: Ricevuta",
                    colSpan: "md:col-span-3",
                    onClick: () => setPhoneScreen('ricevuta')
                  },
                  {
                    title: t.featNotifyTitle,
                    description: t.featNotifyDesc,
                    icon: <Bell className="w-5 h-5" />,
                    colSpan: "md:col-span-2"
                  },
                  {
                    title: t.featOfflineTitle,
                    description: t.featOfflineDesc,
                    icon: <Lock className="w-5 h-5" />,
                    colSpan: "md:col-span-2"
                  },
                  {
                    title: t.featGuidesTitle,
                    description: t.featGuidesDesc,
                    icon: <FileText className="w-5 h-5" />,
                    colSpan: "md:col-span-2"
                  }
                ]}
              />

            </motion.div>
          </section>

          {/* 5. DEDICATED SOFIA AI SECTION (WITH EXPANDED CHAT EXPERIENCE) */}
          <section id="sofia" ref={sofiaRef} className="py-24 bg-white relative overflow-hidden border-b border-slate-100">
            {/* Background glowing halo */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-emerald-500/5 to-rose-500/5 blur-[140px] pointer-events-none"></div>

            <motion.div 
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Description details */}
                <div className="lg:col-span-5 text-center lg:text-left">
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-full text-xs font-bold mb-6">
                    <Bot className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t.sofiaBadge}</span>
                  </span>
                  
                  <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
                    {t.sofiaTitle}
                  </h2>
                  
                  <p className="text-base text-slate-500 mb-8 leading-relaxed font-semibold">
                    {t.sofiaDesc}
                  </p>

                  <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 max-w-md mx-auto lg:mx-0 text-left">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <Smile className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest font-mono">Sofia&apos;s Promise</p>
                      <p className="text-xs text-slate-600 leading-normal font-bold mt-1">Empathetic translation and practical solutions, strictly keeping your questions local and secure.</p>
                    </div>
                  </div>
                </div>

                {/* Large active Sofia AI chat preview widget */}
                <div className="lg:col-span-7">
                  <div className="bg-slate-50 border border-slate-100/80 rounded-[2.5rem] p-6 sm:p-8 shadow-sm max-w-xl mx-auto">
                    
                    {/* Chat title bar */}
                    <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-emerald-600 flex items-center justify-center text-white relative shadow-sm">
                          <Bot className="w-6 h-6" />
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full"></span>
                        </div>
                        <div className="text-left">
                          <span className="font-extrabold text-slate-800 text-sm block">{t.appSofiaExpert}</span>
                          <span className="text-[10px] text-slate-400 font-semibold block">{t.sofiaDisclaimer}</span>
                        </div>
                      </div>
                      <div className="px-3 py-1 bg-white border border-slate-200 text-[9px] font-black tracking-wider rounded-full text-emerald-700 font-mono">
                        GEMINI POWERED
                      </div>
                    </div>

                    {/* Chat container scrolling area */}
                    <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 mb-6">
                      {chatHistory.map((chat, i) => (
                        <div 
                          key={i} 
                          className={cn(
                            "p-3.5 rounded-2xl text-xs leading-relaxed max-w-[85%] font-semibold",
                            chat.sender === 'user' 
                              ? "bg-slate-900 text-white ml-auto rounded-tr-xs shadow-3xs" 
                              : "bg-white text-slate-600 border border-slate-100 rounded-tl-xs shadow-3xs"
                          )}
                        >
                          {chat.text}
                        </div>
                      ))}
                      {isSofiaTyping && (
                        <div className="p-3.5 rounded-2xl text-xs bg-white border border-slate-100 text-slate-400 max-w-[85%] flex items-center gap-1.5 shadow-3xs rounded-tl-xs">
                          <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce"></span>
                          <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                          <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                        </div>
                      )}
                    </div>

                    {/* Predefined prompts helper */}
                    <div className="mb-6">
                      <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest font-mono mb-3 text-left">Frequently Asked by Immigrants</p>
                      <div className="flex flex-wrap gap-2 justify-start">
                        {[
                          selectedLang === 'ar' ? 'هل يمكنني السفر بالإيصال؟' : selectedLang === 'it' ? 'Come funziona il rinnovo?' : 'Can I work with a student permit?',
                          selectedLang === 'ar' ? 'ماذا أفعل لو فقدت العمل؟' : selectedLang === 'it' ? 'Cosa succede se perdo il lavoro?' : 'What is the "marca da bollo"?',
                        ].map((prompt, i) => (
                          <button 
                            key={i}
                            onClick={() => handleAskSofia(prompt)}
                            disabled={isSofiaTyping}
                            className="px-3.5 py-2 bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/20 text-xs font-bold text-slate-600 rounded-xl cursor-pointer transition-all active:scale-95 whitespace-nowrap shadow-3xs"
                          >
                            {prompt}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom submission inputs */}
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAskSofia(customPrompt)}
                        placeholder={t.sofiaPromptPlaceholder}
                        className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors shadow-3xs"
                        disabled={isSofiaTyping}
                      />
                      <button 
                        onClick={() => handleAskSofia(customPrompt)}
                        disabled={isSofiaTyping}
                        className="px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center cursor-pointer transition-colors active:scale-95 shadow-2xs"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                </div>

              </div>
            </motion.div>
          </section>

          {/* 6. HOW IT WORKS TIMELINE SECTION */}
          <section id="how-it-works" ref={howItWorksRef} className="py-24 bg-slate-50 relative overflow-hidden">
            {/* Ambient pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a02_1px,transparent_1px),linear-gradient(to_bottom,#0f172a02_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              
              {/* Timeline headers */}
              <div className="text-center max-w-3xl mx-auto mb-20">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">Interactive Pathway</span>
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mt-4 mb-4">
                  {t.timelineTitle}
                </h2>
                <p className="text-base sm:text-lg text-slate-500 font-medium">
                  {t.timelineSubtitle}
                </p>
              </div>

              {/* Steps Layout Grid */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative">
                
                {/* Horizontal timeline connect line (Only visible on desktop) */}
                <div className="hidden md:block absolute top-[44px] left-[10%] right-[10%] h-[2px] bg-slate-200/80 -z-10"></div>

                {[
                  { num: '1', title: t.step1Title, desc: t.step1Desc },
                  { num: '2', title: t.step2Title, desc: t.step2Desc },
                  { num: '3', title: t.step3Title, desc: t.step3Desc },
                  { num: '4', title: t.step4Title, desc: t.step4Desc },
                  { num: '5', title: t.step5Title, desc: t.step5Desc },
                ].map((step, idx) => (
                  <div key={idx} className="flex flex-col items-center text-center px-2 group">
                    {/* Circle badge identifier */}
                    <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center font-bold text-base text-emerald-600 mb-6 relative group-hover:scale-105 transition-transform duration-300">
                      {step.num}
                      {/* Soft glowing border */}
                      <span className="absolute inset-0.5 rounded-lg border border-dashed border-emerald-600/30"></span>
                    </div>
                    <h3 className="font-extrabold text-slate-800 text-sm mb-2.5 tracking-tight">{step.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-semibold">{step.desc}</p>
                  </div>
                ))}

              </div>

            </div>
          </section>

          {/* EXTRA: STORIES / SUCCESS TIMELINE */}
          <section id="stories" className="py-24 bg-white border-b border-slate-100 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="text-center max-w-3xl mx-auto mb-20">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">Real Journeys</span>
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mt-4 mb-4">
                  {t.storiesTitle}
                </h2>
                <p className="text-base sm:text-lg text-slate-500 font-medium">
                  {t.storiesSubtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                
                {/* Story 1 */}
                <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-100 rounded-3xl p-8 shadow-2xs relative overflow-hidden group hover:border-emerald-200 transition-all duration-300">
                  <div className="flex gap-4 items-center mb-5">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-lg font-black text-emerald-600 shadow-3xs">
                      Y
                    </div>
                    <div className="text-left">
                      <h4 className="font-extrabold text-slate-800 text-sm">{t.story1Name}</h4>
                      <p className="text-[10px] text-emerald-600 font-bold font-mono uppercase tracking-wider mt-0.5">{t.story1Type}</p>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold italic">
                    &ldquo;{t.story1Text}&rdquo;
                  </p>
                </div>

                {/* Story 2 */}
                <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-100 rounded-3xl p-8 shadow-2xs relative overflow-hidden group hover:border-rose-200 transition-all duration-300">
                  <div className="flex gap-4 items-center mb-5">
                    <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-lg font-black text-rose-600 shadow-3xs">
                      F
                    </div>
                    <div className="text-left">
                      <h4 className="font-extrabold text-slate-800 text-sm">{t.story2Name}</h4>
                      <p className="text-[10px] text-rose-600 font-bold font-mono uppercase tracking-wider mt-0.5">{t.story2Type}</p>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold italic">
                    &ldquo;{t.story2Text}&rdquo;
                  </p>
                </div>

              </div>

            </div>
          </section>

          {/* 7. SUPPORTED LANGUAGES SECTION (WITH RTL TOGGLE LIVE SIMULATION) */}
          <section className="py-24 bg-slate-50 relative overflow-hidden border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Map description panel */}
                <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left">
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full block mb-4">Multilingual Care</span>
                  <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                    {t.langSectionTitle}
                  </h2>
                  <p className="text-base text-slate-500 leading-relaxed mb-8 max-w-xl font-semibold">
                    {t.langSectionDesc}
                  </p>

                  <div className="flex flex-wrap gap-2.5 justify-center lg:justify-start">
                    {languages.map((l) => (
                      <button 
                        key={l.code}
                        onClick={() => handleSelectLanguage(l.code)}
                        className={cn(
                          "px-4 py-2 border rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-3xs",
                          selectedLang === l.code 
                            ? "bg-slate-900 border-slate-900 text-white scale-105" 
                            : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900"
                        )}
                      >
                        <span className="text-sm leading-none">{l.flag}</span>
                        <span>{l.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Animated visual representation globe map / list */}
                <div className="lg:col-span-7">
                  <div className="bg-white border border-slate-100 rounded-[2rem] p-6 sm:p-8 shadow-sm flex flex-col gap-6 max-w-lg mx-auto relative overflow-hidden">
                    
                    {/* Glowing background circles representing map coordinates */}
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full border border-dashed border-emerald-500/10 animate-[spin_30s_linear_infinite]"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-40 h-40 rounded-full border border-dashed border-rose-500/10 animate-[spin_40s_linear_reverse_infinite]"></div>

                    <div className="flex justify-between items-center pb-4 border-b border-slate-100 relative z-10">
                      <div className="text-left">
                        <span className="text-[10px] font-black text-slate-400 block uppercase font-mono tracking-wider">Active Layout Engine</span>
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-tight mt-0.5 block">
                          {selectedLang === 'ar' ? 'RTL Mode Enabled' : 'LTR Mode Enabled'}
                        </span>
                      </div>
                      <span className="text-3xl filter drop-shadow-sm">{languages.find(l => l.code === selectedLang)?.flag}</span>
                    </div>

                    <div className="space-y-4 relative z-10">
                      {/* Interactive translation visual card demonstration */}
                      <div className={cn("p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm font-bold text-slate-800 transition-all shadow-3xs", selectedLang === 'ar' ? 'text-right' : 'text-left')} dir={selectedLang === 'ar' ? 'rtl' : 'ltr'}>
                        {selectedLang === 'it' && "✓ Soggiorno Track semplifica l'immigrazione italiana per tutti."}
                        {selectedLang === 'en' && "✓ Soggiorno Track simplifies Italian immigration for everyone."}
                        {selectedLang === 'fr' && "✓ Soggiorno Track simplifie l'immigration italienne pour tous."}
                        {selectedLang === 'es' && "✓ Soggiorno Track simplifica la inmigración italiana para todos."}
                        {selectedLang === 'ar' && "✓ يسهل Soggiorno Track إجراءات الهجرة الإيطالية للجميع."}
                      </div>

                      <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed font-semibold text-left">
                        Notice how the content directions, align parameters, margins, and icons dynamically mirror themselves instantly when selecting Arabic. Pristine native experience for every single resident.
                      </p>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* 8. PRIVACY FIRST SECTION */}
          <section className="py-24 bg-white relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Lock graphics panel */}
                <div className="lg:col-span-5 flex justify-center order-last lg:order-first">
                  <div className="relative w-full max-w-[280px]">
                    <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-rose-500/5 rounded-3xl blur-md pointer-events-none"></div>
                    <div className="bg-gradient-to-br from-white to-slate-50 border border-slate-100 rounded-[2rem] p-8 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
                      {/* Glowing security emblem */}
                      <div className="w-14 h-14 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-6 shadow-3xs">
                        <Lock className="w-6 h-6" />
                      </div>
                      <p className="font-extrabold text-slate-800 text-lg mb-1">100% Secure</p>
                      <p className="text-xs text-slate-400 font-bold max-w-[180px] leading-relaxed">No databases. No tracking. Complete anonymity.</p>
                    </div>
                  </div>
                </div>

                {/* Privacy detail panel */}
                <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full block mb-4">Offline Sovereignty</span>
                  <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                    {t.privacyTitle}
                  </h2>
                  <p className="text-base text-slate-500 leading-relaxed mb-8 max-w-xl font-semibold">
                    {t.privacyDesc}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full text-left">
                    <div className="p-6 border border-slate-100 rounded-2xl bg-slate-50 shadow-3xs">
                      <h4 className="font-extrabold text-slate-800 text-sm mb-2">{t.privacySec1Title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed font-semibold">{t.privacySec1Desc}</p>
                    </div>
                    <div className="p-6 border border-slate-100 rounded-2xl bg-slate-50 shadow-3xs">
                      <h4 className="font-extrabold text-slate-800 text-sm mb-2">{t.privacySec2Title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed font-semibold">{t.privacySec2Desc}</p>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </section>

          {/* EXTRA: DEVELOPMENT ROADMAP */}
          <section id="roadmap" ref={roadmapRef} className="py-24 bg-slate-50 border-t border-b border-slate-100 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">The Future</span>
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mt-4 mb-4">
                  {t.roadmapTitle}
                </h2>
                <p className="text-base sm:text-lg text-slate-500 font-medium">
                  {t.roadmapSubtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                
                {/* Road 1 */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-2xs flex flex-col justify-between hover:border-emerald-200 transition-colors duration-300">
                  <div>
                    <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 border border-emerald-100/60 px-2.5 py-1 rounded-full uppercase block w-fit mb-4">Phase 1</span>
                    <h4 className="font-extrabold text-slate-800 text-base mb-2.5 tracking-tight">{t.road1Title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                      {t.road1Desc}
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold font-mono uppercase tracking-wider block mt-6">Development Started</span>
                </div>

                {/* Road 2 */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-2xs flex flex-col justify-between hover:border-indigo-200 transition-colors duration-300">
                  <div>
                    <span className="text-[9px] font-black text-indigo-700 bg-indigo-50 border border-indigo-100/60 px-2.5 py-1 rounded-full uppercase block w-fit mb-4">Phase 2</span>
                    <h4 className="font-extrabold text-slate-800 text-base mb-2.5 tracking-tight">{t.road2Title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                      {t.road2Desc}
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold font-mono uppercase tracking-wider block mt-6">Planning Stage</span>
                </div>

                {/* Road 3 */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-2xs flex flex-col justify-between hover:border-amber-200 transition-colors duration-300">
                  <div>
                    <span className="text-[9px] font-black text-amber-700 bg-amber-50 border border-amber-100/60 px-2.5 py-1 rounded-full uppercase block w-fit mb-4">Phase 3</span>
                    <h4 className="font-extrabold text-slate-800 text-base mb-2.5 tracking-tight">{t.road3Title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                      {t.road3Desc}
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold font-mono uppercase tracking-wider block mt-6">Research Stage</span>
                </div>

              </div>

            </div>
          </section>

          {/* EXTRA: PARTNERS & OFFICIAL RESOURCES TRUST BUILDER */}
          <section className="py-20 bg-white border-b border-slate-100">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-200/60 text-slate-600 rounded-full text-xs font-bold mb-6">
                <Shield className="w-3.5 h-3.5 text-slate-400" />
                <span>Independent Transparency</span>
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight mb-4">{t.partnersTitle}</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-8 max-w-2xl mx-auto font-semibold">
                {t.partnersDesc}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs sm:text-sm text-emerald-700 font-bold">
                <a href="https://www.poliziadistato.it" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 shadow-3xs transition-all w-full sm:w-auto justify-center">
                  <span>{t.partnersPolizia}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
                <a href="https://www.portaleimmigrazione.it" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 shadow-3xs transition-all w-full sm:w-auto justify-center">
                  <span>{t.partnersPortale}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </div>
            </div>
          </section>

          {/* 9. BEAUTIFUL FAQ ACCORDION */}
          <section id="faq" ref={faqRef} className="py-24 bg-slate-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
              
              {/* FAQ Headers */}
              <div className="text-center mb-16">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">Help Desk</span>
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mt-4 mb-4">
                  {t.faqTitle}
                </h2>
                <p className="text-base sm:text-lg text-slate-500 font-medium">
                  {t.faqSubtitle}
                </p>
              </div>

              {/* Accordion List */}
              <div className="space-y-3.5">
                {[
                  { q: t.faqQ1, a: t.faqA1 },
                  { q: t.faqQ2, a: t.faqA2 },
                  { q: t.faqQ3, a: t.faqA3 },
                  { q: t.faqQ4, a: t.faqA4 },
                  { q: t.faqQ5, a: t.faqA5 },
                  { q: t.faqQ6, a: t.faqA6 },
                ].map((faq, index) => {
                  const isExpanded = expandedFaq === index;
                  return (
                    <div 
                      key={index} 
                      className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-3xs hover:border-slate-200 transition-colors duration-200"
                    >
                      <button
                        onClick={() => setExpandedFaq(isExpanded ? null : index)}
                        className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-800 text-sm sm:text-base gap-4 cursor-pointer focus:outline-none"
                        style={{ textAlign: isRTL ? 'right' : 'left' }}
                      >
                        <span className="flex-1 leading-snug">{faq.q}</span>
                        <ChevronDown className={cn("w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300", isExpanded && "rotate-180")} />
                      </button>

                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-500 leading-relaxed border-t border-slate-50 bg-slate-50/10 font-semibold">
                              {faq.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

            </div>
          </section>

          {/* 10. LARGE HIGH-CONTRAST DOWNLOAD CALL TO ACTION */}
          <section id="download" className="py-24 bg-white">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
              <div className="bg-slate-900 rounded-[3rem] p-8 sm:p-12 md:p-16 text-center relative overflow-hidden shadow-xl border border-slate-800">
                
                {/* Floating flag gradient dots */}
                <div className="absolute top-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="relative z-10 max-w-2xl mx-auto">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-6">
                    {t.downloadTitle}
                  </h2>
                  
                  <p className="text-sm md:text-base text-slate-300 mb-10 leading-relaxed font-semibold">
                    {t.downloadSubtitle}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                    
                    {/* Google Play Button */}
                    <a 
                      href="#" 
                      className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-md transition-all hover:-translate-y-0.5 active:scale-95"
                    >
                      {/* Playstore svg icon shape */}
                      <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 20.5V3.5C3 2.9 3.5 2.5 4.1 2.7L18.5 11.2C19.1 11.5 19.1 12.5 18.5 12.8L4.1 21.3C3.5 21.5 3 21.1 3 20.5ZM17.1 12L5 4.9V19.1L17.1 12Z" />
                      </svg>
                      <div className="text-left">
                        <span className="text-[9px] text-emerald-100 block font-black leading-none uppercase tracking-widest font-mono">GET IT ON</span>
                        <span className="text-sm font-black block mt-0.5">Google Play</span>
                      </div>
                    </a>

                    {/* Coming Soon iOS App store button */}
                    <div className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-slate-400 rounded-2xl font-bold flex items-center justify-center gap-3 relative group">
                      <svg className="w-6 h-6 text-slate-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.1 16.67C20.08 16.74 19.67 18.11 18.71 19.5ZM15.97 4.17C16.63 3.37 17.07 2.28 16.95 1C15.85 1.04 14.51 1.73 13.73 2.64C13.07 3.41 12.49 4.52 12.64 5.78C13.87 5.87 15.12 5.17 15.97 4.17Z" />
                      </svg>
                      <div className="text-left">
                        <span className="text-[9px] text-slate-500 block font-black leading-none uppercase tracking-widest font-mono">DOWNLOAD ON THE</span>
                        <span className="text-sm font-black block mt-0.5">App Store</span>
                      </div>
                      <span className="absolute -top-2 right-4 px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[8px] font-black rounded-full uppercase tracking-widest font-mono">COMING SOON</span>
                    </div>

                  </div>

                </div>

              </div>
            </div>
          </section>

          {/* 11. PROFESSIONAL FOOTER WITH DETAILED LEGAL DISCLAIMERS */}
          <footer className="bg-slate-950 text-slate-400 pt-20 pb-10 border-t border-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-16 border-b border-slate-900">
                
                {/* Brand presentation */}
                <div className="md:col-span-5 text-left">
                  <span className="font-bold text-white text-xl tracking-tight block mb-2">Soggiorno Track</span>
                  <p className="text-[10px] text-slate-500 font-extrabold tracking-widest uppercase mb-4 font-mono">Independent Immigration Companion</p>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-sm mb-6 font-semibold">
                    A startup initiative designed and crafted to empower immigrants living in Italy with beautiful, seamless technology, helping them navigate their legal pathways offline and with full confidence.
                  </p>
                  
                  {/* Social links */}
                  <div className="flex gap-3">
                    <a href="#" className="w-9 h-9 rounded-xl border border-slate-900 bg-slate-900 hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-800 transition-colors">
                      <span className="text-xs font-bold font-mono">FB</span>
                    </a>
                    <a href="#" className="w-9 h-9 rounded-xl border border-slate-900 bg-slate-900 hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-800 transition-colors">
                      <span className="text-xs font-bold font-mono">TK</span>
                    </a>
                    <a href="#" className="w-9 h-9 rounded-xl border border-slate-900 bg-slate-900 hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-800 transition-colors">
                      <span className="text-xs font-bold font-mono">GH</span>
                    </a>
                  </div>
                </div>

                {/* Navigation links columns */}
                <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 text-left">
                  
                  <div>
                    <span className="text-xs font-black uppercase text-slate-500 tracking-widest font-mono block mb-5">Product</span>
                    <ul className="space-y-3 text-xs text-slate-400 font-bold">
                      <li><a href="#features" className="hover:text-emerald-500 transition-colors">Features</a></li>
                      <li><a href="#sofia" className="hover:text-emerald-500 transition-colors">Sofia AI</a></li>
                      <li><a href="#how-it-works" className="hover:text-emerald-500 transition-colors">How it works</a></li>
                      <li><a href="#roadmap" className="hover:text-emerald-500 transition-colors">Roadmap</a></li>
                    </ul>
                  </div>

                  <div>
                    <span className="text-xs font-black uppercase text-slate-500 tracking-widest font-mono block mb-5">Legal</span>
                    <ul className="space-y-3 text-xs text-slate-400 font-bold">
                      <li><a href="#" className="hover:text-emerald-500 transition-colors">Privacy Policy</a></li>
                      <li><a href="#" className="hover:text-emerald-500 transition-colors">Terms of Service</a></li>
                      <li><a href="#" className="hover:text-emerald-500 transition-colors">Contact Support</a></li>
                    </ul>
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-xs font-black uppercase text-slate-500 tracking-widest font-mono block mb-5">Languages</span>
                    <div className="flex flex-wrap gap-2">
                      {languages.map((l) => (
                        <button 
                          key={l.code}
                          onClick={() => handleSelectLanguage(l.code)}
                          className="px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-900 hover:border-slate-800 rounded-lg text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
                        >
                          <span>{l.flag}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

              </div>

              {/* Legal disclaimer warnings */}
              <div className="py-8 border-b border-slate-900 text-left">
                <p className="text-[10px] text-slate-500 leading-relaxed text-justify max-w-5xl mx-auto font-semibold">
                  {t.footerDisclaimer}
                </p>
              </div>

              {/* Copyright label info */}
              <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-bold">
                <span>{t.footerCopyright}</span>
                <span className="flex items-center gap-1">
                  <span>Crafted with</span>
                  <Heart className="w-3.5 h-3.5 text-rose-600 fill-current" />
                  <span>for immigrants in Italy.</span>
                </span>
              </div>

            </div>
          </footer>

        </div>
      )}

    </div>
  );
}
