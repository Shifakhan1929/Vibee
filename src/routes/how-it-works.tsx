import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Calendar,
  Users,
  Ticket,
  QrCode,
  Share2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  ShieldCheck,
  Compass,
  DollarSign,
  MessageSquare,
} from "lucide-react";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How It Works – Vibe | Host Anything, Fill Every Spot" },
      {
        name: "description",
        content:
          "Vibe lets anyone host anything — from a Sunday cricket match with 10 players to a comedy night or concert for 1,000. Discover how Vibe works in 4 simple steps.",
      },
      { property: "og:title", content: "How It Works – Vibe" },
      {
        property: "og:description",
        content:
          "One place for every kind of gathering. From a group of 10 to a crowd of 1,000 — live in about five minutes.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: HowItWorksPage,
});

function HowItWorksPage() {
  const [activeStep, setActiveStep] = useState<number>(1);

  // 1. Screenshot 1 Data: Categories
  const categories = [
    {
      emoji: "🏏",
      title: "Sports and games",
      description: "Cricket, football, badminton, run clubs",
    },
    {
      emoji: "🎤",
      title: "Comedy and open mics",
      description: "Stand-up nights, poetry, storytelling",
    },
    {
      emoji: "🎶",
      title: "Music and parties",
      description: "Gigs, DJ nights, birthdays, reunions",
    },
    {
      emoji: "🧠",
      title: "Learn and meet",
      description: "Workshops, talks, startup meetups",
    },
  ];

  // 2. Screenshot 2 Data: Scale Tiers
  const scaleTiers = [
    {
      tier: "Small",
      tierColor: "bg-sky-50 text-sky-700 border-sky-200",
      title: "Pickup and meetups",
      description:
        "Set a player limit, split the ground fee, and let Vibe fill the empty spots. Perfect for matches, game nights and study groups.",
      capacity: "10 – 30 people",
      perks: [
        "Automatic ground/turf fee split",
        "Player limit with instant waitlist",
        "Direct attendee notifications",
      ],
    },
    {
      tier: "Medium",
      tierColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
      title: "Shows and workshops",
      description:
        "Sell tickets, run a waitlist, and message everyone going. Built for comedy nights, classes and community events.",
      capacity: "30 – 250 people",
      perks: [
        "Online ticket sales & instant UPI payouts",
        "Live waitlist & ticket transfer",
        "Broadcast message to all attendees",
      ],
    },
    {
      tier: "Large",
      tierColor: "bg-purple-50 text-purple-700 border-purple-200",
      title: "Festivals and concerts",
      description:
        "Tiered tickets, QR check-in at the gate, team access and live sales. Run a full-scale event from one dashboard.",
      capacity: "250 – 1,000+ people",
      perks: [
        "Tiered passes (Early Bird, VIP, Phase 1)",
        "Sub-second QR gate ticket scanner",
        "Multi-staff scanner access & live sales stats",
      ],
    },
  ];

  // 3. Screenshot 3 Data: 4 Steps
  const steps = [
    {
      number: 1,
      title: "Describe it",
      description: "Name it, pick a date and venue, set how many people you need.",
      icon: Calendar,
    },
    {
      number: 2,
      title: "Set the price",
      description: "Free, split-the-cost, or ticketed. Payments go straight to you.",
      icon: DollarSign,
    },
    {
      number: 3,
      title: "Share the link",
      description: "Post it on Vibe and WhatsApp. People nearby find it on their own.",
      icon: Share2,
    },
    {
      number: 4,
      title: "Show up",
      description: "Scan QR codes at the door or tick off your team. Done.",
      icon: QrCode,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans antialiased">
      {/* 1. Topbar Navigation */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/site-assets/vibe-logo-dark.png"
                alt="Vibe logo"
                className="h-9 w-auto object-contain"
              />
            </Link>
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#1565C0] border border-blue-200 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#1565C0] animate-pulse" />
              How Vibe Works
            </div>
          </div>

          <nav className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/"
              className="text-sm font-medium text-slate-600 hover:text-[#1565C0] transition-colors hidden sm:inline-block"
            >
              Home
            </Link>
            <a
              href="/indore"
              className="text-sm font-medium text-slate-600 hover:text-[#1565C0] transition-colors hidden md:inline-block"
            >
              Indore Events
            </a>
            <a
              href="/manage/create.php?ref=how-it-works-topbar"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-[#1565C0] text-white hover:bg-[#0D47A1] shadow-xs hover:shadow-md transition-all"
            >
              <span>+</span> Create Event
            </a>
          </nav>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="bg-white border-b border-slate-200 py-14 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#1565C0] text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Simple · Fast · Flexible
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            How Vibe Works
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Everything you need to gather people, sell tickets, split ground fees, or run a full-scale show — with zero friction.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="/manage/create.php?ref=how-it-works-hero"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#1565C0] hover:bg-[#0D47A1] text-white font-semibold text-sm sm:text-base shadow-md hover:shadow-lg transition-all"
            >
              Create an Event
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="/indore"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm sm:text-base border border-slate-200 transition-colors"
            >
              Explore Events in Indore
            </a>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 1: "One place for every kind of gathering" (Screenshot 1)
          ========================================================================= */}
      <section className="py-16 sm:py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              One place for every kind of gathering
            </h2>
            <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
              Whether you are chasing players, an audience, or both, pick a category and see what is happening this week.
            </p>
          </div>

          {/* Category Cards Grid: 4 distinct columns, responsive and spacious */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-7 border border-slate-200 shadow-xs hover:shadow-xl hover:border-[#1565C0]/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center justify-center text-3xl mb-5">
                    {cat.emoji}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {cat.title}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: "From a group of 10 to a crowd of 1,000" (Screenshot 2)
          ========================================================================= */}
      <section className="py-16 sm:py-24 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              From a group of 10 to a crowd of 1,000
            </h2>
            <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
              The same tools work at any size. Start simple and add what you need as you grow.
            </p>
          </div>

          {/* Scale Cards Grid: 3 spacious cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {scaleTiers.map((tier, idx) => (
              <div
                key={idx}
                className="bg-slate-50/60 hover:bg-white rounded-2xl p-7 sm:p-8 border border-slate-200 shadow-xs hover:shadow-xl hover:border-[#1565C0]/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Tier Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${tier.tierColor}`}
                    >
                      {tier.tier}
                    </span>
                    <span className="text-xs font-medium text-slate-400">
                      {tier.capacity}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-3">
                    {tier.title}
                  </h3>

                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
                    {tier.description}
                  </p>

                  {/* Feature Checklist */}
                  <div className="space-y-2.5 pt-4 border-t border-slate-200/80">
                    {tier.perks.map((perk, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-[#1565C0] shrink-0 mt-0.5" />
                        <span>{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: "Live in about five minutes" (Screenshot 3 - Stepper)
          Fixed layout so steps and descriptions wrap properly with clean vertical hierarchy
          ========================================================================= */}
      <section className="py-16 sm:py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Live in about five minutes
            </h2>
            <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
              No forms to fight with. Four steps from idea to full house.
            </p>
          </div>

          {/* Stepper Timeline Container */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-sm">
            {/* Desktop Timeline Tracker */}
            <div className="relative">
              {/* Horizontal Connecting Progress Line (Desktop only) */}
              <div
                className="hidden lg:block absolute top-6 left-8 right-8 h-1 bg-slate-200"
                style={{ zIndex: 1 }}
              >
                <div
                  className="h-full bg-[#1565C0] transition-all duration-500"
                  style={{ width: `${((activeStep - 1) / 3) * 100}%` }}
                />
              </div>

              {/* Steps Grid: On desktop 4 columns, on mobile 1 column stacked cleanly */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 relative z-10">
                {steps.map((step) => {
                  const isActive = activeStep === step.number;
                  const isDone = activeStep > step.number;

                  return (
                    <div
                      key={step.number}
                      onClick={() => setActiveStep(step.number)}
                      className={`cursor-pointer group flex flex-col justify-start p-4 rounded-2xl transition-all ${
                        isActive
                          ? "bg-blue-50/50 ring-2 ring-[#1565C0]/20"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      {/* Step Circle Badge */}
                      <div className="mb-5 flex items-center">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-base transition-all ${
                            isActive
                              ? "bg-[#1565C0] text-white ring-4 ring-blue-100 shadow-md scale-105"
                              : isDone
                              ? "bg-[#1565C0] text-white shadow-xs"
                              : "bg-white text-slate-700 border-2 border-slate-300 group-hover:border-[#1565C0]"
                          }`}
                        >
                          {step.number}
                        </div>
                      </div>

                      {/* Step Title on its own line */}
                      <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2 group-hover:text-[#1565C0] transition-colors">
                        {step.title}
                      </h3>

                      {/* Step Description on its own line with natural text wrapping */}
                      <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Bottom Host CTA Banner */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-[#1565C0] to-[#0D47A1] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to host your next gathering?
          </h2>
          <p className="mt-3 text-base sm:text-lg text-blue-100 max-w-xl mx-auto leading-relaxed">
            From Sunday cricket matches to comedy nights and packed concerts, post it on Vibe and fill every spot.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="/manage/create.php?ref=how-it-works-cta"
              className="px-8 py-3.5 rounded-xl bg-white text-[#1565C0] font-bold text-base hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all"
            >
              Start Hosting Now
            </a>
            <a
              href="/indore"
              className="px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-base border border-white/20 transition-colors"
            >
              Browse Events
            </a>
          </div>
        </div>
      </section>

      {/* 5. Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10 border-t border-slate-800 text-center text-xs">
        <div className="max-w-7xl mx-auto px-4">
          <p>© {new Date().getFullYear()} Vibe. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
