import { getAuth } from "firebase/auth";

export function isAuthenticated() {
    const auth = getAuth();
    return auth.currentUser !== null;
}