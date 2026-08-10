# Car Rental Demo Application - Requirements Specification

## 1. Document Control

| Field | Value |
| --- | --- |
| Product | Car Rental Demo Application |
| Document type | Product and Software Requirements Specification |
| Status | Draft |
| Target stack | Next.js with TypeScript |
| Delivery model | Demonstration application |
| Engineering approach | Test-Driven Development (TDD) and Behavior-Driven Development (BDD) |
| Data and integrations | Fully mocked; no real database, payment provider, identity provider, or external service |

## 2. Purpose

This document defines the product, functional, technical, user experience, and quality requirements for a demonstration car rental application. The application will let a customer discover vehicles, evaluate rental options, create a simulated booking, manage that booking, and complete mocked checkout and account flows.

The product is intended to demonstrate:

- A realistic end-to-end car rental experience.
- A modern Next.js application architecture.
- Component-driven user interface development.
- Predictable client and server behavior using mock data and mock services.
- TDD at the unit, component, and integration levels.
- BDD for user-visible workflows and business rules.
- Responsive, accessible, and testable implementation practices.

The application is not intended to process real transactions, store real personal data, provide production security controls, or connect to production systems.

## 3. Product Vision

Create a polished demo that allows a prospective renter to find and reserve a suitable vehicle in a few clear steps while allowing reviewers and developers to inspect deterministic business behavior, error states, and automated tests without requiring external infrastructure.

## 4. Product Goals

1. Provide a complete customer journey from vehicle search through booking confirmation.
2. Demonstrate common rental rules such as availability, pricing, add-ons, driver eligibility, and cancellation.
3. Keep all data deterministic and locally reproducible.
4. Make mocked behavior visibly distinguishable from production behavior.
5. Support isolated development and testing without network access.
6. Define business behavior through executable BDD scenarios.
7. Develop implementation through failing tests first, followed by the smallest passing implementation and refactoring.
8. Provide enough functional depth to support a future backlog of 150 independently actionable user stories.

## 5. Success Criteria

The demo is successful when:

- A user can search for vehicles by location and rental dates.
- Search results consistently reflect mocked availability and filter choices.
- A user can inspect vehicle details and a transparent price estimate.
- A user can add optional products and see totals update correctly.
- A user can complete mocked renter, driver, payment, and confirmation steps.
- A user can retrieve, modify, and cancel an eligible mock booking.
- Empty, loading, validation, unavailable, and simulated failure states are demonstrable.
- Primary customer journeys have executable BDD scenarios.
- Business logic and UI components are developed and covered through TDD.
- Tests run without external services or nondeterministic dependencies.
- The application works on supported desktop and mobile viewport sizes.

## 6. Stakeholders

| Stakeholder | Interest |
| --- | --- |
| Product owner | Scope, user value, and demo readiness |
| Engineering team | Architecture, implementation, maintainability, and tests |
| QA/test engineer | Acceptance criteria, traceability, automation, and deterministic fixtures |
| UX designer | Customer journey, responsive layouts, accessibility, and state handling |
| Demo audience | Realistic behavior and a clear, polished experience |

## 7. Personas

### 7.1 Guest Renter

A visitor who wants to search, compare, and reserve a vehicle without creating a real account.

Needs:

- Quick search with clear eligibility and availability information.
- Transparent pricing.
- Simple renter and driver forms.
- Confidence that the booking has been created in the demo.

### 7.2 Returning Demo Customer

A simulated signed-in user who wants to reuse mock profile information and manage existing reservations.

Needs:

- Fast access to upcoming and past bookings.
- Prefilled mock profile details.
- Ability to modify or cancel eligible bookings.

### 7.3 Demo Administrator

A user who needs to demonstrate inventory and booking conditions without a production administration system.

Needs:

- A read-only inventory and booking overview.
- Deterministic mock states.
- A way to trigger selected scenarios such as no availability or payment failure.

### 7.4 Developer or Reviewer

A person evaluating application architecture and engineering discipline.

Needs:

- Clear separation between presentation, domain logic, and mock services.
- Repeatable tests and fixtures.
- Traceability from requirements to scenarios and tests.

## 8. Scope

### 8.1 In Scope

- Responsive public home page.
- Location and date/time-based vehicle search.
- Mock vehicle availability.
- Vehicle listing, sorting, and filtering.
- Vehicle details and feature comparison.
- Rental price calculation.
- Optional protection plans, equipment, and services.
- Guest and simulated signed-in checkout.
- Renter and driver information forms.
- Mock payment form and configurable payment outcomes.
- Booking review and confirmation.
- Booking lookup and management.
- Booking modification and cancellation under mock policies.
- Simulated authentication and profile behavior.
- Favorites and recently viewed vehicles stored locally.
- Promotional codes using mock rules.
- Read-only demo administration views.
- Deterministic mock data, latency, and failures.
- Accessibility, responsive behavior, automated testing, and documentation.

### 8.2 Out of Scope

- A production database or data migration strategy.
- Real identity, authentication, authorization, sessions, or security hardening.
- Real payment authorization, tokenization, settlement, or refunds.
- Real inventory, fleet telematics, location, mapping, or geocoding services.
- Real email, SMS, push notification, or document delivery.
- Real fraud, credit, driving record, or identity checks.
- Real taxes, legal advice, insurance underwriting, or regulatory compliance.
- Production analytics, monitoring, alerting, or incident response.
- Native iOS or Android applications.
- Multi-tenant fleet operations.
- Real customer support integration.
- Production deployment, disaster recovery, scalability, or service-level commitments.

## 9. Assumptions and Constraints

