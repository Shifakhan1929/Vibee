import { createFileRoute } from "@tanstack/react-router";
import { VibeReelsFeed } from "../components/VibeReelsFeed";

export const Route = createFileRoute("/vibes")({
  head: () => ({
    meta: [
      {
        title:
          "Event Reels — Discover Live Gatherings | Vibe",
      },
      {
        name: "description",
        content:
          "Experience real-time flash meetups, full-screen event reels, box cricket games, acoustic jams, and spontaneous gatherings in your city on Vibe Instant.",
      },
      {
        property: "og:title",
        content: "Event Reels — Vibe",
      },
      {
        property: "og:description",
        content:
          "Swipe full-screen live reels and join spontaneous meetups across India with 1-click RSVP passes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VibesPage,
});

function VibesPage() {
  return <VibeReelsFeed />;
}

