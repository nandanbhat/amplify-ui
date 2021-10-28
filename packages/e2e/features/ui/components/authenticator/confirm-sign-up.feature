Feature: Confirm Sign Up

  If you enabled multi-factor auth, confirm the sign-up after retrieving a confirmation code from the user.

  See: https://docs.amplify.aws/lib/auth/emailpassword/q/platform/js#confirm-sign-up

  Background:
    Given I'm running the example "ui/components/authenticator/sign-up-with-email"

  Scenario: Username is disabled
    When I see "Confirm Sign Up"
    Then The input "username" is disabled

  Scenario: Navigating back to "Sign In"
    When I click "Back to Sign In"
    Then I see "Sign In"

  Scenario: Resending Code
    When I click "Resend Code"
    Then A new code is sent

  Scenario: Confirming a Code
    When I type the confirmation code
    And I click the "Confirm" button
    Then I am logged in

  Scenario: Entering an invalid code
    When I type an invalid confirmation code
    And I click the "Confirm" button
    Then I see an error alert

  Scenario: Sign up with a new username & password
    When I type a new username
    And I type the password "test-password"
    And I type the email "test@example.com"
    And I type the phone number "+15558675309"
    And I click the "Create Account" button
    Then I see "Confirm Sign Up"
    And I see "Confirmation Code"
  
  @angular @react @vue 
  Scenario: User is already confirmed and then clicks Resend Code
    Given I intercept '{ "headers": { "X-Amz-Target": "AWSCognitoIdentityProviderService.SignUp" } }' with fixture "sign-up-with-email"
    And I intercept '{ "headers": { "X-Amz-Target": "AWSCognitoIdentityProviderService.ResendConfirmationCode" } }' with error fixture "user-already-confirmed-error"
    When I type a new "email"
    And I type my password
    And I confirm my password
    And I click the "Create Account" button
    Then I see "Confirmation Code"
    And I click the "Resend Code" button
    Then I see "Create a new account"

  Scenario: Supports "One-Time Code"

    See: https://developer.apple.com/documentation/security/password_autofill/enabling_password_autofill_on_an_html_input_element

    When I see "Confirmation Code"
    Then The "confirmation_code" input autocompletes "one-time-code"
