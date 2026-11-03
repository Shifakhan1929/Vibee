import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  Flame,
  MessageSquare,
  Share2,
  Info,
  ChevronDown,
  ChevronUp,
  MapPin,
  X,
  Send,
  Plus,
  CheckCircle2,
  Calendar,
  Clock,
  Sparkles,
  Zap,
  Users,
  QrCode,
  ArrowLeft,
  Volume2,
  VolumeX,
  Download,
} from "lucide-react";
import { triggerPwaInstall } from "./AppInstallModal";

export interface VibeEvent {
  id: string;
  slug: string;
  title: string;
  category: "TECHNOLOGY" | "MUSIC" | "SPORTS" | "SOCIAL";
  badge: string;
  host_name: string;
  host_initials: string;
  host_rating: string;
  host_vibes_count: number;
  formatted_date: string;
  formatted_time: string;
  formatted_date_time_venue: string;
  location_name: string;
  city: string;
  description: string;
  going_count: number;
  capacity?: number | undefined;
  spots_left?: number | undefined;
  has_spots_limit: boolean;
  likes_count: number;
  comments_count: number;
  cover_image_url: string;
}

export interface VibeComment {
  id: string;
  author: string;
  initials: string;
  timeAgo: string;
  text: string;
}

export interface UserRsvp {
  vibeId: string;
  name: string;
  phone: string;
  spots: number;
  timestamp: number;
  ticketId: string;
}

const INITIAL_VIBES: VibeEvent[] = [
  {
    id: "vibe-coffee-1",
    slug: "good-coffee-great-connections",
    title: "Good coffee. Great connections.",
    category: "TECHNOLOGY",
    badge: "Community pick",
    host_name: "Swaniki Social",
    host_initials: "SS",
    host_rating: "4.9",
    host_vibes_count: 12,
    formatted_date: "SAT, 17 OCT",
    formatted_time: "11:00 AM",
    formatted_date_time_venue: "SAT, 17 OCT · 11:00 AM · The Studio, Mumbai",
    location_name: "The Studio, Bandra West",
    city: "Mumbai",
    description:
      "A small, easy-going gathering. Come solo or bring a friend — the host will share final details in chat. Grab specialty coffee and swap notes on building products.",
    going_count: 4,
    has_spots_limit: false,
    likes_count: 9,
    comments_count: 4,
    cover_image_url:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80",
  },
  {
    id: "vibe-sameera-2",
    slug: "sameera-bharadwaj-live",
    title: "Sameera Bharadwaj, live",
    category: "MUSIC",
    badge: "Selling fast",
    host_name: "Swaniki Social",
    host_initials: "SS",
    host_rating: "4.9",
    host_vibes_count: 12,
    formatted_date: "THU, 15 OCT",
    formatted_time: "7:00 PM",
    formatted_date_time_venue: "THU, 15 OCT · 7:00 PM · Live Venue, Mumbai",
    location_name: "Live Venue, Mumbai",
    city: "Mumbai",
    description:
      "An intimate live rooftop session under the Mumbai sunset sky. Unfiltered acoustic melodies, soul vocals, and good conversations with fellow music lovers.",
    going_count: 18,
    has_spots_limit: false,
    likes_count: 24,
    comments_count: 6,
    cover_image_url:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80",
  },
  {
    id: "vibe-cricket-3",
    slug: "box-cricket-bandra-turf",
    title: "Box Cricket Match at Bandra Turf",
    category: "SPORTS",
    badge: "Community pick",
    host_name: "Bandra Strikers",
    host_initials: "BS",
    host_rating: "4.8",
    host_vibes_count: 9,
    formatted_date: "SUN, 18 OCT",
    formatted_time: "7:00 PM",
    formatted_date_time_venue: "SUN, 18 OCT · 7:00 PM · Bandra Turf, Mumbai",
    location_name: "Bandra Turf, Mumbai",
    city: "Mumbai",
    description:
      "Friendly underarm turf match under lights. All gear provided, fresh chai after the final over. Just bring your sports shoes and energy!",
    going_count: 8,
    capacity: 14,
    spots_left: 6,
    has_spots_limit: true,
    likes_count: 18,
    comments_count: 3,
    cover_image_url:
      "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&auto=format&fit=crop&q=80",
  },
  {
    id: "vibe-founders-4",
    slug: "ai-founders-indie-hackers",
    title: "AI Founders & Indie Hackers Meetup",
    category: "TECHNOLOGY",
    badge: "Filling fast",
    host_name: "Vibe Tech Guild",
    host_initials: "VT",
    host_rating: "5.0",
    host_vibes_count: 16,
    formatted_date: "SAT, 24 OCT",
    formatted_time: "5:00 PM",
    formatted_date_time_venue: "SAT, 24 OCT · 5:00 PM · Subko Specialty Coffee, Bandra",
    location_name: "Subko Specialty Coffee, Bandra",
    city: "Mumbai",
    description:
      "Casual lightning demos, shipping war stories, and pour-over coffee with fellow indie builders in Bombay. Show what you shipped this week.",
    going_count: 6,
    capacity: 10,
    spots_left: 4,
    has_spots_limit: true,
    likes_count: 31,
    comments_count: 5,
    cover_image_url:
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&auto=format&fit=crop&q=80",
  },
  {
    id: "vibe-jam-5",
    slug: "acoustic-sunset-jam-upper-lake",
    title: "Acoustic Sunset Jam by the Lake",
    category: "MUSIC",
    badge: "Community pick",
    host_name: "Indie Wave Guild",
    host_initials: "IW",
    host_rating: "4.9",
    host_vibes_count: 8,
    formatted_date: "SUN, 25 OCT",
    formatted_time: "6:30 PM",
    formatted_date_time_venue: "SUN, 25 OCT · 6:30 PM · Upper Lake Promenade",
    location_name: "Upper Lake Promenade, Indore",
    city: "Indore",
    description:
      "Bring your guitar, ukulele, cajon or just your voice. We sit around sunset, jam classic indie melodies, and enjoy fresh hot chai.",
    going_count: 15,
    capacity: 20,
    spots_left: 5,
    has_spots_limit: true,
    likes_count: 42,
    comments_count: 8,
    cover_image_url:
      "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=1200&auto=format&fit=crop&q=80",
  },
  {
    id: "vibe-boardgames-6",
    slug: "weekend-boardgames-chai-mixer",
    title: "Weekend Board Game & Chai Mixer",
    category: "SOCIAL",
    badge: "Filling fast",
    host_name: "The Dice Club",
    host_initials: "DC",
    host_rating: "4.8",
    host_vibes_count: 14,
    formatted_date: "FRI, 23 OCT",
    formatted_time: "7:30 PM",
    formatted_date_time_venue: "FRI, 23 OCT · 7:30 PM · Chai Point, Koregaon Park",
    location_name: "Chai Point, Koregaon Park, Pune",
    city: "Pune",
    description:
      "Catan, Codenames, Exploding Kittens, and Secret Hitler. Beginners super welcome! Split ground table fee and sip adrak chai.",
    going_count: 10,
    capacity: 16,
    spots_left: 6,
    has_spots_limit: true,
    likes_count: 27,
    comments_count: 3,
    cover_image_url:
      "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=1200&auto=format&fit=crop&q=80",
  },
];

