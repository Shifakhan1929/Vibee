import { useState, useEffect } from "react";
import {
  MapPin,
  X,
  Check,
  Sparkles,
  ChevronRight,
  Flame,
} from "lucide-react";

export interface CityItem {
  id: string;
  name: string;
  state: string;
  country: string;
  url: string;
  popular?: boolean;
  eventCount: string;
  badge?: string;
  landmark?: string;
}

export const POPULAR_CITIES: CityItem[] = [
  {
    id: "indore",
    name: "Indore",
    state: "Madhya Pradesh",
    country: "India",
    url: "/indore",
    popular: true,
    eventCount: "350+ Events",
    badge: "Food & Startup Hub",
    landmark: "Rajwada Palace",
  },
  {
    id: "bhopal",
    name: "Bhopal",
    state: "Madhya Pradesh",
    country: "India",
    url: "/bhopal",
    popular: true,
    eventCount: "220+ Events",
    badge: "City of Lakes",
    landmark: "Upper Lake",
  },
  {
    id: "bangalore",
    name: "Bangalore",
    state: "Karnataka",
    country: "India",
    url: "/bangalore",
    popular: true,
    eventCount: "680+ Events",
    badge: "Tech & Live Gigs",
    landmark: "Cubbon Park",
  },
  {
    id: "satna",
    name: "Satna",
    state: "Madhya Pradesh",
    country: "India",
    url: "/satna",
    popular: true,
    eventCount: "65+ Events",
    badge: "Cultural Hub",
    landmark: "Maihar Temple Circuit",
  },
  {
    id: "mumbai",
    name: "Mumbai",
    state: "Maharashtra",
    country: "India",
    url: "/mumbai",
    popular: true,
    eventCount: "890+ Events",
    badge: "Concerts & Comedy",
    landmark: "Marine Drive",
  },
  {
    id: "delhi",
    name: "Delhi NCR",
    state: "Delhi NCR",
    country: "India",
    url: "/delhi",
    popular: true,
    eventCount: "940+ Events",
    badge: "Festivals & Summits",
    landmark: "India Gate",
  },
  {
    id: "pune",
    name: "Pune",
    state: "Maharashtra",
    country: "India",
    url: "/pune",
    popular: true,
    eventCount: "410+ Events",
    badge: "College & Music",
    landmark: "Koregaon Park",
  },
  {
    id: "hyderabad",
    name: "Hyderabad",
    state: "Telangana",
    country: "India",
    url: "/hyderabad",
    popular: true,
    eventCount: "380+ Events",
    badge: "Tech & Food",
    landmark: "Charminar",
  },
];

export const ALL_CITY_SUGGESTIONS: CityItem[] = [
  ...POPULAR_CITIES,
  {
    id: "ujjain",
    name: "Ujjain",
    state: "Madhya Pradesh",
    country: "India",
    url: "/ujjain",
    eventCount: "110+ Events",
    badge: "Heritage & Culture",
  },
  {
    id: "jabalpur",
    name: "Jabalpur",
    state: "Madhya Pradesh",
    country: "India",
    url: "/jabalpur",
    eventCount: "95+ Events",
    badge: "Nature & Art",
  },
  {
    id: "gwalior",
    name: "Gwalior",
    state: "Madhya Pradesh",
    country: "India",
    url: "/gwalior",
    eventCount: "80+ Events",
    badge: "Music & History",
  },
  {
    id: "rewa",
    name: "Rewa",
    state: "Madhya Pradesh",
    country: "India",
    url: "/rewa",
    eventCount: "40+ Events",
    badge: "Regional Hub",
  },
  {
    id: "jaipur",
    name: "Jaipur",
    state: "Rajasthan",
    country: "India",
    url: "/jaipur",
    eventCount: "260+ Events",
    badge: "Royal Gatherings",
  },
  {
    id: "ahmedabad",
    name: "Ahmedabad",
    state: "Gujarat",
    country: "India",
    url: "/ahmedabad",
    eventCount: "310+ Events",
    badge: "Festivals & Business",
  },
  {
    id: "goa",
    name: "Goa",
    state: "Goa",
    country: "India",
    url: "/goa",
    eventCount: "450+ Events",
    badge: "Beach & Nightlife",
  },
  {
    id: "chandigarh",
    name: "Chandigarh",
    state: "Punjab",
    country: "India",
    url: "/chandigarh",
    eventCount: "190+ Events",
    badge: "Youth & Music",
  },
  {
    id: "kolkata",
    name: "Kolkata",
    state: "West Bengal",
    country: "India",
    url: "/kolkata",
    eventCount: "320+ Events",
    badge: "Arts & Literature",
  },
];

/**
 * Get currently selected city from localStorage or fallback to Indore
 */
export function getSavedCity(): string {
  if (typeof window === "undefined") return "Indore";
  try {
    const saved = localStorage.getItem("vibe_selected_city");
    if (saved && saved.trim()) return saved.trim();
  } catch (e) {
    // Ignore storage errors
  }
  return "Indore";
}

/**
 * Save selected city to localStorage and broadcast change event
 */
export function setSavedCity(cityName: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("vibe_selected_city", cityName);
    window.dispatchEvent(
      new CustomEvent("vibe:city_changed", { detail: { city: cityName } })
    );
  } catch (e) {
    // Ignore storage errors
  }
}

/**
 * Helper to dispatch event that opens the city modal from anywhere
 */
export function openCityModal() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("vibe:open_city_modal"));
  }
}

