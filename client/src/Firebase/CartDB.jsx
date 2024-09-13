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
            // Upload images to Firebase Storage
            const cartWithUploadedImages = await Promise.all(localCart.map(async (item) => {
              if (item.imageURL && item.imageURL.startsWith('data:image')) {
                const imageRef = ref(storage, `cart_images/${user.uid}/${item.id}`);
                const response = await fetch(item.imageURL);
                const blob = await response.blob();
                await uploadBytes(imageRef, blob);
                const downloadURL = await getDownloadURL(imageRef);
                return { ...item, imageURL: downloadURL };
              }
              return item;
            }));

            setCart(cartWithUploadedImages);
            
            // Store cart data in Firestore (without imageURL)
            const userCartRef = doc(collection(db, "cart data"), user.uid);
            const cartData = cartWithUploadedImages.map(({ imageURL, ...item }) => ({
              authorName: item.authorName,
              bookTitle: item.bookTitle,
              category: item.category,
              price: item.price,
              quantity: item.quantity,
              id: item.id
            }));
            await setDoc(userCartRef, { items: cartData }, { merge: true });
            console.log("Cart updated in Firestore");
          } catch (error) {
            console.error("Error updating cart:", error);
            // You can add more specific error handling here, e.g., showing a user-friendly error message
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
            // Fetch image URLs from Storage and add them back to the cart items
            Promise.all(firebaseCart.map(async (item) => {
              const imageRef = ref(storage, `cart_images/${user.uid}/${item.id}`);
              try {
                const imageURL = await getDownloadURL(imageRef);
                return { ...item, imageURL };
              } catch (error) {
                console.error("Error fetching image URL:", error);
                // Return the item without modifying the imageURL if fetching fails
                return item;
              }
            })).then((cartWithImages) => {
              setCart(cartWithImages);
              localStorage.setItem(`cart_${user.uid}`, JSON.stringify(cartWithImages));
              window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart: cartWithImages, userId: user.uid } }));
            });
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
