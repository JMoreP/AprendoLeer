// ── Firebase config ──────────────────
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, collection, query, orderBy, getDocs, limit } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCneXGfTtG1Rz7g-OoY8tmVSBgby3OEZTg",
  authDomain: "videojuego-91d44.firebaseapp.com",
  projectId: "videojuego-91d44",
  storageBucket: "videojuego-91d44.firebasestorage.app",
  messagingSenderId: "558401326866",
  appId: "1:558401326866:web:84a201e6acd0ec4061adcb",
  measurementId: "G-3CLJ72R8TD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
export const auth = getAuth(app);
export const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();

// ── Auth Functions ────────────────────────────────────────────────────────────
export const registerParent = async (email, password) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const loginParent = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const loginWithGoogle = async () => {
  return await signInWithPopup(auth, googleProvider);
};

export const logoutParent = async () => {
  return await signOut(auth);
};

// ── Metrics Functions ─────────────────────────────────────────────────────────
export const getTodayDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const saveDailyMetrics = async (uid, childName, metrics) => {
  if (!uid || !childName) return;
  const dateStr = getTodayDateString();
  const docRef = doc(db, 'users', uid, 'children', childName, 'metrics', dateStr);
  await setDoc(docRef, metrics, { merge: true });
};

export const getRecentMetrics = async (uid, childName, days = 7) => {
  if (!uid || !childName) return [];
  const metricsRef = collection(db, 'users', uid, 'children', childName, 'metrics');
  try {
    const querySnapshot = await getDocs(metricsRef);
    const results = [];
    querySnapshot.forEach((doc) => {
      results.push({ date: doc.id, ...doc.data() });
    });
    results.sort((a, b) => b.date.localeCompare(a.date));
    return results.slice(0, days);
  } catch (error) {
    console.error("Firestore Error en getRecentMetrics:", error);
    throw error;
  }
};

// ── Profile Functions ────────────────────────────────────────────────────────
export const saveChildProfile = async (uid, childName, profileData) => {
  if (!uid || !childName) return;
  const docRef = doc(db, 'users', uid, 'profiles', childName);
  await setDoc(docRef, { ...profileData, name: childName }, { merge: true });
};

export const getChildrenProfiles = async (uid) => {
  if (!uid) return [];
  const profilesRef = collection(db, 'users', uid, 'profiles');
  const snap = await getDocs(profilesRef);
  return snap.docs.map(d => d.data());
};

export const deleteChildProfile = async (uid, childName) => {
  if (!uid || !childName) return;
  // Note: deleting subcollections in Firestore requires manual iteration or a cloud function.
  // For now, we just delete the main profile doc.
  const docRef = doc(db, 'users', uid, 'profiles', childName);
  // Optional: deleteDoc(docRef)
};

// ── Game Progress Functions ──────────────────────────────────────────────────
export const saveGameProgress = async (uid, childName, data) => {
  if (!uid || !childName) return;
  const docRef = doc(db, 'users', uid, 'children', childName, 'gameData', 'progress');
  await setDoc(docRef, data, { merge: true });
};

export const getGameProgress = async (uid, childName) => {
  if (!uid || !childName) return null;
  const docRef = doc(db, 'users', uid, 'children', childName, 'gameData', 'progress');
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};
