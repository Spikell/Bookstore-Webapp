import React, { createContext, useEffect, useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { app, db } from "../Firebase/firebase.config";
import { signOut, deleteUser as deleteAuthUser } from "firebase/auth";
import { doc, deleteDoc } from "firebase/firestore";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    setLoading(true);
    return signOut(auth);
  };

  const loginWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const deleteAccount = async () => {
    const currentUser = auth.currentUser || user;
    if (!currentUser) {
      throw new Error("No authenticated user found.");
    }
    
    setLoading(true);
    try {
      // 1. Try to delete cart data from Firestore
      try {
        await deleteDoc(doc(db, "cart data", currentUser.uid));
        console.log("Firestore cart data deleted successfully.");
      } catch (dbError) {
        console.error("Warning: Could not delete cart data from Firestore (possibly due to security rules):", dbError);
        // We continue because the user's primary intent is deleting their Auth account.
      }
      
      // Clear local storage for this user's cart
      localStorage.removeItem(`cart_${currentUser.uid}`);
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart: [], userId: currentUser.uid } }));
      
      // 2. Delete user account from Firebase
      await deleteAuthUser(currentUser);
      setUser(null);
      console.log("Firebase Auth account completely deleted.");
    } catch (error) {
      console.error("Error deleting account:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      // Add a delay before setting loading to false
      setTimeout(() => {
        setLoading(false);
      }, 250); // 1 second delay
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    loading,
    createUser,
    loginWithGoogle,
    login,
    logout,
    deleteAccount,
  };

  if (loading) {
    return (
      <div className="loading-dots">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <style>{`
          .loading-dots {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }
          .dot {
            width: 10px;
            height: 10px;
            background-color: #333;
            border-radius: 50%;
            margin: 0 5px;
            animation: bounce 1.4s infinite ease-in-out both;
          }
          .dot:nth-child(1) { animation-delay: -0.32s; }
          .dot:nth-child(2) { animation-delay: -0.16s; }
          @keyframes bounce {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};
