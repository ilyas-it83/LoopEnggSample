const steps = [
  { id: "extras", label: "Extras" },
  { id: "driver", label: "Driver" },
  { id: "payment", label: "Payment" },
  { id: "review", label: "Review" },
];

export function CheckoutProgress({ current }: { current: string }) {
  const currentIndex = steps.findIndex((step) => step.id === current);
  return (
    <ol className="checkout-progress" aria-label="Checkout progress">
      {steps.map((step, index) => (
        <li className={index <= currentIndex ? "active" : ""} key={step.id} aria-current={step.id === current ? "step" : undefined}>
          <span>{index + 1}</span>
          {step.label}
        </li>
      ))}
    </ol>
  );
}

