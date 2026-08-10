@pricing @foundation
Feature: Create rate plan, fee, tax, and promotion fixtures

  Scenario: Developer validates the deterministic pricing fixture catalog
    Given the Drivewise demo is using its default fixture set
    And the active demo scenario is "Normal"
    When the developer validates the pricing fixtures
    Then rate plan, fee, tax, and promotion fixture counts are displayed
    And an accessible status confirms the fixture catalog is valid
    And no production service or real data is required

  @error
  Scenario: Pricing fixture validation is unavailable
    Given the "Service error" demo scenario is active
    When the developer attempts to validate the pricing fixtures
    Then validation is prevented
    And an accessible recovery message directs the developer to reset the demo scenario
