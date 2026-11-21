"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { publicApi } from "@/lib/api";
import { useAsync } from "@/lib/use-async";
import { CATEGORIES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { ServiceCard } from "@/components/shared/service-card";
import { CardGridSkeleton, EmptyState, ErrorState } from "@/components/shared/ui-bits";

export function BrowseClient() {
  const router = useRouter();
  const params = useSearchParams();
  const [search, setSearch] = useState(params.get("search") || "");
  const [debounced, setDebounced] = useState(search);
  const category = params.get("category") || "";
  const location = params.get("location") || "";
  const sort = params.get("sort") || "newest";
  const page = Number(params.get("page") || 1);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const locations = useAsync(() => publicApi("/api/services/locations"), []);

  const { data, loading, error, reload } = useAsync(() => {
    const q = new URLSearchParams({ limit: "9", page: String(page), sort });
    if (debounced) q.set("search", debounced);
    if (category) q.set("category", category);
    if (location) q.set("location", location);
    return publicApi(`/api/services?${q}`);
  }, [debounced, category, location, sort, page]);

  function update(next) {
    const q = new URLSearchParams(params.toString());
    Object.entries(next).forEach(([k, v]) => (v ? q.set(k, v) : q.delete(k)));
    if (!("page" in next)) q.delete("page");
    router.replace(`/services?${q}`, { scroll: false });
  }

  function clearAll() {
    setSearch("");
    router.replace("/services", { scroll: false });
  }

  const pagination = data?.pagination;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <h1 className="text-5xl">Browse wedding services</h1>
        <p className="mt-2 text-muted">Search, filter and sort approved services from vendors across the platform.</p>
      </div>
      <div className="mb-8 grid gap-3 rounded-2xl border border-border bg-card p-4 md:grid-cols-2 lg:grid-cols-[2fr_1.3fr_1.3fr_1.2fr_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-muted" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, keyword or city" className="pl-10" aria-label="Search services" />
        </div>
        <Select value={category} onChange={(e) => update({ category: e.target.value })} aria-label="Category">
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
        </Select>
        <Select value={location} onChange={(e) => update({ location: e.target.value })} aria-label="Location">
          <option value="">All locations</option>
          {(locations.data?.data || []).map((l) => <option key={l} value={l}>{l}</option>)}
        </Select>
        <Select value={sort} onChange={(e) => update({ sort: e.target.value })} aria-label="Sort by price">
          <option value="newest">Newest first</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
        </Select>
        <Button variant="outline" className="h-11" onClick={clearAll}><SlidersHorizontal className="h-4 w-4" />Reset</Button>
      </div>

      {loading ? <CardGridSkeleton count={9} /> : error ? <ErrorState message={error} onRetry={reload} /> : !data.data.length ? (
        <EmptyState title="No services match your search" text="Try a different keyword, or clear the filters to see everything." action={<Button onClick={clearAll}>Clear filters</Button>} />
      ) : (
        <>
          <p className="mb-4 text-sm text-muted">{pagination.total} service{pagination.total === 1 ? "" : "s"} found</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.data.map((s) => <ServiceCard key={s._id} service={s} />)}
          </div>
          {pagination.pages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-3">
              <Button variant="outline" disabled={page <= 1} onClick={() => update({ page: String(page - 1) })}>Previous</Button>
              <span className="text-sm text-muted">Page {pagination.page} of {pagination.pages}</span>
              <Button variant="outline" disabled={page >= pagination.pages} onClick={() => update({ page: String(page + 1) })}>Next</Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
