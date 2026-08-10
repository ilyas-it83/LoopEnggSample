const faqs = [
  ["Is this a real rental service?", "No. Drivewise is a demonstration application. Vehicles, availability, people, payments, policies, and notifications are fictional."],
  ["Which payment details should I use?", "Use only the documented test values shown on the mock payment screen. Never enter a real card number."],
  ["How does pricing work?", "The shared pricing service calculates billable days, base rate, one-way and age fees, extras, promotions, and an 8.25% mock tax."],
  ["Can I change a booking?", "A confirmed fixture booking can update its optional extras. The price is recalculated and a history entry is recorded."],
  ["Can I cancel a booking?", "Confirmed demo bookings can be cancelled once. The default fixture applies no fee and displays a mock refund estimate."],
  ["Why did inventory or payment fail?", "A failure scenario may be active. Open Demo controls to switch back to Normal behavior."],
  ["Where is my data stored?", "Mutable demo state is held in browser localStorage. Use Demo controls to clear it and restore the default fixture."],
  ["What accessibility standard is targeted?", "Implemented pages target WCAG 2.2 AA with keyboard operation, visible focus, semantic landmarks, labels, and status announcements."],
];

export default function HelpPage() {
  return (
    <>
      <section className="page-hero"><p className="eyebrow">Fictional policies</p><h1>Help and rental guidance</h1><p>Everything below explains demo behavior and must not be treated as legal, insurance, privacy, or rental advice.</p></section>
      <div className="content-wrap">
        <div className="faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div>
      </div>
    </>
  );
}

