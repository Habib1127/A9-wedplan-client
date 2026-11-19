import { Camera, Landmark, Flower2, UtensilsCrossed, Sparkles, Shirt } from "lucide-react";

export const CATEGORIES = [
  { name: "Photography & Videography", icon: Camera, blurb: "Moments kept for good" },
  { name: "Wedding Venues", icon: Landmark, blurb: "Halls, gardens and resorts" },
  { name: "Decoration & Florist", icon: Flower2, blurb: "Stage, flowers and lights" },
  { name: "Catering Services", icon: UtensilsCrossed, blurb: "Menus for every guest list" },
  { name: "Makeup & Styling", icon: Sparkles, blurb: "Bridal and family looks" },
  { name: "Wedding Fashion", icon: Shirt, blurb: "Outfits and tailoring" },
];

export const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'><rect width='800' height='600' fill='#dfe8e0'/><text x='400' y='310' font-family='Georgia' font-size='36' fill='#2f4a3c' text-anchor='middle'>WedPlan</text></svg>`,
  );
