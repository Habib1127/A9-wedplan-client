import { AlertCircle, Inbox } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function EmptyState({ title, text, action }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card/60 px-6 py-14 text-center">
      <Inbox className="h-9 w-9 text-gold" />
      <h3 className="mt-3 text-2xl">{title}</h3>
      {text && <p className="mt-1 max-w-sm text-sm text-muted">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center">
      <AlertCircle className="h-9 w-9 text-danger" />
      <h3 className="mt-3 text-2xl">We could not load this</h3>
      <p className="mt-1 max-w-sm text-sm text-muted">{message}</p>
      {onRetry && <Button variant="outline" className="mt-5" onClick={onRetry}>Try again</Button>}
    </div>
  );
}

export function ListSkeleton({ rows = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
    </div>
  );
}

export function CardGridSkeleton({ count = 6 }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="h-52 rounded-none" />
          <div className="space-y-3 p-5">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-9 w-full" />
          </div>
        </Card>
      ))}
    </div>
  );
}

export function PageHeader({ title, text, action }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-4xl">{title}</h1>
        {text && <p className="mt-1 text-sm text-muted">{text}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatCard({ label, value, icon: Icon }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">{label}</p>
        {Icon && <span className="rounded-full bg-sage p-2 text-primary"><Icon className="h-4 w-4" /></span>}
      </div>
      <p className="mt-3 font-display text-4xl">{value}</p>
    </Card>
  );
}

export function DataBoundary({ loading, error, onRetry, skeleton, children }) {
  if (loading) return skeleton || <ListSkeleton />;
  if (error) return <ErrorState message={error} onRetry={onRetry} />;
  return children;
}
