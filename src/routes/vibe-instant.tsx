import { createFileRoute } from "@tanstack/react-router";
import { VibeReelsFeed } from "../components/VibeReelsFeed";

export const Route = createFileRoute("/vibe-instant")({
  head: () => ({
    meta: [
      {
        title:
          "Vibe Instant — Spontaneous Meetups & Live Event Reels | Vibe",
      },
      {
        name: "description",
        content:
          "Experience real-time flash meetups, full-screen event reels, box cricket games, acoustic jams, and spontaneous gatherings in your city on Vibe Instant.",
      },
      {
        property: "og:title",
        content: "Vibe Instant — Spontaneous Meetups & Event Reels",
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
  component: VibeInstantPage,
});

function VibeInstantPage() {
  return <VibeReelsFeed />;
}