1. All people, vehicles, locations, prices, payment details, and reservations are fictional.
2. The application must display a persistent, unobtrusive indicator that it is a demo using mock data.
3. No secrets or service credentials are required.
4. No production personal or payment data may be entered or retained.
5. State may reset between browser sessions, test runs, builds, or mock-data resets.
6. The default locale is English and the default currency is USD.
7. Time-sensitive rules use a controllable application clock in automated tests.
8. Search and booking behavior must remain deterministic for a given fixture and clock value.
9. The application should be usable with JavaScript enabled; a no-JavaScript transactional experience is not required.
10. Supported browsers are the latest two stable versions of Chrome, Edge, Firefox, and Safari.

## 10. Proposed Technology Stack

| Area | Requirement |
| --- | --- |
| Framework | Next.js using the App Router |
| Language | TypeScript with strict type checking |
| Rendering | Server Components by default; Client Components only where interaction requires them |
| Styling | A consistent component styling system selected during implementation |
| Forms | Schema-driven validation with shared client/server-compatible rules |
| Mock API | Next.js Route Handlers or an equivalent in-process mock service layer |
| Mock persistence | Versioned JSON/TypeScript fixtures plus browser storage or an in-memory repository |
| Unit/component tests | Vitest or Jest with React Testing Library |
| BDD acceptance tests | Gherkin feature files executed through Cucumber-compatible tooling or mapped to Playwright tests |
| End-to-end tests | Playwright |
| API mocking | In-process repositories and optional Mock Service Worker for browser-level integration tests |
| Code quality | Existing formatter, linter, type-check, and test scripts defined in the repository |

Exact libraries may be selected during application bootstrap, but the architectural and behavioral requirements in this document remain binding.

## 11. Information Architecture and Routes

| Route | Purpose |
| --- | --- |
| `/` | Home page and primary rental search |
| `/search` | Search results with filters, sorting, and availability |
| `/vehicles/[vehicleId]` | Vehicle details and rental estimate |
| `/checkout/extras` | Protection plans, equipment, and optional services |
| `/checkout/driver` | Renter and driver information |
| `/checkout/payment` | Mock payment details |
| `/checkout/review` | Final booking review |
| `/booking/confirmation/[bookingId]` | Booking confirmation |
| `/manage-booking` | Booking lookup |
| `/manage-booking/[bookingId]` | Booking details, modification, and cancellation |
| `/account` | Simulated customer profile |
| `/account/bookings` | Simulated user's upcoming and past bookings |
| `/favorites` | Locally saved favorite vehicles |
| `/help` | Demo FAQs, rental policies, and mock-data disclosure |
| `/admin` | Read-only demo dashboard |
| `/admin/vehicles` | Mock fleet overview |
| `/admin/bookings` | Mock booking overview |
| `/demo-controls` | Development/demo-only scenario controls |

## 12. Core User Journeys

### 12.1 Search and Reserve

1. User enters pickup location, return location, pickup date/time, return date/time, and driver age.
2. System validates the search criteria.
3. System returns matching mock vehicles and availability.
4. User filters, sorts, and selects a vehicle.
5. System shows vehicle details and an itemized estimate.
6. User selects optional extras.
7. User enters renter and driver details.
8. User enters mock payment information.
9. User reviews and confirms the booking.
10. System creates a mock reservation and displays confirmation details.

### 12.2 Manage Booking

1. User enters a booking reference and matching surname, or uses a simulated signed-in account.
2. System retrieves a mock booking.
3. User reviews booking details and policy status.
4. User changes eligible dates, times, vehicle, or extras.
5. System recalculates availability and pricing.
6. User confirms the modification, or cancels the booking.
7. System displays the updated mock booking and simulated notification status.

### 12.3 Explore and Compare

1. User browses search results.
2. User marks vehicles as favorites or selects vehicles to compare.
3. System stores selections locally.
4. User views comparable features, capacity, policies, and estimated prices.
5. User selects a vehicle and continues to checkout.

### 12.4 Demonstrate Exceptional States

1. Demo administrator selects a predefined scenario.
2. System applies deterministic latency, empty inventory, stale availability, validation, or payment failure behavior.
3. User-visible error handling and recovery actions are displayed.
4. Scenario can be reset without modifying source data.

## 13. Functional Requirements

Requirements use the identifiers `FR-###` for traceability.

### 13.1 Global Application

| ID | Requirement |
| --- | --- |
| FR-001 | The application shall display a global header with logo, navigation, booking management, favorites, and simulated account access. |
| FR-002 | The application shall display a footer with help, rental policy, accessibility, and demo-data disclosure links. |
| FR-003 | The application shall show a demo indicator on every page. |
| FR-004 | The application shall provide consistent loading, empty, error, success, and disabled states. |
| FR-005 | The application shall provide a not-found page for unknown routes and records. |
| FR-006 | The application shall provide a recoverable error boundary for unexpected page failures. |
| FR-007 | The application shall preserve the active booking flow when the user navigates between completed checkout steps. |
| FR-008 | The application shall prevent access to a checkout step when its prerequisite data is missing and redirect to the earliest incomplete step. |

### 13.2 Rental Search

| ID | Requirement |
| --- | --- |
| FR-010 | The system shall allow selection of pickup and return locations from mock locations. |
| FR-011 | The system shall allow the return location to differ from the pickup location. |
| FR-012 | The system shall allow selection of pickup and return dates and times. |
| FR-013 | The system shall require the return date/time to be later than the pickup date/time. |
| FR-014 | The system shall prevent selection of a pickup time earlier than the current mock time. |
| FR-015 | The system shall collect the primary driver's age band or date of birth. |
| FR-016 | The system shall show whether a one-way rental fee may apply. |
| FR-017 | The system shall preserve valid search values in the URL query string. |
| FR-018 | The system shall restore search criteria from a valid shared search URL. |
| FR-019 | The system shall reject malformed or unsupported search parameters with actionable validation messages. |
| FR-020 | The system shall support predefined popular location shortcuts on the home page. |

