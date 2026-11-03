import React, { useState, useEffect, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Flame,
  Plus,
  Share2,
  QrCode,
  Radio,
  MessageSquare,
  Search,
  CheckCircle2,
  ExternalLink,
  Trash2,
  ArrowRight,
  TrendingUp,
  DollarSign,
  X,
  Send,
  Zap,
  Sparkles,
} from "lucide-react";

export interface HostedEvent {
  id: string;
  title: string;
  category: "Cricket" | "Music" | "Comedy" | "Tech" | "Party" | "Workshop" | string;
  city: string;
  venue: string;
  date: string;
  time: string;
  pricingType: "free" | "split" | "ticket";
  price: string;
  capacity: number;
  joined: number;
  status: "published" | "draft" | "past";
  coverUrl: string;
  description?: string;
  publishedAt: number;
  url?: string;
}

export interface GuestInquiry {
  id: string;
  eventId: string;
  eventTitle: string;
  guestName: string;
  guestEmail: string;
  question: string;
  reply?: string;
  timeAgo: string;
  isRead: boolean;
}

export interface AttendeeTicket {
  ticketId: string;
  name: string;
  phone: string;
  spots: number;
  checkedIn: boolean;
  checkInTime?: string;
}

const DEFAULT_SEED_EVENTS: HostedEvent[] = [
  {
    id: "vibe-cricket-indore-1",
    title: "Indore Box Cricket Championship",
    category: "Cricket",
    city: "Indore",
    venue: "Arera Arena, Ground 2",
    date: "Sun, 24 Oct",
    time: "7:00 PM",
    pricingType: "split",
    price: "₹150",
    capacity: 14,
    joined: 10,
    status: "published",
    coverUrl:
      "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop&q=80",
    description: "6-a-side floodlight box cricket match. All gear provided, fresh chai after final over.",
    publishedAt: Date.now() - 86400000 * 2,
    url: "/indore?event=cricket",
  },
  {
    id: "vibe-music-mumbai-2",
    title: "Soul & Strings: Acoustic Rooftop Jam",
    category: "Music",
    city: "Mumbai",
    venue: "Skyline Lounge, Bandra",
    date: "Sat, 30 Oct",
    time: "6:30 PM",
    pricingType: "ticket",
    price: "₹499",
    capacity: 40,
    joined: 34,
    status: "published",
    coverUrl:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80",
    description: "Sunset acoustic session with indie songwriters. Intimate vibes and mocktails included.",
    publishedAt: Date.now() - 86400000 * 4,
    url: "/indore?event=music",
  },
  {
    id: "vibe-comedy-pune-3",
    title: "Laugh Riot: Open Mic Comedy",
    category: "Comedy",
    city: "Pune",
    venue: "The Attic Cafe, FC Road",
    date: "Fri, 29 Oct",
    time: "8:00 PM",
    pricingType: "free",
    price: "Free RSVP",
    capacity: 50,
    joined: 42,
    status: "published",
    coverUrl:
      "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&auto=format&fit=crop&q=80",
    description: "10 comics testing brand new sets. Free entry, coffee & laughs guaranteed.",
    publishedAt: Date.now() - 86400000 * 6,
    url: "/indore?event=comedy",
  },
  {
    id: "vibe-tech-bengaluru-4",
    title: "AI Builders & Founders Mixer",
    category: "Tech",
    city: "Bengaluru",
    venue: "Third Wave Coffee, Koramangala",
    date: "Wed, 15 Sep",
    time: "5:00 PM",
    pricingType: "free",
    price: "Free RSVP",
    capacity: 30,
    joined: 30,
    status: "past",
    coverUrl:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
    description: "Casual weekend meetup for LLM researchers and engineers building agentic workflows.",
    publishedAt: Date.now() - 86400000 * 45,
    url: "/indore?event=tech",
  },
];

