@driver @pricing
Feature: Driver eligibility

  Scenario: Eligible young driver receives a fee
    Given the selected vehicle permits drivers aged 21 or older
    When the primary driver's age is 23
    Then the driver is eligible
    And the price includes the configured young driver fee

  Scenario: Driver is below the vehicle category minimum age
    Given the selected vehicle requires a minimum driver age of 25
    When the primary driver's age is 23
    Then the vehicle is excluded from the available results

