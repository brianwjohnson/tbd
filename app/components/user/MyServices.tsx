"use client";

import { useCallback, useEffect, useState } from "react";
import AccordionCard from "@/app/components/user/AccordionCard";

type Service = {
  id: string;
  name: string;
  description: string | null;
  status: string;
  service_type: string;
  price: { amount_cents: number; currency_code: string; unit_label: string } | null;
};

const inputClasses =
  "h-10 w-full rounded-xl border border-[#cbd5e1] bg-white px-3 text-sm text-[#0f172a] shadow-sm focus:border-[#2563eb] focus:outline-none focus:ring-4 focus:ring-[#bfdbfe]";

export default function MyServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [unitLabel, setUnitLabel] = useState("pair");
  const [locationType, setLocationType] = useState("custom");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [days, setDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");

  const loadServices = useCallback(async () => {
    try {
      const response = await fetch("/api/me/services", { cache: "no-store" });
      if (!response.ok) throw new Error("Failed to load services");
      const data = (await response.json()) as { offerings?: Service[] };
      setServices(data.offerings ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load services");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadServices();
  }, [loadServices]);

  function toggleDay(day: number) {
    setDays((current) =>
      current.includes(day)
        ? current.filter((item) => item !== day)
        : [...current, day].sort(),
    );
  }

  async function addService(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const response = await fetch("/api/me/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          serviceType: "skate_sharpening",
          amountCents: Math.round(Number(amount) * 100),
          unitLabel,
          location: {
            locationType,
            city,
            state,
            label: locationType === "custom" ? "Service location" : null,
          },
          availability: days.map((dayOfWeek) => ({
            dayOfWeek,
            startTime,
            endTime,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          })),
        }),
      });
      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        throw new Error(body.error ?? "Failed to create service");
      }
      setName("");
      setDescription("");
      setAmount("");
      setOpen(false);
      await loadServices();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create service");
    } finally {
      setSaving(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    const response = await fetch(`/api/me/services/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      setError("Failed to update service status");
      return;
    }
    await loadServices();
  }

  return (
    <AccordionCard title="My Services" defaultOpen>
      <div className="space-y-4">
        <p className="text-sm leading-6 text-[#64748b]">
          Offer services directly from your personal profile. You do not need to create a Business.
        </p>

        {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        {!loading && services.length === 0 && !open && (
          <div className="rounded-2xl border border-dashed border-[#cbd5e1] px-4 py-5 text-sm text-[#64748b]">
            No services yet.
          </div>
        )}

        {services.map((service) => (
          <div key={service.id} className="rounded-2xl border border-[#d7dce5] bg-[#f8fafc] px-4 py-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-[#0f172a]">{service.name}</h3>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[#64748b]">
                  Skate sharpening · {service.status}
                </p>
                {service.price && (
                  <p className="mt-2 text-sm text-[#334155]">
                    ${(service.price.amount_cents / 100).toFixed(2)} / {service.price.unit_label}
                  </p>
                )}
              </div>
              <button
                type="button"
                className="text-xs font-semibold text-[#1d4ed8] hover:underline"
                onClick={() => void updateStatus(service.id, service.status === "published" ? "draft" : "published")}
              >
                {service.status === "published" ? "Unpublish" : "Publish"}
              </button>
            </div>
          </div>
        ))}

        {!open && (
          <button
            type="button"
            className="rounded-xl bg-[#0f172a] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1e293b]"
            onClick={() => setOpen(true)}
          >
            Add service
          </button>
        )}

        {open && (
          <form className="space-y-4 rounded-2xl border border-[#d7dce5] bg-white p-4" onSubmit={addService}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium text-[#334155] sm:col-span-2">
                Service name
                <input className={`${inputClasses} mt-1.5`} value={name} onChange={(event) => setName(event.target.value)} placeholder="Skate sharpening" required />
              </label>
              <label className="text-sm font-medium text-[#334155] sm:col-span-2">
                Description
                <textarea className="mt-1.5 min-h-20 w-full rounded-xl border border-[#cbd5e1] px-3 py-2 text-sm" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What customers should know" />
              </label>
              <label className="text-sm font-medium text-[#334155]">
                Price
                <input className={`${inputClasses} mt-1.5`} type="number" min="0" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="20.00" required />
              </label>
              <label className="text-sm font-medium text-[#334155]">
                Price unit
                <input className={`${inputClasses} mt-1.5`} value={unitLabel} onChange={(event) => setUnitLabel(event.target.value)} placeholder="pair" required />
              </label>
              <label className="text-sm font-medium text-[#334155]">
                Location type
                <select className={`${inputClasses} mt-1.5`} value={locationType} onChange={(event) => setLocationType(event.target.value)}>
                  <option value="custom">Custom location</option>
                  <option value="at_provider">At my location</option>
                  <option value="mobile">Mobile service</option>
                  <option value="virtual">Virtual</option>
                </select>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label className="text-sm font-medium text-[#334155]">City<input className={`${inputClasses} mt-1.5`} value={city} onChange={(event) => setCity(event.target.value)} /></label>
                <label className="text-sm font-medium text-[#334155]">State<input className={`${inputClasses} mt-1.5`} value={state} onChange={(event) => setState(event.target.value)} /></label>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-[#334155]">Weekly availability</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((label, day) => (
                  <button key={label} type="button" className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold ${days.includes(day) ? "bg-[#dbeafe] text-[#1d4ed8]" : "bg-[#f1f5f9] text-[#64748b]"}`} onClick={() => toggleDay(day)}>{label}</button>
                ))}
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <input className={inputClasses} type="time" value={startTime} onChange={(event) => setStartTime(event.target.value)} />
                <input className={inputClasses} type="time" value={endTime} onChange={(event) => setEndTime(event.target.value)} />
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={saving} className="rounded-xl bg-[#0f172a] px-4 py-2.5 text-sm font-semibold text-white disabled:bg-[#94a3b8]">{saving ? "Saving..." : "Save service"}</button>
              <button type="button" className="rounded-xl border border-[#cbd5e1] px-4 py-2.5 text-sm font-semibold text-[#334155]" onClick={() => setOpen(false)}>Cancel</button>
            </div>
          </form>
        )}
      </div>
    </AccordionCard>
  );
}
