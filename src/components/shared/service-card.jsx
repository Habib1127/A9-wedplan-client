import Link from "next/link";
import { MapPin, Crown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SmartImage } from "@/components/shared/smart-image";
import { money } from "@/lib/utils";

export function ServiceCard({ service }) {
  const vendorName = service.vendor?.businessName || service.vendor?.name || "Vendor";
  return (
    <Card className="group flex flex-col overflow-hidden transition-shadow hover:shadow-lg">
      <div className="relative h-52 overflow-hidden">
        <SmartImage src={service.images?.[0]} alt={service.serviceName} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <Badge className="absolute left-3 top-3 bg-card/95">{service.category}</Badge>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-2xl leading-tight">{service.serviceName}</h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-muted"><MapPin className="h-3.5 w-3.5" />{service.location}</p>
        <div className="mt-3 flex items-center gap-2 text-sm">
          <SmartImage src={service.vendor?.image} className="h-6 w-6 rounded-full object-cover" />
          <span className="truncate">{vendorName}</span>
          {service.vendor?.isPremium && <Crown className="h-3.5 w-3.5 text-gold" aria-label="Premium vendor" />}
        </div>
        <div className="mt-auto flex items-center justify-between pt-5">
          <p className="font-display text-2xl text-primary">{money(service.price)}</p>
          <Button asChild size="sm"><Link href={`/services/${service._id}`}>View details</Link></Button>
        </div>
      </div>
    </Card>
  );
}
