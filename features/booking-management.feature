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

