// src/clerkConfig.ts
import { ClerkProvider } from "@clerk/clerk-react";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}
console.log(PUBLISHABLE_KEY)
export { ClerkProvider, PUBLISHABLE_KEY };
