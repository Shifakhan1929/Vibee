import { useState, useEffect, useRef } from "react";
import "./BotCreateSection.css";

/* ==========================================================================
   CONSTANTS & CONFIGURATION (Easily editable from the top of the file)
   ========================================================================== */

export const BOT_LINKS = {
  whatsapp: "https://wa.me/919183123093?text=Vibe%2FEvents",
  telegram: "https://t.me/VibeCurator_bot?start=Vibe_Events",
};

export const BOT_CONTENT = {
  h1: "Create an event as easily as sending a text.",
  subtext:
    "No forms and no app to install. Message our bot on WhatsApp or Telegram and your event goes live in seconds.",
  steps: [
    {
      number: 1,
      title: "Send the basics or a poster",
      prefix: "Type",
      codeChip: "Open Mic Night, 15 Nov, Cafe Brew",
      suffix: "or just share your flyer.",
    },
    {
      number: 2,
      title: "The bot builds your event",
      description:
        "It reads the name, date, venue and price, then shows you a preview.",
    },
    {
      number: 3,
      title: "Share your event link",
      description:
        "Guests can RSVP right away, and you manage everything from your host dashboard.",
    },
  ],
  buttons: {
    whatsapp: "Create on WhatsApp",
    telegram: "Create on Telegram",
  },
  mutedNote: "Free for hosts. Edit or cancel anytime from your dashboard.",
};

export interface ChatEventCardData {
  title: string;
  isLive: boolean;
  when: string;
  where: string;
  entry: string;
  link: string;
}

export type ChatItem =
  | { type: "user-text"; text: string }
  | {
      type: "user-poster";
      title: string;
      tag: string;
      venue: string;
      price: string;
    }
  | { type: "bot-typing" }
  | { type: "bot-text"; text: string }
  | { type: "bot-card"; card: ChatEventCardData };

export const TYPE_IT_FINAL_ITEMS: ChatItem[] = [
  { type: "user-text", text: "Open Mic Night, 15 Nov, Cafe Brew Indore" },
  { type: "bot-text", text: "Got it. Creating your event…" },
  {
    type: "bot-card",
    card: {
      title: "Open Mic Night",
      isLive: true,
      when: "15 Nov, 7:00 PM",
      where: "Cafe Brew, Indore",
      entry: "Free",
      link: "vibe.swaniki.com/e/open-mic-night",
    },
  },
  {
    type: "bot-text",
    text: "Your event is live. Share the link with your guests.",
  },
];

export const POSTER_FINAL_ITEMS: ChatItem[] = [
  {
    type: "user-poster",
    tag: "LIVE MUSIC",
    title: "Sunset Beats",
    venue: "22 Nov · Sky Deck, Pune",
    price: "₹499",
  },
  { type: "bot-text", text: "Reading your poster…" },
  {
    type: "bot-card",
    card: {
      title: "Sunset Beats",
      isLive: true,
      when: "22 Nov, 6:30 PM",
      where: "Sky Deck, Pune",
      entry: "₹499",
      link: "vibe.swaniki.com/e/sunset-beats",
    },
  },
  {
    type: "bot-text",
    text: "I filled in the details from your poster. Reply to edit anything.",
  },
];

/* ==========================================================================
   INLINE SVG ICONS
   ========================================================================== */

