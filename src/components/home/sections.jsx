"use client";

import Link from "next/link";
import { motion, MotionConfig } from "framer-motion";
import { ArrowRight, BadgeCheck, CalendarCheck, ClipboardList, Search, ShieldCheck, Sparkles, Wallet } from "lucide-react";
import { publicApi } from "@/lib/api";
import { useAsync } from "@/lib/use-async";
import { CATEGORIES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ServiceCard } from "@/components/shared/service-card";
import { SmartImage } from "@/components/shared/smart-image";
import { CardGridSkeleton, EmptyState, ErrorState } from "@/components/shared/ui-bits";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
const rise = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } };

export function Hero() {
  return (
    <MotionConfig reducedMotion="user">
      <section className="relative overflow-hidden bg-blush/50">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <motion.div variants={container} initial="hidden" animate="show">
            <motion.p variants={rise} className="mb-4 inline-flex items-center gap-2 rounded-full bg-card px-4 py-1.5 text-sm text-primary">
              <Sparkles className="h-4 w-4 text-gold" /> Wedding vendors you can book today
            </motion.p>
            <motion.h1 variants={rise} className="text-5xl leading-[1.05] sm:text-6xl lg:text-7xl">
              Plan the wedding you pictured, with vendors who show up.
            </motion.h1>
            <motion.p variants={rise} className="mt-5 max-w-xl text-lg text-muted">
              Compare photographers, venues, florists, caterers and stylists in one place, then send a booking request with your date and location.
            </motion.p>
            <motion.div variants={rise} className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg"><Link href="/services">Explore Wedding Services <ArrowRight className="h-4 w-4" /></Link></Button>
              <Button asChild size="lg" variant="outline"><Link href="/sign-up">Join as a vendor</Link></Button>
            </motion.div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative mx-auto w-full max-w-md">
            <div className="arch h-[460px] overflow-hidden border-8 border-card bg-sage shadow-xl">
              <SmartImage src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80" alt="Couple on their wedding day" className="h-full w-full object-cover" />
            </div>
            <div className="absolute -bottom-4 -left-4 hidden rounded-2xl border border-border bg-card px-5 py-3 shadow-lg sm:block">
              <p className="font-display text-2xl text-primary">6 categories</p>
              <p className="text-xs text-muted">Every part of the day covered</p>
            </div>
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
}

export function SectionHeading({ title, text, action }) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className="text-4xl sm:text-5xl">{title}</h2>
        {text && <p className="mt-2 max-w-xl text-muted">{text}</p>}
      </div>
      {action}
    </div>
  );
}

export function FeaturedServices() {
  const { data, loading, error, reload } = useAsync(() => publicApi("/api/services?limit=6&sort=newest"), []);
  return (
    <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6">
      <SectionHeading
        title="Featured wedding services"
        text="Newly approved services from vendors who are open for bookings."
        action={<Button asChild variant="outline"><Link href="/services">See all services</Link></Button>}
      />
      {loading ? <CardGridSkeleton /> : error ? <ErrorState message={error} onRetry={reload} /> : !data.data.length ? (
        <EmptyState title="No services yet" text="Approved services will appear here as soon as vendors publish them." />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.data.map((s) => <ServiceCard key={s._id} service={s} />)}
        </div>
      )}
    </section>
  );
}

export function CategoriesSection() {
  const { data } = useAsync(() => publicApi("/api/services/categories"), []);
  const counts = Object.fromEntries((data?.data || []).map((c) => [c.name, c.count]));
  return (
    <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6">
      <SectionHeading title="Browse by category" text="Start with the part of the day you want to settle first." />
      <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map(({ name, icon: Icon, blurb }) => (
          <motion.div key={name} variants={rise}>
            <Link href={`/services?category=${encodeURIComponent(name)}`} className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-gold">
              <span className="arch flex h-16 w-14 shrink-0 items-end justify-center bg-sage pb-3 text-primary"><Icon className="h-6 w-6" /></span>
              <span className="flex-1">
                <span className="block font-display text-2xl leading-tight">{name}</span>
                <span className="block text-sm text-muted">{blurb}{counts[name] !== undefined ? `, ${counts[name]} listed` : ""}</span>
              </span>
              <ArrowRight className="h-4 w-4 text-gold transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

const reasons = [
  { icon: BadgeCheck, title: "Reviewed listings", text: "Every service is checked by an admin before it appears on the site." },
  { icon: Wallet, title: "Prices up front", text: "See what a service costs before you send a single message." },
  { icon: CalendarCheck, title: "One request, one answer", text: "Send your date and location, and track the vendor's reply from your dashboard." },
  { icon: ShieldCheck, title: "Protected accounts", text: "Role-based access and verified payments keep customers and vendors safe." },
];

export function WhyChoose() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6">
      <SectionHeading title="Why choose WedPlan?" text="Built for couples who want clear answers and vendors who want serious requests." />
      <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {reasons.map(({ icon: Icon, title, text }) => (
          <motion.div key={title} variants={rise}>
            <Card className="h-full p-6">
              <span className="inline-flex rounded-full bg-blush p-3 text-primary"><Icon className="h-5 w-5" /></span>
              <h3 className="mt-4 text-2xl">{title}</h3>
              <p className="mt-2 text-sm text-muted">{text}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

const steps = [
  { icon: Search, title: "Find a service", text: "Search by name, category or location and sort by price." },
  { icon: ClipboardList, title: "Send a request", text: "Share your event date, venue and any details the vendor should know." },
  { icon: CalendarCheck, title: "Track the answer", text: "Watch the request move from pending to accepted from your dashboard." },
];

export function HowItWorks() {
  return (
    <section className="mx-auto mt-24 max-w-7xl px-4 sm:px-6">
      <div className="rounded-3xl bg-sage/60 px-6 py-14 sm:px-12">
        <SectionHeading title="How WedPlan works" />
        <ol className="grid gap-8 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="relative">
              <span className="font-display text-6xl text-gold/60">{i + 1}</span>
              <h3 className="mt-1 flex items-center gap-2 text-2xl"><Icon className="h-5 w-5 text-primary" />{title}</h3>
              <p className="mt-2 text-sm text-muted">{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function VendorCta() {
  return (
    <section className="mx-auto mt-24 max-w-7xl px-4 sm:px-6">
      <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-primary px-8 py-12 text-primary-foreground md:flex-row md:items-center">
        <div>
          <h2 className="text-4xl">Run a wedding business?</h2>
          <p className="mt-2 max-w-lg text-primary-foreground/75">List up to 3 services for free, or go Premium for unlimited listings and a vendor badge.</p>
        </div>
        <Button asChild variant="gold" size="lg"><Link href="/sign-up">Create a vendor account</Link></Button>
      </div>
    </section>
  );
}
