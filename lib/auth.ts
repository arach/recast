import { betterAuth } from "better-auth";
import Database from "better-sqlite3";

// Create database instance
const db = new Database("./recast-auth.db");

// Server-only auth configuration
export const auth = betterAuth({
  database: db,
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3002",
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  user: {
    additionalFields: {
      openaiApiKey: {
        type: "string",
        required: false,
      },
    },
  },
});

export type Auth = typeof auth;