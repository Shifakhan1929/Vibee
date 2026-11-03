import { useState, useEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  MapPin,
  Search,
  Menu,
  X,
  Plus,
  Download,
  User,
  Compass,
  Sparkles,
  Calendar,
  HelpCircle,
  ChevronRight,
  ChevronDown,
  Layers,
} from "lucide-react";
import { CitySelectorModal, CityItem } from "./CitySelectorModal";
import { triggerPwaInstall } from "./AppInstallModal";

export function VibeGlobalNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Indore");

  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  // Read saved city on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("vibe_selected_city");
      if (saved && saved.trim()) setSelectedCity(saved.trim());
    } catch {}
  }, []);

  // Sync scroll state for navbar shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Handle escape key to close menu or modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        setCityOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Active state flags
  const isHome = pathname === "/" || pathname === "";
  const isVibeInstant = pathname.startsWith("/vibe-instant");
  const isHowItWorks = pathname.startsWith("/how-it-works");
  const isDashboard = pathname.startsWith("/dashboard");
  const isCreate = pathname.startsWith("/create") || pathname.startsWith("/host");

  // Listen for open-city-selector event
  useEffect(() => {
    const handleOpenCity = () => setCityOpen(true);
    window.addEventListener("open-city-selector", handleOpenCity);
    window.addEventListener("vibe:open_city_modal", handleOpenCity);
    return () => {
      window.removeEventListener("open-city-selector", handleOpenCity);
      window.removeEventListener("vibe:open_city_modal", handleOpenCity);
    };
  }, []);

  const openSearchSheet = () => {
    window.dispatchEvent(new CustomEvent("open-search-sheet"));
  };

  return (
    <>
      {/* 1. Global City Selector Modal */}
      <CitySelectorModal
        isOpen={cityOpen}
        onClose={() => setCityOpen(false)}
        activeCitySlug={selectedCity}
        onSelectCity={(city: CityItem) => {
          setSelectedCity(city.name);
          setCityOpen(false);
          try {
            localStorage.setItem("vibe_selected_city", city.name);
          } catch {}
          window.location.href = city.url;
        }}
      />

      {/* 2. Unified Fixed Navbar */}
      <header
        className={`vibe-sticky-navbar fixed top-0 left-0 right-0 z-[10000] w-full transition-all duration-200 ${
          scrolled
            ? "bg-[#07133A] lg:bg-white border-b border-[#112255] lg:border-slate-200/90 shadow-md"
            : "bg-[#07133A] lg:bg-white border-b border-[#0d1d4d] lg:border-slate-100"
        }`}
        style={{
          paddingTop: "env(safe-area-inset-top, 0px)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 lg:h-[60px] flex items-center justify-between">
          {/* LEFT: Logo + Compact City Pill */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Brand Logo */}
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 select-none shrink-0"
              title="Vibe - Home"
            >
              {/* Light logo on mobile (<1024px), dark logo on desktop (>=1024px) */}
              <img
                className="lg:hidden object-contain"
                style={{ height: "26px", maxHeight: "26px", width: "auto", maxWidth: "92px", display: "inline-block" }}
                src="/site-assets/vibe-logo-light.png"
                alt="Vibe logo"
                fetchPriority="high"
              />
              <img
                className="hidden lg:block object-contain"
                style={{ height: "30px", maxHeight: "30px", width: "auto", maxWidth: "110px", display: "inline-block" }}
                src="/site-assets/vibe-logo-dark.png"
                alt="Vibe logo"
                fetchPriority="high"
              />
            </Link>

            {/* City Selector Pill */}
            <button
              type="button"
              onClick={() => setCityOpen(true)}
              title={`Select City (Currently ${selectedCity})`}
              aria-haspopup="dialog"
              aria-expanded={cityOpen}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 lg:bg-slate-100 hover:bg-white/20 lg:hover:bg-slate-200/80 text-white lg:text-slate-800 text-xs font-semibold transition-all cursor-pointer border border-white/10 lg:border-slate-200/80"
            >
              <MapPin className="w-3 h-3 text-[#00D2FF] lg:text-[#007BFF] shrink-0" />
              <span className="truncate max-w-[80px] sm:max-w-[120px]">{selectedCity}</span>
              <ChevronDown className="w-3 h-3 text-slate-300 lg:text-slate-500 shrink-0" />
            </button>
          </div>

          {/* DESKTOP CENTER NAVIGATION (>= 1024px) */}
          <nav
            className="hidden lg:flex items-center justify-center"
            aria-label="Main Navigation"
          >
            <div className="flex items-center bg-slate-100 p-1 rounded-full border border-slate-200/70 shadow-xs">
              <Link
                to="/"
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  isHome
                    ? "bg-[#07133A] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Home
              </Link>
              <Link
                to="/vibe-instant"
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                  isVibeInstant
                    ? "bg-[#07133A] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span className="text-[#00D2FF]">⚡</span>
                <span>Vibe Instant</span>
              </Link>
              <Link
                to="/how-it-works"
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  isHowItWorks
                    ? "bg-[#07133A] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                How it works
              </Link>
              <Link
                to="/dashboard"
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  isDashboard
                    ? "bg-[#07133A] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Dashboard
              </Link>
            </div>
          </nav>

          {/* DESKTOP RIGHT (>= 1024px) */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              type="button"
              onClick={triggerPwaInstall}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:text-[#007BFF] hover:bg-slate-50 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[#007BFF]" />
              <span>Download App</span>
            </button>

            <Link
              to="/create"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#07133A] to-[#007BFF] hover:brightness-110 text-white font-bold text-xs shadow-md shadow-[#007BFF]/20 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Host an Event</span>
            </Link>

            <Link
              to="/dashboard"
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
              title="Dashboard / Profile"
            >
              <User className="w-4 h-4" />
            </Link>
          </div>

          {/* MOBILE RIGHT CONTROLS (< 1024px): Search Icon Button + Animated Hamburger */}
          <div className="flex lg:hidden items-center gap-1">
            {/* Search Icon Button (44x44 tap target) */}
            <button
              type="button"
              onClick={openSearchSheet}
              className="w-11 h-11 rounded-full flex items-center justify-center text-slate-200 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
              aria-label="Open Search"
            >
              <Search className="w-5 h-5 text-slate-200" />
            </button>

            {/* Hamburger Button (44x44 tap target, animates between bars and X) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-11 h-11 rounded-full flex items-center justify-center text-white hover:bg-white/10 active:scale-95 transition-all relative"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-white stroke-[2.5] animate-in zoom-in-75 duration-150" />
              ) : (
                <Menu className="w-6 h-6 text-white stroke-[2.5]" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 3. Slide-In Right Drawer for Mobile (< 1024px) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[100004]">
          {/* Dimmed backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-in Right Panel */}
          <div
            className="fixed inset-y-0 right-0 w-[84%] max-w-[320px] bg-[#07133A] text-white shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200 z-[100005]"
            style={{
              paddingTop: "max(16px, env(safe-area-inset-top, 16px))",
              paddingBottom: "max(24px, env(safe-area-inset-bottom, 24px))",
            }}
          >
            {/* Drawer Header */}
            <div>
              <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    className="h-6 w-auto object-contain"
                    src="/site-assets/vibe-logo-light.png"
                    alt="Vibe"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Links by Grouped Section */}
              <div className="p-4 space-y-5 text-sm">
                {/* GROUP 1: DISCOVER */}
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1.5">
                    Discover
                  </div>
                  <div className="space-y-0.5">
                    <Link
                      to="/"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`min-h-[48px] px-3.5 rounded-xl flex items-center justify-between transition-colors ${
                        isHome ? "bg-white/15 text-[#00D2FF] font-bold" : "text-slate-200 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Compass className="w-4 h-4 text-[#00D2FF]" />
                        <span>Home</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </Link>

                    <Link
                      to="/vibe-instant"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`min-h-[48px] px-3.5 rounded-xl flex items-center justify-between transition-colors ${
                        isVibeInstant ? "bg-white/15 text-[#00D2FF] font-bold" : "text-slate-200 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[#00D2FF]">⚡</span>
                        <span>Vibe Instant</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#00D2FF]/20 text-[#00D2FF]">Live</span>
                    </Link>

                    <Link
                      to="/how-it-works"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`min-h-[48px] px-3.5 rounded-xl flex items-center justify-between transition-colors ${
                        isHowItWorks ? "bg-white/15 text-[#00D2FF] font-bold" : "text-slate-200 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Sparkles className="w-4 h-4 text-[#007BFF]" />
                        <span>How it works</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </Link>

                    {/* Cleaned "For you" link (formerly /recommended?ref=...) */}
                    <a
                      href={`/${selectedCity.toLowerCase()}?filter=for-you`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="min-h-[48px] px-3.5 rounded-xl flex items-center justify-between text-slate-200 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-emerald-400" />
                        <span>For you</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setCityOpen(true);
                      }}
                      className="w-full text-left min-h-[48px] px-3.5 rounded-xl flex items-center justify-between text-slate-200 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-[#00D2FF]" />
                        <span>Events near me ({selectedCity})</span>
                      </div>
                      <span className="text-xs text-[#00D2FF] font-semibold">Change</span>
                    </button>
                  </div>
                </div>

                {/* GROUP 2: HOST */}
                <div className="pt-2 border-t border-white/10">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
                    Host
                  </div>
                  {/* Primary CTA Host an Event Button */}
                  <Link
                    to="/create"
                    onClick={() => setMobileMenuOpen(false)}
                    className="min-h-[48px] w-full px-4 rounded-xl bg-gradient-to-r from-[#00D2FF] via-[#007BFF] to-[#0038A8] text-white font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-[#007BFF]/30 active:scale-95 transition-all mb-2"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>Host an Event</span>
                  </Link>

                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`min-h-[48px] px-3.5 rounded-xl flex items-center justify-between transition-colors ${
                      isDashboard ? "bg-white/15 text-[#00D2FF] font-bold" : "text-slate-200 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Layers className="w-4 h-4 text-cyan-400" />
                      <span>Dashboard & Manage</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                </div>

                {/* GROUP 3: ACCOUNT & APP */}
                <div className="pt-2 border-t border-white/10">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1.5">
                    Account & App
                  </div>
                  <div className="space-y-0.5">
                    <Link
                      to="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="min-h-[48px] px-3.5 rounded-xl flex items-center justify-between text-slate-200 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4 text-slate-300" />
                        <span>Sign In / Profile</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        triggerPwaInstall();
                      }}
                      className="w-full text-left min-h-[48px] px-3.5 rounded-xl flex items-center justify-between text-slate-200 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Download className="w-4 h-4 text-[#00D2FF]" />
                        <span>Get the App</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>

                    <Link
                      to="/how-it-works"
                      onClick={() => setMobileMenuOpen(false)}
                      className="min-h-[48px] px-3.5 rounded-xl flex items-center justify-between text-slate-200 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <HelpCircle className="w-4 h-4 text-slate-400" />
                        <span>Help & Support</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="px-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span>© {new Date().getFullYear()} Vibe</span>
              <span className="text-[11px] text-[#00D2FF] font-semibold">{selectedCity} Hub</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
