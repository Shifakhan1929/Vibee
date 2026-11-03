import { useState } from "react";
import { useVibeTheme } from "../lib/theme";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Calendar,
  DollarSign,
  Share2,
  QrCode,
  ArrowRight,
  Sparkles,
  Sun,
  Moon,
  Zap,
  Users,
  CheckCircle2,
  Check,
  Flame,
  ShieldCheck,
  TrendingUp,
  Clock,
  Play,
  Heart,
} from "lucide-react";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How It Works — Vibe | Host Anything, Fill Every Spot" },
      {
        name: "description",
        content:
          "Vibe lets anyone host anything — from a Sunday cricket match with 10 players to a comedy night or festival for 1,000. Live in about five minutes.",
      },
      { property: "og:title", content: "How It Works — Vibe" },
      {
        property: "og:description",
        content:
          "One place for every kind of gathering. From a group of 10 to a crowd of 1,000 — live in about five minutes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HowItWorksPage,
});

/* =========================================================================
   CUSTOM HIGH-FIDELITY VECTOR ICONS
   ========================================================================= */

// 1. Cricket Bat & Ball (Sports & Games)
function SportsCricketIcon() {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="select-none drop-shadow-md"
    >
      <rect
        x="13"
        y="8"
        width="4"
        height="12"
        rx="2"
        transform="rotate(-40 13 8)"
        fill="#F8FAFC"
      />
      <rect
        x="12.5"
        y="7.5"
        width="5"
        height="3"
        rx="1"
        transform="rotate(-40 12.5 7.5)"
        fill="#CBD5E1"
      />
      <path
        d="M17.5 17.5L29 31C30.5 32.8 31 35.5 29.8 37.2L28 39.5C26.5 41.2 23.8 41.5 21.8 40.2L11 31.5C9.8 30.5 9.5 28.8 10.2 27.5L16.2 18.2C16.5 17.7 17.1 17.3 17.5 17.5Z"
        fill="#E0A96D"
      />
      <path
        d="M20 20L28 30C29.2 31.5 29.5 33.5 28.5 35L27 37C25.8 38.5 23.8 38.8 22.2 37.8L13 29.8L18.5 20.8C19 20.2 19.5 20 20 20Z"
        fill="#C68B59"
      />
      <circle cx="36" cy="36" r="6.5" fill="#EF4444" />
      <circle cx="34.5" cy="34" r="2" fill="#F87171" opacity="0.8" />
      <path
        d="M31 38C33 34 39 34 41 38"
        stroke="#FFFFFF"
        strokeWidth="1.2"
        strokeDasharray="1.5 1"
        strokeLinecap="round"
      />
    </svg>
  );
}

// 2. Microphone (Comedy & Open Mics)
function ComedyMicIcon() {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="select-none drop-shadow-md"
    >
      <path
        d="M19 23L27 31L23 37C21.8 38.8 19 39.2 17.2 38L14 35.8C12.2 34.2 12 31.5 13.5 29.8L19 23Z"
        fill="#8B5CF6"
      />
      <rect
        x="12"
        y="35"
        width="6"
        height="8"
        rx="2"
        transform="rotate(-45 12 35)"
        fill="#6D28D9"
      />
      <ellipse
        cx="29"
        cy="17"
        rx="7.5"
        ry="9"
        transform="rotate(45 29 17)"
        fill="#CBD5E1"
      />
      <ellipse
        cx="30"
        cy="16"
        rx="5.5"
        ry="7"
        transform="rotate(45 30 16)"
        fill="#94A3B8"
      />
      <path
        d="M24 15L32 23M26 12L34 20M29 9L37 17"
        stroke="#475569"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <rect
        x="23"
        y="21"
        width="3"
        height="11"
        rx="1"
        transform="rotate(45 23 21)"
        fill="#DDD6FE"
      />
    </svg>
  );
}

// 3. Music Notes (Music & Parties)
function MusicPartiesIcon() {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="select-none drop-shadow-md"
    >
      <ellipse cx="14" cy="34" rx="5" ry="3.8" transform="rotate(-20 14 34)" fill="#A855F7" />
      <rect x="17" y="14" width="3" height="21" rx="1.5" fill="#9333EA" />
      <ellipse cx="32" cy="29" rx="5" ry="3.8" transform="rotate(-20 32 29)" fill="#A855F7" />
      <rect x="35" y="9" width="3" height="21" rx="1.5" fill="#9333EA" />
      <path d="M17 17L38 12V8L17 13V17Z" fill="#7E22CE" />
      <circle cx="10" cy="18" r="1.5" fill="#C084FC" />
      <circle cx="39" cy="23" r="2" fill="#E9D5FF" />
    </svg>
  );
}

