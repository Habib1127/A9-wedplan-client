"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { uploadImage } from "@/lib/api";
import { SmartImage } from "@/components/shared/smart-image";

export function ImageUploader({ value = [], onChange, max = 1, label = "Upload image" }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);

  async function handleFiles(event) {
    const files = Array.from(event.target.files || []).slice(0, max - value.length);
    event.target.value = "";
    if (!files.length) return;
    setBusy(true);
    const urls = [];
    for (const file of files) {
      try {
        urls.push(await uploadImage(file));
      } catch (err) {
        toast.error(err.message);
      }
    }
    setBusy(false);
    if (urls.length) onChange([...value, ...urls]);
  }

  return (
    <div className="flex flex-wrap gap-3">
      {value.map((url) => (
        <div key={url} className="relative h-24 w-24 overflow-hidden rounded-xl border border-border">
          <SmartImage src={url} className="h-full w-full object-cover" />
          <button type="button" aria-label="Remove image" onClick={() => onChange(value.filter((u) => u !== url))} className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white">
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
      {value.length < max && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-gold bg-card text-xs text-muted hover:bg-sage/40 cursor-pointer"
        >
          {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5 text-gold" />}
          {busy ? "Uploading" : label}
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" multiple={max > 1} hidden onChange={handleFiles} />
    </div>
  );
}