function WhatsAppIcon() {
  return (
    <svg
      className="bot-icon"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.93.52 3.8 1.5 5.44L2.2 22l4.82-1.39a9.88 9.88 0 0 0 5.02 1.34h.01c5.46 0 9.91-4.45 9.91-9.91A9.91 9.91 0 0 0 12.04 2zm0 18.06h-.01a8.17 8.17 0 0 1-4.2-1.15l-.3-.18-3.09.89.83-3-.2-.31a8.19 8.19 0 0 1-1.28-4.4c0-4.52 3.68-8.2 8.2-8.2 2.19 0 4.25.85 5.8 2.4a8.16 8.16 0 0 1 2.4 5.8c0 4.52-3.68 8.15-8.15 8.15zm4.49-6.13c-.25-.12-1.46-.72-1.68-.81-.23-.08-.39-.12-.56.12-.17.25-.65.81-.8 1-.15.18-.3.2-.55.08-.25-.13-1.07-.39-2.03-1.25-.75-.67-1.26-1.5-1.4-1.75-.15-.25-.02-.39.1-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.32-.02-.45-.06-.12-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.72 4.31 3.81.6.26 1.07.42 1.44.54.61.19 1.16.17 1.6.1.49-.07 1.46-.6 1.67-1.18.21-.57.21-1.07.15-1.18-.06-.11-.23-.17-.48-.3z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg
      className="bot-icon"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.52 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .37z" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function SendPlaneIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
  );
}

/* ==========================================================================
   COMPONENT: BotCreateSection
   ========================================================================== */