// 4. Brain / Knowledge (Learn & Meet)
function LearnMeetIcon() {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="select-none drop-shadow-md"
    >
      <path
        d="M24 12C20.5 12 17.5 14 16.5 17C14.5 17.5 12 19.5 12 23C12 25.5 13.5 27.5 15.5 28.5C15 29.5 15 31 16 32.5C17.2 34.5 19.5 35.5 22 35.5C23 35.5 23.5 35 24 34.5V12Z"
        fill="#F472B6"
      />
      <path
        d="M24 12C27.5 12 30.5 14 31.5 17C33.5 17.5 36 19.5 36 23C36 25.5 34.5 27.5 32.5 28.5C33 29.5 33 31 32 32.5C30.8 34.5 28.5 35.5 26 35.5C25 35.5 24.5 35 24 34.5V12Z"
        fill="#EC4899"
      />
      <path
        d="M18 19C19 21 21 21 22 23M15 24C17 25 18 27 20 27M18 30C19.5 30 20.5 32 22 32"
        stroke="#DB2777"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M30 19C29 21 27 21 26 23M33 24C31 25 30 27 28 27M30 30C28.5 30 27.5 32 26 32"
        stroke="#BE185D"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function HowItWorksPage() {
  const [theme, setTheme] = useVibeTheme();
  const isDark = theme === "dark";

  // Section 1 Data: Categories
  const categories = [
    {
      icon: <SportsCricketIcon />,
      tag: "SPORTS",
      title: "Sports and games",
      description: "Box cricket, turf football, badminton, padel, run clubs.",
      highlight: "Split ground fee automatically",
    },
    {
      icon: <ComedyMicIcon />,
      tag: "COMEDY",
      title: "Comedy & open mics",
      description: "Stand-up specials, open mic lineups, poetry & storytelling.",
      highlight: "Door check-in & spot approvals",
    },
    {
      icon: <MusicPartiesIcon />,
      tag: "MUSIC",
      title: "Music and parties",
      description: "Live gigs, DJ nights, acoustic rooftops, birthdays & house parties.",
      highlight: "Tiered tickets & instant WhatsApp passes",
    },
    {
      icon: <LearnMeetIcon />,
      tag: "SOCIAL",
      title: "Learn and meet",
      description: "Creative workshops, founder mixers, board game meetups.",
      highlight: "Automated attendee broadcast updates",
    },
  ];

  // Section 2 Data: Scale Tiers
  const scaleTiers = [
    {
      tier: "Small",
      badge: "Pickups & Meetups",
      title: "Matches & Groups (10 - 30)",
      description:
        "Set a player cap, split the ground or turf fee evenly, and let Vibe fill the empty slots. Perfect for matches, game nights, and morning run clubs.",
      features: [
        "Capacity limiter & instant waitlist",
        "Free or cost-split payment collection",
        "Instant WhatsApp group check-in",
      ],
      pricing: "100% Free forever",
      isPopular: false,
    },
    {
      tier: "Medium",
      badge: "Most Popular",
      title: "Shows & Workshops (50 - 250)",
      description:
        "Sell early-bird tickets, collect custom attendee questions, and send broadcast updates to everyone coming. Built for indie artists and organizers.",
      features: [
        "Custom ticket tiers & early-bird rules",
        "Automated QR code passes on WhatsApp",
        "Organizer mobile check-in scanner",
        "Direct UPI & card settlement",
      ],
      pricing: "Zero setup fee · Instant payouts",
      isPopular: true,
    },
    {
      tier: "Large",
      badge: "Festivals & Stage",
      title: "Concerts & Expos (500 - 5,000+)",
      description:
        "Multi-gate QR check-in at high speed, sub-organizer team permissions, discount promo codes, and real-time live sales telemetry.",
      features: [
        "High-throughput gate scanner app",
        "Team staff access controls",
        "Dedicated account manager support",
        "Custom landing page & embeds",
      ],
      pricing: "Custom volume ticketing",
      isPopular: false,
    },
  ];

  // Section 3 Data: 4 Step Process
  const steps = [
    {
      number: "01",
      title: "Describe it in 60s",
      description:
        "Name your gathering, pick a date & turf/venue, and set how many spots or tickets you need.",
      icon: Calendar,
      accent: "from-blue-600 to-cyan-500",
    },
    {
      number: "02",
      title: "Set your pricing",
      description:
        "Keep it Free, split-the-turf cost, or charge tickets. Direct UPI / bank settlements go straight to you.",
      icon: DollarSign,
      accent: "from-indigo-600 to-blue-500",
    },
    {
      number: "03",
      title: "Share your clean link",
      description:
        "Post it on WhatsApp or Instagram stories. People nearby discover your event on Vibe organically.",
      icon: Share2,
      accent: "from-purple-600 to-indigo-500",
    },
    {
      number: "04",
      title: "Scan & have fun",
      description:
        "Scan QR code passes at the door or tap your guest list. Track headcount in real-time.",
      icon: QrCode,
      accent: "from-emerald-600 to-teal-500",
    },
  ];

  return (
    <div
      className={`min-h-screen font-sans antialiased transition-colors duration-300 ${
        isDark ? "bg-[#060D1E] text-white" : "bg-[#FDFDFD] text-slate-800"
      }`}
    >


      {/* =========================================================================
          HERO SECTION: High-Impact Animated Header with Stats
          ========================================================================= */}
      <section
        className={`relative pt-10 pb-8 sm:pt-14 sm:pb-10 overflow-hidden border-b transition-colors ${
          isDark
            ? "bg-gradient-to-b from-[#07133A] via-[#060D1E] to-[#060D1E] border-slate-800"
            : "bg-gradient-to-b from-[#F0F5FF] via-[#F8FAFD] to-[#FDFDFD] border-slate-200/80"
        }`}
      >
        {/* Glow ambient meshes */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[360px] bg-[#007BFF]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">


          {/* Main Headline */}
          <h1
            className={`text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] max-w-4xl mx-auto ${
              isDark ? "text-white" : "text-[#07133A]"
            }`}
            style={{ fontFamily: "'Trapvoid', 'Bricolage Grotesque', 'Outfit', sans-serif" }}
          >
            Host anything.{" "}
            <span className="bg-gradient-to-r from-[#0038A8] via-[#007BFF] to-[#00D2FF] bg-clip-text text-transparent">
              Fill every spot.
            </span>{" "}
            In five minutes.
          </h1>

          <p
            className={`mt-5 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed font-normal ${
              isDark ? "text-[#8EA2C6]" : "text-slate-600"
            }`}
          >
            From a box cricket match with 12 players to a sold-out comedy night or festival for 1,000 — Vibe handles passes, payments, and guest lists seamlessly.
          </p>

          {/* CTA Row */}
          <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-3.5 sm:gap-4">
            <a
              href="/create"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#07133A] via-[#0038A8] to-[#007BFF] hover:brightness-110 text-white font-bold text-sm shadow-xl shadow-[#007BFF]/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>Create an Event (Free)</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="/vibe-instant"
              className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-bold border transition-all cursor-pointer ${
                isDark
                  ? "bg-slate-900/80 hover:bg-slate-800 text-white border-slate-700"
                  : "bg-white hover:bg-slate-50 text-slate-800 border-slate-300 shadow-sm"
              }`}
            >
              <Zap className="w-4 h-4 text-[#007BFF]" />
              <span>Explore Live Reels</span>
            </a>
          </div>

          {/* Trust Stat Strip */}
          <div className="mt-8 pt-5 sm:mt-9 sm:pt-6 border-t border-slate-200/60 dark:border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-[#07133A] dark:text-white">5 Mins</div>
              <div className="text-xs text-slate-500 font-semibold mt-0.5">Average Setup Time</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-[#007BFF]">100%</div>
              <div className="text-xs text-slate-500 font-semibold mt-0.5">Instant WhatsApp Passes</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-[#07133A] dark:text-white">₹0</div>
              <div className="text-xs text-slate-500 font-semibold mt-0.5">Upfront Platform Cost</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">40,000+</div>
              <div className="text-xs text-slate-500 font-semibold mt-0.5">Cities Worldwide</div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 1: "One place for every kind of gathering"
          ========================================================================= */}
      <section
        className={`py-10 sm:py-12 transition-colors ${
          isDark ? "bg-[#060D1E]" : "bg-[#FDFDFD]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-6 sm:mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-[#007BFF] mb-1.5 block">
              Categories & Gatherings
            </span>
            <h2
              className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight ${
                isDark ? "text-white" : "text-[#07133A]"
              }`}
              style={{ fontFamily: "'Trapvoid', 'Bricolage Grotesque', 'Outfit', sans-serif" }}
            >
              One place for every kind of gathering
            </h2>
            <p
              className={`mt-4 text-base sm:text-lg leading-relaxed ${
                isDark ? "text-[#8EA2C6]" : "text-slate-600"
              }`}
            >
              Whether you are chasing players, an audience, or both, pick a category and see what is happening this week.
            </p>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                className={`group rounded-3xl p-6 sm:p-7 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 ${
                  isDark
                    ? "bg-[#0C1B38] border border-[#162B54] hover:border-[#00D2FF]/50 hover:shadow-[0_15px_35px_rgba(0,210,255,0.12)]"
                    : "bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-[#007BFF]/40"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center border border-slate-200/60 dark:border-white/10 group-hover:scale-110 transition-transform">
                      {cat.icon}
                    </div>
                    <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-[#007BFF] border border-blue-200/50 dark:border-blue-500/20">
                      {cat.tag}
                    </span>
                  </div>

                  <h3
                    className={`text-xl font-bold tracking-tight mb-2 ${
                      isDark ? "text-white group-hover:text-[#00D2FF]" : "text-slate-900 group-hover:text-[#007BFF]"
                    } transition-colors`}
                    style={{ fontFamily: "'Trapvoid', 'Bricolage Grotesque', 'Outfit', sans-serif" }}
                  >
                    {cat.title}
                  </h3>

                  <p
                    className={`text-sm leading-relaxed mb-4 ${
                      isDark ? "text-[#8EA2C6]" : "text-slate-600"
                    }`}
                  >
                    {cat.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-white/5 text-xs font-semibold text-[#007BFF] flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="truncate">{cat.highlight}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: "From a group of 10 to a crowd of 1,000"
          ========================================================================= */}
      <section
        className={`py-10 sm:py-12 transition-colors border-t border-b ${
          isDark
            ? "bg-[#07133A]/50 border-slate-800"
            : "bg-[#F8FAFD] border-slate-200/70"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-6 sm:mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-[#007BFF] mb-1.5 block">
              Flexible Scale
            </span>
            <h2
              className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight ${
                isDark ? "text-white" : "text-[#07133A]"
              }`}
              style={{ fontFamily: "'Trapvoid', 'Bricolage Grotesque', 'Outfit', sans-serif" }}
            >
              From a group of 10 to a crowd of 1,000
            </h2>
            <p
              className={`mt-4 text-base sm:text-lg leading-relaxed ${
                isDark ? "text-[#8EA2C6]" : "text-slate-600"
              }`}
            >
              The same intuitive tools work at any scale. Start simple and add what you need as your community expands.
            </p>
          </div>

          {/* 3 Tier Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {scaleTiers.map((tier, idx) => (
              <div
                key={idx}
                className={`relative rounded-3xl p-7 sm:p-8 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 ${
                  tier.isPopular
                    ? isDark
                      ? "bg-[#0C1B38] border-2 border-[#00D2FF] shadow-[0_20px_50px_rgba(0,210,255,0.15)]"
                      : "bg-white border-2 border-[#007BFF] shadow-xl"
                    : isDark
                    ? "bg-[#0C1B38] border border-[#162B54] hover:border-slate-600"
                    : "bg-white border border-slate-200 shadow-sm hover:shadow-lg"
                }`}
              >
                {tier.isPopular && (
                  <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-[#0038A8] to-[#007BFF] text-white text-[10px] font-extrabold uppercase tracking-wider shadow-md">
                    {tier.badge}
                  </div>
                )}

                <div>
                  <div className="mb-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#007BFF]">
                      {tier.tier} Scale
                    </span>
                  </div>

                  <h3
                    className={`text-2xl font-black tracking-tight mb-3 ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                    style={{ fontFamily: "'Trapvoid', 'Bricolage Grotesque', 'Outfit', sans-serif" }}
                  >
                    {tier.title}
                  </h3>

                  <p
                    className={`text-sm leading-relaxed mb-6 ${
                      isDark ? "text-[#8EA2C6]" : "text-slate-600"
                    }`}
                  >
                    {tier.description}
                  </p>

                  <div className="space-y-2.5 py-4 border-t border-slate-100 dark:border-white/5 mb-6 text-xs text-slate-700 dark:text-slate-300">
                    {tier.features.map((feat, fidx) => (
                      <div key={fidx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    {tier.pricing}
                  </span>
                  <a
                    href="/create"
                    className="text-xs font-bold text-[#007BFF] hover:underline flex items-center gap-1"
                  >
                    <span>Start</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: "Live in about five minutes" (Connected Stepper)
          ========================================================================= */}
      <section
        className={`py-10 sm:py-12 transition-colors ${
          isDark ? "bg-[#060D1E]" : "bg-[#FDFDFD]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14 sm:mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#007BFF] mb-2 block">
              Streamlined 4 Steps
            </span>
            <h2
              className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight ${
                isDark ? "text-white" : "text-[#07133A]"
              }`}
              style={{ fontFamily: "'Trapvoid', 'Bricolage Grotesque', 'Outfit', sans-serif" }}
            >
              Live in about five minutes
            </h2>
            <p
              className={`mt-4 text-base sm:text-lg leading-relaxed ${
                isDark ? "text-[#8EA2C6]" : "text-slate-600"
              }`}
            >
              No lengthy paperwork or complex forms. Four straightforward steps from idea to sold-out venue.
            </p>
          </div>

          {/* Stepper Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => {
              const IconComp = step.icon;
              return (
                <div
                  key={step.number}
                  className={`rounded-3xl p-6 sm:p-7 border transition-all duration-300 flex flex-col justify-between hover:shadow-lg ${
                    isDark
                      ? "bg-[#0C1B38] border-[#162B54]"
                      : "bg-white border-slate-200 shadow-xs"
                  }`}
                >
                  <div>
                    {/* Header: Step Number & Icon */}
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-2xl font-black font-mono text-[#007BFF]">
                        {step.number}
                      </span>
                      <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-[#007BFF] flex items-center justify-center">
                        <IconComp className="w-5 h-5" />
                      </div>
                    </div>

                    <h3
                      className={`text-lg font-bold tracking-tight mb-2 ${
                        isDark ? "text-white" : "text-slate-900"
                      }`}
                      style={{ fontFamily: "'Trapvoid', 'Bricolage Grotesque', 'Outfit', sans-serif" }}
                    >
                      {step.title}
                    </h3>

                    <p
                      className={`text-xs sm:text-sm leading-relaxed ${
                        isDark ? "text-[#8EA2C6]" : "text-slate-600"
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Instant Automation</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          VIDEO DEMO / WALKTHROUGH SECTION
          ========================================================================= */}
      <section
        className={`py-10 sm:py-12 transition-colors border-t ${
          isDark
            ? "bg-[#060D1E] border-slate-800"
            : "bg-[#F8FAFD] border-slate-200"
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-[#007BFF] border border-blue-200 dark:border-blue-500/20 text-xs font-bold uppercase tracking-wider mb-3">
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Video Walkthrough</span>
          </div>

          <h2
            className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
              isDark ? "text-white" : "text-[#07133A]"
            }`}
            style={{ fontFamily: "'Trapvoid', 'Bricolage Grotesque', 'Outfit', sans-serif" }}
          >
            Why Vibe is Best For You
          </h2>
          <p
            className={`mt-3 text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-8 ${
              isDark ? "text-[#8EA2C6]" : "text-slate-600"
            }`}
          >
            Need a team? A crowd? A stage? See how anyone can create, share, and fill out events in minutes.
          </p>

          {/* 16:9 Video Frame */}
          <div className="relative w-full pb-[56.25%] h-0 overflow-hidden rounded-3xl bg-slate-900 shadow-2xl border-4 border-white dark:border-slate-800 ring-1 ring-slate-900/10">
            <iframe
              className="absolute top-0 left-0 w-full h-full border-0"
              src="https://www.youtube-nocookie.com/embed/D77hEY4o300?autoplay=1&mute=1&loop=1&playlist=D77hEY4o300&playsinline=1&rel=0&modestbranding=1"
              title="Why Vibe is Best For You"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* =========================================================================
          DO YOU HOST EVENTS? (CREATOR BANNER WITH SUYASH & ANCHORED INSTA CARD)
          ========================================================================= */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(105deg, #07133A 0%, #0038A8 45%, #007BFF 85%, #00D2FF 100%)",
        }}
      >
        {/* Subtle decorative bubble shapes */}
        <div
          aria-hidden="true"
          className="absolute w-24 h-24 rounded-full pointer-events-none"
          style={{ top: "10%", right: "25%", backgroundColor: "rgba(255, 255, 255, 0.08)" }}
        />
        <div
          aria-hidden="true"
          className="absolute w-16 h-16 rounded-full pointer-events-none"
          style={{ bottom: "15%", right: "35%", backgroundColor: "rgba(255, 255, 255, 0.06)" }}
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 min-h-[300px] sm:min-h-[330px] flex flex-col md:flex-row items-center justify-between relative z-10 pt-8 md:pt-0">
          {/* Left Column: Heading, Subhead, CTA Button & Quick Links */}
          <div className="w-full md:w-7/12 py-8 md:py-10 text-left z-20">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider mb-4 border border-white/20">
              <Flame className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>For Event Organizers & Creators</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Do you host events?
            </h2>

            <p className="text-base sm:text-xl text-blue-100 mt-2 mb-6 font-normal">
              Let’s make the world #Happening together.
            </p>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <a
                href="/create"
                className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-white text-[#07133A] font-extrabold text-sm shadow-xl hover:bg-blue-50 hover:shadow-2xl transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Create an Event</span>
                <ArrowRight className="w-4 h-4 text-[#007BFF]" />
              </a>

              <div className="flex items-center gap-3 text-white text-sm sm:text-base font-semibold">
                <a href="/create" className="hover:text-cyan-200 transition-colors">
                  Create
                </a>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-white/70" />
                <a href="/how-it-works" className="hover:text-cyan-200 transition-colors">
                  Promote
                </a>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-white/70" />
                <a href="/how-it-works" className="hover:text-cyan-200 transition-colors">
                  Sell
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Suyash Cutout Photo with Instagram Testimonial Card placed cleanly to the SIDE (Zero Overlap) */}
          <div className="w-full md:w-5/12 flex items-end justify-center md:justify-end mt-6 md:mt-0 relative">
            <div className="flex items-center sm:items-end justify-center gap-3 sm:gap-4 lg:gap-5">
              {/* Instagram Card - Positioned strictly to the side of Suyash, zero overlap */}
              <div className="self-center mb-6 sm:mb-10 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-2.5 sm:p-3.5 flex items-center gap-2.5 sm:gap-3 border border-white/70 select-none hover:scale-105 transition-transform shrink-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center flex-shrink-0 p-0.5 shadow-md">
                  <div className="w-full h-full rounded-[10px] bg-white flex items-center justify-center">
                    <svg className="w-5 h-5 text-rose-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                </div>
                <div className="text-left leading-tight pr-1 sm:pr-2">
                  <div className="flex items-center gap-1 font-bold text-slate-900 text-xs sm:text-sm">
                    <span>@suyash</span>
                    <span className="w-3.5 h-3.5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[9px] font-black">✓</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium mt-0.5 whitespace-nowrap">Speaker & Top Host</div>
                </div>
              </div>

              {/* Host Person Cutout Image - Unobstructed & fully visible */}
              <div className="flex items-end shrink-0">
                <img
                  src="/site-assets/host-person-cutout.png"
                  alt="Suyash - Event Host"
                  className="max-h-[250px] sm:max-h-[290px] md:max-h-[320px] w-auto object-contain select-none drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FOOTER
          ========================================================================= */}
      <footer
        className={`py-10 text-center text-xs border-t transition-colors ${
          isDark
            ? "bg-[#040814] border-slate-800 text-slate-500"
            : "bg-[#07133A] border-slate-800 text-slate-400"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img
              src="/site-assets/vibe-logo-light.png"
              alt="Vibe logo"
              className="h-6 w-auto object-contain"
            />
            <span className="text-slate-400">© {new Date().getFullYear()} Vibe. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 text-slate-400">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <a href="/create" className="hover:text-white transition-colors">Create Event</a>
            <a href="/vibe-instant" className="hover:text-white transition-colors">Vibe Instant</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
