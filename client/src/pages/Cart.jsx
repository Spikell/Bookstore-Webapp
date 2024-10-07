import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../Firebase/AuthProvider';
import { db } from '../Firebase/firebase.config';
import { doc, setDoc, collection, writeBatch } from 'firebase/firestore';
import toast from 'react-hot-toast';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const { user, loading } = useContext(AuthContext);
  const pendingUpdatesRef = useRef([]);
  const updateTimeoutRef = useRef(null);
  const BATCH_INTERVAL = 1000; // 1 second interval for batching updates

  useEffect(() => {
    if (!loading && user) {
      loadCart();
      window.addEventListener('cartUpdated', handleCartUpdate);
      return () => window.removeEventListener('cartUpdated', handleCartUpdate);
    }
  }, [user, loading]);

  const loadCart = () => {
    const storedCart = JSON.parse(localStorage.getItem(`cart_${user.uid}`)) || [];
    setCartItems(storedCart);
  };

  const handleCartUpdate = (event) => {
    if (event.detail && event.detail.userId === user.uid) {
      setCartItems(event.detail.cart);
    }
  };

  const updateFirestoreCart = async (updatedCart) => {
    if (user) {
      const batch = writeBatch(db);
      const userCartRef = doc(collection(db, "cart data"), user.uid);
      
      try {
        const cartData = updatedCart.map(({ imageURL, ...item }) => ({
          authorName: item.authorName,
          bookTitle: item.bookTitle,
          category: item.category,
          price: item.price,
          quantity: item.quantity,
          id: item.id
        }));
        
        batch.set(userCartRef, { items: cartData }, { merge: true });
        await batch.commit();
        console.log("Cart updated in Firestore");
      } catch (error) {
        console.error("Error updating cart in Firestore:", error);
        loadCart(); // Reload cart from local storage on error
      }
    }
  };

  const processPendingUpdates = useCallback(() => {
    if (pendingUpdatesRef.current.length > 0) {
      const updatedCart = pendingUpdatesRef.current.reduce((acc, update) => {
        if (update.removed) {
          return acc.filter(item => item.id !== update.id);
        }
        const existingItemIndex = acc.findIndex(item => item.id === update.id);
        if (existingItemIndex !== -1) {
          acc[existingItemIndex] = { ...acc[existingItemIndex], ...update };
        }
        return acc;
      }, [...cartItems]);

      setCartItems(updatedCart);
      localStorage.setItem(`cart_${user.uid}`, JSON.stringify(updatedCart));
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart: updatedCart, userId: user.uid } }));
      updateFirestoreCart(updatedCart);
      pendingUpdatesRef.current = [];
    }
  }, [cartItems, user]);

  const queueUpdate = useCallback((itemId, changes) => {
    pendingUpdatesRef.current.push({ id: itemId, ...changes });
    
    // Update local state immediately
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId ? { ...item, ...changes } : item
      )
    );

    // Clear existing timeout and set a new one
    if (updateTimeoutRef.current) clearTimeout(updateTimeoutRef.current);
    updateTimeoutRef.current = setTimeout(processPendingUpdates, BATCH_INTERVAL);
  }, [processPendingUpdates]);

  const removeItem = useCallback((itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    queueUpdate(itemId, { removed: true });
    toast.success('Item removed from cart');
  }, [queueUpdate]);

  const updateQuantity = useCallback((itemId, change) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId 
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
    queueUpdate(itemId, { quantity: Math.max(1, cartItems.find(item => item.id === itemId).quantity + change) });
    toast.success('Cart updated');
  }, [cartItems, queueUpdate]);

  useEffect(() => {
    const newTotal = cartItems.reduce((sum, item) => {
      const itemPrice = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
      return sum + itemPrice * item.quantity;
    }, 0);
    setTotal(newTotal);
  }, [cartItems]);

  return (
    <div className="container mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-6 text-center mt-10">Your Cart</h2>
      {loading ? (
        <p className="text-xl text-gray-600 text-center mt-40">Loading...</p>
      ) : !user ? (
        <div className="flex flex-col items-center justify-center h-screen pb-24">
          <div className="text-center">
            <p className="text-xl text-gray-600 mb-4">Please log in to use the cart functionality</p>
            <Link to="/login" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-block">
              Log In
            </Link>
          </div>
        </div>
      ) : cartItems.length === 0 ? (
        <p className="text-xl text-gray-600 text-center mt-40">Your cart is empty</p>
      ) : (
        <>
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-teal-400 to-teal-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {cartItems.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img src={item.imageURL} alt={item.bookTitle} className="h-20 w-16 object-cover mr-4 rounded" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.bookTitle}</div>
                          <div className="text-sm text-gray-500">{item.authorName}</div>
                          <div className="text-xs text-gray-400">{item.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-green-600">
                        ${typeof item.price === 'number' ? item.price.toFixed(2) : parseFloat(item.price).toFixed(2) || '0.00'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="text-white bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded-l transition duration-200"
                          disabled={item.quantity <= 1}
                        >
                          <FaMinus />
                        </button>
                        <span className="mx-3 w-8 text-center bg-gray-100 py-1">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="text-white bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded-r transition duration-200"
                        >
                          <FaPlus />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm font-medium text-green-600">
                        ${((typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0) * item.quantity).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-white bg-red-500 hover:bg-red-600 p-2 rounded transition duration-200"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-8 flex justify-end">
            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="font-bold">${total.toFixed(2)}</span>
                </div>
              </div>
              <button className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}
      <style jsx="true" global="true">{`
        /* Chrome, Safari, Edge, Opera */
        input[type=number].no-spinner::-webkit-inner-spin-button,
        input[type=number].no-spinner::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        /* Firefox */
        input[type=number].no-spinner {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
}

export default Cart;