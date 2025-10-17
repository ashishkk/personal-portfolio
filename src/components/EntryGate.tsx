"use client";

import { useEffect, useState } from "react";

type Form = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
};

const STORAGE_KEY = "entryGateAccepted";

export default function EntryGate() {
  const [open, setOpen] = useState(true);
  const [form, setForm] = useState<Form>({ firstName: "", lastName: "", email: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setOpen(false);
    } catch {
      // ignore
    }
  }, []);

  function validate() {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.lastName.trim()) e.lastName = "Last name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) e.email = "Enter a valid email";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    // send to server
    fetch("/api/visitors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    }).catch(() => {
      /* ignore network errors for now */
    });

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...form, acceptedAt: Date.now() }));
    } catch {
      // ignore
    }
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-2">Welcome — please enter your details</h2>
        <p className="text-sm text-muted-foreground mb-4">We ask for basic contact details before letting visitors view the site.</p>
        <form onSubmit={handleSubmit} className="grid gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs">First name *</label>
              <input name="firstName" value={form.firstName} onChange={handleChange} className="w-full border px-2 py-1 rounded" />
              {errors.firstName && <div className="text-xs text-red-600">{errors.firstName}</div>}
            </div>
            <div>
              <label className="block text-xs">Last name *</label>
              <input name="lastName" value={form.lastName} onChange={handleChange} className="w-full border px-2 py-1 rounded" />
              {errors.lastName && <div className="text-xs text-red-600">{errors.lastName}</div>}
            </div>
          </div>

          <div>
            <label className="block text-xs">Email *</label>
            <input name="email" value={form.email} onChange={handleChange} className="w-full border px-2 py-1 rounded" />
            {errors.email && <div className="text-xs text-red-600">{errors.email}</div>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs">Phone</label>
              <input name="phone" value={form.phone || ""} onChange={handleChange} className="w-full border px-2 py-1 rounded" />
            </div>
            <div>
              <label className="block text-xs">Company</label>
              <input name="company" value={form.company || ""} onChange={handleChange} className="w-full border px-2 py-1 rounded" />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-2">
            <button type="submit" className="bg-foreground text-background px-4 py-2 rounded">Enter site</button>
          </div>
        </form>
      </div>
    </div>
  );
}
