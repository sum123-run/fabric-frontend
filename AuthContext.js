import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch extra profile data from Firestore
        const docRef  = doc(db, "users", firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        setUser({ ...firebaseUser, ...(docSnap.exists() ? docSnap.data() : {}) });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // ── Email/Password Sign Up ──
  const signUp = async (name, email, password) => {
    const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(newUser, { displayName: name });
    await setDoc(doc(db, "users", newUser.uid), {
      uid:       newUser.uid,
      name,
      email,
      photoURL:  null,
      provider:  "email",
      createdAt: new Date().toISOString(),
    });
    return newUser;
  };

  // ── Email/Password Login ──
  const logIn = async (email, password) => {
    const { user: loggedUser } = await signInWithEmailAndPassword(auth, email, password);
    return loggedUser;
  };

  // ── Google Sign In ──
  const signInWithGoogle = async (idToken) => {
    const { GoogleAuthProvider, signInWithCredential } = await import("firebase/auth");
    const credential = GoogleAuthProvider.credential(idToken);
    const { user: googleUser } = await signInWithCredential(auth, credential);

    // Save to Firestore if first time
    const docRef  = doc(db, "users", googleUser.uid);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      await setDoc(docRef, {
        uid:       googleUser.uid,
        name:      googleUser.displayName,
        email:     googleUser.email,
        photoURL:  googleUser.photoURL,
        provider:  "google",
        createdAt: new Date().toISOString(),
      });
    }
    return googleUser;
  };

  // ── Logout ──
  const logOut = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, loading, signUp, logIn, signInWithGoogle, logOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
