// db.ts
// ============================================================
// อ่าน/เขียน Firestore
// GM เขียน → ผู้เล่นทุกคนเห็นพร้อมกันทันที (realtime)
// ============================================================

import {
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  updateDoc,
  Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";
import { GameState } from "./engine/game_state";

const GAME_DOC = "games/session_1";

/* ============================================================
   Save Game State (GM เรียกทุกครั้งที่ state เปลี่ยน)
   ============================================================ */

export async function saveGameState(state: GameState): Promise<void> {
  await setDoc(doc(db, GAME_DOC), {
    state: JSON.stringify(state),
    updatedAt: Date.now(),
  });
}

/* ============================================================
   Load Game State (โหลดครั้งแรก)
   ============================================================ */

export async function loadGameState(): Promise<GameState | null> {
  const snap = await getDoc(doc(db, GAME_DOC));
  if (!snap.exists()) return null;
  const data = snap.data();
  return JSON.parse(data.state) as GameState;
}

/* ============================================================
   Watch Game State (realtime — ผู้เล่นทุกคนใช้)
   GM กด action → Firestore อัพเดท → ทุกคนเห็นพร้อมกัน
   ============================================================ */

export function watchGameState(
  callback: (state: GameState) => void
): Unsubscribe {
  return onSnapshot(doc(db, GAME_DOC), (snap) => {
    if (!snap.exists()) return;
    const data = snap.data();
    const state = JSON.parse(data.state) as GameState;
    callback(state);
  });
}

/* ============================================================
   Save / Load Player Note (ผู้เล่นจดโน้ตส่วนตัว)
   ============================================================ */

export async function savePlayerNote(
  playerId: string,
  note: string
): Promise<void> {
  await setDoc(
    doc(db, `player_notes/${playerId}`),
    { note, updatedAt: Date.now() },
    { merge: true }
  );
}

export async function loadPlayerNote(playerId: string): Promise<string> {
  const snap = await getDoc(doc(db, `player_notes/${playerId}`));
  return snap.exists() ? snap.data().note ?? "" : "";
}
