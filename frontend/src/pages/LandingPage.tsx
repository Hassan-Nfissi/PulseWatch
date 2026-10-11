import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { HeroSection } from '../components/landing/HeroSection';
import { FeaturesSection } from '../components/landing/FeaturesSection';
import { ArchitectureSection } from '../components/landing/ArchitectureSection';
import { FounderSection } from '../components/landing/FounderSection';
import { PricingSection } from '../components/landing/PricingSection';
import { FaqSection } from '../components/landing/FaqSection';
import { CtaBanner } from '../components/landing/CtaBanner';
import { LandingFooter } from '../components/landing/LandingFooter';
import { MouseSpotlightBackground } from '../components/landing/MouseSpotlightBackground';

export const LandingPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-indigo-500 selection:text-white relative">
      {/* Interactive Cursor Spotlight Background */}
      <MouseSpotlightBackground />

      {/* Authenticated Sticky Notice Bar */}
      {isAuthenticated && user && (
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border-b border-indigo-500/20 py-2 px-4 text-center text-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
            <span className="text-slate-300">
              Welcome back, <strong className="text-white">{user.name || user.email}</strong>!
            </span>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1 font-bold text-cyan-400 hover:text-cyan-300 underline underline-offset-2 ml-1"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}

      {/* Main SaaS Navbar */}
      <LandingNavbar />

      {/* Main Marketing Content */}
      <main className="flex-1 relative z-10">
        <HeroSection />
        <FeaturesSection />
        <ArchitectureSection />
        <FounderSection />
        <PricingSection />
        <FaqSection />
        <CtaBanner />
      </main>

      {/* Footer */}
      <div className="relative z-10">
        <LandingFooter />
      </div>
    </div>
  );
};
