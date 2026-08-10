import { formatMoney } from "@/lib/rental";
import type { Quote } from "@/lib/types";

export function PriceBreakdown({ quote, title = "Price breakdown" }: { quote: Quote; title?: string }) {
  return (
    <section className="price-panel" aria-labelledby="price-heading">
      <h2 id="price-heading">{title}</h2>
      <div className="price-lines">
        {quote.lines.map((line) => (
          <div className={line.kind === "discount" ? "discount-line" : ""} key={line.id}>
            <span>{line.label}</span>
            <span>{formatMoney(line.amount)}</span>
          </div>
        ))}
      </div>
      <div className="price-total">
        <span>Estimated total</span>
        <strong>{formatMoney(quote.total)}</strong>
      </div>
      <p className="fine-print">Mock estimate in USD. No real payment will be processed.</p>
    </section>
  );
}