### 13.3 Search Results

| ID | Requirement |
| --- | --- |
| FR-030 | The system shall show only mock vehicles available for the selected location and rental period. |
| FR-031 | Each result shall show image, category, make/model example, passenger capacity, luggage capacity, transmission, fuel or power type, key features, and estimated total. |
| FR-032 | The system shall identify limited-availability inventory when the fixture indicates a low count. |
| FR-033 | The system shall support filtering by vehicle category. |
| FR-034 | The system shall support filtering by passenger capacity. |
| FR-035 | The system shall support filtering by transmission type. |
| FR-036 | The system shall support filtering by fuel or power type. |
| FR-037 | The system shall support filtering by price range. |
| FR-038 | The system shall support filtering by accessibility-related features represented in mock inventory. |
| FR-039 | The system shall support sorting by recommended order, price low-to-high, price high-to-low, passenger capacity, and vehicle name. |
| FR-040 | The system shall show the number of matching vehicles. |
| FR-041 | The system shall allow all active filters to be cleared. |
| FR-042 | The system shall maintain filter and sort state in shareable URL parameters. |
| FR-043 | The system shall show a no-results state with actions to change dates, location, or filters. |
| FR-044 | The system shall prevent unavailable vehicles from proceeding to checkout. |
| FR-045 | The system shall allow a vehicle to be marked or unmarked as a local favorite. |
| FR-046 | The system shall allow up to three vehicles to be selected for comparison. |

### 13.4 Vehicle Details and Comparison

| ID | Requirement |
| --- | --- |
| FR-050 | The vehicle details page shall show all result-card information plus a feature list, gallery, rental terms, mileage policy, fuel policy, deposit information, and cancellation summary. |
| FR-051 | The system shall clearly state that a displayed make/model may represent an equivalent vehicle in the category. |
| FR-052 | The system shall display an itemized base estimate for the active search. |
| FR-053 | The system shall allow the user to return to results without losing the active search and filters. |
| FR-054 | The system shall revalidate mock availability before starting checkout. |
| FR-055 | The comparison view shall align selected vehicle characteristics in a readable matrix. |
| FR-056 | The comparison view shall identify the lowest estimated price without claiming that it is objectively the best choice. |
| FR-057 | The system shall handle a direct vehicle URL without valid rental criteria by requesting required search inputs. |
| FR-058 | The system shall record recently viewed vehicle identifiers in browser storage. |

### 13.5 Pricing

| ID | Requirement |
| --- | --- |
| FR-060 | The system shall calculate billable rental duration using documented mock day and hour rules. |
| FR-061 | The estimate shall separately display base rental, location fees, one-way fees, driver-age fees, extras, discounts, taxes, and total. |
| FR-062 | All monetary calculations shall use integer minor currency units or another decimal-safe representation. |
| FR-063 | The system shall round displayed amounts consistently to currency precision. |
| FR-064 | The system shall recalculate the total whenever dates, vehicle, extras, driver eligibility, or promotion changes. |
| FR-065 | The system shall identify estimated and payable-at-counter amounts when fixtures define them separately. |
| FR-066 | The system shall display the rate unit and rental duration used in the calculation. |
| FR-067 | The system shall support mock percentage and fixed-amount promotion rules. |
| FR-068 | The system shall reject expired, unknown, ineligible, and already-applied promotion codes with distinct messages. |
| FR-069 | The system shall not allow a discount to reduce the eligible subtotal below zero. |
| FR-070 | The system shall provide a price breakdown throughout checkout. |
| FR-071 | The final review total shall match the booking confirmation total for an unchanged booking. |

### 13.6 Extras and Protection

| ID | Requirement |
| --- | --- |
| FR-080 | The system shall list mock protection plans with included coverage summaries and prices. |
| FR-081 | The user shall be able to select no protection plan when the fixture permits it. |
| FR-082 | Mutually exclusive protection plans shall not be selectable together. |
| FR-083 | The system shall offer mock extras such as additional driver, child seat, GPS, roadside assistance, and prepaid fuel. |
| FR-084 | Extras shall support per-day, per-rental, and per-unit pricing models. |
| FR-085 | The system shall enforce fixture-defined quantity limits. |
| FR-086 | The system shall identify an extra as unavailable when inventory is exhausted. |
| FR-087 | Extra selection shall immediately update the itemized total. |
| FR-088 | The system shall preserve selected extras when moving backward and forward through checkout. |

### 13.7 Renter and Driver Details

| ID | Requirement |
| --- | --- |
| FR-090 | The system shall collect the renter's name, email, phone number, and address using fictional demo data. |
| FR-091 | The system shall collect the primary driver's name, date of birth, license number, issuing country, and license expiry date. |
| FR-092 | The user shall be able to indicate that the renter and primary driver are the same person. |
| FR-093 | The system shall validate required fields and accepted formats. |
| FR-094 | The system shall validate the primary driver against the mock minimum and maximum age rules. |
| FR-095 | The system shall reject a license expiry date earlier than the rental return date. |
| FR-096 | The system shall display a warning not to enter real personal information. |
| FR-097 | The system shall support an optional flight number or arrival note. |
| FR-098 | The system shall require acceptance of mock rental terms and privacy disclosure before final confirmation. |
| FR-099 | The system shall not log complete payment, license, address, phone, or email field values. |

