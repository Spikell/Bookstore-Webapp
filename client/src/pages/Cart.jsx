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
        const cartData = updatedCart.map(({ imageURL, ...item }) => ({
          authorName: item.authorName,
          bookTitle: item.bookTitle,
          category: item.category,
          price: item.price,
          quantity: item.quantity,
          id: item.id,
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
      toast.success("Item removed from cart");
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
    <div className="mt-20 px-4 lg:px-16 xl:px-24 mb-16 max-w-screen-2xl mx-auto">
      <Toaster position="top-center" reverseOrder={false} />
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-blue-700">
        Your Shopping Cart
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : !user ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg shadow-md border border-gray-200">
          <FaExclamationCircle className="mx-auto text-yellow-500 text-5xl mb-4" />
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">
            Please log in to view your cart
          </h3>
          <Link
            to="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 inline-flex items-center font-medium"
          >
            <FaShoppingBag className="mr-2" /> Go to Login
          </Link>
        </div>
      ) : cartItems.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg shadow-md border border-gray-200">
          <FaShoppingCart className="mx-auto text-gray-300 text-7xl mb-6" />
          <h3 className="text-2xl font-semibold text-gray-700 mb-5">
            Your cart is empty
          </h3>
          <Link
            to="/shop"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-300 inline-flex items-center font-medium text-lg"
          >
            <FaShoppingBag className="mr-2" /> Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              <div className="p-5 bg-indigo-300 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">
                  Cart Items ({cartItems.length})
                </h3>
                <button
                  onClick={clearCart}
                  className="text-red-500 hover:text-red-700 flex items-center transition duration-200 bg-white py-1.5 px-3 rounded-md border border-red-200 hover:bg-red-50"
                >
                  <FaTrash className="mr-2" /> Clear All
                </button>
              </div>
              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-5 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <div className="w-24 h-32 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
                      <img
                        src={item.imageURL}
                        alt={item.bookTitle}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-xl font-semibold text-gray-800 mb-1 flex items-center">
                        {item.bookTitle}
                      </h4>
                      <p className="text-md text-gray-600 mb-1 flex items-center">
                        <FaUser className="mr-2 text-gray-500" size={14} />
                        <span>{item.authorName}</span>
                      </p>
                      <p className="text-sm text-blue-600 font-medium px-2 py-0.5 bg-blue-50 rounded-full inline-flex items-center">
                        <FaTag className="mr-1 text-blue-500" size={12} />
                        {item.category}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4 sm:gap-6 mt-4 sm:mt-0">
                      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                        <button
                          onClick={() => decrementQuantity(item.id)}
                          className="px-3 py-2.5 w-12 h-10 flex items-center justify-center hover:bg-gray-200 hover:text-red-600 active:bg-gray-300 transition-all duration-200 ease-in-out"
                          aria-label="Decrease quantity"
                        >
                          <FaMinus size={12} />
                        </button>
                        <span className="px-4 py-1.5 font-medium min-w-[40px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => incrementQuantity(item.id)}
                          className="px-3 py-2.5 w-12 h-10 flex items-center justify-center hover:bg-gray-200 hover:text-green-600 active:bg-gray-300 transition-all duration-200 ease-in-out"
                          aria-label="Increase quantity"
                        >
                          <FaPlus size={12} />
                        </button>
                      </div>
                      <p className="text-xl font-bold text-green-600 min-w-[80px] text-center">
                        ${parseFloat(item.price).toFixed(2)}
                      </p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 flex items-center justify-center transition duration-200 p-2 rounded-full hover:bg-red-100 w-10 h-10"
                        aria-label="Remove item"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-28 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-5 pb-4 border-b border-gray-200 flex items-center">
                <FaReceipt className="mr-2 text-blue-600" size={18} />
                Order Summary
              </h3>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center">
                    <FaShoppingCart className="mr-2 text-gray-500" size={14} />
                    Subtotal
                  </span>
                  <span className="font-medium text-lg">
                    ${calculateSubtotal().toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center">
                    <FaPercentage className="mr-2 text-gray-500" size={14} />
                    Tax (10%)
                  </span>
                  <span className="font-medium text-lg">
                    ${(calculateSubtotal() * 0.1).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center">
                    <FaTruck className="mr-2 text-gray-500" size={14} />
                    Shipping
                  </span>
                  <span className="font-medium text-lg">$5.00</span>
                </div>
                <div className="pt-4 mt-2 border-t border-gray-200 flex justify-between items-center">
                  <span className="text-lg font-semibold flex items-center">
                    <FaMoneyCheckAlt className="mr-2 text-blue-600" size={16} />
                    Total
                  </span>
                  <span className="text-2xl font-bold text-blue-700">
                    ${(calculateSubtotal() * 1.1 + 5).toFixed(2)}
                  </span>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-blue-600 text-white py-3.5 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center font-semibold text-lg shadow-sm"
              >
                <FaCreditCard className="mr-2" /> Proceed to Checkout
              </button>
              <Link
                to="/shop"
                className="w-full mt-4 bg-gray-100 text-gray-800 py-3 rounded-lg hover:bg-gray-200 transition duration-300 flex items-center justify-center border border-gray-300"
              >
                <FaArrowLeft className="mr-2" /> Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
