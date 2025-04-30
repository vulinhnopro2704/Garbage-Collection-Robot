You are building an Expo React Native app that uses Firebase Auth for user sign-in and then calls a Django backend.

Tasks:

1. **Login Flow**

    - Implement email/password login with Firebase Auth.
    - On success, retrieve the Firebase ID token (`await user.getIdToken()`).

2. **API Client Setup**

    - Create a reusable API client (using `axios` or `fetch`) that automatically includes:  
      • `Authorization: Bearer <ID_TOKEN>`  
      • `Content-Type: application/json`
    - The client should refresh or re-acquire the ID token if it has expired.

3. **Usage Example**
    - After login, call a protected endpoint `GET /api/profile/` to fetch the user’s profile.
    - Show loading, success, and error states.

Requirements:

-   Keep code modular: separate auth context/hook, API client module, and login screen.
-   Handle and display errors (e.g. invalid credentials, network failures).
-   Include comments explaining each step.
