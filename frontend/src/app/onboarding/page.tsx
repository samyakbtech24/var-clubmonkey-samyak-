'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RetroGrid } from "@/components/ui/retrobg";
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, Database, Microscope, Code, Monitor, Palette, 
  PenTool, Lightbulb, Ghost, Shield, Terminal, Zap, Layers 
} from 'lucide-react';

const DOMAINS = [
  { name: "AI", icon: <Cpu size={24} /> },
  { name: "Data", icon: <Database size={24} /> },
  { name: "Research", icon: <Microscope size={24} /> },
  { name: "Coding", icon: <Code size={24} /> },
  { name: "OS", icon: <Monitor size={24} /> },
  { name: "Design", icon: <Palette size={24} /> },
  { name: "Art", icon: <PenTool size={24} /> },
  { name: "Creative", icon: <Lightbulb size={24} /> },
  { name: "Humor", icon: <Ghost size={24} /> },
  { name: "Security", icon: <Shield size={24} /> },
  { name: "Linux", icon: <Terminal size={24} /> },
  { name: "Python", icon: <Zap size={24} /> },
  { name: "UI/UX", icon: <Layers size={24} /> },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleDomain = (domain: string) => {
    setSelectedDomains((prev) =>
      prev.includes(domain) ? prev.filter((d) => d !== domain) : [...prev, domain]
    );
  };

  const handleDone = async () => {
    if (selectedDomains.length === 0) return;
    setLoading(true);
    // Simulating save logic
    setTimeout(() => {
      router.push("/main");
    }, 1000);
  };

  return (
    <main className="relative min-h-screen w-full bg-[#0a0a0a] flex items-center justify-center p-6 overflow-x-hidden">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0 opacity-40">
        <RetroGrid />
      </div>

      {/* Main Content (No Card Container) */}
      <div className="relative z-10 w-full max-w-5xl flex flex-col">
        
        {/* Header Section */}
        <header className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-between items-end mb-4">
              <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
                What are you into?
              </h1>
              <span className="text-2xl font-mono text-zinc-500">2/3</span>
            </div>
            <p className="text-zinc-400 text-xl md:text-2xl max-w-2xl leading-relaxed">
              Select your domains to personalize your hub.
            </p>
          </motion.div>
        </header>

        {/* Large Rectangular Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16"
        >
          {DOMAINS.map((domain) => {
            const isSelected = selectedDomains.includes(domain.name);
            return (
              <button
                key={domain.name}
                onClick={() => toggleDomain(domain.name)}
                className={`
                  relative flex items-center gap-5 p-8 rounded-2xl border-2 transition-all duration-300 text-left
                  ${isSelected 
                    ? "border-purple-500 bg-purple-500/10 shadow-[0_0_30px_rgba(168,85,247,0.2)]" 
                    : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-600 hover:bg-zinc-800/60"
                  }
                `}
              >
                <div className={`transition-colors duration-300 ${isSelected ? "text-purple-400" : "text-zinc-500"}`}>
                  {domain.icon}
                </div>
                <span className={`text-xl font-bold transition-colors duration-300 ${isSelected ? "text-white" : "text-zinc-400"}`}>
                  {domain.name}
                </span>
                
                <AnimatePresence>
                  {isSelected && (
                    <motion.div 
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute top-4 right-4 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center shadow-lg"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </motion.div>

        {/* Footer Action */}
        <footer className="flex justify-between items-center border-t border-zinc-800 pt-10">
          <button 
            onClick={() => router.back()}
            className="text-lg font-semibold text-zinc-500 hover:text-white transition-colors"
          >
            Go Back
          </button>
          
          <button
            onClick={handleDone}
            disabled={selectedDomains.length === 0 || loading}
            className={`
              px-16 py-4 rounded-2xl font-black text-xl transition-all duration-300
              ${selectedDomains.length > 0 
                ? "bg-white text-black hover:bg-purple-500 hover:text-white shadow-[0_0_40px_rgba(255,255,255,0.2)] cursor-pointer" 
                : "bg-zinc-900 text-zinc-700 border border-zinc-800 cursor-not-allowed"
              }
            `}
          >
            {loading ? "SAVING..." : "CONTINUE"}
          </button>
        </footer>
      </div>
    </main>
  );
}