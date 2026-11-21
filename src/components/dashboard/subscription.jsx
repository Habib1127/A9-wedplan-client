"use client";

import { useState } from "react";
import { Check, Crown } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAsync } from "@/lib/use-async";
import { fmtDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DataBoundary, PageHeader } from "@/components/shared/ui-bits";

const free = ["Maximum 3 active services", "Basic vendor dashboard", "Booking request management"];
const premium = ["Unlimited active services", "Premium vendor badge", "All Free plan features"];

export function Subscription() {
  const { data, loading, error, reload } = useAsync(() => api("/api/me"), []);
  const [busy, setBusy] = useState(false);

  async function upgrade() {
    setBusy(true);
    try {
      const res = await api("/api/payments/checkout", { method: "POST" });
      window.location.href = res.data.url;
    } catch (err) {
      toast.error(err.message);
      setBusy(false);
    }
  }

  async function cancel() {
    setBusy(true);
    try {
      const res = await api("/api/payments/cancel", { method: "POST" });
      toast.success(res.message);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
      reload();
    }
  }

  const me = data?.data;
  const isPremium = me?.subscriptionPlan === "premium";

  return (
    <>
      <PageHeader title="Subscription" text="Choose the plan that fits how many services you publish." />
      <DataBoundary loading={loading} error={error} onRetry={reload}>
        {me && (
          <div className="grid max-w-4xl gap-6 md:grid-cols-2">
            <Plan title="Free" price="$0" features={free} current={!isPremium} />
            <Plan title="Premium" price="$19 / month" features={premium} current={isPremium} highlight>
              {isPremium ? (
                <div className="space-y-3">
                  {me.subscriptionExpiresAt && <p className="text-sm text-muted">Renews or ends on {fmtDate(me.subscriptionExpiresAt)}</p>}
                  <Button variant="outline" loading={busy} onClick={cancel}>Cancel at period end</Button>
                </div>
              ) : (
                <Button variant="gold" className="w-full" loading={busy} onClick={upgrade}><Crown className="h-4 w-4" />Upgrade to Premium</Button>
              )}
            </Plan>
          </div>
        )}
      </DataBoundary>
    </>
  );
}

function Plan({ title, price, features, current, highlight, children }) {
  return (
    <Card className={`flex flex-col p-7 ${highlight ? "border-gold ring-1 ring-gold" : ""}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-3xl">{title}</h2>
        {current && <Badge tone={title.toLowerCase()}>Current plan</Badge>}
      </div>
      <p className="mt-2 font-display text-4xl text-primary">{price}</p>
      <ul className="my-6 flex-1 space-y-3 text-sm">
        {features.map((f) => <li key={f} className="flex items-center gap-2"><Check className="h-4 w-4 text-gold" />{f}</li>)}
      </ul>
      {children}
    </Card>
  );
}
