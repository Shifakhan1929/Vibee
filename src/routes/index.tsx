import { EventTypePreview } from "../components/EventTypePreview";
import { BotCreateSection } from "../components/BotCreateSection";
import { DownloadAppButton } from "../components/DownloadAppButton";
import { CitySelectorModal, useSelectedCity } from "../components/CitySelectorModal";
import { MemoriesMarquee } from "../components/MemoriesMarquee";
import { triggerPwaInstall } from "../components/AppInstallModal";
import { Download, Users, ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "../components/ui/dialog";
import { EVENT_CATEGORIES, categorySearch, citySlugForName } from "../lib/event-categories";
import responsiveCSS from "../styles/responsive.css?raw";
import capturedCSS from "../styles/captured.css?raw";
import repairCSS from "../styles/import-repairs.css?raw";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Vibe – Make plans. Make it an event." },
    { name: "description", content: "Discover exciting gatherings, create unforgettable experiences, and find your people. Whatever brings you together, there's a Vibe for it." },
    { property: "og:title", content: "Vibe – Make plans. Make it an event." },
    { property: "og:description", content: "Discover exciting gatherings, create unforgettable experiences, and find your people. Whatever brings you together, there's a Vibe for it." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  staticData: { importedDocument: { html: { "className": "fonts-loaded", "lang": "en" }, body: {  } } },
  component: Index,
});

