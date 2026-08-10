@booking @critical
Feature: Manage a booking

  Scenario: Guest retrieves a booking using reference and surname
    Given the booking "DW-260820-A1B2" belongs to renter surname "Lee"
    When the guest submits those lookup details
    Then the booking itinerary is displayed
    And its price and status are displayed

  Scenario: Customer cancels an eligible booking
    Given an upcoming confirmed booking is inside its cancellation period
    When the customer confirms cancellation
    Then the booking status becomes "Cancelled"
    And a zero mock cancellation fee is applied
    And the booking cannot be cancelled again

  Scenario: Customer modifies eligible rental date-times
    Given an upcoming confirmed booking
    When the customer confirms valid new rental date-times
    Then the booking itinerary and price are recalculated
    And the date-time change is recorded once in the booking history

  Scenario: Customer modifies the vehicle subject to availability
    Given a confirmed booking is eligible for modification
    And an alternative vehicle is available for the booking's dates and location
    When the customer selects the alternative vehicle and saves the change
    Then the booking's vehicle is updated
    And the price is recalculated
    And the change is recorded in the booking history

  @error
  Scenario: Vehicle modification is blocked when the vehicle is unavailable
    Given a confirmed booking is eligible for modification
    And the "Vehicle unavailable" demo scenario is active
    When the customer attempts to change the vehicle
    Then the vehicle change is prevented
    And an actionable recovery message is displayed
    And the booking's original vehicle remains unchanged
