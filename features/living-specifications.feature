@DW-149 @BDD-04 @TDD-01 @living-specification
Feature: Create tagged Gherkin living specifications

  @success
  Scenario: Create tagged Gherkin living specifications succeeds with deterministic mock data
    Given the Drivewise demo is using its default fixture set
    And the active mock scenario supports this capability
    When the engineering team completes the relevant action
    Then the application shall create tagged Gherkin living specifications
    And the result shall be deterministic and visible to the user
    And no production service or real data shall be required

  @error
  Scenario: Create tagged Gherkin living specifications handles an invalid or unavailable state
    Given the relevant validation or failure condition is active
    When the engineering team attempts the action
    Then the application shall prevent an invalid state transition
    And an actionable, accessible recovery message shall be displayed