export interface CitySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeCitySlug?: string;
  onSelectCity?: (city: CityItem) => void;
}

export function CitySelectorModal({
  isOpen,
  onClose,
  activeCitySlug,
  onSelectCity,
}: CitySelectorModalProps) {
  const [currentCity, setCurrentCity] = useState<string>("Indore");

  useEffect(() => {
    setCurrentCity(getSavedCity());
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const checkIfSelected = (city: CityItem) => {
    if (activeCitySlug) {
      const cleanSlug = activeCitySlug.toLowerCase().trim();
      if (city.id.toLowerCase() === cleanSlug || city.name.toLowerCase() === cleanSlug) {
        return true;
      }
    }
    return currentCity.toLowerCase() === city.name.toLowerCase();
  };

  const handleCityClick = (city: CityItem) => {
    setCurrentCity(city.name);
    setSavedCity(city.name);
    if (onSelectCity) {
      onSelectCity(city);
    } else {
      window.location.href = city.url;
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] bg-[#07133A]/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="city-modal-title"
    >
      <div
        className="vibe-city-selector-modal w-full sm:max-w-[420px] bg-white rounded-t-[28px] sm:rounded-3xl shadow-[0_25px_70px_rgba(7,19,58,0.35)] border border-slate-100/80 overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[520px] animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200 select-none text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Indicator Pill */}
        <div className="pt-2.5 pb-1 flex justify-center sm:hidden bg-slate-50/70">
          <div className="w-10 h-1 rounded-full bg-slate-300" />
        </div>

        {/* Polished Header (No aggressive all-caps) */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#07133A] to-[#007BFF] text-white flex items-center justify-center shadow-md shadow-[#007BFF]/25 shrink-0">
              <MapPin className="w-4 h-4 fill-white text-white" />
            </div>
            <div>
              <h2
                id="city-modal-title"
                className="text-[15px] font-extrabold text-[#07133A] tracking-tight leading-tight"
                style={{ textTransform: "none" }}
              >
                Select Your City
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">Find local gatherings & events</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Cities Content (Single clean container, NO search bar as requested) */}
        <div className="vibe-city-scroll overflow-y-auto px-5 py-4 flex-1 space-y-5">
          {/* Section 1: Popular Hubs Chips */}
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Popular Hubs</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {POPULAR_CITIES.map((city) => {
                const isSelected = checkIfSelected(city);
                return (
                  <button
                    key={city.id}
                    type="button"
                    onClick={() => handleCityClick(city)}
                    className={`city-chip px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? "active bg-gradient-to-r from-[#07133A] to-[#007BFF] text-white font-bold shadow-md shadow-[#007BFF]/25 border-transparent scale-[1.02]"
                        : "bg-slate-50 text-slate-700 hover:text-[#007BFF] hover:bg-blue-50/60 border border-slate-200/70"
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    <span>{city.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: All Cities List (Border-less, sleek rows) */}
          <div>
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#007BFF]" />
                <span>All Cities</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {ALL_CITY_SUGGESTIONS.length} Hubs
              </span>
            </div>

            <div className="space-y-1">
              {ALL_CITY_SUGGESTIONS.map((city) => {
                const isSelected = checkIfSelected(city);
                return (
                  <button
                    key={city.id}
                    type="button"
                    onClick={() => handleCityClick(city)}
                    className={`city-row-btn group w-full text-left px-3 py-2.5 rounded-2xl text-xs transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? "active bg-blue-50/90 text-[#007BFF] font-bold shadow-xs"
                        : "text-slate-700 hover:bg-slate-50/90 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-black transition-colors ${
                          isSelected
                            ? "bg-gradient-to-tr from-[#07133A] to-[#007BFF] text-white shadow-xs"
                            : "bg-slate-100 text-slate-500 group-hover:text-[#007BFF] group-hover:bg-blue-50"
                        }`}
                      >
                        {city.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="truncate">
                        <div className="flex items-center gap-1.5">
                          <span className={`font-bold text-[13px] ${isSelected ? "text-[#007BFF]" : "text-slate-900"}`}>
                            {city.name}
                          </span>
                          {city.badge && (
                            <span className="text-[9px] font-medium text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded-md hidden sm:inline">
                              {city.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 font-normal truncate mt-0.5">
                          {city.state}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isSelected ? (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-white bg-gradient-to-r from-[#07133A] to-[#007BFF] px-2.5 py-1 rounded-full shadow-xs">
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>Selected</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-slate-400 group-hover:text-[#007BFF]">
                          <span className="text-[10px] font-semibold text-slate-400 group-hover:text-[#007BFF]">
                            {city.eventCount.split(" ")[0]}
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transform group-hover:translate-x-0.5 transition-all" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Micro Footer */}
        <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-slate-500 text-[11px]">
              Active: <strong className="text-slate-900 font-bold">{currentCity}</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#07133A] to-[#007BFF] hover:brightness-110 active:scale-95 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export function useSelectedCity(defaultCity = "Indore"): [string, (city: string) => void] {
  const [city, setCity] = useState<string>(defaultCity);

  useEffect(() => {
    setCity(getSavedCity());
    const handleCityChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ city: string }>;
      if (customEvent.detail?.city) {
        setCity(customEvent.detail.city);
      }
    };

    window.addEventListener("vibe:city_changed", handleCityChange);
    return () => window.removeEventListener("vibe:city_changed", handleCityChange);
  }, []);

  const updateCity = (newCity: string) => {
    setCity(newCity);
    setSavedCity(newCity);
  };

  return [city, updateCity];
}
