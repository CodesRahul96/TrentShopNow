
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Checkout() {
  const { cart, setCart } = useCart();
  const [token] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/orders',  {
        items: cart,
        total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart([]);
      alert('Order placed successfully!');
      navigate('/');
    } catch (error) {
      console.error('Checkout failed:', error);
      navigate('/login');
    }
  };

  return (
    <div className="container mx-auto p-6 text-text">
      <h1 className="text-4xl font-bold mb-8 text-center text-primary">Checkout</h1>
      <div className="bg-background rounded-lg p-6 shadow-lg">
        {cart.map(item => (
          <div key={item._id} className="mb-4 border-b border-gray-200 pb-4">
            <p className="text-lg">{item.name} x {item.quantity} - ${item.price * item.quantity}</p>
          </div>
        ))}
        <p className="text-2xl font-bold mt-4">
          Total: ${cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}
        </p>
        <button
          onClick={handleCheckout}
          className="mt-6 bg-primary text-white px-8 py-3 rounded-lg hover:bg-accent transition-colors shadow-md w-full md:w-auto"
        >
          Place Order
        </button>
      </div>
    </div>
  );
}