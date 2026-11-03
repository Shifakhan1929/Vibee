import { createFileRoute } from "@tanstack/react-router";
import { HostEventStudio } from "../components/HostEventStudio";

export const Route = createFileRoute("/host")({
  head: () => ({
    meta: [
      {
        title: "Host Studio · Plan Your Next Gathering | Vibe",
      },
      {
        name: "description",
        content:
          "Design, distribute, and publish editorial event landing pages in seconds. AI poster ingestion, instant RSVP ticketing, and multi-channel distribution across India.",
      },
      {
        property: "og:title",
        content: "Host Studio · Vibe",
      },
      {
        property: "og:description",
        content:
          "Design, distribute, and publish editorial event landing pages in seconds with AI verification and instant passes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HostPage,
});

function HostPage() {
  return <HostEventStudio />;
}