### 13.8 Simulated Account

| ID | Requirement |
| --- | --- |
| FR-100 | The system shall support simulated sign-in using predefined demo users. |
| FR-101 | Simulated sign-in shall not require or validate a real password. |
| FR-102 | The application shall clearly label the account as simulated. |
| FR-103 | A simulated signed-in user shall have mock profile details available for checkout prefilling. |
| FR-104 | The user shall be able to sign out and clear simulated account state. |
| FR-105 | The account page shall show mock profile information and booking summaries. |
| FR-106 | The application shall not imply that simulated authentication provides production security. |

### 13.9 Mock Payment

| ID | Requirement |
| --- | --- |
| FR-110 | The payment step shall display a clearly labeled mock card form. |
| FR-111 | The system shall accept documented test card numbers that produce approved, declined, and processing-error outcomes. |
| FR-112 | The form shall validate cardholder name, card number shape, expiry date, postal code, and security-code shape without calling an external provider. |
| FR-113 | The system shall mask the card number except for the last four digits after validation. |
| FR-114 | The system shall never persist the full mock card number or security code. |
| FR-115 | A declined outcome shall keep the user on the payment step and preserve non-sensitive booking information. |
| FR-116 | A processing-error outcome shall present a retry action without creating a booking. |
| FR-117 | An approved outcome shall create a single booking even if the confirmation action is repeated. |
| FR-118 | The review page shall display the selected mock payment type and masked identifier. |

### 13.10 Booking Review and Confirmation

| ID | Requirement |
| --- | --- |
| FR-120 | The review page shall show rental locations, dates, vehicle, renter, driver, extras, policies, and complete price breakdown. |
| FR-121 | The user shall be able to navigate to the relevant prior step to edit review information. |
| FR-122 | The system shall perform a final mock availability and price check before confirmation. |
| FR-123 | If availability changes, the system shall block confirmation and offer a return to search. |
| FR-124 | If price changes, the system shall show the old and new totals and require explicit acceptance. |
| FR-125 | The system shall generate a unique, human-readable mock booking reference. |
| FR-126 | Booking creation shall be idempotent for the same checkout submission identifier. |
| FR-127 | Confirmation shall show booking reference, status, pickup instructions, price, and management actions. |
| FR-128 | The system shall offer a printable confirmation view. |
| FR-129 | The system shall simulate notification delivery status without sending email or SMS. |
| FR-130 | Refreshing the confirmation page shall not create another booking. |

### 13.11 Booking Lookup and Management

| ID | Requirement |
| --- | --- |
| FR-140 | A guest shall be able to look up a booking by reference and renter surname. |
| FR-141 | Invalid lookup details shall return a generic not-found message. |
| FR-142 | A simulated signed-in user shall see bookings assigned to the active demo profile. |
| FR-143 | Booking details shall show status, itinerary, vehicle, extras, payment summary, policies, and price. |
| FR-144 | The system shall label bookings as upcoming, active, completed, or cancelled according to the mock clock and status. |
| FR-145 | Eligible upcoming bookings shall allow date/time modification. |
| FR-146 | Eligible upcoming bookings shall allow vehicle modification subject to mock availability. |
| FR-147 | Eligible upcoming bookings shall allow extras modification. |
| FR-148 | A modification shall show the original total, revised total, and difference before confirmation. |
| FR-149 | Confirmed modifications shall add a mock audit entry to the booking history. |
| FR-150 | An eligible booking shall support cancellation after explicit confirmation. |
| FR-151 | Cancellation shall show any mock fee and refund estimate before confirmation. |
| FR-152 | A cancelled booking shall not be modifiable or cancellable again. |
| FR-153 | Active, completed, and policy-ineligible bookings shall show why online modification or cancellation is unavailable. |
| FR-154 | Repeated modification or cancellation submissions shall not create duplicate state transitions. |

### 13.12 Favorites and Recently Viewed

| ID | Requirement |
| --- | --- |
| FR-160 | Favorite vehicle identifiers shall be stored in browser storage. |
| FR-161 | Favorites shall remain available after page refresh in the same browser profile. |
| FR-162 | The favorites page shall show current vehicle information for stored identifiers. |
| FR-163 | Missing or retired fixture vehicles shall be removed or identified without breaking the page. |
| FR-164 | Recently viewed vehicles shall be ordered from most to least recently viewed. |
| FR-165 | The user shall be able to clear favorites and recently viewed data. |

### 13.13 Help and Policies

| ID | Requirement |
| --- | --- |
| FR-170 | The help area shall contain mock FAQs covering eligibility, payment, pickup, return, fuel, mileage, extras, modification, and cancellation. |
| FR-171 | Policy content shall be accessible from search, vehicle details, checkout, and booking management where relevant. |
| FR-172 | Policy content shall explicitly state that it is fictional and for demonstration only. |
| FR-173 | The application shall provide a plain-language explanation of mock data retention and reset behavior. |

### 13.14 Demo Administration and Controls

| ID | Requirement |
| --- | --- |
| FR-180 | The read-only administration dashboard shall show summary counts for mock vehicles, locations, and bookings. |
| FR-181 | The fleet view shall allow filtering by location, category, and availability state. |
| FR-182 | The booking view shall allow filtering by booking status and rental period. |
| FR-183 | Administrative pages shall not provide production-like security claims. |
| FR-184 | Demo controls shall allow selection of predefined scenarios, including normal, slow response, no results, vehicle becomes unavailable, price changes, payment decline, and service error. |
| FR-185 | Demo controls shall allow the mock application clock to be set to a supported fixture date/time. |
| FR-186 | Demo controls shall provide a reset action that restores default fixtures and local state. |
| FR-187 | Demo controls shall be excluded or disabled through configuration when not needed for a demonstration. |

