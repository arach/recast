import { createAuthClient } from "better-auth/react";
import type { Auth } from "./auth"; // Import the auth type from the server

export const authClient = createAuthClient<Auth>({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3002",
});

export const {
  signIn,
  signOut,
  signUp,
  useSession,
  useUser,
} = authClient;