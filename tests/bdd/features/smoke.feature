Feature: Nexus OS dashboard
  As a Nexus OS learner
  I want to verify the dashboard loads
  So that I can understand BDD with Playwright

  Scenario: Open the daily command center
    Given I open Nexus OS
    Then I should see the dashboard for Uthai
    And I should see the daily focus area