export function BotCreateSection() {
  const [activeTab, setActiveTab] = useState<"type" | "poster">("type");
  const [chatItems, setChatItems] = useState<ChatItem[]>([]);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];
  };

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      // Show full static state immediately without looping animation
      setChatItems(activeTab === "type" ? TYPE_IT_FINAL_ITEMS : POSTER_FINAL_ITEMS);
      return;
    }

    const runChatLoop = () => {
      clearAllTimeouts();
      setChatItems([]);

      if (activeTab === "type") {
        // Step 0: User types message immediately
        const t0 = setTimeout(() => {
          setChatItems([
            {
              type: "user-text",
              text: "Open Mic Night, 15 Nov, Cafe Brew Indore",
            },
          ]);
        }, 100);

        // Step 1: Bot typing dots appear
        const t1 = setTimeout(() => {
          setChatItems((prev) => [...prev, { type: "bot-typing" }]);
        }, 800);

        // Step 2: Replace typing dots with "Got it. Creating your event…"
        const t2 = setTimeout(() => {
          setChatItems((prev) => [
            ...prev.filter((i) => i.type !== "bot-typing"),
            { type: "bot-text", text: "Got it. Creating your event…" },
          ]);
        }, 1900);

        // Step 3: Bot typing dots again
        const t3 = setTimeout(() => {
          setChatItems((prev) => [...prev, { type: "bot-typing" }]);
        }, 2700);

        // Step 4: Replace typing with Event Preview Card
        const t4 = setTimeout(() => {
          setChatItems((prev) => [
            ...prev.filter((i) => i.type !== "bot-typing"),
            {
              type: "bot-card",
              card: {
                title: "Open Mic Night",
                isLive: true,
                when: "15 Nov, 7:00 PM",
                where: "Cafe Brew, Indore",
                entry: "Free",
                link: "vibe.swaniki.com/e/open-mic-night",
              },
            },
          ]);
        }, 3800);

        // Step 5: Bot text "Your event is live. Share the link with your guests."
        const t5 = setTimeout(() => {
          setChatItems((prev) => [
            ...prev,
            {
              type: "bot-text",
              text: "Your event is live. Share the link with your guests.",
            },
          ]);
        }, 4800);

        // Step 6: Pause about 4 seconds, clear and loop
        const t6 = setTimeout(() => {
          runChatLoop();
        }, 9000);

        timeoutsRef.current = [t0, t1, t2, t3, t4, t5, t6];
      } else {
        // "Send a poster" flow
        // Step 0: User shares CSS poster
        const t0 = setTimeout(() => {
          setChatItems([
            {
              type: "user-poster",
              tag: "LIVE MUSIC",
              title: "Sunset Beats",
              venue: "22 Nov · Sky Deck, Pune",
              price: "₹499",
            },
          ]);
        }, 100);

        // Step 1: Bot typing dots
        const t1 = setTimeout(() => {
          setChatItems((prev) => [...prev, { type: "bot-typing" }]);
        }, 900);

        // Step 2: Bot reads poster
        const t2 = setTimeout(() => {
          setChatItems((prev) => [
            ...prev.filter((i) => i.type !== "bot-typing"),
            { type: "bot-text", text: "Reading your poster…" },
          ]);
        }, 2000);

        // Step 3: Bot typing dots
        const t3 = setTimeout(() => {
          setChatItems((prev) => [...prev, { type: "bot-typing" }]);
        }, 2800);

        // Step 4: Event Card
        const t4 = setTimeout(() => {
          setChatItems((prev) => [
            ...prev.filter((i) => i.type !== "bot-typing"),
            {
              type: "bot-card",
              card: {
                title: "Sunset Beats",
                isLive: true,
                when: "22 Nov, 6:30 PM",
                where: "Sky Deck, Pune",
                entry: "₹499",
                link: "vibe.swaniki.com/e/sunset-beats",
              },
            },
          ]);
        }, 3900);

        // Step 5: Final Bot confirmation
        const t5 = setTimeout(() => {
          setChatItems((prev) => [
            ...prev,
            {
              type: "bot-text",
              text: "I filled in the details from your poster. Reply to edit anything.",
            },
          ]);
        }, 4900);

        // Step 6: Pause about 4 seconds and loop
        const t6 = setTimeout(() => {
          runChatLoop();
        }, 9200);

        timeoutsRef.current = [t0, t1, t2, t3, t4, t5, t6];
      }
    };

    runChatLoop();

    return () => {
      clearAllTimeouts();
    };
  }, [activeTab]);

  return (
    <section className="bot-create-section" aria-label="Create event via messaging bot">
      <div className="bot-create-container">
        {/* ==================================================================
            LEFT COLUMN
            ================================================================== */}
        <div className="bot-create-left">
          <h2 className="bot-create-h1">{BOT_CONTENT.h1}</h2>

          <p className="bot-create-subtext">{BOT_CONTENT.subtext}</p>

          {/* 3-Step vertical list */}
          <div className="bot-steps-list">
            {BOT_CONTENT.steps.map((step, idx) => (
              <div className="bot-step-item" key={step.number}>
                <div className="bot-step-indicator">
                  <div className="bot-step-circle">{step.number}</div>
                  {idx < BOT_CONTENT.steps.length - 1 && (
                    <div className="bot-step-line" aria-hidden="true" />
                  )}
                </div>

                <div className="bot-step-content">
                  <h3 className="bot-step-title">{step.title}</h3>
                  <p className="bot-step-desc">
                    {step.number === 1 ? (
                      <>
                        {step.prefix}{" "}
                        <code className="bot-code-chip">{step.codeChip}</code>{" "}
                        {step.suffix}
                      </>
                    ) : (
                      step.description
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="bot-action-buttons">
            <a
              href={BOT_LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="bot-btn bot-btn-primary"
            >
              <WhatsAppIcon />
              <span>{BOT_CONTENT.buttons.whatsapp}</span>
            </a>

            <a
              href={BOT_LINKS.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="bot-btn bot-btn-secondary"
            >
              <TelegramIcon />
              <span>{BOT_CONTENT.buttons.telegram}</span>
            </a>
          </div>

          {/* Muted Footer Note */}
          <p className="bot-muted-note">{BOT_CONTENT.mutedNote}</p>
        </div>

        {/* ==================================================================
            RIGHT COLUMN (Phone Chat Demo)
            ================================================================== */}
        <div className="bot-create-right">
          {/* Tab Toggle */}
          <div
            className="bot-tab-toggle"
            role="tablist"
            aria-label="Demonstration mode"
          >
            <button
              type="button"
              role="tab"
              id="tab-type"
              aria-selected={activeTab === "type"}
              aria-controls="panel-chat-demo"
              onClick={() => setActiveTab("type")}
              className="bot-tab-btn"
            >
              <span>Type it</span>
            </button>

            <button
              type="button"
              role="tab"
              id="tab-poster"
              aria-selected={activeTab === "poster"}
              aria-controls="panel-chat-demo"
              onClick={() => setActiveTab("poster")}
              className="bot-tab-btn"
            >
              <span>Send a poster</span>
            </button>
          </div>

          {/* Phone Frame */}
          <div className="bot-phone-frame">
            <div
              className="bot-phone-screen"
              id="panel-chat-demo"
              role="tabpanel"
              aria-labelledby={activeTab === "type" ? "tab-type" : "tab-poster"}
            >
              {/* Chat Header */}
              <div className="bot-chat-header">
                <div className="bot-avatar" aria-hidden="true">
                  V
                </div>
                <div className="bot-header-info">
                  <div className="bot-header-name">Vibe Bot</div>
                  <div className="bot-header-status">
                    <span className="bot-status-dot" aria-hidden="true" />
                    <span>online</span>
                  </div>
                </div>
              </div>

              {/* Chat Messages Area */}
              <div
                className="bot-chat-area"
                role="region"
                aria-live="polite"
                aria-atomic="false"
              >
                {chatItems.map((item, index) => {
                  if (item.type === "user-text") {
                    return (
                      <div key={index} className="bot-bubble-wrapper">
                        <div className="bot-bubble-user">{item.text}</div>
                      </div>
                    );
                  }

                  if (item.type === "user-poster") {
                    return (
                      <div key={index} className="bot-bubble-wrapper">
                        <div className="bot-poster-card" aria-label="Event Poster">
                          <div className="bot-poster-glow" aria-hidden="true" />
                          <div>
                            <div className="bot-poster-tag">{item.tag}</div>
                            <div className="bot-poster-title">{item.title}</div>
                          </div>
                          <div className="bot-poster-bottom">
                            <div className="bot-poster-venue">{item.venue}</div>
                            <div className="bot-poster-badge">{item.price}</div>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  if (item.type === "bot-typing") {
                    return (
                      <div key={index} className="bot-bubble-wrapper">
                        <div
                          className="bot-typing-bubble"
                          aria-label="Vibe bot is typing..."
                        >
                          <span className="bot-typing-dot" />
                          <span className="bot-typing-dot" />
                          <span className="bot-typing-dot" />
                        </div>
                      </div>
                    );
                  }

                  if (item.type === "bot-text") {
                    return (
                      <div key={index} className="bot-bubble-wrapper">
                        <div className="bot-bubble-bot">{item.text}</div>
                      </div>
                    );
                  }

                  if (item.type === "bot-card") {
                    return (
                      <div key={index} className="bot-bubble-wrapper">
                        <div className="bot-event-card">
                          <div className="bot-event-card-header">
                            <h4 className="bot-event-card-title">{item.card.title}</h4>
                            {item.card.isLive && (
                              <span className="bot-live-pill">
                                <span className="bot-live-dot" />
                                Live
                              </span>
                            )}
                          </div>
                          <div className="bot-event-card-body">
                            <div className="bot-card-row">
                              <span className="bot-card-row-label">When:</span>
                              <span className="bot-card-row-value">{item.card.when}</span>
                            </div>
                            <div className="bot-card-row">
                              <span className="bot-card-row-label">Where:</span>
                              <span className="bot-card-row-value">{item.card.where}</span>
                            </div>
                            <div className="bot-card-row">
                              <span className="bot-card-row-label">Entry:</span>
                              <span className="bot-card-row-value">{item.card.entry}</span>
                            </div>
                          </div>
                          <div className="bot-event-card-footer">
                            <GlobeIcon />
                            <span>{item.card.link}</span>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return null;
                })}
              </div>

              {/* Fake Message Input Bar */}
              <div className="bot-input-bar">
                <div className="bot-input-field">
                  <span>Message…</span>
                </div>
                <div className="bot-send-btn" aria-hidden="true">
                  <SendPlaneIcon />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

