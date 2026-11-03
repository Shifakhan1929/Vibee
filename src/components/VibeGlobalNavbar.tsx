import { useState, useEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { triggerPwaInstall } from "./AppInstallModal";
import { CitySelectorModal, POPULAR_CITIES, type CityItem, useSelectedCity, setSavedCity } from "./CitySelectorModal";
import { MapPin, ChevronDown, Menu, X, Plus, Download, User } from "lucide-react";

export function VibeGlobalNavbar() {
  const [cityOpen, setCityOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [selectedCity, setSelectedCity] = useSelectedCity("Indore");

  // Track the current route pathname from TanStack Router
  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  });

  // Keep location in sync with URL or local storage
  useEffect(() => {
    try {
      const cleanSlug = pathname.split("/")[1]?.toLowerCase() ?? "";
      const matchedCity = POPULAR_CITIES.find(
        (c) => c.id.toLowerCase() === cleanSlug
      );
      if (matchedCity) {
        setSelectedCity(matchedCity.name);
        setSavedCity(matchedCity.name);
      } else {
        const saved = localStorage.getItem("vibe_selected_city");
        if (saved) {
          setSelectedCity(saved);
        } else {
          setSelectedCity("Indore");
        }
      }
    } catch {
      // Ignore storage errors
    }
  }, [pathname]);

  // Handle scroll detection for sticky navbar shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Active state checkers
  const isHome = pathname === "/" || pathname === "";
  const isVibeInstant =
    pathname.startsWith("/vibe-instant") || pathname.startsWith("/vibes");
  const isHowItWorks = pathname.startsWith("/how-it-works");
  const isDashboard = pathname.startsWith("/dashboard");
  const isCreate =
    pathname.startsWith("/create") || pathname.startsWith("/host");

  // Listen for open-city-selector event triggered by homepage search bar
  useEffect(() => {
    const handleOpenCity = () => setCityOpen(true);
    window.addEventListener("open-city-selector", handleOpenCity);
    return () => window.removeEventListener("open-city-selector", handleOpenCity);
  }, []);

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

      {/* 2. Unified Fixed Navbar - Always pinned to the top on scroll */}
      <header
        className={`vibe-sticky-navbar fixed top-0 left-0 right-0 z-[10000] w-full bg-white transition-all duration-200 ${
          scrolled
            ? "border-b border-slate-200/90 shadow-sm bg-white"
            : "border-b border-slate-100 bg-white"
        }`}
      >
        <div className="vibe-nav-wrap">
          {/* LEFT: Mobile Toggle + Logo + City Selector */}
          <div className="vibe-nav-left flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition-colors"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-slate-800" />
              ) : (
                <Menu className="w-5 h-5 text-slate-800" />
              )}
            </button>

            {/* Brand Logo */}
            <Link
              to="/"
              className="vibe-nav-logo inline-flex items-center gap-1.5 select-none"
              title="Vibe - Home"
            >
              {/* Light Mode Logo (Default Light) */}
              <img
                className="logo logo-dark h-[30px] w-auto object-contain"
                src="/site-assets/vibe-logo-dark.png"
                alt="Vibe logo"
                fetchPriority="high"
              />
              {/* Dark Mode Logo (Ice White #F0F6FF text + Brightened Cobalt stroke #0038A8) */}
              <img
                className="logo logo-dark-mode h-[30px] w-auto object-contain"
                src="/site-assets/vibe-logo-dark-mode.png"
                alt="Vibe logo"
                fetchPriority="high"
              />
            </Link>

            {/* Location Selector Pill (Display only - clicking disabled per user request) */}
            <div className="vibe-nav-location">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  // No-op: Navbar location button click disabled
                }}
                title={`${selectedCity} Events`}
                aria-haspopup="false"
                className="vibe-nav-city-btn group cursor-default"
                tabIndex={-1}
              >
                <MapPin className="w-3.5 h-3.5 text-[#0066f5] shrink-0" />
                <span className="vibe-nav-city-name">{selectedCity}</span>
                <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
              </button>
            </div>
          </div>

          {/* CENTRE: Active Navigation Links (Tab Section - Dead-Center on Desktop & Tablet) */}
          <nav
            className="vibe-nav-center flex items-center justify-center"
            aria-label="Main Navigation"
          >
            <div className="vibe-nav-tabs-group">
              {/* Home */}
              <Link
                to="/"
                className={`vibe-nav-link ${isHome ? "active" : ""}`}
                aria-current={isHome ? "page" : undefined}
              >
                <span>Home</span>
              </Link>

              {/* Vibe Instant */}
              <Link
                to="/vibe-instant"
                className={`vibe-nav-link vibe-nav-link-instant ${
                  isVibeInstant ? "active" : ""
                }`}
                aria-current={isVibeInstant ? "page" : undefined}
              >
                <span className="vibe-nav-bolt">⚡</span>
                <span>Vibe Instant</span>
              </Link>

              {/* How It Works */}
              <Link
                to="/how-it-works"
                className={`vibe-nav-link ${isHowItWorks ? "active" : ""}`}
                aria-current={isHowItWorks ? "page" : undefined}
              >
                <span>How it works</span>
              </Link>

              {/* Dashboard */}
              <Link
                to="/dashboard"
                className={`vibe-nav-link ${isDashboard ? "active" : ""}`}
                aria-current={isDashboard ? "page" : undefined}
              >
                <span>Dashboard</span>
              </Link>
            </div>
          </nav>

          {/* RIGHT: Download App + Host an Event + Profile */}
          <div className="vibe-nav-right flex items-center gap-2.5">
            {/* Download App Button */}
            <button
              type="button"
              onClick={triggerPwaInstall}
              className="vibe-nav-download-btn group"
              title="Download Vibe App (Web & Mobile)"
              aria-label="Download App"
            >
              <Download className="w-3.5 h-3.5 text-[#0066f5] shrink-0 group-hover:scale-105 transition-transform" />
              <span>Download App</span>
            </button>

            {/* + Host an Event Button */}
            <Link
              to="/create"
              className={`vibe-nav-host-btn ${
                isCreate
                  ? "ring-2 ring-blue-300 shadow-md brightness-105"
                  : ""
              }`}
              title="Host an Event"
              aria-label="Host an Event"
            >
              <Plus className="w-4 h-4 text-white shrink-0 stroke-[2.5]" />
              <span className="host-label-full">Host an Event</span><span className="host-label-short">Host</span>
            </Link>

            {/* Circular Profile Avatar Button */}
            <Link
              to="/dashboard"
              className={`vibe-nav-profile-btn ${
                isDashboard ? "ring-2 ring-[#0066f5] ring-offset-2" : ""
              }`}
              title="My Account & Dashboard"
              aria-label="User Profile"
            >
              <User className="w-5 h-5 text-slate-500 fill-slate-400" />
            </Link>
          </div>
        </div>

        {/* Mobile Visible Tabs Section (Centered directly below top row on mobile screens) */}
        <div className="vibe-nav-mobile-bar w-full border-t border-slate-100 bg-white py-1.5 px-2 flex items-center justify-center shadow-xs">
          <div className="vibe-nav-tabs-group flex items-center justify-center gap-1">
            <Link
              to="/"
              className={`vibe-nav-link text-xs px-2.5 py-1 ${isHome ? "active" : ""}`}
            >
              <span>Home</span>
            </Link>
            <Link
              to="/vibe-instant"
              className={`vibe-nav-link vibe-nav-link-instant text-xs px-2.5 py-1 ${
                isVibeInstant ? "active" : ""
              }`}
            >
              <span className="vibe-nav-bolt">⚡</span>
              <span>Vibe Instant</span>
            </Link>
            <Link
              to="/how-it-works"
              className={`vibe-nav-link text-xs px-2.5 py-1 ${isHowItWorks ? "active" : ""}`}
            >
              <span>How it works</span>
            </Link>
            <Link
              to="/dashboard"
              className={`vibe-nav-link text-xs px-2.5 py-1 ${isDashboard ? "active" : ""}`}
            >
              <span>Dashboard</span>
            </Link>
          </div>
        </div>

        {/* 3. Mobile Navigation Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 bg-white/98 backdrop-blur-xl px-4 py-4 shadow-xl animate-in fade-in slide-in-from-top-2">
            <div className="flex flex-col gap-2">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isHome
                    ? "bg-blue-50 text-[#0066f5] font-bold border border-blue-200/60"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span>Home</span>
                {isHome && (
                  <span className="w-2 h-2 rounded-full bg-[#0066f5]" />
                )}
              </Link>

              <Link
                to="/vibe-instant"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isVibeInstant
                    ? "bg-blue-50 text-[#0066f5] font-bold border border-blue-200/60"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[#ff7a00]">⚡</span>
                  <span>Vibe Instant</span>
                </div>
                {isVibeInstant && (
                  <span className="w-2 h-2 rounded-full bg-[#0066f5]" />
                )}
              </Link>

              <Link
                to="/how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isHowItWorks
                    ? "bg-blue-50 text-[#0066f5] font-bold border border-blue-200/60"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span>How it works</span>
                {isHowItWorks && (
                  <span className="w-2 h-2 rounded-full bg-[#0066f5]" />
                )}
              </Link>

              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isDashboard
                    ? "bg-blue-50 text-[#0066f5] font-bold border border-blue-200/60"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span>Dashboard</span>
                {isDashboard && (
                  <span className="w-2 h-2 rounded-full bg-[#0066f5]" />
                )}
              </Link>

              <div className="pt-2 mt-2 border-t border-slate-100 flex flex-col gap-2">
                <div
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800"
                >
                  <span className="flex items-center gap-2 text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-[#0066f5]" />
                    <span>Current City</span>
                  </span>
                  <span className="font-bold text-[#0066f5] flex items-center gap-1">
                    {selectedCity}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    triggerPwaInstall();
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#bfdbfe] text-[#0066f5] font-bold text-sm shadow-xs"
                >
                  <Download className="w-4 h-4 text-[#0066f5]" />
                  <span>Download App</span>
                </button>

                <Link
                  to="/create"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0066f5] text-white font-bold text-sm shadow-md"
                >
                  <Plus className="w-4 h-4 text-white stroke-[2.5]" />
                  <span>Host an Event</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Spacer to prevent page content from being hidden behind the fixed navbar */}
      <div className="vibe-navbar-spacer h-[100px] md:h-[60px] w-full shrink-0" aria-hidden="true" />
    </>
  );
}
