import { useState, type ReactNode } from "react";

/**
 * ============================================================================
 * VIBE EVENT PREVIEW DATA CONFIGURATION
 * ============================================================================
 * 
 * WHERE TO EDIT:
 * - Modify the object below to change banners, titles, venues, progress %, or buttons.
 * 
 * HOW TO REPLACE WITH A BACKEND API LATER:
 * 1. Define an API endpoint in your server / Nitro route (e.g., /api/event-previews).
 * 2. In your component or route loader, fetch the data:
 *      const [previewData, setPreviewData] = useState<Record<string, EventPreviewItem>>(EVENT_PREVIEW_DATA);
 *      useEffect(() => {
 *        fetch('/api/event-previews')
 *          .then(res => res.json())
 *          .then(data => setPreviewData(data))
 *          .catch(console.error);
 *      }, []);
 * 3. Pass `previewData` into `<EventTypePreview data={previewData} />`.
 */
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
  /** Optional custom data dictionary (defaults to EVENT_PREVIEW_DATA) */
  data?: Record<string, EventPreviewItem>;
  /** Optional initial selected key (defaults to 'cricket') */
  defaultSelected?: EventTypeKey;
  /** Optional callback fired when a chip or card button is clicked, useful to prefill category filter */
  onCategoryFilterPreFill?: (categoryName: string, eventId: string) => void;
  /** Optional click handler for the card's primary action button */
  onCardActionClick?: (item: EventPreviewItem) => void;
}

export function EventTypePreview({
  data = EVENT_PREVIEW_DATA,
  defaultSelected = "cricket",
  onCategoryFilterPreFill,
  onCardActionClick,
}: EventTypePreviewProps) {
  // Exactly one chip active at any time, defaulting to cricket
  const [selectedType, setSelectedType] = useState<EventTypeKey>(defaultSelected);

  // Animation trigger counter - increments on EVERY click (even on the same chip twice)
  // to force remount of the card's slide-up/fade-in animation
  const [animKey, setAnimKey] = useState<number>(0);

  // Active item lookup with fallback to cricket
  const activeItem: EventPreviewItem = data[selectedType] ?? data["cricket"] ?? {
    id: "cricket",
    label: "Cricket match",
    banner: "Cricket",
    title: "Sunday Gully Cricket, need 4 more",
    meta: "Sun, 7:00 AM · Ground 2, Arera Colony",
    progress: 64,
    spots: "7 of 11 joined",
    button: "Join for ₹100",
  };

  const handleChipClick = (key: EventTypeKey) => {
    setSelectedType(key);
    // Increment animKey so React replays the animation even if the same chip is clicked
    setAnimKey((prev) => prev + 1);

    // Optional category pre-fill hook
    const item = data[key];
    if (item && onCategoryFilterPreFill) {
      onCategoryFilterPreFill(item.banner, item.id);
    }
  };

  const handlePrimaryButtonClick = () => {
    if (onCardActionClick) {
      onCardActionClick(activeItem);
    } else if (onCategoryFilterPreFill) {
      onCategoryFilterPreFill(activeItem.banner, activeItem.id);
    }
  };

  return (
    <>
      {/* 1. Chips Row (Directly below search bar) */}
      <div
        className="vibe-hero-chips"
        style={{ gridArea: "chips" }}
      >
        <div
          role="group"
          aria-label="Event type preview options"
          className="vibe-chips-row"
        >
          {EVENT_TYPE_KEYS.map((key) => {
            const item = data[key];
            if (!item) return null;
            const isActive = selectedType === key;

            return (
              <button
                key={key}
                type="button"
                aria-pressed={isActive}
                onClick={() => handleChipClick(key)}
                className={`vibe-chip-btn ${isActive ? "vibe-chip-active" : "vibe-chip-inactive"}`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Exactly ONE Preview Card (Updated in place, never 5 cards rendered) */}
      <div
        className="vibe-hero-card"
        style={{ gridArea: "card" }}
      >
        {/* Animated Card Container */}
        <div
          key={animKey}
          className="vibe-preview-card vibe-card-animated"
          aria-live="polite"
        >
          {/* Soft Cyan Glow Behind Top-Right Corner */}
          <div className="vibe-card-glow" aria-hidden="true" />

          {/* Banner with Gradient (Navy -> Blue -> Cyan) */}
          <div className="vibe-card-banner">
            <div className="vibe-banner-tag">
              <span className="vibe-banner-dot" />
              <span className="vibe-banner-text">{activeItem.banner}</span>
            </div>
            <span className="vibe-banner-badge">Preview</span>
          </div>

          {/* Card Body */}
          <div className="vibe-card-body">
            {/* Title */}
            <h3 className="vibe-card-title">{activeItem.title}</h3>

            {/* Meta Line: Date, Time & Venue */}
            <p className="vibe-card-meta">
              <svg
                className="vibe-meta-icon"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{activeItem.meta}</span>
            </p>

            {/* Progress Bar (8px tall, Gradient from Blue to Cyan, smooth width transition) */}
            <div className="vibe-progress-track" aria-hidden="true">
              <div
                className="vibe-progress-fill"
                style={{ width: `${Math.min(100, Math.max(0, activeItem.progress))}%` }}
              />
            </div>

            {/* Spots Status Text */}
            <div className="vibe-spots-row">
              <span className="vibe-spots-text">{activeItem.spots}</span>
              <span className="vibe-spots-percent">{activeItem.progress}% filled</span>
            </div>

            {/* Primary Action Button */}
            <button
              type="button"
              onClick={handlePrimaryButtonClick}
              className="vibe-card-button"
            >
              <span>{activeItem.button}</span>
              <svg
                className="vibe-button-arrow"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

