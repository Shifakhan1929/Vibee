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
  const [searchText, setSearchText] = useState("");
  const [currentCity, setCurrentCity] = useState(getSavedCity());
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [locationToast, setLocationToast] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Animated ticker city name in header
  const [tickerIndex, setTickerIndex] = useState(0);
  const TICKER_CITIES = useMemo(
    () => ["Indore", "Bhopal", "Bangalore", "Satna", "Mumbai", "Delhi"],
    []
  );

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % TICKER_CITIES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [isOpen, TICKER_CITIES.length]);

  useEffect(() => {
    if (isOpen) {
      setCurrentCity(getSavedCity());
      setTimeout(() => {
        inputRef.current?.focus();
      }, 80);
    } else {
      setSearchText("");
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // Filter cities based on search
  const filteredCities = useMemo(() => {
    if (!searchText.trim()) return ALL_CITY_SUGGESTIONS;
    const q = searchText.toLowerCase().trim();
    return ALL_CITY_SUGGESTIONS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.state.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q)
    );
  }, [searchText]);

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

  const handleDetectLocation = () => {
    if (!("geolocation" in navigator)) {
      setLocationToast("Geolocation is not supported by your browser");
      setTimeout(() => setLocationToast(null), 3000);
      return;
    }

    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setDetectingLocation(false);
        // Default to Indore / MP regional hub if user is in central India, or prompt
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        let detected = "Indore";
        // Simple approximate distance checks for demonstration
        if (lat >= 23.0 && lat <= 23.5 && lng >= 77.0 && lng <= 77.8) {
          detected = "Bhopal";
        } else if (lat >= 12.8 && lat <= 13.2 && lng >= 77.4 && lng <= 77.8) {
          detected = "Bangalore";
        } else if (lat >= 24.4 && lat <= 24.8 && lng >= 80.6 && lng <= 81.0) {
          detected = "Satna";
        } else if (lat >= 22.5 && lat <= 23.0 && lng >= 75.6 && lng <= 76.1) {
          detected = "Indore";
        }

        setCurrentCity(detected);
        setSavedCity(detected);
        setLocationToast(`Detected location: ${detected}`);
        setTimeout(() => {
          setLocationToast(null);
          onClose();
          window.location.href = `/${detected.toLowerCase()}`;
        }, 1200);
      },
      (err) => {
        setDetectingLocation(false);
        setLocationToast("Location access denied. Please select from the list.");
        setTimeout(() => setLocationToast(null), 3500);
      },
      { timeout: 7000 }
    );
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="city-modal-title"
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-[#0b1f4b] rounded-3xl shadow-2xl border border-[#dbe6f7] dark:border-[#1e2d4d] overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ==================================================================
            1. HEADER
            ================================================================== */}
        <div className="p-5 sm:p-6 pb-4 border-b border-[#eef4ff] dark:border-white/10 flex items-start justify-between bg-gradient-to-r from-[#f6faff] to-white dark:from-[#0b1f4b] dark:to-[#0f2860]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0a6cf0]/10 text-[#0a6cf0] text-xs font-bold uppercase tracking-wider mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Change Location</span>
            </div>

            <h2
              id="city-modal-title"
              className="text-xl sm:text-2xl font-black text-[#0b1f4b] dark:text-white flex items-center gap-2"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              <span>Explore events in</span>
              <span className="text-[#0a6cf0] transition-all duration-300">
                {TICKER_CITIES[tickerIndex]}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Select your city to find concerts, comedy nights, workshops and meetups.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-500 dark:text-white transition-colors cursor-pointer shrink-0"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ==================================================================
            2. SEARCH & GPS BAR
            ================================================================== */}
        <div className="p-4 sm:p-6 pb-3 border-b border-[#eef4ff] dark:border-white/10 space-y-3 bg-white dark:bg-[#0b1f4b]">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {/* Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                ref={inputRef}
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search by city (e.g. Bhopal, Indore, Bangalore, Satna...)"
                className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-[#dbe6f7] dark:border-white/15 bg-[#f6faff] dark:bg-white/5 text-sm text-[#0b1f4b] dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#0a6cf0] focus:ring-2 focus:ring-[#0a6cf0]/20 transition-all"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && filteredCities.length > 0) {
                    handleCityClick(filteredCities[0]);
                  }
                }}
              />
              {searchText && (
                <button
                  type="button"
                  onClick={() => setSearchText("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* GPS Button */}
            <button
              type="button"
              onClick={handleDetectLocation}
              disabled={detectingLocation}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0a6cf0]/10 hover:bg-[#0a6cf0]/20 text-[#0a6cf0] text-xs sm:text-sm font-bold border border-[#0a6cf0]/30 transition-all cursor-pointer whitespace-nowrap active:scale-95 disabled:opacity-60"
            >
              <Navigation
                className={`w-4 h-4 ${
                  detectingLocation ? "animate-spin text-[#0a6cf0]" : ""
                }`}
              />
              <span>
                {detectingLocation ? "Locating…" : "Current Location"}
              </span>
            </button>
          </div>

          {locationToast && (
            <div className="text-xs font-semibold text-[#0a6cf0] bg-[#f0f7ff] dark:bg-white/10 px-3 py-1.5 rounded-lg border border-[#bfdbfe] dark:border-white/10 flex items-center gap-2 animate-in fade-in duration-200">
              <Sparkles className="w-3.5 h-3.5 text-[#00e0ff]" />
              <span>{locationToast}</span>
            </div>
          )}
        </div>

        {/* ==================================================================
            3. CITIES LIST / GRID (SCROLLABLE)
            ================================================================== */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1">
          {/* SEARCH RESULTS VIEW */}
          {searchText.trim().length > 0 ? (
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Matching Cities ({filteredCities.length})
              </div>

              {filteredCities.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    No cities found matching &ldquo;{searchText}&rdquo;
                  </p>
                  <p className="text-xs text-slate-400">
                    Try searching for Bhopal, Indore, Bangalore, Satna, Mumbai, or Delhi.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {filteredCities.map((city) => {
                    const isSelected = checkIfSelected(city);
                    return (
                      <button
                        key={city.id}
                        type="button"
                        onClick={() => handleCityClick(city)}
                        className={`text-left p-3 rounded-2xl border transition-all flex items-center justify-between group cursor-pointer ${
                          isSelected
                            ? "bg-[#0a6cf0]/10 border-[#0a6cf0] shadow-sm"
                            : "bg-[#f8faff] dark:bg-white/5 border-[#eef4ff] dark:border-white/10 hover:border-[#0a6cf0]/40 hover:bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                              isSelected
                                ? "bg-[#0a6cf0] text-white"
                                : "bg-white dark:bg-white/10 text-[#0a6cf0] border border-[#dbe6f7] dark:border-white/10"
                            }`}
                          >
                            <MapPin className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-extrabold text-sm text-[#0b1f4b] dark:text-white flex items-center gap-1.5">
                              <span>{city.name}</span>
                              {city.badge && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                                  {city.badge}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              {city.state}, {city.country}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-400 dark:text-slate-400">
                            {city.eventCount}
                          </span>
                          {isSelected ? (
                            <Check className="w-4 h-4 text-[#0a6cf0]" />
                          ) : (
                            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#0a6cf0] group-hover:translate-x-0.5 transition-all" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <>
              {/* FEATURED / POPULAR CITIES (Bhopal, Indore, Bangalore, Satna...) */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs font-extrabold text-[#0b1f4b] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#0a6cf0]" />
                    <span>Popular Cities</span>
                  </div>
                  <span className="text-xs text-slate-400">
                    Tap to switch location
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {POPULAR_CITIES.map((city) => {
                    const isSelected = checkIfSelected(city);
                    return (
                      <button
                        key={city.id}
                        type="button"
                        onClick={() => handleCityClick(city)}
                        className={`text-left p-3.5 rounded-2xl border transition-all flex flex-col justify-between h-[104px] group cursor-pointer relative overflow-hidden ${
                          isSelected
                            ? "bg-gradient-to-br from-[#0a6cf0]/15 to-[#00e0ff]/10 border-[#0a6cf0] shadow-md ring-2 ring-[#0a6cf0]/30"
                            : "bg-[#f8faff] dark:bg-white/5 border-[#dbe6f7] dark:border-white/10 hover:border-[#0a6cf0] hover:bg-white dark:hover:bg-white/10 hover:shadow-md hover:-translate-y-0.5"
                        }`}
                      >
                        <div className="flex items-start justify-between w-full">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                              isSelected
                                ? "bg-[#0a6cf0] text-white shadow-sm"
                                : "bg-white dark:bg-white/10 text-[#0a6cf0] border border-[#dbe6f7] dark:border-white/10"
                            }`}
                          >
                            <MapPin className="w-4 h-4" />
                          </div>
                          {isSelected && (
                            <span className="w-5 h-5 rounded-full bg-[#0a6cf0] text-white flex items-center justify-center text-xs">
                              <Check className="w-3 h-3" />
                            </span>
                          )}
                        </div>

                        <div>
                          <div className="font-black text-sm text-[#0b1f4b] dark:text-white leading-tight">
                            {city.name}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center justify-between">
                            <span>{city.state.split(" ")[0]}</span>
                            <span className="font-semibold text-[#0a6cf0]">
                              {city.eventCount.split(" ")[0]}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* REGIONAL & NEARBY CITIES (MP & Beyond) */}
              <div>
                <div className="text-xs font-extrabold text-[#0b1f4b] dark:text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Other Major Cities</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ALL_CITY_SUGGESTIONS.filter((c) => !c.popular).map((city) => (
                    <button
                      key={city.id}
                      type="button"
                      onClick={() => handleCityClick(city)}
                      className="text-left px-3 py-2 rounded-xl border border-[#eef4ff] dark:border-white/5 bg-[#fbfdff] dark:bg-white/5 hover:bg-[#f0f7ff] dark:hover:bg-white/10 hover:border-[#bfdbfe] text-xs font-semibold text-[#0b1f4b] dark:text-white flex items-center justify-between transition-colors cursor-pointer group"
                    >
                      <span className="truncate">{city.name}</span>
                      <span className="text-[10px] text-slate-400 group-hover:text-[#0a6cf0]">
                        {city.eventCount}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* ==================================================================
            4. FOOTER NOTE
            ================================================================== */}
        <div className="p-3.5 sm:p-4 bg-[#f8faff] dark:bg-[#071330] border-t border-[#eef4ff] dark:border-white/10 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#0a6cf0]" />
            <span>Currently viewing:</span>
            <span className="font-bold text-[#0b1f4b] dark:text-white">
              {currentCity}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-xs font-bold text-[#0a6cf0] hover:underline cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}


/**
 * Hook to reactively read and update selected city anywhere across the app
 */
export function useSelectedCity(defaultCity = "Indore"): [string, (city: string) => void] {
  const [city, setCity] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("vibe_selected_city");
      if (saved && saved.trim()) return saved.trim();
    }
    return defaultCity;
  });

  useEffect(() => {
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
