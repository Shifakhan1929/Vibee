import { useState, useEffect } from "react";

export interface EventPreviewItem {
  id: "cricket" | "comedy" | "music" | "workshop" | "party" | string;
  label: string; // Text displayed on the interactive chip
  banner: string; // Category name on the gradient banner
  title: string; // Event headline
  meta: string; // Date, time, and venue string
  progress: number; // Percentage (0-100) for the animated bar
  spots: string; // Capacity / ticket count summary text
  button: string; // Text on the primary action button
}

export type EventTypeKey = "cricket" | "comedy" | "music" | "workshop" | "party";

export const EVENT_PREVIEW_DATA: Record<EventTypeKey, EventPreviewItem> = {
  cricket: {
    id: "cricket",
    label: "Cricket match",
    banner: "Cricket",
    title: "Sunday Gully Cricket, need 4 more",
    meta: "Sun, 7:00 AM · Ground 2, Arera Colony",
    progress: 64,
    spots: "7 of 11 joined",
    button: "Join for ₹100",
  },
  comedy: {
    id: "comedy",
    label: "Comedy night",
    banner: "Comedy",
    title: "Laugh Riot: Open Mic Night",
    meta: "Fri, 8:00 PM · Cafe Loft",
    progress: 78,
    spots: "78 of 100 tickets sold",
    button: "Get ticket ₹299",
  },
  music: {
    id: "music",
    label: "Live music",
    banner: "Music",
    title: "Acoustic Evenings on the Lake",
    meta: "Sun, 6:30 PM · Upper Lake",
    progress: 45,
    spots: "90 going",
    button: "RSVP free",
  },
  workshop: {
    id: "workshop",
    label: "Workshop",
    banner: "Workshop",
    title: "Pottery for Beginners",
    meta: "Sat, 11:00 AM · Studio 9",
    progress: 83,
    spots: "10 of 12 seats taken",
    button: "Book seat ₹799",
  },
  party: {
    id: "party",
    label: "Birthday",
    banner: "Birthday",
    title: "Rooftop Birthday Bash",
    meta: "Sat, 8:00 PM · Rooftop Lounge",
    progress: 50,
    spots: "25 of 50 invited, replied",
    button: "RSVP",
  },
};

export const EVENT_TYPE_KEYS: EventTypeKey[] = [
  "cricket",
  "comedy",
  "music",
  "workshop",
  "party",
];

export interface EventTypePreviewProps {
  data?: Record<string, EventPreviewItem>;
  defaultSelected?: EventTypeKey;
  onCategoryFilterPreFill?: (categoryName: string, eventId: string) => void;
  onCardActionClick?: (item: EventPreviewItem) => void;
}

export function EventTypePreview({
  data = EVENT_PREVIEW_DATA,
  defaultSelected = "cricket",
  onCategoryFilterPreFill,
  onCardActionClick,
}: EventTypePreviewProps) {
  const [selectedType, setSelectedType] = useState<EventTypeKey>(defaultSelected);
  const [animKey, setAnimKey] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const activeItem: EventPreviewItem = data[selectedType] ?? data["cricket"] ?? EVENT_PREVIEW_DATA.cricket;

  // Auto-change event preview every 4 seconds
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setSelectedType((prevType) => {
        const currentIndex = EVENT_TYPE_KEYS.indexOf(prevType);
        const nextIndex = (currentIndex + 1) % EVENT_TYPE_KEYS.length;
        return EVENT_TYPE_KEYS[nextIndex] ?? prevType;
      });
      setAnimKey((prev) => prev + 1);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleChipClick = (key: EventTypeKey) => {
    setSelectedType(key);
    setAnimKey((prev) => prev + 1);
    setIsPaused(true);
  };

  const handlePrimaryButtonClick = () => {
    if (onCardActionClick) {
      onCardActionClick(activeItem);
    } else if (onCategoryFilterPreFill) {
      onCategoryFilterPreFill(activeItem.banner, activeItem.id);
    }
  };

  return (
    <div className="vibe-hero-card-wrapper w-full flex flex-col gap-3" style={{ gridArea: "card" }}>
      {/* 1. Rotating Chips as a Single Scrollable Row on Mobile */}
      <div
        className="w-full flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none snap-x snap-mandatory select-none"
        style={{ scrollbarWidth: "none" }}
      >
        {EVENT_TYPE_KEYS.map((key) => {
          const item = data[key] ?? EVENT_PREVIEW_DATA[key];
          const isSelected = selectedType === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => handleChipClick(key)}
              className={`snap-start shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                isSelected
                  ? "bg-gradient-to-r from-[#00D2FF] to-[#007BFF] text-white shadow-md shadow-[#007BFF]/30 scale-[1.02]"
                  : "bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white border border-white/15"
              }`}
            >
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* 2. Preview Card (Full-width, 16px radius, 48px Join button) */}
      <div
        className="vibe-hero-card w-full"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          key={animKey}
          className="vibe-preview-card vibe-card-animated w-full rounded-2xl bg-gradient-to-b from-[#0a1e4a]/90 to-[#07133A]/95 border border-white/15 shadow-2xl p-4 sm:p-5 text-white"
          aria-live="polite"
        >
          {/* Banner Tag */}
          <div className="flex items-center justify-between mb-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00D2FF]/20 border border-[#00D2FF]/40 text-[#00D2FF] text-[11px] font-extrabold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D2FF] animate-pulse" />
              <span>{activeItem.banner}</span>
            </div>
            <span className="text-[11px] text-slate-300 font-semibold">{activeItem.spots}</span>
          </div>

          {/* Title */}
          <h3 className="text-base sm:text-lg font-black text-white tracking-tight leading-snug mb-1">
            {activeItem.title}
          </h3>

          {/* Venue & Date */}
          <p className="text-xs text-slate-300 flex items-center gap-1.5 mb-3.5">
            <svg className="w-3.5 h-3.5 text-[#00D2FF] shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span className="truncate">{activeItem.meta}</span>
          </p>

          {/* Progress Bar (8px tall) */}
          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden mb-2">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#007BFF] to-[#00D2FF] transition-all duration-500 ease-out"
              style={{ width: `${Math.min(100, Math.max(0, activeItem.progress))}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300 mb-4">
            <span>{activeItem.progress}% filled</span>
            <span className="text-[#00D2FF]">Spots filling fast</span>
          </div>

          {/* Actions: Full-width 48px Join button */}
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={handlePrimaryButtonClick}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-[#00D2FF] via-[#007BFF] to-[#0038A8] hover:brightness-110 active:scale-98 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#007BFF]/35 transition-all cursor-pointer"
            >
              <span>{activeItem.button}</span>
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>

            <a
              href="/vibe-instant"
              className="w-full h-9 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>⚡ View all similar events</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
