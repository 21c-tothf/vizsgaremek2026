# Frontend-Backend Integration Checklist

Generated: 2026-04-21
Scope: frontend and backend source currently present in this workspace.

## 1. Route and Access Audit

Implemented frontend routes:
- Public:
  - `/`
  - `/listings`
  - `/listings/:id`
  - `/login`
  - `/register`
- Authenticated:
  - `/profile`
  - `/my-listings`
  - `/create-listing`
  - `/edit-listing/:id`
  - `/favorites`
  - `/listing-messages`
- Admin only:
  - `/admin`
  - `/admin/users`
  - `/admin/listings`
  - `/admin/messages`

Route guards:
- `ProtectedRoute`: redirects unauthenticated users to `/login` and preserves return target.
- `AdminRoute`: redirects non-admin authenticated users to `/dashboard`.
- Auth restoration loading guards implemented (`isBootstrapping` checks in route guards).
- Unauthorized handling implemented via Axios 401 interceptor + redirect handler.

Status: PASS

## 2. Endpoint Contract Matrix

### Auth
- Frontend:
  - `POST /api/auth/register` (`authApi.register`)
  - `POST /api/auth/login` (`authApi.login`)
- Backend controller found:
  - `AuthController` with matching mappings.
- DTO mapping:
  - Login request: `email`, `password` (match)
  - Register request: `name`, `email`, `password`, `phoneNumber` (match)
  - Auth response: `accessToken`, `tokenType`, `userId`, `email`, `role` (+ optional `username`) (match with frontend)

Status: VERIFIED

### Listings (public + owner management)
- Frontend expects:
  - `GET /api/listings`
  - `GET /api/listings/{id}`
  - `GET /api/listings/search`
  - `GET /api/listings/my`
  - `POST /api/listings`
  - `PUT /api/listings/{id}`
  - `DELETE /api/listings/{id}`
  - `POST /api/listings/{id}/images`
- Backend evidence:
  - `SecurityConfig` references `/api/listings` and `/api/listings/my`.
  - No `ListingController` file is present in current workspace snapshot.
  - Existing CRUD controller is `CarController` under `/api/cars` with `CarDto`.
- DTO coverage in backend exists for listing types (`ListingCreateRequest`, `ListingUpdateRequest`, `ListingResponse`, `ListingSummaryResponse`) but controller not visible.

Status: NOT FULLY VERIFIED (controller mappings for `/api/listings` not found in visible source)

### Images
- Frontend uses:
  - `POST /api/listings/{id}/images` with `multipart/form-data` field `file`.
  - `DELETE /api/images/{id}`
- Backend visible:
  - `ImageController` has:
    - `POST /api/cars/{carId}/images` with request param `imagePath` (not multipart file)
    - `DELETE /api/images/{id}`

Status:
- Delete image: VERIFIED
- Upload image: MISMATCH (path and payload shape differ in visible backend)

### Favorites
- Frontend uses:
  - `GET /api/favorites`
  - `POST /api/favorites/{listingId}`
  - `DELETE /api/favorites/{listingId}`
- Backend visible:
  - No favorites controller found in current source snapshot.
  - Security config allows `/api/favorites/**` authenticated.

Status: NOT FULLY VERIFIED (endpoint implementation not visible)

### Messages
- Frontend uses:
  - `POST /api/messages`
  - `GET /api/messages/my-listings` with fallback to `GET /api/messages/my-messages`
  - `PATCH /api/messages/{id}/read`
- Backend visible in `MessageController`:
  - `POST /api/messages` (match)
  - `GET /api/messages/my-messages` (match with fallback)
  - `PATCH /api/messages/{id}/read` (match)
  - `GET /api/messages/car/{carId}` (extra)
- DTO mapping:
  - Request fields: `carId`, `senderId`, `receiverId`, `message` (match)
  - Response fields: `id`, `carId`, `senderId`, `receiverId`, `message`, `sentAt` (match)

Status: VERIFIED (with frontend fallback for `/my-listings`)

### Profile
- Frontend uses:
  - `GET /api/users/me`
  - `PUT /api/users/me`
- Backend visible:
  - No users/me controller mapping found in current source snapshot.

Status: NOT VERIFIED (frontend has graceful fallback to auth-state display)

### Admin
- Frontend uses:
  - `GET /api/admin/dashboard`
  - `GET /api/admin/users`
  - `PATCH /api/admin/users/{id}/enable`
  - `PATCH /api/admin/users/{id}/disable`
  - `GET /api/admin/listings`
  - `PATCH /api/admin/listings/{id}/enable`
  - `PATCH /api/admin/listings/{id}/disable`
  - `DELETE /api/admin/listings/{id}`
  - `GET /api/admin/messages`
  - `PATCH /api/admin/messages/{id}/read`
- Backend visible in `AdminController`:
  - `GET /api/admin/dashboard` (match)
  - `GET /api/admin/users` (match)
  - `GET /api/admin/messages` (match)
  - No listings/admin-toggle/delete/read endpoints visible.

Status: PARTIALLY VERIFIED

## 3. DTO Field Matching Checklist

### Listing form payload (create/edit)
Frontend sends exact listing DTO keys:
- `title`
- `description`
- `price`
- `brand`
- `model`
- `manufactureYear`
- `mileage`
- `fuelType`
- `transmission`
- `bodyType`
- `color`
- `engineSize`
- `horsepower`
- `location`
- `sellerName`
- `sellerPhone`
- `sellerEmail`

Status: PASS against visible listing request DTOs.

### Auth forms
- Login: `email`, `password`
- Register: `name`, `email`, `password`, optional `phoneNumber`

Status: PASS

### Message form
- `carId`, `senderId`, `receiverId`, `message`

Status: PASS

## 4. UI/Data Consistency Checks

Implemented and verified in frontend code:
- Backend-driven data loading for public pages and account/admin sections.
- Route-level auth and role access control.
- Loading, success, and error states in all major workflows.
- Graceful fallback UI:
  - app-level error boundary
  - unauthorized redirect handling
  - missing profile endpoint fallback
- Public listing visibility filtering (`isActive !== false`) to prevent disabled listings from public rendering.
- Backend-safe image URL rendering through URL resolver for relative image paths.

Status: PASS (frontend-side)

## 5. High-Risk Integration Gaps to Confirm in Backend Runtime

Please verify these backend capabilities in your running API environment:
1. `/api/listings/**` controller mappings exist and are active (not just `/api/cars/**`).
2. Image upload endpoint contract:
   - frontend currently uses `POST /api/listings/{id}/images` with multipart `file`.
   - visible backend controller shows `POST /api/cars/{carId}/images` with `imagePath` param.
3. Favorites controller exists for `/api/favorites/**`.
4. Admin action endpoints exist for:
   - user enable/disable
   - listing enable/disable/delete
   - admin message mark-read
5. `/api/users/me` and `/api/users/me` PUT exist if profile editing is required server-side.

## 6. Suggested Final Verification Script (Manual)

1. Login as normal user and verify:
- Browse public listings, view details.
- Create listing, edit listing, upload/delete images.
- Add/remove favorites.
- Send and read listing messages.

2. Login as admin and verify:
- Access `/admin` pages.
- View dashboard stats.
- Enable/disable users/listings and delete listing.
- Read messages and mark as read.

3. Confirm unauthorized behavior:
- Expire/clear token and verify 401 redirects to login and returns to intended route.

4. Confirm image rendering:
- Relative backend paths display correctly in cards, galleries, and listing-management pages.