const CITY_NAMES = ["Indore", "Bhopal", "Mumbai", "Delhi", "Bangalore", "Pune", "Ahmedabad", "Jaipur", "Hyderabad", "London", "New York", "your city"];
const OBSERVED_CITIES = [["Uppsala", "/uppsala"], ["Sundbyberg", "/sundbyberg"], ["\u00d6rebro", "/%C3%96rebro"], ["V\u00e4ster\u00e5s", "/v%C3%A4ster%C3%A5s"], ["Link\u00f6ping", "/link%C3%B6ping"], ["Online", "/online"]];
const CITY_SUGGESTIONS = [["Indore", "MP, India", "/indore?ref=cityselect"], ["Bhopal", "MP, India", "/bhopal?ref=cityselect"], ["Ujjain", "MP, India", "/ujjain?ref=cityselect"], ["Mumbai", "MH, India", "/mumbai?ref=cityselect"], ["Delhi", "DL, India", "/delhi?ref=cityselect"], ["Bangalore", "KA, India", "/bangalore?ref=cityselect"], ["Pune", "MH, India", "/pune?ref=cityselect"], ["Ahmedabad", "GJ, India", "/ahmedabad?ref=cityselect"], ["Jaipur", "RJ, India", "/jaipur?ref=cityselect"], ["London", "EN, United Kingdom", "/london?ref=cityselect"], ["London", "ON, Canada", "/london-ca?ref=cityselect"], ["New London", "CT, United States", "/new-london-ct?ref=cityselect"], ["New London", "WI, United States", "/new-london-wi?ref=cityselect"], ["Londonderry", "NI, United Kingdom", "/londonderry-ni?ref=cityselect"], ["London", "OH, United States", "/london-oh?ref=cityselect"], ["London", "KY, United States", "/london-ky?ref=cityselect"], ["East london", "EC, South Africa", "/east-london?ref=cityselect"], ["Londonderry", "NH, United States", "/londonderry-nh?ref=cityselect"], ["New London", "NH, United States", "/new-london-nh?ref=cityselect"], ["London Colney", "EN, United Kingdom", "/london-colney?ref=cityselect"], ["New London", "MN, United States", "/new-london-mn?ref=cityselect"], ["New London", "NC, United States", "/new-london-nc?ref=cityselect"], ["Londonderry", "VT, United States", "/londonderry-vt?ref=cityselect"], ["New London", "OH, United States", "/new-london-oh?ref=cityselect"], ["New London", "TX, United States", "/new-london-tx?ref=cityselect"], ["New London", "IA, United States", "/new-london-ia?ref=cityselect"], ["London", "TX, United States", "/london-tx?ref=cityselect"], ["Londonderry", "OH, United States", "/londonderry-oh?ref=cityselect"], ["South Londonderry", "VT, United States", "/south-londonberry?ref=cityselect"], ["New London", "MO, United States", "/new-london-mo?ref=cityselect"], ["South Londonberry", "VT, United States", "/south-londonberry?ref=cityselect"], ["London", "AR, United States", "/london-ar?ref=cityselect"], ["London", "WV, United States", "/london-wv?ref=cityselect"], ["London Mills", "IL, United States", "/london-mills?ref=cityselect"], ["New London", "PA, United States", "/new-london-pa?ref=cityselect"]] as const;

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useSelectedCity("Indore");
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [categoryQuery, setCategoryQuery] = useState("");
  const citySlug = citySlugForName(selectedCity);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [cityText, setCityText] = useState("");
  const opener = useRef<HTMLElement | null>(null);
  const openCity = () => {
    setSearchOpen(false);
    setMenuOpen(false);
    window.dispatchEvent(new CustomEvent("open-city-selector"));
  };
  const closePanels = () => { setCityOpen(false); setSearchOpen(false); setMenuOpen(false); opener.current?.focus(); };
  useEffect(() => {
    const scroll = () => setScrolled(window.scrollY > 80);
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") closePanels(); };
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("keydown", key); scroll();
    return () => { window.removeEventListener("scroll", scroll); window.removeEventListener("keydown", key); };
  }, []);
  useEffect(() => {
    if (!cityOpen) return;
    document.getElementById("city_select_input")?.focus();
  }, [cityOpen]);
  const topics = ["band", "workshop", "konsert", "musician", "festival", "art", "artist", "movie", "meditation", "piano", "jazz", "concert", "yoga", "fest", "class"];
  return (
    <>
      <style>{capturedCSS}</style>
      <style>{repairCSS}</style>
      <style>{responsiveCSS}</style>

      <div id="overlay">
        <div className={"\x74ransition-wrap"} />
      </div>
      <a href="#" id="prev-link">
        <div className={"nav-icon"} />
      </a>
      <a href="#" id="next-link">
        <div className={"nav-icon"} />
      </a>
      <div className={"search-parent luxury-hero-parent"} style={{ backgroundImage: "linear-gradient(135deg, rgba(8, 26, 44, 0.90) 0%, rgba(13, 44, 68, 0.85) 50%, rgba(8, 26, 44, 0.95) 100%), url(\"/site-assets/3302afdc09bd1c7f.webp\")", backgroundColor: "#081a2c", backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "center center" }}>
        <div className={"container search-child"}>
          <div className={"vibe-hero-layout"}>
            {/* 1. Headline (Desktop: Left Col / Mobile: Order 1) */}
            <div className={"vibe-hero-headline"} style={{ gridArea: "headline" }}>
              <h1
                className={"title"}
                style={{
                  fontFamily: '"Bricolage Grotesque", "Trapvoid", sans-serif',
                  fontSize: "clamp(34px, 5vw, 56px)",
                  fontWeight: 800,
                  lineHeight: 1.08,
                  letterSpacing: "-0.03em",
                  textTransform: "none",
                }}
              >
                Make plans.{" "}
                <span style={{ color: "var(--vibe-cyan, #00D2FF)", display: "block" }}>Make it an event.</span>
              </h1>
              <p className={"sub-title"} style={{ fontWeight: "normal", lineHeight: "1.5" }}>
                Discover exciting gatherings, create unforgettable experiences, and find your people. Whatever brings you together, there's a Vibe for it.
              </p>
            </div>

            {/* 2. Search Bar (Tapping opens the Location Selector Card) */}
            <div className={"vibe-hero-search"} style={{ gridArea: "search" }}>
              <div
                id="hss_bar"
                onClick={openCity}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") openCity(); }}
                style={{ cursor: "pointer" }}
              >
                <div className={"hs_search_input_box"} style={{ cursor: "pointer" }}>
                  <div className={"hs_search_icon"}>
                    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16.839 16.0751L12.4498 11.7562C13.5992 10.5074 14.3054 8.85589 14.3054 7.03859C14.3049 3.15103 11.1028 0 7.15245 0C3.20212 0 0 3.15103 0 7.03859C0 10.9261 3.20212 14.0772 7.15245 14.0772C8.85926 14.0772 10.4247 13.4868 11.6544 12.5054L16.0606 16.8414C16.2753 17.0529 16.6238 17.0529 16.8385 16.8414C17.0537 16.6299 17.0537 16.2866 16.839 16.0751ZM7.15245 12.9942C3.81004 12.9942 1.1005 10.3278 1.1005 7.03859C1.1005 3.74936 3.81004 1.08293 7.15245 1.08293C10.4949 1.08293 13.2044 3.74936 13.2044 7.03859C13.2044 10.3278 10.4949 12.9942 7.15245 12.9942Z" fill="#575C67" />
                    </svg>
                  </div>
                  <input
                    onClick={(e) => { e.stopPropagation(); openCity(); }}
                    onFocus={(e) => { e.target.blur(); openCity(); }}
                    readOnly
                    type="search"
                    name="hs_search_text"
                    placeholder="Search Events, Categories, Location..."
                    autoComplete="off"
                    className={"hs_search_text"}
                    style={{ cursor: "pointer" }}
                  />
                  <div className={"searchlocation hidden-phone"}>
                    <div id="hs_qsp_change_city_app">
                      <div className={"changecity"} style={{ cursor: "pointer", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: "6px", paddingRight: "14px" }}>
                        <div className={"divider"} style={{ color: "var(--gray-200)" }}>|</div>
                        <span className={"location_icon"} style={{ left: "12px" }}>
                          <i className={"icon-map-marker-2"} style={{ fontSize: "18px", color: "var(--gray-500)" }} />
                        </span>
                        <p className={"location_text"} style={{ fontSize: "16px", color: "var(--gray-800)", margin: "0px", textTransform: "capitalize" }}>{selectedCity}</p>
                        <span>
                          <i className={"icon-angle-down"} style={{ fontSize: "20px", color: "var(--gray-500)" }} />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={"searchlocation \x76isible-phone"}>
                  <div>
                    <span className={"city-select-action"}>
                      <span className={"icon-map-marker-2"} style={{ fontSize: "18px", color: "rgb(255, 255, 255)", marginRight: "6px", cursor: "pointer" }} />
                      <p style={{ color: "white", fontSize: "18px", margin: "0", cursor: "pointer", textTransform: "capitalize" }}>{selectedCity}</p>
                      <span className={"icon-angle-down"} style={{ fontSize: "15px", color: "rgb(255, 255, 255)", marginLeft: "6px", cursor: "pointer" }} />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3 & 4. Event Type Preview (Chips directly below search + Single animated preview card) */}
            <EventTypePreview
              onCategoryFilterPreFill={(category) => {
                setSearchText(category);
              }}
              onCardActionClick={(item) => {
                window.location.href = `/${citySlug}?q=${encodeURIComponent(item.banner)}`;
              }}
            />

            {/* 5. Hero CTA Buttons (Desktop: Left Col / Mobile: Order 5) */}
            <div className={"vibe-hero-ctas"} style={{ gridArea: "ctas" }}>
              <a href={`/${citySlug}`} className={"vibe-cta-secondary"}>
                <span>Explore {selectedCity} Events</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
        {/* Bottom Wavy Curve Transition (Matching reference image) */}
        <div className={"hero-wavy-divider"} aria-hidden="true">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className={"hero-wavy-svg"}>
            <path d="M0,60 C320,115 540,-5 820,55 C1100,115 1260,25 1440,50 L1440,120 L0,120 Z" fill="rgba(0, 224, 255, 0.16)" />
            <path d="M0,45 C280,105 460,-10 760,42 C1060,95 1240,10 1440,35 L1440,120 L0,120 Z" fill="#EEF4FF" />
          </svg>
        </div>
      </div>
      <div id="hss_bar_background_overlay" className={searchOpen ? "import-search-overlay" : ""} onClick={() => setSearchOpen(false)} />
      {/* Bot Create Section */}
      <BotCreateSection />
      <div className={"near-by-section"}>
        <div className={"fold"} style={{ paddingBottom: "30px" }}>
          <div className={"\x72ow-fluid bgstyle-0"}>
            <div className={"\x63ontainer"}>
              <div className={"head-label"} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0px" }}>
                <h2 className={"headstyle-1 acolor"}>
                  <span>Explore Cities near you</span>
                </h2>
              </div>
              <div className={"near-by-items-wrapper"}>
                <div className={"nearby-cities-grid"}><a className={"nearby-city-item track"} href="/indore" title="Events in Indore">{"\n\t\t\t\t\t\t\t\t\t\t"}<div className={"city-icon"}><i className={"icon-map-marker-2"} /></div>{"\n\t\t\t\t\t\t\t\t\t\t"}<div className={"city-info"}><span className={"city-name"}>Indore</span><span className={"city-events"}>132+ Events</span></div>{"\n\t\t\t\t\t\t\t\t\t"}</a><a className={"nearby-city-item track"} href="/chhindwara" title="Events in Chhindwara">{"\n\t\t\t\t\t\t\t\t\t\t"}<div className={"city-icon"}><i className={"icon-map-marker-2"} /></div>{"\n\t\t\t\t\t\t\t\t\t\t"}<div className={"city-info"}><span className={"city-name"}>Chhindwara</span><span className={"city-events"}>0+ Events</span></div>{"\n\t\t\t\t\t\t\t\t\t"}</a><a className={"nearby-city-item track"} href="/bhopal" title="Events in Bhopal">{"\n\t\t\t\t\t\t\t\t\t\t"}<div className={"city-icon"}><i className={"icon-map-marker-2"} /></div>{"\n\t\t\t\t\t\t\t\t\t\t"}<div className={"city-info"}><span className={"city-name"}>Bhopal</span><span className={"city-events"}>44+ Events</span></div>{"\n\t\t\t\t\t\t\t\t\t"}</a><a className={"nearby-city-item track"} href="/akola" title="Events in Akola">{"\n\t\t\t\t\t\t\t\t\t\t"}<div className={"city-icon"}><i className={"icon-map-marker-2"} /></div>{"\n\t\t\t\t\t\t\t\t\t\t"}<div className={"city-info"}><span className={"city-name"}>Akola</span><span className={"city-events"}>8+ Events</span></div>{"\n\t\t\t\t\t\t\t\t\t"}</a><a onClick={e => { e.preventDefault(); openCity(); }} className={"nearby-city-item search-city-item track"} href="#" title="Search for more cities">{"\n\t\t\t\t\t\t\t\t\t"}<div className={"city-icon search-icon"}><i className={"icon icon-search"} /></div>{"\n\t\t\t\t\t\t\t\t\t"}<div className={"city-info"}><span className={"city-name"}>Search City</span><span className={"city-events"}>30,000+ cities</span></div>{"\n\t\t\t\t\t\t\t\t"}</a></div>
              </div>
            </div>
          </div>
        </div>

      </div>
      <section className="v2-cat-list-section" aria-labelledby="most-loved-title">
        <div className="fold"><div className="row-fluid bgstyle-0"><div className="container">
          <div className="most-loved-header">
            <h2 id="most-loved-title" className="headstyle-1 acolor">{selectedCity}'s Most-Loved</h2>
            <Button variant="link" onClick={() => { setCategoryQuery(""); setCategoriesOpen(true); }}>View all <ArrowRight /></Button>
          </div>
          <div className="v2-cat-items-wrapper">
            {EVENT_CATEGORIES.slice(0, 9).map(category => (
              <Link key={category.slug} className="v2-cat-item track" to="/$city" params={{ city: citySlug }} search={categorySearch(category)} aria-label={`${category.name} events in ${selectedCity}`}>
                {"image" in category && <img src={`/site-assets/${category.image}`} alt={category.name} className="v2-cat-img" loading="lazy" />}
              </Link>
            ))}
            <Button variant="ghost" className="v2-cat-item v2-see-all-item track" onClick={() => { setCategoryQuery(""); setCategoriesOpen(true); }} aria-label="Explore all categories">
              <img src="/site-assets/9117ecf9f3919d0f.webp" alt="All Categories" className="v2-cat-img" loading="lazy" />
            </Button>
          </div>
        </div></div></div>
      </section>
      <Dialog open={categoriesOpen} onOpenChange={setCategoriesOpen}>
        <DialogContent className="category-dialog">
          <DialogTitle>Explore categories in {selectedCity}</DialogTitle>
          <DialogDescription className="sr-only">Choose an event category</DialogDescription>
          <input className="category-search" aria-label="Search categories" placeholder="Search categories" value={categoryQuery} onChange={e => setCategoryQuery(e.target.value)} />
          <div className="category-dialog-grid">
            {EVENT_CATEGORIES.filter(c => c.name.toLowerCase().includes(categoryQuery.toLowerCase())).map(category => (
              <Link key={category.slug} to="/$city" params={{ city: citySlug }} search={categorySearch(category)} onClick={() => setCategoriesOpen(false)} className="category-dialog-item">
                {"image" in category ? <img src={`/site-assets/${category.image}`} alt="" /> : <Sparkles className="category-symbol" />}
                <span>{category.name}</span><ArrowRight className="category-arrow" />
              </Link>
            ))}
          </div>
          {!EVENT_CATEGORIES.some(c => c.name.toLowerCase().includes(categoryQuery.toLowerCase())) && <p role="status">No matching categories</p>}
        </DialogContent>
      </Dialog>
      <div id="home-popular-event-section" className={"homepopulareventsection fold events-loaded"}>
        <div id="show_popular_section" className={"\x63ontainer hpe-container"}>
          <div className={"head-label"}>
            <h2 className={"headstyle-1"}>Popular Events in Indore</h2>
            <div className={"ue-tabs-wrapper"}>
              <div className={"ue-tabs"}>
                <div className={"ue-option active"}>All</div>
                <div className={"ue-option"}>This Month</div>
              </div>
            </div>
          </div>
          <div id="eh-1583567021">
            <ul className={"event-card-parent event-card-scrollable show4card"}>
              <li className={"event-card event-card-link"}>
                <div className={"banner-cont"}>
                  <img alt="Indore Grand Cultural Festival" className={"banner-img"} data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czMvYmFubmVycy9hZWYxODFlOTRkMjM0Y2IyNzM5MGI2ZWIyZmFkZTEwMzFmNzQzYmM3NWM3ZWU3Y2UyYjlkODNhYWJkZGI2M2U2LXJpbWctdzEyMDAtaDEwMDItZGNmOGY4ZjgtZ21pcj92PTE3ODcxOTYxNTE.avif" src="/site-assets/13e8d321b8e3c021.avif" {...({ lazy: "loaded" } as any)} />
                  <div className={"ellipsis-btn-join-event"}>
                    <div className={"dropdown pull-right"}>
                      <div className={"interest-animate"} />
                      <div className={"interest-animate"} />
                      <div className={"interest-animate"} />
                      <div className={"interest-animate"} />
                      <div className={"interest-animate"} />
                      <div className={"interest-animate"} />
                      <div className={"interest-animate"} />
                      <i className={"track icon-star-empty event-interested-action"} title="I am interested" />
                    </div>
                  </div>
                </div>
                <div className={"meta"}>
                  <div className={"meta-top"}>
                    <div className={"meta-top-info"} style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
                      <div className={"date"} style={{ fontSize: "13px", fontWeight: "400", color: "var(--gray-500)", marginRight: "10px", textTransform: "capitalize" }}>Fri, 04 Dec • 03:00 PM</div>
                    </div>
                  </div>
                  <div className={"meta-middle"}>
                    <div className={"title"} style={{ overflowWrap: "break-word" }}>
                      <a href="/indore/indore-tree-lighting-celebration/200029773097221" target="_blank" title="Indore Grand Cultural Festival">
                        <h3>Indore Grand Cultural Festival</h3>
                      </a>
                    </div>
                    <div className={"location"} style={{ marginBottom: "12px", fontSize: "13px", fontWeight: "400", color: "var(--gray-500)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", textTransform: "capitalize" }}>Rajwada, Indore</div>
                  </div>
                  <div className={"meta-bottom"}>
                    <div className={"interested-container"}>
                      <div className={"interested"}>
                        <span>199+ Interested</span>
                      </div>
                      <div className={"price-container"} />
                    </div>
                  </div>
                </div>
              </li>
              <li className={"event-card event-card-link"}>
                <div className={"banner-cont"}>
                  <img alt="2026 HAC Turkey Day 5k" className={"banner-img"} data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czEvYmFubmVycy81NWU2MWVmMGYxMmE4ZjAwZWUwNDk4NTQwZGU3M2ExYjIyMmQ5ZDk0NDgzN2VhY2YzY2Q4ZDMzNTU0YjY3NTBlLXJpbWctdzEyMDAtaDYwMC1kY2Y4ZjhmOC1nbWlyLmpwZz92PTE3OTA2ODUwNzM.avif" src="/site-assets/99fde05723294869.avif" {...({ lazy: "loaded" } as any)} />
                  <span title="This is a Featured Event!" className={"c-ribbon"}>Featured<img src="/site-assets/54dd5f5849389eac-7a1d92052d0cc2833945d9ba7d9fa55b.png" className={"label_img"} alt="Featured icon " /></span>
                  <div className={"ellipsis-btn-join-event"}>
                    <div className={"dropdown pull-right"}>
                      <div className={"interest-animate"} />
                      <div className={"interest-animate"} />
                      <div className={"interest-animate"} />
                      <div className={"interest-animate"} />
                      <div className={"interest-animate"} />
                      <div className={"interest-animate"} />
                      <div className={"interest-animate"} />
                      <i className={"track icon-star-empty event-interested-action"} title="I am interested" />
                    </div>
                  </div>
                </div>
                <div className={"meta"}>
                  <div className={"meta-top"}>
                    <div className={"meta-top-info"} style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
                      <div className={"date"} style={{ fontSize: "13px", fontWeight: "400", color: "var(--gray-500)", marginRight: "10px", textTransform: "capitalize" }}>Thu, 26 Nov • 09:00 AM</div>
                    </div>
                  </div>
                  <div className={"meta-middle"}>
                    <div className={"title"} style={{ overflowWrap: "break-word" }}>
                      <a href="/indore/2026-hac-turkey-day-5k/100002002168621243" target="_blank" title="2026 HAC Turkey Day 5k">
                        <h3>2026 HAC Turkey Day 5k</h3>
                      </a>
                    </div>
                    <div className={"location"} style={{ marginBottom: "12px", fontSize: "13px", fontWeight: "400", color: "var(--gray-500)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", textTransform: "capitalize" }}>Oxbow Trail</div>
                  </div>
                  <div className={"meta-bottom"}>
                    <div className={"interested-container"}>
                      <div className={"price-container"}>
                        <div>
                          <span className={"price"}><i className={"icon icon-ticket-empty"} /> Free </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li className={"event-card event-card-link"}>
                <div className={"banner-cont"}>
                  <img alt="Indore Live Music Fest" className={"banner-img"} data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czMvYmFubmVycy9hOGNjOTc2MC03NWNhLTExZjEtYTZlZC01MTQ2YTg3MTNmN2ItcmltZy13MTIwMC1oNjc1LWRjZmZmZmZmLWdtaXIud2VicD92PTE3ODI5NjQ4NzA.avif" src="/site-assets/abbeb51a8097f0c7.avif" {...({ lazy: "loaded" } as any)} />
                  <div className={"ellipsis-btn-join-event"}>
                    <div className={"dropdown pull-right"}>
                      <div className={"interest-animate"} />
                      <div className={"interest-animate"} />
                      <div className={"interest-animate"} />
                      <div className={"interest-animate"} />
                      <div className={"interest-animate"} />
                      <div className={"interest-animate"} />
                      <div className={"interest-animate"} />
                      <i className={"track icon-star-empty event-interested-action"} title="I am interested" />
                    </div>
                  </div>
                </div>
                <div className={"meta"}>
                  <div className={"meta-top"}>
                    <div className={"meta-top-info"} style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
                      <div className={"date"} style={{ fontSize: "13px", fontWeight: "400", color: "var(--gray-500)", marginRight: "10px", textTransform: "capitalize" }}>Sun, 08 Nov • 06:00 PM</div>
                    </div>
                  </div>
                  <div className={"meta-middle"}>
                    <div className={"title"} style={{ overflowWrap: "break-word" }}>
                      <a href="/indore/liberty-quartet-in-indore/3300030341334010" target="_blank" title="Indore Live Music Fest">
                        <h3>Indore Live Music Fest</h3>
                      </a>
                    </div>
                    <div className={"location"} style={{ marginBottom: "12px", fontSize: "13px", fontWeight: "400", color: "var(--gray-500)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", textTransform: "capitalize" }}>Indore Nazarene Church</div>
                  </div>
                  <div className={"meta-bottom"}>
                    <div className={"interested-container"}>
                      <div className={"price-container"} />
                    </div>
                  </div>
                </div>
              </li>
              <li className={"event-card event-card-link"}>
                <div className={"banner-cont"}>
                  <img alt="Crafting After  Hours" className={"banner-img"} data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czIvYmFubmVycy9jNjhjZjM1YTg0ODNmYTlhYjMxNTkwZGI5ZjFmY2U1ZTM5MTYwN2M0MGQzMGIzMTQxMmYzZDZiOTMxYTg1OTQxLXJpbWctdzEyMDAtaDExMzQtZGNkOGQ4ZDgtZ21pci5qcGc_dj0xNzkzNTkyMDY0.avif" src="/site-assets/1cf5c81698deafb2.avif" {...({ lazy: "loaded" } as any)} />
                  <div className={"ellipsis-btn-join-event"}>
                    <div className={"dropdown pull-right"}>
                      <div className={"interest-animate"} />
                      <div className={"interest-animate"} />
                      <div className={"interest-animate"} />
                      <div className={"interest-animate"} />
                      <div className={"interest-animate"} />
                      <div className={"interest-animate"} />
                      <div className={"interest-animate"} />
                      <i className={"track icon-star-empty event-interested-action"} title="I am interested" />
                    </div>
                  </div>
                </div>
                <div className={"meta"}>
                  <div className={"meta-top"}>
                    <div className={"meta-top-info"} style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
                      <div className={"date"} style={{ fontSize: "13px", fontWeight: "400", color: "var(--gray-500)", marginRight: "10px", textTransform: "capitalize" }}>Fri, 04 Dec • 06:00 PM</div>
                    </div>
                  </div>
                  <div className={"meta-middle"}>
                    <div className={"title"} style={{ overflowWrap: "break-word" }}>
                      <a href="/indore/crafting-after-hours/100002004196624054" target="_blank" title="Crafting After  Hours">
                        <h3>Crafting After  Hours</h3>
                      </a>
                    </div>
                    <div className={"location"} style={{ marginBottom: "12px", fontSize: "13px", fontWeight: "400", color: "var(--gray-500)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", textTransform: "capitalize" }}>Hortencia by Alondras Sweets LLC</div>
                  </div>
                  <div className={"meta-bottom"}>
                    <div className={"interested-container"}>
                      <div className={"price-container"}>
                        <div>
                          <span className={"price"}><i className={"icon icon-ticket-empty"} />
                                              USD 49
                                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li className={"event-card event-card-link"}>
                <div className={"banner-cont"}>
                  <img alt="Evening with the Author: Luzy D. King" className={"banner-img"} data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czUvYmFubmVycy81ZmQwYWJiMDExODEyNzcyNWNiNWM5NjA4NjRmMDg0ZWVkYmY0NWE5MWIwOTA5ZTAzOGZiNjhkNzdjZGM1M2UzLXJpbWctdzEyMDAtaDU4MS1kY2Y4ZjhmOC1nbWlyP3Y9MTc5Mjk3NDgzMg.avif" src="/site-assets/db774062878de124.avif" {...({ lazy: "loaded" } as any)} />
                  <div className={"ellipsis-btn-join-event"}>
                    <div className={"dropdown pull-right"}>
                      <div className={"interest-animate"} />
                      <div className={"interest-animate"} />
                      <div className={"interest-animate"} />
                      <div className={"interest-animate"} />
                      <div className={"interest-animate"} />
                      <div className={"interest-animate"} />
                      <div className={"interest-animate"} />
                      <i className={"track icon-star-empty event-interested-action"} title="I am interested" />
                    </div>
                  </div>
                </div>
                <div className={"meta"}>
                  <div className={"meta-top"}>
                    <div className={"meta-top-info"} style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
                      <div className={"date"} style={{ fontSize: "13px", fontWeight: "400", color: "var(--gray-500)", marginRight: "10px", textTransform: "capitalize" }}>Tue, 10 Nov • 06:30 PM</div>
                    </div>
                  </div>
                  <div className={"meta-middle"}>
                    <div className={"title"} style={{ overflowWrap: "break-word" }}>
                      <a href="/indore/evening-with-the-author-luzy-d-king/200030912531952" target="_blank" title="Evening with the Author: Luzy D. King">
                        <h3>Evening with the Author: Luzy D. King</h3>
                      </a>
                    </div>
                    <div className={"location"} style={{ marginBottom: "12px", fontSize: "13px", fontWeight: "400", color: "var(--gray-500)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", textTransform: "capitalize" }}>1000 S. Hwy 395 Ste. C, Indore, OR, United States, Oregon 97838</div>
                  </div>
                  <div className={"meta-bottom"}>
                    <div className={"interested-container"}>
                      <div className={"interested"}>
                        <span>30+ Interested</span>
                      </div>
                      <div className={"price-container"} />
                    </div>
                  </div>
                </div>
              </li>
              <li className={"event-card event-card-link"}>
                <div className={"banner-cont"}>
                  <img alt="Bookminders - The God of the Woods" className={"banner-img"} data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czUvYmFubmVycy8xYWJlYjdkMGFmMzNmYmRjZTgyNmFlNWFmZTUyODQ1ZmIyYTAyNzA0ZDdhOGMwODllNmE2MjQ3N2RiYmZiYjVkLXJpbWctdzEwODAtaDEwODAtZGNkOGU4ZjgtZ21pcj92PTE3OTEwNDIxNzY.avif" src="/site-assets/774b998c693df4ae.avif" {...({ lazy: "loaded" } as any)} />
                  <div className={"ellipsis-btn-join-event"}>
                    <div className={"dropdown pull-right"}>
                      <div className={"interest-animate"} />
                      <div className={"interest-animate"} />
                      <div className={"interest-animate"} />
                      <div className={"interest-animate"} />
                      <div className={"interest-animate"} />
                      <div className={"interest-animate"} />
                      <div className={"interest-animate"} />
                      <i className={"track icon-star-empty event-interested-action"} title="I am interested" />
                    </div>
                  </div>
                </div>
                <div className={"meta"}>
                  <div className={"meta-top"}>
                    <div className={"meta-top-info"} style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
                      <div className={"date"} style={{ fontSize: "13px", fontWeight: "400", color: "var(--gray-500)", marginRight: "10px", textTransform: "capitalize" }}>Thu, 05 Nov • 05:30 PM</div>
                    </div>
                  </div>
                  <div className={"meta-middle"}>
                    <div className={"title"} style={{ overflowWrap: "break-word" }}>
                      <a href="/indore/bookminders-the-god-of-the-woods/200030766464256" target="_blank" title="Bookminders - The God of the Woods">
                        <h3>Bookminders - The God of the Woods</h3>
                      </a>
                    </div>
                    <div className={"location"} style={{ marginBottom: "12px", fontSize: "13px", fontWeight: "400", color: "var(--gray-500)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", textTransform: "capitalize" }}>235 E Gladys Ave, Indore, OR, United States, Oregon 97838</div>
                  </div>
                  <div className={"meta-bottom"}>
                    <div className={"interested-container"}>
                      <div className={"interested"}>
                        <span>5+ Interested</span>
                      </div>
                      <div className={"price-container"} />
                    </div>
                  </div>
                </div>
              </li>
              <li className={"event-card event-card-link"}>
                <div className={"banner-cont"}>
                  <img alt="DVES Parent Club Meeting - November" className={"banner-img"} data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czQvYmFubmVycy9mOTQzZmJhYmYxNTg2Y2RjMjM2OWU0Nzg1YWRhYzAxODNiNjFjOTZhZTQ1MThlNWU4OGIzYjUzYzg5NGFhYTk4LXJpbWctdzg3NC1oNjU1LWRjZjhmOGY4LWdtaXI_dj0xNzkxMTM2ODQ1.avif" src="/site-assets/f9d9febbaa593b8b.avif" {...({ lazy: "loaded" } as any)} />
                  <div className={"ellipsis-btn-join-event"}>
                    <div className={"dropdown pull-right"}>
                      <div className={"interest-animate"} />
                      <div className={"interest-animate"} />
                      <div className={"interest-animate"} />
                      <div className={"interest-animate"} />
                      <div className={"interest-animate"} />
                      <div className={"interest-animate"} />
                      <div className={"interest-animate"} />
                      <i className={"track icon-star-empty event-interested-action"} title="I am interested" />
                    </div>
                  </div>
                </div>
                <div className={"meta"}>
                  <div className={"meta-top"}>
                    <div className={"meta-top-info"} style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
                      <div className={"date"} style={{ fontSize: "13px", fontWeight: "400", color: "var(--gray-500)", marginRight: "10px", textTransform: "capitalize" }}>Tue, 17 Nov • 05:30 PM</div>
                    </div>
                  </div>
                  <div className={"meta-middle"}>
                    <div className={"title"} style={{ overflowWrap: "break-word" }}>
                      <a href="/indore/dves-parent-club-meeting-november/200030774912045" target="_blank" title="DVES Parent Club Meeting - November">
                        <h3>DVES Parent Club Meeting - November</h3>
                      </a>
                    </div>
                    <div className={"location"} style={{ marginBottom: "12px", fontSize: "13px", fontWeight: "400", color: "var(--gray-500)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", textTransform: "capitalize" }}>1225 SW 9th St, Indore, OR, United States, Oregon 97838</div>
                  </div>
                  <div className={"meta-bottom"}>
                    <div className={"interested-container"}>
                      <div className={"price-container"} />
                    </div>
                  </div>
                </div>
              </li>
              <li className={"event-card event-card-link"}>
                <div className={"banner-cont"}>
                  <img alt="Christmas Market at the Farm 🎄" className={"banner-img"} data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czgvYmFubmVycy81YTg4NDMxZWMxNDlmZTQ0NjdkNTRhZmNiZjJiZWExOTAyYzc0N2JiMTEwOTBkYWU3MjUzYjY5ZDIzYzRhMzYzLXJpbWctdzEwMjQtaDE1MzYtZGNlOGQ4ZDgtZ21pcj92PTE3OTE4NjEzNDY.avif" src="/site-assets/d3a2a52d6ed84564.avif" {...({ lazy: "loaded" } as any)} />
                  <div className={"ellipsis-btn-join-event"}>
                    <div className={"dropdown pull-right"}>
                      <div className={"interest-animate"} />
                      <div className={"interest-animate"} />
                      <div className={"interest-animate"} />
                      <div className={"interest-animate"} />
                      <div className={"interest-animate"} />
                      <div className={"interest-animate"} />
                      <div className={"interest-animate"} />
                      <i className={"track icon-star-empty event-interested-action"} title="I am interested" />
                    </div>
                  </div>
                </div>
                <div className={"meta"}>
                  <div className={"meta-top"}>
                    <div className={"meta-top-info"} style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
                      <div className={"date"} style={{ fontSize: "13px", fontWeight: "400", color: "var(--gray-500)", marginRight: "10px", textTransform: "capitalize" }}>Sat, 12 Dec • 09:00 AM</div>
                    </div>
                  </div>
                  <div className={"meta-middle"}>
                    <div className={"title"} style={{ overflowWrap: "break-word" }}>
                      <a href="/indore/christmas-market-at-the-farm/200030828051546" target="_blank" title="Christmas Market at the Farm 🎄">
                        <h3>Christmas Market at the Farm 🎄</h3>
                      </a>
                    </div>
                    <div className={"location"} style={{ marginBottom: "12px", fontSize: "13px", fontWeight: "400", color: "var(--gray-500)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", textTransform: "capitalize" }}>Walchli Farms</div>
                  </div>
                  <div className={"meta-bottom"}>
                    <div className={"interested-container"}>
                      <div className={"price-container"} />
                    </div>
                  </div>
                </div>
              </li>
            </ul>
            <div className={"w100 \x74ext-center hp_view_more_btn_block"}>
              <a className={"tltp skyload white hp_view_more_btn"} href="/indore?ref=home-page" title="View All events  in Indore"> View all events in Indore</a>
            </div>
          </div>
        </div>

      </div>
      <div className={"\x72ow-fluid fold-top popular-event-country-section"}>
        <div className={"\x63ontainer"}>
          <div>
            <div className={"head-label"}>
              <h2 className={"headstyle-1"}>Trending Events in India</h2>
            </div>
            <ul className={"event-card-parent event-card-scrollable show4card"}>
              <li className={"event-card event-card-link"}>
                <div className={"banner-cont php-banner-cont lazy"} style={{ display: "block", backgroundImage: "url(\"/site-assets/ad625f9a96e16d2a.avif\")" }}>
                  <span className={"c-ribbon"}>Editor's pick<img src="/site-assets/27b8a2a045167b74-e9ff578dcb3a601d7a54c10d09812a06.png" className={"label_img"} alt="Editor pick featured" /></span>
                  <div className={"ellipsis-btn-join-event"}>
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <i className={"track icon-star-empty event-interested-action"} title="I'm interested" />
                  </div>
                </div>
                <div className={"meta"}>
                  <div className={"meta-top"}>
                    <div className={"meta-top-info"} style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
                      <div className={"date"} style={{ fontSize: "13px", fontWeight: "400", color: "var(--gray-500)", marginRight: "10px", textTransform: "capitalize" }}>
      													Sun, 08 Nov • 01:00 PM											</div>
                    </div>
                  </div>
                  <div className={"meta-middle"}>
                    <div className={"title"} style={{ overflowWrap: "break-word" }}>
                      <a href="/dallas/coraline-theme-market-tickets/80002837672533?ref=hpp-event-country" target="_blank" title="CORALINE THEME MARKET">
                        <h3>
      							CORALINE THEME MARKET						</h3>
                      </a>
                    </div>
                    <div className={"location dotdotted"} style={{ fontSize: "14px", lineHeight: "21px", fontWeight: "400", color: "var(--gray-500)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: "12px" }}>
      											SHOPS AT REDBIRD									</div>
                  </div>
                  <div className={"meta-bottom"}>
                    <div className={"interested-container"} style={{ display: "flex", alignItems: "center" }}>
                      <div className={"interested"}>
                        <span>174+ Interested</span>
                      </div>
                    </div>
                    <div className={"divider"} style={{ fontSize: "13px", fontWeight: "400", color: "var(--gray-300)", margin: "0px 10px" }}>|</div>
                    <div className={"price-container"}>
                      <div className={"price"} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><i className={"icon icon-ticket-empty"} style={{ fontSize: "14px", color: "var(--gray-700)" }} /><span>Free</span></div>
                    </div>
                  </div>
                </div>
              </li>
              <li className={"event-card event-card-link"}>
                <div className={"banner-cont php-banner-cont lazy"} style={{ display: "block", backgroundImage: "url(\"/site-assets/3f21b5f4be5bd627.avif\")" }}>
                  <div className={"ellipsis-btn-join-event"}>
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <i className={"track icon-star-empty event-interested-action"} title="I'm interested" />
                  </div>
                </div>
                <div className={"meta"}>
                  <div className={"meta-top"}>
                    <div className={"meta-top-info"} style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
                      <div className={"date"} style={{ fontSize: "13px", fontWeight: "400", color: "var(--gray-500)", marginRight: "10px", textTransform: "capitalize" }}>
      													Sat, 07 Nov • 02:30 PM											</div>
                    </div>
                  </div>
                  <div className={"meta-middle"}>
                    <div className={"title"} style={{ overflowWrap: "break-word" }}>
                      <a href="/gainesville/panchakanya-legends-of-courage-grace-and-destiny-tickets/80001734843998?ref=hpp-event-country" target="_blank" title="Panchakanya - Legends of Courage Grace and Destiny">
                        <h3>
      							Panchakanya - Legends of Courage, Grace and Destiny						</h3>
                      </a>
                    </div>
                    <div className={"location dotdotted"} style={{ fontSize: "14px", lineHeight: "21px", fontWeight: "400", color: "var(--gray-500)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: "12px" }}>
      											East Forsyth High School									</div>
                  </div>
                  <div className={"meta-bottom"}>
                    <div className={"interested-container"} style={{ display: "flex", alignItems: "center" }}>
                      <div className={"interested"}>
                        <span>80+ Interested</span>
                      </div>
                    </div>
                    <div className={"divider"} style={{ fontSize: "13px", fontWeight: "400", color: "var(--gray-300)", margin: "0px 10px" }}>|</div>
                    <div className={"price-container"}>
                      <span className={"price"} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>{"\n\t\t\t\t\t\t\t\t\t\t"}<i className={"icon icon-ticket-empty"} style={{ fontSize: "14px", color: "var(--gray-700)" }} />{"\n\t\t\t\t\t\t\t\t\t\t"}<span>
      											USD 25										</span>{"\n\t\t\t\t\t\t\t\t\t"}</span>
                    </div>
                  </div>
                </div>
              </li>
              <li className={"event-card event-card-link"}>
                <div className={"banner-cont php-banner-cont lazy"} style={{ display: "block", backgroundImage: "url(\"/site-assets/e813055766f2a93d.avif\")" }}>
                  <span className={"c-ribbon"}>Featured<img src="/site-assets/54dd5f5849389eac-7a1d92052d0cc2833945d9ba7d9fa55b.png" className={"label_img"} alt="Featured icon " /></span>
                  <div className={"ellipsis-btn-join-event"}>
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <i className={"track icon-star-empty event-interested-action"} title="I'm interested" />
                  </div>
                </div>
                <div className={"meta"}>
                  <div className={"meta-top"}>
                    <div className={"meta-top-info"} style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
                      <div className={"date"} style={{ fontSize: "13px", fontWeight: "400", color: "var(--gray-500)", marginRight: "10px", textTransform: "capitalize" }}>
      													Sat, 21 Nov • 07:00 PM											</div>
                    </div>
                  </div>
                  <div className={"meta-middle"}>
                    <div className={"title"} style={{ overflowWrap: "break-word" }}>
                      <a href="/naperville/ghayal-by-pranit-more-chicago-tickets/80001861211508?ref=hpp-event-country" target="_blank" title="Ghayal by Pranit More - Chicago">
                        <h3>
      							Ghayal by Pranit More - Chicago						</h3>
                      </a>
                    </div>
                    <div className={"location dotdotted"} style={{ fontSize: "14px", lineHeight: "21px", fontWeight: "400", color: "var(--gray-500)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: "12px" }}>
      											Yellow Box									</div>
                  </div>
                  <div className={"meta-bottom"}>
                    <div className={"interested-container"} style={{ display: "flex", alignItems: "center" }}>
                      <div className={"interested"}>
                        <span>68+ Interested</span>
                      </div>
                    </div>
                    <div className={"divider"} style={{ fontSize: "13px", fontWeight: "400", color: "var(--gray-300)", margin: "0px 10px" }}>|</div>
                    <div className={"price-container"}>
                      <span className={"price"} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>{"\n\t\t\t\t\t\t\t\t\t\t"}<i className={"icon icon-ticket-empty"} style={{ fontSize: "14px", color: "var(--gray-700)" }} />{"\n\t\t\t\t\t\t\t\t\t\t"}<span>
      											USD 40										</span>{"\n\t\t\t\t\t\t\t\t\t"}</span>
                    </div>
                  </div>
                </div>
              </li>
              <li className={"event-card event-card-link"}>
                <div className={"banner-cont php-banner-cont lazy"} style={{ display: "block", backgroundImage: "url(\"/site-assets/c5b1efbe6f1c6fc1.avif\")" }}>
                  <span className={"c-ribbon"}>Editor's pick<img src="/site-assets/27b8a2a045167b74-e9ff578dcb3a601d7a54c10d09812a06.png" className={"label_img"} alt="Editor pick featured" /></span>
                  <div className={"ellipsis-btn-join-event"}>
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <i className={"track icon-star-empty event-interested-action"} title="I'm interested" />
                  </div>
                </div>
                <div className={"meta"}>
                  <div className={"meta-top"}>
                    <div className={"meta-top-info"} style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
                      <div className={"date"} style={{ fontSize: "13px", fontWeight: "400", color: "var(--gray-500)", marginRight: "10px", textTransform: "capitalize" }}>
      													Sat, 28 Nov • 12:00 PM											</div>
                    </div>
                  </div>
                  <div className={"meta-middle"}>
                    <div className={"title"} style={{ overflowWrap: "break-word" }}>
                      <a href="/austin/huge-holiday-market-meet-the-grinch-shop-small-tickets/80003283463164?ref=hpp-event-country" target="_blank" title="Huge Holiday Market - Meet The Grinch - Shop Small">
                        <h3>
      							Huge Holiday Market - Meet The Grinch - Shop Small						</h3>
                      </a>
                    </div>
                    <div className={"location dotdotted"} style={{ fontSize: "14px", lineHeight: "21px", fontWeight: "400", color: "var(--gray-500)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: "12px" }}>
      											Palmer Events Center									</div>
                  </div>
                  <div className={"meta-bottom"}>
                    <div className={"interested-container"} style={{ display: "flex", alignItems: "center" }}>
                      <div className={"interested"}>
                        <span>4+ Interested</span>
                      </div>
                    </div>
                    <div className={"divider"} style={{ fontSize: "13px", fontWeight: "400", color: "var(--gray-300)", margin: "0px 10px" }}>|</div>
                    <div className={"price-container"}>
                      <span className={"price"} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>{"\n\t\t\t\t\t\t\t\t\t\t"}<i className={"icon icon-ticket-empty"} style={{ fontSize: "14px", color: "var(--gray-700)" }} />{"\n\t\t\t\t\t\t\t\t\t\t"}<span>
      											USD 10										</span>{"\n\t\t\t\t\t\t\t\t\t"}</span>
                    </div>
                  </div>
                </div>
              </li>
              <li className={"event-card event-card-link"}>
                <div className={"banner-cont php-banner-cont lazy"} style={{ display: "block", backgroundImage: "url(\"/site-assets/2498412167fcb1ab.avif\")" }}>
                  <div className={"ellipsis-btn-join-event"}>
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <i className={"track icon-star-empty event-interested-action"} title="I'm interested" />
                  </div>
                </div>
                <div className={"meta"}>
                  <div className={"meta-top"}>
                    <div className={"meta-top-info"} style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
                      <div className={"date"} style={{ fontSize: "13px", fontWeight: "400", color: "var(--gray-500)", marginRight: "10px", textTransform: "capitalize" }}>
      													Sat, 14 Nov • 11:00 AM											</div>
                    </div>
                  </div>
                  <div className={"meta-middle"}>
                    <div className={"title"} style={{ overflowWrap: "break-word" }}>
                      <a href="/medina/seasonal-market-at-weymouth-country-club-tickets/80002705064287?ref=hpp-event-country" target="_blank" title="Seasonal Market at Weymouth Country Club">
                        <h3>
      							Seasonal Market at Weymouth Country Club						</h3>
                      </a>
                    </div>
                    <div className={"location dotdotted"} style={{ fontSize: "14px", lineHeight: "21px", fontWeight: "400", color: "var(--gray-500)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: "12px" }}>
      											Weymouth Country Club									</div>
                  </div>
                  <div className={"meta-bottom"}>
                    <div className={"interested-container"} style={{ display: "flex", alignItems: "center" }}>
                      <div className={"interested"}>
                        <span>9+ Interested</span>
                      </div>
                    </div>
                    <div className={"divider"} style={{ fontSize: "13px", fontWeight: "400", color: "var(--gray-300)", margin: "0px 10px" }}>|</div>
                    <div className={"price-container"}>
                      <div className={"price"} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><i className={"icon icon-ticket-empty"} style={{ fontSize: "14px", color: "var(--gray-700)" }} /><span>Free</span></div>
                    </div>
                  </div>
                </div>
              </li>
              <li className={"event-card event-card-link"}>
                <div className={"banner-cont php-banner-cont lazy"} style={{ display: "block", backgroundImage: "url(\"/site-assets/13a03db63ae7eb66.avif\")" }}>
                  <div className={"ellipsis-btn-join-event"}>
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <i className={"track icon-star-empty event-interested-action"} title="I'm interested" />
                  </div>
                </div>
                <div className={"meta"}>
                  <div className={"meta-top"}>
                    <div className={"meta-top-info"} style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
                      <div className={"date"} style={{ fontSize: "13px", fontWeight: "400", color: "var(--gray-500)", marginRight: "10px", textTransform: "capitalize" }}>
      													Sat, 05 Dec • 08:00 AM + 3 more											</div>
                    </div>
                  </div>
                  <div className={"meta-middle"}>
                    <div className={"title"} style={{ overflowWrap: "break-word" }}>
                      <a href="/olympia/leavenworth-snow-bus-tickets/80002251584264?ref=hpp-event-country" target="_blank" title="LEAVENWORTH SNOW BUS">
                        <h3>
      							LEAVENWORTH SNOW BUS						</h3>
                      </a>
                    </div>
                    <div className={"location dotdotted"} style={{ fontSize: "14px", lineHeight: "21px", fontWeight: "400", color: "var(--gray-500)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: "12px" }}>
      											Hawks Prairie Park &amp; Ride									</div>
                  </div>
                  <div className={"meta-bottom"}>
                    <div className={"interested-container"} style={{ display: "flex", alignItems: "center" }}>
                      <div className={"interested"}>
                        <span>293+ Interested</span>
                      </div>
                    </div>
                    <div className={"divider"} style={{ fontSize: "13px", fontWeight: "400", color: "var(--gray-300)", margin: "0px 10px" }}>|</div>
                    <div className={"price-container"}>
                      <span className={"price"} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>{"\n\t\t\t\t\t\t\t\t\t\t"}<i className={"icon icon-ticket-empty"} style={{ fontSize: "14px", color: "var(--gray-700)" }} />{"\n\t\t\t\t\t\t\t\t\t\t"}<span>
      											USD 109										</span>{"\n\t\t\t\t\t\t\t\t\t"}</span>
                    </div>
                  </div>
                </div>
              </li>
              <li className={"event-card event-card-link"}>
                <div className={"banner-cont php-banner-cont lazy"} style={{ display: "block", backgroundImage: "url(\"/site-assets/eb487fca84c711db.avif\")" }}>
                  <span className={"c-ribbon"}>Editor's pick<img src="/site-assets/27b8a2a045167b74-e9ff578dcb3a601d7a54c10d09812a06.png" className={"label_img"} alt="Editor pick featured" /></span>
                  <div className={"ellipsis-btn-join-event"}>
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <i className={"track icon-star-empty event-interested-action"} title="I'm interested" />
                  </div>
                </div>
                <div className={"meta"}>
                  <div className={"meta-top"}>
                    <div className={"meta-top-info"} style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
                      <div className={"date"} style={{ fontSize: "13px", fontWeight: "400", color: "var(--gray-500)", marginRight: "10px", textTransform: "capitalize" }}>
      													Sat, 07 Nov • 07:30 PM											</div>
                    </div>
                  </div>
                  <div className={"meta-middle"}>
                    <div className={"title"} style={{ overflowWrap: "break-word" }}>
                      <a href="/big-bear-lake/furia-tanguera-tickets/80001465527824?ref=hpp-event-country" target="_blank" title="Furia Tanguera">
                        <h3>
      							Furia Tanguera						</h3>
                      </a>
                    </div>
                    <div className={"location dotdotted"} style={{ fontSize: "14px", lineHeight: "21px", fontWeight: "400", color: "var(--gray-500)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: "12px" }}>
      											Big Bear Performing Arts Center									</div>
                  </div>
                  <div className={"meta-bottom"}>
                    <div className={"interested-container"} style={{ display: "flex", alignItems: "center" }}>
                      <div className={"interested"}>
                        <span>5+ Interested</span>
                      </div>
                    </div>
                    <div className={"divider"} style={{ fontSize: "13px", fontWeight: "400", color: "var(--gray-300)", margin: "0px 10px" }}>|</div>
                    <div className={"price-container"}>
                      <span className={"price"} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>{"\n\t\t\t\t\t\t\t\t\t\t"}<i className={"icon icon-ticket-empty"} style={{ fontSize: "14px", color: "var(--gray-700)" }} />{"\n\t\t\t\t\t\t\t\t\t\t"}<span>
      											USD 25										</span>{"\n\t\t\t\t\t\t\t\t\t"}</span>
                    </div>
                  </div>
                </div>
              </li>
              <li className={"event-card event-card-link"}>
                <div className={"banner-cont php-banner-cont lazy"} style={{ display: "block", backgroundImage: "url(\"/site-assets/41ff63098654b663.avif\")" }}><span className={"c-ribbon"}>Editor's pick<img src="/site-assets/27b8a2a045167b74-e9ff578dcb3a601d7a54c10d09812a06.png" className={"label_img"} alt="Editor pick featured" /></span><span className={"c-ribbon"} style={{ left: "unset", maxWidth: "unset", right: "10px" } as CSSProperties} title="Discount code available">{"\n\t\t\t\t\t"}<img src="/site-assets/073c3eedec5f9ae6.webp" style={{ width: "16px", height: "16px", marginRight: "5px" }} />$10 Off				</span><div className={"ellipsis-btn-join-event"}><div className={"interest-animate"} /><div className={"interest-animate"} /><div className={"interest-animate"} /><div className={"interest-animate"} /><div className={"interest-animate"} /><div className={"interest-animate"} /><div className={"interest-animate"} /><i className={"track icon-star-empty event-interested-action"} title="I'm interested" /></div></div>
                <div className={"meta"}>
                  <div className={"meta-top"}>
                    <div className={"meta-top-info"} style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
                      <div className={"date"} style={{ fontSize: "13px", fontWeight: "400", color: "var(--gray-500)", marginRight: "10px", textTransform: "capitalize" }}>
      													Thu, 10 Dec • 03:00 PM											</div>
                    </div>
                  </div>
                  <div className={"meta-middle"}>
                    <div className={"title"} style={{ overflowWrap: "break-word" }}>
                      <a href="/canyon-lake/realty411s-annual-holiday-rei-celebration-tickets/80001146331793?ref=hpp-event-country" target="_blank" title=" Realty411s Annual Holiday REI Celebration ">
                        <h3>
      							✨ Realty411’s Annual Holiday REI Celebration ✨						</h3>
                      </a>
                    </div>
                    <div className={"location dotdotted"} style={{ fontSize: "14px", lineHeight: "21px", fontWeight: "400", color: "var(--gray-500)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: "12px" }}>
      											Canyon Lake Golf &amp; Country Club									</div>
                  </div>
                  <div className={"meta-bottom"}>
                    <div className={"interested-container"} style={{ display: "flex", alignItems: "center" }}>
                      <div className={"interested"}>
                        <span>31+ Interested</span>
                      </div>
                    </div>
                    <div className={"divider"} style={{ fontSize: "13px", fontWeight: "400", color: "var(--gray-300)", margin: "0px 10px" }}>|</div>
                    <div className={"price-container"}>
                      <div className={"price"} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><i className={"icon icon-ticket-empty"} style={{ fontSize: "14px", color: "var(--gray-700)" }} /><span>Free</span></div>
                    </div>
                  </div>
                </div>
              </li>
              <li className={"event-card event-card-link"}>
                <div className={"banner-cont php-banner-cont lazy"} style={{ display: "block", backgroundImage: "url(\"/site-assets/95360fca9af1ac2b.avif\")" }}>
                  <span className={"c-ribbon"}>Editor's pick<img src="/site-assets/27b8a2a045167b74-e9ff578dcb3a601d7a54c10d09812a06.png" className={"label_img"} alt="Editor pick featured" /></span>
                  <div className={"ellipsis-btn-join-event"}>
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <i className={"track icon-star-empty event-interested-action"} title="I'm interested" />
                  </div>
                </div>
                <div className={"meta"}>
                  <div className={"meta-top"}>
                    <div className={"meta-top-info"} style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
                      <div className={"date"} style={{ fontSize: "13px", fontWeight: "400", color: "var(--gray-500)", marginRight: "10px", textTransform: "capitalize" }}>
      													Fri, 27 Nov • 04:00 PM											</div>
                    </div>
                  </div>
                  <div className={"meta-middle"}>
                    <div className={"title"} style={{ overflowWrap: "break-word" }}>
                      <a href="/salisbury/operation-white-out-tickets/80002247896329?ref=hpp-event-country" target="_blank" title="Operation White-Out">
                        <h3>
      							Operation White-Out						</h3>
                      </a>
                    </div>
                    <div className={"location dotdotted"} style={{ fontSize: "14px", lineHeight: "21px", fontWeight: "400", color: "var(--gray-500)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: "12px" }}>
      											Next Catering Venue Space									</div>
                  </div>
                  <div className={"meta-bottom"}>
                    <div className={"interested-container"} style={{ display: "flex", alignItems: "center" }}>
                      <div className={"interested"}>
                        <span>7+ Interested</span>
                      </div>
                    </div>
                    <div className={"divider"} style={{ fontSize: "13px", fontWeight: "400", color: "var(--gray-300)", margin: "0px 10px" }}>|</div>
                    <div className={"price-container"}>
                      <span className={"price"} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>{"\n\t\t\t\t\t\t\t\t\t\t"}<i className={"icon icon-ticket-empty"} style={{ fontSize: "14px", color: "var(--gray-700)" }} />{"\n\t\t\t\t\t\t\t\t\t\t"}<span>
      											USD 55										</span>{"\n\t\t\t\t\t\t\t\t\t"}</span>
                    </div>
                  </div>
                </div>
              </li>
              <li className={"event-card event-card-link"}>
                <div className={"banner-cont php-banner-cont lazy"} style={{ display: "block", backgroundImage: "url(\"/site-assets/aae550c095c54bfa.avif\")" }}>
                  <span className={"c-ribbon"}>Editor's pick<img src="/site-assets/27b8a2a045167b74-e9ff578dcb3a601d7a54c10d09812a06.png" className={"label_img"} alt="Editor pick featured" /></span>
                  <div className={"ellipsis-btn-join-event"}>
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <i className={"track icon-star-empty event-interested-action"} title="I'm interested" />
                  </div>
                </div>
                <div className={"meta"}>
                  <div className={"meta-top"}>
                    <div className={"meta-top-info"} style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
                      <div className={"date"} style={{ fontSize: "13px", fontWeight: "400", color: "var(--gray-500)", marginRight: "10px", textTransform: "capitalize" }}>
      													Sat, 19 Dec • 07:00 PM											</div>
                    </div>
                  </div>
                  <div className={"meta-middle"}>
                    <div className={"title"} style={{ overflowWrap: "break-word" }}>
                      <a href="/chula-vista/lux-christmas-sneaker-ball-tickets/80003442599841?ref=hpp-event-country" target="_blank" title="LUX Christmas Sneaker Ball">
                        <h3>
      							LUX Christmas Sneaker Ball						</h3>
                      </a>
                    </div>
                    <div className={"location dotdotted"} style={{ fontSize: "14px", lineHeight: "21px", fontWeight: "400", color: "var(--gray-500)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: "12px" }}>
      											Otay Ranch									</div>
                  </div>
                  <div className={"meta-bottom"}>
                    <div className={"interested-container"} style={{ display: "flex", alignItems: "center" }} />
                    <div className={"price-container"}>
                      <span className={"price"} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>{"\n\t\t\t\t\t\t\t\t\t\t"}<i className={"icon icon-ticket-empty"} style={{ fontSize: "14px", color: "var(--gray-700)" }} />{"\n\t\t\t\t\t\t\t\t\t\t"}<span>
      											USD 125										</span>{"\n\t\t\t\t\t\t\t\t\t"}</span>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className={"\x63ontainer explore-globe-section"}>
        <div className={"fold"}>
          <div className={"\x72ow-fluid citi"}>
            <div className={"head-label"}>
              <h2 className={"headstyle-1"}>
                <a href="/location.php" style={{ color: "rgb(46, 54, 63)" }} title="Explore All Events across the globe">Explore Events across the Globe</a>
              </h2>
            </div>
            <div className={"container"}>
              <div className={"popular-city-row vibe-globe-cards-row"}>
                {/* 1. New York */}
                <div className={"popular-city-container vibe-globe-card-item"}>
                  <a href="/newyork-dbe12298e8b6a417?ref=home-page" className={"vibe-globe-card-link"} title="Events in New York">
                    <img className={"vibe-globe-card-img"} alt="Events in New York" src="/site-assets/cities/new-york-transparent.png" loading="lazy" />
                  </a>
                </div>

                {/* 2. San Francisco */}
                <div className={"popular-city-container vibe-globe-card-item"}>
                  <a href="/san-francisco?ref=home-page" className={"vibe-globe-card-link"} title="Events in San Francisco">
                    <img className={"vibe-globe-card-img"} alt="Events in San Francisco" src="/site-assets/cities/san-francisco-transparent.png" loading="lazy" />
                  </a>
                </div>

                {/* 3. Chicago */}
                <div className={"popular-city-container vibe-globe-card-item"}>
                  <a href="/chicago?ref=home-page" className={"vibe-globe-card-link"} title="Events in Chicago">
                    <img className={"vibe-globe-card-img"} alt="Events in Chicago" src="/site-assets/cities/chicago-transparent.png" loading="lazy" />
                  </a>
                </div>

                {/* 4. Nashville */}
                <div className={"popular-city-container vibe-globe-card-item"}>
                  <a href="/nashville?ref=home-page" className={"vibe-globe-card-link"} title="Events in Nashville">
                    <img className={"vibe-globe-card-img"} alt="Events in Nashville" src="/site-assets/cities/nashville-transparent.png" loading="lazy" />
                  </a>
                </div>

                {/* 5. Miami */}
                <div className={"popular-city-container vibe-globe-card-item"}>
                  <a href="/miami?ref=home-page" className={"vibe-globe-card-link"} title="Events in Miami">
                    <img className={"vibe-globe-card-img"} alt="Events in Miami" src="/site-assets/cities/miami-transparent.png" loading="lazy" />
                  </a>
                </div>
              </div>
            </div>
            <div className={"\x63ontainer"}>
              <div className={"\x72ow-fluid count-flag"} style={{ display: "block" }}>
                <div className={"container-fluid"} style={{ padding: "0px", marginLeft: "0px" }}>
                  <div className={"flags-bottom"} style={{ textAlign: "left", marginLeft: "0px" }}>
                    <div className={"cont \x63ontainer"} style={{ textAlign: "left", marginLeft: "0px", paddingLeft: "0px" }}>
                      <ul className={"flag-list"}>
                        <li className={"flag"} data-original-title="" title="">
                          <a href="/location.php?country=united%20states">
                            <img className={"lazy"} data-src="//cdn5.allevents.in/images/flags/32/US.png" src="/site-assets/e4ca13d8a71211e2.png" alt="United States" loading="eager" />
                          </a>
                          <div className={"pop-cont"}>
                            <div className={"pop-t"}><img className={"lazy"} data-src="//cdn5.allevents.in/images/flags/32/US.png" alt="United States" src="/site-assets/e4ca13d8a71211e2.png" loading="eager" /><span className={"ml5"}>United States</span></div>
                            <div className={"pop-c"}>
                              <ul className={"city-list"}>
                                <li>
                                  <a href="/newyork-dbe12298e8b6a417">New York</a>
                                </li>
                                <li>
                                  <a href="/florida">Florida</a>
                                </li>
                                <li>
                                  <a href="/michigan">Michigan</a>
                                </li>
                                <li>
                                  <a href="/ohio">Ohio</a>
                                </li>
                                <li>
                                  <a href="/chicago">Chicago</a>
                                </li>
                                <li>
                                  <a href="/losangeles-732e5b0881c56f93">Los Angeles</a>
                                </li>
                                <li>
                                  <a href="/maryland">Maryland</a>
                                </li>
                                <li>
                                  <a href="/lasvegas-9dbdd4ccbd55955b">Las Vegas</a>
                                </li>
                                <li>
                                  <a href="/indiana">Indiana</a>
                                </li>
                                <li>
                                  <a href="/washington">Washington</a>
                                </li>
                                <li>
                                  <a href="/sanfrancisco-0cb0d876316cb135">San Francisco</a>
                                </li>
                                <li>
                                  <a href="/tennessee">Tennessee</a>
                                </li>
                                <li>
                                  <a href="/atlanta">Atlanta</a>
                                </li>
                                <li>
                                  <a className={"more-city"} href="/location.php?country=united%20states">more cities</a>
                                </li>
                              </ul>
                              <div className={"hidden-div"} />
                            </div>
                          </div>
                        </li>
                        <li className={"flag"} data-original-title="" title="">
                          <a href="/location.php?country=united%20kingdom">
                            <img className={"lazy"} data-src="//cdn2.allevents.in/transup/7c/1b048249aa476d8446f7ca8cff69fa/UK.png" src="/site-assets/75a761969d7542b5.webp" alt="United Kingdom" loading="eager" />
                          </a>
                          <div className={"pop-cont"}>
                            <div className={"pop-t"}><img className={"lazy"} data-src="//cdn2.allevents.in/transup/7c/1b048249aa476d8446f7ca8cff69fa/UK.png" alt="United Kingdom" src="/site-assets/75a761969d7542b5.webp" loading="eager" /><span className={"ml5"}>United Kingdom</span></div>
                            <div className={"pop-c"}>
                              <ul className={"city-list"}>
                                <li>
                                  <a href="/london" title="Events in London">London</a>
                                </li>
                                <li>
                                  <a href="/manchester" title="Events in Manchester">Manchester</a>
                                </li>
                                <li>
                                  <a href="/birmingham" title="Events in Birmingham">Birmingham</a>
                                </li>
                                <li>
                                  <a href="/glasgow" title="Events in Glasgow">Glasgow</a>
                                </li>
                                <li>
                                  <a href="/bristol" title="Events in Bristol">Bristol</a>
                                </li>
                                <li>
                                  <a href="/liverpool" title="Events in Liverpool">Liverpool</a>
                                </li>
                                <li>
                                  <a href="/leeds" title="Events in Leeds">Leeds</a>
                                </li>
                                <li>
                                  <a href="/edinburgh" title="Events in Edinburgh">Edinburgh</a>
                                </li>
                                <li>
                                  <a href="/sheffield" title="Events in Sheffield">Sheffield</a>
                                </li>
                                <li>
                                  <a className={"more-city"} href="/location.php?country=united%20kingdom">more cities</a>
                                </li>
                              </ul>
                              <div className={"hidden-div"} />
                            </div>
                          </div>
                        </li>
                        <li className={"flag"} data-original-title="" title="">
                          <a href="/location.php?country=canada">
                            <img className={"lazy"} data-src="//cdn5.allevents.in/images/flags/32/CA.png" src="/site-assets/90ffb7f21eadf49d.png" alt="Canada" loading="eager" />
                          </a>
                          <div className={"pop-cont"}>
                            <div className={"pop-t"}><img className={"lazy"} data-src="//cdn5.allevents.in/images/flags/32/CA.png" alt="Canada" src="/site-assets/90ffb7f21eadf49d.png" loading="eager" /><span className={"ml5"}>Canada</span></div>
                            <div className={"pop-c"}>
                              <ul className={"city-list"}>
                                <li>
                                  <a href="/toronto" title="Events in Toronto">Toronto</a>
                                </li>
                                <li>
                                  <a href="/quebec" title="Events in Quebec">Quebec</a>
                                </li>
                                <li>
                                  <a href="/vancouver" title="Events in Vancouver">Vancouver</a>
                                </li>
                                <li>
                                  <a href="/calgary" title="Events in Calgary">Calgary</a>
                                </li>
                                <li>
                                  <a href="/ottawa" title="Events in Ottawa">Ottawa</a>
                                </li>
                                <li>
                                  <a href="/montreal" title="Events in Montreal">Montreal</a>
                                </li>
                                <li>
                                  <a href="/edmonton" title="Events in Edmonton">Edmonton</a>
                                </li>
                                <li>
                                  <a href="/winnipeg" title="Events in Winnipeg">Winnipeg</a>
                                </li>
                                <li>
                                  <a className={"more-city"} href="/location.php?country=canada">more cities</a>
                                </li>
                              </ul>
                              <div className={"hidden-div"} />
                            </div>
                          </div>
                        </li>
                        <li className={"flag"} data-original-title="" title="">
                          <a href="/location.php?country=france">
                            <img className={"lazy"} data-src="//cdn5.allevents.in/images/flags/32/FR.png" src="/site-assets/5a60f18baa0bc688.png" alt="France" loading="eager" />
                          </a>
                          <div className={"pop-cont"}>
                            <div className={"pop-t"}><img className={"lazy"} data-src="//cdn5.allevents.in/images/flags/32/FR.png" alt="France" src="/site-assets/5a60f18baa0bc688.png" loading="eager" /><span className={"ml5"}>France</span></div>
                            <div className={"pop-c"}>
                              <ul className={"city-list"}>
                                <li>
                                  <a href="/paris" title="Events in Paris">Paris</a>
                                </li>
                                <li>
                                  <a href="/lyon" title="Events in Lyon">Lyon</a>
                                </li>
                                <li>
                                  <a href="/nantes" title="Events in Nantes">Nantes</a>
                                </li>
                                <li>
                                  <a href="/marseille" title="Events in Marseille">Marseille</a>
                                </li>
                                <li>
                                  <a href="/toulouse" title="Events in Toulouse">Toulouse</a>
                                </li>
                                <li>
                                  <a href="/bordeaux" title="Events in Bordeaux">Bordeaux</a>
                                </li>
                                <li>
                                  <a href="/lille" title="Events in Lille">Lille</a>
                                </li>
                                <li>
                                  <a className={"more-city"} href="/location.php?country=france">more cities</a>
                                </li>
                              </ul>
                              <div className={"hidden-div"} />
                            </div>
                          </div>
                        </li>
                        <li className={"flag"} data-original-title="" title="">
                          <a href="/location.php?country=germany">
                            <img className={"lazy"} data-src="//cdn5.allevents.in/images/flags/32/DE.png" src="/site-assets/85364ce15b57524e.png" alt="Germany" loading="eager" />
                          </a>
                          <div className={"pop-cont"}>
                            <div className={"pop-t"}><img className={"lazy"} data-src="//cdn5.allevents.in/images/flags/32/DE.png" alt="Germany" src="/site-assets/85364ce15b57524e.png" loading="eager" /><span className={"ml5"}>Germany</span></div>
                            <div className={"pop-c"}>
                              <ul className={"city-list"}>
                                <li>
                                  <a href="/berlin" title="Events in Berlin">Berlin</a>
                                </li>
                                <li>
                                  <a href="/hamburg" title="Events in Hamburg">Hamburg</a>
                                </li>
                                <li>
                                  <a href="/dusseldorf" title="Events in Dusseldorf">Dusseldorf</a>
                                </li>
                                <li>
                                  <a href="/dresden" title="Events in Dresden">Dresden</a>
                                </li>
                                <li>
                                  <a href="/stuttgart" title="Events in Stuttgart">Stuttgart</a>
                                </li>
                                <li>
                                  <a href="/munich" title="Events in Munich">Munich</a>
                                </li>
                                <li>
                                  <a href="/leipzig" title="Events in Leipzig">Leipzig</a>
                                </li>
                                <li>
                                  <a href="/cologne" title="Events in Cologne">Cologne</a>
                                </li>
                                <li>
                                  <a href="/darmstadt" title="Events in Darmstadt">Darmstadt</a>
                                </li>
                                <li>
                                  <a href="/dortmund" title="Events in Dortmund">Dortmund</a>
                                </li>
                                <li>
                                  <a href="/karlsruhe" title="Events in Karlsruhe">Karlsruhe</a>
                                </li>
                                <li>
                                  <a href="/chemnitz" title="Events in Chemnitz">Chemnitz</a>
                                </li>
                                <li>
                                  <a href="/essen" title="Events in Essen">Essen</a>
                                </li>
                                <li>
                                  <a href="/augsburg" title="Events in Augsburg">Augsburg</a>
                                </li>
                                <li>
                                  <a href="/bonn" title="Events in Bonn">Bonn</a>
                                </li>
                                <li>
                                  <a href="/mannheim" title="Events in Mannheim">Mannheim</a>
                                </li>
                                <li>
                                  <a href="/wiesbaden" title="Events in Wiesbaden">Wiesbaden</a>
                                </li>
                                <li>
                                  <a href="/istanbul" title="Events in Istanbul">Istanbul</a>
                                </li>
                                <li>
                                  <a href="/ankara" title="Events in Ankara">Ankara</a>
                                </li>
                                <li>
                                  <a className={"more-city"} href="/location.php?country=germany">more cities</a>
                                </li>
                              </ul>
                              <div className={"hidden-div"} />
                            </div>
                          </div>
                        </li>
                        <li className={"flag"} data-original-title="" title="">
                          <a href="/location.php?country=brazil">
                            <img className={"lazy"} data-src="//cdn5.allevents.in/images/flags/32/BR.png" src="/site-assets/60a77e49d72858d5.webp" alt="Brazil" loading="eager" />
                          </a>
                          <div className={"pop-cont"}>
                            <div className={"pop-t"}><img className={"lazy"} data-src="//cdn5.allevents.in/images/flags/32/BR.png" alt="Brazil" src="/site-assets/60a77e49d72858d5.webp" loading="eager" /><span className={"ml5"}>Brazil</span></div>
                            <div className={"pop-c"}>
                              <ul className={"city-list"}>
                                <li>
                                  <a href="/sopaulo-443bd9dff5590878" title="Events in São Paulo">São Paulo</a>
                                </li>
                                <li>
                                  <a href="/riodejaneiro-1ce69aa855d78d18" title="Events in Rio de Janeiro">Rio de Janeiro</a>
                                </li>
                                <li>
                                  <a href="/portoalegre-358e946c60f2091f" title="Events in Porto Alegre">Porto Alegre</a>
                                </li>
                                <li>
                                  <a href="/curitiba" title="Events in Curitiba">Curitiba</a>
                                </li>
                                <li>
                                  <a href="/belohorizonte-06e0ffc47c8cbac1" title="Events in Belo Horizonte">Belo Horizonte</a>
                                </li>
                                <li>
                                  <a className={"more-city"} href="/location.php?country=brazil">more cities</a>
                                </li>
                              </ul>
                              <div className={"hidden-div"} />
                            </div>
                          </div>
                        </li>
                        <li className={"flag"} data-original-title="" title="">
                          <a href="/location.php?country=netherlands">
                            <img className={"lazy"} data-src="//cdn5.allevents.in/images/flags/32/NL.png" src="/site-assets/61bb70478508dc6c.png" alt="Netherlands" loading="eager" />
                          </a>
                          <div className={"pop-cont"}>
                            <div className={"pop-t"}><img className={"lazy"} data-src="//cdn5.allevents.in/images/flags/32/NL.png" alt="Netherlands" src="/site-assets/61bb70478508dc6c.png" loading="eager" /><span className={"ml5"}>Netherlands</span></div>
                            <div className={"pop-c"}>
                              <ul className={"city-list"}>
                                <li>
                                  <a href="/amsterdam" title="Events in Amsterdam">Amsterdam</a>
                                </li>
                                <li>
                                  <a href="/rotterdam" title="Events in Rotterdam">Rotterdam</a>
                                </li>
                                <li>
                                  <a href="/utrecht" title="Events in Utrecht">Utrecht</a>
                                </li>
                                <li>
                                  <a href="/thehague-436349b5cf77aef7" title="Events in The Hague">The Hague</a>
                                </li>
                                <li>
                                  <a href="/eindhoven" title="Events in Eindhoven">Eindhoven</a>
                                </li>
                                <li>
                                  <a href="/groningen" title="Events in Groningen">Groningen</a>
                                </li>
                                <li>
                                  <a href="/breda" title="Events in Breda">Breda</a>
                                </li>
                                <li>
                                  <a href="/tilburg" title="Events in Tilburg">Tilburg</a>
                                </li>
                                <li>
                                  <a href="/nijmegen" title="Events in Nijmegen">Nijmegen</a>
                                </li>
                                <li>
                                  <a href="/leiden" title="Events in Leiden">Leiden</a>
                                </li>
                                <li>
                                  <a href="/arnhem" title="Events in Arnhem">Arnhem</a>
                                </li>
                                <li>
                                  <a className={"more-city"} href="/location.php?country=netherlands">more cities</a>
                                </li>
                              </ul>
                              <div className={"hidden-div"} />
                            </div>
                          </div>
                        </li>
                        <li className={"flag"} data-original-title="" title="">
                          <a href="/location.php?country=australia">
                            <img className={"lazy"} data-src="//cdn5.allevents.in/images/flags/32/AU.png" src="/site-assets/c7e6e15ca8c749b3.png" alt="Australia" loading="eager" />
                          </a>
                          <div className={"pop-cont"}>
                            <div className={"pop-t"}><img className={"lazy"} data-src="//cdn5.allevents.in/images/flags/32/AU.png" alt="Australia" src="/site-assets/c7e6e15ca8c749b3.png" loading="eager" /><span className={"ml5"}>Australia</span></div>
                            <div className={"pop-c"}>
                              <ul className={"city-list"}>
                                <li>
                                  <a href="/sydney" title="Events in Sydney">Sydney</a>
                                </li>
                                <li>
                                  <a href="/melbourne" title="Events in Melbourne">Melbourne</a>
                                </li>
                                <li>
                                  <a href="/perth" title="Events in Perth">Perth</a>
                                </li>
                                <li>
                                  <a href="/brisbane" title="Events in Brisbane">Brisbane</a>
                                </li>
                                <li>
                                  <a href="/adelaide" title="Events in Adelaide">Adelaide</a>
                                </li>
                                <li>
                                  <a href="/preston" title="Events in Preston">Preston</a>
                                </li>
                                <li>
                                  <a href="/canberra" title="Events in Canberra">Canberra</a>
                                </li>
                                <li>
                                  <a className={"more-city"} href="/location.php?country=australia">more cities</a>
                                </li>
                              </ul>
                              <div className={"hidden-div"} />
                            </div>
                          </div>
                        </li>
                        <li className={"flag"} data-original-title="" title="">
                          <a href="/location.php?country=spain">
                            <img className={"lazy"} data-src="//cdn5.allevents.in/images/flags/32/ES.png" src="/site-assets/3988c6cdb978f384.webp" alt="Spain" loading="eager" />
                          </a>
                          <div className={"pop-cont"}>
                            <div className={"pop-t"}><img className={"lazy"} data-src="//cdn5.allevents.in/images/flags/32/ES.png" alt="Spain" src="/site-assets/3988c6cdb978f384.webp" loading="eager" /><span className={"ml5"}>Spain</span></div>
                            <div className={"pop-c"}>
                              <ul className={"city-list"}>
                                <li>
                                  <a href="/barcelona" title="Events in Barcelona">Barcelona</a>
                                </li>
                                <li>
                                  <a href="/madrid" title="Events in Madrid">Madrid</a>
                                </li>
                                <li>
                                  <a href="/valencia" title="Events in Valencia">Valencia</a>
                                </li>
                                <li>
                                  <a className={"more-city"} href="/location.php?country=spain">more cities</a>
                                </li>
                              </ul>
                              <div className={"hidden-div"} />
                            </div>
                          </div>
                        </li>
                        <li className={"flag"} data-original-title="" title="">
                          <a href="/location.php?country=finland">
                            <img className={"lazy"} data-src="//cdn5.allevents.in/images/flags/32/FI.png" src="/site-assets/b3200534780c9a63.png" alt="Finland" loading="eager" />
                          </a>
                          <div className={"pop-cont"}>
                            <div className={"pop-t"}><img className={"lazy"} data-src="//cdn5.allevents.in/images/flags/32/FI.png" alt="Finland" src="/site-assets/b3200534780c9a63.png" loading="eager" /><span className={"ml5"}>Finland</span></div>
                            <div className={"pop-c"}>
                              <ul className={"city-list"}>
                                <li>
                                  <a href="/helsinki" title="Events in Helsinki">Helsinki</a>
                                </li>
                                <li>
                                  <a href="/tampere" title="Events in Tampere">Tampere</a>
                                </li>
                                <li>
                                  <a href="/turku" title="Events in Turku">Turku</a>
                                </li>
                                <li>
                                  <a className={"more-city"} href="/location.php?country=finland">more cities</a>
                                </li>
                              </ul>
                              <div className={"hidden-div"} />
                            </div>
                          </div>
                        </li>
                        <li className={"flag"} data-original-title="" title="">
                          <a href="/location.php?country=austria">
                            <img className={"lazy"} data-src="//cdn5.allevents.in/images/flags/32/AT.png" src="/site-assets/fe182cbab0d07d7f.png" alt="Austria" loading="eager" />
                          </a>
                          <div className={"pop-cont"}>
                            <div className={"pop-t"}><img className={"lazy"} data-src="//cdn5.allevents.in/images/flags/32/AT.png" alt="Austria" src="/site-assets/fe182cbab0d07d7f.png" loading="eager" /><span className={"ml5"}>Austria</span></div>
                            <div className={"pop-c"}>
                              <ul className={"city-list"}>
                                <li>
                                  <a href="/vienna" title="Events in Vienna">Vienna</a>
                                </li>
                                <li>
                                  <a href="/graz" title="Events in Graz">Graz</a>
                                </li>
                                <li>
                                  <a href="/linz" title="Events in Linz">Linz</a>
                                </li>
                                <li>
                                  <a href="/wien" title="Events in Wien">Wien</a>
                                </li>
                                <li>
                                  <a href="/salzburg" title="Events in Salzburg">Salzburg</a>
                                </li>
                                <li>
                                  <a href="/innsbruck" title="Events in Innsbruck">Innsbruck</a>
                                </li>
                                <li>
                                  <a className={"more-city"} href="/location.php?country=austria">more cities</a>
                                </li>
                              </ul>
                              <div className={"hidden-div"} />
                            </div>
                          </div>
                        </li>
                        <li className={"flag"} data-original-title="" title="">
                          <a href="/location.php?country=south%20africa">
                            <img className={"lazy"} data-src="//cdn5.allevents.in/images/flags/32/ZA.png" src="/site-assets/65063fd16edc211d.png" alt="South Africa" loading="eager" />
                          </a>
                          <div className={"pop-cont"}>
                            <div className={"pop-t"}><img className={"lazy"} data-src="//cdn5.allevents.in/images/flags/32/ZA.png" alt="South Africa" src="/site-assets/65063fd16edc211d.png" loading="eager" /><span className={"ml5"}>South Africa</span></div>
                            <div className={"pop-c"}>
                              <ul className={"city-list"}>
                                <li>
                                  <a href="/gauteng" title="Events in Gauteng">Gauteng</a>
                                </li>
                                <li>
                                  <a href="/rustenburg" title="Events in Rustenburg">Rustenburg</a>
                                </li>
                                <li>
                                  <a href="/pretoria" title="Events in Pretoria">Pretoria</a>
                                </li>
                                <li>
                                  <a href="/johannesburg" title="Events in Johannesburg">Johannesburg</a>
                                </li>
                                <li>
                                  <a href="/capetown-99a7bfe8fefa8fd5" title="Events in Cape Town">Cape Town</a>
                                </li>
                                <li>
                                  <a href="/polokwane" title="Events in Polokwane">Polokwane</a>
                                </li>
                                <li>
                                  <a href="/vanderbijlpark" title="Events in Vanderbijlpark">Vanderbijlpark</a>
                                </li>
                                <li>
                                  <a href="/durban" title="Events in Durban">Durban</a>
                                </li>
                                <li>
                                  <a className={"more-city"} href="/location.php?country=south%20africa">more cities</a>
                                </li>
                              </ul>
                              <div className={"hidden-div"} />
                            </div>
                          </div>
                        </li>
                        <li className={"flag"} data-original-title="" title="">
                          <a href="/location.php?country=india">
                            <img className={"lazy"} data-src="//cdn5.allevents.in/images/flags/32/IN.png" src="/site-assets/d9bf209f53e02813.png" alt="India" loading="eager" />
                          </a>
                          <div className={"pop-cont"}>
                            <div className={"pop-t"}><img className={"lazy"} data-src="//cdn5.allevents.in/images/flags/32/IN.png" alt="India" src="/site-assets/d9bf209f53e02813.png" loading="eager" /><span className={"ml5"}>India</span></div>
                            <div className={"pop-c"}>
                              <ul className={"city-list"}>
                                <li>
                                  <a href="/mumbai" title="Events in Mumbai">Mumbai</a>
                                </li>
                                <li>
                                  <a href="/bangalore" title="Events in Bangalore">Bangalore</a>
                                </li>
                                <li>
                                  <a href="/newdelhi-8a22c92ca4ede191" title="Events in New Delhi">New Delhi</a>
                                </li>
                                <li>
                                  <a href="/rishikesh" title="Events in Rishikesh">Rishikesh</a>
                                </li>
                                <li>
                                  <a href="/chennai" title="Events in Chennai">Chennai</a>
                                </li>
                                <li>
                                  <a href="/pune" title="Events in Pune">Pune</a>
                                </li>
                                <li>
                                  <a href="/kolkata" title="Events in Kolkata">Kolkata</a>
                                </li>
                                <li>
                                  <a href="/ahmedabad" title="Events in Ahmedabad">Ahmedabad</a>
                                </li>
                                <li>
                                  <a href="/hyderabad" title="Events in Hyderabad">Hyderabad</a>
                                </li>
                                <li>
                                  <a href="/bengaluru" title="Events in Bengaluru">Bengaluru</a>
                                </li>
                                <li>
                                  <a className={"more-city"} href="/location.php?country=india">more cities</a>
                                </li>
                              </ul>
                              <div className={"hidden-div"} />
                            </div>
                          </div>
                        </li>
                        <li className={"flag"} data-original-title="" title="">
                          <a href="/location.php?country=poland">
                            <img className={"lazy"} data-src="//cdn5.allevents.in/images/flags/32/PL.png" src="/site-assets/358a454a1ae7ac63.png" alt="poland" loading="eager" />
                          </a>
                          <div className={"pop-cont"}>
                            <div className={"pop-t"}><img className={"lazy"} data-src="//cdn5.allevents.in/images/flags/32/PL.png" alt="poland" src="/site-assets/358a454a1ae7ac63.png" loading="eager" /><span className={"ml5"}>Poland</span></div>
                            <div className={"pop-c"}>
                              <ul className={"city-list"}>
                                <li>
                                  <a href="/warsaw" title="Events in Warsaw">Warsaw</a>
                                </li>
                                <li>
                                  <a href="/wroclaw" title="Events in Wroclaw">Wroclaw</a>
                                </li>
                                <li>
                                  <a href="/poznan" title="Events in Poznan">Poznan</a>
                                </li>
                                <li>
                                  <a href="/krakow" title="Events in Krakow">Krakow</a>
                                </li>
                                <li>
                                  <a href="/katowice" title="Events in Katowice">Katowice</a>
                                </li>
                                <li>
                                  <a href="/gdansk-pm" title="Events in Gdansk-PM">Gdansk</a>
                                </li>
                                <li>
                                  <a href="/gdynia" title="Events in Gdynia">Gdynia</a>
                                </li>
                                <li>
                                  <a href="/szczecin" title="Events in Szczecin">Szczecin</a>
                                </li>
                                <li>
                                  <a href="/lublin" title="Events in Lublin">Lublin</a>
                                </li>
                                <li>
                                  <a className={"more-city"} href="/location.php?country=poland">more cities</a>
                                </li>
                              </ul>
                              <div className={"hidden-div"} />
                            </div>
                          </div>
                        </li>
                        <li className={"flag"} data-original-title="" title="">
                          <a href="/location.php?country=new%20zealand">
                            <img className={"lazy"} data-src="//cdn5.allevents.in/images/flags/32/NZ.png" src="/site-assets/fc160c9180b638da.png" alt="New Zealand" loading="eager" />
                          </a>
                          <div className={"pop-cont"}>
                            <div className={"pop-t"}><img className={"lazy"} data-src="//cdn5.allevents.in/images/flags/32/NZ.png" alt="New Zealand" src="/site-assets/fc160c9180b638da.png" loading="eager" /><span className={"ml5"}>New Zealand</span></div>
                            <div className={"pop-c"}>
                              <ul className={"city-list"}>
                                <li>
                                  <a href="/auckland" title="Events in Auckland">Auckland</a>
                                </li>
                                <li>
                                  <a href="/wellington" title="Events in Wellington">Wellington</a>
                                </li>
                                <li>
                                  <a href="/christchurch" title="Events in Christchurch">Christchurch</a>
                                </li>
                                <li>
                                  <a href="/nelson" title="Events in Nelson">Nelson</a>
                                </li>
                                <li>
                                  <a className={"more-city"} href="/location.php?country=new%20zealand">more cities</a>
                                </li>
                              </ul>
                              <div className={"hidden-div"} />
                            </div>
                          </div>
                        </li>
                        <li className={"flag"} data-original-title="" title="">
                          <a href="/location.php?country=switzerland">
                            <img className={"lazy"} data-src="//cdn5.allevents.in/images/flags/32/CH.png" src="/site-assets/ee7d5d75e5e9f89e.png" alt="Switzerland" loading="eager" />
                          </a>
                          <div className={"pop-cont"}>
                            <div className={"pop-t"}><img className={"lazy"} data-src="//cdn5.allevents.in/images/flags/32/CH.png" alt="Switzerland" src="/site-assets/ee7d5d75e5e9f89e.png" loading="eager" /><span className={"ml5"}>Switzerland</span></div>
                            <div className={"pop-c"}>
                              <ul className={"city-list"}>
                                <li>
                                  <a href="/zurich" title="Events in Zurich">Zurich</a>
                                </li>
                                <li>
                                  <a href="/basel" title="Events in Basel">Basel</a>
                                </li>
                                <li>
                                  <a href="/bern" title="Events in Bern">Bern</a>
                                </li>
                                <li>
                                  <a href="/lausanne" title="Events in Lausanne">Lausanne</a>
                                </li>
                                <li>
                                  <a href="/geneva" title="Events in Geneva">Geneva</a>
                                </li>
                                <li>
                                  <a className={"more-city"} href="/location.php?country=switzerland">more cities</a>
                                </li>
                              </ul>
                              <div className={"hidden-div"} />
                            </div>
                          </div>
                        </li>
                        <li className={"flag"} data-original-title="" title="">
                          <a href="/location.php?country=norway">
                            <img className={"lazy"} data-src="//cdn5.allevents.in/images/flags/32/NO.png" src="/site-assets/2bc5105105878d6b.png" alt="Norway" loading="eager" />
                          </a>
                          <div className={"pop-cont"}>
                            <div className={"pop-t"}><img className={"lazy"} data-src="//cdn5.allevents.in/images/flags/32/NO.png" alt="Norway" src="/site-assets/2bc5105105878d6b.png" loading="eager" /><span className={"ml5"}>Norway</span></div>
                            <div className={"pop-c"}>
                              <ul className={"city-list"}>
                                <li>
                                  <a href="/oslo" title="Events in Oslo">Oslo</a>
                                </li>
                                <li>
                                  <a href="/bergen" title="Events in Bergen">Bergen</a>
                                </li>
                                <li>
                                  <a href="/stavanger" title="Events in Stavanger">Stavanger</a>
                                </li>
                                <li>
                                  <a href="/trondheim" title="Events in Trondheim">Trondheim</a>
                                </li>
                                <li>
                                  <a className={"more-city"} href="/location.php?country=norway">more cities</a>
                                </li>
                              </ul>
                              <div className={"hidden-div"} />
                            </div>
                          </div>
                        </li>
                        <li className={"flag"} data-original-title="" title="">
                          <a href="/location.php?country=belgium">
                            <img className={"lazy"} data-src="//cdn5.allevents.in/images/flags/32/BE.png" src="/site-assets/8a5dd35ee3d4c851.png" alt="Belgium" loading="eager" />
                          </a>
                          <div className={"pop-cont"}>
                            <div className={"pop-t"}><img className={"lazy"} data-src="//cdn5.allevents.in/images/flags/32/BE.png" alt="Belgium" src="/site-assets/8a5dd35ee3d4c851.png" loading="eager" /><span className={"ml5"}>Belgium</span></div>
                            <div className={"pop-c"}>
                              <ul className={"city-list"}>
                                <li>
                                  <a href="/brussels" title="Events in Brussels">Brussels</a>
                                </li>
                                <li>
                                  <a href="/gent" title="Events in Gent">Gent</a>
                                </li>
                                <li>
                                  <a href="/antwerp" title="Events in Antwerp">Antwerp</a>
                                </li>
                                <li>
                                  <a href="/liege" title="Events in Liege">Liege</a>
                                </li>
                                <li>
                                  <a href="/leuven" title="Events in Leuven">Leuven</a>
                                </li>
                                <li>
                                  <a href="/brugge" title="Events in Brugge">Brugge</a>
                                </li>
                                <li>
                                  <a href="/namur" title="Events in Namur">Namur</a>
                                </li>
                                <li>
                                  <a href="/hasselt" title="Events in Hasselt">Hasselt</a>
                                </li>
                                <li>
                                  <a href="/mechelen" title="Events in Mechelen">Mechelen</a>
                                </li>
                                <li>
                                  <a href="/kortrijk" title="Events in Kortrijk">Kortrijk</a>
                                </li>
                                <li>
                                  <a className={"more-city"} href="/location.php?country=belgium">more cities</a>
                                </li>
                              </ul>
                              <div className={"hidden-div"} />
                            </div>
                          </div>
                        </li>
                        <li className={"flag"} data-original-title="" title="">
                          <a href="/location.php?country=italy">
                            <img className={"lazy"} data-src="//cdn5.allevents.in/images/flags/32/IT.png" src="/site-assets/e73df4d25372b5f4.png" alt="Italy" loading="eager" />
                          </a>
                          <div className={"pop-cont"}>
                            <div className={"pop-t"}><img className={"lazy"} data-src="//cdn5.allevents.in/images/flags/32/IT.png" alt="Italy" src="/site-assets/e73df4d25372b5f4.png" loading="eager" /><span className={"ml5"}>Italy</span></div>
                            <div className={"pop-c"}>
                              <ul className={"city-list"}>
                                <li>
                                  <a href="/rome" title="Events in Rome">Rome</a>
                                </li>
                                <li>
                                  <a href="/milano" title="Events in Milano">Milano</a>
                                </li>
                                <li>
                                  <a href="/bologna" title="Events in Bologna">Bologna</a>
                                </li>
                                <li>
                                  <a href="/turin" title="Events in Turin">Turin</a>
                                </li>
                                <li>
                                  <a href="/florence" title="Events in Florence">Florence</a>
                                </li>
                                <li>
                                  <a href="/genova" title="Events in Genova">Genova</a>
                                </li>
                                <li>
                                  <a href="/verona" title="Events in Verona">Verona</a>
                                </li>
                                <li>
                                  <a href="/brescia" title="Events in Brescia">Brescia</a>
                                </li>
                                <li>
                                  <a href="/palermo" title="Events in Palermo">Palermo</a>
                                </li>
                                <li>
                                  <a href="/bari" title="Events in Bari">Bari</a>
                                </li>
                                <li>
                                  <a href="/modena" title="Events in Modena">Modena</a>
                                </li>
                                <li>
                                  <a href="/vicenza" title="Events in Vicenza">Vicenza</a>
                                </li>
                                <li>
                                  <a href="/bergamo" title="Events in Bergamo">Bergamo</a>
                                </li>
                                <li>
                                  <a href="/trento" title="Events in Trento">Trento</a>
                                </li>
                                <li>
                                  <a className={"more-city"} href="/location.php?country=italy">more cities</a>
                                </li>
                              </ul>
                              <div className={"hidden-div"} />
                            </div>
                          </div>
                        </li>
                        <li className={"flag"} data-original-title="" title="">
                          <a className={"btn btn-link"} href="/location.php">more cities</a>
                          <div className={"pop-cont"}>
                            <div className={"pop-t"}>
                              <i className={"icon-globe mr5"} />
                              <a href="/location.php">View All</a>
                            </div>
                            <div className={"pop-c"}>
                              <ul className={"city-list"}>
                                <li>
                                  <a href="/london" title="Events in London">London</a>
                                </li>
                                <li>
                                  <a href="/manchester" title="Events in Manchester">Manchester</a>
                                </li>
                                <li>
                                  <a href="/dublin" title="Events in Dublin">Dublin</a>
                                </li>
                                <li>
                                  <a href="/singapore" title="Events in Singapore">Singapore</a>
                                </li>
                                <li>
                                  <a href="/dubai" title="Events in Dubai">Dubai</a>
                                </li>
                                <li>
                                  <a href="/istanbul" title="Events in Istanbul">Istanbul</a>
                                </li>
                                <li>
                                  <a href="/bangkok" title="Events in Bangkok">Bangkok</a>
                                </li>
                                <li>
                                  <a href="/kualalumpur-e49e4d34725bd8c3" title="Events in Kuala Lumpur">Kuala Lumpur</a>
                                </li>
                                <li>
                                  <a href="/budapest-64b8604f826fada0" title="Events in Budapest">Budapest</a>
                                </li>
                                <li>
                                  <a href="/moscow" title="Events in Moscow">Moscow</a>
                                </li>
                                <li>
                                  <a href="/athens" title="Events in Athens">Athens</a>
                                </li>
                                <li>
                                  <a href="/hanoi" title="Events in Hanoi">Hanoi</a>
                                </li>
                                <li>
                                  <a href="/jakarta" title="Events in Jakarta">Jakarta</a>
                                </li>
                                <li>
                                  <a href="/cairo" title="Events in Cairo">Cairo</a>
                                </li>
                                <li>
                                  <a href="/dhaka" title="Events in Dhaka">Dhaka</a>
                                </li>
                                <li>
                                  <a href="/lima" title="Events in Lima">Lima</a>
                                </li>
                                <li>
                                  <a className={"more-city"} href="/events"><i className={"icon-search mr10"} /> Search Events</a>
                                </li>
                              </ul>
                              <div className={"hidden-div"} />
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
      <div className={"\x72ow-fluid fold-top worldwide_t_events"} style={{ borderBottom: "0px solid rgb(221, 221, 221)" } as CSSProperties}>
        <div className={"\x63ontainer"}>
          <div>
            <div className={"head-label"}>
              <h2 className={"headstyle-1"}>Events Trending Worldwide</h2>
            </div>
            <ul className={"event-card-parent event-card-scrollable show4card"}>
              <li className={"event-card event-card-link"}>
                <div className={"banner-cont php-banner-cont lazy"} style={{ display: "block", backgroundImage: "url(\"/site-assets/2e95892f05553cd4.avif\")" }}>
                  <div className={"ellipsis-btn-join-event"}>
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <i className={"track icon-star-empty event-interested-action"} title="I'm interested" />
                  </div>
                </div>
                <div className={"meta"}>
                  <div className={"meta-top"}>
                    <div className={"meta-top-info"} style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
                      <div className={"date"} style={{ fontSize: "13px", fontWeight: "400", color: "var(--gray-500)", marginRight: "10px", textTransform: "capitalize" }}>
      													Mon, 02 Nov • 12:00 AM											</div>
                    </div>
                  </div>
                  <div className={"meta-middle"}>
                    <div className={"title"} style={{ overflowWrap: "break-word" }}>
                      <a href="/dubai/dubai-fintech-summit-tickets/80001500382218?ref=hp-worldwide-event" target="_blank" title="Dubai Fintech Summit">
                        <h3>
      							Dubai Fintech Summit						</h3>
                      </a>
                    </div>
                    <div className={"location dotdotted"} style={{ fontSize: "14px", lineHeight: "21px", fontWeight: "400", color: "var(--gray-500)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: "12px" }}>
      											Dubai, United Arab Emirates									</div>
                  </div>
                  <div className={"meta-bottom"}>
                    <div className={"interested-container"} style={{ display: "flex", alignItems: "center" }} />
                    <div className={"price-container"} />
                  </div>
                </div>
              </li>
              <li className={"event-card event-card-link"}>
                <div className={"banner-cont php-banner-cont lazy"} style={{ display: "block", backgroundImage: "url(\"/site-assets/02c7205684aba6a1.avif\")" }}>
                  <span className={"c-ribbon"}>Featured</span>
                  <div className={"ellipsis-btn-join-event"}>
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <i className={"track icon-star-empty event-interested-action"} title="I'm interested" />
                  </div>
                </div>
                <div className={"meta"}>
                  <div className={"meta-top"}>
                    <div className={"meta-top-info"} style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
                      <div className={"date"} style={{ fontSize: "13px", fontWeight: "400", color: "var(--gray-500)", marginRight: "10px", textTransform: "capitalize" }}>
      													Sun, 01 Nov • 07:00 PM + 95 more											</div>
                    </div>
                  </div>
                  <div className={"meta-middle"}>
                    <div className={"title"} style={{ overflowWrap: "break-word" }}>
                      <a href="/san-francisco/golden-gate-comedy-night-tickets/80002857950372?ref=hp-worldwide-event" target="_blank" title="Golden Gate Comedy Night">
                        <h3>
      							Golden Gate Comedy Night						</h3>
                      </a>
                    </div>
                    <div className={"location dotdotted"} style={{ fontSize: "14px", lineHeight: "21px", fontWeight: "400", color: "var(--gray-500)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: "12px" }}>
      											San Francisco, United States									</div>
                  </div>
                  <div className={"meta-bottom"}>
                    <div className={"interested-container"} style={{ display: "flex", alignItems: "center" }}>
                      <div className={"\x74op-3-avatars"} style={{ display: "flex", alignItems: "center", marginRight: "16px" }}><img className={"avatar-img lazy"} data-src="https://cdn-az.allevents.in/banners/2a8e0187a982adec182731321024efd0-rimg-w300-h300-gmir.png" width="20" height="20" style={{ borderRadius: "50%", objectFit: "cover", marginRight: "-8px", border: "1px solid rgb(255, 255, 255)" }} alt="Attendee" loading="lazy" src="/site-assets/aac4991994a59479.webp" /><img className={"avatar-img lazy"} data-src="https://cdn-az.allevents.in/banners/2a8e0187a982adec182731321024efd0-rimg-w300-h300-gmir.png" width="20" height="20" style={{ borderRadius: "50%", objectFit: "cover", marginRight: "-8px", border: "1px solid rgb(255, 255, 255)" }} alt="Attendee" loading="lazy" src="/site-assets/aac4991994a59479.webp" /><img className={"avatar-img lazy"} data-src={"https://www.gravatar.com/avatar/d164c59101eeca892fd926b1e515ae2d?s=100&d=identicon&r=g"} width="20" height="20" style={{ borderRadius: "50%", objectFit: "cover", marginRight: "-8px", border: "1px solid rgb(255, 255, 255)" }} alt="Attendee" loading="lazy" src="/site-assets/1440e35fd1f15a46.png" /></div>
                      <div className={"interested"}>
                        <span>583+ Interested</span>
                      </div>
                    </div>
                    <div className={"divider"} style={{ fontSize: "13px", fontWeight: "400", color: "var(--gray-300)", margin: "0px 10px" }}>|</div>
                    <div className={"price-container"}>
                      <span className={"price"} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>{"\n\t\t\t\t\t\t\t\t\t\t"}<i className={"icon icon-ticket-empty"} style={{ fontSize: "14px", color: "var(--gray-700)" }} />{"\n\t\t\t\t\t\t\t\t\t\t"}<span>
      											USD 20										</span>{"\n\t\t\t\t\t\t\t\t\t"}</span>
                    </div>
                  </div>
                </div>
              </li>
              <li className={"event-card event-card-link"}>
                <div className={"banner-cont php-banner-cont lazy"} style={{ display: "block", backgroundImage: "url(\"/site-assets/b8c20c58f31aae7c.avif\")" }}>
                  <div className={"ellipsis-btn-join-event"}>
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <i className={"track icon-star-empty event-interested-action"} title="I'm interested" />
                  </div>
                </div>
                <div className={"meta"}>
                  <div className={"meta-top"}>
                    <div className={"meta-top-info"} style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
                      <div className={"date"} style={{ fontSize: "13px", fontWeight: "400", color: "var(--gray-500)", marginRight: "10px", textTransform: "capitalize" }}>
      													Sun, 01 Nov • 03:00 PM											</div>
                    </div>
                  </div>
                  <div className={"meta-middle"}>
                    <div className={"title"} style={{ overflowWrap: "break-word" }}>
                      <a href="/frisco/frisco-diwali-mela-2026-india-festival-of-lights-kaleidoscope-park-tickets/80004112128573?ref=hp-worldwide-event" target="_blank" title="Frisco Diwali Mela 2026 - India Festival of Lights - Kaleidoscope Park">
                        <h3>
      							Frisco Diwali Mela 2026 - India Festival of Lights - Kaleidoscope Park						</h3>
                      </a>
                    </div>
                    <div className={"location dotdotted"} style={{ fontSize: "14px", lineHeight: "21px", fontWeight: "400", color: "var(--gray-500)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: "12px" }}>
      											Frisco, United States									</div>
                  </div>
                  <div className={"meta-bottom"}>
                    <div className={"interested-container"} style={{ display: "flex", alignItems: "center" }}>
                      <div className={"\x74op-3-avatars"} style={{ display: "flex", alignItems: "center", marginRight: "16px" }}><img className={"avatar-img lazy"} data-src="https://lh3.googleusercontent.com/a/ACg8ocISApaRMt4roVcbOE2tDaxRfRNBhqR2Znw-shJ5Qas4i7gGjVW2eQ=s96-c?sz=200" width="20" height="20" style={{ borderRadius: "50%", objectFit: "cover", marginRight: "-8px", border: "1px solid rgb(255, 255, 255)" }} alt="Attendee" loading="lazy" src="/site-assets/a9f7f06905d8b05c.jpg" /><img className={"avatar-img lazy"} data-src={"https://www.gravatar.com/avatar/27161d8c8828a4b8873ff95248e84665?s=800&d=identicon&r=g"} width="20" height="20" style={{ borderRadius: "50%", objectFit: "cover", marginRight: "-8px", border: "1px solid rgb(255, 255, 255)" }} alt="Attendee" loading="lazy" src="/site-assets/d21143941473afbb.png" /><img className={"avatar-img lazy"} data-src={"https://www.gravatar.com/avatar/f86641c3a205ea46ced5e31e5ab95211?s=100&d=identicon&r=g?sz=200"} width="20" height="20" style={{ borderRadius: "50%", objectFit: "cover", marginRight: "-8px", border: "1px solid rgb(255, 255, 255)" }} alt="Attendee" loading="lazy" src="/site-assets/2c5201022833f977.png" /></div>
                      <div className={"interested"}>
                        <span>29+ Interested</span>
                      </div>
                    </div>
                    <div className={"divider"} style={{ fontSize: "13px", fontWeight: "400", color: "var(--gray-300)", margin: "0px 10px" }}>|</div>
                    <div className={"price-container"}>
                      <div className={"price"} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><i className={"icon icon-ticket-empty"} style={{ fontSize: "14px", color: "var(--gray-700)" }} /><span>Free</span></div>
                    </div>
                  </div>
                </div>
              </li>
              <li className={"event-card event-card-link"}>
                <div className={"banner-cont php-banner-cont lazy"} style={{ display: "block", backgroundImage: "url(\"/site-assets/42c702df3c553bb4.avif\")" }}>
                  <div className={"ellipsis-btn-join-event"}>
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <i className={"track icon-star-empty event-interested-action"} title="I'm interested" />
                  </div>
                </div>
                <div className={"meta"}>
                  <div className={"meta-top"}>
                    <div className={"meta-top-info"} style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
                      <div className={"date"} style={{ fontSize: "13px", fontWeight: "400", color: "var(--gray-500)", marginRight: "10px", textTransform: "capitalize" }}>
      													Mon, 02 Nov • 10:00 PM											</div>
                    </div>
                  </div>
                  <div className={"meta-middle"}>
                    <div className={"title"} style={{ overflowWrap: "break-word" }}>
                      <a href="/abu-dhabi/adipec-2026-booth-builder-abu-dhabi-custom-stand-design-uae-tickets/80003293874819?ref=hp-worldwide-event" target="_blank" title="ADIPEC 2026 Booth Builder Abu Dhabi  Custom Stand Design UAE">
                        <h3>
      							ADIPEC 2026 Booth Builder Abu Dhabi | Custom Stand Design UAE						</h3>
                      </a>
                    </div>
                    <div className={"location dotdotted"} style={{ fontSize: "14px", lineHeight: "21px", fontWeight: "400", color: "var(--gray-500)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: "12px" }}>
      											Abu Dhabi, United Arab Emirates									</div>
                  </div>
                  <div className={"meta-bottom"}>
                    <div className={"interested-container"} style={{ display: "flex", alignItems: "center" }}>
                      <div className={"\x74op-3-avatars"} style={{ display: "flex", alignItems: "center", marginRight: "16px" }}><img className={"avatar-img lazy"} data-src={"https://www.gravatar.com/avatar/27161d8c8828a4b8873ff95248e84665?s=800&d=identicon&r=g"} width="20" height="20" style={{ borderRadius: "50%", objectFit: "cover", marginRight: "-8px", border: "1px solid rgb(255, 255, 255)" }} alt="Attendee" loading="lazy" src="/site-assets/d21143941473afbb.png" /><img className={"avatar-img lazy"} data-src={"https://www.gravatar.com/avatar/70d0b388479b4ac63933d70bea8c7dcd?s=100&d=identicon&r=g"} width="20" height="20" style={{ borderRadius: "50%", objectFit: "cover", marginRight: "-8px", border: "1px solid rgb(255, 255, 255)" }} alt="Attendee" loading="lazy" src="/site-assets/adc21d17c13f8c13.png" /><img className={"avatar-img lazy"} data-src={"https://www.gravatar.com/avatar/9ebf60829e02624278409089e9803f75?s=100&d=identicon&r=g"} width="20" height="20" style={{ borderRadius: "50%", objectFit: "cover", marginRight: "-8px", border: "1px solid rgb(255, 255, 255)" }} alt="Attendee" loading="lazy" src="/site-assets/6dd7e1483cb39670.png" /></div>
                      <div className={"interested"}>
                        <span>18+ Interested</span>
                      </div>
                    </div>
                    <div className={"divider"} style={{ fontSize: "13px", fontWeight: "400", color: "var(--gray-300)", margin: "0px 10px" }}>|</div>
                    <div className={"price-container"}>
                      <div className={"price"} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><i className={"icon icon-ticket-empty"} style={{ fontSize: "14px", color: "var(--gray-700)" }} /><span>Free</span></div>
                    </div>
                  </div>
                </div>
              </li>
              <li className={"event-card event-card-link"}>
                <div className={"banner-cont php-banner-cont lazy"} style={{ display: "block", backgroundImage: "url(\"/site-assets/ce8e0d3582b98275.avif\")" }}>
                  <div className={"ellipsis-btn-join-event"}>
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <i className={"track icon-star-empty event-interested-action"} title="I'm interested" />
                  </div>
                </div>
                <div className={"meta"}>
                  <div className={"meta-top"}>
                    <div className={"meta-top-info"} style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
                      <div className={"date"} style={{ fontSize: "13px", fontWeight: "400", color: "var(--gray-500)", marginRight: "10px", textTransform: "capitalize" }}>
      													Sat, 14 Nov • 08:30 PM											</div>
                    </div>
                  </div>
                  <div className={"meta-middle"}>
                    <div className={"title"} style={{ overflowWrap: "break-word" }}>
                      <a href="/ahmedabad/after-hours-2-with-pbt-a-sleepover-for-adults-except-you-go-home-tickets/80003158561913?ref=hp-worldwide-event" target="_blank" title="AFTER HOURS 2 with PBT (A sleepover for adults except you go home).">
                        <h3>
      							AFTER HOURS 2 with PBT (A sleepover for adults, except you go home).						</h3>
                      </a>
                    </div>
                    <div className={"location dotdotted"} style={{ fontSize: "14px", lineHeight: "21px", fontWeight: "400", color: "var(--gray-500)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: "12px" }}>
      											Ahmedabad, India									</div>
                  </div>
                  <div className={"meta-bottom"}>
                    <div className={"interested-container"} style={{ display: "flex", alignItems: "center" }}>
                      <div className={"\x74op-3-avatars"} style={{ display: "flex", alignItems: "center", marginRight: "16px" }}><img className={"avatar-img lazy"} data-src="https://lh3.googleusercontent.com/a/ACg8ocKeXn9z9fhB1Bp4pi4EWBgdwz0oENG3LfH1cfCM8RKdmWIv8UPu=s96-c?sz=200" width="20" height="20" style={{ borderRadius: "50%", objectFit: "cover", marginRight: "-8px", border: "1px solid rgb(255, 255, 255)" }} alt="Attendee" loading="lazy" src="/site-assets/57a60c25229891ce.jpg" /><img className={"avatar-img lazy"} data-src="https://lh3.googleusercontent.com/a/ACg8ocIOfucwI5nCd2YiC7QK0bjI7LhDFO5e1X2LhMae2cfxaFCoWw=s96-c?sz=200" width="20" height="20" style={{ borderRadius: "50%", objectFit: "cover", marginRight: "-8px", border: "1px solid rgb(255, 255, 255)" }} alt="Attendee" loading="lazy" src="/site-assets/67971d0da0dc49cf.png" /><img className={"avatar-img lazy"} data-src="https://lh3.googleusercontent.com/a/ACg8ocL8nDKowAmvfmJJ18Ye6YcquJWtGvZe-C2YACaGsMFsiBViWAGcHQ=s96-c?sz=200" width="20" height="20" style={{ borderRadius: "50%", objectFit: "cover", marginRight: "-8px", border: "1px solid rgb(255, 255, 255)" }} alt="Attendee" loading="lazy" src="/site-assets/f5ed8ad4f5dbbe4f.jpg" /></div>
                      <div className={"interested"}>
                        <span>40+ Interested</span>
                      </div>
                    </div>
                    <div className={"divider"} style={{ fontSize: "13px", fontWeight: "400", color: "var(--gray-300)", margin: "0px 10px" }}>|</div>
                    <div className={"price-container"}>
                      <span className={"price"} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>{"\n\t\t\t\t\t\t\t\t\t\t"}<i className={"icon icon-ticket-empty"} style={{ fontSize: "14px", color: "var(--gray-700)" }} />{"\n\t\t\t\t\t\t\t\t\t\t"}<span>
      											INR 649										</span>{"\n\t\t\t\t\t\t\t\t\t"}</span>
                    </div>
                  </div>
                </div>
              </li>
              <li className={"event-card event-card-link"}>
                <div className={"banner-cont php-banner-cont lazy"} style={{ display: "block", backgroundImage: "url(\"/site-assets/c36c54f0a94ec3a5.avif\")" }}>
                  <div className={"ellipsis-btn-join-event"}>
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <i className={"track icon-star-empty event-interested-action"} title="I'm interested" />
                  </div>
                </div>
                <div className={"meta"}>
                  <div className={"meta-top"}>
                    <div className={"meta-top-info"} style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
                      <div className={"date"} style={{ fontSize: "13px", fontWeight: "400", color: "var(--gray-500)", marginRight: "10px", textTransform: "capitalize" }}>
      													Wed, 18 Nov • 10:00 AM											</div>
                    </div>
                  </div>
                  <div className={"meta-middle"}>
                    <div className={"title"} style={{ overflowWrap: "break-word" }}>
                      <a href="/bangkok/metalex-2026-tickets/80003039801371?ref=hp-worldwide-event" target="_blank" title="METALEX 2026">
                        <h3>
      							METALEX 2026						</h3>
                      </a>
                    </div>
                    <div className={"location dotdotted"} style={{ fontSize: "14px", lineHeight: "21px", fontWeight: "400", color: "var(--gray-500)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: "12px" }}>
      											Bangkok, Thailand									</div>
                  </div>
                  <div className={"meta-bottom"}>
                    <div className={"interested-container"} style={{ display: "flex", alignItems: "center" }}>
                      <div className={"interested"}>
                        <span>4+ Interested</span>
                      </div>
                    </div>
                    <div className={"divider"} style={{ fontSize: "13px", fontWeight: "400", color: "var(--gray-300)", margin: "0px 10px" }}>|</div>
                    <div className={"price-container"}>
                      <div className={"price"} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><i className={"icon icon-ticket-empty"} style={{ fontSize: "14px", color: "var(--gray-700)" }} /><span>Free</span></div>
                    </div>
                  </div>
                </div>
              </li>
              <li className={"event-card event-card-link"}>
                <div className={"banner-cont php-banner-cont lazy"} style={{ display: "block", backgroundImage: "url(\"/site-assets/813facb7cd342a58.avif\")" }}>
                  <div className={"ellipsis-btn-join-event"}>
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <i className={"track icon-star-empty event-interested-action"} title="I'm interested" />
                  </div>
                </div>
                <div className={"meta"}>
                  <div className={"meta-top"}>
                    <div className={"meta-top-info"} style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
                      <div className={"date"} style={{ fontSize: "13px", fontWeight: "400", color: "var(--gray-500)", marginRight: "10px", textTransform: "capitalize" }}>
      													Mon, 16 Nov • 09:30 AM											</div>
                    </div>
                  </div>
                  <div className={"meta-middle"}>
                    <div className={"title"} style={{ overflowWrap: "break-word" }}>
                      <a href="/shanghai/interpack-china-2026-tickets/80003736560002?ref=hp-worldwide-event" target="_blank" title="interpack China 2026">
                        <h3>
      							interpack China 2026						</h3>
                      </a>
                    </div>
                    <div className={"location dotdotted"} style={{ fontSize: "14px", lineHeight: "21px", fontWeight: "400", color: "var(--gray-500)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: "12px" }}>
      											Shanghai, China									</div>
                  </div>
                  <div className={"meta-bottom"}>
                    <div className={"interested-container"} style={{ display: "flex", alignItems: "center" }} />
                    <div className={"price-container"}>
                      <div className={"price"} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><i className={"icon icon-ticket-empty"} style={{ fontSize: "14px", color: "var(--gray-700)" }} /><span>Free</span></div>
                    </div>
                  </div>
                </div>
              </li>
              <li className={"event-card event-card-link"}>
                <div className={"banner-cont php-banner-cont lazy"} style={{ display: "block", backgroundImage: "url(\"/site-assets/2780c4e3ccfcf890.avif\")" }}>
                  <div className={"ellipsis-btn-join-event"}>
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <i className={"track icon-star-empty event-interested-action"} title="I'm interested" />
                  </div>
                </div>
                <div className={"meta"}>
                  <div className={"meta-top"}>
                    <div className={"meta-top-info"} style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
                      <div className={"date"} style={{ fontSize: "13px", fontWeight: "400", color: "var(--gray-500)", marginRight: "10px", textTransform: "capitalize" }}>
      													Sat, 07 Nov • 10:00 AM											</div>
                    </div>
                  </div>
                  <div className={"meta-middle"}>
                    <div className={"title"} style={{ overflowWrap: "break-word" }}>
                      <a href="/calgary/2nd-annual-christmas-at-rockpointe-church-market-bearspaw-tickets/80006938899731?ref=hp-worldwide-event" target="_blank" title="2nd Annual Christmas at RockPointe Church Market - Bearspaw">
                        <h3>
      							2nd Annual Christmas at RockPointe Church Market - Bearspaw						</h3>
                      </a>
                    </div>
                    <div className={"location dotdotted"} style={{ fontSize: "14px", lineHeight: "21px", fontWeight: "400", color: "var(--gray-500)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: "12px" }}>
      											Calgary, Canada									</div>
                  </div>
                  <div className={"meta-bottom"}>
                    <div className={"interested-container"} style={{ display: "flex", alignItems: "center" }}>
                      <div className={"\x74op-3-avatars"} style={{ display: "flex", alignItems: "center", marginRight: "16px" }}><img className={"avatar-img lazy"} data-src="https://lh3.googleusercontent.com/a/ACg8ocJzMu93ERN-fsCLSNI-6fURNaLSMC80AzpowqKqaWiL1suP2A=s96-c?sz=200" width="20" height="20" style={{ borderRadius: "50%", objectFit: "cover", marginRight: "-8px", border: "1px solid rgb(255, 255, 255)" }} alt="Attendee" loading="lazy" src="/site-assets/7775f68764485fcc.png" /><img className={"avatar-img lazy"} data-src={"https://www.gravatar.com/avatar/484a75e037f391b3e257a8ebf58ed499?s=100&d=identicon&r=g"} width="20" height="20" style={{ borderRadius: "50%", objectFit: "cover", marginRight: "-8px", border: "1px solid rgb(255, 255, 255)" }} alt="Attendee" loading="lazy" src="/site-assets/7a91dbf0d042e0dd.png" /><img className={"avatar-img lazy"} data-src={"https://www.gravatar.com/avatar/3e680e3419607c6b62897caed9c90627?s=800&d=identicon&r=g"} width="20" height="20" style={{ borderRadius: "50%", objectFit: "cover", marginRight: "-8px", border: "1px solid rgb(255, 255, 255)" }} alt="Attendee" loading="lazy" src="/site-assets/8b6b8f7bc220817e.png" /></div>
                      <div className={"interested"}>
                        <span>74+ Interested</span>
                      </div>
                    </div>
                    <div className={"divider"} style={{ fontSize: "13px", fontWeight: "400", color: "var(--gray-300)", margin: "0px 10px" }}>|</div>
                    <div className={"price-container"}>
                      <div className={"price"} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><i className={"icon icon-ticket-empty"} style={{ fontSize: "14px", color: "var(--gray-700)" }} /><span>Free</span></div>
                    </div>
                  </div>
                </div>
              </li>
              <li className={"event-card event-card-link"}>
                <div className={"banner-cont php-banner-cont lazy"} style={{ display: "block", backgroundImage: "url(\"/site-assets/64ae391c90bbca1f.avif\")" }}>
                  <div className={"ellipsis-btn-join-event"}>
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <i className={"track icon-star-empty event-interested-action"} title="I'm interested" />
                  </div>
                </div>
                <div className={"meta"}>
                  <div className={"meta-top"}>
                    <div className={"meta-top-info"} style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
                      <div className={"date"} style={{ fontSize: "13px", fontWeight: "400", color: "var(--gray-500)", marginRight: "10px", textTransform: "capitalize" }}>
      													Mon, 02 Nov • 09:30 PM											</div>
                    </div>
                  </div>
                  <div className={"meta-middle"}>
                    <div className={"title"} style={{ overflowWrap: "break-word" }}>
                      <a href="/ahmedabad/monday-joke-lab-comedy-open-mic-tickets/80004024621748?ref=hp-worldwide-event" target="_blank" title="Monday Joke Lab - Comedy Open Mic">
                        <h3>
      							Monday Joke Lab - Comedy Open Mic						</h3>
                      </a>
                    </div>
                    <div className={"location dotdotted"} style={{ fontSize: "14px", lineHeight: "21px", fontWeight: "400", color: "var(--gray-500)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: "12px" }}>
      											Ahmedabad, India									</div>
                  </div>
                  <div className={"meta-bottom"}>
                    <div className={"interested-container"} style={{ display: "flex", alignItems: "center" }}>
                      <div className={"\x74op-3-avatars"} style={{ display: "flex", alignItems: "center", marginRight: "16px" }}><img className={"avatar-img lazy"} data-src="https://lh3.googleusercontent.com/a/ACg8ocKwqpM7e9Ykv8AbnKRgyfitngM_5Fxo9XJz3oO-E9sipqYfcjzfKw=s96-c?sz=200" width="20" height="20" style={{ borderRadius: "50%", objectFit: "cover", marginRight: "-8px", border: "1px solid rgb(255, 255, 255)" }} alt="Attendee" loading="lazy" src="/site-assets/045ebc8355e2f379.jpg" /><img className={"avatar-img lazy"} data-src="https://lh3.googleusercontent.com/a/ACg8ocJ_cbvZ07Sz-5YprQnSnvr6YY04CfNDzFUVJqCxn75ZDy_UgLc=s96-c?sz=200" width="20" height="20" style={{ borderRadius: "50%", objectFit: "cover", marginRight: "-8px", border: "1px solid rgb(255, 255, 255)" }} alt="Attendee" loading="lazy" src="/site-assets/a37be5511814629c.png" /><img className={"avatar-img lazy"} data-src={"https://www.gravatar.com/avatar/8063ba5ae9fd3b24ed4061c097b7c67b?s=100&d=identicon&r=g"} width="20" height="20" style={{ borderRadius: "50%", objectFit: "cover", marginRight: "-8px", border: "1px solid rgb(255, 255, 255)" }} alt="Attendee" loading="lazy" src="/site-assets/5e2a6adad29a701c.png" /></div>
                      <div className={"interested"}>
                        <span>9+ Interested</span>
                      </div>
                    </div>
                    <div className={"divider"} style={{ fontSize: "13px", fontWeight: "400", color: "var(--gray-300)", margin: "0px 10px" }}>|</div>
                    <div className={"price-container"}>
                      <div className={"price"} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><i className={"icon icon-ticket-empty"} style={{ fontSize: "14px", color: "var(--gray-700)" }} /><span>Free</span></div>
                    </div>
                  </div>
                </div>
              </li>
              <li className={"event-card event-card-link"}>
                <div className={"banner-cont php-banner-cont lazy"} style={{ display: "block", backgroundImage: "url(\"/site-assets/508d612e521f3311.avif\")" }}>
                  <div className={"ellipsis-btn-join-event"}>
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <i className={"track icon-star-empty event-interested-action"} title="I'm interested" />
                  </div>
                </div>
                <div className={"meta"}>
                  <div className={"meta-top"}>
                    <div className={"meta-top-info"} style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
                      <div className={"date"} style={{ fontSize: "13px", fontWeight: "400", color: "var(--gray-500)", marginRight: "10px", textTransform: "capitalize" }}>
      													Tue, 10 Nov • 10:00 AM											</div>
                    </div>
                  </div>
                  <div className={"meta-middle"}>
                    <div className={"title"} style={{ overflowWrap: "break-word" }}>
                      <a href="/tashkent/22nd-international-exhibition-transport-and-logistics-translogistica-uzbekistan-2026-tickets/80001320795115?ref=hp-worldwide-event" target="_blank" title={"22nd International Exhibition &quotTransport and Logistics  TransLogistica Uzbekistan 2026\""}>
                        <h3>
      							22nd International Exhibition "Transport and Logistics – TransLogistica Uzbekistan 2026"						</h3>
                      </a>
                    </div>
                    <div className={"location dotdotted"} style={{ fontSize: "14px", lineHeight: "21px", fontWeight: "400", color: "var(--gray-500)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: "12px" }}>
      											Tashkent, Uzbekistan									</div>
                  </div>
                  <div className={"meta-bottom"}>
                    <div className={"interested-container"} style={{ display: "flex", alignItems: "center" }} />
                    <div className={"price-container"}>
                      <div className={"price"} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><i className={"icon icon-ticket-empty"} style={{ fontSize: "14px", color: "var(--gray-700)" }} /><span>Free</span></div>
                    </div>
                  </div>
                </div>
              </li>
              <li className={"event-card event-card-link"}>
                <div className={"banner-cont php-banner-cont lazy"} style={{ display: "block", backgroundImage: "url(\"/site-assets/200125fa6f1fc49a.avif\")" }}>
                  <div className={"ellipsis-btn-join-event"}>
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <i className={"track icon-star-empty event-interested-action"} title="I'm interested" />
                  </div>
                </div>
                <div className={"meta"}>
                  <div className={"meta-top"}>
                    <div className={"meta-top-info"} style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
                      <div className={"date"} style={{ fontSize: "13px", fontWeight: "400", color: "var(--gray-500)", marginRight: "10px", textTransform: "capitalize" }}>
      													Sun, 01 Nov • 08:30 PM											</div>
                    </div>
                  </div>
                  <div className={"meta-middle"}>
                    <div className={"title"} style={{ overflowWrap: "break-word" }}>
                      <a href="/online/overview-session-of-the-ai-powered-ux-ui-course-tickets/80003582926304?ref=hp-worldwide-event" target="_blank" title="Overview session of the AI-Powered UXUI course">
                        <h3>
      							Overview session of the AI-Powered UX/UI course						</h3>
                      </a>
                    </div>
                    <div className={"location dotdotted"} style={{ fontSize: "14px", lineHeight: "21px", fontWeight: "400", color: "var(--gray-500)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: "12px" }}>
      											Online									</div>
                  </div>
                  <div className={"meta-bottom"}>
                    <div className={"interested-container"} style={{ display: "flex", alignItems: "center" }}>
                      <div className={"\x74op-3-avatars"} style={{ display: "flex", alignItems: "center", marginRight: "16px" }}><img className={"avatar-img lazy"} data-src={"https://www.gravatar.com/avatar/7e8a0c924644fc710e547bf7c77b4001?s=100&d=identicon&r=g"} width="20" height="20" style={{ borderRadius: "50%", objectFit: "cover", marginRight: "-8px", border: "1px solid rgb(255, 255, 255)" }} alt="Attendee" loading="lazy" src="/site-assets/6e1eb6828d61399c.png" /><img className={"avatar-img lazy"} data-src="https://lh3.googleusercontent.com/a/ACg8ocIqhaguhXRaTbul_WSsasxxr5yDfjaGwACrmaDzwG56beOUNEIx=s96-c?sz=200" width="20" height="20" style={{ borderRadius: "50%", objectFit: "cover", marginRight: "-8px", border: "1px solid rgb(255, 255, 255)" }} alt="Attendee" loading="lazy" src="/site-assets/58cbdf70e45bbefc.jpg" /><img className={"avatar-img lazy"} data-src={"https://www.gravatar.com/avatar/d4a712fca27c82634b102dd89abef4ee?s=100&d=identicon&r=g"} width="20" height="20" style={{ borderRadius: "50%", objectFit: "cover", marginRight: "-8px", border: "1px solid rgb(255, 255, 255)" }} alt="Attendee" loading="lazy" src="/site-assets/e5ee266616358846.png" /></div>
                      <div className={"interested"}>
                        <span>31+ Interested</span>
                      </div>
                    </div>
                    <div className={"divider"} style={{ fontSize: "13px", fontWeight: "400", color: "var(--gray-300)", margin: "0px 10px" }}>|</div>
                    <div className={"price-container"}>
                      <div className={"price"} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><i className={"icon icon-ticket-empty"} style={{ fontSize: "14px", color: "var(--gray-700)" }} /><span>Free</span></div>
                    </div>
                  </div>
                </div>
              </li>
              <li className={"event-card event-card-link"}>
                <div className={"banner-cont php-banner-cont lazy"} style={{ display: "block", backgroundImage: "url(\"/site-assets/c7d27ba8a2dcbb61.avif\")" }}>
                  <div className={"ellipsis-btn-join-event"}>
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <div className={"interest-animate"} />
                    <i className={"track icon-star-empty event-interested-action"} title="I'm interested" />
                  </div>
                </div>
                <div className={"meta"}>
                  <div className={"meta-top"}>
                    <div className={"meta-top-info"} style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
                      <div className={"date"} style={{ fontSize: "13px", fontWeight: "400", color: "var(--gray-500)", marginRight: "10px", textTransform: "capitalize" }}>
      													Tue, 03 Nov • 10:00 AM											</div>
                    </div>
                  </div>
                  <div className={"meta-middle"}>
                    <div className={"title"} style={{ overflowWrap: "break-word" }}>
                      <a href="/bangkok/cosmex-2026-tickets/80003796903727?ref=hp-worldwide-event" target="_blank" title="COSMEX 2026">
                        <h3>
      							COSMEX 2026						</h3>
                      </a>
                    </div>
                    <div className={"location dotdotted"} style={{ fontSize: "14px", lineHeight: "21px", fontWeight: "400", color: "var(--gray-500)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: "12px" }}>
      											Bangkok, Thailand									</div>
                  </div>
                  <div className={"meta-bottom"}>
                    <div className={"interested-container"} style={{ display: "flex", alignItems: "center" }} />
                    <div className={"price-container"}>
                      <div className={"price"} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><i className={"icon icon-ticket-empty"} style={{ fontSize: "14px", color: "var(--gray-700)" }} /><span>Free</span></div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className={"memories-wrapper"}>
        <div>
          <div className={"memories-header"}>
            <h1
              className={"memories-title"}
              style={{
                fontFamily: '"Bricolage Grotesque", "Trapvoid", sans-serif',
                fontWeight: 800,
                letterSpacing: "-0.03em",
                textTransform: "none",
                color: "var(--vibe-navy, #07133A)",
              }}
            >
              The Moments That Make Vibe.
            </h1>
            <p className={"memories-subtitle"}>Real people. Real experiences. Unforgettable moments.</p>
          </div>
          <MemoriesMarquee>
              <div className={"memories-column"}>
                <div className={"memories-card memories-card-short"}>
                  <img src="/site-assets/6276c0ed1177f8f6.webp" alt="Wodan De Mey" loading="lazy" className={"memories-card-image"} />
                  <div className={"memories-card-overlay"}>
                    <img src="/site-assets/6a1b0bb843780745.bin" alt="Wodan De Mey" loading="lazy" className={"memories-avatar memories-avatar-small lazy"} />
                    <div>
                      <div className={"memories-user-name memories-user-name-light"}>
                                                      Wodan De Mey
                                                  </div>
                      <div className={"memories-user-time memories-user-time-light"}>
                                                      Today
                                                  </div>
                    </div>
                  </div>
                  <div className={"memories-event-info"}>
                    <div className={"memories-event-icon"}>
                      <i className={"icon icon-calendar-empty"} />
                    </div>
                    <div className={"memories-event-name"}>Nacht Van De Verloren Zielen (Halloween in Doel)</div>
                    <div className={"memories-event-location"}>
                                                Den Atelier De Nijs
                                              </div>
                  </div>
                </div>
                <div className={"memories-card memories-card-tall"}>
                  <img src="/site-assets/b524f86bf18e37a2.webp" alt="helen richardson" loading="lazy" className={"memories-card-image"} />
                  <div className={"memories-card-overlay"}>
                    <img src="/site-assets/a90931aa1baae3a8.webp" alt="helen richardson" loading="lazy" className={"memories-avatar memories-avatar-small lazy"} />
                    <div>
                      <div className={"memories-user-name memories-user-name-light"}>
                                                      helen richardson
                                                  </div>
                      <div className={"memories-user-time memories-user-time-light"}>
                                                      Today
                                                  </div>
                    </div>
                  </div>
                  <div className={"memories-event-info"}>
                    <div className={"memories-event-icon"}>
                      <i className={"icon icon-calendar-empty"} />
                    </div>
                    <div className={"memories-event-name"}>Halloween Spectacular</div>
                    <div className={"memories-event-location"}>
                                                Cheers Bar &amp; Restaurant Eagles Nest
                                              </div>
                  </div>
                </div>
              </div>
              <div className={"memories-column"}>
                <div className={"memories-card memories-card-review memories-card-tall"}>
                  <div className={"memories-card-review-content"}>
                    <div style={{ padding: "15px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                      <div className={"memories-stars"}>
                        <i className={"icon-star icon memories-star-filled"} />
                        <i className={"icon-star icon memories-star-filled"} />
                        <i className={"icon-star icon memories-star-filled"} />
                        <i className={"icon-star icon memories-star-filled"} />
                        <i className={"icon-star icon memories-star-filled"} />
                      </div>
                      <p className={"memories-review-text"}>"WONDERFUL EVENT..."</p>
                    </div>
                    <div className={"memories-user-info"} style={{ padding: "15px" }}>
                      <img src="/site-assets/8438e0247fc8c361.png" alt="keith e sherrill" loading="lazy" className={"memories-avatar lazy"} />
                      <div>
                        <div className={"memories-user-name"}>keith e sherrill</div>
                        <div className={"memories-user-time"}>Today</div>
                      </div>
                    </div>
                  </div>
                  <div className={"memories-event-info"}>
                    <div className={"memories-event-icon"}>
                      <i className={"icon icon-calendar-empty"} />
                    </div>
                    <div className={"memories-event-name"}>Sweet Street Trunk or Treat &amp; Festival</div>
                    <div className={"memories-event-location"}>
                                                  150 N Research Campus Dr,...
                                              </div>
                  </div>
                </div>
                <div className={"memories-card memories-card-short"}>
                  <img src="/site-assets/56630553072b399f.webp" alt="Seema Surani" loading="lazy" className={"memories-card-image"} />
                  <div className={"memories-card-overlay"}>
                    <img src="/site-assets/6cf099b6c43f2869.jpg" alt="Seema Surani" loading="lazy" className={"memories-avatar memories-avatar-small lazy"} />
                    <div>
                      <div className={"memories-user-name memories-user-name-light"}>
                                                      Seema Surani
                                                  </div>
                      <div className={"memories-user-time memories-user-time-light"}>
                                                      Today
                                                  </div>
                    </div>
                  </div>
                  <div className={"memories-event-info"}>
                    <div className={"memories-event-icon"}>
                      <i className={"icon icon-calendar-empty"} />
                    </div>
                    <div className={"memories-event-name"}>Chaar Diwaari - Live In Ahmedabad</div>
                    <div className={"memories-event-location"}>
                                                Asterix, Sarkhej - Gandhinagar...
                                              </div>
                  </div>
                </div>
              </div>
              <div className={"memories-column"}>
                <div className={"memories-card memories-card-short"}>
                  <img src="/site-assets/e39c2aadf201ac0a.webp" alt="Saurbh Tiwari" loading="lazy" className={"memories-card-image"} />
                  <div className={"memories-card-overlay"}>
                    <img src="/site-assets/07b8bdfebb342a90.png" alt="Saurbh Tiwari" loading="lazy" className={"memories-avatar memories-avatar-small lazy"} />
                    <div>
                      <div className={"memories-user-name memories-user-name-light"}>
                                                      Saurbh Tiwari
                                                  </div>
                      <div className={"memories-user-time memories-user-time-light"}>
                                                      Today
                                                  </div>
                    </div>
                  </div>
                  <div className={"memories-event-info"}>
                    <div className={"memories-event-icon"}>
                      <i className={"icon icon-calendar-empty"} />
                    </div>
                    <div className={"memories-event-name"}>3rd EDITION DELHI HALF MARATHON – 2026</div>
                    <div className={"memories-event-location"}>
                                                JLN Stadium, CGO Complex,...
                                              </div>
                  </div>
                </div>
                <div className={"memories-card memories-card-short"}>
                  <img src="/site-assets/3872a6fa9a8b3028.webp" alt="gail lodge" loading="lazy" className={"memories-card-image"} />
                  <div className={"memories-card-overlay"}>
                    <img src="/site-assets/d21143941473afbb.png" alt="gail lodge" loading="lazy" className={"memories-avatar memories-avatar-small lazy"} />
                    <div>
                      <div className={"memories-user-name memories-user-name-light"}>
                                                      gail lodge
                                                  </div>
                      <div className={"memories-user-time memories-user-time-light"}>
                                                      Today
                                                  </div>
                    </div>
                  </div>
                  <div className={"memories-event-info"}>
                    <div className={"memories-event-icon"}>
                      <i className={"icon icon-calendar-empty"} />
                    </div>
                    <div className={"memories-event-name"}>VENUS EMPOWERMENT Bliss Rites of the Shamanic Bee</div>
                    <div className={"memories-event-location"}>
                                                cSPACE Marda Loop
                                              </div>
                  </div>
                </div>
              </div>
              <div className={"memories-column"}>
                <div className={"memories-card memories-card-short"}>
                  <img src="/site-assets/bb9b3db9e51f098b.webp" alt="Jigar Trivedi" loading="lazy" className={"memories-card-image"} />
                  <div className={"memories-card-overlay"}>
                    <img src="/site-assets/2504afadb62a884a.jpg" alt="Jigar Trivedi" loading="lazy" className={"memories-avatar memories-avatar-small lazy"} />
                    <div>
                      <div className={"memories-user-name memories-user-name-light"}>
                                                      Jigar Trivedi
                                                  </div>
                      <div className={"memories-user-time memories-user-time-light"}>
                                                      Today
                                                  </div>
                    </div>
                  </div>
                  <div className={"memories-event-info"}>
                    <div className={"memories-event-icon"}>
                      <i className={"icon icon-calendar-empty"} />
                    </div>
                    <div className={"memories-event-name"}>ROCKWOOL Bharuch Half Marathon Season 5</div>
                    <div className={"memories-event-location"}>
                                                Bharuch
                                              </div>
                  </div>
                </div>
                <div className={"memories-card memories-card-review memories-card-tall"}>
                  <div className={"memories-card-review-content"}>
                    <div style={{ padding: "15px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                      <div className={"memories-stars"}>
                        <i className={"icon-star icon memories-star-filled"} />
                        <i className={"icon-star icon memories-star-filled"} />
                        <i className={"icon-star icon memories-star-filled"} />
                        <i className={"icon-star icon memories-star-filled"} />
                        <i className={"icon-star icon memories-star-filled"} />
                      </div>
                      <p className={"memories-review-text"}>"How much the kids enjoyed it!..."</p>
                    </div>
                    <div className={"memories-user-info"} style={{ padding: "15px" }}>
                      <img src="/site-assets/bc0025e8d4119c78.bin" alt="Jacqueline Parker" loading="lazy" className={"memories-avatar lazy"} />
                      <div>
                        <div className={"memories-user-name"}>Jacqueline Parker</div>
                        <div className={"memories-user-time"}>Today</div>
                      </div>
                    </div>
                  </div>
                  <div className={"memories-event-info"}>
                    <div className={"memories-event-icon"}>
                      <i className={"icon icon-calendar-empty"} />
                    </div>
                    <div className={"memories-event-name"}>Scary Tales Haunted Maze</div>
                    <div className={"memories-event-location"}>
                                                  Florence Events Center
                                              </div>
                  </div>
                </div>
              </div>
              <div className={"memories-column"}>
                <div className={"memories-card memories-card-short"}>
                  <img src="/site-assets/2eae0bf0c2d6265e.webp" alt="Debby willoughby" loading="lazy" className={"memories-card-image"} />
                  <div className={"memories-card-overlay"}>
                    <img src="/site-assets/646ae84bbe485ceb.webp" alt="Debby willoughby" loading="lazy" className={"memories-avatar memories-avatar-small lazy"} />
                    <div>
                      <div className={"memories-user-name memories-user-name-light"}>
                                                      Debby willoughby
                                                  </div>
                      <div className={"memories-user-time memories-user-time-light"}>
                                                      Today
                                                  </div>
                    </div>
                  </div>
                  <div className={"memories-event-info"}>
                    <div className={"memories-event-icon"}>
                      <i className={"icon icon-calendar-empty"} />
                    </div>
                    <div className={"memories-event-name"}>HALLOWEEN TATTOO FLASH PARTY</div>
                    <div className={"memories-event-location"}>
                                                8430 N. 123rd East Ave., Owasso, OK
                                              </div>
                  </div>
                </div>
              </div>
              <div className={"memories-column"}>
                <div className={"memories-card memories-card-short"}>
                  <img src="/site-assets/4a62cf1e64c98d59.webp" alt="Rae Jean Walker" loading="lazy" className={"memories-card-image"} />
                  <div className={"memories-card-overlay"}>
                    <img src="/site-assets/23c33611f25ec38f.bin" alt="Rae Jean Walker" loading="lazy" className={"memories-avatar memories-avatar-small lazy"} />
                    <div>
                      <div className={"memories-user-name memories-user-name-light"}>
                                                      Rae Jean Walker
                                                  </div>
                      <div className={"memories-user-time memories-user-time-light"}>
                                                      1 day ago
                                                  </div>
                    </div>
                  </div>
                  <div className={"memories-event-info"}>
                    <div className={"memories-event-icon"}>
                      <i className={"icon icon-calendar-empty"} />
                    </div>
                    <div className={"memories-event-name"}>Naples North Collier Regional Park Boo-Tacular Halloween</div>
                    <div className={"memories-event-location"}>
                                                North Collier Regional Park
                                              </div>
                  </div>
                </div>
                <div className={"memories-card memories-card-tall"}>
                  <img src="/site-assets/357ae678b8a79c43.webp" alt="Sash Oliveros" loading="lazy" className={"memories-card-image"} />
                  <div className={"memories-card-overlay"}>
                    <img src="/site-assets/f598f9cc074d0523.png" alt="Sash Oliveros" loading="lazy" className={"memories-avatar memories-avatar-small lazy"} />
                    <div>
                      <div className={"memories-user-name memories-user-name-light"}>
                                                      Sash Oliveros
                                                  </div>
                      <div className={"memories-user-time memories-user-time-light"}>
                                                      1 day ago
                                                  </div>
                    </div>
                  </div>
                  <div className={"memories-event-info"}>
                    <div className={"memories-event-icon"}>
                      <i className={"icon icon-calendar-empty"} />
                    </div>
                    <div className={"memories-event-name"}>Trunk or Treat</div>
                    <div className={"memories-event-location"}>
                                                111 Lake Josephine Dr, Sebring, FL
                                              </div>
                  </div>
                </div>
              </div>
              <div className={"memories-column"}>
                <div className={"memories-card memories-card-review memories-card-tall"}>
                  <div className={"memories-card-review-content"}>
                    <div style={{ padding: "15px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                      <div className={"memories-stars"}>
                        <i className={"icon-star icon memories-star-filled"} />
                        <i className={"icon-star icon memories-star-filled"} />
                        <i className={"icon-star icon memories-star-filled"} />
                        <i className={"icon-star icon memories-star-filled"} />
                        <i className={"icon-star icon memories-star-filled"} />
                      </div>
                      <p className={"memories-review-text"}>"Thanks to haunted garage organiser it's an amazing experienc..."</p>
                    </div>
                    <div className={"memories-user-info"} style={{ padding: "15px" }}>
                      <img src="/site-assets/1e60915ec9910432.png" alt="Ajmein Shaikh" loading="lazy" className={"memories-avatar lazy"} />
                      <div>
                        <div className={"memories-user-name"}>Ajmein Shaikh</div>
                        <div className={"memories-user-time"}>Today</div>
                      </div>
                    </div>
                  </div>
                  <div className={"memories-event-info"}>
                    <div className={"memories-event-icon"}>
                      <i className={"icon icon-calendar-empty"} />
                    </div>
                    <div className={"memories-event-name"}>HAUNTED GARAGE - Horror Meets Horsepower</div>
                    <div className={"memories-event-location"}>
                                                  Champions Arena 
                                              </div>
                  </div>
                </div>
                <div className={"memories-card memories-card-short"}>
                  <img src="/site-assets/0479b7d4662b15e4.webp" alt="Deborah Stevens" loading="lazy" className={"memories-card-image"} />
                  <div className={"memories-card-overlay"}>
                    <img src="/site-assets/aa15bdca49adb8aa.bin" alt="Deborah Stevens" loading="lazy" className={"memories-avatar memories-avatar-small lazy"} />
                    <div>
                      <div className={"memories-user-name memories-user-name-light"}>
                                                      Deborah Stevens
                                                  </div>
                      <div className={"memories-user-time memories-user-time-light"}>
                                                      1 day ago
                                                  </div>
                    </div>
                  </div>
                  <div className={"memories-event-info"}>
                    <div className={"memories-event-icon"}>
                      <i className={"icon icon-calendar-empty"} />
                    </div>
                    <div className={"memories-event-name"}>Hat  Burning Workshop</div>
                    <div className={"memories-event-location"}>
                                                Mitchell Katz Winery
                                              </div>
                  </div>
                </div>
              </div>
              <div className={"memories-column"}>
                <div className={"memories-card memories-card-short"}>
                  <img src="/site-assets/e7d7ac1b8c730d92.webp" alt="Harold Alston" loading="lazy" className={"memories-card-image"} />
                  <div className={"memories-card-overlay"}>
                    <img src="/site-assets/476f3c165c6b92e0.png" alt="Harold Alston" loading="lazy" className={"memories-avatar memories-avatar-small lazy"} />
                    <div>
                      <div className={"memories-user-name memories-user-name-light"}>
                                                      Harold Alston
                                                  </div>
                      <div className={"memories-user-time memories-user-time-light"}>
                                                      1 day ago
                                                  </div>
                    </div>
                  </div>
                  <div className={"memories-event-info"}>
                    <div className={"memories-event-icon"}>
                      <i className={"icon icon-calendar-empty"} />
                    </div>
                    <div className={"memories-event-name"}>Messiah Community Church Trunk or Treat</div>
                    <div className={"memories-event-location"}>
                                                Messiah Community Church
                                              </div>
                  </div>
                </div>
                <div className={"memories-card memories-card-short"}>
                  <img src="/site-assets/2eb15b09bebeadf3.webp" alt="Pat Charters" loading="lazy" className={"memories-card-image"} />
                  <div className={"memories-card-overlay"}>
                    <img src="/site-assets/a7ab618466eee5f7.png" alt="Pat Charters" loading="lazy" className={"memories-avatar memories-avatar-small lazy"} />
                    <div>
                      <div className={"memories-user-name memories-user-name-light"}>
                                                      Pat Charters
                                                  </div>
                      <div className={"memories-user-time memories-user-time-light"}>
                                                      1 day ago
                                                  </div>
                    </div>
                  </div>
                  <div className={"memories-event-info"}>
                    <div className={"memories-event-icon"}>
                      <i className={"icon icon-calendar-empty"} />
                    </div>
                    <div className={"memories-event-name"}>Trunk or Treat</div>
                    <div className={"memories-event-location"}>
                                                1602 N 1125 East Rd, Monticello, IL
                                              </div>
                  </div>
                </div>
              </div>
              <div className={"memories-column"}>
                <div className={"memories-card memories-card-short"}>
                  <img src="/site-assets/fbc44ccef177f14d.webp" alt="softly becoming." loading="lazy" className={"memories-card-image"} />
                  <div className={"memories-card-overlay"}>
                    <img src="/site-assets/dab0142d9ba8afe1.png" alt="softly becoming." loading="lazy" className={"memories-avatar memories-avatar-small lazy"} />
                    <div>
                      <div className={"memories-user-name memories-user-name-light"}>
                                                      softly becoming.
                                                  </div>
                      <div className={"memories-user-time memories-user-time-light"}>
                                                      1 day ago
                                                  </div>
                    </div>
                  </div>
                  <div className={"memories-event-info"}>
                    <div className={"memories-event-icon"}>
                      <i className={"icon icon-calendar-empty"} />
                    </div>
                    <div className={"memories-event-name"}>Agentic AI: Zero to Hero - From LLM Fundamentals...</div>
                    <div className={"memories-event-location"}>
                                                MUST AI Café
                                              </div>
                  </div>
                </div>
                <div className={"memories-card memories-card-review memories-card-tall"}>
                  <div className={"memories-card-review-content"}>
                    <div style={{ padding: "15px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                      <div className={"memories-stars"}>
                        <i className={"icon-star icon memories-star-filled"} />
                        <i className={"icon-star icon memories-star-filled"} />
                        <i className={"icon-star icon memories-star-filled"} />
                        <i className={"icon-star icon memories-star-filled"} />
                        <i className={"icon-star icon memories-star-filled"} />
                      </div>
                      <p className={"memories-review-text"}>"Amazing band and creative costumes.... we partied till after..."</p>
                    </div>
                    <div className={"memories-user-info"} style={{ padding: "15px" }}>
                      <img src="/site-assets/7ab189e1c423aaca.bin" alt="Curran Malhotra" loading="lazy" className={"memories-avatar lazy"} />
                      <div>
                        <div className={"memories-user-name"}>Curran Malhotra</div>
                        <div className={"memories-user-time"}>Today</div>
                      </div>
                    </div>
                  </div>
                  <div className={"memories-event-info"}>
                    <div className={"memories-event-icon"}>
                      <i className={"icon icon-calendar-empty"} />
                    </div>
                    <div className={"memories-event-name"}>Halloween Party featuring Bloo Lagoon!</div>
                    <div className={"memories-event-location"}>
                                                  Redbeard Brewing Company
                                              </div>
                  </div>
                </div>
              </div>
              <div className={"memories-column"}>
                <div className={"memories-card memories-card-tall"}>
                  <img src="/site-assets/3c9d8b7ecbca0c14.webp" alt="Nicole Wingate" loading="lazy" className={"memories-card-image"} />
                  <div className={"memories-card-overlay"}>
                    <img src="/site-assets/c3d2d691c964e8ac.jpg" alt="Nicole Wingate" loading="lazy" className={"memories-avatar memories-avatar-small lazy"} />
                    <div>
                      <div className={"memories-user-name memories-user-name-light"}>
                                                      Nicole Wingate
                                                  </div>
                      <div className={"memories-user-time memories-user-time-light"}>
                                                      1 day ago
                                                  </div>
                    </div>
                  </div>
                  <div className={"memories-event-info"}>
                    <div className={"memories-event-icon"}>
                      <i className={"icon icon-calendar-empty"} />
                    </div>
                    <div className={"memories-event-name"}>Seventh Annual Fall-a-Palooza</div>
                    <div className={"memories-event-location"}>
                                                1001 Fort Crook Rd N,...
                                              </div>
                  </div>
                </div>
                <div className={"memories-card memories-card-short"}>
                  <img src="/site-assets/84742926ac34f5b8.webp" alt="Elaine Burg" loading="lazy" className={"memories-card-image"} />
                  <div className={"memories-card-overlay"}>
                    <img src="/site-assets/cfa018d0b8d1c7b1.jpg" alt="Elaine Burg" loading="lazy" className={"memories-avatar memories-avatar-small lazy"} />
                    <div>
                      <div className={"memories-user-name memories-user-name-light"}>
                                                      Elaine Burg
                                                  </div>
                      <div className={"memories-user-time memories-user-time-light"}>
                                                      1 day ago
                                                  </div>
                    </div>
                  </div>
                  <div className={"memories-event-info"}>
                    <div className={"memories-event-icon"}>
                      <i className={"icon icon-calendar-empty"} />
                    </div>
                    <div className={"memories-event-name"}>SMP October 29th, 2-4pm, Resin Wave, Choose Your...</div>
                    <div className={"memories-event-location"}>
                                                17689 Coastal Hwy, Lewes, DE,...
                                              </div>
                  </div>
                </div>
              </div>
              <div className={"memories-column"}>
                <div className={"memories-card memories-card-short"}>
                  <img src="/site-assets/420442b3f37330e0.webp" alt="Alastair McMurdo" loading="lazy" className={"memories-card-image"} />
                  <div className={"memories-card-overlay"}>
                    <img src="/site-assets/e2383acdece2551f.jpg" alt="Alastair McMurdo" loading="lazy" className={"memories-avatar memories-avatar-small lazy"} />
                    <div>
                      <div className={"memories-user-name memories-user-name-light"}>
                                                      Alastair McMurdo
                                                  </div>
                      <div className={"memories-user-time memories-user-time-light"}>
                                                      2 days ago
                                                  </div>
                    </div>
                  </div>
                  <div className={"memories-event-info"}>
                    <div className={"memories-event-icon"}>
                      <i className={"icon icon-calendar-empty"} />
                    </div>
                    <div className={"memories-event-name"}>John Lydon: I Could Be Wrong, I Could Be Right</div>
                    <div className={"memories-event-location"}>
                                                The Atkinson
                                              </div>
                  </div>
                </div>
                <div className={"memories-card memories-card-tall"}>
                  <img src="/site-assets/257bf16cf894e742.webp" alt="sabrina deardeuff" loading="lazy" className={"memories-card-image"} />
                  <div className={"memories-card-overlay"}>
                    <img src="/site-assets/d21143941473afbb.png" alt="sabrina deardeuff" loading="lazy" className={"memories-avatar memories-avatar-small lazy"} />
                    <div>
                      <div className={"memories-user-name memories-user-name-light"}>
                                                      sabrina deardeuff
                                                  </div>
                      <div className={"memories-user-time memories-user-time-light"}>
                                                      2 days ago
                                                  </div>
                    </div>
                  </div>
                  <div className={"memories-event-info"}>
                    <div className={"memories-event-icon"}>
                      <i className={"icon icon-calendar-empty"} />
                    </div>
                    <div className={"memories-event-name"}>Vend-or-Treat at the Republic Farmers Market</div>
                    <div className={"memories-event-location"}>
                                                1225 US 60 , Republic, MO,...
                                              </div>
                  </div>
                </div>
              </div>
              <div className={"memories-column"}>
                <div className={"memories-card memories-card-review memories-card-tall"}>
                  <div className={"memories-card-review-content"}>
                    <div style={{ padding: "15px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                      <div className={"memories-stars"}>
                        <i className={"icon-star icon memories-star-filled"} />
                        <i className={"icon-star icon memories-star-filled"} />
                        <i className={"icon-star icon memories-star-filled"} />
                        <i className={"icon-star icon memories-star-filled"} />
                        <i className={"icon-star icon memories-star-filled"} />
                      </div>
                      <p className={"memories-review-text"}>"Very talented young people putting on a well choreographed e..."</p>
                    </div>
                    <div className={"memories-user-info"} style={{ padding: "15px" }}>
                      <img src="/site-assets/1dc355484a884a58.jpg" alt="John Thornton" loading="lazy" className={"memories-avatar lazy"} />
                      <div>
                        <div className={"memories-user-name"}>John Thornton</div>
                        <div className={"memories-user-time"}>Today</div>
                      </div>
                    </div>
                  </div>
                  <div className={"memories-event-info"}>
                    <div className={"memories-event-icon"}>
                      <i className={"icon icon-calendar-empty"} />
                    </div>
                    <div className={"memories-event-name"}>Fright Night - Halloween Circus Celebration</div>
                    <div className={"memories-event-location"}>
                                                  The Acorn Theatre, Parade St,...
                                              </div>
                  </div>
                </div>
                <div className={"memories-card memories-card-short"}>
                  <img src="/site-assets/f4a7ed4b640f2235.webp" alt="leena hagert" loading="lazy" className={"memories-card-image"} />
                  <div className={"memories-card-overlay"}>
                    <img src="/site-assets/79162411471950ad.png" alt="leena hagert" loading="lazy" className={"memories-avatar memories-avatar-small lazy"} />
                    <div>
                      <div className={"memories-user-name memories-user-name-light"}>
                                                      leena hagert
                                                  </div>
                      <div className={"memories-user-time memories-user-time-light"}>
                                                      2 days ago
                                                  </div>
                    </div>
                  </div>
                  <div className={"memories-event-info"}>
                    <div className={"memories-event-icon"}>
                      <i className={"icon icon-calendar-empty"} />
                    </div>
                    <div className={"memories-event-name"}>Pyssla med Komtek 29 oktober! </div>
                    <div className={"memories-event-location"}>
                                                Krämaren
                                              </div>
                  </div>
                </div>
              </div>
              <div className={"memories-column"}>
                <div className={"memories-card memories-card-short"}>
                  <img src="/site-assets/7fbbbf336e391aa9.webp" alt="Ousman Mahammed mahie" loading="lazy" className={"memories-card-image"} />
                  <div className={"memories-card-overlay"}>
                    <img alt="Ousman Mahammed mahie" loading="lazy" className={"memories-avatar memories-avatar-small lazy"} />
                    <div>
                      <div className={"memories-user-name memories-user-name-light"}>
                                                      Ousman Mahammed mahie
                                                  </div>
                      <div className={"memories-user-time memories-user-time-light"}>
                                                      3 days ago
                                                  </div>
                    </div>
                  </div>
                  <div className={"memories-event-info"}>
                    <div className={"memories-event-icon"}>
                      <i className={"icon icon-calendar-empty"} />
                    </div>
                    <div className={"memories-event-name"}>Tromso Marathon</div>
                    <div className={"memories-event-location"}>
                                                Tromsø
                                              </div>
                  </div>
                </div>
                <div className={"memories-card memories-card-short"}>
                  <img src="/site-assets/62651b855918e675.webp" alt="Jocelyn Meineke" loading="lazy" className={"memories-card-image"} />
                  <div className={"memories-card-overlay"}>
                    <img src="/site-assets/0e9df0ca22c07b51.png" alt="Jocelyn Meineke" loading="lazy" className={"memories-avatar memories-avatar-small lazy"} />
                    <div>
                      <div className={"memories-user-name memories-user-name-light"}>
                                                      Jocelyn Meineke
                                                  </div>
                      <div className={"memories-user-time memories-user-time-light"}>
                                                      3 days ago
                                                  </div>
                    </div>
                  </div>
                  <div className={"memories-event-info"}>
                    <div className={"memories-event-icon"}>
                      <i className={"icon icon-calendar-empty"} />
                    </div>
                    <div className={"memories-event-name"}>Trunk Or Treat</div>
                    <div className={"memories-event-location"}>
                                                2324 E. Main Street, Farmington, NM
                                              </div>
                  </div>
                </div>
              </div>
          </MemoriesMarquee>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "38px",
              marginBottom: "12px",
              padding: "0 20px",
              textAlign: "center",
              gap: "12px",
            }}
          >
            <a
              href="https://wa.me/919183123093?text=Hi%20Vibe%2C%20I%20want%20to%20join%20the%20Vibe%20community!"
              target="_blank"
              rel="noopener noreferrer"
              className="vibe-join-community-btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "12px",
                padding: "15px 36px",
                borderRadius: "9999px",
                background: "linear-gradient(135deg, #0a6cf0 0%, #004ecc 100%)",
                color: "#ffffff",
                fontSize: "16px",
                fontWeight: "800",
                textDecoration: "none",
                boxShadow: "0 12px 30px -6px rgba(10, 108, 240, 0.4)",
                transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                cursor: "pointer",
                letterSpacing: "-0.2px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
                e.currentTarget.style.boxShadow = "0 18px 36px -6px rgba(10, 108, 240, 0.55)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "0 12px 30px -6px rgba(10, 108, 240, 0.4)";
              }}
            >
              <Users style={{ width: "20px", height: "20px", color: "#ffffff" }} />
              <span>Join the Community</span>
              <ArrowRight style={{ width: "18px", height: "18px", color: "#ffffff", opacity: 0.9 }} />
            </a>

            <div className="vibe-community-stat" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#64748b", fontWeight: "500" }}>
              <div style={{ display: "flex", marginLeft: "-4px" }}>
                <span style={{ width: "22px", height: "22px", borderRadius: "50%", border: "2px solid #fff", background: "#3b82f6", display: "inline-block", marginRight: "-6px" }} />
                <span style={{ width: "22px", height: "22px", borderRadius: "50%", border: "2px solid #fff", background: "#8b5cf6", display: "inline-block", marginRight: "-6px" }} />
                <span style={{ width: "22px", height: "22px", borderRadius: "50%", border: "2px solid #fff", background: "#10b981", display: "inline-block" }} />
              </div>
              <span>Join 50,000+ creators, artists &amp; attendees sharing unforgettable vibes</span>
            </div>
          </div>
        </div>

      </div>
      <div className={"app-pitch"}>
        <div className={"ap-container"}>
          <div className={"ap-desc"}>
            <div className={"ap-heading"}>
              <h3 className={"ap-gradient"}>Discover Events</h3>
              <h3 className={"ap-dark"}>anywhere, anytime</h3>
              <p className={"ap-sub"}>Download the Vibe app to never miss out the best events near you!</p>
            </div>
            <div className={"ap-download vibe-ap-download"} style={{ flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
                <button
                  type="button"
                  onClick={triggerPwaInstall}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "14px 26px",
                    borderRadius: "16px",
                    background: "linear-gradient(135deg, #0a6cf0 0%, #004ecc 100%)",
                    color: "#ffffff",
                    border: "none",
                    boxShadow: "0 10px 25px -5px rgba(10, 108, 240, 0.4)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 14px 30px -5px rgba(10, 108, 240, 0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 10px 25px -5px rgba(10, 108, 240, 0.4)";
                  }}
                >
                  <Download style={{ width: "22px", height: "22px", color: "#ffffff" }} />
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", opacity: 0.85, lineHeight: 1 }}>
                      Free Instant Install
                    </div>
                    <div style={{ fontSize: "17px", fontWeight: "800", lineHeight: 1.2, marginTop: "2px" }}>
                      Download App
                    </div>
                  </div>
                </button>

                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={triggerPwaInstall}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "12px 18px",
                      borderRadius: "14px",
                      background: "#ffffff",
                      border: "1.5px solid #dbe6f7",
                      color: "#0b1f4b",
                      fontSize: "13px",
                      fontWeight: "700",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#0a6cf0";
                      e.currentTarget.style.backgroundColor = "#f6faff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#dbe6f7";
                      e.currentTarget.style.backgroundColor = "#ffffff";
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3.609 1.814L13.792 12 3.61 22.186a2.38 2.38 0 0 1-.397-.563A2.43 2.43 0 0 1 3 20.407V3.593c0-.435.076-.84.213-1.216.096-.264.23-.5.396-.563zm1.196-.64L15.932 7.43l-3.235 3.235L4.805 1.174zm0 21.652l7.892-9.49 3.235 3.234-11.127 6.256zm12.28-7.925l2.67-1.503a1.95 1.95 0 0 0 0-3.396l-2.67-1.503-3.567 3.701 3.567 2.701z" />
                    </svg>
                    <span>Google Play</span>
                  </button>

                  <button
                    type="button"
                    onClick={triggerPwaInstall}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "12px 18px",
                      borderRadius: "14px",
                      background: "#ffffff",
                      border: "1.5px solid #dbe6f7",
                      color: "#0b1f4b",
                      fontSize: "13px",
                      fontWeight: "700",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#0a6cf0";
                      e.currentTarget.style.backgroundColor = "#f6faff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#dbe6f7";
                      e.currentTarget.style.backgroundColor = "#ffffff";
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.42c.67-.82 1.13-1.96.99-3.1-.98.04-2.19.66-2.88 1.48-.61.71-1.15 1.87-1.01 2.98 1.1.09 2.22-.55 2.9-1.36z" />
                    </svg>
                    <span>App Store</span>
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--gray-500)", fontWeight: "500" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#10b981", display: "inline-block" }} />
                <span>Works on Android, iOS &amp; Desktop · Zero storage needed</span>
              </div>
            </div>
          </div>
          <div className={"ap-phones"}>
            <img className={"lazy"} data-src="/site-assets/7fafe4e0d0e0414e.webp" title="Discover Events On The GO with Vibe" alt="Discover Events On The GO with Vibe" src="/site-assets/7fafe4e0d0e0414e.webp" loading="eager" />
          </div>
        </div>
        <div className={"ap-fade"} />
      </div>
      <div id="fb-root" />
      <ImportedFooterSiteNavigation />
      <div className={"bluebarbd"} style={{ height: "250px", position: "absolute", left: "0px", right: "0px", top: "100px", zIndex: "123", display: "none", opacity: "1", background: "linear-gradient(rgba(255, 255, 255, 0.611765) 0%, rgba(0, 0, 0, 0) 100%)" }} />
      <div className={"qsp_search_page_container"} style={{ display: "none" }}>
        <div id="qsp_search-page-app" className={"vsp_app"}>
          <div className={"search_page_top"}>
            <div className={"searchbar_title"}>
              <div className={"close_btn tltp"}>
                <span className={"search_close_btn"}><svg width="24" height="18" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg" className={"hidden-phone"}><path d="M24 8.90326C24 9.47255 23.5447 9.93412 22.983 9.93412H3.47203L9.50217 16.0466C9.8993 16.4492 9.8993 17.102 9.50217 17.5045C9.30356 17.7058 9.04336 17.8065 8.78306 17.8065C8.52277 17.8065 8.26256 17.7058 8.06395 17.5045L0.297844 9.63221C-0.0992813 9.22965 -0.0992813 8.57687 0.297844 8.17432L8.06409 0.301846C8.46136 -0.100615 9.10509 -0.100615 9.50231 0.301846C9.89944 0.704403 9.89944 1.35718 9.50231 1.75974L3.47203 7.8724H22.983C23.5447 7.8724 24 8.33397 24 8.90326Z" fill="white" /></svg>{" "}<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={"\x76isible-phone"}><path d="M22 12.0001C22 12.5523 21.5523 13.0001 21 13.0001H5.16998L9.75998 18.35C10.119 18.7698 10.0697 19.4011 9.65 19.76C9.23026 20.119 8.59898 20.0698 8.24 19.6501L2.24 12.65C2.20418 12.6002 2.17399 12.5465 2.15 12.4901C2.1199 12.4525 2.09313 12.4123 2.07 12.3701C2.02667 12.2513 2.00303 12.1264 2 12.0001C2.00303 11.8737 2.02667 11.7487 2.07 11.63C2.09313 11.5878 2.1199 11.5477 2.15 11.51C2.17399 11.4536 2.20418 11.3999 2.24 11.3501L8.24 4.35006C8.59898 3.93033 9.23026 3.88109 9.65 4.24008C10.0697 4.59903 10.119 5.23034 9.75998 5.65008L5.16998 11H21C21.5523 11 22 11.4478 22 12.0001Z" fill="white" /></svg></span>
              </div>
              <div>
                          What do you feel like doing?
                      </div>
            </div>
            <div className={"searchbar_four_item"}>
              <div className={"backgray"}>
                <div className={"search_input_text"}>
                  <div className={"search_icon"} style={{ borderRadius: "4px 0px 0px 4px" }}>
                    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16.839 16.0751L12.4498 11.7562C13.5992 10.5074 14.3054 8.85589 14.3054 7.03859C14.3049 3.15103 11.1028 0 7.15245 0C3.20212 0 0 3.15103 0 7.03859C0 10.9261 3.20212 14.0772 7.15245 14.0772C8.85926 14.0772 10.4247 13.4868 11.6544 12.5054L16.0606 16.8414C16.2753 17.0529 16.6238 17.0529 16.8385 16.8414C17.0537 16.6299 17.0537 16.2866 16.839 16.0751ZM7.15245 12.9942C3.81004 12.9942 1.1005 10.3278 1.1005 7.03859C1.1005 3.74936 3.81004 1.08293 7.15245 1.08293C10.4949 1.08293 13.2044 3.74936 13.2044 7.03859C13.2044 10.3278 10.4949 12.9942 7.15245 12.9942Z" fill="#30363E" />
                    </svg>
                  </div>
                  <input type="search" name="search_text" placeholder="Search Events, Categories, Location..." autoComplete="off" className={"search_text"} />
                  <div className={"remove_text_icon"} />
                  <div className={"searchlocation"}>
                    <div id="qsp_change_city_app">
                      <div className={"changecity"}><span className={"location_icon"} style={{ left: "12px" }}><svg width="13" height="20" viewBox="0 0 13 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.7003 19.3062C5.79497 19.4638 5.95435 19.5585 6.125 19.5585C6.29565 19.5585 6.45504 19.4639 6.5497 19.3062C7.75765 17.2949 9.53686 14.8109 10.7767 12.2846C11.7681 10.2647 12.25 8.54187 12.25 7.01789C12.25 3.26884 9.50233 0.21875 6.125 0.21875C2.74768 0.21875 0 3.26884 0 7.01789C0 8.54187 0.481935 10.2647 1.4733 12.2846C2.71222 14.809 4.49483 17.299 5.7003 19.3062ZM6.125 1.35194C8.93944 1.35194 11.2292 3.89368 11.2292 7.01789C11.2292 8.34764 10.7879 9.89309 9.88027 11.7425C8.81156 13.9201 7.2865 16.129 6.125 17.986C4.96367 16.1293 3.43851 13.9202 2.36973 11.7425C1.46207 9.89309 1.02083 8.34764 1.02083 7.01789C1.02083 3.89368 3.31056 1.35194 6.125 1.35194Z" fill="#30363E" />{" "}<path d="M6.11719 10.4175C7.80585 10.4175 9.17969 8.8925 9.17969 7.01798C9.17969 5.14345 7.80585 3.61841 6.11719 3.61841C4.42853 3.61841 3.05469 5.14345 3.05469 7.01798C3.05469 8.8925 4.42853 10.4175 6.11719 10.4175ZM6.11719 4.7516C7.24296 4.7516 8.15885 5.76829 8.15885 7.01798C8.15885 8.26766 7.24296 9.28435 6.11719 9.28435C4.99141 9.28435 4.07552 8.26766 4.07552 7.01798C4.07552 5.76829 4.99141 4.7516 6.11719 4.7516Z" fill="#30363E" /></svg></span> <input type="text" placeholder="Enter your city" /> <i className={"icon-chevron-down location_icon"} /> </div>
                    </div>
                  </div>
                  <div className={"search_suggestion_popup"} style={{ maxHeight: "65vh", display: "none" }}>
                    <div className={"ss_wrapper"} />
                  </div>
                </div>
              </div>
            </div>
            <div className={"search_filters_container"}>
              <div className={"search_filters_wrapper"} style={{ display: "flex", gap: "7px" }}>
                <div className={"close_btn"} style={{ display: "none" }}>
                  <svg width="24" height="18" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 8.90326C24 9.47255 23.5447 9.93412 22.983 9.93412H3.47203L9.50217 16.0466C9.8993 16.4492 9.8993 17.102 9.50217 17.5045C9.30356 17.7058 9.04336 17.8065 8.78306 17.8065C8.52277 17.8065 8.26256 17.7058 8.06395 17.5045L0.297844 9.63221C-0.0992813 9.22965 -0.0992813 8.57687 0.297844 8.17432L8.06409 0.301846C8.46136 -0.100615 9.10509 -0.100615 9.50231 0.301846C9.89944 0.704403 9.89944 1.35718 9.50231 1.75974L3.47203 7.8724H22.983C23.5447 7.8724 24 8.33397 24 8.90326Z" fill="white" fillOpacity="0.5" />
                  </svg>
                </div>
                <div className={"vue-select-category"}>
                  <div dir="auto" className={"v-select org-page-select vs--single vs--searchable"} {...({ value: "" } as any)}>
                    <div id="vs5__combobox" role="combobox" aria-expanded="false" aria-owns="vs5__listbox" aria-label="Search for option" className={"vs__dropdown-toggle"}>
                      <div className={"vs__selected-options"}>
                        <input placeholder="Category" aria-autocomplete="list" aria-labelledby="vs5__combobox" aria-controls="vs5__listbox" aria-activedescendant="vs5__option-0" type="search" autoComplete="off" className={"vs__search"} />
                      </div>
                      <div className={"vs__actions"}><button type="button" title="Clear Selected" aria-label="Clear Selected" className={"vs__clear"} style={{ display: "none" }}><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><path d="M6.895455 5l2.842897-2.842898c.348864-.348863.348864-.914488 0-1.263636L9.106534.261648c-.348864-.348864-.914489-.348864-1.263636 0L5 3.104545 2.157102.261648c-.348863-.348864-.914488-.348864-1.263636 0L.261648.893466c-.348864.348864-.348864.914489 0 1.263636L3.104545 5 .261648 7.842898c-.348864.348863-.348864.914488 0 1.263636l.631818.631818c.348864.348864.914773.348864 1.263636 0L5 6.895455l2.842898 2.842897c.348863.348864.914772.348864 1.263636 0l.631818-.631818c.348864-.348864.348864-.914489 0-1.263636L6.895455 5z" /></svg></button> <svg xmlns="http://www.w3.org/2000/svg" width="14" height="10" role="presentation" className={"vs__open-indicator"}><path d="M9.211364 7.59931l4.48338-4.867229c.407008-.441854.407008-1.158247 0-1.60046l-.73712-.80023c-.407008-.441854-1.066904-.441854-1.474243 0L7 5.198617 2.51662.33139c-.407008-.441853-1.066904-.441853-1.474243 0l-.737121.80023c-.407008.441854-.407008 1.158248 0 1.600461l4.48338 4.867228L7 10l2.211364-2.40069z" /></svg> <div className={"vs__spinner"} style={{ display: "none" }}>Loading...</div></div>
                    </div>
                    <ul id="vs5__listbox" role="listbox" style={{ display: "none", visibility: "hidden" }} />
                  </div>
                </div>
                <div className={"vue-select-category"}>
                  <div dir="auto" className={"v-select org-page-select vs--single vs--searchable"} {...({ value: "" } as any)}>
                    <div id="vs6__combobox" role="combobox" aria-expanded="false" aria-owns="vs6__listbox" aria-label="Search for option" className={"vs__dropdown-toggle"}>
                      <div className={"vs__selected-options"}>
                        <input placeholder="Format" aria-autocomplete="list" aria-labelledby="vs6__combobox" aria-controls="vs6__listbox" aria-activedescendant="vs6__option-0" type="search" autoComplete="off" className={"vs__search"} />
                      </div>
                      <div className={"vs__actions"}><button type="button" title="Clear Selected" aria-label="Clear Selected" className={"vs__clear"} style={{ display: "none" }}><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><path d="M6.895455 5l2.842897-2.842898c.348864-.348863.348864-.914488 0-1.263636L9.106534.261648c-.348864-.348864-.914489-.348864-1.263636 0L5 3.104545 2.157102.261648c-.348863-.348864-.914488-.348864-1.263636 0L.261648.893466c-.348864.348864-.348864.914489 0 1.263636L3.104545 5 .261648 7.842898c-.348864.348863-.348864.914488 0 1.263636l.631818.631818c.348864.348864.914773.348864 1.263636 0L5 6.895455l2.842898 2.842897c.348863.348864.914772.348864 1.263636 0l.631818-.631818c.348864-.348864.348864-.914489 0-1.263636L6.895455 5z" /></svg></button> <svg xmlns="http://www.w3.org/2000/svg" width="14" height="10" role="presentation" className={"vs__open-indicator"}><path d="M9.211364 7.59931l4.48338-4.867229c.407008-.441854.407008-1.158247 0-1.60046l-.73712-.80023c-.407008-.441854-1.066904-.441854-1.474243 0L7 5.198617 2.51662.33139c-.407008-.441853-1.066904-.441853-1.474243 0l-.737121.80023c-.407008.441854-.407008 1.158248 0 1.600461l4.48338 4.867228L7 10l2.211364-2.40069z" /></svg> <div className={"vs__spinner"} style={{ display: "none" }}>Loading...</div></div>
                    </div>
                    <ul id="vs6__listbox" role="listbox" style={{ display: "none", visibility: "hidden" }} />
                  </div>
                </div>
                <div className={"vue-select-category"}>
                  <div dir="auto" className={"v-select org-page-select vs--single vs--unsearchable"} {...({ value: "" } as any)}>
                    <div id="vs7__combobox" role="combobox" aria-expanded="false" aria-owns="vs7__listbox" aria-label="Search for option" className={"vs__dropdown-toggle"}>
                      <div className={"vs__selected-options"}>
                        <input placeholder="Date" readOnly aria-autocomplete="list" aria-labelledby="vs7__combobox" aria-controls="vs7__listbox" aria-activedescendant="vs7__option-0" type="search" autoComplete="off" className={"vs__search"} />
                      </div>
                      <div className={"vs__actions"}><button type="button" title="Clear Selected" aria-label="Clear Selected" className={"vs__clear"} style={{ display: "none" }}><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><path d="M6.895455 5l2.842897-2.842898c.348864-.348863.348864-.914488 0-1.263636L9.106534.261648c-.348864-.348864-.914489-.348864-1.263636 0L5 3.104545 2.157102.261648c-.348863-.348864-.914488-.348864-1.263636 0L.261648.893466c-.348864.348864-.348864.914489 0 1.263636L3.104545 5 .261648 7.842898c-.348864.348863-.348864.914488 0 1.263636l.631818.631818c.348864.348864.914773.348864 1.263636 0L5 6.895455l2.842898 2.842897c.348863.348864.914772.348864 1.263636 0l.631818-.631818c.348864-.348864.348864-.914489 0-1.263636L6.895455 5z" /></svg></button> <svg xmlns="http://www.w3.org/2000/svg" width="14" height="10" role="presentation" className={"vs__open-indicator"}><path d="M9.211364 7.59931l4.48338-4.867229c.407008-.441854.407008-1.158247 0-1.60046l-.73712-.80023c-.407008-.441854-1.066904-.441854-1.474243 0L7 5.198617 2.51662.33139c-.407008-.441853-1.066904-.441853-1.474243 0l-.737121.80023c-.407008.441854-.407008 1.158248 0 1.600461l4.48338 4.867228L7 10l2.211364-2.40069z" /></svg> <div className={"vs__spinner"} style={{ display: "none" }}>Loading...</div></div>
                    </div>
                    <ul id="vs7__listbox" role="listbox" style={{ display: "none", visibility: "hidden" }} />
                  </div>
                </div>
                <div className={"vue-select-category"}>
                  <div dir="auto" className={"v-select org-page-select vs--single vs--unsearchable"} {...({ value: "" } as any)}>
                    <div id="vs8__combobox" role="combobox" aria-expanded="false" aria-owns="vs8__listbox" aria-label="Search for option" className={"vs__dropdown-toggle"}>
                      <div className={"vs__selected-options"}>
                        <input placeholder="Price" readOnly aria-autocomplete="list" aria-labelledby="vs8__combobox" aria-controls="vs8__listbox" aria-activedescendant="vs8__option-0" type="search" autoComplete="off" className={"vs__search"} />
                      </div>
                      <div className={"vs__actions"}><button type="button" title="Clear Selected" aria-label="Clear Selected" className={"vs__clear"} style={{ display: "none" }}><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><path d="M6.895455 5l2.842897-2.842898c.348864-.348863.348864-.914488 0-1.263636L9.106534.261648c-.348864-.348864-.914489-.348864-1.263636 0L5 3.104545 2.157102.261648c-.348863-.348864-.914488-.348864-1.263636 0L.261648.893466c-.348864.348864-.348864.914489 0 1.263636L3.104545 5 .261648 7.842898c-.348864.348863-.348864.914488 0 1.263636l.631818.631818c.348864.348864.914773.348864 1.263636 0L5 6.895455l2.842898 2.842897c.348863.348864.914772.348864 1.263636 0l.631818-.631818c.348864-.348864.348864-.914489 0-1.263636L6.895455 5z" /></svg></button> <svg xmlns="http://www.w3.org/2000/svg" width="14" height="10" role="presentation" className={"vs__open-indicator"}><path d="M9.211364 7.59931l4.48338-4.867229c.407008-.441854.407008-1.158247 0-1.60046l-.73712-.80023c-.407008-.441854-1.066904-.441854-1.474243 0L7 5.198617 2.51662.33139c-.407008-.441853-1.066904-.441853-1.474243 0l-.737121.80023c-.407008.441854-.407008 1.158248 0 1.600461l4.48338 4.867228L7 10l2.211364-2.40069z" /></svg> <div className={"vs__spinner"} style={{ display: "none" }}>Loading...</div></div>
                    </div>
                    <ul id="vs8__listbox" role="listbox" style={{ display: "none", visibility: "hidden" }} />
                  </div>
                </div>
                <div id="date_range_picker_modal" className={"custom_date_modal"} style={{ display: "none" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "50px", backgroundColor: "white", width: "100%", padding: "5px 0px", borderRadius: "4px 4px 0px 0px", margin: "auto", borderBottom: "1px solid rgb(221, 221, 221)" } as CSSProperties}><span style={{ width: "100%", textAlign: "center", fontSize: "20px", color: "rgb(87, 92, 103)", fontWeight: "500", marginLeft: "45px" }}>Pick dates and Apply</span> <button className={"btn btn-link pull-right"} style={{ fontSize: "30px", color: "gray", marginTop: "3px" }}>×</button></div>
                  <input type="text" name="daterange" defaultValue="01/01/2018 - 01/15/2018" readOnly style={{ opacity: "0" }} />
                </div>
                <div id="custom-date-modal-backdrop" className={"custom-date-modal-backdrop-transparent custom-date-modal-transition"} />
              </div>
            </div>
          </div>
          <div className={"search_tab_body"}>
            <div id="trending_searchandevents" className={"trending_results"} style={{ display: "block" }}>
              <div className={"trending_container"}>
                <div className={"qsp_title"}>
                  <span>Trending in Indore</span>
                </div>
                <div className={"qsp_category_contaner"}>
                  <a className={"title_long"} href="/events/car-shows-in-usa?ref=quicksearch-t-results" target="_blank" title="Car Shows 2026 In United States"><span className={"trending_up_icon"}><svg viewBox="0 0 144 144"><path fillRule="evenodd" clipRule="evenodd" fill="#2481DE" d="M116.509 38.4h12v42h-12V58.372l-43.803 43.803-8.485-8.485.048-.049-14.205-14.205-26.098 26.098-8.485-8.485 34.65-34.65 8.486 8.485-.068.067 14.206 14.205 34.757-34.758H86.508v-12h30.001z" /></svg></span>{" "}<span className={"title_p"}><p>Car Shows 2026 In United States</p></span>{" "}<i className={"icon-chevron-right trending_chevron"} /></a>
                  <a className={"title_long"} href="/events/back-to-school-events-in-usa?ref=quicksearch-t-results" target="_blank" title={"Back To School 2026 Events & Giveaways In The USA"}><span className={"trending_up_icon"}><svg viewBox="0 0 144 144"><path fillRule="evenodd" clipRule="evenodd" fill="#2481DE" d="M116.509 38.4h12v42h-12V58.372l-43.803 43.803-8.485-8.485.048-.049-14.205-14.205-26.098 26.098-8.485-8.485 34.65-34.65 8.486 8.485-.068.067 14.206 14.205 34.757-34.758H86.508v-12h30.001z" /></svg></span>{" "}<span className={"title_p"}><p>Back To School 2026 Events &amp; Giveaways In The USA</p></span>{" "}<i className={"icon-chevron-right trending_chevron"} /></a>
                  <a className={"title_long"} href="/events/halloween-events-celebrations-in-usa?ref=quicksearch-t-results" target="_blank" title={"Halloween 2026 Events & Celebrations In The USA"}><span className={"trending_up_icon"}><svg viewBox="0 0 144 144"><path fillRule="evenodd" clipRule="evenodd" fill="#2481DE" d="M116.509 38.4h12v42h-12V58.372l-43.803 43.803-8.485-8.485.048-.049-14.205-14.205-26.098 26.098-8.485-8.485 34.65-34.65 8.486 8.485-.068.067 14.206 14.205 34.757-34.758H86.508v-12h30.001z" /></svg></span>{" "}<span className={"title_p"}><p>Halloween 2026 Events &amp; Celebrations In The USA</p></span>{" "}<i className={"icon-chevron-right trending_chevron"} /></a>
                  <a className={"title_long"} href="/events/labor-day-celebrations-in-usa?ref=quicksearch-t-results" target="_blank" title={"Labor Day 2026 Events & Celebrations In The USA"}><span className={"trending_up_icon"}><svg viewBox="0 0 144 144"><path fillRule="evenodd" clipRule="evenodd" fill="#2481DE" d="M116.509 38.4h12v42h-12V58.372l-43.803 43.803-8.485-8.485.048-.049-14.205-14.205-26.098 26.098-8.485-8.485 34.65-34.65 8.486 8.485-.068.067 14.206 14.205 34.757-34.758H86.508v-12h30.001z" /></svg></span>{" "}<span className={"title_p"}><p>Labor Day 2026 Events &amp; Celebrations In The USA</p></span>{" "}<i className={"icon-chevron-right trending_chevron"} /></a>
                  <a className={"title_long"} href="/indore/festivals?ref=quicksearch-t-results" target="_blank" title="Indore Festival Guide 2026"><span className={"trending_up_icon"}><span>{" "}<i className={"icon-book"} /></span></span>{" "}<span className={"title_p"}><p>Indore Festival Guide 2026</p></span>{" "}<i className={"icon-chevron-right trending_chevron"} /></a>
                  <a className={"title_long"} href="/indore/this-weekend?ref=quicksearch-t-results" target="_blank" title={"Events & Things To Do In Indore This Weekend "}><span className={"trending_up_icon"}><span>{" "}<i className={"icon-book"} /></span></span>{" "}<span className={"title_p"}><p>Events &amp; Things To Do In Indore This Weekend </p></span>{" "}<i className={"icon-chevron-right trending_chevron"} /></a>
                  <a className={"title_long"} href="/indore/halloween?ref=quicksearch-t-results" target="_blank" title={"&#127875; Halloween Events in Indore"}><span className={"trending_up_icon"}><span>{" "}<i className={"icon-book"} /></span></span>{" "}<span className={"title_p"}><p>🎃 Halloween Events in Indore</p></span>{" "}<i className={"icon-chevron-right trending_chevron"} /></a>
                  <a className={"title_long"} href="/indore/live-music?ref=quicksearch-t-results" target="_blank" title="Live Music Events Near Indore"><span className={"trending_up_icon"}><span>{" "}<i className={"icon-book"} /></span></span>{" "}<span className={"title_p"}><p>Live Music Events Near Indore</p></span>{" "}<i className={"icon-chevron-right trending_chevron"} /></a>
                </div>
              </div>
              <div className={"qsp_event_container"} />
              <div className={"qsp_title"}>
                <span>
                  <span>Trending Events around Indore</span>
                </span>
              </div>
              <div className={"qsp_event_container"}>
                <div className={"event_card"}>
                  <a href="/kennewick/event/2400029941536931?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Jo Koy at Toyota Center - Kennewick" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czYvYmFubmVycy8yZGNkOGYxMC1kMTZlLTExZjEtOTU0Ny1jZDZlMDg0Y2I3MmItcmltZy13MTAyNC1oODUzLWRjZjhmOGY4LWdtaXIuanBnP3Y9MTc5MzA0MDcyMA.avif" src="/site-assets/ff05860c5169c64b.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Jo Koy at Toyota Center - Kennewick</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 06</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Kennewick, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/west-pasco/event/2700030036649044?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Candlelight: Queen vs. ABBA" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czcvYmFubmVycy80NDA2MGNiMC1kMzY5LTExZjEtODI4OC1jMWE0M2FkOTlmNjktcmltZy13NTUwLWg1NTAtZGM3ODA4MDgtZ21pci5qcGc_dj0xNzkzMjU5MDE4.avif" src="/site-assets/9d84c852cf6ff709.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Candlelight: Queen vs. ABBA</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Oct 30</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>West Pasco, United States</span></div>
                      <div className={"event_ticket_wrapper"}>
                        <div className={"event_ticket"}>
                          <div className={"ticket"}><i className={"icon-ticket-empty"} />
                                      USD 49
                                      <span>to 72</span></div>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/kennewick/event/200030436658504?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Jo Koy" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czIvYmFubmVycy9jNjhhZTdjZTdhMmQ4ZTQ1MTk2NGVkYTZhZmIwY2NhNDk4ZWMxYjFmNjJhNTg2MWIzYmY5ZDNjYWQzOGI0MGMxLXJpbWctdzEyMDAtaDY3NS1kYzE4MjgyOC1nbWlyP3Y9MTc4ODc5MDIwNw.avif" src="/site-assets/6245b9e7ff4d6511.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Jo Koy</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 06</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Kennewick, United States</span></div>
                    </div>
                  </a>
                </div>
                <a className={"track \x68-desktop"} href={"/app?utm_source=search_app_download&utm_medium=search_page&utm_campaign=banner"} style={{ marginTop: "10px", marginBottom: "10px", borderRadius: "8px" }} target="_blank">
                  <img src="/site-assets/0760cd25b88033d3.webp" alt="Download App" />
                </a>
                <div className={"event_card"}>
                  <a href="/walla-walla/event/2700030746795048?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Candlelight: Coldplay vs. Imagine Dragons" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czYvYmFubmVycy9kYzEwYjUwMC1jODc0LTExZjEtOTdiOS1hZjFkNWRlZTBlMzYtcmltZy13NTUwLWg1NTAtZGMwODA4MDgtZ21pci5qcGc_dj0xNzkyMDUzOTY1.avif" src="/site-assets/c4da50d8d0deec21.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Candlelight: Coldplay vs. Imagine Dragons</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 07</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Walla Walla, United States</span></div>
                      <div className={"event_ticket_wrapper"}>
                        <div className={"event_ticket"}>
                          <div className={"ticket"}><i className={"icon-ticket-empty"} />
                                      USD 70
                                      <span>to 86</span></div>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/richland/event/200030726424653?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="West Richland Regional Veterans Day Parade " data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czIvYmFubmVycy8xYmRhM2IxM2RkODMzYzY5OGFlYjY1ODljZmE4MDI4NTMwMzkwZGI0NWYxNWEwNzRjNjZjYmFiNzJkZjEyMzFlLXJpbWctdzEyMDAtaDQ0Ny1kY2Y4ZjhmOC1nbWlyP3Y9MTc5MDA5NDc3Mw.avif" src="/site-assets/7736196540adf3b1.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>West Richland Regional Veterans Day Parade </div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 07</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Richland, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/kennewick/event/200030948648817?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Grand Opening Weekend Celebration — DAY TWO! 🥳 🎉 " data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czcvYmFubmVycy9mNGQxMGJkYjdkYzNiYTkzNTNkZDI5ODE3ZmNjZGQ4MDlhY2U1NjU1ZjMzOWRiOWMzNGM5ZmU4MmI3Mzg1NzU5LXJpbWctdzEyMDAtaDYyOC1kY2Y4MDhiOC1nbWlyP3Y9MTc5MzUzNTM3Nw.avif" src="/site-assets/060b14bf26b7ced9.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Grand Opening Weekend Celebration — DAY TWO! 🥳 🎉 </div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 08</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Kennewick, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/walla-walla/event/2700030746795150?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Candlelight: The Best of Hans Zimmer" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czMvYmFubmVycy9jNmY3YTAyMC1kMzY5LTExZjEtODI4OC1jMWE0M2FkOTlmNjktcmltZy13NTUwLWg1NTAtZGMwODA4MDgtZ21pci5qcGc_dj0xNzkzMjU5MTYw.avif" src="/site-assets/f260fd9b6d4cbaed.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Candlelight: The Best of Hans Zimmer</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 07</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Walla Walla, United States</span></div>
                      <div className={"event_ticket_wrapper"}>
                        <div className={"event_ticket"}>
                          <div className={"ticket"}><i className={"icon-ticket-empty"} />
                                      USD 59
                                      <span>to 86</span></div>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/richland/event/2400030465843136?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Candlelight - Tribute to ABBA and More at REACH Museum" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czIvYmFubmVycy83NGVhODllMC04OTliLTExZjEtYjkyZS00MWI1ODRmZGIzYzktcmltZy13MTIwMC1oMTIwMC1kY2VmZjFmNS1nbWlyLndlYnA_dj0xNzg1MTQzNjIw.avif" src="/site-assets/29b6c075e38b22a3.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Candlelight - Tribute to ABBA and More at REACH Museum</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Multiple dates</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Richland, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/richland/event/100001984780483856?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Next Stop Comedy at Emerald of Siam! - Richland, WA" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czQvYmFubmVycy85YzE4MmMzOTJiMWY2Y2I2N2UyNjViY2ZjOGFhZWExY2I2NTMxMDA3NmZiZDAyOWYzYzE2MmQwNzYyMzZjMTQxLXJpbWctdzEyMDAtaDgwMS1kYzA4MDgwOC1nbWlyLmpwZz92PTE3OTIyMzIyMjQ.avif" src="/site-assets/7bc6603b5bcb0cbc.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Next Stop Comedy at Emerald of Siam! - Richland, WA</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Multiple dates</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Richland, United States</span></div>
                      <div className={"event_ticket_wrapper"}>
                        <div className={"event_ticket"}>
                          <div className={"ticket"}><i className={"icon-ticket-empty"} />
                                      USD 29.67
                                      </div>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/pasco/event/200030403834855?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt={"Custer's 31st Annual Christmas Arts &amp; Crafts Show - Pasco, WA"} data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czkvYmFubmVycy83ZmIxN2JkMzk2MzU4NzJhNDgzYzhjM2E3N2NjODY3NDg3ODk1N2FjNTE3ZDVhZTE2MjkzNzY4ODE5ZWVlYjg0LXJpbWctdzEyMDAtaDY3Ni1kYzA4MDgwOC1nbWlyP3Y9MTc4ODE4NzQ1Mg.avif" src="/site-assets/507b3126a1dc6896.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Custer's 31st Annual Christmas Arts &amp; Crafts Show - Pasco, WA</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 06</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Pasco, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/kennewick/event/100001995339584410?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Fall Into Fashion Show Charity Fundraiser for Seattle Children's Hospital" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czgvYmFubmVycy9kYzAwOWE4Mjk1MzE3MjU2N2VjMTc0NjUxOTBlMmQzZDY4NWUxOGRiZDZhZGU3OTM1OTdmNjU1MDAwNWUwZjhmLXJpbWctdzEwNTYtaDgxNi1kY2ZmZmZmZi1nbWlyLmpwZz92PTE3ODUzMzg4ODU.avif" src="/site-assets/8f2062e07b8b00eb.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Fall Into Fashion Show Charity Fundraiser for Seattle Children's Hospital</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 07</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Kennewick, United States</span></div>
                      <div className={"event_ticket_wrapper"}>
                        <div className={"event_ticket"}>
                          <div className={"ticket"}><i className={"icon-ticket-empty"} />
                                      USD 108.55
                                      </div>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/kennewick/event/2300026503671727?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Ramon Ayala" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czQvYmFubmVycy9hYWEwMjBmMC1jY2Q0LTExZjEtOWI3ZS1kNzA5ZTMyNjhiNzgtcmltZy13MTIwMC1oNjc1LWRjMzgwODA4LWdtaXIuanBnP3Y9MTc5MjUzNDkyMg.avif" src="/site-assets/49dd52f145c6e425.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Ramon Ayala</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Multiple dates</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Kennewick, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/kennewick/event/200030525799006?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt={"WCA &amp; WCW 2026 Convention &amp; Tradeshow"} data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czQvYmFubmVycy8wNmJkNzcxNDEyM2M1ZmM2MjEyOGE3NTJmZTFlMTM3MTJjZjgwOGJkNzhkZDVlMjgwMDY0N2VmN2YwMzAyMGM1LXJpbWctdzEyMDAtaDUwMC1kY2Y4ZjhmOC1nbWlyP3Y9MTc4ODA4MTQwNw.avif" src="/site-assets/0b2d97ab9a8bbfc0.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>WCA &amp; WCW 2026 Convention &amp; Tradeshow</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 04</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Kennewick, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/kennewick/event/200030615706438?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Mobile Market - Kennewick" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czkvYmFubmVycy8yOWIxMTliNDI3MzM1NDRkYmZlOTFkNjhmODIxOGJhYTMyYWFjZDRhZDJhNTViZjk0OTRmZTFjYTU4MjQ3NDM2LXJpbWctdzEyMDAtaDgwMC1kY2E4YjhjOC1nbWlyP3Y9MTc4ODMyODY3MQ.avif" src="/site-assets/d63cc2ab127a87d0.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Mobile Market - Kennewick</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Multiple dates</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Kennewick, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/waitsburg/event/3300030343391750?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="M. Ward in Waitsburg" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czkvYmFubmVycy9kZmIxODEwMC03NWY3LTExZjEtYTg3Yy01NTJlMzIyMzA0ZTYtcmltZy13MTIwMC1oNjc1LWRjNDQ0NTMwLWdtaXIud2VicD92PTE3ODI5ODQyODk.avif" src="/site-assets/68a37171dc6196f4.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>M. Ward in Waitsburg</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 07</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Waitsburg, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/richland/event/100002003985404290?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt={"Forks &amp; Friends"} data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czgvYmFubmVycy81ODczMTg0YTNkMDMxMWVhNWRhZjk5NTA5YzFiNjQ2YmZhNzY3ZGJkYmE1MzllMWI0NTM3YWE5ZGFlZjUxZjRkLXJpbWctdzEwMjQtaDE1MzYtZGNmOGY4ZTgtZ21pci5qcGc_dj0xNzkzMTQyMDc1.avif" src="/site-assets/060fd46547ac8ef2.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Forks &amp; Friends</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 07</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Richland, United States</span></div>
                      <div className={"event_ticket_wrapper"} />
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/walla-walla/event/200030642797356?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="SymphoniCon" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czIvYmFubmVycy9kYWIzYTU2YTc1NjI5NjA3MGM4NTBmYzE5ODg0MjZmMjc4OTZhMGU5ZDRkOThkNDhiZjE2ZWU0YWFkM2U1ODgyLXJpbWctdzEyMDAtaDYyOC1kYzQ4Nzg3OC1nbWlyP3Y9MTc4ODI2Mzg3Ng.avif" src="/site-assets/9a7743936ee496b1.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>SymphoniCon</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 05</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Walla Walla, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/walla-walla/event/200030656285114?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Nite Wave" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czcvYmFubmVycy84OTYyZjc3MGM2ODVmYTBhMDNiNjBkOWRmZjc3ZjZhZWY0ZDM4OGUzZWFiNDkxNzk1NDMwNzlkMzdlOTFjZjZiLXJpbWctdzEyMDAtaDgwMS1kYzE4MTgyOC1nbWlyP3Y9MTc4ODQ4OTU1NA.avif" src="/site-assets/eb3290d41b07b8e8.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Nite Wave</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 06</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Walla Walla, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/prosser/event/200030694754403?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Dan Rodriguez" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czUvYmFubmVycy9lMjAwOWU0ZWY5YWMzZjcxYTYyMDI1Y2ZmMDBjYzAyNzU3MmUyYjgyYjg2ODk2YmY1NTBkNjFjMDYzNjZlYTM0LXJpbWctdzk2MC1oNzIwLWRjNTg1ODY4LWdtaXI_dj0xNzg5MzQ4ODYz.avif" src="/site-assets/9dc0be00968e0472.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Dan Rodriguez</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 06</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Prosser, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/kennewick/event/200030912172230?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Grand Opening Weekend Celebration! 🥳 🎉 " data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czYvYmFubmVycy82Mzg5Y2I2NTc1ZmNjY2EwNWYwN2FkZGJmNzQzOWJiYjAxODgwM2RkYTA4MjAzZDQzZGM3ZmRhZThiYTRmNWJhLXJpbWctdzEyMDAtaDYyOC1kYzA4YzhmOC1nbWlyP3Y9MTc5Mjk3MzA3MA.avif" src="/site-assets/9a8eb5a56c07688f.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Grand Opening Weekend Celebration! 🥳 🎉 </div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 07</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Kennewick, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/kennewick/event/100002002849892945?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Creations Crystals Sacred Soundbath (Kennewick)" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czMvYmFubmVycy80N2UxNTYyNjlmMTdhYmVkMTU1Yzk0ODhlYWM1NjA4NTE2NmIxODE4ZTdiNTNlYTcyZGQ5NzdmMzZhYjU1NDIxLXJpbWctdzEyMDAtaDkwMC1kYzM4MjgyOC1nbWlyLmpwZz92PTE3OTEwNzkyNzQ.avif" src="/site-assets/9e5ecb44a65409de.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Creations Crystals Sacred Soundbath (Kennewick)</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 07</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Kennewick, United States</span></div>
                      <div className={"event_ticket_wrapper"}>
                        <div className={"event_ticket"}>
                          <div className={"ticket"}><i className={"icon-ticket-empty"} />
                                      USD 39.19
                                      </div>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/indore/event/200030766464256?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Bookminders - The God of the Woods" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czUvYmFubmVycy8xYWJlYjdkMGFmMzNmYmRjZTgyNmFlNWFmZTUyODQ1ZmIyYTAyNzA0ZDdhOGMwODllNmE2MjQ3N2RiYmZiYjVkLXJpbWctdzEwODAtaDEwODAtZGNkOGU4ZjgtZ21pcj92PTE3OTEwNDIxNzY.avif" src="/site-assets/774b998c693df4ae.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Bookminders - The God of the Woods</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 05</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Indore, India</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/indore/event/100002002168621243?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="2026 HAC Turkey Day 5k" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czEvYmFubmVycy81NWU2MWVmMGYxMmE4ZjAwZWUwNDk4NTQwZGU3M2ExYjIyMmQ5ZDk0NDgzN2VhY2YzY2Q4ZDMzNTU0YjY3NTBlLXJpbWctdzEyMDAtaDYwMC1kY2Y4ZjhmOC1nbWlyLmpwZz92PTE3OTA2ODUwNzM.avif" src="/site-assets/99fde05723294869.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>2026 HAC Turkey Day 5k</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 26</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Indore, India</span></div>
                      <div className={"event_ticket_wrapper"}>
                        <div className={"event_ticket"}>
                          <div className={"ticket"}><i className={"icon-ticket-empty"} />
                                      USD 0.00
                                      <span>to 28.52</span></div>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/west-pasco/event/2700030036648737?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt={"Candlelight: Coldplay &amp; Imagine Dragons"} data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czQvYmFubmVycy85M2JkMGFmMC1kMzZhLTExZjEtODI4OC1jMWE0M2FkOTlmNjktcmltZy13NTUwLWg1NTAtZGMwODA4MDgtZ21pci5qcGc_dj0xNzkzMjU5MDEy.avif" src="/site-assets/c41d2db284f45ca3.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Candlelight: Coldplay &amp; Imagine Dragons</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 21</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>West Pasco, United States</span></div>
                      <div className={"event_ticket_wrapper"}>
                        <div className={"event_ticket"}>
                          <div className={"ticket"}><i className={"icon-ticket-empty"} />
                                      USD 35
                                      <span>to 70</span></div>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/richland/event/100001979555085549?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Trivia Night at Barnard Griffin Winery - RICHLAND" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czcvYmFubmVycy81YTEwYzA1ODJhZjhhMTc2ZTExMDY1NWZhNTg4NDA4YWNhNzE3MzdiOWY4MGEwZmE1ZGQwZjVkYzNiMGViYzNjLXJpbWctdzEyMDAtaDYwMC1kYzAyMDUwNi1nbWlyLmpwZz92PTE3NjkzNTYyODA.avif" src="/site-assets/9dcb0ce57a6aeb13.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Trivia Night at Barnard Griffin Winery - RICHLAND</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Multiple dates</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Richland, United States</span></div>
                      <div className={"event_ticket_wrapper"} />
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/pasco/event/100002002271067663?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Candy Shop" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czEvYmFubmVycy83YzNhNDY3ODZmOGZiNzAyZDUwOGRiYmI3YTMzMmRhMDgyOGRmNjk5NWRlM2FiZDk4OGVmZjQ4MjFhZGJlNGQwLXJpbWctdzEyMDAtaDYyOC1kYzg4ODg4OC1nbWlyLmpwZz92PTE3OTAzMzg1NzM.avif" src="/site-assets/9bb4f3cddd67c8d1.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Candy Shop</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Multiple dates</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Pasco, United States</span></div>
                      <div className={"event_ticket_wrapper"} />
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/kennewick/event/200030688198457?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Beggar's Banquet 2026" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czYvYmFubmVycy8xYjY0NGQ1ZTZhZjgwNzA3MWIwZGYzOWRmNzk2MTNlNWYwMDZjOTg0MTYxN2UzZGEyMmUwYjIwZjc3YzhjNjM2LXJpbWctdzEyMDAtaDYyOC1kYzQ4MDgwOC1nbWlyP3Y9MTc4OTE4MzE5Ng.avif" src="/site-assets/36591309380939ca.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Beggar's Banquet 2026</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 07</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Kennewick, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/kennewick/event/200030568286853?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Nikki Glaser: The Stunning Tour " data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czIvYmFubmVycy9iMjc0OTU4YTM0NzcxOWVkYmQzZTIwYzk0ZWJiMDgzNzVjMjg2N2E2NDRkY2JiOTVjNThiZDRjNDgxMjgyNWVjLXJpbWctdzEwODAtaDEwODAtZGNmODg4YTgtZ21pcj92PTE3ODgxODQ0Mzg.avif" src="/site-assets/efdedcc2eeda760d.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Nikki Glaser: The Stunning Tour </div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 22</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Kennewick, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/richland/event/200030789938138?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Dan Myers" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czIvYmFubmVycy9kZWU1NmE3ZDdhMzA0NDk4OGE5OWViNzFiYjhjYTM2MDYzZTMwNzM4MDM1NjIzZWI5NzBlMTQ4YjAzZGUxNjkyLXJpbWctdzEyMDAtaDUzMC1kYzA4MDgwOC1nbWlyP3Y9MTc5MTMwMjkxOA.avif" src="/site-assets/3033728d45b4dc31.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Dan Myers</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 06</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Richland, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/college-place/event/80003181430422?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Evensong - Walla Walla University" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4yLmFsbGV2ZW50cy5pbi90aHVtYnMvdGh1bWI2YWUxMDc4NzMwMjlmLmpwZw.avif" src="/site-assets/595347b7cd6e8759.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Evensong - Walla Walla University</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 07</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>College Place, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/kennewick/event/2400029944497950?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Ramon Ayala at Toyota Center - Kennewick" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czQvYmFubmVycy83Nzk1NzM2MC1kMWNkLTExZjEtYWU1Zi03OWQ4OGNlMjAwZTQtcmltZy13ODU0LWgxMTM1LWRjMDgwODA4LWdtaXIuanBnP3Y9MTc5MzA4MTU4NQ.avif" src="/site-assets/c1ab0ab804359566.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Ramon Ayala at Toyota Center - Kennewick</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 28</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Kennewick, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/kennewick/event/200030948650625?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="First Responders Play FREE! 🚔 🚒 🚑 " data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czcvYmFubmVycy9kNTBiYTRhOTUzOWViY2NjMjNlZjgwMjA3YWNmOGE1MjNkNDBiYWMwNTBlZmRiZDg5M2JlYjJjN2QzMDRiMmQzLXJpbWctdzEyMDAtaDQ5Ny1kY2Y4MDg5OC1nbWlyP3Y9MTc5MzUzNTM4NQ.avif" src="/site-assets/ff1af8255ad32276.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>First Responders Play FREE! 🚔 🚒 🚑 </div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 06</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Kennewick, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/richland/event/2200029667016046?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt={"Lucky &amp; I Gnome It! Sip &amp; Paint at Splat It!"} data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czEvYmFubmVycy84ZTMwNTBjMC0xYTQ2LTExZjEtOWUyNy02MWYwOWQ0Y2I4ZWEtcmltZy13MTIwMC1oNDUzLWRjMWE0OTI3LWdtaXIud2VicD92PTE3NzI5MDI1NzY.avif" src="/site-assets/fdd616aaa490cffb.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Lucky &amp; I Gnome It! Sip &amp; Paint at Splat It!</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Mar 13</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Richland, United States</span></div>
                      <div className={"event_ticket_wrapper"}>
                        <div className={"event_ticket"}>
                          <div className={"ticket"}><i className={"icon-ticket-empty"} />
                                      USD 30.00
                                      </div>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/prosser/event/100002003986281915?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt={"Forks &amp; Friends"} data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czMvYmFubmVycy9iYmM5ZDIzYzY3NmYxM2Y5NWZhMjhjZmQ5N2JkZTI1YWQ3YzQ3ZmUyN2ExOGQ5YzVmMjYwNDU4MzJhMDNjZWVjLXJpbWctdzEwMjQtaDE1MzYtZGNmOGY4ZTgtZ21pci5qcGc_dj0xNzkzMTQyMDc2.avif" src="/site-assets/1d0db0dc40382b87.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Forks &amp; Friends</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 07</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Prosser, United States</span></div>
                      <div className={"event_ticket_wrapper"} />
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/burbank/event/200030903593438?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="First Saturday Bird Walk" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czYvYmFubmVycy82NzgwNzU4ZGVhNWU1YzlhODQwYmVkYzA2NDZkMmUzMTlmYjEwYTM3NDlhOWI3NTRhY2FjZjFhZDBlNDFjN2MwLXJpbWctdzEyMDAtaDEyMDAtZGNjOGI4YTgtZ21pcj92PTE3OTI4NTczOTc.avif" src="/site-assets/6f3551b41def3d12.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>First Saturday Bird Walk</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 07</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Burbank, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/richland/event/200030838353443?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Jam Night - Live Music" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czgvYmFubmVycy9iMGZjYjNlNTBiNTY1ZGMxZTY5YjMwOGEwYTBkZDkzNDFhMmFlZTUwYWI0OGNiOGQ3NDk1ZDYxMzk1ZmY2OWIyLXJpbWctdzY0MC1oOTYwLWRjMDgwODA4LWdtaXI_dj0xNzkyMDc3MTYz.avif" src="/site-assets/e2fd8c09857d4860.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Jam Night - Live Music</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Multiple dates</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Richland, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/west-pasco/event/2700030036648333?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Candlelight: 90s Hip-Hop on Strings" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czgvYmFubmVycy82MjA3YzgyMC1kMzY5LTExZjEtODI4OC1jMWE0M2FkOTlmNjktcmltZy13NTUwLWg1NTAtZGMwODA4MDgtZ21pci5qcGc_dj0xNzkzMjU5MDE2.avif" src="/site-assets/e2d9663f0dcc2488.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Candlelight: 90s Hip-Hop on Strings</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 21</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>West Pasco, United States</span></div>
                      <div className={"event_ticket_wrapper"}>
                        <div className={"event_ticket"}>
                          <div className={"ticket"}><i className={"icon-ticket-empty"} />
                                      USD 46.5
                                      <span>to 61</span></div>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/kennewick/event/200030948649418?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Line Dance Night w/ Boots a Movin' @ Last Call" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czYvYmFubmVycy84MDYzNDRjNjgzZTliMDJiMGFjMjUyZjA1M2M4Y2EwOWFiMjc0NjZhZDcyMTM0NjU5MmMzMDJmY2RjZmMzZjg3LXJpbWctdzEyMDAtaDEyODQtZGMxODE4MDgtZ21pcj92PTE3OTM1MzUzNzg.avif" src="/site-assets/c32d0dbeef4d39d9.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Line Dance Night w/ Boots a Movin' @ Last Call</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 05</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Kennewick, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/pasco/event/200030866843307?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Art Without Borders Vision Dinner" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czEwL2Jhbm5lcnMvOGJmZDRjMzczODg5MmJmNmY2ZGFmMGQyMDdjNDlkNGY1YTM1ZjM2MWY2YTY2ZmJkOWRlYzFjMjYzZGY0ZGEzOS1yaW1nLXcxMjAwLWg4MDAtZGNmOGY4ZjgtZ21pcj92PTE3OTI1Nzc0MDc.avif" src="/site-assets/544fdb808697c7d2.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Art Without Borders Vision Dinner</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 07</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Pasco, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/pasco/event/200030943774456?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Thanksgiving Brunch" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czMvYmFubmVycy8zMTQwZGUwYzQwMjE1OWFhZjkyMmNlYmFiNzM0NWQ2YTg2ZDhlZjllMGVlNjdjNjZmNGNmZDA4NWE0YjQ4MGYyLXJpbWctdzEyMDAtaDE1NTMtZGNmOGY4ZjgtZ21pcj92PTE3OTM0NDcyMTU.avif" src="/site-assets/341df7bf7cc35706.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Thanksgiving Brunch</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 26</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Pasco, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/richland/event/200030926346751?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Meadow Springs Presbyterian Church Craft Bazaar" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czEwL2Jhbm5lcnMvMjdhMzc0ZjI5YmU2N2VjZjZlZjkzY2RmOWIxZjdjZDc4MjI3YmVmMjIwMTk0NWQwODZmYWZkMjQ4ZTNlYTAzNC1yaW1nLXcxMjAwLWgxOTIwLWRjZjhmOGY4LWdtaXI_dj0xNzkzMTMwODkx.avif" src="/site-assets/600934b490e14003.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Meadow Springs Presbyterian Church Craft Bazaar</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 07</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Richland, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/kennewick/event/200030755391421?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Barista 101 at The Peacock!" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czYvYmFubmVycy9hMWQyN2Y1ZGQxMGQ4MzI4ZTlhOWU3ZjA5NWQ4NjYyMWYwZmVkNjRkYWI5ZGYyOWQ1MGUwYTUzMjkwNDMzNWUwLXJpbWctdzEyMDAtaDE2MDAtZGM2ODM4MjgtZ21pcj92PTE3OTA3NzUxNDc.avif" src="/site-assets/ba8e3ef180e23014.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Barista 101 at The Peacock!</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Multiple dates</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Kennewick, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/pasco/event/100001988788567141?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Sunday School" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czkvYmFubmVycy81NDcxMmY3MTRhOGE3OWI2ODVhODM5ZDIzMTkzMDc3YTVlYmY1ZjZiNGMxZDUyMTZmOTUwYTAyZDRhOWVmMzQ1LXJpbWctdzEyMDAtaDY3NS1kYzA4MDgyOC1nbWlyLmpwZz92PTE3ODY0NTUzNzc.avif" src="/site-assets/e48fbaaaf1500d33.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Sunday School</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Multiple dates</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Pasco, United States</span></div>
                      <div className={"event_ticket_wrapper"} />
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/indore/event/200029773097221?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Indore Grand Cultural Festival" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czMvYmFubmVycy9hZWYxODFlOTRkMjM0Y2IyNzM5MGI2ZWIyZmFkZTEwMzFmNzQzYmM3NWM3ZWU3Y2UyYjlkODNhYWJkZGI2M2U2LXJpbWctdzEyMDAtaDEwMDItZGNmOGY4ZjgtZ21pcj92PTE3ODcxOTYxNTE.avif" src="/site-assets/13e8d321b8e3c021.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Indore Grand Cultural Festival</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Dec 04</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Indore, India</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/kennewick/event/200030948649821?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="LCSNW Seahawks Watch Party 🏈" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czgvYmFubmVycy85NzNhN2VhNjVjYjRmYWViNjA0ZDg3Njk5OTlhY2M1ZTc5ODQ3NjkxZGYzMjI0YTA0OTViOWYzYjY5NDJiNTU4LXJpbWctdzEyMDAtaDY3NS1kYzA4MTg0OC1nbWlyP3Y9MTc5MzUzNTM4MA.avif" src="/site-assets/9bc113c3abac7d96.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>LCSNW Seahawks Watch Party 🏈</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 08</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Kennewick, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/kennewick/event/100001999622358302?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="The Summer's Hub Fall Fest" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czEwL2Jhbm5lcnMvMWI1OTMxOGU1NzdlZjIxZGQzY2E4NDRmMTk3ZTQ3ZmU4NmU1MjJmZjIzOGM1OGE2MDcyNTI0MmFjMDIwYjM4Ny1yaW1nLXcxMjAwLWgxNTUzLWRjNTgzODE4LWdtaXIuanBnP3Y9MTc4ODQwODkxNg.avif" src="/site-assets/6d30bbcf10060384.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>The Summer's Hub Fall Fest</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 07</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Kennewick, United States</span></div>
                      <div className={"event_ticket_wrapper"}>
                        <div className={"event_ticket"}>
                          <div className={"ticket"}><i className={"icon-ticket-empty"} />
                                      USD 40.31
                                      </div>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/pendleton/event/200030931891021?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt={"Peptides &amp; Pilates Happy Hour"} data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czUvYmFubmVycy81NDU5OTdmMjBmOGQxNTU0MjkzZjU0MTViNTUwYmYwNTMzOTFjZWJlYTQ1ZmIzNmRjMDQ0YjBkOTU5OGMwNjhjLXJpbWctdzExNzAtaDEzNDUtZGMzODI4MTgtZ21pcj92PTE3OTMyMDk1ODA.avif" src="/site-assets/bfc0639defb256dc.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Peptides &amp; Pilates Happy Hour</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 06</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Pendleton, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/kennewick/event/200030937223810?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="PJ Breakfast Bingo" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czEvYmFubmVycy9mNzQzOGI4MzY3NWQ1YmEzM2ExOGM5ZTY2NGVjNGE1MjllYWQwOWMzNWFkNzJmMzNkYjMyMDc0Nzk0ZGU1MmZjLXJpbWctdzEwODAtaDEzNTAtZGNmOGY4ZjgtZ21pcj92PTE3OTMzMjc3MDk.avif" src="/site-assets/2e178888a342c412.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>PJ Breakfast Bingo</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 07</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Kennewick, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/richland/event/200030926356742?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Dia de Muertos Costume Party" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czYvYmFubmVycy8wOTUxNGM4NjIwMmVlZmIyMDhhOGNjNGNkZDRkOGQ3NWM5NjU1YTk0YTY5YmJlNWExOTU3ZDMyMmVhYTNlMmRjLXJpbWctdzEwODAtaDE5MjAtZGMwODA4MDgtZ21pcj92PTE3OTMxMzA5NDI.avif" src="/site-assets/067968df6ecec18e.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Dia de Muertos Costume Party</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 07</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Richland, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/kennewick/event/100001998024186126?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Young Bakers: Cinnamon Sugar Focaccia – Holiday Baking Experience" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czQvYmFubmVycy83ZjI4MzY5YzIxYjgzNTY4Yjc2MThmOTY1OWUzMDc5ZjE2MjI4NTVhOGU3YmNlM2U4Y2Y0NWJjODRiZjE2NTgzLXJpbWctdzEyMDAtaDYwMC1kY2U4ZThkOC1nbWlyLmpwZz92PTE3ODk5MjI3NjM.avif" src="/site-assets/2f6fe850012af20e.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Young Bakers: Cinnamon Sugar Focaccia – Holiday Baking Experience</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 03</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Kennewick, United States</span></div>
                      <div className={"event_ticket_wrapper"}>
                        <div className={"event_ticket"}>
                          <div className={"ticket"}><i className={"icon-ticket-empty"} />
                                      USD 19.42
                                      </div>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/waitsburg/event/200030917473305?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="November HASA Meeting" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czcvYmFubmVycy9iMDg4MWFjYzMwZGE4YTYxZTQ2MzY1MzAyMzI5NWI4ODFiNDNiNWE4MTIyZjJkY2EyMjNkOGUwNjVkYWU4OGIxLXJpbWctdzEyMDAtaDY3NS1kY2Y4ZjhmOC1nbWlyP3Y9MTc5MzAzMzUyNQ.avif" src="/site-assets/ec20bff89cf1e4e4.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>November HASA Meeting</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 04</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Waitsburg, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/kennewick/event/2400030482576419?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Victoria Royals at Tri-City Americans at Toyota Center - Kennewick" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czYvYmFubmVycy8yMmI5NGRkMC1kMjFkLTExZjEtODQ0Ny05Nzc5ZTFhZTkzN2UtcmltZy13MTIwMC1oOTk3LWRjZjhmOGY4LWdtaXIuanBnP3Y9MTc5MzExNTgwMA.avif" src="/site-assets/5c2155e07930d7c6.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Victoria Royals at Tri-City Americans at Toyota Center - Kennewick</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 21</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Kennewick, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/kennewick/event/100001998161606153?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Lamb Vindaloo Cooking Class" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czEvYmFubmVycy83OWIwMzI2OWMyZjE0YzgwOGVjNjBlNTYxZGU5MDM3NGFhNjdiNTBjNDEwZDBhY2JlMWJjOGEzYzg5NTQ5ZDhhLXJpbWctdzEwODAtaDEwODAtZGNmOGY4ZjgtZ21pci5qcGc_dj0xNzg3MDY2OTg2.avif" src="/site-assets/d32d9204d1357f92.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Lamb Vindaloo Cooking Class</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Multiple dates</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Kennewick, United States</span></div>
                      <div className={"event_ticket_wrapper"}>
                        <div className={"event_ticket"}>
                          <div className={"ticket"}><i className={"icon-ticket-empty"} />
                                      USD 90.00
                                      </div>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/walla-walla/event/200030010290136?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="LIVE MUSIC: Eoghan Murphy" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czMvYmFubmVycy84MzFlYzdkZjU0ZmQxMDZkZWQ3OWZjMDNkNjBjZDA2NDZkMGNlMDhlZGYwODMyOWIyY2Y3ZDAzZWY5NDNhYjdlLXJpbWctdzU3MC1oNjYyLWRjMTYxNDE3LWdtaXI_dj0xNzc4OTgyMTM4.avif" src="/site-assets/f5fbbe7db569a2f5.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>LIVE MUSIC: Eoghan Murphy</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Multiple dates</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Walla Walla, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/kennewick/event/200030574267105?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Ramon Ayala At Toyota Center" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czcvYmFubmVycy8xYjNlMzg3ZThmNzRiZTNkMjVlZTlkNjEyODY4NGQ0NWU2NmZiZjMzMzQ1OGM2Yjk4YTYyMzFiZDI1ZWEyMTA0LXJpbWctdzkyMC1oNTY2LWRjZThlOGU4LWdtaXI_dj0xNzg4MTkxMzk2.avif" src="/site-assets/20f96f2b1dd450e5.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Ramon Ayala At Toyota Center</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 28</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Kennewick, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/pasco/event/200030938133015?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt={"Winter Paint &amp; Sip - Pasco Eagles"} data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czkvYmFubmVycy8zOGU1ZDIyODI1N2EyOWNmYmVlY2Q1M2FkNTQ1NjNlNzk0NTQwZDAyOWRjMjI1YThkZTg1M2FjOTA4ZmY3ZWZhLXJpbWctdzEyMDAtaDE2MDAtZGNhODk4ODgtZ21pcj92PTE3OTMzNDYyNTU.avif" src="/site-assets/f6c23efc799fa892.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Winter Paint &amp; Sip - Pasco Eagles</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 02</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Pasco, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/benton-city/event/100001988984060868?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Community Pickleball Night" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czYvYmFubmVycy8zZjA5NDdjYzgwMGU2Y2M0YmNjYzBjNmVkNGZlODllZjk3OTNhZjczMzc2MGY2YzE2MDEyN2U5OTI3NWY4NGQwLXJpbWctdzEyMDAtaDU5Ny1kYzg4NTg0OC1nbWlyLmpwZz92PTE3ODY0NTUzODA.avif" src="/site-assets/6efa47cec913076a.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Community Pickleball Night</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Multiple dates</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Benton City, United States</span></div>
                      <div className={"event_ticket_wrapper"} />
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/kennewick/event/200030783335442?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Tauren Wells Tickets" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czIvYmFubmVycy9jOTk1YTNkMzRjMTg2MjA0ODUyYjIyMDM4ZjljODdlOWQ2OTQ4MDBmOGM5ZDkyNjAyNjU3MTJiMWNiNGJjNjBlLXJpbWctdzEyMDAtaDY3NS1kYzQ4NDg0OC1nbWlyP3Y9MTc5MTI2NDk1OA.avif" src="/site-assets/fbe5321c5ff7e646.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Tauren Wells Tickets</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 03</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Kennewick, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/richland/event/100002002315067267?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Wavy Line Plate | Fused Glass" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czUvYmFubmVycy80NWUzNTFiNTU2MWJiODIwMzFjYzYxYzgyOTdhNGM1ZTYwOGZmODVkODU1OTYyNTU2YjVmZDgwYTQxNTAyYjFkLXJpbWctdzEyMDAtaDY3NS1kY2E4ODg2OC1nbWlyLmpwZz92PTE3OTAzNzcyNjU.avif" src="/site-assets/de559c2814a12b05.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Wavy Line Plate | Fused Glass</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 07</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Richland, United States</span></div>
                      <div className={"event_ticket_wrapper"}>
                        <div className={"event_ticket"}>
                          <div className={"ticket"}><i className={"icon-ticket-empty"} />
                                      USD 77.48
                                      </div>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/richland/event/200030749862209?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Little Lives Small Animal Monthly Adoption Event" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czQvYmFubmVycy8yYTE2YmI1NWUyZDA0MjE5YmE4OGEyNjI4ZDhlMmRlNTViMWE0OGEyY2JiM2ExOWQ4OTJjMDVlMzM0MDY4ZTExLXJpbWctdzEyMDAtaDE1MTEtZGNmOGY4ZjgtZ21pcj92PTE3OTA2NTAzMjk.avif" src="/site-assets/8df671942120235a.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Little Lives Small Animal Monthly Adoption Event</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Multiple dates</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Richland, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/richland/event/200030574480243?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Candlelight: 90s Hip-Hop on Strings | Tri-Cities" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czYvYmFubmVycy9hZTQxNTE0ODUxMWY5MTQwYjdkYjg0N2EyYWY5NDAyMDc0ODQ0MTBiYWY2MjBlOTI3MzQxMzhhYTVkYzg2NzA3LXJpbWctdzc2OC1oNzY4LWRjMDgwODA4LWdtaXI_dj0xNzg4MTk5OTU4.avif" src="/site-assets/70e7dceb71d8926c.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Candlelight: 90s Hip-Hop on Strings | Tri-Cities</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Multiple dates</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Richland, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/prosser/event/200030725144047?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Give It A Try Pottery Classes: Make Your Own Mug!" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czgvYmFubmVycy9kOTRmNzBhMmUzY2Y3ZDQwNDJiNjdlOGQ3ZDMxYjgxNjdkNmRlNjMwZjE1ZTk2OTU0NGRkMWZjNjg4NDVlOTA3LXJpbWctdzEyMDAtaDY3Ni1kY2Y4ZjhmOC1nbWlyP3Y9MTc5MDA1OTMwNw.avif" src="/site-assets/5dc544d268331c07.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Give It A Try Pottery Classes: Make Your Own Mug!</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Multiple dates</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Prosser, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/walla-walla/event/200030896857550?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Nite Wave Live 80s Party - Walla Walla Gesa Power House Theater " data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czUvYmFubmVycy9jNDBkZWVlZjk1YmU0ZDNlN2E3NmU5Mjc4YWE5ZDEwZGNlMDVmNDQyZDUzOTRhZWZmM2E5ODAwY2RmNTY5ZGUwLXJpbWctdzEyMDAtaDc5OC1kY2Y4ZjhmOC1nbWlyP3Y9MTc5MjgwOTk1MA.avif" src="/site-assets/3fe4305de52951f8.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Nite Wave Live 80s Party - Walla Walla Gesa Power House Theater </div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 06</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Walla Walla, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/pasco/event/200030865935413?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Supervolcanoes" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czQvYmFubmVycy85YjczYmMzYWNkNWEyMGM5MzRhMzg5MjdlNjRlMzgzMDNjMzUxMzBhMDQ0Y2YwZmQxZGFiYjRhNWE1ZjYzYmJmLXJpbWctdzk0NS1oMzE4LWRjMjgyODE4LWdtaXI_dj0xNzkyNTcwMTUy.avif" src="/site-assets/a66e8d9a60e773fc.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Supervolcanoes</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 06</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Pasco, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/richland/event/200030913807924?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Mobile Market - Richland" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czgvYmFubmVycy9mMzI0MTNhYmRhNWQ4ZmZhZWJmMzg1ZjM1MWIyNTA1MGUxMzM1ZjBmMjk0Y2YyZTY3NmMzOTc4OTAwZDVjNDFkLXJpbWctdzEyMDAtaDgwMC1kY2E4YjhjOC1nbWlyP3Y9MTc5Mjk4MTIyNA.avif" src="/site-assets/d63cc2ab127a87d0.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Mobile Market - Richland</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 05</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Richland, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/richland/event/200030736986010?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Cindy and Sally" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czMvYmFubmVycy9jYzE3MDU3Nzc1NzY4NjA2YWQ4OTRkMWQ1YmMyNzA1NDYwYWJlYzFkNDY2ZWYyYTFiYzBjZGE5MjQ4MTZlYzkxLXJpbWctdzk2MC1oNjQwLWRjMDgwODA4LWdtaXI_dj0xNzkwMzQ5NTUw.avif" src="/site-assets/7b6b5d04a4b2efe2.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Cindy and Sally</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Multiple dates</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Richland, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/pendleton/event/210002130018803?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Alexandra Kay" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czEvYmFubmVycy85YmU4MDE0YzE0ODk5OWUxZGQwOWNjMzQxMGQ0MTk2MjZlMzY1ZTU0MjM0Mjk4ZTQxMzZkMDk5ZDNhZjNhOTUwLXJpbWctdzEwMjQtaDU3Ni1kYzA4MDgwOC1nbWlyLmpwZz92PTE3OTMzOTMxNzI.avif" src="/site-assets/8c49ca52bac05b4a.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Alexandra Kay</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 20</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Pendleton, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/richland/event/200030638863541?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Geeks Who Drink: Pub Trivia" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czMvYmFubmVycy85MDE2ODAxNTZkZDUxNWFkOWJiMDY0Y2QyNTBmY2NmMzhjZDYzYzA4OTJhZDNhMGNlN2I3MDVhZDgxYWEzOWU5LXJpbWctdzEwODAtaDEwODAtZGMyODI4MjgtZ21pcj92PTE3ODgyMDg1NDA.avif" src="/site-assets/74f47c8e109569b9.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Geeks Who Drink: Pub Trivia</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Multiple dates</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Richland, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/kennewick/event/200030924346731?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Improv Comedy Show " data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czMvYmFubmVycy8zMzQzMTUzZjQ4MGRlNDJiNTc5MDk3MDQ3ZTg1NGFhMzBhNGUzNjY0MDU4ZjkxMzFkNDUxNjRkNjVkYmFlNGJkLXJpbWctdzEyMDAtaDE1NTMtZGMwODA4MDgtZ21pcj92PTE3OTMxMTk1MzE.avif" src="/site-assets/235a9536fbf1ea4f.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Improv Comedy Show </div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 07</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Kennewick, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/kennewick/event/100001996288626019?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="The Summers Hub - Kennewick Sports Card Show" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czcvYmFubmVycy81ZGNkMGE1ZDA5NGEwZWI2ZGIwYmZkMzBiMWY2MTkxZDZlYWZjN2M4NWNiMjEzNTRlZWE0ZDFiYzE1NmI2NzdmLXJpbWctdzkwOS1oMTQ5NC1kYzA4MDgwOC1nbWlyLmpwZz92PTE3ODU2MDAxMzA.avif" src="/site-assets/0da0a28ed398f367.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>The Summers Hub - Kennewick Sports Card Show</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Multiple dates</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Kennewick, United States</span></div>
                      <div className={"event_ticket_wrapper"}>
                        <div className={"event_ticket"}>
                          <div className={"ticket"}><i className={"icon-ticket-empty"} />
                                      USD 71.67
                                      </div>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/kennewick/event/200030841006856?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Book Recommendation Night" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czQvYmFubmVycy82NjIxZjlhYzlhOWRlODZjMWU3NjRmMDJlZGYzMDg4NjI1OWUxYmRiODMwYTlmZjc2OWRiZWMzYmE0ZTYyNTc1LXJpbWctdzEwODAtaDEwODAtZGNlOGQ4YzgtZ21pcj92PTE3OTIxMTY4OTY.avif" src="/site-assets/d00eacfc52b32b2a.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Book Recommendation Night</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 06</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Kennewick, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/walla-walla/event/200030737724031?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Anthony Nunziata" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czYvYmFubmVycy80MTQwNGUzOTQ3ZTZhYWNkN2EwNzBmMTJjNWM0NjNjYzIxNjMwZjNhY2VkZDU4MTEyMGJhOGVlNTM3OGFiYTA5LXJpbWctdzEyMDAtaDEwMDAtZGMwODA4MDgtZ21pcj92PTE3OTAzNTc2NzA.avif" src="/site-assets/ee6c4f01ecd067e8.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Anthony Nunziata</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 20</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Walla Walla, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/kennewick/event/200030912171328?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="La Nueva Pulga de Kennewick Abre 6 de November llame 509-539-2753" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czEwL2Jhbm5lcnMvNTcwYjg4MzY2ZWVmMDEzNjZhYWYxN2RiMjhhYWI3Mjg2MTcyZjY5OTE3YjBhNTNmMTg1MzJhYTI1NGQ3MTFmMC1yaW1nLXc3NTAtaDQwNi1kYzA4MDgwOC1nbWlyP3Y9MTc5Mjk3MzA2OA.avif" src="/site-assets/080605c09b260834.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>La Nueva Pulga de Kennewick Abre 6 de November llame 509-539-2753</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 06</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Kennewick, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/walla-walla/event/200030867667125?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Festival of Gifts" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czEvYmFubmVycy8yZTk4OTQ1Nzg1YjYyNDY3MzA1MmE1NTE3MThlZTRmMzMzNmVlOWU2OTlmZTYyYmQwYTc3NjI2MDU0ZjkxNWRkLXJpbWctdzEyMDAtaDY3NS1kY2Y4ZjhlOC1nbWlyP3Y9MTc5MjU4NTgyOQ.avif" src="/site-assets/b8ef71b28a70f70d.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Festival of Gifts</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 07</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Walla Walla, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/walla-walla/event/200030240313155?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="LIVE MUSIC: Diego Romero and Michael Agidius " data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czIvYmFubmVycy85NmM1MjEyYTMzZGVkYmZlMzlmOWMyODA1MzMyYmJiODE3ZWJiMTQ5MTgyY2RmNTM1MDEzMmY0NzMwYTQ5NGRmLXJpbWctdzEwODAtaDEwNDMtZGMwODA4MDgtZ21pcj92PTE3ODczNjY1MDk.avif" src="/site-assets/36a400fdc6ccb026.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>LIVE MUSIC: Diego Romero and Michael Agidius </div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Multiple dates</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Walla Walla, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/kennewick/event/200030884903243?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Paint Your Pet on Glass – Ages 16+" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czUvYmFubmVycy80NWY4NTMwNjc0OGRjYmQ0YTVhMmMyNTM3ZTc2MGVlYjM4ZTE0NGZlYWRjZDkzNDUyMmU5MTEzYjIyY2Q3ZDYxLXJpbWctdzEwODAtaDEzNTAtZGNmOGU4ZTgtZ21pcj92PTE3OTI3NDIzMjI.avif" src="/site-assets/586cd0e4a3a9d4e4.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Paint Your Pet on Glass – Ages 16+</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 04</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Kennewick, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/pendleton/event/200030198863508?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="FREE 1st Saturday" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czUvYmFubmVycy83Y2ZkMzBiZWIwZTEwY2RlMmZhODE5OGExN2EwOTNjMjZiZjg1MmRiMTBjNTRhMjUxOGE1MjM4YzgxMzhkMDhkLXJpbWctdzEyMDAtaDY3NS1kY2U4ZDhkOC1nbWlyP3Y9MTc4NTU5MTQxOQ.avif" src="/site-assets/222663b02b87e880.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>FREE 1st Saturday</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Multiple dates</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Pendleton, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/kennewick/event/210001152901209?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Ramon Ayala: Historia De Un Final" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czcvYmFubmVycy8yZjc4NWNkNTg4MjY2OGFmMDc3MjFiYzg1NTJlZGE3ZWJjNDZmZTAyMmU4NzlkMTU2MzRiZmIwOTljY2U2MjA4LXJpbWctdzEwMjQtaDU3Ni1kYzAxMDEwMC1nbWlyLmpwZz92PTE3ODUyMjcyNjk.avif" src="/site-assets/2514b39e13b45878.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Ramon Ayala: Historia De Un Final</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 28</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Kennewick, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/kennewick/event/200030906790341?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt={"Sammy Steele Duo Live @ The Southridge Dugout Bar &amp; Grill "} data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czkvYmFubmVycy85M2U5MzQyNzIwNDlmZTdhOTQyMGMzNzQ2MWRhZTMzYTIwYjBlZjM0N2JhZWQzNjI5MDdhZDRjNjkzNzhhZDhlLXJpbWctdzEyMDAtaDQ0NC1kYzU4MDgwOC1nbWlyP3Y9MTc5MjkyNTAyMQ.avif" src="/site-assets/4f1db3eabe7d09aa.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Sammy Steele Duo Live @ The Southridge Dugout Bar &amp; Grill </div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 06</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Kennewick, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/kennewick/event/2900030845381836?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt={"KOMPA MARLEY, GRUPO RENOVADOS &amp; GRUPO ZIFRA"} data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czUvYmFubmVycy8xMjQwM2FiMC1kNGJlLTExZjEtODU5OS1lMzUyYjBjNjg3MmYtcmltZy13MTIwMC1oMzQzLWRjMDgwODA4LWdtaXIuanBnP3Y9MTc5MzQwNDgyNA.avif" src="/site-assets/6e9b45f4436e57f1.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>KOMPA MARLEY, GRUPO RENOVADOS &amp; GRUPO ZIFRA</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Multiple dates</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Kennewick, United States</span></div>
                      <div className={"event_ticket_wrapper"}>
                        <div className={"event_ticket"}>
                          <div className={"ticket"}><i className={"icon-ticket-empty"} />
                                      USD 30
                                      </div>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/richland/event/200030867667430?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Holiday Open House" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czIvYmFubmVycy9jMjNmYjE1NTNmYWE1MmFlZjNjNDNhNDdhYWU3OTc3ZTcyMDIxMTg4MWVhNWFkMDIwYmFiZTM2NDQ2ODNjYWY4LXJpbWctdzEyMDAtaDYyOC1kY2Q4MTgyOC1nbWlyP3Y9MTc5MjU4NTgzMA.avif" src="/site-assets/b783b2d03c87e88c.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Holiday Open House</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 05</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Richland, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/pasco/event/200030736433446?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Trivia Thursdays" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czMvYmFubmVycy8zOTRlNTNjNzFjNzhkZGE1ZmYzYjYxYjI0ZWE0NTJlZjc0MWQ0MjM3ZTYwYWE0ZWJmNGQwMzI2OWZhZWI0ZTJlLXJpbWctdzExNjktaDExNjItZGNmOGY4ZjgtZ21pcj92PTE3OTAzNDIzODU.avif" src="/site-assets/7574594ae18e6b9a.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Trivia Thursdays</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Multiple dates</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Pasco, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/prosser/event/200030852057225?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Christmas Homemaking Swap" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czUvYmFubmVycy9iZTI0YzFmYzY1Y2E5N2MxMTc4YWNkOTUxYTgzZmQzNmMzNTdjZjkzZmNlYzY2ZjQ5NTllZjIxNGI4YzhiNDc0LXJpbWctdzEyMDAtaDE2MDAtZGMwODA4MDgtZ21pcj92PTE3OTIzMzg3NDU.avif" src="/site-assets/0b986e4ac62a149f.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Christmas Homemaking Swap</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 07</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Prosser, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/richland/event/200030819977303?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Nashville Writer's Round" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czgvYmFubmVycy9lYjVhNmFjM2VlOWMxYWRlNzI5OTY2ZDM2YjgzODU3NDIxODNlZTQxNjc2NGU5ZTE2ZGYyZGNlMGJjMmM0YTMxLXJpbWctdzEyMDAtaDE2MDAtZGMyODI4MjgtZ21pcj92PTE3OTE2OTY1NDM.avif" src="/site-assets/04ade07b3972800f.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Nashville Writer's Round</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 03</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Richland, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/richland/event/200030896719111?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="🇰🇷 Learn Korean Meetup! ✨" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czEvYmFubmVycy9lNTc1OTkwNjg0ODk2YmMzYzI5OWIzMjQxYTQ5NTFjMTBmYjc1ZjBmOTQxOTg1ODZhMjcxNWExNTkxMzQ2ZDg5LXJpbWctdzEyMDAtaDEyMDAtZGNlOGU4ZTgtZ21pcj92PTE3OTI4MDk0MzE.avif" src="/site-assets/a9aa42d42f29c029.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>🇰🇷 Learn Korean Meetup! ✨</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 07</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Richland, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/kennewick/event/200030090188354?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="PetSmart Adoptions 2nd and 4th Saturday Dogs and Cats" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czMvYmFubmVycy81NmQ0NGY1OWY3OThkODk4M2FhNDVmOGYxZDE2ZTJjYWZmYzMxN2JiZmI1MWI4ODU0NDUzMzk5ZmQxNGU5NTg1LXJpbWctdzEyMDAtaDgwMC1kY2YzZDc5MC1nbWlyP3Y9MTc3OTM3Mjg5Mw.avif" src="/site-assets/d406df2236cc8fb1.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>PetSmart Adoptions 2nd and 4th Saturday Dogs and Cats</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Multiple dates</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Kennewick, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/burbank/event/200030948648917?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Open House" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czQvYmFubmVycy8zODQwZDM5NmQwODQ1NDEzOTRjNGJhOTRjNmM5NDNlZjA5NGUzYjAyNmYzODNjMmI5ZDBjNTYzZTk3MGZlMTdjLXJpbWctdzEwNzgtaDE2MTgtZGNhOGE4OTgtZ21pcj92PTE3OTM1MzUzNzc.avif" src="/site-assets/a52e7aeaac2c7334.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Open House</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 08</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Burbank, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/walla-walla/event/200030896860558?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="In This Together: Dementia Caregiver Support Group" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czIvYmFubmVycy9jMjQ0NDVlMTYxYjY4YTVjYzAwYWU1OWRhODZlMjRjNjM4ZGU1ZmE1ODM1ZGM4NzliYmMwNTNiNjA4MDZiY2UyLXJpbWctdzEyMDAtaDgwMC1kYzQ4MzgyOC1nbWlyP3Y9MTc5MjgwOTk1OA.avif" src="/site-assets/41554c885a948a90.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>In This Together: Dementia Caregiver Support Group</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 05</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Walla Walla, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/pasco/event/200029882252722?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="2026 Tri Cities Holiday Expo" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czQvYmFubmVycy9lYWU4YTA1ZGJhYzk3N2I0ZWZjNjE3YjkyMjlhZWU5NWFjN2UwYjI2NDIxNTdjZTZjMTY1MmViMjM4YjAzYTg2LXJpbWctdzEyMDAtaDY3Ni1kYzI4MjgyOC1nbWlyP3Y9MTc4NzAxOTk2MA.avif" src="/site-assets/a2459ceaa063da6e.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>2026 Tri Cities Holiday Expo</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 27</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Pasco, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/kennewick/event/200030856579907?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Wastekeep Collegium and Exchequer Symposium" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czMvYmFubmVycy8yOTUyMDVlMDM2NzRhNDU5Zjc4YmFiYjU1NmMxNjEzNzBkY2YxZWJkNjJmNjdkOTA0NzljMzU2M2MwZDUyZTQ1LXJpbWctdzEwODAtaDQ3NS1kY2Y4ZjhmOC1nbWlyP3Y9MTc5MjQzMDY0Nw.avif" src="/site-assets/4860484bb0231b15.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Wastekeep Collegium and Exchequer Symposium</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 07</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Kennewick, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/richland/event/200030238890109?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="PFLAG Self Defense Series" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czUvYmFubmVycy9hYzM1YTRhMTJiYmYxZjgxMDM3ZjIzOTQ0MGFmNGY1MDM4MGJkMGJkOTY5ZTZhYjBlM2VhMzlhYWNmYWY3ZDJiLXJpbWctdzEwODAtaDEwODAtZGNjOGM4ZDgtZ21pcj92PTE3ODYxMTk1Njc.avif" src="/site-assets/ae581938fa0a75dc.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>PFLAG Self Defense Series</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Multiple dates</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Richland, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/walla-walla/event/200030896858853?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Join Us for Our Upcoming Election Night Watch Party " data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czEvYmFubmVycy8yNTlmMmIzMjMyZjQ0MDg5ZDAxZTdlMzVjMTE4NGQ1YzE5ZGE3YmJjMzU2OTIwMWU4MTU5YjQzMDQzZDc3MDhjLXJpbWctdzEyMDAtaDYwMC1kYzM4YjhmOC1nbWlyP3Y9MTc5MjgwOTk1Mg.avif" src="/site-assets/97bdb7577376f89a.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Join Us for Our Upcoming Election Night Watch Party </div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 03</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Walla Walla, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/kennewick/event/200030824636037?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Bret Charles McInturf’s Celebration of Life " data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czUvYmFubmVycy8zMjcwMjc1YTFhNmNkNzQ5NDRhYWVjNzg1MDQzMDQ1ZTM4ZjIyNGVlZjA3MThhZGI5YjBiM2U3Y2M5ZjUzN2IwLXJpbWctdzEyMDAtaDE2MDAtZGMwODA4MDgtZ21pcj92PTE3OTE3OTAzNjA.avif" src="/site-assets/7d50973a06cf4ef3.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Bret Charles McInturf’s Celebration of Life </div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 07</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Kennewick, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/kennewick/event/200030924338338?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Holiday Horse at TROT" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czYvYmFubmVycy9hN2M5NWFjZjI0ZmZhYjQ3NDFhY2ZlYzVjOTRkNGRlYTM4Yjk1MDkwMTU2ZTg4MTcxNGM0MDRkOWY0YTkyNTE0LXJpbWctdzEyMDAtaDE2MDAtZGNmOGY4ZjgtZ21pcj92PTE3OTMxMTk0Nzg.avif" src="/site-assets/4011438cd26d7599.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Holiday Horse at TROT</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 06</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Kennewick, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/boardman/event/200030774469137?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Holiday Makers Market" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czUvYmFubmVycy80OWJjYmJlMDNiOTYwOTEwOWI2NzIyOWVhYTVjMmVlNTQzMzg1ZTJmNzYzOGRjYWJhZTJlMTY5YWIzMmQ1ZmYyLXJpbWctdzEyMDAtaDY3NS1kY2Y4ZjhmOC1nbWlyP3Y9MTc5MTEzMzIzNw.avif" src="/site-assets/c5444d91a9ef7a0c.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Holiday Makers Market</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 06</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Boardman, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/kennewick/event/200030841005952?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt={"Sip, Shop &amp; Celebrate | A Tri-Cities Holiday Event"} data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czEwL2Jhbm5lcnMvYjhjMWUwYTQ1YTNkN2E3ZGZjZDM5YzU3NjJlYmUzMDBlM2IzNzYyYzY0ODJiYWU4OGE1MjQ2ZDQzM2Y2Y2ZiYi1yaW1nLXcxMjAwLWg2MzAtZGMyODI4MDgtZ21pcj92PTE3OTIxMTY4OTI.avif" src="/site-assets/b3a2d6ea00cf83f1.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Sip, Shop &amp; Celebrate | A Tri-Cities Holiday Event</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 07</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Kennewick, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/richland/event/200030926346649?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Election Night Watch Party w/ PFLAG " data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czEvYmFubmVycy84YmQ1ZDMxOTA3MmQ1NTk2MGE0OTNkMmM4ZDk0ZjRjNzhlNjM5MWQ5MTA3ZmQwYTdhZWExYzAyZWQ1YjhiMmQ5LXJpbWctdzEwODAtaDEzNTAtZGNmOGY4ZjgtZ21pcj92PTE3OTMxMzA4ODk.avif" src="/site-assets/0b91a109f7713d37.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Election Night Watch Party w/ PFLAG </div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 03</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Richland, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/kennewick/event/200030924332048?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Parent Planning Meeting" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czkvYmFubmVycy8yYmI0NzgxNjgzODIzNjI1Nzc0NDM3MzYzMjZhODE4NzY3ZDZiNmQzZGY2MjhiNDUzM2YwMGEzOWYyNTBiNTA0LXJpbWctdzEyMDAtaDEyMDAtZGMwODA4MDgtZ21pcj92PTE3OTMxMTk0Mjg.avif" src="/site-assets/c280d00c0af11777.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Parent Planning Meeting</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 04</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Kennewick, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/boardman/event/200030735222414?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Toddler Time -- Every Tuesday!" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czYvYmFubmVycy9mYTY1NmZhMTI3NGU4ZjhlZTY4ZTNlNWI3NzQyN2QyYzQ3Njc5NTJiMzY0NTZkNGYyMjc5NGMzNDE0M2UxM2Y3LXJpbWctdzEwODAtaDEwODAtZGNmOGY4ZjgtZ21pcj92PTE3OTAzMTUxMTQ.avif" src="/site-assets/4bd3c3552bbae32f.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Toddler Time -- Every Tuesday!</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Multiple dates</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Boardman, United States</span></div>
                    </div>
                  </a>
                </div>
                <div className={"event_card"}>
                  <a href="/kennewick/event/200030785355605?ref=quicksearch-t-events" target="_blank">
                    <div className={"event_pic"}>
                      <div className={"event_thumbnail"}>
                        <img alt="Big O’ Pumpkin- Ages 10+" data-src="https://cdn-ip.allevents.in/s/rs:fill:500:250/g:sm/sh:100/aHR0cHM6Ly9jZG4tYXouYWxsZXZlbnRzLmluL2V2ZW50czMvYmFubmVycy80Yjg4NDQ1YTA5NGNjZjIyNjE3YzM0ZWFiNzE4NGU2ZjJjOGJlZGVkNjc2ODRmNzExMjk2YzNkOGY5YmNiYWQ5LXJpbWctdzEyMDAtaDk2MC1kY2Q4ZDhkOC1nbWlyP3Y9MTc5MTI3ODA0NA.avif" src="/site-assets/f889e7b83b18cd40.avif" loading="eager" {...({ lazy: "loading" } as any)} />
                      </div>
                    </div>
                    <div className={"event_details"}>
                      <div className={"event_name"}>Big O’ Pumpkin- Ages 10+</div>
                      <div className={"event_meta event_when"}><i className={"icon icon-calendar-empty"} /> <span className={"event_meta_text"}>Nov 07</span> </div>
                      <div className={"event_meta event_where"}><i className={"icon icon-map-marker-2"} /> <span className={"event_meta_text"}>Kennewick, United States</span></div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

function ImportedNavMainNavigation({ openCity, selectedCity = "Indore" }: { openCity: () => void; selectedCity?: string }) {
  return (
    <nav role="navigation" aria-label="Main Navigation">
      <ul className={"nav topuserinfomobile"}>
        <li className={"ae-top-visible-city li1"}>
          <a href="/indore">{"\n\t\t\t\t\t\t\t\t\t\t\t\t\t"}<div className={"ae-icon-marker new-svg-icon"} />{"\n\t\t\t\t\t\t\t\t\t\t\t\t\t"}<span className={"toh city-select-width"}>{selectedCity}</span>{"\n\t\t\t\t\t\t                        \t\t"}<button onClick={e => { e.preventDefault(); openCity(); }} className={"city-select-button tltp mcity-select"}>{"\n\t\t\t\t\t\t                        \t\t"}<span className={"city-select-v-middle"}>Change City</span>{"\n\t\t\t\t\t\t\t\t\t\t\t\t\t"}</button>{"\n\t\t\t\t\t\t\t\t\t\t\t\t"}</a>
        </li>
        <li className={"svg-item-box"}>
          <a className={"e_main_title1 track"} href="/vibe-instant" target="_blank" rel="noopener noreferrer"><div className={"ae-icon-magic new-svg-icon"} /><span className={"e_nav_item"}>⚡ Vibe Instant</span></a></li><li className={"svg-item-box"}><button type="button" onClick={() => triggerPwaInstall()} className={"e_main_title1 track"} style={{ width: "100%", textAlign: "left", background: "none", border: "none", padding: "10px 15px", cursor: "pointer", display: "flex", alignItems: "center" }}><div className={"new-svg-icon"} style={{ display: "flex", alignItems: "center", justifyContent: "center", marginRight: "10px" }}><Download style={{ width: "16px", height: "16px", color: "#0a6cf0" }} /></div><span className={"e_nav_item"} style={{ fontWeight: 600, color: "#0a6cf0" }}>Download App</span></button></li><li className={"svg-item-box"}><a className={"e_main_title1 track"} href="/how-it-works" target="_blank" rel="noopener noreferrer">
            <div className={"ae-icon-info new-svg-icon"} />
            <span className={"e_nav_item"}>How it works</span>
          </a>
        </li>
        <li className={"svg-item-box"}>
          <a className={"login-action e_main_title1 track"} href="#" id="login-top-mob">
            <div className={"ae-icon-login new-svg-icon"} />
            <span className={"e_nav_item"}>Login</span>
          </a>
        </li>
        <li className={"divider divider-margin-1"} />
        <li className={"section-padding-0"}>
          <p className={"e_main_title"}>Host Control</p>
        </li>
        <li className={"svg-item-box"}>
          <a className={"create-action e_main_title1 track"} href="/create" rel="nofollow">
            <div className={"ae-icon-plus-2 new-svg-icon"} />
            <span className={"e_nav_item"}>Host an event</span>
          </a>
        </li>
        <li className={"svg-item-box"}>
          <a className={"dashboard-action e_main_title1 track"} href="/dashboard">
            <div className={"ae-icon-dashboard new-svg-icon"} />
            <span className={"e_nav_item"}>Host Dashboard</span>
          </a>
        </li>
        <li className={"svg-item-box"}>
          <a className={"e_main_title1 track"} href="/manage/manage-events.php?ref=topbar-dropdown" title="">
            <div className={"ae-icon-cal new-svg-icon"} />
            <span className={"e_nav_item"}>Manage events</span>
          </a>
        </li>
        <li className={"divider divider-margin-2"} />
        <li className={"svg-item-box app-download-bg"}>
          <a className={"e_main_title1 track app-download-color"} href={"/app?ref=topbar-dropdown&utm_source=allevents&utm_medium=topbar&utm_campaign=topbar_get_app&utm_content=topbar-dropdown&ct=topbar-dropdown"} target="_blank">
            <div className={"for-phone new-svg-icon"} />
            <span className={"e_nav_item"}>Get the AllEventsApp</span>
            <span className={"badge badge-important"}>New</span>
          </a>
        </li>
        <li className={"svg-item-box"}>
          <a className={"e_main_title1 track"} href="/pages/support?ref=topbar-dropdown" target="_blank">
            <div className={"ae-icon-square-question new-svg-icon"} />
            <span className={"e_nav_item"}>Need help?</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}

function ImportedFooterSiteNavigation() {
  return (
    <footer className={"footer"}>
      <h2 className={"hide"}>Site Navigation</h2>
      <div className={"home-footer1"} style={{ marginTop: "30px" }}>
        <div className={"\x63ontainer"}>
          <div className={"row"} style={{ float: "left", textAlign: "left", overflow: "hidden" }}>
            <div className={"span3-ms ft1span3 first-column"}>
              <div className={"another-div"} style={{ marginTop: "5px" }}>
                <a className={"footer-04__logo_link"} href="/" style={{ display: "inline-block", marginBottom: "8px" }}>
                  <img
                    style={{ height: "36px", width: "auto", objectFit: "contain", display: "block" }}
                    title="Vibe logo"
                    className={"allevents_logo"}
                    alt="Vibe Footer Logo"
                    src="/site-assets/vibe-logo-light.png"
                  />
                </a>
                <p className={"goto-content"} style={{ color: "rgba(255, 255, 255, 0.75)", marginTop: "10px", fontSize: "13px", lineHeight: "1.6", maxWidth: "260px" }}>
                  Go-to place to discover events for more than 20M people globally.
                </p>
              </div>
            </div>
            <div className={"span3-ms ft1span3 last-four"}>
              <h3 className={"footer-head-title"} style={{ marginLeft: "10px" }}>Discover Events</h3>
              <ul className={"home-footer-links"}>
                <li>
                  <a href="/recommended?ref=footer-n-home-page" target="_blank" title="Events for You">Events for You</a>
                </li>
                <li>
                  <a href="/online?ref=footer-n-home-page" target="_blank" title="Virtual Events">Virtual Events</a>
                </li>
                <li>
                  <a href="/pages/subscribe?ref=footer-n-home-page" target="_blank" title="Get Event Updates">Get Event Updates</a>
                </li>
                <li>
                  <a href="/app?ref=footer-n-home-page" target="_blank" title="Event Discovery App">Event Discovery App</a>
                </li>
              </ul>
            </div>
            <div className={"span3-ms ft1span3 last-four"}>
              <h3 className={"footer-head-title"} style={{ marginLeft: "10px" }}>For Organizers</h3>
              <ul className={"home-footer-links"}>
                <li>
                  <a href="/pages/event-listing?ref=footer-n-home-page" target="_blank" title="List Your Event">List Your Event</a>
                </li>
                <li>
                  <a href="/pages/event-marketing?ref=footer-n-home-page" target="_blank" title="Promote Your Event">Promote Your Event</a>
                </li>
                <li>
                  <a href="/pages/pricing?ref=footer-n-home-page" target="_blank" title="Pricing Plans">Pricing Plans</a>
                </li>
                <li>
                  <a href="/pages/event-ticketing?ref=footer-n-home-page" target="_blank" title="Event Ticketing Software">Event Ticketing Software</a>
                </li>
                <li>
                  <a href="/pages/event-manager-app?ref=footer-n-home-page" target="_blank" title="Event Manager App">Event Manager App</a>
                </li>
                <li>
                  <a href="/pages/events-on-demand?ref=footer-n-home-page" target="_blank" title="Host Recorded Events">Host Recorded Events</a>
                </li>
              </ul>
            </div>
            <div className={"span3-ms ft1span3 last-four"}>
              <h3 className={"footer-head-title"} style={{ marginLeft: "10px" }}>Host Better Events</h3>
              <ul className={"home-footer-links"}>
                <li>
                  <a href="/pages/qr-code-generator?ref=footer-n-home-page" target="_blank" title="QR Code Generator">QR Code Generator</a>
                </li>
                <li>
                  <a href="/pages/utm-builder?ref=footer-n-home-page" target="_blank" title="Trackable Link Generator">Trackable Link Generator</a>
                </li>
                <li>
                  <a href="/blog?ref=footer-n-home-page" target="_blank" title="Blog">Blog</a>
                </li>
                <li>
                  <a href="/pages/event-promotion?ref=footer-n-home-page" target="_blank" title="Learn Event Marketing">Learn Event Marketing</a>
                </li>
              </ul>
            </div>
            <div className={"span3-ms lastone ft1span3 last-four"}>
              <h3 className={"footer-head-title"} style={{ marginLeft: "10px" }}>Explore</h3>
              <ul className={"home-footer-links"}>
                <li>
                  <a href="/pages/events-listing-plugin?ref=footer-n-home-page" target="_blank" title="Event Plugins for websites">Event Listing Plugin</a>
                </li>
                <li>
                  <a className={"tltp"} href="/blog/media-kit?ref=footer-n-home-page" rel="nofollow" target="_blank" title="All Events Logo Media Kit">Media Kit</a>
                </li>
                <li>
                  <a className={"tltp track"} href="/pages/affiliate-program?ref=footer-n-home-page" rel="nofollow" target="_blank" title="Join AllEvents Affiliate Program">Affiliate Program</a>
                </li>
                <li>
                  <a href="/pages/events-api?ref=footer-n-home-page" target="_blank" title="Events Api">Events API</a>
                </li>
                <li>
                  <a className={"tltp"} href="https://support.allevents.in?ref=footer-n-home-page" rel="nofollow" target="_blank" title="Support Center">Support Center</a>
                </li>
                <li>
                  <a className={"tltp"} href="/pages/write-for-us?ref=footer-n-home-page" target="_blank" title="Blog ">Write for Us</a>
                </li>
                <li>
                  <div>
                    <a href="/pages/careers?ref=join-us-footer" style={{ padding: "15px 5px", float: "left", width: "100%" }} target="_blank">
                      <img className={"lazy"} style={{ display: "inline", maxWidth: "120px" }} width="160" height="20" alt="Join Us" title="Join Us" src="/site-assets/97806174d8ea08f9.webp" />
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className={"home-footer3"}>
        <div className={"\x63ontainer"}>
          <ul style={{ margin: "0px 0px 0px 10px" }}>
            <li>
              <a href="/about" title="About Us and the All Events in City team">About</a>
            </li>
            <li>
              <a href="/pages/careers">Careers</a>
            </li>
            <li>
              <a href="https://support.allevents.in" target="_blank" title="Frequently Asked Questions and Support">Support</a>
            </li>
            <li>
              <a href="/pages/media-coverage" title="Media Coverage Page">Media Coverage</a>
            </li>
            <li>
              <a href="/conditions" rel="nofollow" title={"Terms & Conditions"}>Terms of Service</a>
            </li>
            <li>
              <a href="/privacy" rel="nofollow" title="Privacy">Privacy</a>
            </li>
            <li>
              <a href="/contact" rel="nofollow" title="Contact Us">Contact Us</a>
            </li>
          </ul>
        </div>
      </div>
      <div className={"home-footer4"}>
        <div className={"\x63ontainer"}>
          <div className={"span6 cpy-right "} style={{ margin: "10px", textAlign: "left" }}>
            <span>© Copyright 2026. All Rights Reserved</span>
          </div>
          <p className={"footer-social pull-right"}><a className={"btn btn-topbar tltp"} data-original-title="Go to Homepage" href="/" title="Go to Homepage"><i className={"icon-home"} /></a><a className={"btn btn-topbar tltp"} data-original-title="Like us Facebook" href="https://facebook.com/allevents.in" rel="nofollow noopener noreferrer" target="_blank" title="Like us Facebook"><i className={"icon-facebook"} /></a><a className={"btn btn-topbar tltp"} data-original-title="Follow on Twitter" href="https://twitter.com/allevents_in" rel="nofollow noopener noreferrer" target="_blank" title="Follow on Twitter"><i className={"icon icon-twitter"} style={{ fontSize: "11px" }} /></a><a className={"btn btn-topbar tltp"} data-original-title="Follow us on Instagram" href="https://www.instagram.com/allevents_official/" rel="nofollow noopener noreferrer" target="_blank" title="Follow us on Instagram"><i className={"icon-instagram"} /></a><a className={"btn btn-topbar tltp"} data-original-title="Follow us on Youtube" href="https://www.youtube.com/@allevents-in" rel="nofollow noopener noreferrer" target="_blank" title="Follow us on Youtube"><i className={"icon-youtube"} /></a><a className={"btn btn-topbar tltp"} data-original-title="Follow us on Pinterest" href="https://in.pinterest.com/allevents_in/" rel="nofollow noopener noreferrer" target="_blank" title="Follow us on Pinterest"><i className={"icon-pinterest-sign"} /></a><a className={"btn btn-topbar tltp"} data-original-title="Back to Top" href="#" id="back-to-top" rel="nofollow" title="Back to Top"><i className={"icon-chevron-up icon-white"} /></a></p>
        </div>
      </div>
    </footer>
  );
}
