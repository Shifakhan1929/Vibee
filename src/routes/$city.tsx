import { useState, useMemo, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CitySelectorModal } from "../components/CitySelectorModal";
import {
  MapPin,
  Calendar,
  Clock,
  Search,
  Heart,
  Share2,
  SlidersHorizontal,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  Ticket,
  Sparkles,
  Filter,
  X,
  Flame,
  ArrowRight,
  Compass,
  Star,
  Users,
  ExternalLink,
} from "lucide-react";

export type CitySearch = {
  q?: string;
  category?: string;
  date?: string;
};

export const Route = createFileRoute("/$city")({
  validateSearch: (search: Record<string, unknown>): CitySearch => ({
    ...(typeof search["q"] === "string" && search["q"] ? { q: search["q"] } : {}),
    ...(typeof search["category"] === "string" && search["category"] ? { category: search["category"] } : {}),
    ...(typeof search["date"] === "string" && search["date"] ? { date: search["date"] } : {}),
  }),
  head: ({ params }) => {
    const cityName = formatCityName(params.city);
    return {
      meta: [
        { title: `Events in ${cityName} – Discover Concerts, Festivals & Things to Do | AllEvents` },
        {
          name: "description",
          content: `Find the best upcoming events, concerts, workshops, and nightlife happening in ${cityName}. Book tickets and discover what's happening.`,
        },
        { property: "og:title", content: `Events in ${cityName} – AllEvents` },
        {
          property: "og:description",
          content: `Explore top events, festivals, concerts, and parties in ${cityName}.`,
        },
        { property: "og:type", content: "website" },
      ],
    };
  },
  component: CityEventsPage,
});

