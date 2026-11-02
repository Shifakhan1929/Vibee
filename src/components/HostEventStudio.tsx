import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Wand2,
  SlidersHorizontal,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Lock,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  UploadCloud,
  FileText,
  Calendar,
  Clock,
  MapPin,
  Tag,
  DollarSign,
  Users,
  Share2,
  Copy,
  ExternalLink,
  Flame,
  Zap,
} from "lucide-react";

type StudioMode = "hub" | "ai" | "manual" | "published";

interface EventDraft {
  title: string;
  category: string;
  city: string;
  venue: string;
  date: string;
  time: string;
  pricingType: "free" | "split" | "paid";
  price: string;
  capacity: string;
  description: string;
  posterUrl: string;
}

const SAMPLE_POSTERS = [
  {
    id: "poster-cricket",
    label: "Cricket Turf Tournament",
    icon: "🏏",
    imageUrl:
      "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop&q=80",
    extracted: {
      title: "Indore Premier Box Cricket League 2026",
      category: "Sports & Turf",
      city: "Indore",
      venue: "Velocity Arena Turf, Vijay Nagar",
      date: "SUN, 25 OCT 2026",
      time: "6:00 PM – 10:00 PM",
      pricingType: "split" as const,
      price: "150",
      capacity: "16",
      description:
        "7-a-side floodlight tournament with heavy tennis ball. Trophies for Winners & Runners-up. Energy drinks and hot chai provided after match.",
    },
  },
  {
    id: "poster-concert",
    label: "Live Indie Acoustic Session",
    icon: "🎸",
    imageUrl:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80",
    extracted: {
      title: "Soul & Strings: Live Sunset Jam",
      category: "Live Music",
      city: "Mumbai",
      venue: "The Rooftop Lounge, Bandra West",
      date: "SAT, 31 OCT 2026",
      time: "7:30 PM – 10:30 PM",
      pricingType: "paid" as const,
      price: "299",
      capacity: "50",
      description:
        "An unplugged evening with indie singer-songwriters under the sunset sky. Limited seating to preserve intimate ambience.",
    },
  },
  {
    id: "poster-comedy",
    label: "Stand-Up Open Mic Night",
    icon: "🎤",
    imageUrl:
      "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&auto=format&fit=crop&q=80",
    extracted: {
      title: "Laugh Out Loud: Fresh Comedy Open Mic",
      category: "Comedy & Open Mics",
      city: "Pune",
      venue: "Cafe Blend & Roast, Koregaon Park",
      date: "FRI, 23 OCT 2026",
      time: "8:00 PM – 9:30 PM",
      pricingType: "free" as const,
      price: "0",
      capacity: "40",
      description:
        "10 comic spots, 5 minutes each. Headlined by city touring comics. Support fresh talent and grab coffee and fries.",
    },
  },
  {
    id: "poster-tech",
    label: "AI Builders & Founders Mixer",
    icon: "💻",
    imageUrl:
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=80",
    extracted: {
      title: "AI Founders, Hackers & Indie Builders",
      category: "Technology",
      city: "Bengaluru",
      venue: "Third Wave Coffee Roasters, Koramangala",
      date: "SAT, 07 NOV 2026",
      time: "11:00 AM – 2:00 PM",
      pricingType: "free" as const,
      price: "0",
      capacity: "25",
      description:
        "Casual demos, product feedback, and peer architecture chats for builders shipping AI agents and SaaS apps.",
    },
  },
];

