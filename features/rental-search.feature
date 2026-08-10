@search @critical
Feature: Search for an available rental vehicle

  Scenario: Customer finds vehicles for a valid rental period
    Given available vehicles exist at "Harbor International Airport"
    And the mock clock is "2026-08-10 10:00"
    When the customer searches from "2026-08-12 10:00" to "2026-08-15 10:00"
    Then available vehicles are displayed
    And each result includes an estimated total
    And the search criteria are represented in the page URL

  @error
  Scenario: Active no-results scenario returns an intentional empty state
    Given the "No search results" demo scenario is active
    When the customer searches with valid criteria
    Then no vehicle cards are displayed
    And recovery guidance is displayed

  Scenario: Customer filters by an accessibility-related feature
    Given the default mock inventory is available
    When the customer selects "Wheelchair-accessible entry"
    Then only vehicles with that accessibility feature are displayed
    And the matching vehicle count is announced

  @error
  Scenario: Accessibility filters have no shared matching vehicle
    Given the default mock inventory is available
    When the customer selects "Hand controls" and "Wheelchair-accessible entry"
    Then no vehicle cards are displayed
    And recovery guidance is displayed