## 14. Business Rules

Rules use the identifiers `BR-###`.

| ID | Rule |
| --- | --- |
| BR-001 | Pickup must occur before return. |
| BR-002 | Pickup cannot be earlier than the active mock clock. |
| BR-003 | The default minimum driver age is 21 unless a vehicle category fixture specifies a higher age. |
| BR-004 | Drivers aged 21 through 24 incur the fixture-defined young-driver fee. |
| BR-005 | A primary driver must have a license valid through the return date. |
| BR-006 | A vehicle is available only when its location, inventory count, blackout dates, category rules, and requested period permit rental. |
| BR-007 | A booking temporarily holds no real inventory; availability is simulated by repository rules. |
| BR-008 | A one-way fee applies when pickup and return locations differ and the fixture defines a fee for that route. |
| BR-009 | Base price is calculated from the vehicle rate and billable duration defined by the pricing fixture. |
| BR-010 | Per-day extras use the same billable-day count as the rental unless explicitly configured otherwise. |
| BR-011 | Fixed extras are charged once per booking, multiplied by selected quantity where applicable. |
| BR-012 | Taxes are calculated after eligible discounts and before any explicitly tax-exempt items defined by fixtures. |
| BR-013 | Only one promotion code may be active unless a fixture explicitly allows stacking. |
| BR-014 | A promotion applies only to its eligible subtotal and cannot create a negative charge. |
| BR-015 | Vehicle images and make/model labels are representative and do not guarantee a specific production vehicle. |
| BR-016 | A booking is created only after required details, accepted terms, successful final checks, and approved mock payment. |
| BR-017 | Repeated submission with the same idempotency key returns the original booking result. |
| BR-018 | An upcoming booking may be changed only before its fixture-defined modification cutoff. |
| BR-019 | An upcoming booking may be cancelled only before its fixture-defined cancellation cutoff. |
| BR-020 | Cancelled, active, and completed bookings cannot be modified. |
| BR-021 | A cancellation computes a mock fee and refund estimate from the applicable fixture policy. |
| BR-022 | A price or availability change detected at final review requires customer resolution before booking creation. |
| BR-023 | Full card numbers and security codes exist only transiently during mock validation. |
| BR-024 | All booking references, notification results, and payment outcomes must be reproducible or controllable in tests. |

## 15. Mock Data Requirements

### 15.1 Fixture Coverage

The default fixture set shall include:

- At least 8 rental locations across multiple fictional cities or airports.
- At least 30 vehicles spanning economy, compact, midsize, full-size, SUV, luxury, van, electric, and accessible-feature categories.
- Multiple transmission, passenger, luggage, fuel/power, and feature combinations.
- Available, low-inventory, unavailable, and retired vehicle states.
- Same-location and one-way rental pricing.
- Daily, fixed, and quantity-based extras.
- At least three protection plan options.
- Valid, expired, ineligible, and fixed/percentage promotion codes.
- Approved, declined, and error-producing mock card values.
- Upcoming, active, completed, and cancelled bookings.
- Bookings inside and outside modification/cancellation windows.
- At least two simulated customer profiles.

### 15.2 Mock Repository Contracts

Mock repositories shall expose typed interfaces for:

- Locations.
- Vehicles.
- Availability.
- Pricing.
- Promotions.
- Extras and protection products.
- Profiles.
- Payments.
- Bookings.
- Notification outcomes.

UI components shall not directly import raw fixture files. Pages, use cases, or services shall access fixtures through these contracts so behavior can be replaced and tested independently.

### 15.3 Mock Behavior Configuration

The mock layer shall support:

- Configurable response latency.
- Deterministic success and failure outcomes.
- A controllable clock.
- Reset to default state.
- Seeded identifier generation or injected identifier providers.
- State isolation between automated tests.
- In-memory mutation for booking create, update, and cancel operations.
- Optional browser persistence for interactive demo continuity.

## 16. Conceptual Data Model

### 16.1 Location

- `id`
- `name`
- `type` such as airport or city
- `address`
- `timezone`
- `openingHours`
- `supportedReturnLocationIds`

### 16.2 Vehicle

- `id`
- `category`
- `makeModelExample`
- `imageUrls`
- `passengerCapacity`
- `luggageCapacity`
- `doorCount`
- `transmission`
- `fuelType`
- `features`
- `minimumDriverAge`
- `ratePlanId`
- `locationInventory`
- `status`

### 16.3 Search Criteria

- `pickupLocationId`
- `returnLocationId`
- `pickupAt`
- `returnAt`
- `driverAge`
- `promotionCode`

### 16.4 Price Quote

- `quoteId`
- `currency`
- `billableDuration`
- `lineItems`
- `discounts`
- `taxes`
- `total`
- `expiresAt`
- `pricingVersion`

### 16.5 Extra

- `id`
- `name`
- `description`
- `pricingModel`
- `unitPrice`
- `maximumQuantity`
- `availability`
- `compatibilityRules`

### 16.6 Renter and Driver

- Name fields
- Contact fields
- Address fields
- Date of birth
- License details
- Renter/driver relationship indicator

### 16.7 Booking

- `id`
- `reference`
- `status`
- `searchCriteria`
- `vehicleId`
- `selectedExtras`
- `renter`
- `driver`
- `priceQuote`
- `maskedPaymentSummary`
- `policySnapshot`
- `createdAt`
- `updatedAt`
- `history`
- `notificationStatus`

## 17. Mock API Requirements

