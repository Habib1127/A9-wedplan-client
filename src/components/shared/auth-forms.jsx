"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { signIn, signUp } from "@/lib/auth-client";
import { clearToken } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FieldError, Input, Label } from "@/components/ui/input";
import { ImageUploader } from "@/components/shared/image-uploader";

function GoogleButton({ callbackURL, label }) {
  const [busy, setBusy] = useState(false);
  async function go() {
    setBusy(true);
    const { error } = await signIn.social({ provider: "google", callbackURL });
    if (error) {
      toast.error(error.message || "Google sign in failed");
      setBusy(false);
    }
  }
  return (
    <Button type="button" variant="outline" className="w-full" loading={busy} onClick={go}>
      <svg viewBox="0 0 48 48" className="h-4 w-4"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" /><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z" /><path fill="#FBBC05" d="M10.5 28.7a14.5 14.5 0 010-9.4l-7.9-6.1a24 24 0 000 21.6l7.9-6.1z" /><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.9 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" /></svg>
      {label}
    </Button>
  );
}

function Divider() {
  return (
    <div className="my-5 flex items-center gap-3 text-xs text-muted">
      <span className="h-px flex-1 bg-border" />or<span className="h-px flex-1 bg-border" />
    </div>
  );
}

function safeCallback(value) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/dashboard";
}

export function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callback = safeCallback(params.get("callbackUrl"));
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    const next = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email";
    if (!form.password) next.password = "Enter your password";
    setErrors(next);
    if (Object.keys(next).length) return;
    setBusy(true);
    const { error } = await signIn.email({ email: form.email, password: form.password });
    setBusy(false);
    if (error) return toast.error(error.message || "Invalid email or password");
    clearToken();
    toast.success("Welcome back");
    router.push(callback);
    router.refresh();
  }

  return (
    <AuthShell title="Welcome back" text="Sign in to manage your bookings and services.">
      <form onSubmit={submit} className="space-y-4" noValidate>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <FieldError>{errors.email}</FieldError>
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <FieldError>{errors.password}</FieldError>
        </div>
        <Button type="submit" className="w-full" loading={busy}>Sign in</Button>
      </form>
      <Divider />
      <GoogleButton callbackURL={callback} label="Continue with Google" />
      <p className="mt-6 text-center text-sm text-muted">New to WedPlan? <Link href="/sign-up" className="font-medium text-primary underline">Create an account</Link></p>
    </AuthShell>
  );
}

export function SignUpForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "customer", businessName: "" });
  const [image, setImage] = useState([]);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    const next = {};
    if (form.name.trim().length < 2) next.name = "Enter your full name";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email";
    if (form.password.length < 6) next.password = "Use at least 6 characters";
    else if (!/[A-Z]/.test(form.password)) next.password = "Add at least one uppercase letter";
    else if (!/[a-z]/.test(form.password)) next.password = "Add at least one lowercase letter";
    setErrors(next);
    if (Object.keys(next).length) return;
    setBusy(true);
    const payload = { name: form.name.trim(), email: form.email, password: form.password, role: form.role };
    if (image[0]) payload.image = image[0];
    if (form.role === "vendor" && form.businessName.trim()) payload.businessName = form.businessName.trim();
    const { error } = await signUp.email(payload);
    setBusy(false);
    if (error) return toast.error(error.message || "Could not create your account");
    clearToken();
    toast.success("Account created. Welcome to WedPlan");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <AuthShell title="Create your account" text="Join as a customer to book services, or as a vendor to publish them.">
      <form onSubmit={submit} className="space-y-4" noValidate>
        <div className="grid grid-cols-2 gap-3">
          {[["customer", "Customer", "Book wedding services"], ["vendor", "Vendor", "Publish your services"]].map(([value, title, hint]) => (
            <label key={value} className={`cursor-pointer rounded-xl border p-3 text-sm ${form.role === value ? "border-gold bg-sage/50" : "border-border"}`}>
              <input type="radio" name="role" value={value} checked={form.role === value} onChange={set("role")} className="sr-only" />
              <span className="block font-medium">{title}</span>
              <span className="text-xs text-muted">{hint}</span>
            </label>
          ))}
        </div>
        <div>
          <Label htmlFor="name">Full name</Label>
          <Input id="name" autoComplete="name" value={form.name} onChange={set("name")} />
          <FieldError>{errors.name}</FieldError>
        </div>
        {form.role === "vendor" && (
          <div>
            <Label htmlFor="businessName">Business name</Label>
            <Input id="businessName" value={form.businessName} onChange={set("businessName")} />
          </div>
        )}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" value={form.email} onChange={set("email")} />
          <FieldError>{errors.email}</FieldError>
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" autoComplete="new-password" value={form.password} onChange={set("password")} />
          <p className="mt-1 text-xs text-muted">At least 6 characters with one uppercase and one lowercase letter.</p>
          <FieldError>{errors.password}</FieldError>
        </div>
        <div>
          <Label>Profile image (optional)</Label>
          <ImageUploader value={image} onChange={setImage} max={1} label="Add photo" />
        </div>
        <Button type="submit" className="w-full" loading={busy}>Create account</Button>
      </form>
      <Divider />
      <GoogleButton callbackURL="/dashboard" label="Sign up with Google" />
      <p className="mt-2 text-center text-xs text-muted">Google accounts start as customers.</p>
      <p className="mt-6 text-center text-sm text-muted">Already have an account? <Link href="/sign-in" className="font-medium text-primary underline">Sign in</Link></p>
    </AuthShell>
  );
}

function AuthShell({ title, text, children }) {
  return (
    <div className="mx-auto flex max-w-md px-4 py-14">
      <Card className="w-full p-7 sm:p-8">
        <h1 className="text-4xl">{title}</h1>
        <p className="mb-6 mt-1 text-sm text-muted">{text}</p>
        {children}
      </Card>
    </div>
  );
}
