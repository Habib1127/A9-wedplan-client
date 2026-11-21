"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, Clock } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function PaymentStatus({ sessionId }) {
  const [state, setState] = useState({ status: "checking", tx: null });

  useEffect(() => {
    if (!sessionId) return setState({ status: "missing", tx: null });
    let cancelled = false;
    let tries = 0;
    async function poll() {
      try {
        const res = await api(`/api/payments/session/${sessionId}`);
        if (cancelled) return;
        if (res.data.confirmed) return setState({ status: "confirmed", tx: res.data.transaction });
      } catch {}
      tries += 1;
      if (tries >= 15) return !cancelled && setState({ status: "waiting", tx: null });
      setTimeout(poll, 2000);
    }
    poll();
    return () => { cancelled = true; };
  }, [sessionId]);

  const { status, tx } = state;
  return (
    <div className="mx-auto max-w-lg px-4 py-20">
      <Card className="p-8 text-center">
        {status === "checking" && (<><Loader2 className="mx-auto h-12 w-12 animate-spin text-gold" /><h1 className="mt-4 text-3xl">Confirming your payment</h1><p className="mt-2 text-sm text-muted">Premium turns on as soon as Stripe confirms the payment. This takes a few seconds.</p></>)}
        {status === "confirmed" && (<><CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" /><h1 className="mt-4 text-3xl">You are now Premium</h1><p className="mt-2 text-sm text-muted">Payment of ${tx?.amount} {tx?.currency?.toUpperCase()} received. You can publish unlimited services and show the Premium badge.</p></>)}
        {status === "waiting" && (<><Clock className="mx-auto h-12 w-12 text-gold" /><h1 className="mt-4 text-3xl">Payment still processing</h1><p className="mt-2 text-sm text-muted">We have not received Stripe's confirmation yet. Premium activates automatically once it arrives. Check your subscription page in a minute.</p></>)}
        {status === "missing" && (<><h1 className="text-3xl">No payment found</h1><p className="mt-2 text-sm text-muted">Open the subscription page to start an upgrade.</p></>)}
        <Button asChild className="mt-6"><Link href="/dashboard/subscription">Go to subscription</Link></Button>
      </Card>
    </div>
  );
}