const CATEGORIES = [
  { id: "all", label: "All vibes" },
  { id: "tech", label: "Technology", category: "TECHNOLOGY" },
  { id: "music", label: "Live Music", category: "MUSIC" },
  { id: "sports", label: "Sports & Turf", category: "SPORTS" },
  { id: "social", label: "Social & Cafes", category: "SOCIAL" },
];

const CITIES = ["All Cities", "Mumbai", "Pune", "Indore", "Bengaluru", "Delhi"];

const INITIAL_COMMENTS: Record<string, VibeComment[]> = {
  "vibe-coffee-1": [
    {
      id: "c-1",
      author: "Aditya Verma",
      initials: "AV",
      timeAgo: "2h ago",
      text: "Can I bring my prototype laptop to demo?",
    },
    {
      id: "c-2",
      author: "Swaniki Social (Host)",
      initials: "SS",
      timeAgo: "1h ago",
      text: "Yes absolutely! We have power sockets and high-speed Wi-Fi.",
    },
    {
      id: "c-3",
      author: "Pooja Roy",
      initials: "PR",
      timeAgo: "35m ago",
      text: "Super excited! Bringing 1 developer friend too.",
    },
  ],
  "vibe-cricket-3": [
    {
      id: "c-4",
      author: "Rohan Patil",
      initials: "RP",
      timeAgo: "3h ago",
      text: "Is it rubber ball or tennis ball?",
    },
    {
      id: "c-5",
      author: "Bandra Strikers (Host)",
      initials: "BS",
      timeAgo: "2h ago",
      text: "Heavy tennis ball! Bats & balls provided by the turf.",
    },
  ],
};

