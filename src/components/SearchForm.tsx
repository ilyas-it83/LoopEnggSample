"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { locations } from "@/lib/fixtures";
import { defaultSearch, validateSearch } from "@/lib/rental";
import type { SearchCriteria } from "@/lib/types";

interface SearchFormProps {
  initial?: SearchCriteria;
  compact?: boolean;
}

export function SearchForm({ initial = defaultSearch, compact = false }: SearchFormProps) {
  const router = useRouter();
  const [search, setSearch] = useState(initial);
  const [errors, setErrors] = useState<string[]>([]);

  function update<K extends keyof SearchCriteria>(key: K, value: SearchCriteria[K]) {
    setSearch((current) => ({ ...current, [key]: value }));
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateSearch(search);
    setErrors(nextErrors);
    if (nextErrors.length > 0) return;
    const query = new URLSearchParams({
      pickupLocationId: search.pickupLocationId,
      returnLocationId: search.returnLocationId,
      pickupAt: search.pickupAt,
      returnAt: search.returnAt,
      driverAge: String(search.driverAge),
      ...(search.promoCode ? { promoCode: search.promoCode } : {}),
    });
    router.push(`/search?${query.toString()}`);
  }

  return (
    <form className={`search-form ${compact ? "search-form-compact" : ""}`} onSubmit={submit}>
      {errors.length > 0 && (
        <div className="alert alert-error" role="alert">
          <strong>Check your search</strong>
          <ul>{errors.map((error) => <li key={error}>{error}</li>)}</ul>
        </div>
      )}
      <div className="field">
        <label htmlFor={`pickup-location-${compact}`}>Pickup location</label>
        <select id={`pickup-location-${compact}`} value={search.pickupLocationId} onChange={(event) => update("pickupLocationId", event.target.value)}>
          {locations.map((location) => <option key={location.id} value={location.id}>{location.name}</option>)}
        </select>
      </div>
      <div className="field">
        <label htmlFor={`return-location-${compact}`}>Return location</label>
        <select id={`return-location-${compact}`} value={search.returnLocationId} onChange={(event) => update("returnLocationId", event.target.value)}>
          {locations.map((location) => <option key={location.id} value={location.id}>{location.name}</option>)}
        </select>
      </div>
      <div className="field">
        <label htmlFor={`pickup-at-${compact}`}>Pickup date & time</label>
        <input id={`pickup-at-${compact}`} type="datetime-local" value={search.pickupAt} min="2026-08-10T10:00" onChange={(event) => update("pickupAt", event.target.value)} />
      </div>
      <div className="field">
        <label htmlFor={`return-at-${compact}`}>Return date & time</label>
        <input id={`return-at-${compact}`} type="datetime-local" value={search.returnAt} min={search.pickupAt} onChange={(event) => update("returnAt", event.target.value)} />
      </div>
      <div className="field field-age">
        <label htmlFor={`driver-age-${compact}`}>Driver age</label>
        <input id={`driver-age-${compact}`} type="number" min="18" max="90" value={search.driverAge} onChange={(event) => update("driverAge", Number(event.target.value))} />
      </div>
      <button className="button button-primary search-button" type="submit">Search cars</button>
    </form>
  );
}

