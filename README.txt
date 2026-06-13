1. **Loading Screen Stuck After Using Browser Back Button**

   * The application gets stuck on the loading screen when the user clicks the browser's Back button from the login page.
   * Start on 1:20:28 in video to 3:01:16

2. **Duplicate Notification When Using an Existing Email**

   * When attempting to register with an email address that is already in use, the system displays duplicate error notifications.
    = https://prnt.sc/gZb_mdsc56ze

3. **Incorrect Error Message for Existing Email**

   * The error message currently states: **"This email is not available."**
   * This message is unclear and misleading. It should instead state: **"This email is already registered."** or **"This email is already in use."**
    = https://prnt.sc/I2njVcCuVzeb

4. **Google Sign-Up Creates Data Inconsistency**
   * A user can successfully register using Google Sign-In with an email address that was previously registered through the manual sign-up process.
   * During onboarding, the system asks the user to create new profile data; however, the previous account data is still retained, causing inconsistencies, particularly with the username and account information.
   * Start on 24:55 in video to 26:36

5. **Business Flow Account Duplication (Needs Confirmation)**

   * This requires clarification.
   * In the Business flow, a LinkedIn account using the same email address as an existing Google account appears to create a separate user account instead of linking to the existing one.
   * Please confirm whether this is the intended behavior.

6. User Must Log In Twice After Password Change

   *After successfully changing the password, the user is unable to access the application on the first login attempt.
   *The user remains stuck on the login page after entering valid credentials.
   *A second login attempt is required before the user can successfully access the application.
   *Expected Result: The user should be authenticated and redirected to the application immediately after the first successful login attempt following a password change.
   * Start on 01:05:13 in video to 01:06:59

7. Deleted Account Remains Accessible in Another Active Browser Session

   * If the same account is logged in on two different browsers, and the account is deleted from the first browser, the session in the second browser remains active.
   * The user can still access the application and continue using AI features from the second browser even though the account has already been deleted.
   * The system does not automatically invalidate or terminate existing sessions associated with the deleted account.
   * *Expected Result:* Once an account is deleted, all active sessions across all browsers and devices should be immediately terminated, and the user should be logged out and prevented from accessing any application features.
   * Start on 38:20 in video to 39:06
   
*8. Onboarding State Is Not Synchronized Across Multiple Browser Sessions*

  * The same account is logged in on two different browsers.
  * In the first browser, the user successfully completes the onboarding flow and creates a project.
  * When switching to the second browser, the onboarding flow is still displayed as if it has not been completed.
  * If the user clicks **Finish** or **Create Project** from the second browser, the process fails and the user becomes stuck on the onboarding screen.
  * The API response returns **HTTP 200 (Success)**, but the onboarding process is not completed and no action is performed.
  * This creates an inconsistent user experience because the frontend state does not reflect the latest account status.
  * **Expected Result:** Once onboarding is completed in any browser session, all active sessions should immediately reflect the updated account state. The onboarding flow should no longer be displayed, and users should be redirected to the main application without being able to submit duplicate onboarding actions. Additionally, the system should return an appropriate error response if the onboarding process has already been completed.
  * Start on 32:59 in video to 36:04





Video Test : https://drive.google.com/file/d/1KJkv8b1axcrjGBZT1b8KVJLS8g_Fnrze/view?usp=sharing
Test Case : https://docs.google.com/spreadsheets/d/14p7QKLJigtvbAMjBPPGEtFXSrFO6U25VwBb4Wvz2fhA/edit?usp=sharing
Github Test Upwork : https://github.com/riantra/AndrianTestUpwork.git
Github Sample (My code if focus on automation): https://github.com/riantra/AndrianPlaywrightSample.git
