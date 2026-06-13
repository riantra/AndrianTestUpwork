1. **Loading Screen Stuck After Using Browser Back Button**

   * The application gets stuck on the loading screen when the user clicks the browser's Back button from the login page.

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

5. **Business Flow Account Duplication (Needs Confirmation)**

   * This requires clarification.
   * In the Business flow, a LinkedIn account using the same email address as an existing Google account appears to create a separate user account instead of linking to the existing one.
   * Please confirm whether this is the intended behavior.

   Video Test : https://drive.google.com/file/d/1KJkv8b1axcrjGBZT1b8KVJLS8g_Fnrze/view?usp=sharing
   Test Case : https://docs.google.com/spreadsheets/d/14p7QKLJigtvbAMjBPPGEtFXSrFO6U25VwBb4Wvz2fhA/edit?usp=sharing
   Github Test : 
   Github Sample (My code if focus on automation): https://github.com/riantra/AndrianPlaywrightSample.git