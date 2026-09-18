// Dev-only stand-in for the Login API while cargonetlcl's own backend is
// still being built. LoginPage.vue / LoginPageMl2.vue check this flag before
// making the real axios calls in login()/GetUserStatus()/Getloginstatus()/
// Updateloginstatus()/InsertClientLogin() — when it's on, those calls are
// skipped (there's no API to answer them yet) and login() is handed a fake
// "successful login" response shaped exactly like the real API's, so the
// rest of the app (session storage, routing to /IndexPage, everything built
// on top of it) behaves the same as it will once the real API exists.
//
// Flip this to false the moment cargonetlcl's Login API is ready — nothing
// else needs to change, the real axios calls are still there, just skipped
// while this is true.
export const MOCK_LOGIN_MODE = true;

// Mirrors the shape of the real `${Login_API}/Login/Login/` response.
export function buildMockLoginResponse(email) {
  const expires = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString();
  return {
    id: 1,
    userName: email || "devuser",
    userType: "Admin",
    accessCode: `MOCK-${Date.now()}`,
    expires,
  };
}