The application may implement these operations as Next.js Route Handlers or equivalent typed server functions.

| Method and path | Purpose |
| --- | --- |
| `GET /api/locations` | List searchable mock locations |
| `GET /api/vehicles/search` | Search available vehicles |
| `GET /api/vehicles/:id` | Retrieve vehicle details |
| `POST /api/quotes` | Create or recalculate a price quote |
| `POST /api/promotions/validate` | Validate a mock promotion |
| `GET /api/extras` | List applicable extras and protection plans |
| `POST /api/payments/authorize` | Produce a mock payment outcome |
| `POST /api/bookings` | Create an idempotent mock booking |
| `POST /api/bookings/lookup` | Retrieve a booking by reference and surname |
| `GET /api/bookings/:id` | Retrieve a known booking |
| `PATCH /api/bookings/:id` | Modify an eligible booking |
| `POST /api/bookings/:id/cancel` | Cancel an eligible booking |
| `GET /api/admin/summary` | Retrieve read-only demo summary data |
| `POST /api/demo/reset` | Reset mutable mock state |
| `POST /api/demo/scenario` | Set the active mock scenario |

API responses shall use consistent typed success and error envelopes. Errors shall include a stable machine-readable code, a user-safe message, and relevant field details where applicable.

## 18. Validation and Error Handling

### 18.1 Validation

- Client validation shall provide immediate, accessible feedback.
- Authoritative domain validation shall also run in the server/mock-service boundary.
- Shared schemas or shared domain rules shall prevent client/server rule drift.
- Validation messages shall identify the problem and expected correction.
- Error summaries shall link to invalid fields on multi-field forms.
- Invalid URL parameters shall not crash rendering.

### 18.2 Error Categories

The application shall distinguish:

- Input validation errors.
- No inventory or unsupported search errors.
- Stale availability.
- Stale or changed price.
- Promotion errors.
- Mock payment decline.
- Mock payment processing failure.
- Booking lookup failure.
- Policy-ineligible modification or cancellation.
- Generic mock service failure.
- Unexpected application failure.

### 18.3 Recovery

Every recoverable error shall provide one or more appropriate actions, such as:

- Correct fields.
- Retry.
- Return to search.
- Change dates.
- Choose another vehicle.
- Remove a promotion.
- Use another documented test payment value.
- Reset the active demo scenario.

## 19. User Experience Requirements

1. The primary search action shall be visually prominent.
2. Search criteria and price context shall remain visible or easily accessible through selection and checkout.
3. The application shall not present hidden mandatory charges; all fixture-defined charges must appear in the price breakdown.
4. Checkout shall show progress and completed/current steps.
5. Back navigation shall preserve valid entered data except transient sensitive payment values.
6. Destructive actions such as cancellation and reset shall require confirmation.
7. Empty and failure states shall be intentionally designed, not represented as blank screens.
8. Mobile layouts shall provide touch-friendly controls and avoid horizontal scrolling, except an intentionally scrollable comparison table with clear affordance.
9. Desktop layouts shall use available width without making forms or text excessively wide.
10. Date, time, currency, and location labels shall be unambiguous.
11. The application shall avoid dark patterns, false scarcity, or claims that mocked urgency is real.

## 20. Accessibility Requirements

The application shall target WCAG 2.2 Level AA for the implemented demo experience.

- All functionality shall be keyboard operable.
- Focus indicators shall be visible.
- Focus order shall follow the visual and logical flow.
- Form controls shall have programmatic names and associated labels.
- Validation errors shall be programmatically associated with fields.
- Dynamic status updates shall use appropriate live-region behavior without excessive announcements.
- Modal dialogs shall manage focus and support Escape where dismissal is safe.
- Color shall not be the only means of communicating status.
- Text and meaningful controls shall meet applicable contrast requirements.
- Vehicle imagery shall use useful alternative text; decorative imagery shall be ignored by assistive technology.
- Headings and landmarks shall form a logical page structure.
- Touch targets shall meet reasonable minimum sizing.
- Motion shall respect reduced-motion preferences.
- Automated accessibility checks shall cover representative pages, with manual keyboard and screen-reader-oriented checks included in acceptance activities.

## 21. Responsive Design Requirements

The UI shall support:

- Small mobile viewports from 320 CSS pixels.
- Standard mobile and tablet portrait/landscape layouts.
- Desktop layouts from 1024 CSS pixels.
- Wide desktop layouts without uncontrolled content stretching.

Critical workflows shall remain usable at 200% browser zoom and with increased text spacing within practical demo limits.

## 22. Non-Functional Requirements

### 22.1 Performance

- The application shall avoid unnecessary client-side JavaScript by preferring Server Components.
- Route-level loading UI shall be used where mocked operations introduce latency.
- Images shall use responsive sizing and optimization appropriate to Next.js.
- Search filters shall respond promptly when no artificial demo latency is active.
- Automated performance assertions may use stable budgets selected during implementation; they must not depend on public network services.

### 22.2 Reliability and Determinism

- The same fixtures, clock, and input shall produce the same business result.
- Tests shall not depend on execution order.
- Tests shall not require the public internet.
- Mutable repositories shall be reset between relevant tests.
- Random identifiers and timestamps shall be injectable or seeded.
- Booking creation and state transitions shall be idempotent.

### 22.3 Maintainability

- Domain rules shall be separated from React rendering.
- Components shall not contain duplicated pricing, eligibility, or policy logic.
- Public functions and domain types shall have explicit TypeScript types.
- TypeScript strict mode shall be enabled.
- No production code shall use `any` to bypass domain typing without a documented, narrowly scoped justification.
- Mock and production-replaceable boundaries shall be represented by interfaces.
- Features shall be organized so tests can run without rendering the entire application.

