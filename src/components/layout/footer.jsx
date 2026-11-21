import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter, Youtube } from "lucide-react";
import { Logo } from "@/components/layout/logo";

const social = [
  { icon: Facebook, label: "Facebook", href: "https://facebook.com" },
  { icon: Instagram, label: "Instagram", href: "https://instagram.com" },
  { icon: Twitter, label: "Twitter", href: "https://twitter.com" },
  { icon: Youtube, label: "YouTube", href: "https://youtube.com" },
];

export function Footer() {
  return (
    <footer className="mt-24 bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo light />
          <p className="mt-4 max-w-sm text-sm text-primary-foreground/75">
            WedPlan connects couples with trusted photographers, venues, florists, caterers and stylists, and keeps every booking request in one place.
          </p>
          <div className="mt-5 flex gap-3">
            {social.map(({ icon: Icon, label, href }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="rounded-full border border-primary-foreground/25 p-2 hover:bg-primary-foreground/10">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-display text-xl">Explore</h4>
          <ul className="mt-3 space-y-2 text-sm text-primary-foreground/75">
            <li><Link href="/" className="hover:text-white">Home</Link></li>
            <li><Link href="/services" className="hover:text-white">Browse Services</Link></li>
            <li><Link href="/sign-in" className="hover:text-white">Sign In</Link></li>
            <li><Link href="/sign-up" className="hover:text-white">Sign Up</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-xl">Contact</h4>
          <ul className="mt-3 space-y-2 text-sm text-primary-foreground/75">
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" />hello@wedplan.com</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" />+880 1700 000000</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4" />Dhaka, Bangladesh</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/15 py-5 text-center text-xs text-primary-foreground/60">
        © {new Date().getFullYear()} WedPlan. All rights reserved.
      </div>
    </footer>
  );
}
