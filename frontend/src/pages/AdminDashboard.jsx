import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', image: '', stock: '', category: '' });
  const [editProduct, setEditProduct] = useState(null);
  const [activeSection, setActiveSection] = useState('addProduct');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const sidebarItems = [
    { id: 'addProduct', label: 'Add Product' },
    { id: 'manageProducts', label: 'Manage Products' },
    { id: 'manageUsers', label: 'Manage Users' },
    { id: 'manageOrders', label: 'Manage Orders' },
  ];

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    const decoded = decodeToken(token);
    if (decoded.role !== 'admin') {
      navigate('/');
      return;
    }
    const fetchData = async () => {
      try {
        const [productsRes, usersRes, ordersRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BASE_URL}/api/admin/users`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${import.meta.env.VITE_BASE_URL}/api/admin/products`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${import.meta.env.VITE_BASE_URL}/api/admin/orders`, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setProducts(productsRes.data);
        setUsers(usersRes.data);
        setOrders(ordersRes.data);
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
        if (error.response?.status === 403 || error.response?.status === 401) navigate('/login');
      }
    };
    fetchData();
  }, [navigate, token]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/admin/products`, newProduct, { headers: { Authorization: `Bearer ${token}` } });
      setProducts([...products, res.data]);
      setNewProduct({ name: '', price: '', description: '', image: '', stock: '', category: '' });
    } catch (error) {
      console.error('Failed to add product:', error);
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${import.meta.env.VITE_BASE_URL}/api/admin/products/${editProduct._id}`, editProduct, { headers: { Authorization: `Bearer ${token}` } });
      setProducts(products.map(p => p._id === editProduct._id ? res.data : p));
      setEditProduct(null);
    } catch (error) {
      console.error('Failed to update product:', error);
    }
  };

  const handleDeleteProduct = async (id) => {
    await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/admin/products/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    setProducts(products.filter(p => p._id !== id));
  };

  const handleUpdateRole = async (id, role) => {
    const res = await axios.put(`${import.meta.env.VITE_BASE_URL}/api/admin/users/${id}`, { role }, { headers: { Authorization: `Bearer ${token}` } });
    setUsers(users.map(u => u._id === id ? res.data : u));
  };

  const handleUpdateOrderStatus = async (id, status) => {
    try {
      const res = await axios.put(`${import.meta.env.VITE_BASE_URL}/api/admin/orders/${id}`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      setOrders(orders.map(o => o._id === id ? res.data : o));
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-dark-bg">
      <Sidebar items={sidebarItems} activeItem={activeSection} setActiveItem={setActiveSection} />
      <div className="flex-1 p-6 ml-64 min-h-screen pt-20">
        <h1 className="text-4xl font-bold text-light-text mb-8 text-center">Admin Dashboard</h1>

        {activeSection === 'addProduct' && (
          <section className="glass-effect p-6 rounded-lg shadow-glass hover-effect">
            <h2 className="text-2xl font-semibold text-yellow-accent mb-4">Add Product</h2>
            <form onSubmit={handleAddProduct} className="space-y-4 max-w-lg mx-auto">
              <input className="w-full p-3 glass-effect text-light-text placeholder-light-text/70 rounded focus:outline-none focus:ring-2 focus:ring-yellow-accent" placeholder="Name" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
              <input className="w-full p-3 glass-effect text-light-text placeholder-light-text/70 rounded focus:outline-none focus:ring-2 focus:ring-yellow-accent" placeholder="Price" type="number" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
              <input className="w-full p-3 glass-effect text-light-text placeholder-light-text/70 rounded focus:outline-none focus:ring-2 focus:ring-yellow-accent" placeholder="Description" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
              <input className="w-full p-3 glass-effect text-light-text placeholder-light-text/70 rounded focus:outline-none focus:ring-2 focus:ring-yellow-accent" placeholder="Image URL" value={newProduct.image} onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })} />
              <input className="w-full p-3 glass-effect text-light-text placeholder-light-text/70 rounded focus:outline-none focus:ring-2 focus:ring-yellow-accent" placeholder="Stock" type="number" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} />
              <input className="w-full p-3 glass-effect text-light-text placeholder-light-text/70 rounded focus:outline-none focus:ring-2 focus:ring-yellow-accent" placeholder="Category" value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} />
              <button type="submit" className="w-full bg-yellow-accent text-dark-bg p-3 rounded hover:bg-light-yellow transition-colors hover-effect">Add Product</button>
            </form>
          </section>
        )}

        {activeSection === 'manageProducts' && (
          <section className="glass-effect p-6 rounded-lg shadow-glass hover-effect">
            <h2 className="text-2xl font-semibold text-yellow-accent mb-4">Manage Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map(product => (
                <div key={product._id} className="glass-effect p-4 rounded-lg shadow-glass hover-effect text-light-text">
                  <p className="text-lg font-medium">{product.name} - ${product.price}</p>
                  <p className="text-sm">Stock: {product.stock}</p>
                  <p className="text-sm">Category: {product.category}</p>
                  <div className="mt-3 flex space-x-2">
                    <button onClick={() => setEditProduct(product)} className="bg-blue-500 text-light-text p-2 rounded hover:bg-blue-400 transition-colors hover-effect">Edit</button>
                    <button onClick={() => handleDeleteProduct(product._id)} className="bg-red-500 text-light-text p-2 rounded hover:bg-red-600 transition-colors hover-effect">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {editProduct && (
          <div className="fixed inset-0 bg-dark-bg/50 flex items-center justify-center z-50">
            <div className="glass-effect p-6 rounded-lg shadow-glass max-w-lg w-full">
              <h2 className="text-2xl font-semibold text-yellow-accent mb-4">Edit Product</h2>
              <form onSubmit={handleEditProduct} className="space-y-4">
                <input className="w-full p-3 glass-effect text-light-text placeholder-light-text/70 rounded focus:outline-none focus:ring-2 focus:ring-yellow-accent" placeholder="Name" value={editProduct.name} onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })} />
                <input className="w-full p-3 glass-effect text-light-text placeholder-light-text/70 rounded focus:outline-none focus:ring-2 focus:ring-yellow-accent" placeholder="Price" type="number" value={editProduct.price} onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })} />
                <input className="w-full p-3 glass-effect text-light-text placeholder-light-text/70 rounded focus:outline-none focus:ring-2 focus:ring-yellow-accent" placeholder="Description" value={editProduct.description} onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })} />
                <input className="w-full p-3 glass-effect text-light-text placeholder-light-text/70 rounded focus:outline-none focus:ring-2 focus:ring-yellow-accent" placeholder="Image URL" value={editProduct.image} onChange={(e) => setEditProduct({ ...editProduct, image: e.target.value })} />
                <input className="w-full p-3 glass-effect text-light-text placeholder-light-text/70 rounded focus:outline-none focus:ring-2 focus:ring-yellow-accent" placeholder="Stock" type="number" value={editProduct.stock} onChange={(e) => setEditProduct({ ...editProduct, stock: e.target.value })} />
                <input className="w-full p-3 glass-effect text-light-text placeholder-light-text/70 rounded focus:outline-none focus:ring-2 focus:ring-yellow-accent" placeholder="Category" value={editProduct.category} onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })} />
                <div className="flex space-x-4">
                  <button type="submit" className="w-full bg-yellow-accent text-dark-bg p-3 rounded hover:bg-light-yellow transition-colors hover-effect">Update Product</button>
                  <button type="button" onClick={() => setEditProduct(null)} className="w-full bg-dark-accent text-light-text p-3 rounded hover:bg-gray-600 transition-colors hover-effect">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeSection === 'manageUsers' && (
          <section className="glass-effect p-6 rounded-lg shadow-glass hover-effect">
            <h2 className="text-2xl font-semibold text-yellow-accent mb-4">Manage Users</h2>
            <div className="space-y-4">
              {users.map(user => (
                <div key={user._id} className="flex justify-between items-center glass-effect p-4 rounded-lg shadow-glass hover-effect text-light-text">
                  <p className="text-lg font-medium">{user.email} - {user.role}</p>
                  <button
                    onClick={() => handleUpdateRole(user._id, user.role === 'admin' ? 'user' : 'admin')}
                    className="bg-yellow-accent text-dark-bg p-2 rounded hover:bg-light-yellow transition-colors hover-effect"
                  >
                    Toggle Role
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeSection === 'manageOrders' && (
          <section className="glass-effect p-6 rounded-lg shadow-glass hover-effect">
            <h2 className="text-2xl font-semibold text-yellow-accent mb-4">Manage Orders</h2>
            {orders.length === 0 ? (
              <p className="text-center text-light-text/70">No orders found</p>
            ) : (
              <div className="space-y-6">
                {orders.map(order => (
                  <div key={order._id} className="glass-effect p-4 rounded-lg shadow-glass hover-effect text-light-text">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-lg font-medium">Order ID: {order._id}</p>
                        <p>User: {order.user?.email || 'Unknown'}</p>
                        <p>Total: ${order.total.toFixed(2)}</p>
                        <p>Payment Method: {order.paymentMethod ? order.paymentMethod.replace('_', ' ').toUpperCase() : 'Not specified'}</p>
                        <p>Created: {new Date(order.createdAt).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Shipping Address:</p>
                        <p>{order.shippingAddress?.addressLine1 || 'Not provided'}</p>
                        {order.shippingAddress?.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                        <p>{order.shippingAddress?.city || ''}{order.shippingAddress?.city ? ', ' : ''}{order.shippingAddress?.state || ''} {order.shippingAddress?.postalCode || ''}</p>
                        <p>{order.shippingAddress?.country || ''}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="font-semibold">Items:</p>
                      <ul className="list-disc pl-5">
                        {order.items.map((item, index) => (
                          <li key={index}>
                            {item.name} - Quantity: {item.quantity} - ${item.price * item.quantity}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-4 flex items-center space-x-4">
                      <label className="font-semibold">Status:</label>
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                        className="p-2 glass-effect text-light-text rounded focus:outline-none focus:ring-2 focus:ring-yellow-accent"
                      >
                        <option value="pending" className="text-dark-bg">Pending</option>
                        <option value="shipped" className="text-dark-bg">Shipped</option>
                        <option value="delivered" className="text-dark-bg">Delivered</option>
                        <option value="cancelled" className="text-dark-bg">Cancelled</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

function decodeToken(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
    .split('')
    .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
    .join('')
  );
  return JSON.parse(jsonPayload);
}