function formatCityName(raw: string): string {
  if (!raw) return "Your City";
  return raw
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

interface EventItem {
  id: string;
  title: string;
  category: string;
  dateStr: string;
  timeStr: string;
  dateFilter: "Today" | "Tomorrow" | "This Weekend" | "Next Week";
  venue: string;
  city: string;
  organizer: string;
  verified: boolean;
  price: string;
  isFree: boolean;
  imageUrl: string;
  interestedCount: number;
  badge?: string | undefined;
}

const CATEGORIES = [
  "All",
  "Music & Concerts",
  "Nightlife & Parties",
  "Workshops & Classes",
  "Business & Networking",
  "Festivals",
  "Food & Drinks",
  "Arts & Theatre",
  "Sports",
] as const;

const DATE_FILTERS = [
  "All Dates",
  "Today",
  "Tomorrow",
  "This Weekend",
  "Next Week",
] as const;

const POPULAR_CITIES = [
  { name: "Indore", slug: "indore", region: "MP, India" },
  { name: "Mumbai", slug: "mumbai", region: "MH, India" },
  { name: "Delhi", slug: "delhi", region: "DL, India" },
  { name: "Bangalore", slug: "bangalore", region: "KA, India" },
  { name: "London", slug: "london", region: "EN, United Kingdom" },
  { name: "New York", slug: "new-york", region: "NY, United States" },
  { name: "San Francisco", slug: "san-francisco", region: "CA, United States" },
  { name: "Dubai", slug: "dubai", region: "United Arab Emirates" },
  { name: "Pune", slug: "pune", region: "MH, India" },
  { name: "Bhopal", slug: "bhopal", region: "MP, India" },
  { name: "Satna", slug: "satna", region: "MP, India" },
  { name: "Ahmedabad", slug: "ahmedabad", region: "GJ, India" },
  { name: "Jaipur", slug: "jaipur", region: "RJ, India" },
];

function getCurrencySymbol(citySlug: string): string {
  const indianCities = [
    "indore",
    "mumbai",
    "delhi",
    "bangalore",
    "bhopal",
    "satna",
    "gwalior",
    "jabalpur",
    "rewa",
    "pune",
    "ahmedabad",
    "jaipur",
    "kolkata",
    "chennai",
    "hyderabad",
    "ujjain",
  ];
  const ukCities = ["london", "manchester", "birmingham", "edinburgh"];
  const euCities = ["paris", "berlin", "amsterdam", "madrid", "rome"];

  if (indianCities.includes(citySlug.toLowerCase())) return "₹";
  if (ukCities.includes(citySlug.toLowerCase())) return "£";
  if (euCities.includes(citySlug.toLowerCase())) return "€";
  return "$";
}

function generateEventsForCity(citySlug: string, formattedName: string): EventItem[] {
  const currency = getCurrencySymbol(citySlug);
  const isIndia = currency === "₹";
  const slug = citySlug.toLowerCase();

  // Curated database for major hub cities
  if (slug === "indore") {
    return [
      {
        id: "ind-1",
        title: "Indore Sunburn Music Festival 2026",
        category: "Music & Concerts",
        dateStr: "SAT, 14 NOV",
        timeStr: "6:00 PM",
        dateFilter: "This Weekend",
        venue: "Brilliant Convention Centre, Vijay Nagar",
        city: "Indore",
        organizer: "Sunburn Arena Live",
        verified: true,
        price: "₹999 onwards",
        isFree: false,
        imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
        interestedCount: 1420,
        badge: "Selling Fast",
      },
      {
        id: "ind-2",
        title: "Sarafa & Chhappan Midnight Food Carnival",
        category: "Food & Drinks",
        dateStr: "SUN, 15 NOV",
        timeStr: "7:30 PM",
        dateFilter: "This Weekend",
        venue: "56 Dukan Street, New Palasia",
        city: "Indore",
        organizer: "Indore Foodies Guild",
        verified: true,
        price: "Free Entry",
        isFree: true,
        imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
        interestedCount: 890,
        badge: "Popular",
      },
      {
        id: "ind-3",
        title: "Zakir Khan Live Comedy Tour – Tathastu Encore",
        category: "Arts & Theatre",
        dateStr: "FRI, 20 NOV",
        timeStr: "8:00 PM",
        dateFilter: "Next Week",
        venue: "Ravindra Natya Grah, RNT Marg",
        city: "Indore",
        organizer: "OML Comedy Nights",
        verified: true,
        price: "₹499 onwards",
        isFree: false,
        imageUrl: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&w=800&q=80",
        interestedCount: 2310,
        badge: "Almost Full",
      },
      {
        id: "ind-4",
        title: "Indore Startup Conclave & Founder Mixer",
        category: "Business & Networking",
        dateStr: "TODAY",
        timeStr: "4:00 PM",
        dateFilter: "Today",
        venue: "Workie Coworking Space, AB Road",
        city: "Indore",
        organizer: "MP Angel Network",
        verified: true,
        price: "₹299 onwards",
        isFree: false,
        imageUrl: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80",
        interestedCount: 310,
      },
      {
        id: "ind-5",
        title: "Holkar Heritage Photo Walk & Rajwada History Tour",
        category: "Workshops & Classes",
        dateStr: "TOMORROW",
        timeStr: "7:00 AM",
        dateFilter: "Tomorrow",
        venue: "Rajwada Palace Square",
        city: "Indore",
        organizer: "Indore Heritage Walks",
        verified: false,
        price: "Free Entry",
        isFree: true,
        imageUrl: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80",
        interestedCount: 420,
      },
      {
        id: "ind-6",
        title: "Bollywood Retro Night with Live Band & DJ",
        category: "Nightlife & Parties",
        dateStr: "SAT, 14 NOV",
        timeStr: "9:00 PM",
        dateFilter: "This Weekend",
        venue: "The Piano Project, Scheme 54",
        city: "Indore",
        organizer: "Vibe Club Nights",
        verified: true,
        price: "₹799 onwards",
        isFree: false,
        imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80",
        interestedCount: 960,
      },
      {
        id: "ind-7",
        title: "Indore Marathon & Half-Marathon 2026",
        category: "Sports",
        dateStr: "SUN, 22 NOV",
        timeStr: "5:30 AM",
        dateFilter: "Next Week",
        venue: "Nehru Stadium, Indore",
        city: "Indore",
        organizer: "Indore Runners Club",
        verified: true,
        price: "₹350 onwards",
        isFree: false,
        imageUrl: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=800&q=80",
        interestedCount: 1540,
        badge: "Trending",
      },
      {
        id: "ind-8",
        title: "Pottery & Clay Art Masterclass for Beginners",
        category: "Workshops & Classes",
        dateStr: "SUN, 15 NOV",
        timeStr: "11:00 AM",
        dateFilter: "This Weekend",
        venue: "The Art Loft, Anand Bazar",
        city: "Indore",
        organizer: "Mitti Craft Studio",
        verified: false,
        price: "₹650 onwards",
        isFree: false,
        imageUrl: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80",
        interestedCount: 280,
      },
    ];
  }

  if (slug === "london") {
    return [
      {
        id: "lon-1",
        title: "Coldplay – Music of the Spheres World Tour",
        category: "Music & Concerts",
        dateStr: "SAT, 14 NOV",
        timeStr: "6:30 PM GMT",
        dateFilter: "This Weekend",
        venue: "Wembley Stadium, London",
        city: "London",
        organizer: "Live Nation UK",
        verified: true,
        price: "From £75.00",
        isFree: false,
        imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
        interestedCount: 12400,
        badge: "Selling Fast",
      },
      {
        id: "lon-2",
        title: "Shoreditch Underground Electronic & Techno Night",
        category: "Nightlife & Parties",
        dateStr: "SAT, 14 NOV",
        timeStr: "10:00 PM GMT",
        dateFilter: "This Weekend",
        venue: "Fabric Nightclub, Farringdon",
        city: "London",
        organizer: "Fabric London",
        verified: true,
        price: "From £20.00",
        isFree: false,
        imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80",
        interestedCount: 3100,
        badge: "Trending",
      },
      {
        id: "lon-3",
        title: "London Tech Week Executive Summit & AI Mixer",
        category: "Business & Networking",
        dateStr: "TODAY",
        timeStr: "9:00 AM GMT",
        dateFilter: "Today",
        venue: "ExCeL London, Royal Victoria Dock",
        city: "London",
        organizer: "Informa Tech UK",
        verified: true,
        price: "Free Entry",
        isFree: true,
        imageUrl: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80",
        interestedCount: 4200,
      },
      {
        id: "lon-4",
        title: "The Phantom of the Opera – West End Performance",
        category: "Arts & Theatre",
        dateStr: "TOMORROW",
        timeStr: "7:30 PM GMT",
        dateFilter: "Tomorrow",
        venue: "His Majesty's Theatre, Haymarket",
        city: "London",
        organizer: "LW Theatres Group",
        verified: true,
        price: "From £32.50",
        isFree: false,
        imageUrl: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=800&q=80",
        interestedCount: 5600,
      },
      {
        id: "lon-5",
        title: "Borough Market Artisan Cheese & Wine Festival",
        category: "Food & Drinks",
        dateStr: "SUN, 15 NOV",
        timeStr: "12:00 PM GMT",
        dateFilter: "This Weekend",
        venue: "Borough Market, Southwark",
        city: "London",
        organizer: "London Culinary Collective",
        verified: true,
        price: "From £15.00",
        isFree: false,
        imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
        interestedCount: 2890,
      },
      {
        id: "lon-6",
        title: "Royal Parks 10k Autumn Run & Wellness Expo",
        category: "Sports",
        dateStr: "SUN, 22 NOV",
        timeStr: "8:00 AM GMT",
        dateFilter: "Next Week",
        venue: "Hyde Park, Central London",
        city: "London",
        organizer: "Royal Parks Foundation",
        verified: true,
        price: "From £24.00",
        isFree: false,
        imageUrl: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=800&q=80",
        interestedCount: 1850,
      },
    ];
  }

  // Realistic dynamic fallback generator for ANY city
  const baseVenues = isIndia
    ? [
        `${formattedName} Exhibition & Convention Grounds`,
        `Grand Mayur Hall, ${formattedName}`,
        `Central Club & Rooftop, ${formattedName}`,
        `Town Plaza Amphitheatre, ${formattedName}`,
        `${formattedName} Sports Complex`,
        `The Cultural House, ${formattedName}`,
      ]
    : [
        `${formattedName} Civic Center & Arena`,
        `The Grand Theater, ${formattedName}`,
        `Skyline Lounge & Rooftop, ${formattedName}`,
        `${formattedName} Exhibition Hall`,
        `Metro Sports Pavillion, ${formattedName}`,
        `Riverside Amphitheater, ${formattedName}`,
      ];

  const genericTitles: Array<{
    title: string;
    category: string;
    dateStr: string;
    timeStr: string;
    dateFilter: "Today" | "Tomorrow" | "This Weekend" | "Next Week";
    price: string;
    isFree: boolean;
    badge?: string;
    image: string;
  }> = [
    {
      title: `${formattedName} Acoustic Sunset Sessions & Live Indie Music`,
      category: "Music & Concerts",
      dateStr: "SAT, 14 NOV",
      timeStr: "7:00 PM",
      dateFilter: "This Weekend",
      price: isIndia ? "₹499 onwards" : "From $25.00",
      isFree: false,
      badge: "Popular",
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: `${formattedName} Food & Craft Beer Festival`,
      category: "Food & Drinks",
      dateStr: "SUN, 15 NOV",
      timeStr: "1:00 PM",
      dateFilter: "This Weekend",
      price: "Free Entry",
      isFree: true,
      badge: "Free",
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: `${formattedName} Tech Leaders & Startup Networking Summit`,
      category: "Business & Networking",
      dateStr: "TODAY",
      timeStr: "5:30 PM",
      dateFilter: "Today",
      price: isIndia ? "₹299 onwards" : "From $15.00",
      isFree: false,
      image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: `Stand-up Comedy All-Stars Night in ${formattedName}`,
      category: "Arts & Theatre",
      dateStr: "TOMORROW",
      timeStr: "8:00 PM",
      dateFilter: "Tomorrow",
      price: isIndia ? "₹399 onwards" : "From $20.00",
      isFree: false,
      badge: "Selling Fast",
      image: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: `${formattedName} City Glow 5K Fun Run & Fitness Fest`,
      category: "Sports",
      dateStr: "SUN, 22 NOV",
      timeStr: "6:30 AM",
      dateFilter: "Next Week",
      price: isIndia ? "₹199 onwards" : "From $18.00",
      isFree: false,
      image: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: `Weekend DJ Rooftop Experience & Cocktails`,
      category: "Nightlife & Parties",
      dateStr: "SAT, 14 NOV",
      timeStr: "9:30 PM",
      dateFilter: "This Weekend",
      price: isIndia ? "₹799 onwards" : "From $30.00",
      isFree: false,
      badge: "Trending",
      image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: `Hands-on Pottery, Canvas Painting & Clay Sculpting`,
      category: "Workshops & Classes",
      dateStr: "SUN, 15 NOV",
      timeStr: "11:00 AM",
      dateFilter: "This Weekend",
      price: isIndia ? "₹550 onwards" : "From $35.00",
      isFree: false,
      image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: `${formattedName} Cultural Heritage & Street Music Carnival`,
      category: "Festivals",
      dateStr: "SAT, 21 NOV",
      timeStr: "4:00 PM",
      dateFilter: "Next Week",
      price: "Free Entry",
      isFree: true,
      image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800&q=80",
    },
  ];

  return genericTitles.map((item, idx) => ({
    id: `${slug}-${idx + 1}`,
    title: item.title,
    category: item.category,
    dateStr: item.dateStr,
    timeStr: item.timeStr,
    dateFilter: item.dateFilter,
    venue: baseVenues[idx % baseVenues.length] || `${formattedName} Center`,
    city: formattedName,
    organizer: `${formattedName} Events Club`,
    verified: idx % 2 === 0,
    price: item.price,
    isFree: item.isFree,
    imageUrl: item.image,
    interestedCount: 200 + ((idx * 173) % 1800),
    badge: item.badge,
  }));
}

function CityEventsPage() {
  const { city } = Route.useParams();
  const searchParams = Route.useSearch();
  const navigate = useNavigate();

  const formattedCity = useMemo(() => formatCityName(city), [city]);

  const [searchQuery, setSearchQuery] = useState(searchParams.q ?? "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.category ?? "All");
  const [selectedDate, setSelectedDate] = useState(searchParams.date ?? "All Dates");
  const [bookmarkedIds, setBookmarkedIds] = useState<Record<string, boolean>>({});
  const [cityModalOpen, setCityModalOpen] = useState(false);
  const [modalSearchText, setModalSearchText] = useState("");

  const allEvents = useMemo(() => {
    return generateEventsForCity(city, formattedCity);
  }, [city, formattedCity]);

  // Sync state to URL search parameters
  const updateFilters = (cat: string, dt: string, q: string) => {
    const search: CitySearch = {
      ...(cat !== "All" ? { category: cat } : {}),
      ...(dt !== "All Dates" ? { date: dt } : {}),
      ...(q.trim() ? { q: q.trim() } : {}),
    };

    navigate({
      to: "/$city",
      params: { city },
      search,
      replace: true,
    });
  };

  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat);
    updateFilters(cat, selectedDate, searchQuery);
  };

  const handleDateClick = (dt: string) => {
    setSelectedDate(dt);
    updateFilters(selectedCategory, dt, searchQuery);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    updateFilters(selectedCategory, selectedDate, query);
  };

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setBookmarkedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const resetFilters = () => {
    setSelectedCategory("All");
    setSelectedDate("All Dates");
    setSearchQuery("");
    navigate({
      to: "/$city",
      params: { city },
      search: {},
      replace: true,
    });
  };

  // Filter events dynamically
  const filteredEvents = useMemo(() => {
    return allEvents.filter((ev) => {
      // Category filter
      if (selectedCategory !== "All" && ev.category !== selectedCategory) {
        return false;
      }
      // Date filter
      if (selectedDate !== "All Dates" && ev.dateFilter !== selectedDate) {
        return false;
      }
      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = ev.title.toLowerCase().includes(q);
        const matchesVenue = ev.venue.toLowerCase().includes(q);
        const matchesCategory = ev.category.toLowerCase().includes(q);
        const matchesOrganizer = ev.organizer.toLowerCase().includes(q);
        return matchesTitle || matchesVenue || matchesCategory || matchesOrganizer;
      }
      return true;
    });
  }, [allEvents, selectedCategory, selectedDate, searchQuery]);

  // Featured / Trending slice
  const featuredEvents = useMemo(() => {
    return allEvents.filter((ev) => ev.badge || ev.interestedCount > 600).slice(0, 3);
  }, [allEvents]);

  // Weekend events
  const weekendEvents = useMemo(() => {
    return allEvents.filter((ev) => ev.dateFilter === "This Weekend");
  }, [allEvents]);

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCityModalOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans antialiased">


      {/* 2. City Hero Banner */}
      <section className="relative bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0A2540] text-white py-10 sm:py-14 overflow-hidden shadow-inner">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#1565C0]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-[#0288D1]/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-1.5 text-xs text-slate-300/80 mb-4">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-400">Events</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-white font-medium">{formattedCity}</span>
          </nav>

          {/* Hero Content */}
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#38BDF8] text-xs font-medium mb-3 border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Live City Guide • {formattedCity}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3">
              Events in{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38BDF8] to-[#60A5FA]">
                {formattedCity}
              </span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 max-w-2xl">
              Find the best upcoming events, concerts, workshops, and nightlife happening in{" "}
              {formattedCity}. Book tickets, invite friends, and never miss out on the moment.
            </p>

            {/* In-Hero Search & City Quick Switch */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-2xl bg-white p-2 rounded-2xl shadow-xl">
              <div className="flex-1 flex items-center gap-2 px-3">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder={`Search events, artists, or venues in ${formattedCity}...`}
                  className="w-full py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden"
                />
                {searchQuery && (
                  <button
                    onClick={() => handleSearchChange("")}
                    className="text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 border-t sm:border-t-0 sm:border-l border-slate-200 pt-2 sm:pt-0 sm:pl-3">
                <button
                  type="button"
                  onClick={() => setCityModalOpen(true)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#1565C0]" />
                  <span>Change City</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Filter Sticky Toolbar (Category Pills + Date Tabs) */}
      <section className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          {/* Categories Horizontal Scroll */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                    active
                      ? "bg-[#1565C0] text-white shadow-xs font-semibold"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-transparent"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Date Filter Tabs + Active Counters */}
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 border-t border-slate-100 pt-2.5 mt-1 text-xs">
            <div className="flex items-center gap-4 overflow-x-auto scrollbar-none">
              {DATE_FILTERS.map((dt) => {
                const active = selectedDate === dt;
                return (
                  <button
                    key={dt}
                    onClick={() => handleDateClick(dt)}
                    className={`pb-1 font-medium transition-colors border-b-2 ${
                      active
                        ? "border-[#1565C0] text-[#1565C0] font-bold"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {dt}
                  </button>
                );
              })}
            </div>

            <div className="text-slate-500 text-xs shrink-0 pl-2">
              Showing <span className="font-bold text-slate-800">{filteredEvents.length}</span> events
            </div>
          </div>
        </div>
      </section>

      {/* 4. Main Body Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Section A: Featured / Trending Events (shown when filters are at default) */}
        {selectedCategory === "All" && selectedDate === "All Dates" && !searchQuery && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-[#E53935]" />
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  Trending in {formattedCity}
                </h2>
              </div>
              <span className="text-xs font-semibold text-[#1565C0] cursor-pointer hover:underline">
                View All Trending
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEvents.map((ev) => (
                <EventCard
                  key={ev.id}
                  event={ev}
                  isBookmarked={!!bookmarkedIds[ev.id]}
                  onToggleBookmark={(e) => toggleBookmark(ev.id, e)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Section B: Filtered Event Grid */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                {selectedCategory === "All" ? "All Events" : selectedCategory} in {formattedCity}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {selectedDate !== "All Dates" ? `Filtered by ${selectedDate} • ` : ""}
                Discover handpicked experiences happening near you
              </p>
            </div>

            {/* Active Filter Badges */}
            {(selectedCategory !== "All" || selectedDate !== "All Dates" || searchQuery) && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-slate-500">Active filters:</span>
                {selectedCategory !== "All" && (
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-blue-50 text-[#1565C0] border border-blue-200">
                    {selectedCategory}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => handleCategoryClick("All")}
                    />
                  </span>
                )}
                {selectedDate !== "All Dates" && (
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-blue-50 text-[#1565C0] border border-blue-200">
                    {selectedDate}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => handleDateClick("All Dates")}
                    />
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                    "{searchQuery}"
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => handleSearchChange("")}
                    />
                  </span>
                )}
                <button
                  onClick={resetFilters}
                  className="text-xs text-red-600 hover:underline font-semibold ml-1"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>

          {/* Grid or Empty State */}
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredEvents.map((ev) => (
                <EventCard
                  key={ev.id}
                  event={ev}
                  isBookmarked={!!bookmarkedIds[ev.id]}
                  onToggleBookmark={(e) => toggleBookmark(ev.id, e)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center max-w-lg mx-auto space-y-4 my-8">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-[#1565C0] flex items-center justify-center mx-auto">
                <Compass className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No events found</h3>
              <p className="text-sm text-slate-500">
                We couldn't find any events matching your criteria in {formattedCity}. Try clearing
                filters or exploring nearby cities.
              </p>
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1565C0] hover:bg-[#0D47A1] text-white text-xs font-semibold shadow-sm transition-all"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </section>

        {/* Section C: This Weekend Highlight (if viewing All) */}
        {selectedCategory === "All" && selectedDate === "All Dates" && weekendEvents.length > 0 && (
          <section className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
            <div className="relative z-10 space-y-4 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300 bg-amber-400/20 px-3 py-1 rounded-full border border-amber-400/30">
                Weekend Special
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold">
                Got weekend plans in {formattedCity}?
              </h2>
              <p className="text-slate-200 text-sm leading-relaxed">
                From food carnivals and comedy clubs to open-mic poetry and live music, explore the
                hottest happenings this Saturday and Sunday.
              </p>
              <button
                onClick={() => handleDateClick("This Weekend")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#1565C0] font-bold text-xs hover:bg-slate-100 transition-colors shadow-md"
              >
                <span>Explore Weekend Events</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </section>
        )}
      </main>

      {/* 5. City Chooser Modal */}
      <CitySelectorModal
        isOpen={cityModalOpen}
        onClose={() => setCityModalOpen(false)}
        activeCitySlug={city}
        onSelectCity={(selected) => {
          setCityModalOpen(false);
          navigate({ to: "/$city", params: { city: selected.slug }, search: {} });
        }}
      />

      {/* 6. Footer */}
      <footer className="mt-20 bg-[#0F172A] text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <img
                src="/site-assets/vibe-logo-light.png"
                alt="Vibe AllEvents"
                className="h-8 w-auto object-contain"
              />
              <p className="text-xs text-slate-400 leading-relaxed">
                Vibe connects you to the best concerts, festivals, nightlife, and workshops in{" "}
                {formattedCity} and 40,000+ cities worldwide.
              </p>
            </div>
            <div>
              <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3">
                Top Cities
              </h4>
              <ul className="space-y-1.5 text-xs">
                {POPULAR_CITIES.slice(0, 5).map((c) => (
                  <li key={c.slug}>
                    <Link
                      to="/$city"
                      params={{ city: c.slug }}
                      search={{}}
                      className="hover:text-white transition-colors"
                    >
                      Events in {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3">
                Categories
              </h4>
              <ul className="space-y-1.5 text-xs">
                {CATEGORIES.slice(1, 6).map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => handleCategoryClick(cat)}
                      className="hover:text-white transition-colors text-left"
                    >
                      {cat} in {formattedCity}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3">
                For Organizers
              </h4>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <a href="/create" className="hover:text-white transition-colors">
                    Post an Event in {formattedCity}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Event Ticketing & Passes
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Organizer Dashboard
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} Vibe / AllEvents Hub. Discover events happening near you.
          </div>
        </div>
      </footer>
    </div>
  );
}

// 7. Event Card Component (AllEvents specifications)
function EventCard({
  event,
  isBookmarked,
  onToggleBookmark,
}: {
  event: EventItem;
  isBookmarked: boolean;
  onToggleBookmark: (e: React.MouseEvent) => void;
}) {
  return (
    <article className="group bg-white rounded-2xl border border-[#E2E8F0] shadow-xs hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Image Container with Badges */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
        <img
          src={event.imageUrl}
          alt={event.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Category Pill Tag */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold tracking-wide">
            {event.category}
          </span>
          {event.badge && (
            <span className="px-2 py-0.5 rounded-full bg-[#E53935] text-white text-[10px] font-bold tracking-wider uppercase shadow-xs">
              {event.badge}
            </span>
          )}
        </div>

        {/* Bookmark Button */}
        <button
          onClick={onToggleBookmark}
          aria-label="Bookmark event"
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-md text-slate-700 hover:text-red-500 hover:bg-white shadow-sm transition-all"
        >
          <Heart
            className={`w-4 h-4 ${
              isBookmarked ? "fill-red-500 text-red-500" : "text-slate-700"
            }`}
          />
        </button>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          {/* Timestamp */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#E53935] tracking-wide uppercase">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              {event.dateStr} • {event.timeStr}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-slate-900 group-hover:text-[#1565C0] transition-colors line-clamp-2 leading-snug">
            {event.title}
          </h3>

          {/* Venue & Location */}
          <div className="flex items-start gap-1.5 text-xs text-slate-500 pt-0.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span className="line-clamp-1">{event.venue}</span>
          </div>

          {/* Organizer */}
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <span>By</span>
            <span className="font-medium text-slate-700 line-clamp-1">{event.organizer}</span>
            {event.verified && (
              <CheckCircle2 className="w-3.5 h-3.5 text-[#0288D1] shrink-0" />
            )}
          </div>
        </div>

        {/* Card Footer: Price & CTA */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
              Tickets
            </span>
            <span
              className={`text-xs font-bold ${
                event.isFree ? "text-emerald-600" : "text-slate-900"
              }`}
            >
              {event.price}
            </span>
          </div>

          <button className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-[#1565C0] hover:bg-[#0D47A1] text-white text-xs font-semibold shadow-xs transition-colors">
            <span>Book Tickets</span>
          </button>
        </div>
      </div>
    </article>
  );
}
