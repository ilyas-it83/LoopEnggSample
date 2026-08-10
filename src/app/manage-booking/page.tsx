"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { findBooking } from "@/lib/storage";

export default function ManageBookingLookupPage() {
  const router = useRouter();
  const [reference, setReference] = useState("DW-260820-A1B2");
  const [surname, setSurname] = useState("Lee");
  const [error, setError] = useState("");

  function lookup(event: React.FormEvent) {
    event.preventDefault();
    const booking = findBooking(reference);
    if (!booking || booking.renter.lastName.toLowerCase() !== surname.trim().toLowerCase()) {
      setError("We could not find a booking matching those demo details.");
      return;
    }
    router.push(`/manage-booking/${booking.id}`);
  }

  return (
    <>
      <section className="page-hero"><p className="eyebrow">Your trip</p><h1>Manage a booking</h1><p>Retrieve a fixture booking to review, modify, or cancel it.</p></section>
      <div className="content-wrap">
        <form className="form-panel" style={{ maxWidth: 680, margin: "0 auto" }} onSubmit={lookup}>
          <div className="alert alert-info">Try booking reference <strong>DW-260820-A1B2</strong> and surname <strong>Lee</strong>.</div>
          {error && <div className="alert alert-error" role="alert" style={{ marginTop: 14 }}>{error}</div>}
          <div className="form-grid" style={{ marginTop: 24 }}>
            <div className="field"><label htmlFor="booking-reference">Booking reference</label><input id="booking-reference" value={reference} onChange={(event) => setReference(event.target.value)} /></div>
            <div className="field"><label htmlFor="booking-surname">Renter surname</label><input id="booking-surname" value={surname} onChange={(event) => setSurname(event.target.value)} /></div>
          </div>
          <button className="button button-primary" style={{ marginTop: 22 }} type="submit">Find booking</button>
        </form>
      </div>
    </>
  );
}

