# Drivewise Car Rental Demo

A responsive car rental demonstration built with Next.js, TypeScript, deterministic mock data, and TDD/BDD-oriented tests. It uses no database, identity provider, payment processor, or external business service.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Quality commands

```bash
npm run typecheck
npm run lint
npm test
npm run test:e2e
npm run build
```

Install the Playwright Chromium browser once before the first end-to-end run:

```bash
npx playwright install chromium
```

## Living specifications

Tagged Gherkin specifications live in [`features`](features) and map to executable Vitest or Playwright coverage. Run the DW-149 traceability and validation checks with:

```bash
npm test -- src/lib/living-specifications.test.ts
```

## Demo data

- Seed booking: `DW-260820-A1B2`
- Renter surname: `Lee`
- Approved test card: `4242 4242 4242 4242`
- Declined test card: `4000 0000 0000 0002`
- Processing-error test card: `5000 0000 0000 0009`
- Promotion codes: `DRIVE10` and `WEEKEND25`

Use `/demo-controls` to activate deterministic error states or reset browser-local demo data.

The full specification is in [`docs/car-rental-app-requirements.md`](docs/car-rental-app-requirements.md).
