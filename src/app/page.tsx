import Link from "next/link";
import { SearchForm } from "@/components/SearchForm";
import { locations } from "@/lib/fixtures";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Rent confidently. Drive freely.</p>
          <h1>The right car for every kind of trip.</h1>
          <p>Compare transparent prices, choose useful extras, and complete a fully mocked booking in minutes.</p>
          <div className="hero-proof">
            <span>✓ No hidden demo fees</span>
            <span>✓ Free mock cancellation</span>
            <span>✓ 30+ fixture vehicles</span>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="sun" />
          <div className="road"><div className="hero-car">◆</div></div>
        </div>
        <div className="hero-search"><SearchForm /></div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div><p className="eyebrow">Popular pickup points</p><h2>Start somewhere inspiring</h2></div>
          <Link href="/search">View all locations →</Link>
        </div>
        <div className="location-grid">
          {locations.slice(0, 4).map((location, index) => (
            <Link className="location-card" href={`/search?pickupLocationId=${location.id}`} key={location.id}>
              <span className="location-number">0{index + 1}</span>
              <div><strong>{location.city}</strong><span>{location.name}</span></div>
              <span>→</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="benefit-section">
        <div><span className="benefit-icon">◇</span><h3>Transparent totals</h3><p>See base rate, fees, extras, discounts, and tax before confirming.</p></div>
        <div><span className="benefit-icon">↻</span><h3>Flexible demo bookings</h3><p>Retrieve, update extras, or cancel an eligible fixture reservation.</p></div>
        <div><span className="benefit-icon">✓</span><h3>Built for confidence</h3><p>Deterministic data, accessible interactions, and tested business rules.</p></div>
      </section>
    </>
  );
}
