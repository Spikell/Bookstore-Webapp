import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, storage } from "./firebase.config";
import { doc, setDoc, onSnapshot, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const CartDB = () => {
  const [user, loading, error] = useAuthState(auth);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (loading) return;
    if (error) {
      console.error("Authentication error:", error);
      return;
    }

    if (user) {
      const handleCartUpdate = async (event) => {
        if (event.detail && event.detail.cart) {
          const localCart = event.detail.cart;
          
          try {
            setCart(localCart);
            
            // Store cart data in Firestore
            const userCartRef = doc(collection(db, "cart data"), user.uid);
            const cartData = localCart.map((item) => ({
              authorName: item.authorName || 'Unknown',
              bookTitle: item.bookTitle,
              category: item.category,
              price: item.price,
              quantity: item.quantity,
              id: item.id,
              imageURL: item.imageURL || ''
            }));
            
            // Use setDoc to completely replace the cart data
            await setDoc(userCartRef, { items: cartData });
            console.log("Cart updated in Firestore");
          } catch (error) {
            console.error("Error updating cart:", error);
          }
        }
      };

      window.addEventListener('cartUpdated', handleCartUpdate);

      // Initial cart sync
      const initialCart = JSON.parse(localStorage.getItem(`cart_${user.uid}`)) || [];
      handleCartUpdate({ detail: { cart: initialCart } });

      const unsubscribe = onSnapshot(
        doc(collection(db, "cart data"), user.uid),
        (doc) => {
          if (doc.exists()) {
            const firebaseCart = doc.data().items;
            console.log("Firestore cart updated:", firebaseCart);
            
            setCart(firebaseCart);
            localStorage.setItem(`cart_${user.uid}`, JSON.stringify(firebaseCart));
            window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart: firebaseCart, userId: user.uid } }));
          } else {
            console.log("No cart document found for user:", user.uid);
            localStorage.setItem(`cart_${user.uid}`, JSON.stringify([]));
            window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart: [], userId: user.uid } }));
          }
        },
        (error) => console.error("Error listening to Firestore cart:", error)
      );

      return () => {
        window.removeEventListener('cartUpdated', handleCartUpdate);
        unsubscribe();
      };
    }
  }, [user, loading, error]);

  return null;
};

export default CartDB;