### 22.4 Privacy and Demo Safety

Production security is out of scope, but the demo shall avoid unsafe handling that would encourage incorrect reuse:

- Display a warning against entering real personal or payment information.
- Do not persist complete card data or security codes.
- Do not include real credentials or secrets.
- Do not log sensitive form fields.
- Use obviously fictional fixture data.
- Provide a reset/clear action for locally stored demo data.
- Clearly document that simulated authentication and payment are not production-ready controls.

### 22.5 Observability

- Important mock operations may emit structured development logs.
- Logs shall include operation names, stable outcome codes, and correlation identifiers where useful.
- Logs shall exclude sensitive form values.
- The UI shall expose a demo-friendly notification status and booking history rather than requiring log inspection.

## 23. TDD Requirements

TDD is mandatory for domain logic, reusable components, and integration boundaries.

### 23.1 Development Cycle

For each behavior:

1. Write a focused failing test that expresses the next required behavior.
2. Implement the smallest correct change that makes the test pass.
3. Refactor while maintaining a passing test suite.
4. Add boundary and error cases before considering the behavior complete.

Pull requests or commits should make this progression reviewable where practical.

### 23.2 Required Test Layers

| Layer | Primary focus |
| --- | --- |
| Unit tests | Pricing, dates, availability, eligibility, promotion, policy, state transitions, formatting helpers |
| Component tests | Form behavior, accessible interaction, result cards, filters, price breakdown, dialogs, error states |
| Integration tests | Page/use-case interaction with mock repositories and route handlers |
| Contract tests | Typed mock repository and API success/error shapes |
| End-to-end tests | Critical browser journeys across routes |
| Accessibility tests | Automated checks on representative components and pages |

### 23.3 High-Priority Unit Test Subjects

- Rental duration calculations across day and time boundaries.
- Decimal-safe monetary arithmetic and rounding.
- One-way, age, extras, discount, and tax calculations.
- Promotion eligibility and stacking rules.
- Vehicle availability intersection rules.
- Driver age and license-expiry validation.
- Quote expiry and price-change detection.
- Booking lifecycle transitions.
- Modification and cancellation eligibility.
- Cancellation fee and refund estimate.
- Idempotent booking, modification, and cancellation commands.
- Query-string parsing and serialization.

### 23.4 Test Design Rules

- Tests shall describe observable behavior rather than implementation details.
- Tests shall use factories/builders for readable fixture setup.
- Time shall be controlled; tests shall not use the uncontrolled system clock.
- Tests shall not use arbitrary sleeps.
- Network requests shall be intercepted or served in-process.
- Each test shall own or reset mutable state.
- Snapshot tests shall not replace meaningful assertions for business behavior.
- Component tests shall query elements by role, accessible name, label, or visible text where practical.
- Failure-path tests are required for each mock integration.

### 23.5 Coverage Expectations

Coverage percentages are secondary to behavioral coverage. At minimum:

- All business rules shall have direct automated tests.
- Every pricing line-item type shall have positive and negative/boundary tests.
- Every booking lifecycle transition shall be tested.
- Every primary form shall have validation and successful-submission tests.
- Every mock service outcome shall be covered.
- Every critical journey shall have at least one end-to-end scenario.

## 24. BDD Requirements

BDD shall define user-visible behavior in business-readable language before or alongside implementation.

### 24.1 Feature Organization

Feature files or equivalent living specifications shall be grouped by capability:

- Rental search.
- Vehicle discovery and comparison.
- Pricing and promotions.
- Extras and protection.
- Driver eligibility.
- Checkout and payment.
- Booking confirmation.
- Booking lookup.
- Booking modification.
- Booking cancellation.
- Simulated account.
- Demo scenario controls.
- Accessibility-critical interactions.

### 24.2 Scenario Standards

- Scenarios shall use Given/When/Then language.
- A scenario shall describe one principal behavior.
- `Given` steps establish business context, not UI implementation details.
- `When` steps describe a meaningful user action.
- `Then` steps assert observable outcomes.
- Scenario outlines shall cover meaningful data variations without creating unreadable matrices.
- Scenario tags shall support execution by capability and level, for example `@search`, `@checkout`, `@critical`, `@error`, and `@accessibility`.
- Step definitions shall call application behavior rather than duplicate domain logic.

### 24.3 Representative BDD Scenarios

```gherkin
Feature: Search for an available rental vehicle

  Scenario: Customer finds vehicles for a valid rental period
    Given available vehicles exist at "Harbor Airport"
    And the mock clock is "2026-08-10 10:00"
    When the customer searches from "2026-08-12 10:00" to "2026-08-15 10:00"
    Then available vehicles are displayed
    And each result includes an estimated total
    And the search criteria are represented in the page URL
```

```gherkin
Feature: Driver eligibility

  Scenario: A young driver fee is included for an eligible 23 year old driver
    Given the selected vehicle permits drivers aged 21 or older
    When the primary driver's age is 23
    Then the driver is eligible
    And the price includes the configured young driver fee

  Scenario: Driver is below the vehicle category minimum age
    Given the selected vehicle requires a minimum driver age of 25
    When the primary driver's age is 23
    Then checkout is blocked
    And the customer is told that the vehicle requires a driver aged 25 or older
```

```gherkin
Feature: Confirm a booking

  Scenario: Approved mock payment creates one booking
    Given the customer has completed all required checkout information
    And the selected vehicle remains available
    And the quoted price has not changed
    When the customer confirms using an approved test card
    Then one confirmed booking is created
    And a booking reference is displayed
    And repeating the same confirmation does not create another booking
```

