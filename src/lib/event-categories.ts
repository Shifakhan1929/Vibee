export const EVENT_CATEGORIES = [
  { slug: "music", name: "Music", filter: "Music & Concerts", image: "93b82224d173105b.webp" },
  { slug: "concerts", name: "Concerts", filter: "Music & Concerts", image: "39053defbb43a63c.webp" },
  { slug: "parties", name: "Parties & Nightlife", filter: "Nightlife & Parties", image: "2b0ccf40e274f844.webp" },
  { slug: "food-drinks", name: "Food & Drinks", filter: "Food & Drinks", image: "546d76e37ce0d8e0.webp" },
  { slug: "crafts", name: "Crafts & Workshops", filter: "Workshops & Classes", image: "8f9bebffbc7bf57d.webp" },
  { slug: "festivals", name: "Festivals", filter: "Festivals", image: "d0af47ed09716286.webp" },
  { slug: "kids", name: "Kids & Family", filter: "Kids & Family", image: "57fa7e9248221a5f.webp" },
  { slug: "photography", name: "Photography", filter: "Photography", image: "930522db410623d7.webp" },
  { slug: "sports", name: "Sports & Fitness", filter: "Sports", image: "bc422fd976b63917.webp" },
  { slug: "business", name: "Business & Networking", filter: "Business & Networking" },
  { slug: "arts", name: "Arts & Theatre", filter: "Arts & Theatre" },
  { slug: "comedy", name: "Comedy", query: "comedy" },
  { slug: "wellness", name: "Health & Wellness", query: "wellness" },
  { slug: "yoga", name: "Yoga", query: "yoga" },
  { slug: "dance", name: "Dance", query: "dance" },
  { slug: "meetups", name: "Meetups", query: "meetup" },
] as const;

export function citySlugForName(name: string): string {
  return name.trim().toLowerCase() === "delhi ncr" ? "delhi" : name.trim().toLowerCase().replace(/\s+/g, "-");
}

export function categorySearch(category: typeof EVENT_CATEGORIES[number]): { category?: string; q?: string } {
  return "filter" in category ? { category: category.filter } : { q: category.query };
}