const DEFAULT_GUEST_INQUIRIES: GuestInquiry[] = [
  {
    id: "inq-1",
    eventId: "vibe-cricket-indore-1",
    eventTitle: "Indore Box Cricket Championship",
    guestName: "Arjun Verma",
    guestEmail: "arjun.v@gmail.com",
    question: "Do you provide leather balls or tennis balls? Also is parking available at Ground 2?",
    timeAgo: "2 hours ago",
    isRead: false,
  },
  {
    id: "inq-2",
    eventId: "vibe-music-mumbai-2",
    eventTitle: "Soul & Strings: Acoustic Rooftop Jam",
    guestName: "Pooja Hegde",
    guestEmail: "pooja.h@outlook.com",
    question: "Can I bring my own acoustic guitar for the jam session after the main set?",
    timeAgo: "5 hours ago",
    isRead: false,
  },
  {
    id: "inq-3",
    eventId: "vibe-comedy-pune-3",
    eventTitle: "Laugh Riot: Open Mic Comedy",
    guestName: "Rohan Kulkarni",
    guestEmail: "rohan.k@gmail.com",
    question: "Is there any age restriction for the audience? Bringing my younger cousin.",
    timeAgo: "1 day ago",
    isRead: true,
    reply: "Open to 16+! Casual and friendly environment.",
  },
];

