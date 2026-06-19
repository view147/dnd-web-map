// auth.ts
// ============================================================
// ระบบ Login / Logout
// ============================================================

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export type UserRole = "gm" | "player";

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  characterId?: string; // player เลือกตัวละครไหน
  displayName?: string;
}

/* ============================================================
   Login
   ============================================================ */

export async function login(
  email: string,
  password: string
): Promise<UserProfile> {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const profile = await getUserProfile(cred.user.uid);
  if (!profile) throw new Error("ไม่พบข้อมูลผู้ใช้ กรุณาติดต่อ GM");
  return profile;
}

/* ============================================================
   Register (GM ใช้สร้าง account ผู้เล่น)
   ============================================================ */

export async function registerPlayer(
  email: string,
  password: string,
  displayName: string,
  characterId: string
): Promise<UserProfile> {
  const cred = await createUserWithEmailAndPassword(auth, email, password);

  const profile: UserProfile = {
    uid: cred.user.uid,
    email,
    role: "player",
    characterId,
    displayName,
  };

  await setDoc(doc(db, "users", cred.user.uid), profile);
  return profile;
}

export async function registerGM(
  email: string,
  password: string
): Promise<UserProfile> {
  const cred = await createUserWithEmailAndPassword(auth, email, password);

  const profile: UserProfile = {
    uid: cred.user.uid,
    email,
    role: "gm",
    displayName: "GM",
  };

  await setDoc(doc(db, "users", cred.user.uid), profile);
  return profile;
}

/* ============================================================
   Logout
   ============================================================ */

export async function logout() {
  await signOut(auth);
}

/* ============================================================
   Get Profile
   ============================================================ */

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

/* ============================================================
   Watch Auth State
   ============================================================ */

export function onAuthChanged(
  callback: (user: User | null, profile: UserProfile | null) => void
) {
  return onAuthStateChanged(auth, async (user) => {
    if (!user) { callback(null, null); return; }
    const profile = await getUserProfile(user.uid);
    callback(user, profile);
  });
}
