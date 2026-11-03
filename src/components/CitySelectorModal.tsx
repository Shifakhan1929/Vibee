import { useState, useEffect, useRef, useMemo } from "react";
import {
  MapPin,
  Search,
  X,
  Compass,
  Check,
  Building2,
  Sparkles,
  ArrowRight,
  Navigation,
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
    badge: "Tech & Music Capital",
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
    state: "Delhi",
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
  },
  {
    id: "jabalpur",
    name: "Jabalpur",
    state: "Madhya Pradesh",
    country: "India",
    url: "/jabalpur",
    eventCount: "95+ Events",
  },
  {
    id: "gwalior",
    name: "Gwalior",
    state: "Madhya Pradesh",
    country: "India",
    url: "/gwalior",
    eventCount: "80+ Events",
  },
  {
    id: "rewa",
    name: "Rewa",
    state: "Madhya Pradesh",
    country: "India",
    url: "/rewa",
    eventCount: "40+ Events",
  },
  {
    id: "jaipur",
    name: "Jaipur",
    state: "Rajasthan",
    country: "India",
    url: "/jaipur",
    eventCount: "260+ Events",
  },
  {
    id: "ahmedabad",
    name: "Ahmedabad",
    state: "Gujarat",
    country: "India",
    url: "/ahmedabad",
    eventCount: "310+ Events",
  },
  {
    id: "goa",
    name: "Goa",
    state: "Goa",
    country: "India",
    url: "/goa",
    eventCount: "450+ Events",
  },
  {
    id: "chandigarh",
    name: "Chandigarh",
    state: "Punjab",
    country: "India",
    url: "/chandigarh",
    eventCount: "190+ Events",
  },
  {
    id: "kolkata",
    name: "Kolkata",
    state: "West Bengal",
    country: "India",
    url: "/kolkata",
    eventCount: "320+ Events",
  },
  {
    id: "london",
    name: "London",
    state: "England",
    country: "United Kingdom",
    url: "/london",
    eventCount: "1200+ Events",
  },
  {
    id: "new-york",
    name: "New York",
    state: "NY",
    country: "United States",
    url: "/newyork-dbe12298e8b6a417",
    eventCount: "1500+ Events",
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
      className="fixed inset-0 z-[99999] bg-black/50 backdrop-blur-[3px] flex items-center justify-center p-3 animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="city-modal-title"
    >
      <div
        className="vibe-city-selector-modal w-full max-w-[380px] bg-white rounded-3xl shadow-[0_25px_70px_rgba(7,19,58,0.25)] border border-slate-100 overflow-hidden flex flex-col max-h-[480px] animate-in zoom-in-95 duration-200 select-none text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modern Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#07133A] to-[#007BFF] text-white flex items-center justify-center shadow-md shadow-[#007BFF]/25 shrink-0">
              <MapPin className="w-4 h-4 fill-white text-white" />
            </div>
            <div>
              <h2
                id="city-modal-title"
                className="text-sm font-black text-slate-900 tracking-tight leading-tight"
                style={{ textTransform: "none" }}
              >
                Select Your City
              </h2>
              <p className="text-[11px] text-slate-400 font-medium">Find local gatherings & events</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Cities Content (Single clean container) */}
        <div className="vibe-city-scroll overflow-y-auto px-5 py-4 flex-1 space-y-5">
          {/* Section 1: Popular Hubs */}
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              <Sparkles className="w-3 h-3 text-[#007BFF]" />
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
                    className={`city-chip px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? "active bg-gradient-to-r from-[#07133A] to-[#007BFF] text-white font-bold shadow-md shadow-[#007BFF]/25 border-transparent"
                        : "bg-slate-50 text-slate-700 hover:text-[#007BFF] hover:bg-slate-100"
                    }`}
                  >
                    {city.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: All Cities List */}
          <div>
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              <span>All Cities</span>
              <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                {ALL_CITY_SUGGESTIONS.length}
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
                    className={`city-row-btn group w-full text-left px-3 py-2.5 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? "active bg-blue-50/90 text-[#007BFF] font-bold"
                        : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? "bg-[#007BFF] text-white shadow-xs"
                            : "bg-slate-100 text-slate-400 group-hover:text-[#007BFF] group-hover:bg-blue-50"
                        }`}
                      >
                        <MapPin className="w-3 h-3" />
                      </div>
                      <div className="truncate">
                        <span className={`font-semibold text-xs ${isSelected ? "text-[#007BFF]" : "text-slate-800"}`}>
                          {city.name}
                        </span>
                        <span className="text-[10px] text-slate-400 ml-1.5 font-normal">
                          {city.state.split(" ")[0]}
                        </span>
                      </div>
                    </div>

                    {isSelected ? (
                      <div className="flex items-center gap-1 text-[10px] font-bold text-[#007BFF] bg-blue-100/70 px-2 py-0.5 rounded-full shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>Selected</span>
                      </div>
                    ) : (
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 group-hover:text-[#007BFF] transition-all transform group-hover:translate-x-0.5 shrink-0" />
                    )}
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
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#07133A] to-[#007BFF] hover:brightness-110 text-white font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-95"
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
