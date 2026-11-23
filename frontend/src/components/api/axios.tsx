// frontend/src/components/api/axios.tsx
// DEPRECATED wrapper kept for backward compatibility.
// This used to be a bare axios.create() instance WITHOUT the JWT
// interceptors, which caused 401 "Authentication credentials were not
// provided" on every page using it (dashboard, index, signIn).
//
// It now re-exports the single intercepted instance from ./api,
// so all requests share the same token injection + auto-refresh.
import api from "./api";

export default api;
