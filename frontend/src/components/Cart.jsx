import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { cart } = useCart();

  return (
    <div className="fixed right-0 top-0 h-full w-64 bg-white shadow-lg p-4">
      <h2 className="text-xl font-bold">Cart</h2>
      {cart.map(item => (
        <div key={item._id} className="my-2">
          <p>{item.name} x {item.quantity}</p>
          <p>${item.price * item.quantity}</p>
        </div>
      ))}
      <Link to="/checkout" className="mt-4 bg-green-500 text-white px-4 py-2 rounded block text-center">
        Checkout
      </Link>
    </div>
  );
}