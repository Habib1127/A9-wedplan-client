"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { CATEGORIES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FieldError, Input, Label, Select, Textarea } from "@/components/ui/input";
import { ImageUploader } from "@/components/shared/image-uploader";

export function ServiceForm({ initial, serviceId }) {
  const router = useRouter();
  const [form, setForm] = useState({
    serviceName: initial?.serviceName || "",
    category: initial?.category || "",
    description: initial?.description || "",
    price: initial?.price ?? "",
    location: initial?.location || "",
  });
  const [images, setImages] = useState(initial?.images || []);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    const next = {};
    if (form.serviceName.trim().length < 3) next.serviceName = "Service name must be at least 3 characters";
    if (!form.category) next.category = "Choose a category";
    if (form.description.trim().length < 20) next.description = "Description must be at least 20 characters";
    if (!(Number(form.price) > 0)) next.price = "Enter a price greater than 0";
    if (form.location.trim().length < 2) next.location = "Enter the service location";
    if (!images.length) next.images = "Upload at least one image";
    setErrors(next);
    if (Object.keys(next).length) return;
    setBusy(true);
    try {
      const body = { ...form, price: Number(form.price), images };
      const res = serviceId
        ? await api(`/api/vendor/services/${serviceId}`, { method: "PATCH", body })
        : await api("/api/vendor/services", { method: "POST", body });
      toast.success(res.message);
      router.push("/dashboard/my-services");
      router.refresh();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="max-w-3xl p-6 sm:p-8">
      <form onSubmit={submit} className="space-y-5" noValidate>
        <div>
          <Label htmlFor="serviceName">Service name</Label>
          <Input id="serviceName" value={form.serviceName} onChange={set("serviceName")} />
          <FieldError>{errors.serviceName}</FieldError>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="category">Service category</Label>
            <Select id="category" value={form.category} onChange={set("category")}>
              <option value="">Select a category</option>
              {CATEGORIES.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
            </Select>
            <FieldError>{errors.category}</FieldError>
          </div>
          <div>
            <Label htmlFor="price">Price (USD)</Label>
            <Input id="price" type="number" min="1" value={form.price} onChange={set("price")} />
            <FieldError>{errors.price}</FieldError>
          </div>
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input id="location" value={form.location} onChange={set("location")} placeholder="City or area you serve" />
          <FieldError>{errors.location}</FieldError>
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" value={form.description} onChange={set("description")} className="min-h-36" />
          <FieldError>{errors.description}</FieldError>
        </div>
        <div>
          <Label>Service images (up to 6)</Label>
          <ImageUploader value={images} onChange={setImages} max={6} label="Add image" />
          <FieldError>{errors.images}</FieldError>
        </div>
        <p className="text-xs text-muted">{serviceId ? "Edits to a rejected service send it back for review." : "New services stay pending until an admin approves them."}</p>
        <Button type="submit" loading={busy}>{serviceId ? "Save changes" : "Submit service"}</Button>
      </form>
    </Card>
  );
}
