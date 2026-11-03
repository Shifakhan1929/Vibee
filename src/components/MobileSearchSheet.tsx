import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Search, X, Clock, Sparkles, TrendingUp, MapPin } from "lucide-react";

export interface MobileSearchSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCity?: string;
  onSelectTopic?: (topic: string) => void;
}

export function MobileSearchSheet({
  isOpen,
  onClose,
  selectedCity = "Indore",
  onSelectTopic,
}: MobileSearchSheetProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const trendingChips = [
    "Live Music",
    "Standup Comedy",
    "Box Cricket",
    "Workshops",
    "House Parties",
  ];

  const recentSearches = [
    `Weekend events in ${selectedCity}`,
    "Open Mic Night",
    "Turf Cricket match",
    "Food Festival",
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 120);
    } else {
      document.body.style.overflow = "";
      setQuery("");
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSearchSubmit = (searchWord: string) => {
    if (!searchWord.trim()) return;
    if (onSelectTopic) {
      onSelectTopic(searchWord);
    } else {
      window.location.href = `/${selectedCity.toLowerCase()}?q=${encodeURIComponent(searchWord)}`;
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100010] bg-[#07133A] text-white flex flex-col animate-in slide-in-from-bottom-4 duration-200"
      style={{
        height: "100dvh",
        maxHeight: "100dvh",
        paddingTop: "max(12px, env(safe-area-inset-top, 12px))",
        paddingBottom: "max(16px, env(safe-area-inset-bottom, 16px))",
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Search Events"
    >
      {/* Top Search Input Row */}
      <div className="px-4 py-2 flex items-center gap-2.5 border-b border-white/10 shrink-0">
        <button
          type="button"
          onClick={onClose}
          className="w-11 h-11 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
          aria-label="Close search"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex-1 relative flex items-center">
          <div className="absolute left-3.5 text-slate-400 pointer-events-none">
            <Search className="w-4 h-4" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearchSubmit(query);
            }}
            placeholder={`Search events in ${selectedCity}...`}
            className="w-full h-12 pl-10 pr-10 rounded-2xl bg-white/10 border border-white/15 text-white placeholder-slate-400 text-[16px] focus:outline-none focus:border-[#00D2FF] focus:ring-1 focus:ring-[#00D2FF] transition-all"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 text-slate-400 hover:text-white p-1"
              aria-label="Clear query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Search Sheet Body (Scrollable) */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
        {/* Trending Chips in City */}
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            <TrendingUp className="w-3.5 h-3.5 text-[#00D2FF]" />
            <span>Trending in {selectedCity}</span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
            {trendingChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSearchSubmit(chip)}
                className="snap-start shrink-0 px-4 py-2 rounded-full bg-white/10 hover:bg-[#007BFF] active:scale-95 text-slate-200 hover:text-white border border-white/10 text-xs font-semibold transition-all cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Recent Searches */}
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Recent & Popular Searches</span>
          </div>

          <div className="divide-y divide-white/5">
            {recentSearches.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSearchSubmit(item)}
                className="w-full min-h-[48px] py-3 flex items-center justify-between text-left text-sm text-slate-300 hover:text-white transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>{item}</span>
                </div>
                <span className="text-[11px] text-[#00D2FF]">Search</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Explore by City Hubs */}
        <div className="pt-2">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0038A8] to-[#007BFF] flex items-center justify-center text-white">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Viewing {selectedCity}</div>
                <div className="text-[11px] text-slate-400">Tap to switch your active location</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                window.dispatchEvent(new CustomEvent("open-city-selector"));
              }}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#00D2FF] text-xs font-bold transition-colors cursor-pointer"
            >
              Change
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