export function VibeReelsFeed() {
  const [vibes, setVibes] = useState<VibeEvent[]>(INITIAL_VIBES);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState<string>("All Cities");
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [likesState, setLikesState] = useState<Record<string, { isLiked: boolean; count: number }>>({});
  const [doubleTapHeart, setDoubleTapHeart] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [passModalOpen, setPassModalOpen] = useState(false);
  const [hostModalOpen, setHostModalOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [createVibeOpen, setCreateVibeOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  // RSVP storage
  const [rsvps, setRsvps] = useState<Record<string, UserRsvp>>({});

  // Comments state
  const [commentsMap, setCommentsMap] = useState<Record<string, VibeComment[]>>(INITIAL_COMMENTS);
  const [newCommentText, setNewCommentText] = useState("");

  // Join form state
  const [joinName, setJoinName] = useState("");
  const [joinPhone, setJoinPhone] = useState("");
  const [joinSpots, setJoinSpots] = useState(1);

  // Create vibe form state
  const [createTitle, setCreateTitle] = useState("");
  const [createCategory, setCreateCategory] = useState<"TECHNOLOGY" | "MUSIC" | "SPORTS" | "SOCIAL">("SPORTS");
  const [createCity, setCreateCity] = useState("Mumbai");
  const [createVenue, setCreateVenue] = useState("");
  const [createDate, setCreateDate] = useState("SAT, 24 OCT");
  const [createTime, setCreateTime] = useState("7:00 PM");
  const [createCapacity, setCreateCapacity] = useState("12");

  // Load RSVPs from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("vibe_instant_rsvps");
      if (stored) {
        setRsvps(JSON.parse(stored));
      }
    } catch (_) {}
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Filter vibes
  const filteredVibes = useMemo(() => {
    return vibes.filter((v) => {
      const matchCat =
        selectedCategory === "all" ||
        CATEGORIES.find((c) => c.id === selectedCategory)?.category === v.category;
      const matchCity = selectedCity === "All Cities" || v.city === selectedCity;
      return matchCat && matchCity;
    });
  }, [vibes, selectedCategory, selectedCity]);

  // Keep index within bounds
  useEffect(() => {
    if (currentIndex >= filteredVibes.length) {
      setCurrentIndex(Math.max(0, filteredVibes.length - 1));
    }
  }, [filteredVibes, currentIndex]);

  const currentVibe: VibeEvent = (filteredVibes[currentIndex] ??
    filteredVibes[0] ??
    vibes[0] ??
    INITIAL_VIBES[0]) as VibeEvent;

  // Navigate vibes
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : filteredVibes.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < filteredVibes.length - 1 ? prev + 1 : 0));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (joinModalOpen || passModalOpen || hostModalOpen || infoModalOpen || commentsOpen || createVibeOpen) {
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [filteredVibes.length, joinModalOpen, passModalOpen, hostModalOpen, infoModalOpen, commentsOpen, createVibeOpen]);

  // Touch Swipe for mobile
  const touchStartY = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0]?.clientY ?? null;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const changed = e.changedTouches[0];
    if (!changed) return;
    const diff = touchStartY.current - changed.clientY;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartY.current = null;
  };

  // Like interaction
  const getLikeData = (vibe: VibeEvent) => {
    const state = likesState[vibe.id];
    if (state) return state;
    return { isLiked: false, count: vibe.likes_count };
  };

  const handleToggleLike = () => {
    setLikesState((prev) => {
      const current = prev[currentVibe.id] || { isLiked: false, count: currentVibe.likes_count };
      const nextIsLiked = !current.isLiked;
      const nextCount = nextIsLiked ? current.count + 1 : current.count - 1;
      return {
        ...prev,
        [currentVibe.id]: { isLiked: nextIsLiked, count: nextCount },
      };
    });
  };

  const handleDoubleClick = () => {
    setDoubleTapHeart(true);
    setTimeout(() => setDoubleTapHeart(false), 800);
    const likeData = getLikeData(currentVibe);
    if (!likeData.isLiked) {
      handleToggleLike();
    }
  };

  // Share interaction
  const handleShare = async () => {
    const url = window.location.href;
    const title = `${currentVibe.title} on Vibe Instant`;
    const text = `Join "${currentVibe.title}" · ${currentVibe.formatted_date_time_venue}`;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        showToast("Shared successfully!");
        return;
      } catch (_) {}
    }

    try {
      await navigator.clipboard.writeText(`${title}\n${text}\n${url}`);
      showToast("Link copied to clipboard!");
    } catch (_) {
      showToast("Link ready: " + url);
    }
  };

  // RSVP submission
  const handleConfirmRsvp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinName.trim()) {
      alert("Please enter your name");
      return;
    }

    const ticketId = `VIBE-${Math.floor(100000 + Math.random() * 900000)}`;
    const newRsvp: UserRsvp = {
      vibeId: currentVibe.id,
      name: joinName.trim(),
      phone: joinPhone.trim(),
      spots: joinSpots,
      timestamp: Date.now(),
      ticketId,
    };

    const updated = { ...rsvps, [currentVibe.id]: newRsvp };
    setRsvps(updated);
    try {
      localStorage.setItem("vibe_instant_rsvps", JSON.stringify(updated));
    } catch (_) {}

    // Update attendee count
    setVibes((prev) =>
      prev.map((v) =>
        v.id === currentVibe.id
          ? {
              ...v,
              going_count: v.going_count + joinSpots,
              spots_left:
                v.spots_left !== undefined ? Math.max(0, v.spots_left - joinSpots) : undefined,
            }
          : v
      )
    );

    setJoinModalOpen(false);
    showToast("🎉 You're in! Pass generated.");
    setPassModalOpen(true);
  };

  // Add Comment
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !currentVibe) return;
    const newComment: VibeComment = {
      id: `comm-${Date.now()}`,
      author: "You",
      initials: "YU",
      timeAgo: "Just now",
      text: newCommentText.trim(),
    };
    const currentList = commentsMap[currentVibe.id] || [];
    setCommentsMap({
      ...commentsMap,
      [currentVibe.id]: [newComment, ...currentList],
    });
    setNewCommentText("");
    setVibes((prev) =>
      prev.map((v) => (v.id === currentVibe.id ? { ...v, comments_count: v.comments_count + 1 } : v))
    );
  };

  // Create Vibe
  const handleCreateVibe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createTitle.trim()) {
      alert("Please provide an event title");
      return;
    }

    const capNum = parseInt(createCapacity, 10) || 12;
    const newId = `vibe-custom-${Date.now()}`;
    const newVibe: VibeEvent = {
      id: newId,
      slug: createTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      title: createTitle.trim(),
      category: createCategory,
      badge: "Community pick",
      host_name: "You",
      host_initials: "YOU",
      host_rating: "5.0",
      host_vibes_count: 1,
      formatted_date: createDate,
      formatted_time: createTime,
      formatted_date_time_venue: `${createDate} · ${createTime} · ${createVenue || "TBD"}, ${createCity}`,
      location_name: createVenue || "Venue TBA",
      city: createCity,
      description: `A brand new gathering hosted by You. Join in, meet people, and enjoy the vibe!`,
      going_count: 1,
      capacity: capNum,
      spots_left: capNum - 1,
      has_spots_limit: true,
      likes_count: 1,
      comments_count: 0,
      cover_image_url:
        createCategory === "SPORTS"
          ? "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&auto=format&fit=crop&q=80"
          : createCategory === "MUSIC"
          ? "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80"
          : "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80",
    };

    setVibes([newVibe, ...vibes]);
    setSelectedCategory("all");
    setSelectedCity("All Cities");
    setCurrentIndex(0);
    setCreateVibeOpen(false);
    showToast("⚡ Vibe live on stream!");
  };

  const userRsvp = currentVibe ? rsvps[currentVibe.id] : null;
  const currentLike = currentVibe ? getLikeData(currentVibe) : { isLiked: false, count: 0 };
  const currentComments = currentVibe ? commentsMap[currentVibe.id] || [] : [];

  return (
    <div
      className="vibe-instant-container relative w-full h-[calc(100dvh-60px)] bg-[#f6faff] text-slate-800 overflow-hidden select-none flex flex-col justify-between"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Soft Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-40 z-0">
        <div className="absolute left-1/4 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0a6cf0]/15 rounded-full blur-[140px]" />
      </div>

      {/* Floating Toast */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-black/90 backdrop-blur-md border border-white/20 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <Sparkles className="w-4 h-4 text-[#0a6cf0]" />
          <span>{toastMessage}</span>
        </div>
      )}



      {/* =========================================================================
          MAIN REELS VIEWPORT (DESKTOP & MOBILE RESPONSIVE)
          ========================================================================= */}
      <main className="flex-1 flex items-center justify-center w-full px-2 sm:px-4 pb-2 sm:pb-4 relative z-10 overflow-hidden">
        {filteredVibes.length === 0 ? (
          <div className="text-center p-8 bg-white border border-[#dbe6f7] shadow-sm rounded-3xl max-w-sm mx-auto">
            <Flame className="w-12 h-12 text-[#0a6cf0] mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900 mb-1">No vibes found</h3>
            <p className="text-xs text-slate-500 mb-4">
              No live meetups match your current category and city filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSelectedCity("All Cities");
              }}
              type="button"
              className="px-4 py-2 rounded-xl bg-[#0a6cf0] text-white text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-4 lg:gap-7 max-w-7xl w-full h-full max-h-[820px]">
            {/* LEFT SIDE: Category Dropdown & Host a Vibe Button */}
            <div className="hidden lg:flex w-[210px] rounded-[24px] bg-white/95 backdrop-blur-xl border border-[#dbe6f7] p-4 shadow-md flex-col gap-3 shrink-0 text-slate-800 self-start">
              {/* Category Dropdown Menu */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                  <Flame className="w-4 h-4 text-[#0066f5]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800">Category</span>
                </div>

                <div className="relative pt-1">
                  <button
                    type="button"
                    onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 shadow-xs transition-all cursor-pointer"
                  >
                    <span className="truncate">
                      {CATEGORIES.find((c) => c.id === selectedCategory)?.label || "All vibes"}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${
                        categoryDropdownOpen ? "rotate-180 text-[#0066f5]" : ""
                      }`}
                    />
                  </button>

                  {categoryDropdownOpen && (
                    <div className="absolute left-0 top-full mt-1.5 w-full rounded-2xl bg-white border border-[#dbe6f7] shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setSelectedCategory(cat.id);
                            setCategoryDropdownOpen(false);
                            setCurrentIndex(0);
                          }}
                          type="button"
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                            selectedCategory === cat.id
                              ? "bg-[#0066f5] text-white font-bold"
                              : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                          }`}
                        >
                          <span>{cat.label}</span>
                          {selectedCategory === cat.id && (
                            <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Host a Vibe Button (Directly below Category dropdown) */}
              <button
                onClick={() => setCreateVibeOpen(true)}
                type="button"
                className="w-full py-2.5 px-3 rounded-xl bg-[#0066f5] hover:bg-[#0052cc] text-white text-xs font-bold shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-[0.98]"
                title="Host a Vibe"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Host a Vibe</span>
              </button>
            </div>

            {/* Reel Card */}
            <div
              onDoubleClick={handleDoubleClick}
              className="vibe-reel-card relative w-full sm:w-[380px] lg:w-[420px] h-[calc(100dvh-130px)] sm:h-[580px] lg:h-[640px] rounded-[28px] sm:rounded-[34px] overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] bg-neutral-900 shrink-0 select-none group"
            >
              {/* Double-tap Floating Fire Pop */}
              {doubleTapHeart && (
                <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center animate-in zoom-in-50 fade-in duration-200">
                  <div className="w-20 h-20 rounded-full bg-[#0a6cf0]/95 backdrop-blur-md flex items-center justify-center shadow-[0_0_40px_rgba(255,85,0,0.85)] animate-bounce">
                    <Flame className="w-12 h-12 text-white fill-white" />
                  </div>
                </div>
              )}

              {/* Badge Top Left */}
              <div className="absolute top-4 left-4 z-20 pointer-events-none">
                <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-black/60 backdrop-blur-md text-white/90 border border-white/10 shadow-sm">
                  {currentVibe.badge || "Community pick"}
                </span>
              </div>

              {/* City Filter Pill Top Right of Card (Adjusted onto the page) */}
              <div
                className="absolute top-4 right-4 z-30"
                onPointerDown={(e) => e.stopPropagation()}
              >
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCityDropdownOpen(!cityDropdownOpen);
                    }}
                    type="button"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/85 backdrop-blur-md border border-white/20 text-xs font-semibold text-white shadow-md transition-all cursor-pointer select-none"
                    title="Change City"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#00e0ff]" />
                    <span className="max-w-[85px] truncate">{selectedCity}</span>
                    <ChevronDown className="w-3 h-3 text-white/80" />
                  </button>

                  {cityDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-white border border-[#dbe6f7] shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95">
                      {CITIES.map((c) => (
                        <button
                          key={c}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCity(c);
                            setCityDropdownOpen(false);
                            setCurrentIndex(0);
                          }}
                          type="button"
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                            selectedCity === c
                              ? "bg-[#0a6cf0] text-white font-bold"
                              : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                          }`}
                        >
                          <span>{c}</span>
                          {selectedCity === c && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Cover Image with Vignette */}
              <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <img
                  src={currentVibe.cover_image_url}
                  alt={currentVibe.title}
                  className="object-cover w-full h-full scale-[1.02] transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/40" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20" />
              </div>

              {/* Right Action Rail (Reels Style) */}
              <div
                onPointerDown={(e) => e.stopPropagation()}
                className="absolute right-3.5 bottom-6 z-20 flex flex-col items-center gap-3.5"
              >
                {/* Like / Flame Button */}
                <button
                  type="button"
                  onClick={handleToggleLike}
                  className="flex flex-col items-center gap-1 cursor-pointer group/flame"
                  title="Like vibe"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      currentLike.isLiked
                        ? "bg-[#0a6cf0] text-white shadow-[0_0_15px_rgba(255,85,0,0.6)]"
                        : "bg-black/60 backdrop-blur-md border border-white/15 text-white/90 hover:bg-black/80"
                    }`}
                  >
                    <Flame className={`w-5 h-5 ${currentLike.isLiked ? "fill-white" : ""}`} />
                  </div>
                  <span className="text-[11px] font-bold text-white drop-shadow-md">
                    {currentLike.count}
                  </span>
                </button>

                {/* Comments Button */}
                <button
                  type="button"
                  onClick={() => setCommentsOpen(true)}
                  className="flex flex-col items-center gap-1 cursor-pointer group/chat"
                  title="View & post comments"
                >
                  <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white/90 hover:text-white hover:bg-[#0a6cf0]/20 hover:border-[#0a6cf0]/40 flex items-center justify-center transition-all shadow-md">
                    <MessageSquare className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-[11px] font-bold text-white drop-shadow-md">
                    {currentComments.length}
                  </span>
                </button>

                {/* Share Button */}
                <button
                  type="button"
                  onClick={handleShare}
                  className="flex flex-col items-center gap-1 cursor-pointer group/share"
                  title="Share vibe"
                >
                  <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white/90 hover:bg-black/80 flex items-center justify-center transition-all shadow-md">
                    <Share2 className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-[11px] font-semibold text-white drop-shadow-md">Share</span>
                </button>

                {/* Info / Description Button */}
                <button
                  type="button"
                  onClick={() => setInfoModalOpen(true)}
                  className="flex flex-col items-center gap-1 cursor-pointer group/info"
                  title="Event details"
                >
                  <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white/90 hover:bg-black/80 flex items-center justify-center transition-all shadow-md">
                    <Info className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-[11px] font-semibold text-white drop-shadow-md">Info</span>
                </button>

                {/* Sound Toggle Button (Moved from removed second navbar) */}
                <button
                  type="button"
                  onClick={() => {
                    setSoundEnabled(!soundEnabled);
                    showToast(soundEnabled ? "Audio muted" : "Ambiance sound active");
                  }}
                  className="flex flex-col items-center gap-1 cursor-pointer group/sound"
                  title={soundEnabled ? "Mute audio" : "Enable sound"}
                >
                  <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white/90 hover:bg-black/80 flex items-center justify-center transition-all shadow-md">
                    {soundEnabled ? (
                      <Volume2 className="w-4.5 h-4.5 text-[#00e0ff]" />
                    ) : (
                      <VolumeX className="w-4.5 h-4.5 text-white/70" />
                    )}
                  </div>
                  <span className="text-[11px] font-semibold text-white drop-shadow-md">
                    {soundEnabled ? "Sound" : "Mute"}
                  </span>
                </button>
              </div>

            </div>

            {/* CENTER: Navigation Arrows (Desktop) */}
            <div className="hidden lg:flex flex-col items-center gap-3 shrink-0">
              <button
                onClick={handlePrev}
                type="button"
                className="w-11 h-11 rounded-full bg-white hover:bg-[#f6faff] border border-[#dbe6f7] text-slate-700 hover:text-slate-900 shadow-md flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95"
                title="Previous vibe (Up Arrow / Scroll Up)"
              >
                <ChevronUp className="w-5 h-5" />
              </button>

              <div className="text-center text-[11px] text-slate-500 font-bold py-1 font-mono">
                {currentIndex + 1} / {filteredVibes.length}
              </div>

              <button
                onClick={handleNext}
                type="button"
                className="w-11 h-11 rounded-full bg-white hover:bg-[#f6faff] border border-[#dbe6f7] text-slate-700 hover:text-slate-900 shadow-md flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95"
                title="Next vibe (Down Arrow / Scroll Down)"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>

            {/* RIGHT SIDE: Reel Info Panel (Desktop >= 1024px) */}
            <div className="hidden lg:flex w-[380px] lg:w-[410px] xl:w-[440px] h-[580px] lg:h-[640px] rounded-[32px] bg-white backdrop-blur-xl border border-[#dbe6f7] p-6 sm:p-7 shadow-xl flex-col justify-between shrink-0 space-y-4 overflow-hidden relative text-slate-800">
              {/* Decorative Subtle Background Glow */}
              <div className="absolute top-0 right-0 w-44 h-44 bg-[#0a6cf0]/10 rounded-full blur-3xl pointer-events-none" />

              {/* Host Profile Header */}
              <div className="flex items-center gap-3 pb-3 border-b border-[#dbe6f7] relative z-10">
                <div className="w-11 h-11 rounded-full bg-blue-50 text-[#0A6CF0] border border-blue-200 flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                  {currentVibe.host_initials}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-slate-900 truncate">{currentVibe.host_name}</h4>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <span className="text-amber-400">★</span>
                    <span>{currentVibe.host_rating} · {currentVibe.host_vibes_count} vibes hosted</span>
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-50 border border-[#dbe6f7] text-slate-600">
                  Verified Host
                </span>
              </div>

              {/* Category & Title */}
              <div className="relative z-10">
                <span className="text-xs font-mono font-bold tracking-wider text-[#0a6cf0] uppercase">
                  {currentVibe.category}
                </span>
                <h2
                  className="text-2xl lg:text-[26px] font-black tracking-tight text-slate-900 mt-1 leading-tight font-heading"
                  style={{ fontFamily: "'Trapvoid', 'Bricolage Grotesque', 'Outfit', sans-serif" }}
                >
                  {currentVibe.title}
                </h2>
              </div>

              {/* Date, Time & Location Pill List */}
              <div className="space-y-2 text-xs font-medium text-slate-700 bg-[#f6faff] p-3.5 rounded-2xl border border-[#dbe6f7] relative z-10">
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-[#0a6cf0] shrink-0" />
                  <span className="text-slate-900 font-medium">{currentVibe.formatted_date}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#0a6cf0] shrink-0" />
                  <span>{currentVibe.formatted_time}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-[#0a6cf0] shrink-0" />
                  <span className="truncate">{currentVibe.location_name}, {currentVibe.city}</span>
                </div>
              </div>

              {/* Description / About */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-1.5 min-h-[90px] max-h-[170px] relative z-10">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">About this vibe</p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {currentVibe.description}
                </p>
              </div>

              {/* Capacity Progress Bar */}
              {currentVibe.has_spots_limit && (currentVibe.capacity || 0) > 0 && (
                <div className="p-3 rounded-2xl bg-[#f6faff] border border-[#dbe6f7] space-y-2 relative z-10">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-500" />
                      <span>{currentVibe.going_count}/{currentVibe.capacity} going</span>
                    </span>
                    <span className="font-bold text-[#0a6cf0] flex items-center gap-1">
                      <Flame className="w-3 h-3 fill-[#0a6cf0]" />
                      <span>{currentVibe.spots_left ?? 0} spots left</span>
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#0a6cf0] to-[#00e0ff] rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, (currentVibe.going_count / (currentVibe.capacity || 1)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons Row */}
              <div className="flex items-center gap-2.5 pt-1 relative z-10">
                {userRsvp ? (
                  <button
                    onClick={() => setPassModalOpen(true)}
                    type="button"
                    className="flex-1 py-3 px-3.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-xs font-bold text-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.25)] flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-98"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>You're in · View pass</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setJoinModalOpen(true)}
                    type="button"
                    className="flex-1 py-3 px-3.5 rounded-xl bg-gradient-to-r from-[#0b1f4b] to-[#0a6cf0] hover:brightness-110 active:scale-[0.98] text-xs font-bold text-white transition-all shadow-[0_0_20px_rgba(255,85,0,0.35)] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>Join now</span>
                  </button>
                )}

                <button
                  onClick={() => setHostModalOpen(true)}
                  type="button"
                  className="py-3 px-3.5 rounded-xl bg-[#f6faff] hover:bg-slate-200 border border-[#dbe6f7] text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer shrink-0"
                  title="Connect with host"
                >
                  <span>Connect with host</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* =========================================================================
          MODAL 1: JOIN / RSVP MODAL
          ========================================================================= */}
      {joinModalOpen && currentVibe && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setJoinModalOpen(false)}
        >
          <div
            className="relative w-full max-w-md bg-white border border-[#dbe6f7] rounded-3xl p-6 sm:p-7 shadow-2xl text-white overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#0a6cf0]/15 rounded-full blur-3xl pointer-events-none" />

            <button
              onClick={() => setJoinModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold text-[#0a6cf0] uppercase tracking-wider mb-2">
              <Zap className="w-3.5 h-3.5 fill-current" />
              Instant RSVP Pass
            </div>

            <h3 className="text-xl font-extrabold text-slate-900 mb-1">{currentVibe.title}</h3>
            <p className="text-xs text-slate-500 mb-5">{currentVibe.formatted_date_time_venue}</p>

            <form onSubmit={handleConfirmRsvp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={joinName}
                  onChange={(e) => setJoinName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#dbe6f7] text-slate-800 placeholder-neutral-500 text-sm focus:outline-hidden focus:border-[#0a6cf0]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  WhatsApp Number (for entry pass & venue updates)
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={joinPhone}
                  onChange={(e) => setJoinPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#dbe6f7] text-slate-800 placeholder-neutral-500 text-sm focus:outline-hidden focus:border-[#0a6cf0]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Number of spots
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setJoinSpots(num)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${
                        joinSpots === num
                          ? "bg-[#0a6cf0] text-white border-[#0a6cf0]"
                          : "bg-white/5 text-slate-600 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      {num} {num === 1 ? "Spot" : "Spots"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#0b1f4b] to-[#0a6cf0] hover:brightness-110 text-white font-bold text-sm shadow-[0_4px_20px_rgba(255,85,0,0.4)] transition-all cursor-pointer"
                >
                  Confirm Free Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: DIGITAL RSVP PASS MODAL
          ========================================================================= */}
      {passModalOpen && currentVibe && userRsvp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setPassModalOpen(false)}
        >
          <div
            className="relative w-full max-w-sm bg-white border border-[#dbe6f7] border border-[#0a6cf0]/40 rounded-3xl p-6 shadow-[0_0_50px_rgba(255,85,0,0.25)] text-white overflow-hidden text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPassModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[11px] font-bold uppercase tracking-wider mb-3">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified RSVP Pass
            </div>

            <h3 className="text-xl font-black text-slate-900 leading-snug mb-1">{currentVibe.title}</h3>
            <p className="text-xs text-slate-500 mb-4">{currentVibe.formatted_date_time_venue}</p>

            {/* QR Code graphic */}
            <div className="bg-white p-4 rounded-2xl w-44 h-44 mx-auto flex items-center justify-center shadow-lg my-3">
              <div className="relative">
                <QrCode className="w-36 h-36 text-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-[#0a6cf0] text-white flex items-center justify-center text-xs font-black shadow-md">
                    V
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-[#dbe6f7] rounded-2xl p-3 my-4 text-left text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Pass Holder:</span>
                <span className="font-bold text-white">{userRsvp.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Spots Reserved:</span>
                <span className="font-bold text-white">{userRsvp.spots} Person</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Pass ID:</span>
                <span className="font-mono text-[#0a6cf0] font-bold">{userRsvp.ticketId}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  showToast("Pass saved to device!");
                  setPassModalOpen(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold"
              >
                Done
              </button>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `I'm going to "${currentVibe.title}" on Vibe! ${currentVibe.formatted_date_time_venue}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 rounded-xl bg-[#25D366] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md"
              >
                <span>Share Pass</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: CONNECT WITH HOST MODAL
          ========================================================================= */}
      {hostModalOpen && currentVibe && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setHostModalOpen(false)}
        >
          <div
            className="relative w-full max-w-sm bg-white border border-[#dbe6f7] rounded-3xl p-6 shadow-2xl text-white overflow-hidden text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setHostModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Host Avatar */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#0a6cf0] to-[#00e0ff] mx-auto flex items-center justify-center text-xl font-black text-white shadow-lg mb-3">
              {currentVibe.host_initials}
            </div>

            <h3 className="text-lg font-bold text-white mb-0.5">{currentVibe.host_name}</h3>
            <p className="text-xs text-slate-500 mb-3">Host on Vibe Instant</p>

            <div className="grid grid-cols-2 gap-2 my-4">
              <div className="bg-slate-50 border border-[#dbe6f7] rounded-xl p-2.5">
                <div className="text-base font-extrabold text-amber-400">⭐ {currentVibe.host_rating}</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">Host Rating</div>
              </div>
              <div className="bg-slate-50 border border-[#dbe6f7] rounded-xl p-2.5">
                <div className="text-base font-extrabold text-[#00e0ff]">{currentVibe.host_vibes_count}</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">Vibes Hosted</div>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-5">
              Have questions about turf slots, acoustic gear, or parking? Connect directly with the host on WhatsApp.
            </p>

            <div className="space-y-2">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Hi ${currentVibe.host_name}, I saw your meetup "${currentVibe.title}" on Vibe Instant. Had a quick question!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-[#25D366] hover:brightness-110 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <span>Chat on WhatsApp</span>
              </a>

              <button
                onClick={() => {
                  setHostModalOpen(false);
                  setCommentsOpen(true);
                }}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-700 text-xs font-semibold"
              >
                Ask in Public Comments
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 4: EVENT DETAILS / INFO MODAL
          ========================================================================= */}
      {infoModalOpen && currentVibe && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setInfoModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg bg-white border border-[#dbe6f7] rounded-3xl p-6 sm:p-7 shadow-2xl text-white max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setInfoModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#0a6cf0]/20 text-[#0a6cf0] border border-[#0a6cf0]/30 mb-3">
              {currentVibe.category}
            </span>

            <h3 className="text-2xl font-black text-white mb-2 leading-tight">{currentVibe.title}</h3>

            <div className="space-y-2 py-3 border-y border-white/10 my-4 text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <Calendar className="w-4 h-4 text-[#0a6cf0]" />
                <span>{currentVibe.formatted_date}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Clock className="w-4 h-4 text-[#0a6cf0]" />
                <span>{currentVibe.formatted_time}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="w-4 h-4 text-[#0a6cf0]" />
                <span>
                  {currentVibe.location_name}, {currentVibe.city}
                </span>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">About this Vibe</h4>
              <p className="text-sm text-slate-600 leading-relaxed">{currentVibe.description}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setInfoModalOpen(false);
                  if (userRsvp) {
                    setPassModalOpen(true);
                  } else {
                    setJoinModalOpen(true);
                  }
                }}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#0b1f4b] to-[#0a6cf0] text-white font-bold text-sm shadow-md"
              >
                {userRsvp ? "View Confirmed Pass" : "Get Free Pass"}
              </button>
              <button
                onClick={handleShare}
                className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm"
              >
                Share
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 5: COMMENTS SLIDE-OVER SHEET
          ========================================================================= */}
      {commentsOpen && currentVibe && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setCommentsOpen(false)}
        >
          <div
            className="relative w-full sm:max-w-md h-[75vh] sm:h-[600px] bg-white border border-white/15 rounded-t-3xl sm:rounded-3xl shadow-2xl text-white flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#0a6cf0]" />
                <h3 className="text-sm font-bold text-slate-900">Vibe Chat ({currentComments.length})</h3>
              </div>
              <button
                onClick={() => setCommentsOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
              {currentComments.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  No comments yet. Start the conversation!
                </div>
              ) : (
                currentComments.map((comm) => (
                  <div key={comm.id} className="flex gap-2.5 items-start">
                    <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-xs font-bold text-[#0a6cf0] shrink-0">
                      {comm.initials}
                    </div>
                    <div className="flex-1 bg-slate-50 border border-[#dbe6f7] rounded-2xl p-3 text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-white">{comm.author}</span>
                        <span className="text-[10px] text-slate-500">{comm.timeAgo}</span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">{comm.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleAddComment} className="p-3 border-t border-white/10 bg-black/40 flex gap-2">
              <input
                type="text"
                placeholder="Ask host or attendees..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-[#dbe6f7] text-slate-800 placeholder-neutral-500 text-xs focus:outline-hidden focus:border-[#0a6cf0]"
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl bg-[#0a6cf0] hover:bg-[#0b1f4b] text-white text-xs font-bold flex items-center justify-center cursor-pointer transition-all"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 6: HOST A VIBE MODAL
          ========================================================================= */}
      {createVibeOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setCreateVibeOpen(false)}
        >
          <div
            className="relative w-full max-w-md bg-white border border-[#dbe6f7] rounded-3xl p-6 shadow-2xl text-white max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setCreateVibeOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold text-[#0a6cf0] uppercase tracking-wider mb-2">
              <Plus className="w-3.5 h-3.5" />
              60-Second Instant Gathering
            </div>

            <h3 className="text-xl font-extrabold text-white mb-4">Host a Vibe</h3>

            <form onSubmit={handleCreateVibe} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Gathering Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sunday Morning Gully Cricket"
                  value={createTitle}
                  onChange={(e) => setCreateTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#dbe6f7] text-slate-800 placeholder-neutral-500 text-xs focus:outline-hidden focus:border-[#0a6cf0]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
                  <select
                    value={createCategory}
                    onChange={(e) => setCreateCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#dbe6f7] text-slate-800 text-xs"
                  >
                    <option value="SPORTS">Sports & Turf</option>
                    <option value="MUSIC">Live Music</option>
                    <option value="TECHNOLOGY">Technology</option>
                    <option value="SOCIAL">Social & Cafes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">City</label>
                  <select
                    value={createCity}
                    onChange={(e) => setCreateCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#dbe6f7] text-slate-800 text-xs"
                  >
                    <option value="Mumbai">Mumbai</option>
                    <option value="Pune">Pune</option>
                    <option value="Indore">Indore</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Delhi">Delhi</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Venue / Ground</label>
                <input
                  type="text"
                  placeholder="e.g. Bandra Turf, Ground 2"
                  value={createVenue}
                  onChange={(e) => setCreateVenue(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#dbe6f7] text-slate-800 placeholder-neutral-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Date</label>
                  <input
                    type="text"
                    value={createDate}
                    onChange={(e) => setCreateDate(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-white border border-[#dbe6f7] text-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Time</label>
                  <input
                    type="text"
                    value={createTime}
                    onChange={(e) => setCreateTime(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-white border border-[#dbe6f7] text-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Max Spots</label>
                  <input
                    type="number"
                    value={createCapacity}
                    onChange={(e) => setCreateCapacity(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-white border border-[#dbe6f7] text-slate-800 text-xs"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#0b1f4b] to-[#0a6cf0] text-white font-bold text-xs shadow-lg cursor-pointer"
                >
                  Publish Vibe Reel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
export default VibeReelsFeed;
