@foundation
Feature: Initialize the application architecture

  Scenario: Developer initializes the deterministic App Router foundation
    Given the Drivewise demo is using its default fixture set
    And the active demo scenario is "Normal"
    When the developer initializes the application architecture
    Then the fixture version, mock clock, and inventory manifest are displayed
    And an accessible success status confirms that no production service or real data is required

  @error
  Scenario: Architecture initialization is unavailable
    Given the "Service error" demo scenario is active
    When the developer attempts to initialize the application architecture
    Then initialization is prevented
    And an accessible recovery message directs the developer to reset the demo scenario

  @configuration
  Scenario: Developer validates typed demo application configuration
    Given the Drivewise demo is using its default fixture set
    And the active demo scenario is "Normal"
    When the developer initializes the application architecture
    Then the typed fixture, clock, data source, state store, and service mode configuration is displayed
    And an accessible success status confirms that no production service or real data is required

  @configuration @error
  Scenario: Demo application configuration is invalid
    Given the demo application configuration has an invalid fixture version
    When the developer attempts to initialize the application architecture
    Then initialization is prevented
    And an accessible recovery message directs the developer to correct the demo configuration
