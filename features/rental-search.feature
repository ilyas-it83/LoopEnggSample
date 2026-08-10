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

  Scenario: Customer filters results by transmission type
    Given available vehicles exist at "Harbor International Airport"
    When the customer filters results by "Manual" transmission
    Then only vehicles with "Manual" transmission are displayed

  Scenario: Customer filters results by passenger capacity
    Given available vehicles exist at "Harbor International Airport"
    When the customer filters for at least 7 passengers
    Then only vehicles with at least 7 seats are displayed

  @error
  Scenario: Vehicle service error prevents unavailable results
    Given the "Service error" demo scenario is active
    When the customer searches with valid criteria
    Then no vehicle cards are displayed
    And recovery guidance is displayed
