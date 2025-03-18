import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', image: '', stock: '', category: '' });
  const [editProduct, setEditProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const decoded = jwtDecode(token);
    if (decoded.role !== 'admin') {
      alert('Admin access required');
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const [productsRes, usersRes, ordersRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BASE_URL}/api/admin/products`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${import.meta.env.VITE_BASE_URL}/api/admin/users`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${import.meta.env.VITE_BASE_URL}/api/admin/orders`, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setProducts(productsRes.data);
        setUsers(usersRes.data);
        setOrders(ordersRes.data);
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
        navigate('/login');
      }
    };
    fetchData();
  }, [navigate]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/admin/products`, newProduct, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts([...products, res.data]);
      setNewProduct({ name: '', price: '', description: '', image: '', stock: '', category: '' });
    } catch (error) {
      console.error('Failed to add product:', error);
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await axios.put(`${import.meta.env.VITE_BASE_URL}/api/admin/products/${editProduct._id}`, editProduct, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(products.map(p => p._id === editProduct._id ? res.data : p));
      setEditProduct(null);
    } catch (error) {
      console.error('Failed to update product:', error);
    }
  };

  const handleDeleteProduct = async (id) => {
    const token = localStorage.getItem('token');
    await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/admin/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setProducts(products.filter(p => p._id !== id));
  };

  const handleUpdateRole = async (id, role) => {
    const token = localStorage.getItem('token');
    const res = await axios.put(`${import.meta.env.VITE_BASE_URL}/api/admin/users/${id}`, { role }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUsers(users.map(u => u._id === id ? res.data : u));
  };

  const handleUpdateOrderStatus = async (id, status) => {
    const token = localStorage.getItem('token');
    const res = await axios.put(`${import.meta.env.VITE_BASE_URL}/api/admin/orders/${id}`, { status }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setOrders(orders.map(o => o._id === id ? res.data : o));
  };

  return (
    <div className="container mx-auto p-6 text-text">
      <h1 className="text-4xl font-bold mb-8 text-center text-primary">Admin Dashboard</h1>

      {/* Add Product */}
      <div className="mb-12 bg-background p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-primary">Add Product</h2>
        <form onSubmit={handleAddProduct} className="space-y-4 max-w-lg mx-auto">
          <input className="w-full p-3 border border-gray-300 rounded bg-secondary text-text focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Name" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
          <input className="w-full p-3 border border-gray-300 rounded bg-secondary text-text focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Price" type="number" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
          <input className="w-full p-3 border border-gray-300 rounded bg-secondary text-text focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Description" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
          <input className="w-full p-3 border border-gray-300 rounded bg-secondary text-text focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Image URL" value={newProduct.image} onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })} />
          <input className="w-full p-3 border border-gray-300 rounded bg-secondary text-text focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Stock" type="number" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} />
          <input className="w-full p-3 border border-gray-300 rounded bg-secondary text-text focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Category" value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} />
          <button type="submit" className="w-full bg-primary text-white p-3 rounded hover:bg-accent transition-colors shadow-md">Add Product</button>
        </form>
      </div>

      {/* Edit Product Modal */}
      {editProduct && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-background p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Edit Product</h2>
            <form onSubmit={handleEditProduct} className="space-y-4">
              <input className="w-full p-3 border border-gray-300 rounded bg-secondary text-text focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Name" value={editProduct.name} onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })} />
              <input className="w-full p-3 border border-gray-300 rounded bg-secondary text-text focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Price" type="number" value={editProduct.price} onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })} />
              <input className="w-full p-3 border border-gray-300 rounded bg-secondary text-text focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Description" value={editProduct.description} onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })} />
              <input className="w-full p-3 border border-gray-300 rounded bg-secondary text-text focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Image URL" value={editProduct.image} onChange={(e) => setEditProduct({ ...editProduct, image: e.target.value })} />
              <input className="w-full p-3 border border-gray-300 rounded bg-secondary text-text focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Stock" type="number" value={editProduct.stock} onChange={(e) => setEditProduct({ ...editProduct, stock: e.target.value })} />
              <input className="w-full p-3 border border-gray-300 rounded bg-secondary text-text focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Category" value={editProduct.category} onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })} />
              <div className="flex space-x-4">
                <button type="submit" className="w-full bg-primary text-white p-3 rounded hover:bg-accent transition-colors shadow-md">Update Product</button>
                <button type="button" onClick={() => setEditProduct(null)} className="w-full bg-gray-500 text-white p-3 rounded hover:bg-gray-600 transition-colors shadow-md">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products */}
      <div className="mb-12 bg-background p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-primary">Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product._id} className="border border-gray-200 p-4 bg-secondary rounded-lg shadow-md">
              <p className="text-lg font-medium">{product.name} - ${product.price}</p>
              <p>Stock: {product.stock}</p>
              <div className="mt-3 flex space-x-2">
                <button onClick={() => setEditProduct(product)} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors">Edit</button>
                <button onClick={() => handleDeleteProduct(product._id)} className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Users */}
      <div className="mb-12 bg-background p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-primary">Users</h2>
        <div className="space-y-4">
          {users.map(user => (
            <div key={user._id} className="flex justify-between items-center border border-gray-200 p-4 bg-secondary rounded-lg shadow-md">
              <p className="text-lg font-medium">{user.email} - {user.role}</p>
              <button
                onClick={() => handleUpdateRole(user._id, user.role === 'admin' ? 'user' : 'admin')}
                className="bg-primary text-white p-2 rounded hover:bg-accent transition-colors"
              >
                Toggle Role
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Orders */}
      <div className="bg-background p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-primary">Orders</h2>
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="border border-gray-200 p-4 bg-secondary rounded-lg shadow-md">
              <p className="text-lg font-medium">User: {order.user?.email}</p>
              <p>Total: ${order.total}</p>
              <p>Status: {order.status}</p>
              <select
                value={order.status}
                onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                className="mt-3 p-2 border border-gray-300 rounded bg-secondary text-text focus:outline-none focus:ring-2 focus:ring-primary w-full"
              >
                <option value="pending">Pending</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Simple JWT decode function (or use jwt-decode library)
function jwtDecode(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
  return JSON.parse(jsonPayload);
}