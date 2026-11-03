import { useState } from "react";
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
  ExternalLink,
} from "lucide-react";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How It Works – Vibe | Host Anything, Fill Every Spot" },
      {
        name: "description",
        content:
          "Vibe lets anyone host anything — from a Sunday cricket match with 10 players to a comedy night or festival for 1,000. Live in about five minutes.",
      },
      { property: "og:title", content: "How It Works – Vibe" },
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
   CUSTOM HIGH-FIDELITY VECTOR ICONS (Matching Screenshot 1 exactly)
   ========================================================================= */

// 1. Cricket Bat & Ball (Sports & Games)
function SportsCricketIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="select-none drop-shadow-md"
    >
      {/* Cricket Bat Handle */}
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
      {/* Cricket Bat Blade */}
      <path
        d="M17.5 17.5L29 31C30.5 32.8 31 35.5 29.8 37.2L28 39.5C26.5 41.2 23.8 41.5 21.8 40.2L11 31.5C9.8 30.5 9.5 28.8 10.2 27.5L16.2 18.2C16.5 17.7 17.1 17.3 17.5 17.5Z"
        fill="#E0A96D"
      />
      <path
        d="M20 20L28 30C29.2 31.5 29.5 33.5 28.5 35L27 37C25.8 38.5 23.8 38.8 22.2 37.8L13 29.8L18.5 20.8C19 20.2 19.5 20 20 20Z"
        fill="#C68B59"
      />
      {/* Red Cricket Ball */}
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
      width="40"
      height="40"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="select-none drop-shadow-md"
    >
      {/* Mic Body / Handle (Purple) */}
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
      {/* Chrome Mic Capsule */}
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
      {/* Mesh lines */}
      <path
        d="M24 15L32 23M26 12L34 20M29 9L37 17"
        stroke="#475569"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* Mic Ring Accent */}
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
      width="40"
      height="40"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="select-none drop-shadow-md"
    >
      {/* Left Note Head */}
      <ellipse cx="14" cy="34" rx="5" ry="3.8" transform="rotate(-20 14 34)" fill="#A855F7" />
      {/* Left Stem */}
      <rect x="17" y="14" width="3" height="21" rx="1.5" fill="#9333EA" />
      {/* Right Note Head */}
      <ellipse cx="32" cy="29" rx="5" ry="3.8" transform="rotate(-20 32 29)" fill="#A855F7" />
      {/* Right Stem */}
      <rect x="35" y="9" width="3" height="21" rx="1.5" fill="#9333EA" />
      {/* Top Connecting Beam */}
      <path
        d="M17 17L38 12V8L17 13V17Z"
        fill="#7E22CE"
      />
      {/* Floating Sparkle / Accents */}
      <circle cx="10" cy="18" r="1.5" fill="#C084FC" />
      <circle cx="39" cy="23" r="2" fill="#E9D5FF" />
    </svg>
  );
}

