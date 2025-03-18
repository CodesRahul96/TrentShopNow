import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Checkout() {
  const { cart, setCart, removeFromCart } = useCart();
  const [token] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!shippingAddress.addressLine1)
      newErrors.addressLine1 = "Address Line 1 is required";
    if (!shippingAddress.city) newErrors.city = "City is required";
    if (!shippingAddress.state) newErrors.state = "State is required";
    if (!shippingAddress.postalCode)
      newErrors.postalCode = "Postal Code is required";
    if (!shippingAddress.country) newErrors.country = "Country is required";
    if (!paymentMethod)
      newErrors.paymentMethod = "Please select a payment method";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/orders`,
        {
          items: cart,
          total,
          shippingAddress,
          paymentMethod,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart([]);
      alert("Order placed successfully!");
      navigate("/");
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  return (
    <div className="container mx-auto p-6 text-text">
      <h1 className="text-4xl font-bold mb-8 text-center text-primary">
        Checkout
      </h1>
      <div className="bg-background rounded-lg p-6 shadow-lg grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Cart Items */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-primary">
            Your Cart
          </h2>
          {cart.length === 0 ? (
            <p className="text-center">Your cart is empty</p>
          ) : (
            <>
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="mb-4 border-b border-gray-200 pb-4 flex justify-between items-center"
                >
                  <div>
                    <p className="text-lg font-medium">{item.name}</p>
                    <p className="text-sm">
                      Quantity: {item.quantity} - ${item.price * item.quantity}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <p className="text-2xl font-bold mt-4">
                Total: $
                {cart
                  .reduce((sum, item) => sum + item.price * item.quantity, 0)
                  .toFixed(2)}
              </p>
            </>
          )}
        </div>

        {/* Shipping and Payment Form */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-primary">
            Shipping & Payment
          </h2>
          <form className="space-y-4">
            {/* Shipping Address */}
            <div>
              <label className="block mb-1">Address Line 1</label>
              <input
                type="text"
                name="addressLine1"
                value={shippingAddress.addressLine1}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded bg-secondary text-text focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              {errors.addressLine1 && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.addressLine1}
                </p>
              )}
            </div>
            <div>
              <label className="block mb-1">Address Line 2 (Optional)</label>
              <input
                type="text"
                name="addressLine2"
                value={shippingAddress.addressLine2}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded bg-secondary text-text focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block mb-1">City</label>
              <input
                type="text"
                name="city"
                value={shippingAddress.city}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded bg-secondary text-text focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              {errors.city && (
                <p className="text-red-500 text-sm mt-1">{errors.city}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  value={shippingAddress.state}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded bg-secondary text-text focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                {errors.state && (
                  <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                )}
              </div>
              <div>
                <label className="block mb-1">Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={shippingAddress.postalCode}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded bg-secondary text-text focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                {errors.postalCode && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.postalCode}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label className="block mb-1">Country</label>
              <input
                type="text"
                name="country"
                value={shippingAddress.country}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded bg-secondary text-text focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              {errors.country && (
                <p className="text-red-500 text-sm mt-1">{errors.country}</p>
              )}
            </div>

            {/* Payment Method */}
            <div>
              <label className="block mb-1">Payment Method</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="credit_card"
                    checked={paymentMethod === "credit_card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-2"
                  />
                  Credit Card
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={paymentMethod === "paypal"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-2"
                  />
                  PayPal
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-2"
                  />
                  Cash on Delivery
                </label>
              </div>
              {errors.paymentMethod && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.paymentMethod}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              className="w-full bg-primary text-white px-8 py-3 rounded-lg hover:bg-accent transition-colors shadow-md mt-6"
            >
              Place Order
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