export function HostEventStudio() {
  const [mode, setMode] = useState<StudioMode>("hub");
  const [isAiScanning, setIsAiScanning] = useState(false);
  const [aiScanStatus, setAiScanStatus] = useState("");
  const [selectedPosterId, setSelectedPosterId] = useState<string>("poster-cricket");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [draft, setDraft] = useState<EventDraft>({
    title: "Sunday Gully Cricket Championship",
    category: "Sports & Turf",
    city: "Indore",
    venue: "Arera Colony Turf Ground 2",
    date: "SUN, 25 OCT 2026",
    time: "7:00 AM",
    pricingType: "split",
    price: "100",
    capacity: "14",
    description: "Friendly casual gully cricket match. All gear and match balls provided.",
    posterUrl: SAMPLE_POSTERS[0].imageUrl,
  });

  const [publishedUrl, setPublishedUrl] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // AI Extraction Simulator
  const handleSimulateAiScan = (posterId: string) => {
    setSelectedPosterId(posterId);
    const poster = SAMPLE_POSTERS.find((p) => p.id === posterId) || SAMPLE_POSTERS[0];
    setIsAiScanning(true);
    setAiScanStatus("Vision OCR: Ingesting poster text...");

    setTimeout(() => {
      setAiScanStatus("Extracting dates, venue GPS coordinates, and pricing...");
    }, 800);

    setTimeout(() => {
      setAiScanStatus("Draft ready! Synthesizing editorial event page...");
    }, 1500);

    setTimeout(() => {
      setIsAiScanning(false);
      setDraft({
        ...poster.extracted,
        posterUrl: poster.imageUrl,
      });
      showToast("✨ Event extracted from flyer with 98% accuracy!");
    }, 2200);
  };

  // Publish Event
  const handlePublish = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!draft.title.trim()) {
      alert("Please provide an event title");
      return;
    }

    const eventId = `vibe-${Date.now().toString(36)}`;
    const url = `/indore?event=${eventId}&title=${encodeURIComponent(draft.title)}`;
    setPublishedUrl(url);

    // Save into localStorage
    try {
      const stored = localStorage.getItem("vibe_hosted_events") || "[]";
      const events = JSON.parse(stored);
      events.unshift({
        id: eventId,
        ...draft,
        publishedAt: Date.now(),
      });
      localStorage.setItem("vibe_hosted_events", JSON.stringify(events));
    } catch (_) {}

    setMode("published");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-800 relative overflow-hidden font-sans selection:bg-[#0A6CF0] selection:text-slate-900">
      {/* Background Ambient Glows matching Vibe Studio */}
      <div className="absolute -top-32 left-1/4 w-96 h-96 bg-[#0A6CF0]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-48 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Floating Toast */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-black/90 backdrop-blur-md border border-white/20 text-slate-900 text-xs font-semibold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <Sparkles className="w-4 h-4 text-[#0A6CF0]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =========================================================================
          TOPBAR HEADER
          ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs text-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              title="Back to home"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <Link to="/" className="flex items-center gap-1.5 font-sans">
              <Flame className="w-5 h-5 text-[#0A6CF0] fill-[#0A6CF0]" />
              <span className="font-extrabold text-lg text-slate-900 tracking-tight">Vibe</span>
              <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 text-[#0A6CF0] border border-slate-300 px-2 py-0.5 rounded-md ml-1">
                HOST STUDIO
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700"
            >
              Host Dashboard
            </Link>

            <Link
              to="/vibes"
              className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              <Zap className="w-3.5 h-3.5 text-[#00e0ff]" />
              Live Vibes Feed
            </Link>

            <Link
              to="/how-it-works"
              className="hidden md:inline-flex text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              How It Works
            </Link>

            {mode !== "hub" && (
              <button
                onClick={() => setMode("hub")}
                type="button"
                className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-900 transition-colors cursor-pointer"
              >
                Change Method
              </button>
            )}
          </div>
        </div>
      </header>

      {/* =========================================================================
          VIEW 1: HUB SELECTION ("How would you like to host?")
          Matches vibe-seven-pied.vercel.app/create
          ========================================================================= */}
      {mode === "hub" && (
        <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-14 w-full relative z-10 flex flex-col justify-center">
          {/* Header */}
          <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-300 shadow-2xs text-[11px] font-bold text-[#0A6CF0] mb-3 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 fill-[#0A6CF0]" />
              <span>Create & Publish</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
              How would you like to host?
            </h1>

            <p className="text-sm sm:text-base text-slate-500 mt-2.5 leading-relaxed">
              Choose instant AI flyer extraction or launch our step-by-step custom studio.
            </p>
          </div>

          {/* Two Main Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-7">
            {/* CARD 1: 1-Click AI Fast Track */}
            <div
              onClick={() => {
                setMode("ai");
                handleSimulateAiScan("poster-cricket");
              }}
              className="group relative flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:border-[#0A6CF0] hover:shadow-[0_0_35px_rgba(255,85,0,0.22)] transition-all duration-300 text-left overflow-hidden cursor-pointer"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF5500] to-amber-400 opacity-90 group-hover:opacity-100 transition-opacity" />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0B1F4B] to-[#0A6CF0] text-slate-900 flex items-center justify-center shadow-md shadow-[#FF5500]/25 group-hover:scale-105 transition-transform duration-200">
                    <Wand2 className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#0A6CF0]/15 text-[#0A6CF0] border border-[#0A6CF0]/25">
                    1-Click Fast Track
                  </span>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-[#0A6CF0] transition-colors">
                    Create with AI
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
                    Drop an event poster flyer, paste a BookMyShow/Luma link, or prompt in text. AI extracts dates, venue, and descriptions automatically.
                  </p>
                </div>

                {/* Feature Bullet Points */}
                <div className="pt-2 space-y-2 border-t border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Flyer Poster Vision OCR & Smart Parsing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Auto-generated cover art & agenda</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Live draft ready in &lt; 30 seconds</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6">
                <div className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#0B1F4B] to-[#0A6CF0] group-hover:brightness-110 text-slate-900 font-bold text-xs sm:text-sm flex items-center justify-between transition-all shadow-md shadow-[#FF5500]/20">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 fill-white" />
                    <span>Launch AI Studio</span>
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* CARD 2: Custom Event Studio */}
            <div
              onClick={() => setMode("manual")}
              className="group relative flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:border-white/30 hover:shadow-[0_0_35px_rgba(255,255,255,0.08)] transition-all duration-300 text-left overflow-hidden cursor-pointer"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-80 group-hover:opacity-100 transition-opacity" />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-300 text-slate-900 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                    <SlidersHorizontal className="w-6 h-6 text-indigo-400" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-300">
                    Total Control
                  </span>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-indigo-300 transition-colors">
                    Custom Event Studio
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
                    Fine-tune multi-tier tickets, early-bird pricing, custom registration questions, capacity caps, and instant WhatsApp check-in.
                  </p>
                </div>

                {/* Feature Bullet Points */}
                <div className="pt-2 space-y-2 border-t border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>Tiered passes & custom approval gates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>Offline ground/turf fee split calculation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>Custom forms, tags, and broadcast tools</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6">
                <div className="w-full py-3 px-4 rounded-2xl bg-slate-100 group-hover:bg-white/15 border border-slate-200 group-hover:border-white/20 text-slate-900 font-bold text-xs sm:text-sm flex items-center justify-between transition-colors shadow-2xs">
                  <span className="flex items-center gap-1.5">
                    <SlidersHorizontal className="w-4 h-4" />
                    <span>Start Custom Setup</span>
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Trust Badge Bar */}
          <div className="mt-8 sm:mt-12 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-wrap items-center justify-around gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold flex items-center justify-center text-[10px]">
                0%
              </span>
              <span className="font-semibold text-slate-900">Zero Host Fees</span>
            </div>

            <div className="hidden sm:block w-px h-4 bg-slate-100" />

            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-600" />
              <span className="font-semibold text-slate-900">Public or Invite-Only</span>
            </div>

            <div className="hidden sm:block w-px h-4 bg-slate-100" />

            <div className="flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-semibold text-slate-900">WhatsApp & Telegram Alerts</span>
            </div>
          </div>
        </main>
      )}

      {/* =========================================================================
          VIEW 2: AI FLYER INGESTION STUDIO
          ========================================================================= */}
      {mode === "ai" && (
        <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 w-full relative z-10">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0A6CF0]">
                AI Vision Ingestion
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Upload or Pick a Flyer Poster
              </h2>
            </div>
            <button
              onClick={() => setMode("manual")}
              className="text-xs text-neutral-400 hover:text-slate-900 underline cursor-pointer"
            >
              Switch to manual form
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Poster selection & scanner */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
                  Sample Event Flyers (Click to test AI scan)
                </label>

                <div className="grid grid-cols-2 gap-2.5">
                  {SAMPLE_POSTERS.map((poster) => (
                    <button
                      key={poster.id}
                      type="button"
                      onClick={() => handleSimulateAiScan(poster.id)}
                      className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                        selectedPosterId === poster.id
                          ? "bg-[#0A6CF0]/15 border-[#0A6CF0] text-slate-900"
                          : "bg-slate-50 border-slate-200 text-neutral-300 hover:bg-slate-100"
                      }`}
                    >
                      <span className="text-xl mb-1">{poster.icon}</span>
                      <span className="text-xs font-bold line-clamp-1">{poster.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload Dropzone */}
              <div className="border-2 border-dashed border-slate-300 hover:border-[#0A6CF0]/50 rounded-2xl p-6 text-center bg-white border border-slate-200 transition-colors cursor-pointer">
                <UploadCloud className="w-10 h-10 text-[#0A6CF0] mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-900 mb-0.5">Drop flyer image here</h4>
                <p className="text-xs text-neutral-400">PNG, JPG, or PDF up to 15MB</p>
              </div>

              {/* Scanning status banner */}
              {isAiScanning && (
                <div className="p-4 rounded-2xl bg-[#0A6CF0]/10 border border-[#0A6CF0]/30 text-slate-900 space-y-2 animate-pulse">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#0A6CF0]">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>AI OCR in Progress</span>
                  </div>
                  <p className="text-xs text-neutral-300">{aiScanStatus}</p>
                </div>
              )}
            </div>

            {/* Right: Extracted Event Draft Form */}
            <div className="lg:col-span-7 bg-white border border-slate-200 shadow-sm rounded-3xl p-6 sm:p-7 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  AI Parsed Event Draft
                </span>
                <span className="text-[11px] text-neutral-400 font-mono">Status: Ready to publish</span>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="text-neutral-400 font-semibold mb-1 block">Event Title</label>
                  <input
                    type="text"
                    value={draft.title}
                    onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm font-bold focus:outline-hidden focus:border-[#0A6CF0]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-neutral-400 font-semibold mb-1 block">Category</label>
                    <input
                      type="text"
                      value={draft.category}
                      onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 font-semibold mb-1 block">City</label>
                    <input
                      type="text"
                      value={draft.city}
                      onChange={(e) => setDraft({ ...draft, city: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-neutral-400 font-semibold mb-1 block">Venue Address</label>
                  <input
                    type="text"
                    value={draft.venue}
                    onChange={(e) => setDraft({ ...draft, venue: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="text-neutral-400 font-semibold mb-1 block">Date</label>
                    <input
                      type="text"
                      value={draft.date}
                      onChange={(e) => setDraft({ ...draft, date: e.target.value })}
                      className="w-full px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 font-semibold mb-1 block">Time</label>
                    <input
                      type="text"
                      value={draft.time}
                      onChange={(e) => setDraft({ ...draft, time: e.target.value })}
                      className="w-full px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 font-semibold mb-1 block">Spots Limit</label>
                    <input
                      type="text"
                      value={draft.capacity}
                      onChange={(e) => setDraft({ ...draft, capacity: e.target.value })}
                      className="w-full px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-neutral-400 font-semibold mb-1 block">Description</label>
                  <textarea
                    rows={3}
                    value={draft.description}
                    onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs leading-relaxed"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => handlePublish()}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#0B1F4B] to-[#0A6CF0] hover:brightness-110 text-slate-900 font-bold text-sm shadow-lg shadow-[#FF5500]/25 cursor-pointer transition-all"
                >
                  Publish Live Event
                </button>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* =========================================================================
          VIEW 3: MANUAL CUSTOM STUDIO
          ========================================================================= */}
      {mode === "manual" && (
        <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 w-full relative z-10">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Custom Studio
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Step-by-Step Event Setup
              </h2>
            </div>
            <button
              onClick={() => setMode("ai")}
              className="text-xs text-neutral-400 hover:text-slate-900 underline cursor-pointer"
            >
              Switch to AI flyer mode
            </button>
          </div>

          <form onSubmit={handlePublish} className="space-y-6">
            <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 sm:p-8 space-y-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2">
                1. Basic Info
              </h3>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Event Headline / Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bandra Box Cricket Weekend Cup"
                  value={draft.title}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm font-bold focus:outline-hidden focus:border-[#0A6CF0]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Category
                  </label>
                  <select
                    value={draft.category}
                    onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#141416] border border-slate-300 text-slate-900 text-xs font-medium"
                  >
                    <option value="Sports & Turf">Sports & Turf</option>
                    <option value="Live Music">Live Music</option>
                    <option value="Comedy & Open Mics">Comedy & Open Mics</option>
                    <option value="Technology">Technology & Hackers</option>
                    <option value="Social & Cafes">Social & Cafes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">City</label>
                  <select
                    value={draft.city}
                    onChange={(e) => setDraft({ ...draft, city: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#141416] border border-slate-300 text-slate-900 text-xs font-medium"
                  >
                    <option value="Indore">Indore</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Pune">Pune</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Delhi">Delhi</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Venue & Ground Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Velocity Arena Turf, Vijay Nagar"
                  value={draft.venue}
                  onChange={(e) => setDraft({ ...draft, venue: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs"
                />
              </div>

              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2 pt-4">
                2. Timing & Pricing
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Date</label>
                  <input
                    type="text"
                    value={draft.date}
                    onChange={(e) => setDraft({ ...draft, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Time</label>
                  <input
                    type="text"
                    value={draft.time}
                    onChange={(e) => setDraft({ ...draft, time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Total Capacity / Spots
                  </label>
                  <input
                    type="number"
                    value={draft.capacity}
                    onChange={(e) => setDraft({ ...draft, capacity: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-neutral-300">
                  Ticketing & Cost Model
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "free", label: "Free RSVP", desc: "No charge" },
                    { id: "split", label: "Split Ground Fee", desc: "Fair split (₹)" },
                    { id: "paid", label: "Ticketed Pass", desc: "Set price per ticket" },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setDraft({ ...draft, pricingType: p.id as any })}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        draft.pricingType === p.id
                          ? "bg-[#0A6CF0]/15 border-[#0A6CF0] text-slate-900"
                          : "bg-slate-50 border-slate-200 text-neutral-400 hover:bg-slate-100"
                      }`}
                    >
                      <div className="font-bold text-xs">{p.label}</div>
                      <div className="text-[10px] text-neutral-400 mt-0.5">{p.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {draft.pricingType !== "free" && (
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Amount per person (₹)
                  </label>
                  <input
                    type="number"
                    value={draft.price}
                    onChange={(e) => setDraft({ ...draft, price: e.target.value })}
                    className="w-44 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm font-bold"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  About Event & Guidelines
                </label>
                <textarea
                  rows={3}
                  value={draft.description}
                  onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs leading-relaxed"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#0B1F4B] to-[#0A6CF0] hover:brightness-110 text-slate-900 font-bold text-sm shadow-lg shadow-[#FF5500]/25 cursor-pointer transition-all"
                >
                  Publish Event Now
                </button>
              </div>
            </div>
          </form>
        </main>
      )}

      {/* =========================================================================
          VIEW 4: PUBLISHED CONFIRMATION
          ========================================================================= */}
      {mode === "published" && (
        <main className="flex-1 max-w-xl mx-auto px-4 py-12 sm:py-20 flex items-center justify-center w-full relative z-10 text-center">
          <div className="w-full bg-white border border-slate-200 border border-slate-300 rounded-3xl p-7 sm:p-9 shadow-2xl space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center text-2xl shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              ✓
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Event is Live
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">{draft.title}</h2>
              <p className="text-xs text-neutral-400">
                {draft.date} · {draft.time} · {draft.venue}, {draft.city}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 text-left text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-neutral-400">Category:</span>
                <span className="text-slate-900 font-semibold">{draft.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Pricing:</span>
                <span className="text-slate-900 font-semibold">
                  {draft.pricingType === "free" ? "Free Entry" : `₹${draft.price} per person`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Spots:</span>
                <span className="text-slate-900 font-semibold">{draft.capacity} Max</span>
              </div>
            </div>

            <div className="space-y-2.5">
              <a
                href={publishedUrl || `/indore`}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#0B1F4B] to-[#0A6CF0] text-slate-900 font-bold text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <span>View Event Landing Page</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Hey, I just published "${draft.title}" on Vibe! Check it out and reserve your spot: ${window.location.origin}${publishedUrl}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-[#25D366] hover:brightness-110 text-slate-900 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <span>Share Invite on WhatsApp</span>
              </a>

              <Link
                to="/dashboard"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF5500]/20 to-[#E04B00]/20 hover:from-[#FF5500]/30 hover:to-[#E04B00]/30 border border-[#0A6CF0]/40 text-slate-900 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <span>Open Host Dashboard</span>
                <ArrowRight className="w-4 h-4 text-[#0A6CF0]" />
              </Link>

              <button
                type="button"
                onClick={() => setMode("hub")}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-white/15 text-neutral-300 text-xs font-semibold cursor-pointer"
              >
                Host Another Event
              </button>
            </div>
          </div>
        </main>
      )}

      {/* =========================================================================
          FOOTER
          ========================================================================= */}
      <footer className="py-6 border-t border-slate-200 text-center text-xs text-slate-400">
        <div className="max-w-6xl mx-auto px-4">
          <p>© {new Date().getFullYear()} Vibe by Swaniki. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
export default HostEventStudio;