export function HostDashboard() {
  const [events, setEvents] = useState<HostedEvent[]>([]);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "drafts" | "messages">("upcoming");
  const [messagesFilter, setMessagesFilter] = useState<"all" | "unread" | "replied">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [dispatchModalEvent, setDispatchModalEvent] = useState<HostedEvent | null>(null);
  const [scanModalEvent, setScanModalEvent] = useState<HostedEvent | null>(null);
  const [inquiries, setInquiries] = useState<GuestInquiry[]>(DEFAULT_GUEST_INQUIRIES);
  const [selectedInquiry, setSelectedInquiry] = useState<GuestInquiry | null>(null);
  const [replyText, setReplyText] = useState("");

  // Live Dispatch state
  const [dispatchPreset, setDispatchPreset] = useState("✨ Final Briefing");
  const [dispatchBody, setDispatchBody] = useState("");
  const [dispatchSuccess, setDispatchSuccess] = useState(false);

  // Ticket scanner state
  const [attendeeTickets, setAttendeeTickets] = useState<Record<string, AttendeeTicket[]>>({
    "vibe-cricket-indore-1": [
      { ticketId: "VIBE-849102", name: "Karan Sharma", phone: "+91 98260 11223", spots: 1, checkedIn: true, checkInTime: "6:45 PM" },
      { ticketId: "VIBE-339218", name: "Aman Patel", phone: "+91 98270 44556", spots: 2, checkedIn: false },
      { ticketId: "VIBE-772109", name: "Vikram Rathi", phone: "+91 94250 88990", spots: 1, checkedIn: false },
      { ticketId: "VIBE-119283", name: "Devansh Mehra", phone: "+91 98930 22334", spots: 2, checkedIn: true, checkInTime: "6:52 PM" },
    ],
    "vibe-music-mumbai-2": [
      { ticketId: "VIBE-992812", name: "Siddharth Roy", phone: "+91 98200 55443", spots: 2, checkedIn: false },
      { ticketId: "VIBE-664192", name: "Meera Nair", phone: "+91 98211 77665", spots: 1, checkedIn: true, checkInTime: "6:15 PM" },
    ],
  });
  const [ticketSearchQuery, setTicketSearchQuery] = useState("");

  // Toast notification helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load events from localStorage and merge with seed
  useEffect(() => {
    try {
      const stored = localStorage.getItem("vibe_hosted_events");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const userIds = new Set(parsed.map((p: any) => p.id));
          const combined = [
            ...parsed.map((p: any) => ({
              ...p,
              capacity: Number(p.capacity) || 20,
              joined: Number(p.joined) || Math.floor((Number(p.capacity) || 20) * 0.65),
              status: p.status || "published",
              publishedAt: p.publishedAt || Date.now(),
            })),
            ...DEFAULT_SEED_EVENTS.filter((seed) => !userIds.has(seed.id)),
          ];
          setEvents(combined);
          return;
        }
      }
      setEvents(DEFAULT_SEED_EVENTS);
      localStorage.setItem("vibe_hosted_events", JSON.stringify(DEFAULT_SEED_EVENTS));
    } catch (_) {
      setEvents(DEFAULT_SEED_EVENTS);
    }
  }, []);

  // Delete event
  const handleDeleteEvent = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      const filtered = events.filter((e) => e.id !== id);
      setEvents(filtered);
      try {
        localStorage.setItem("vibe_hosted_events", JSON.stringify(filtered));
      } catch (_) {}
      showToast(`Event "${title}" removed.`);
    }
  };

  // WhatsApp Share helper
  const handleShareWhatsApp = (e: HostedEvent) => {
    const eventUrl = window.location.origin + (e.url || `/create`);
    const text = encodeURIComponent(
      `Hey! I'm hosting "${e.title}" on Vibe.\n\n` +
      `📅 Date: ${e.date} · ${e.time}\n` +
      `📍 Venue: ${e.venue}, ${e.city}\n` +
      `🎟️ Passes: ${e.pricingType === "free" ? "Free RSVP" : e.price}\n\n` +
      `Reserve your spot here: ${eventUrl}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  // Send Live Dispatch
  const handleSendDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchModalEvent) return;
    setDispatchSuccess(true);
    setTimeout(() => {
      setDispatchSuccess(false);
      setDispatchModalEvent(null);
      setDispatchBody("");
      showToast(`📢 Dispatch sent to all attendees of "${dispatchModalEvent.title}"`);
    }, 1200);
  };

  // Check-in attendee
  const handleToggleCheckIn = (eventId: string, ticketId: string) => {
    setAttendeeTickets((prev) => {
      const list = prev[eventId] || [];
      const updated = list.map((t) =>
        t.ticketId === ticketId
          ? {
              ...t,
              checkedIn: !t.checkedIn,
              checkInTime: !t.checkedIn
                ? new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                : "",
            }
          : t
      );
      return { ...prev, [eventId]: updated };
    });
    showToast("Guest status updated.");
  };

  // Reply to inquiry
  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry || !replyText.trim()) return;
    setInquiries((prev) =>
      prev.map((inq) =>
        inq.id === selectedInquiry.id
          ? { ...inq, reply: replyText.trim(), isRead: true }
          : inq
      )
    );
    setSelectedInquiry((prev) => (prev ? { ...prev, reply: replyText.trim(), isRead: true } : null));
    setReplyText("");
    showToast(`Reply emailed to ${selectedInquiry.guestEmail}`);
  };

  // Computed Metrics
  const metrics = useMemo(() => {
    const upcomingCount = events.filter((e) => e.status === "published").length;
    const totalJoined = events.reduce((sum, e) => sum + (e.joined || 0), 0);
    const unreadInquiries = inquiries.filter((inq) => !inq.isRead).length;

    let revenue = 0;
    events.forEach((e) => {
      if (e.pricingType === "ticket" || e.pricingType === "split") {
        const val = parseInt(e.price.replace(/[^\d]/g, ""), 10) || 0;
        revenue += val * (e.joined || 0);
      }
    });

    return {
      upcomingCount,
      totalJoined,
      unreadInquiries,
      revenueFormatted: revenue > 0 ? `₹${revenue.toLocaleString("en-IN")}` : "₹0",
    };
  }, [events, inquiries]);

  // Filtered Events by tab & search
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      if (activeTab === "upcoming" && e.status !== "published") return false;
      if (activeTab === "past" && e.status !== "past") return false;
      if (activeTab === "drafts" && e.status !== "draft") return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = e.title.toLowerCase().includes(q);
        const matchesCity = e.city.toLowerCase().includes(q);
        const matchesVenue = e.venue.toLowerCase().includes(q);
        const matchesCategory = e.category.toLowerCase().includes(q);
        return matchesTitle || matchesCity || matchesVenue || matchesCategory;
      }
      return true;
    });
  }, [events, activeTab, searchQuery]);

  // Filtered Guest Inquiries for the on-page Messages tab
  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inq) => {
      if (messagesFilter === "unread" && inq.isRead) return false;
      if (messagesFilter === "replied" && !inq.reply) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = inq.guestName.toLowerCase().includes(q);
        const matchesEmail = inq.guestEmail.toLowerCase().includes(q);
        const matchesTitle = inq.eventTitle.toLowerCase().includes(q);
        const matchesQuestion = inq.question.toLowerCase().includes(q);
        return matchesName || matchesEmail || matchesTitle || matchesQuestion;
      }
      return true;
    });
  }, [inquiries, messagesFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans antialiased selection:bg-[#0A6CF0] selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] px-4 py-2.5 rounded-2xl bg-slate-900 text-white border border-blue-400/30 shadow-2xl backdrop-blur-md text-xs font-bold animate-in fade-in slide-in-from-top-4 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#00E0FF]" />
          <span>{toastMessage}</span>
        </div>
      )}



      {/* =========================================================================
          HERO BANNER & GREETING
          ========================================================================= */}
      <section className="pt-10 pb-8 px-4 sm:px-8 border-b border-slate-200/80 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1565C0] text-xs font-mono font-bold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                YOUR HOST SPACE
              </div>
              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight font-heading"
                style={{ fontFamily: "'Trapvoid', 'Bricolage Grotesque', 'Outfit', sans-serif" }}
              >
                Your events, your guests, all together.
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
                Manage your hosted gatherings, monitor live guest registrations, broadcast real-time updates, and scan passes at the door.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setActiveTab("messages");
                  document.getElementById("dashboard-tabs-section")?.scrollIntoView({ behavior: "smooth" });
                }}
                type="button"
                className={`px-4 py-2.5 rounded-xl border text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer shadow-2xs ${
                  activeTab === "messages"
                    ? "bg-blue-50 border-[#0A6CF0] text-[#0A6CF0] font-bold"
                    : "bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700 hover:text-slate-900"
                }`}
              >
                <MessageSquare className="w-4 h-4 text-[#0A6CF0]" />
                <span>Guest Messages ({metrics.unreadInquiries})</span>
              </button>

              <Link
                to="/create"
                className="px-5 py-2.5 rounded-xl bg-[#0A6CF0] hover:bg-[#085AC7] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>New Gathering</span>
              </Link>
            </div>
          </div>

          {/* =========================================================================
              KEY STATS CARDS (4 METRICS)
              ========================================================================= */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mt-8">
            {/* Card 1: Upcoming Events */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm relative overflow-hidden group hover:border-[#0A6CF0]/50 transition-all">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-2">
                <span>Upcoming Events</span>
                <Calendar className="w-4 h-4 text-[#0A6CF0]" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
                {metrics.upcomingCount} Active
              </div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>Live in your city</span>
              </div>
            </div>

            {/* Card 2: People Joining */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm relative overflow-hidden group hover:border-[#0A6CF0]/50 transition-all">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-2">
                <span>People Joining</span>
                <Users className="w-4 h-4 text-[#0A6CF0]" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
                {metrics.totalJoined} Guests
              </div>
              <div className="text-[11px] text-slate-500 font-medium mt-1">
                Confirmed RSVPs & ticket holders
              </div>
            </div>

            {/* Card 3: Ticket Sales / Pool */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm relative overflow-hidden group hover:border-[#0A6CF0]/50 transition-all">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-2">
                <span>Gross Revenue</span>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
                {metrics.revenueFormatted}
              </div>
              <div className="text-[11px] text-slate-500 font-medium mt-1">
                0% Host fee · Instant UPI payouts
              </div>
            </div>

            {/* Card 4: Guest Inquiries */}
            <div
              className={`p-5 rounded-2xl bg-white border shadow-sm relative overflow-hidden group hover:border-[#0A6CF0]/50 transition-all cursor-pointer ${
                activeTab === "messages" ? "border-[#0A6CF0] ring-2 ring-[#0A6CF0]/20" : "border-slate-200/90"
              }`}
              onClick={() => {
                setActiveTab("messages");
                document.getElementById("dashboard-tabs-section")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-2">
                <span>Guest Messages</span>
                <MessageSquare className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 font-heading flex items-center gap-2">
                <span>{inquiries.length} Threads</span>
                {metrics.unreadInquiries > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                    {metrics.unreadInquiries} new
                  </span>
                )}
              </div>
              <div className="text-[11px] text-amber-700 font-medium mt-1 flex items-center gap-1">
                <span>Click to open inbox</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          EVENTS MANAGEMENT & TABS + ON-PAGE MESSAGES
          ========================================================================= */}
      <section id="dashboard-tabs-section" className="py-8 sm:py-12 px-4 sm:px-8 max-w-7xl mx-auto scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          {/* Tabs */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white border border-slate-200 shadow-2xs w-fit overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab("upcoming")}
              type="button"
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === "upcoming"
                  ? "bg-[#0A6CF0] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              Upcoming ({events.filter((e) => e.status === "published").length})
            </button>
            <button
              onClick={() => setActiveTab("past")}
              type="button"
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === "past"
                  ? "bg-[#0A6CF0] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              Past ({events.filter((e) => e.status === "past").length})
            </button>
            <button
              onClick={() => setActiveTab("drafts")}
              type="button"
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === "drafts"
                  ? "bg-[#0A6CF0] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              Drafts ({events.filter((e) => e.status === "draft").length})
            </button>
            <button
              onClick={() => setActiveTab("messages")}
              type="button"
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === "messages"
                  ? "bg-[#0A6CF0] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Guest Messages ({inquiries.length})</span>
              {metrics.unreadInquiries > 0 && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    activeTab === "messages"
                      ? "bg-white text-[#0A6CF0]"
                      : "bg-amber-500 text-white"
                  }`}
                >
                  {metrics.unreadInquiries} new
                </span>
              )}
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === "messages"
                  ? "Search guest questions or attendees..."
                  : "Search your events by name or city..."
              }
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[#0A6CF0] shadow-2xs transition-colors"
            />
          </div>
        </div>

        {/* =========================================================================
            VIEW A: ON-PAGE GUEST MESSAGES SECTION (ADJUSTED DIRECTLY ONTO THE DASHBOARD PAGE)
            ========================================================================= */}
        {activeTab === "messages" ? (
          <div className="rounded-3xl bg-white border border-slate-200/90 shadow-sm p-5 sm:p-7 animate-in fade-in duration-200">
            {/* Top Bar of Messages Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 mb-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0A6CF0] border border-blue-200 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                  <MessageSquare className="w-3 h-3 text-[#0A6CF0]" />
                  Direct Guest Inquiries
                </div>
                <h3 className="text-xl font-bold text-slate-900 font-heading">Attendee Messages & Inquiries</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Answer attendee questions, provide parking/timing details, and send confirmations directly.
                </p>
              </div>

              {/* Message Filter Pills */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => setMessagesFilter("all")}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                    messagesFilter === "all"
                      ? "bg-white text-slate-900 shadow-xs font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  All ({inquiries.length})
                </button>
                <button
                  type="button"
                  onClick={() => setMessagesFilter("unread")}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                    messagesFilter === "unread"
                      ? "bg-white text-[#0A6CF0] shadow-xs font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Unread ({metrics.unreadInquiries})
                </button>
                <button
                  type="button"
                  onClick={() => setMessagesFilter("replied")}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                    messagesFilter === "replied"
                      ? "bg-white text-emerald-600 shadow-xs font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Replied ({inquiries.filter((i) => i.reply).length})
                </button>
              </div>
            </div>

            {/* Split Inbox View: Left Column (Threads) + Right Column (Chat/Reply Pane) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[520px]">
              {/* Left Column: Threads List (5 cols) */}
              <div className="lg:col-span-5 flex flex-col space-y-2.5 overflow-y-auto max-h-[580px] pr-1.5 custom-scrollbar">
                {filteredInquiries.length === 0 ? (
                  <div className="text-center py-16 px-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-700">No messages found</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {messagesFilter === "unread"
                        ? "You are all caught up! No unread messages."
                        : "No inquiries matching your search filter."}
                    </p>
                  </div>
                ) : (
                  filteredInquiries.map((inq) => {
                    const isSelected = selectedInquiry?.id === inq.id;
                    return (
                      <div
                        key={inq.id}
                        onClick={() => {
                          setSelectedInquiry(inq);
                          // Auto mark as read on view
                          if (!inq.isRead) {
                            setInquiries((prev) =>
                              prev.map((i) => (i.id === inq.id ? { ...i, isRead: true } : i))
                            );
                          }
                        }}
                        className={`p-4 rounded-2xl border text-xs transition-all cursor-pointer select-none ${
                          isSelected
                            ? "bg-blue-50/80 border-[#0A6CF0] ring-2 ring-[#0A6CF0]/20 shadow-xs"
                            : inq.isRead
                            ? "bg-white border-slate-200/90 hover:bg-slate-50 hover:border-slate-300 text-slate-700"
                            : "bg-white border-blue-300/80 shadow-xs hover:border-[#0A6CF0] text-slate-900"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2 min-w-0">
                            {/* Avatar Badge */}
                            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#0B1F4B] to-[#0A6CF0] text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                              {inq.guestName.charAt(0)}
                            </div>
                            <span className="font-bold text-slate-900 truncate">{inq.guestName}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 shrink-0">{inq.timeAgo}</span>
                        </div>

                        <div className="text-[11px] font-semibold text-[#0A6CF0] truncate mb-1">
                          {inq.eventTitle}
                        </div>

                        <p className="text-slate-600 line-clamp-2 leading-relaxed text-[11.5px]">
                          {inq.question}
                        </p>

                        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                          <span className="text-slate-400 font-mono truncate">{inq.guestEmail}</span>
                          {inq.reply ? (
                            <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" />
                              Replied
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                              Needs Reply
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Right Column: Conversation Workspace (7 cols) */}
              <div className="lg:col-span-7 rounded-2xl bg-slate-50/70 border border-slate-200/90 p-5 flex flex-col justify-between overflow-hidden">
                {selectedInquiry ? (
                  <div className="flex flex-col h-full justify-between space-y-4">
                    <div className="space-y-4 overflow-y-auto max-h-[380px] pr-1 custom-scrollbar">
                      {/* Thread Header */}
                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-900">{selectedInquiry.guestName}</h4>
                            <span className="text-xs text-slate-400 font-mono">({selectedInquiry.guestEmail})</span>
                          </div>
                          <div className="text-xs text-[#0A6CF0] font-semibold mt-0.5 flex items-center gap-1">
                            <span>Event:</span>
                            <span className="underline">{selectedInquiry.eventTitle}</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setInquiries((prev) =>
                              prev.map((i) =>
                                i.id === selectedInquiry.id ? { ...i, isRead: !i.isRead } : i
                              )
                            );
                            setSelectedInquiry((prev) => (prev ? { ...prev, isRead: !prev.isRead } : null));
                            showToast(selectedInquiry.isRead ? "Marked as unread" : "Marked as read");
                          }}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[11px] font-semibold text-slate-600 transition-colors w-fit"
                        >
                          {selectedInquiry.isRead ? "Mark Unread" : "Mark Read"}
                        </button>
                      </div>

                      {/* Guest Question Box */}
                      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5 font-medium">
                          <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Guest Inquiry</span>
                          <span>{selectedInquiry.timeAgo}</span>
                        </div>
                        <p className="text-xs text-slate-800 leading-relaxed font-medium">
                          {selectedInquiry.question}
                        </p>
                      </div>

                      {/* Existing Reply (if available) */}
                      {selectedInquiry.reply && (
                        <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200/80">
                          <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-[11px] mb-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Your Sent Response:</span>
                          </div>
                          <p className="text-xs text-emerald-950 leading-relaxed">
                            {selectedInquiry.reply}
                          </p>
                        </div>
                      )}

                      {/* Quick Reply Presets */}
                      <div>
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                          ⚡ Quick Reply Presets:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            "Yes, parking is available at the venue! 🚗",
                            "Doors open 30 minutes before the scheduled time. ⏰",
                            "All equipment & gear will be provided on-site! 🏏",
                            "Feel free to bring your own instrument! 🎸",
                            "Looking forward to hosting you! See you there. ✨",
                          ].map((preset) => (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => setReplyText(preset)}
                              className="px-2.5 py-1 rounded-lg bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-[11px] text-slate-700 hover:text-[#0A6CF0] transition-colors cursor-pointer text-left"
                            >
                              {preset}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Reply Input Form */}
                    <form onSubmit={handleSendReply} className="pt-3 border-t border-slate-200/90 space-y-2 mt-auto">
                      <textarea
                        rows={3}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder={`Type message or reply to ${selectedInquiry.guestName}...`}
                        required
                        className="w-full p-3 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#0A6CF0] shadow-2xs"
                      />
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[11px] text-slate-400">
                          Sends instant notification via Email & SMS to guest.
                        </span>
                        <button
                          type="submit"
                          className="px-5 py-2.5 rounded-xl bg-[#0A6CF0] hover:bg-[#085AC7] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Send Response</span>
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8 text-slate-400 my-auto">
                    <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center mb-3">
                      <MessageSquare className="w-7 h-7 text-[#0A6CF0]/60" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-700">No conversation selected</h4>
                    <p className="text-xs text-slate-400 max-w-xs mt-1">
                      Choose an attendee thread from the left to read their inquiry and reply.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}

        {/* =========================================================================
            VIEW B: EVENTS GRID / LIST (FOR UPCOMING / PAST / DRAFTS TABS)
            ========================================================================= */}
        {activeTab !== "messages" && (filteredEvents.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl bg-white border border-slate-200 shadow-sm">
            <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900 mb-1">No {activeTab} events found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5">
              {activeTab === "upcoming"
                ? "You don't have any active gatherings scheduled right now. Host a match, jam, or meetup in 2 minutes."
                : `There are currently no events matching the "${activeTab}" filter.`}
            </p>
            <Link
              to="/create"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0A6CF0] text-white text-xs font-bold hover:bg-[#085AC7] transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Create an Event</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEvents.map((evt) => {
              const spotsPercentage = Math.min(100, Math.round(((evt.joined || 0) / (evt.capacity || 1)) * 100));
              const spotsLeft = Math.max(0, (evt.capacity || 0) - (evt.joined || 0));

              return (
                <div
                  key={evt.id}
                  className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-300 shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  {/* Left: Thumbnail & Core Details */}
                  <div className="flex items-start sm:items-center gap-4 sm:gap-5 min-w-0 flex-1">
                    <img
                      src={evt.coverUrl}
                      alt={evt.title}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shrink-0 border border-slate-200 shadow-xs"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#0A6CF0]">
                          {evt.category}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            evt.status === "published"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : evt.status === "draft"
                              ? "bg-amber-50 text-amber-800 border border-amber-200"
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}
                        >
                          {evt.status === "published" ? "Live & Published" : evt.status}
                        </span>
                      </div>

                      <h3
                        className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight truncate font-heading"
                        style={{ fontFamily: "'Trapvoid', 'Bricolage Grotesque', 'Outfit', sans-serif" }}
                      >
                        {evt.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{evt.date} · {evt.time}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{evt.venue}, {evt.city}</span>
                        </span>
                        <span className="font-semibold text-slate-800">
                          {evt.pricingType === "free" ? "Free RSVP" : evt.price}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Capacity Progress */}
                  <div className="w-full lg:w-48 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-600 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>{evt.joined}/{evt.capacity} joined</span>
                      </span>
                      <span className="text-[#0A6CF0] font-bold">
                        {spotsLeft > 0 ? `${spotsLeft} left` : "Full"}
                      </span>
                    </div>

                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                      <div
                        className="h-full bg-gradient-to-r from-[#0B1F4B] to-[#0A6CF0] rounded-full transition-all duration-300"
                        style={{ width: `${spotsPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Right: Host Actions */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {/* Share to WhatsApp */}
                    <button
                      onClick={() => handleShareWhatsApp(evt)}
                      type="button"
                      className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                      title="Share direct invite on WhatsApp"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </button>

                    {/* Scan passes / QR */}
                    <button
                      onClick={() => setScanModalEvent(evt)}
                      type="button"
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Scan ticket QR and check-in guests"
                    >
                      <QrCode className="w-3.5 h-3.5 text-[#0A6CF0]" />
                      <span>Scan ({evt.joined})</span>
                    </button>

                    {/* Live Dispatch */}
                    <button
                      onClick={() => {
                        setDispatchModalEvent(evt);
                        setDispatchBody("");
                      }}
                      type="button"
                      className="px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#0A6CF0] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Broadcast instant update to attendees"
                    >
                      <Radio className="w-3.5 h-3.5 text-[#0A6CF0]" />
                      <span>Dispatch</span>
                    </button>

                    {/* Delete Event */}
                    <button
                      onClick={() => handleDeleteEvent(evt.id, evt.title)}
                      type="button"
                      className="p-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 border border-slate-300 hover:border-red-200 transition-colors cursor-pointer"
                      title="Delete event"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </section>

      {/* =========================================================================
          MODAL 1: LIVE DISPATCH (BROADCAST ANNOUNCEMENT)
          ========================================================================= */}
      {dispatchModalEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-2xl text-slate-800">
            <button
              onClick={() => setDispatchModalEvent(null)}
              type="button"
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {dispatchSuccess ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 border border-emerald-300 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Announcement Dispatched!</h3>
                <p className="text-xs text-slate-500">
                  Notification pushed to all confirmed attendees of "{dispatchModalEvent.title}".
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendDispatch} className="space-y-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1565C0] border border-blue-200 text-[10px] font-bold uppercase tracking-wider mb-2">
                    <Radio className="w-3 h-3 text-[#0A6CF0]" />
                    LIVE DISPATCH
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Broadcast to Attendees</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Send an instant priority alert to everyone confirmed for{" "}
                    <span className="text-slate-800 font-semibold">"{dispatchModalEvent.title}"</span>.
                  </p>
                </div>

                {/* Quick Presets */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Quick Preset Topics:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "🚗 Parking Advisory", body: "Parking is available in Basement Level 2. Show your Vibe pass for free validation." },
                      { label: "⏱ Doors & Check-in", body: "Gates open 20 minutes before start time. Have your QR pass ready at the entry." },
                      { label: "☔ Weather Covered", body: "The venue has full waterproof canopy coverage. Event is 100% on schedule!" },
                      { label: "✨ Final Briefing", body: "Can't wait to see you today! Bring your gear and sports shoes. See you on the turf!" },
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => {
                          setDispatchPreset(preset.label);
                          setDispatchBody(preset.body);
                        }}
                        className={`text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                          dispatchPreset === preset.label
                            ? "bg-blue-50 border-[#0A6CF0] text-[#0A6CF0] font-bold"
                            : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <div className="font-semibold">{preset.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message Body */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Message Body:
                  </label>
                  <textarea
                    rows={4}
                    value={dispatchBody}
                    onChange={(e) => setDispatchBody(e.target.value)}
                    required
                    placeholder="Type your message to attendees..."
                    className="w-full p-3 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#0A6CF0]"
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Delivers via in-app alert & WhatsApp</span>
                  <span className="text-emerald-600 font-semibold">
                    {dispatchModalEvent.joined} Recipients
                  </span>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setDispatchModalEvent(null)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#0B1F4B] to-[#0A6CF0] text-xs font-bold text-white hover:brightness-110 shadow-md flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Announcement</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: SCAN PASSES & ATTENDEE ROSTER
          ========================================================================= */}
      {scanModalEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-2xl text-slate-800">
            <button
              onClick={() => setScanModalEvent(null)}
              type="button"
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0A6CF0] border border-blue-200 text-[10px] font-bold uppercase tracking-wider mb-2">
                <QrCode className="w-3 h-3" />
                PASS SCANNER & ROSTER
              </div>
              <h3 className="text-xl font-bold text-slate-900">{scanModalEvent.title}</h3>
              <p className="text-xs text-slate-500">
                Check off attendees by name or scan their unique VIBE ticket code at the entrance.
              </p>
            </div>

            {/* Ticket Search */}
            <div className="relative mb-4">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={ticketSearchQuery}
                onChange={(e) => setTicketSearchQuery(e.target.value)}
                placeholder="Search ticket code (e.g. VIBE-849102) or guest name..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#0A6CF0]"
              />
            </div>

            {/* Attendee Roster List */}
            <div className="max-h-72 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {((attendeeTickets[scanModalEvent.id] || []).filter((t) => {
                if (!ticketSearchQuery.trim()) return true;
                const q = ticketSearchQuery.toLowerCase();
                return t.name.toLowerCase().includes(q) || t.ticketId.toLowerCase().includes(q);
              })).length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No matching attendee passes found.
                </div>
              ) : (
                (attendeeTickets[scanModalEvent.id] || []).map((ticket) => (
                  <div
                    key={ticket.ticketId}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{ticket.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                          {ticket.ticketId}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {ticket.phone} · {ticket.spots} spot(s)
                        {ticket.checkInTime && ` · Checked in at ${ticket.checkInTime}`}
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleCheckIn(scanModalEvent.id, ticket.ticketId)}
                      type="button"
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        ticket.checkedIn
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-[#0A6CF0] text-white hover:bg-[#085AC7]"
                      }`}
                    >
                      {ticket.checkedIn ? "✓ Checked In" : "Check In"}
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>Total RSVPs: {scanModalEvent.joined}</span>
              <button
                type="button"
                onClick={() => setScanModalEvent(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
export default HostDashboard;
