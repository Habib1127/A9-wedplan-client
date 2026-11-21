"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { useAsync } from "@/lib/use-async";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FieldError, Input, Label, Textarea } from "@/components/ui/input";
import { ImageUploader } from "@/components/shared/image-uploader";
import { DataBoundary, PageHeader } from "@/components/shared/ui-bits";

export function ProfileSettings() {
  const { data, loading, error, reload } = useAsync(() => api("/api/me"), []);
  return (
    <>
      <PageHeader title="Profile settings" text="Update how you appear to vendors and customers." />
      <DataBoundary loading={loading} error={error} onRetry={reload}>
        {data && <ProfileForm me={data.data} />}
      </DataBoundary>
    </>
  );
}

function ProfileForm({ me }) {
  const router = useRouter();
  const [form, setForm] = useState({ name: me.name || "", phone: me.phone || "", bio: me.bio || "", businessName: me.businessName || "" });
  const [image, setImage] = useState(me.image ? [me.image] : []);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    const next = {};
    if (form.name.trim().length < 2) next.name = "Name must be at least 2 characters";
    setErrors(next);
    if (Object.keys(next).length) return;
    setBusy(true);
    try {
      const body = { name: form.name.trim(), phone: form.phone, bio: form.bio, image: image[0] || "" };
      if (me.role === "vendor") body.businessName = form.businessName;
      const res = await api("/api/me", { method: "PATCH", body });
      toast.success(res.message);
      authClient.$store.notify("$sessionSignal");
      router.refresh();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="max-w-2xl p-6 sm:p-8">
      <div className="mb-6 flex flex-wrap items-center gap-3 text-sm">
        <span className="text-muted">{me.email}</span>
        <Badge>{me.role}</Badge>
        {me.role === "vendor" && <Badge tone={me.subscriptionPlan}>{me.subscriptionPlan}</Badge>}
      </div>
      <form onSubmit={submit} className="space-y-5" noValidate>
        <div>
          <Label>Profile image</Label>
          <ImageUploader value={image} onChange={setImage} max={1} label="Upload" />
        </div>
        <div>
          <Label htmlFor="name">Full name</Label>
          <Input id="name" value={form.name} onChange={set("name")} />
          <FieldError>{errors.name}</FieldError>
        </div>
        {me.role === "vendor" && (
          <div>
            <Label htmlFor="businessName">Business name</Label>
            <Input id="businessName" value={form.businessName} onChange={set("businessName")} />
          </div>
        )}
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" value={form.phone} onChange={set("phone")} />
        </div>
        <div>
          <Label htmlFor="bio">About you</Label>
          <Textarea id="bio" value={form.bio} onChange={set("bio")} />
        </div>
        <Button type="submit" loading={busy}>Save changes</Button>
      </form>
    </Card>
  );
}
