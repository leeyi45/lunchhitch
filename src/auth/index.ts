import { User } from "@firebase/auth";

export const DEFAULT_DOMAIN = 'lunchhitch.firebaseapp.com';

export function extractUsername(user: User) {
  return user.email!.split('@')[0];
}