import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from "react";
import {
  FaPlus,
  FaMinus,
  FaTrash,
  FaShoppingCart,
  FaArrowLeft,
  FaCreditCard,
  FaMoneyBill,
  FaShoppingBag,
  FaExclamationCircle,
  FaUser,
  FaTag,
  FaBook,
  FaReceipt,
  FaPercentage,
  FaTruck,
  FaMoneyCheckAlt,
  FaShieldAlt,
} from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../Firebase/AuthProvider";
import { db } from "../Firebase/firebase.config";
import { doc, setDoc, collection, writeBatch } from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";

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
      window.addEventListener("cartUpdated", handleCartUpdate);
      return () => window.removeEventListener("cartUpdated", handleCartUpdate);
    }
  }, [user, loading]);

  const loadCart = () => {
    const storedCart =
      JSON.parse(localStorage.getItem(`cart_${user.uid}`)) || [];
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
        const cartData = updatedCart.map((item) => ({
          authorName: item.authorName || 'Unknown',
          bookTitle: item.bookTitle,
          category: item.category,
          price: item.price,
          quantity: item.quantity,
          id: item.id,
          imageURL: item.imageURL || ''
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
      const updatedCart = pendingUpdatesRef.current.reduce(
        (acc, update) => {
          if (update.removed) {
            return acc.filter((item) => item.id !== update.id);
          }
          const existingItemIndex = acc.findIndex(
            (item) => item.id === update.id
          );
          if (existingItemIndex !== -1) {
            acc[existingItemIndex] = { ...acc[existingItemIndex], ...update };
          }
          return acc;
        },
        [...cartItems]
      );

      setCartItems(updatedCart);
      localStorage.setItem(`cart_${user.uid}`, JSON.stringify(updatedCart));
      window.dispatchEvent(
        new CustomEvent("cartUpdated", {
          detail: { cart: updatedCart, userId: user.uid },
        })
      );
      updateFirestoreCart(updatedCart);
      pendingUpdatesRef.current = [];
    }
  }, [cartItems, user]);

  const queueUpdate = useCallback(
    (itemId, changes) => {
      pendingUpdatesRef.current.push({ id: itemId, ...changes });

      // Update local state immediately
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, ...changes } : item
        )
      );

      // Clear existing timeout and set a new one
      if (updateTimeoutRef.current) clearTimeout(updateTimeoutRef.current);
      updateTimeoutRef.current = setTimeout(
        processPendingUpdates,
        BATCH_INTERVAL
      );
    },
    [processPendingUpdates]
  );

  const removeItem = useCallback(
    (itemId) => {
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.id !== itemId)
      );
      queueUpdate(itemId, { removed: true });
      toast.success("Item removed from cart", { 
        position: "bottom-center",
        style: { marginBottom: '30px' }
      });
    },
    [queueUpdate]
  );

  const clearCart = useCallback(() => {
    if (user) {
      setCartItems([]);
      localStorage.setItem(`cart_${user.uid}`, JSON.stringify([]));
      window.dispatchEvent(
        new CustomEvent("cartUpdated", {
          detail: { cart: [], userId: user.uid },
        })
      );
      updateFirestoreCart([]);
      toast.success("Cart cleared successfully");
    }
  }, [user]);

  const incrementQuantity = useCallback(
    (itemId) => {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
      queueUpdate(itemId, {
        quantity: cartItems.find((item) => item.id === itemId).quantity + 1,
      });
    },
    [cartItems, queueUpdate]
  );

  const decrementQuantity = useCallback(
    (itemId) => {
      const item = cartItems.find((item) => item.id === itemId);
      if (item && item.quantity > 1) {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item
          )
        );
        queueUpdate(itemId, { quantity: item.quantity - 1 });
      }
    },
    [cartItems, queueUpdate]
  );

  const calculateSubtotal = useCallback(() => {
    return cartItems.reduce((sum, item) => {
      const itemPrice =
        typeof item.price === "number"
          ? item.price
          : parseFloat(item.price) || 0;
      return sum + itemPrice * item.quantity;
    }, 0);
  }, [cartItems]);

  const handleCheckout = useCallback(() => {
    toast.success("Checkout functionality will be implemented soon!");
    // Future implementation for checkout process
  }, []);

  useEffect(() => {
    const newTotal = calculateSubtotal();
    setTotal(newTotal);
  }, [cartItems, calculateSubtotal]);

  return (
    <div className="mt-28 px-4 lg:px-8 xl:px-12 mb-12 max-w-screen-xl mx-auto">
      <Toaster position="top-center" reverseOrder={false} />

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : !user ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
          <FaExclamationCircle className="mx-auto text-yellow-500 text-4xl mb-3" />
          <h3 className="text-xl font-semibold text-gray-700 mb-3">
            Please log in to view your cart
          </h3>
          <Link
            to="/login"
            className="bg-blue-600 text-white px-5 py-2.5 rounded hover:bg-blue-700 transition duration-300 inline-flex items-center font-medium"
          >
            <FaShoppingBag className="mr-2" /> Go to Login
          </Link>
        </div>
      ) : cartItems.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
          <FaShoppingCart className="mx-auto text-gray-300 text-6xl mb-5" />
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Your cart is empty
          </h3>
          <Link
            to="/shop"
            className="bg-blue-600 text-white px-6 py-2.5 rounded-md hover:bg-blue-700 transition duration-300 inline-flex items-center font-medium text-base"
          >
            <FaShoppingBag className="mr-2" /> Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              <div className="p-3 bg-indigo-50 border-b border-gray-200 flex justify-between items-center px-5">
                <h3 className="text-lg font-semibold text-gray-800">
                  Cart Items ({cartItems.length})
                </h3>
                <button
                  onClick={clearCart}
                  className="text-red-500 hover:text-red-700 flex items-center transition duration-200 bg-white py-1 px-2.5 rounded text-sm border border-red-200 hover:bg-red-50"
                >
                  <FaTrash className="mr-1.5" size={12} /> Clear All
                </button>
              </div>
              <div className="divide-y divide-gray-100">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <div className="w-16 h-24 flex-shrink-0 bg-gray-100 rounded overflow-hidden border border-gray-200">
                      <img
                        src={item.imageURL}
                        alt={item.bookTitle}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-lg font-semibold text-gray-800 mb-0.5 leading-tight">
                        {item.bookTitle}
                      </h4>
                      <p className="text-sm text-gray-600 mb-1 flex items-center">
                        <FaUser className="mr-1.5 text-gray-400" size={12} />
                        <span className="truncate max-w-[200px]">{item.authorName}</span>
                      </p>
                      <p className="text-xs text-blue-600 font-medium px-2 py-0.5 bg-blue-50 rounded-full inline-flex items-center">
                        <FaTag className="mr-1 text-blue-400" size={10} />
                        {item.category}
                      </p>
                    </div>
                    <div className="flex flex-row items-center gap-4 mt-3 sm:mt-0 sm:ml-auto w-full sm:w-auto justify-between sm:justify-end">
                      <div className="flex items-center border border-gray-300 rounded overflow-hidden shadow-sm">
                        <button
                          onClick={() => decrementQuantity(item.id)}
                          className="w-8 h-8 flex items-center justify-center bg-gray-50 hover:bg-gray-200 hover:text-red-600 active:bg-gray-300 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <FaMinus size={10} />
                        </button>
                        <span className="w-8 flex items-center justify-center font-medium text-sm font-mono">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => incrementQuantity(item.id)}
                          className="w-8 h-8 flex items-center justify-center bg-gray-50 hover:bg-gray-200 hover:text-green-600 active:bg-gray-300 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <FaPlus size={10} />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="text-lg font-bold text-green-600 min-w-[70px] text-right">
                          ${parseFloat(item.price).toFixed(2)}
                        </p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-600 flex items-center justify-center transition-colors p-1.5 rounded-full hover:bg-red-50"
                          aria-label="Remove item"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-white rounded-lg shadow-sm p-5 sticky top-24 border border-gray-200 text-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-100 flex items-center">
                <FaReceipt className="mr-2 text-blue-600" size={16} />
                Order Summary
              </h3>
              <div className="space-y-3 mb-5">
                <div className="flex justify-between items-center text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-800">
                    ${calculateSubtotal().toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                  <span>Tax (10%)</span>
                  <span className="font-medium text-gray-800">
                    ${(calculateSubtotal() * 0.1).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium text-gray-800">$5.00</span>
                </div>
                <div className="pt-3 mt-2 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-base font-semibold text-gray-800">
                    Total
                  </span>
                  <span className="text-xl font-bold text-blue-700">
                    ${(calculateSubtotal() * 1.1 + 5).toFixed(2)}
                  </span>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-blue-600 text-white py-2.5 rounded-md hover:bg-blue-700 transition duration-300 flex items-center justify-center font-medium text-base shadow-sm"
              >
                <FaCreditCard className="mr-2" size={14} /> Checkout
              </button>
              <Link
                to="/shop"
                className="w-full mt-3 bg-white text-gray-600 py-2.5 rounded-md hover:bg-gray-50 hover:text-gray-800 transition duration-300 flex items-center justify-center border border-gray-300 text-sm font-medium"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