// 4. Brain / Knowledge (Learn & Meet)
function LearnMeetIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="select-none drop-shadow-md"
    >
      {/* Pink Brain Graphic */}
      <path
        d="M24 12C20.5 12 17.5 14 16.5 17C14.5 17.5 12 19.5 12 23C12 25.5 13.5 27.5 15.5 28.5C15 29.5 15 31 16 32.5C17.2 34.5 19.5 35.5 22 35.5C23 35.5 23.5 35 24 34.5V12Z"
        fill="#F472B6"
      />
      <path
        d="M24 12C27.5 12 30.5 14 31.5 17C33.5 17.5 36 19.5 36 23C36 25.5 34.5 27.5 32.5 28.5C33 29.5 33 31 32 32.5C30.8 34.5 28.5 35.5 26 35.5C25 35.5 24.5 35 24 34.5V12Z"
        fill="#EC4899"
      />
      {/* Brain Folds / Convolutions */}
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
  // Theme state: defaults to 'dark' to replicate screenshot aesthetics exactly, toggleable to 'light'
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const isDark = theme === "dark";

  // Section 1 Data (Screenshot 1: "One place for every kind of gathering")
  const categories = [
    {
      icon: <SportsCricketIcon />,
      title: "Sports and games",
      description: "Cricket, football, badminton, run clubs",
    },
    {
      icon: <ComedyMicIcon />,
      title: "Comedy and open mics",
      description: "Stand-up nights, poetry, storytelling",
    },
    {
      icon: <MusicPartiesIcon />,
      title: "Music and parties",
      description: "Gigs, DJ nights, birthdays, reunions",
    },
    {
      icon: <LearnMeetIcon />,
      title: "Learn and meet",
      description: "Workshops, talks, startup meetups",
    },
  ];

  // Section 2 Data (Screenshot 2: "From a group of 10 to a crowd of 1,000")
  const scaleTiers = [
    {
      tier: "Small",
      title: "Pickup and meetups",
      description:
        "Set a player limit, split the ground fee, and let Vibe fill the empty spots. Perfect for matches, game nights and study groups.",
    },
    {
      tier: "Medium",
      title: "Shows and workshops",
      description:
        "Sell tickets, run a waitlist, and message everyone going. Built for comedy nights, classes and community events.",
    },
    {
      tier: "Large",
      title: "Festivals and concerts",
      description:
        "Tiered tickets, QR check-in at the gate, team access and live sales. Run a full-scale event from one dashboard.",
    },
  ];

  // Section 3 Data (Screenshot 3: "Live in about five minutes")
  const steps = [
    {
      number: 1,
      title: "Describe it",
      description:
        "Name it, pick a date and venue, set how many people you need.",
      icon: Calendar,
    },
    {
      number: 2,
      title: "Set the price",
      description:
        "Free, split-the-cost, or ticketed. Payments go straight to you.",
      icon: DollarSign,
    },
    {
      number: 3,
      title: "Share the link",
      description:
        "Post it on Vibe and WhatsApp. People nearby find it on their own.",
      icon: Share2,
    },
    {
      number: 4,
      title: "Show up",
      description:
        "Scan QR codes at the door or tick off your team. Done.",
      icon: QrCode,
    },
  ];

  return (
    <div
      className={`min-h-screen font-sans antialiased transition-colors duration-300 ${
        isDark ? "bg-[#060D1E] text-white" : "bg-[#F8FAFC] text-slate-800"
      }`}
    >
      {/* Discreet floating theme toggle */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          type="button"
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold shadow-xl border backdrop-blur-md transition-all ${
            isDark
              ? "bg-slate-900/90 text-slate-200 border-slate-700 hover:bg-slate-800"
              : "bg-white/90 text-slate-700 border-slate-300 hover:bg-slate-100"
          }`}
          title="Toggle Dark / Light Theme"
        >
          {isDark ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Light</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-indigo-600" />
              <span>Dark</span>
            </>
          )}
        </button>
      </div>

      {/* =========================================================================
          SECTION 1: "One place for every kind of gathering" (Screenshot 1)
          ========================================================================= */}
      <section
        className={`pt-16 pb-16 sm:pt-20 sm:pb-24 transition-colors ${
          isDark ? "bg-[#060D1E]" : "bg-[#F8FAFC]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mb-10 sm:mb-14">
            <h1
              className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight ${
                isDark ? "text-white" : "text-slate-900"
              }`}
              style={{ fontFamily: "'Trapvoid', 'Bricolage Grotesque', 'Outfit', sans-serif" }}
            >
              One place for every kind of gathering
            </h1>
            <p
              className={`mt-4 text-base sm:text-lg leading-relaxed ${
                isDark ? "text-[#8EA2C6]" : "text-slate-600"
              }`}
            >
              Whether you are chasing players, an audience, or both, pick a
              category and see what is happening this week.
            </p>
          </div>

          {/* 4 Cards Grid - Pixel-perfect match to Screenshot 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                className={`rounded-[22px] p-6 sm:p-7 transition-all duration-300 flex flex-col justify-start ${
                  isDark
                    ? "bg-[#0C1B38] border border-[#162B54] hover:border-[#00e0ff]/50 hover:shadow-[0_10px_35px_rgba(0,224,255,0.09)]"
                    : "bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-[#0a6cf0]/40"
                }`}
              >
                {/* Visual Icon */}
                <div className="mb-5 flex items-center justify-start h-10 w-10">
                  {cat.icon}
                </div>

                {/* Card Title */}
                <h3
                  className={`text-xl font-bold tracking-tight mb-2.5 ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                  style={{ fontFamily: "'Trapvoid', 'Bricolage Grotesque', 'Outfit', sans-serif" }}
                >
                  {cat.title}
                </h3>

                {/* Card Description */}
                <p
                  className={`text-sm sm:text-[15px] leading-relaxed ${
                    isDark ? "text-[#8EA2C6]" : "text-slate-600"
                  }`}
                >
                  {cat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: "From a group of 10 to a crowd of 1,000" (Screenshot 2)
          ========================================================================= */}
      <section
        className={`py-14 sm:py-20 transition-colors ${
          isDark ? "bg-[#060D1E]" : "bg-[#F1F5F9]/50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mb-10 sm:mb-14">
            <h2
              className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight ${
                isDark ? "text-white" : "text-slate-900"
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
              The same tools work at any size. Start simple and add what you need
              as you grow.
            </p>
          </div>

          {/* 3 Cards Grid - Pixel-perfect match to Screenshot 2 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
            {scaleTiers.map((tier, idx) => (
              <div
                key={idx}
                className={`rounded-[22px] p-7 sm:p-8 transition-all duration-300 flex flex-col justify-start ${
                  isDark
                    ? "bg-[#0C1B38] border border-[#162B54] hover:border-[#00e0ff]/50 hover:shadow-[0_10px_35px_rgba(0,224,255,0.09)]"
                    : "bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-[#0a6cf0]/40"
                }`}
              >
                {/* Cyan Category Badge */}
                <div className="mb-3">
                  <span
                    className={`text-sm font-semibold tracking-wide ${
                      isDark ? "text-[#00D2FF]" : "text-[#0a6cf0]"
                    }`}
                  >
                    {tier.tier}
                  </span>
                </div>

                {/* Card Title */}
                <h3
                  className={`text-2xl font-bold tracking-tight mb-3 ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                  style={{ fontFamily: "'Trapvoid', 'Bricolage Grotesque', 'Outfit', sans-serif" }}
                >
                  {tier.title}
                </h3>

                {/* Card Description */}
                <p
                  className={`text-sm sm:text-[15px] leading-relaxed ${
                    isDark ? "text-[#8EA2C6]" : "text-slate-600"
                  }`}
                >
                  {tier.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: "Live in about five minutes" (Screenshot 3 - Connected Stepper)
          ========================================================================= */}
      <section
        className={`py-16 sm:py-24 transition-colors ${
          isDark ? "bg-[#060D1E]" : "bg-[#F8FAFC]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mb-14 sm:mb-16">
            <h2
              className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight ${
                isDark ? "text-white" : "text-slate-900"
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
              No forms to fight with. Four steps from idea to full house.
            </p>
          </div>

          {/* Stepper Grid Container with connecting horizontal line */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-8">
            {steps.map((step, idx) => (
              <div
                key={step.number}
                className="flex flex-col items-start text-left relative"
              >
                {/* Number Circle and Horizontal Connecting Line (on desktop) */}
                <div className="flex items-center w-full mb-5 relative">
                  {/* Step Number Circle */}
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm z-10 shrink-0 ${
                      isDark
                        ? "bg-[#0066FF] text-white shadow-[0_0_15px_rgba(0,102,255,0.4)]"
                        : "bg-[#0a6cf0] text-white shadow-[0_2px_10px_rgba(10,108,240,0.3)]"
                    }`}
                  >
                    {step.number}
                  </div>

                  {/* Connecting Line to next step (Hidden on last step and mobile) */}
                  {idx < steps.length - 1 && (
                    <div
                      className={`hidden lg:block absolute left-9 right-[-2rem] top-1/2 -translate-y-1/2 h-[2px] z-0 ${
                        isDark ? "bg-[#18325E]" : "bg-slate-300"
                      }`}
                    />
                  )}
                </div>

                {/* Step Title */}
                <h3
                  className={`text-xl font-bold tracking-tight mb-2.5 ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                  style={{ fontFamily: "'Trapvoid', 'Bricolage Grotesque', 'Outfit', sans-serif" }}
                >
                  {step.title}
                </h3>

                {/* Step Description */}
                <p
                  className={`text-sm sm:text-[15px] leading-relaxed ${
                    isDark ? "text-[#8EA2C6]" : "text-slate-600"
                  }`}
                >
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

            {/* =========================================================================
          VIDEO DEMO / WALKTHROUGH SECTION
          ========================================================================= */}
      <section
        className={`py-16 sm:py-24 transition-colors border-t ${
          isDark
            ? "bg-[#060D1E] border-slate-800"
            : "bg-white border-slate-200"
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div
            className={`inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 ${
              isDark
                ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                : "bg-blue-50 text-blue-600 border border-blue-100"
            }`}
          >
            Video Walkthrough
          </div>
          <h2
            className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
              isDark ? "text-white" : "text-slate-900"
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
          <div className="relative w-full pb-[56.25%] h-0 overflow-hidden rounded-2xl bg-slate-900 shadow-2xl border border-slate-200/80 dark:border-slate-800">
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
          DO YOU HOST EVENTS? (CREATOR BANNER)
          ========================================================================= */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(98deg, #0d4a8f 0%, #1562a9 40%, #1b7bc0 75%, #2497d5 100%)",
        }}
      >
        {/* Decorative floating bubbles matching reference banner */}
        <div
          aria-hidden="true"
          className="absolute w-10 h-10 rounded-full pointer-events-none"
          style={{ top: "12%", right: "28%", backgroundColor: "rgba(255, 255, 255, 0.15)" }}
        />
        <div
          aria-hidden="true"
          className="absolute w-12 h-12 rounded-full pointer-events-none"
          style={{ top: "42%", right: "6%", backgroundColor: "rgba(255, 255, 255, 0.12)" }}
        />
        <div
          aria-hidden="true"
          className="absolute w-14 h-14 rounded-full pointer-events-none"
          style={{ bottom: "18%", right: "36%", backgroundColor: "rgba(255, 255, 255, 0.12)" }}
        />
        <div
          aria-hidden="true"
          className="absolute w-5 h-5 rounded-full pointer-events-none"
          style={{ top: "8%", right: "38%", backgroundColor: "rgba(255, 255, 255, 0.22)" }}
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 min-h-[260px] sm:min-h-[290px] flex flex-col md:flex-row items-center justify-between relative z-10 pt-6 md:pt-0">
          {/* Left Column: Heading, Subhead, CTA Button & Links */}
          <div className="w-full md:w-7/12 py-6 md:py-8 text-left z-20">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
              Do you host events?
            </h2>
            <p className="text-base sm:text-lg text-blue-100/90 mt-1.5 mb-5 font-normal">
              Let’s make the world #Happening together
            </p>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <a
                href="/create"
                className="inline-flex items-center justify-center px-6 py-2.5 rounded bg-white text-[#0d4a8f] font-semibold text-sm shadow hover:bg-slate-50 hover:shadow-md transition-all transform hover:-translate-y-0.5"
              >
                Create an Event
              </a>
              <div className="flex items-center gap-2.5 text-white text-sm sm:text-base font-medium">
                <a href="/create" className="hover:text-blue-200 transition-colors">
                  Create
                </a>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-white/70" />
                <a href="/how-it-works" className="hover:text-blue-200 transition-colors">
                  Promote
                </a>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-white/70" />
                <a href="/how-it-works" className="hover:text-blue-200 transition-colors">
                  Sell
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Floating Testimonial Pill & Person Image */}
          <div className="w-full md:w-5/12 flex items-end justify-center md:justify-end relative min-h-[220px] md:min-h-[260px] mt-3 md:mt-0">
            {/* Instagram Testimonial Card */}
            <div className="relative md:absolute md:left-2 lg:-left-6 md:top-1/3 md:-translate-y-1/2 z-30 bg-white rounded-lg shadow-lg px-3.5 py-2.5 flex items-center gap-2.5 border border-slate-100 mb-3 md:mb-0">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 p-1">
                <img
                  src="/site-assets/546ba667917ff012.png"
                  alt="Instagram"
                  className="w-5 h-5 object-contain"
                />
              </div>
              <div className="text-left leading-tight">
                <div className="font-semibold text-slate-800 text-xs sm:text-sm">@suyash</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Speaker & Host</div>
              </div>
            </div>

            {/* Host Person Image - Suyash (Compact & proportional) */}
            <div className="relative z-20 flex items-end justify-center">
              <img
                src="/site-assets/host-person-cutout.png"
                alt="Suyash - Event Host"
                className="max-h-[220px] sm:max-h-[250px] md:max-h-[280px] object-contain select-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FOOTER
          ========================================================================= */}
      <footer
        className={`py-8 text-center text-xs border-t transition-colors ${
          isDark
            ? "bg-[#040814] border-slate-800 text-slate-500"
            : "bg-slate-900 border-slate-800 text-slate-400"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <p>© {new Date().getFullYear()} Vibe. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
