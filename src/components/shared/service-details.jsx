"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Crown, MapPin, Tag } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAsync } from "@/lib/use-async";
import { money } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FieldError, Input, Label, Textarea } from "@/components/ui/input";
import { SmartImage } from "@/components/shared/smart-image";
import { ErrorState } from "@/components/shared/ui-bits";
import { Skeleton } from "@/components/ui/skeleton";

export function ServiceDetails({ id, user }) {
  const { data, loading, error } = useAsync(() => api(`/api/services/${id}`), [id]);
  const [active, setActive] = useState(0);

  if (loading) {
    return (
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-[1.4fr_1fr]">
        <Skeleton className="h-[420px]" />
        <Skeleton className="h-[420px]" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <ErrorState message={error === "Invalid service ID" || error === "Service not found" ? "This service does not exist or is no longer available." : error} />
        <div className="mt-6 text-center"><Button asChild variant="outline"><Link href="/services">Back to services</Link></Button></div>
      </div>
    );
  }

  const service = data.data;
  const images = service.images?.length ? service.images : [null];
  const vendorName = service.vendor?.businessName || service.vendor?.name || "Vendor";
  const isOwner = service.vendorId === user.id;
  const available = service.status === "approved" && service.isActive;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link href="/services" className="mb-6 inline-flex items-center gap-2 text-sm text-muted hover:text-foreground"><ArrowLeft className="h-4 w-4" />All services</Link>
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="overflow-hidden rounded-2xl border border-border">
            <SmartImage src={images[active]} alt={service.serviceName} className="h-[420px] w-full object-cover" />
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex flex-wrap gap-3">
              {images.map((img, i) => (
                <button key={img} onClick={() => setActive(i)} aria-label={`Show image ${i + 1}`} className={`h-20 w-24 overflow-hidden rounded-xl border-2 cursor-pointer ${i === active ? "border-gold" : "border-transparent"}`}>
                  <SmartImage src={img} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
          <h2 className="mt-8 text-3xl">About this service</h2>
          <p className="mt-3 whitespace-pre-line leading-relaxed text-muted">{service.description}</p>
        </div>

        <div className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <Card className="p-6">
            <Badge>{service.category}</Badge>
            <h1 className="mt-3 text-4xl leading-tight">{service.serviceName}</h1>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-muted"><MapPin className="h-4 w-4" />{service.location}</p>
            <p className="mt-5 flex items-center gap-2 font-display text-4xl text-primary"><Tag className="h-5 w-5 text-gold" />{money(service.price)}</p>
            <div className="mt-6">
              <BookingAction service={service} user={user} isOwner={isOwner} available={available} />
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="text-2xl">Vendor</h3>
            <div className="mt-3 flex items-center gap-3">
              <SmartImage src={service.vendor?.image} className="h-12 w-12 rounded-full object-cover" />
              <div>
                <p className="font-medium">{vendorName}</p>
                {service.vendor?.name && service.vendor.businessName && <p className="text-sm text-muted">{service.vendor.name}</p>}
              </div>
              {service.vendor?.isPremium && <Badge tone="premium" className="ml-auto gap-1"><Crown className="h-3 w-3" />Premium</Badge>}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function BookingAction({ service, user, isOwner, available }) {
  const [open, setOpen] = useState(false);

  if (!available) return <p className="rounded-xl bg-sage/60 px-4 py-3 text-sm">This service is not open for booking right now.</p>;
  if (user.role === "admin") return <p className="rounded-xl bg-sage/60 px-4 py-3 text-sm">Admin accounts cannot send booking requests.</p>;
  if (user.role === "vendor") {
    return <p className="rounded-xl bg-sage/60 px-4 py-3 text-sm">{isOwner ? "You cannot book your own service." : "Switch to a customer account to send booking requests."}</p>;
  }
  return (
    <>
      <Button size="lg" className="w-full" onClick={() => setOpen(true)}>Request booking</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent title="Request a booking" description={`Send your event details to ${service.vendor?.businessName || service.vendor?.name || "the vendor"}.`}>
          <BookingForm serviceId={service._id} onDone={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}

function BookingForm({ serviceId, onDone }) {
  const [form, setForm] = useState({ eventDate: "", eventLocation: "", message: "" });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    const next = {};
    if (!form.eventDate) next.eventDate = "Choose your event date";
    else if (form.eventDate < today) next.eventDate = "Event date cannot be in the past";
    if (form.eventLocation.trim().length < 2) next.eventLocation = "Enter the event location";
    setErrors(next);
    if (Object.keys(next).length) return;
    setBusy(true);
    try {
      const res = await api("/api/customer/bookings", { method: "POST", body: { serviceId, ...form } });
      toast.success(res.message);
      onDone();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <div>
        <Label htmlFor="eventDate">Event date</Label>
        <Input id="eventDate" type="date" min={today} value={form.eventDate} onChange={set("eventDate")} />
        <FieldError>{errors.eventDate}</FieldError>
      </div>
      <div>
        <Label htmlFor="eventLocation">Event location</Label>
        <Input id="eventLocation" value={form.eventLocation} onChange={set("eventLocation")} placeholder="Venue or city" />
        <FieldError>{errors.eventLocation}</FieldError>
      </div>
      <div>
        <Label htmlFor="message">Additional message</Label>
        <Textarea id="message" value={form.message} onChange={set("message")} placeholder="Guest count, style, timing or anything else the vendor should know" />
      </div>
      <Button type="submit" className="w-full" loading={busy}>Send booking request</Button>
    </form>
  );
}
