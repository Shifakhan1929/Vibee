import { createFileRoute } from "@tanstack/react-router";
import { HostDashboard } from "../components/HostDashboard";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      {
        title: "Host Dashboard · Manage Events, RSVPs & Dispatches | Vibe",
      },
      {
        name: "description",
        content:
          "Manage your hosted gatherings, monitor live guest registrations, broadcast real-time updates, and scan passes at the door with Vibe Host Space.",
      },
      {
        property: "og:title",
        content: "Host Dashboard · Vibe by Swaniki Studio",
      },
      {
        property: "og:description",
        content:
          "Your events, your guests, all together. Real-time guest attendance, gross revenue tracking, and live dispatch announcements.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  return <HostDashboard />;
}