```gherkin
Feature: Handle a stale vehicle selection

  Scenario: Vehicle becomes unavailable before confirmation
    Given the customer selected an available vehicle
    And the demo scenario makes that vehicle unavailable at final review
    When the customer attempts to confirm the booking
    Then no booking is created
    And the customer is prompted to return to search
```

```gherkin
Feature: Cancel an eligible booking

  Scenario: Customer cancels before the free cancellation cutoff
    Given an upcoming confirmed booking is inside its free cancellation period
    When the customer confirms cancellation
    Then the booking status becomes "Cancelled"
    And the cancellation fee is zero
    And the mock refund estimate is displayed
```

### 24.4 Traceability

Each backlog user story created from this specification shall reference:

- One or more requirement IDs.
- Relevant business rule IDs.
- At least one acceptance scenario.
- Expected test level or levels.

Critical BDD scenarios shall be linked to automated end-to-end or integration tests.

## 25. Test Environments and Test Data

| Environment | Purpose |
| --- | --- |
| Unit test environment | Pure domain and utility tests with injected fixtures |
| Component test environment | Browser-like DOM with mocked dependencies |
| Integration test environment | Next.js application modules with in-process mock repositories |
| End-to-end environment | Locally started application with deterministic seed and scenario controls |
| Interactive demo environment | Default fixture set with optional local persistence |

Each environment shall use known fixture versions. Tests that mutate bookings shall receive isolated repository instances or reset state before execution.

## 26. Definition of Ready

A user story is ready for implementation when:

- User value and scope are clear.
- Relevant `FR` and `BR` identifiers are linked.
- Acceptance criteria are written in BDD form or are directly translatable to Given/When/Then.
- Required fixture data and mock outcomes are identified.
- UX states include success, loading, empty, validation, and relevant failure behavior.
- Accessibility expectations are identified.
- Dependencies and out-of-scope behavior are explicit.
- Expected unit, component, integration, or end-to-end tests are identified.

## 27. Definition of Done

A user story is done when:

- Acceptance criteria are satisfied.
- Required tests were written using the TDD cycle and pass.
- Applicable BDD scenarios are automated and pass.
- Type checking, linting, and targeted tests pass.
- Loading, empty, error, and retry states are implemented where applicable.
- Keyboard and accessible-name behavior is verified for changed UI.
- Responsive behavior is verified at relevant mobile and desktop sizes.
- Mock data remains deterministic and resettable.
- No real service, database, secret, or production data dependency was introduced.
- Requirement and test traceability is updated.

## 28. Release Acceptance Criteria

The demo release is acceptable when:

1. The search-to-confirmation journey completes using default fixtures.
2. Guest lookup, eligible modification, and cancellation complete successfully.
3. Search no-results, stale availability, price change, payment decline, and service-error scenarios are demonstrable.
4. The default fixture set meets the coverage specified in this document.
5. Critical BDD scenarios pass in the end-to-end test environment.
6. All business rules have direct automated test coverage.
7. No external database, payment, authentication, email, mapping, or inventory service is required.
8. No secret configuration is required to run the app or tests.
9. Key pages meet the accessibility and responsive requirements.
10. Demo disclosures and warnings are visible where required.

## 29. Risks and Mitigations

| Risk | Mitigation |
| --- | --- |
| Demo scope becomes production-sized | Keep production integrations, real security, and operational capabilities explicitly out of scope |
| Mock behavior is too simplistic to demonstrate edge cases | Use scenario controls, deterministic failures, a controllable clock, and rich fixtures |
| Business logic becomes embedded in components | Enforce domain services and repository boundaries with unit tests |
| BDD scenarios duplicate low-level tests | Keep BDD focused on user-visible behavior and unit tests focused on rules and boundaries |
| Flaky end-to-end tests | Use fixed clocks, seeded data, local APIs, no arbitrary waits, and state reset |
| Users enter real data into the demo | Show warnings, use fictional examples, avoid sensitive persistence, and provide reset controls |
| Price totals differ between pages | Use one shared pricing domain service and quote snapshot |
| Duplicate bookings occur on retries | Require idempotency keys and lifecycle tests |

## 30. Future Backlog Decomposition

The subsequent backlog shall contain exactly 150 GitHub user stories derived from this specification. Stories should be grouped into these epics:

| Epic | Planned story count |
| --- | ---: |
| Project foundation and developer experience | 10 |
| Application shell, navigation, and shared UX | 8 |
| Mock domain, repositories, fixtures, and scenario controls | 14 |
| Rental search | 12 |
| Search results, sorting, and filtering | 14 |
| Vehicle details, comparison, favorites, and recently viewed | 12 |
| Pricing, promotions, extras, and protection | 16 |
| Renter, driver eligibility, and simulated account | 13 |
| Mock payment, review, and booking confirmation | 14 |
| Booking lookup, modification, cancellation, and history | 16 |
| Help, policies, and read-only administration | 7 |
| Accessibility, responsive behavior, performance, and resilience | 7 |
| TDD, BDD, integration, and end-to-end quality coverage | 7 |
| **Total** | **150** |

Each future GitHub issue shall include:

- A concise user-story title.
- `As a / I want / so that` statement.
- Requirement and business-rule references.
- In-scope and out-of-scope notes.
- Gherkin acceptance criteria.
- TDD test expectations.
- Mock data or scenario dependencies.
- Accessibility considerations where applicable.
- Definition-of-done checklist.
- Epic and suggested priority labels.

The GitHub issue generation is intentionally a separate phase and is not part of this requirements-document deliverable.
