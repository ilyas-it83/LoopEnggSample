@checkout @critical
Feature: Confirm a booking

  Scenario: Approved mock payment creates one booking
    Given the customer completed all required checkout information
    And the selected vehicle remains available
    And the quoted price has not changed
    When the customer confirms using the approved test card
    Then one confirmed booking is created
    And a human-readable booking reference is displayed
    And repeating the same confirmation does not create another booking

  @error
  Scenario: Vehicle becomes unavailable before confirmation
    Given the customer selected an available vehicle
    And the "Vehicle unavailable" demo scenario is active
    When the customer attempts to confirm the booking
    Then no booking is created
    And the customer is prompted to return to search

