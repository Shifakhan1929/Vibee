import { useState, useEffect } from "react";

export interface EventPreviewItem {
  id: "comedy" | "cricket" | "music" | "workshop" | "party" | string;
  label: string;
  banner: string;
  title: string;
  meta: string;
  progress: number;
  spots: string;
  button: string;
}

export type EventTypeKey = "comedy" | "cricket" | "music" | "workshop" | "party";

export const EVENT_PREVIEW_DATA: Record<EventTypeKey, EventPreviewItem> = {
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
  "comedy",
  "cricket",
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
  defaultSelected = "comedy",
  onCategoryFilterPreFill,
  onCardActionClick,
}: EventTypePreviewProps) {
  const [selectedType, setSelectedType] = useState<EventTypeKey>(defaultSelected);
  const [animKey, setAnimKey] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const activeItem: EventPreviewItem =
    data[selectedType] ?? data["comedy"] ?? EVENT_PREVIEW_DATA.comedy;

  // Auto-rotate event preview every 4 seconds smoothly
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setSelectedType((prevType) => {
        const currentIndex = EVENT_TYPE_KEYS.indexOf(prevType);
        const nextIndex = (currentIndex + 1) % EVENT_TYPE_KEYS.length;
        return EVENT_TYPE_KEYS[nextIndex] ?? prevType;
      });
      setAnimKey((prev) => prev + 1);
    }, 4500);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handlePrimaryButtonClick = () => {
    if (onCardActionClick) {
      onCardActionClick(activeItem);
    } else if (onCategoryFilterPreFill) {
      onCategoryFilterPreFill(activeItem.banner, activeItem.id);
    }
  };

  return (
    <div
      className="vibe-hero-card w-full flex justify-center"
      style={{ gridArea: "card" }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Exactly ONE Preview Card (Upper buttons completely removed per user request) */}
      <div
        key={animKey}
        className="vibe-preview-card vibe-card-animated"
        aria-live="polite"
      >
        {/* Soft Cyan Glow Behind Top-Right Corner */}
        <div className="vibe-card-glow" aria-hidden="true" />

        {/* Top Header Banner with Blue-to-Cyan Gradient (Matching user screenshot) */}
        <div className="vibe-card-banner">
          <div className="vibe-banner-tag">
            <span className="vibe-banner-dot" />
            <span className="vibe-banner-text">{activeItem.banner}</span>
          </div>
        </div>

        {/* Crisp White Card Body */}
        <div className="vibe-card-body">
          {/* Headline Title */}
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

          {/* Progress Bar (Gradient from Blue to Cyan) */}
          <div className="vibe-progress-track" aria-hidden="true">
            <div
              className="vibe-progress-fill"
              style={{ width: `${Math.min(100, Math.max(0, activeItem.progress))}%` }}
            />
          </div>

          {/* Spots Status Row */}
          <div className="vibe-spots-row">
            <span className="vibe-spots-text">{activeItem.spots}</span>
            <span className="vibe-spots-percent">{activeItem.progress}% filled</span>
          </div>

          {/* Bottom Card Actions */}
          <div className="vibe-card-actions">
            {/* Primary Action Button (e.g., Get ticket ₹299 ->) */}
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

            {/* View All Similar Events Secondary Button */}
            <a
              href="/vibe-instant"
              className="vibe-card-view-all-btn group"
              title="View all similar events"
            >
              <span className="vibe-similar-bolt">⚡</span>
              <span>View all similar events</span>
              <svg
                className="vibe-similar-arrow"
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
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
