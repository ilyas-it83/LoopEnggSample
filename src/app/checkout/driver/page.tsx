"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckoutProgress } from "@/components/CheckoutProgress";
import { PriceBreakdown } from "@/components/PriceBreakdown";
import { getCheckout, getSimulatedProfile, saveCheckout } from "@/lib/storage";
import type { CheckoutDraft, DriverDetails, RenterDetails } from "@/lib/types";

const blankRenter: RenterDetails = { firstName: "", lastName: "", email: "", phone: "" };
const blankDriver: DriverDetails = { firstName: "", lastName: "", dateOfBirth: "", licenseNumber: "", licenseCountry: "United States", licenseExpiry: "" };

export default function DriverPage() {
  const router = useRouter();
  const [draft, setDraft] = useState<CheckoutDraft | null>(null);
  const [renter, setRenter] = useState(blankRenter);
  const [driver, setDriver] = useState(blankDriver);
  const [samePerson, setSamePerson] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = getCheckout();
    setDraft(stored);
    if (stored?.renter) setRenter(stored.renter);
    if (stored?.driver) setDriver(stored.driver);
    setIsLoading(false);
  }, []);

  if (isLoading) return <div className="content-wrap"><p role="status">Loading checkout details…</p></div>;
  if (!draft?.quote) return <div className="content-wrap"><div className="empty-state"><h1>Checkout information is missing</h1><Link className="button button-primary" href="/search">Return to search</Link></div></div>;

  function prefillFromSimulatedProfile() {
    const profile = getSimulatedProfile();
    if (!profile) {
      setStatus("");
      setError("The simulated profile is unavailable. Change the scenario in Demo controls and try again.");
      return;
    }
    setRenter(profile.renter);
    setDriver(profile.driver);
    setSamePerson(true);
    setError("");
    setStatus("Simulated profile details were added to checkout.");
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const finalDriver = samePerson ? { ...driver, firstName: renter.firstName, lastName: renter.lastName } : driver;
    if (Object.values(renter).some((value) => !value.trim()) || Object.values(finalDriver).some((value) => !value.trim())) {
      setError("Complete all renter and driver fields.");
      return;
    }
    if (!renter.email.includes("@")) { setError("Enter a valid demo email address."); return; }
    if (Date.parse(finalDriver.licenseExpiry) < Date.parse(draft!.search.returnAt)) { setError("The driver's license must remain valid through the rental return date."); return; }
    saveCheckout({ ...draft!, renter, driver: finalDriver });
    router.push("/checkout/payment");
  }

  return (
    <div className="content-wrap">
      <CheckoutProgress current="driver" />
      <div className="checkout-grid">
        <form className="form-panel" onSubmit={submit}>
          <p className="eyebrow">Step 2 of 4</p><h1>Who is driving?</h1>
          <div className="alert alert-info">Use fictional information only. This demo does not need or protect real personal data.</div>
          {error && <div className="alert alert-error" role="alert" style={{ marginTop: 14 }}>{error}</div>}
          {status && <div className="alert alert-success" role="status" style={{ marginTop: 14 }}>{status}</div>}
          <h2>Renter details</h2>
          <button className="button button-secondary button-small" type="button" onClick={prefillFromSimulatedProfile}>Use simulated profile</button>
          <div className="form-grid">
            {(["firstName", "lastName", "email", "phone"] as const).map((key) => (
              <div className="field" key={key}><label htmlFor={`renter-${key}`}>{key.replace(/([A-Z])/g, " $1")}</label><input id={`renter-${key}`} type={key === "email" ? "email" : "text"} value={renter[key]} onChange={(event) => setRenter({ ...renter, [key]: event.target.value })} /></div>
            ))}
          </div>
          <h2>Primary driver</h2>
          <label className="checkbox-row"><input type="checkbox" checked={samePerson} onChange={(event) => setSamePerson(event.target.checked)} /> The renter is the primary driver</label>
          {!samePerson && <div className="form-grid">
            {(["firstName", "lastName"] as const).map((key) => <div className="field" key={key}><label htmlFor={`driver-${key}`}>Driver {key.replace(/([A-Z])/g, " $1")}</label><input id={`driver-${key}`} value={driver[key]} onChange={(event) => setDriver({ ...driver, [key]: event.target.value })} /></div>)}
          </div>}
          <div className="form-grid" style={{ marginTop: 18 }}>
            <div className="field"><label htmlFor="driver-dob">Date of birth</label><input id="driver-dob" type="date" value={driver.dateOfBirth} onChange={(event) => setDriver({ ...driver, dateOfBirth: event.target.value })} /></div>
            <div className="field"><label htmlFor="license-number">License number</label><input id="license-number" value={driver.licenseNumber} onChange={(event) => setDriver({ ...driver, licenseNumber: event.target.value })} /></div>
            <div className="field"><label htmlFor="license-country">Issuing country</label><input id="license-country" value={driver.licenseCountry} onChange={(event) => setDriver({ ...driver, licenseCountry: event.target.value })} /></div>
            <div className="field"><label htmlFor="license-expiry">License expiry</label><input id="license-expiry" type="date" value={driver.licenseExpiry} onChange={(event) => setDriver({ ...driver, licenseExpiry: event.target.value })} /></div>
          </div>
          <div className="form-actions"><Link className="button button-secondary" href="/checkout/extras">Back</Link><button className="button button-primary" type="submit">Mock payment</button></div>
        </form>
        <PriceBreakdown quote={draft.quote} />
      </div>
    </div>
  );
}
