You are building a Django REST Framework backend that verifies Firebase Auth tokens.

Tasks:

1. **Middleware or Authentication Class**

    - Read `Authorization: Bearer <ID_TOKEN>` from incoming request headers.
    - Use `firebase_admin.auth.verify_id_token()` to validate the token and extract `uid`.

2. **User Mapping**

    - On first valid login, create or retrieve a `User` model instance with `username=uid`.
    - Attach this user to `request.user`.

3. **Protected Endpoint Example**
    - Implement `GET /api/profile/` that returns the authenticated user’s email and UID.
    - Ensure only authenticated requests succeed (401 if missing/invalid token).

Requirements:

-   Show code for `settings.py` Firebase Admin initialization.
-   Provide the full `Authentication` class or middleware code.
-   Include URL routing and the simple `ProfileView` in DRF.
-   Write clear comments for each block.
