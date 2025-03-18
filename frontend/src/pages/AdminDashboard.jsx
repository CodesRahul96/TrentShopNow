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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const sidebarItems = [
    { id: 'addProduct', label: 'Add Product' },
    { id: 'manageProducts', label: 'Manage Products' },
    { id: 'manageUsers', label: 'Manage Users' },
    { id: 'manageOrders', label: 'Manage Orders' },
  ];

  const orderStatusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']; // Status options

  const decodeToken = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return {};
    }
  };

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
          axios.get(`${import.meta.env.VITE_BASE_URL}/api/admin/products`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${import.meta.env.VITE_BASE_URL}/api/admin/users`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${import.meta.env.VITE_BASE_URL}/api/admin/orders`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setProducts(productsRes.data || []);
        setUsers(usersRes.data || []);
        setOrders(ordersRes.data || []);
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
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/admin/products`,
        newProduct,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Product added successfully');
      setProducts([...products, newProduct]);
      setNewProduct({ name: '', price: '', description: '', image: '', stock: '', category: '' });
    } catch (error) {
      setMessage('Failed to add product');
      console.error('Error adding product:', error);
    }
  };

  const handleEditProduct = (product) => {
    setEditProduct(product);
    setNewProduct(product);
    setActiveSection('addProduct');
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/admin/products/${editProduct._id}`,
        newProduct,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Product updated successfully');
      setProducts(products.map(p => (p._id === editProduct._id ? newProduct : p)));
      setEditProduct(null);
      setNewProduct({ name: '', price: '', description: '', image: '', stock: '', category: '' });
    } catch (error) {
      setMessage('Failed to update product');
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/admin/products/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Product deleted successfully');
      setProducts(products.filter(p => p._id !== id));
    } catch (error) {
      setMessage('Failed to delete product');
      console.error('Error deleting product:', error);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/admin/orders/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(`Order ${orderId} status updated to ${newStatus}`);
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      setMessage('Failed to update order status');
      console.error('Error updating order status:', error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-dark-bg pt-20 flex flex-col md:flex-row">
      {/* Sidebar Toggle Button (Mobile) */}
      <button
        className="md:hidden fixed top-20 left-4 text-light-text p-2 bg-yellow-accent rounded-full hover:bg-light-yellow transition-colors z-50"
        onClick={toggleSidebar}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-dark-bg glass-effect shadow-glass transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-yellow-accent">Admin Dashboard</h2>
            <button
              className="md:hidden text-light-text"
              onClick={toggleSidebar}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <Sidebar
            items={sidebarItems}
            activeItem={activeSection}
            onItemClick={(id) => {
              setActiveSection(id);
              setIsSidebarOpen(false);
            }}
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="container mx-auto">
          {message && (
            <p className={`text-center mb-4 ${message.includes('success') || message.includes('updated') ? 'text-green-400' : 'text-red-400'}`}>
              {message}
            </p>
          )}

          {/* Add/Edit Product */}
          {activeSection === 'addProduct' && (
            <section className="glass-effect p-6 rounded-lg shadow-glass hover-effect">
              <h2 className="text-2xl font-semibold text-yellow-accent mb-4">
                {editProduct ? 'Edit Product' : 'Add Product'}
              </h2>
              <form onSubmit={editProduct ? handleUpdateProduct : handleAddProduct} className="space-y-4">
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="Product Name"
                  className="w-full p-3 glass-effect text-light-text rounded focus:outline-none focus:ring-2 focus:ring-yellow-accent"
                  required
                />
                <input
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  placeholder="Price"
                  className="w-full p-3 glass-effect text-light-text rounded focus:outline-none focus:ring-2 focus:ring-yellow-accent"
                  required
                />
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Description"
                  className="w-full p-3 glass-effect text-light-text rounded focus:outline-none focus:ring-2 focus:ring-yellow-accent"
                  rows="3"
                />
                <input
                  type="text"
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                  placeholder="Image URL"
                  className="w-full p-3 glass-effect text-light-text rounded focus:outline-none focus:ring-2 focus:ring-yellow-accent"
                  required
                />
                <input
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                  placeholder="Stock"
                  className="w-full p-3 glass-effect text-light-text rounded focus:outline-none focus:ring-2 focus:ring-yellow-accent"
                  required
                />
                <input
                  type="text"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  placeholder="Category"
                  className="w-full p-3 glass-effect text-light-text rounded focus:outline-none focus:ring-2 focus:ring-yellow-accent"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-yellow-accent text-dark-bg py-2 rounded hover:bg-light-yellow transition-colors hover-effect"
                >
                  {editProduct ? 'Update Product' : 'Add Product'}
                </button>
                {editProduct && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditProduct(null);
                      setNewProduct({ name: '', price: '', description: '', image: '', stock: '', category: '' });
                    }}
                    className="w-full bg-red-400 text-dark-bg py-2 rounded hover:bg-red-500 transition-colors hover-effect mt-2"
                  >
                    Cancel Edit
                  </button>
                )}
              </form>
            </section>
          )}

          {/* Manage Products */}
          {activeSection === 'manageProducts' && (
            <section className="glass-effect p-6 rounded-lg shadow-glass hover-effect">
              <h2 className="text-2xl font-semibold text-yellow-accent mb-4">Manage Products</h2>
              {products.length > 0 ? (
                <div className="space-y-4">
                  {products.map((product) => (
                    <div key={product._id} className="glass-effect p-4 rounded-lg shadow-glass flex justify-between items-center">
                      <div>
                        <p className="text-light-text font-semibold">{product.name}</p>
                        <p className="text-light-text">${product.price} - {product.stock} in stock</p>
                      </div>
                      <div className="space-x-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="bg-yellow-accent text-dark-bg py-1 px-3 rounded hover:bg-light-yellow transition-colors hover-effect"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="bg-red-400 text-dark-bg py-1 px-3 rounded hover:bg-red-500 transition-colors hover-effect"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-light-text/70">No products found.</p>
              )}
            </section>
          )}

          {/* Manage Users */}
          {activeSection === 'manageUsers' && (
            <section className="glass-effect p-6 rounded-lg shadow-glass hover-effect">
              <h2 className="text-2xl font-semibold text-yellow-accent mb-4">Manage Users</h2>
              {users.length > 0 ? (
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user._id} className="glass-effect p-4 rounded-lg shadow-glass">
                      <p className="text-light-text">Name: {user.name}</p>
                      <p className="text-light-text">Email: {user.email}</p>
                      <p className="text-light-text">Role: {user.role}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-light-text/70">No users found.</p>
              )}
            </section>
          )}

          {/* Manage Orders */}
          {activeSection === 'manageOrders' && (
            <section className="glass-effect p-6 rounded-lg shadow-glass hover-effect">
              <h2 className="text-2xl font-semibold text-yellow-accent mb-4">Manage Orders</h2>
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order._id} className="glass-effect p-4 rounded-lg shadow-glass">
                      <p className="text-light-text">
                        <span className="font-semibold">Order ID:</span> {order._id}
                      </p>
                      <p className="text-light-text">
                        <span className="font-semibold">Date:</span> {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-light-text">
                        <span className="font-semibold">Products:</span>{' '}
                        {order.products && Array.isArray(order.products) && order.products.length > 0
                          ? order.products.map((item) => 
                              item.productId && (typeof item.productId === 'object' ? item.productId.name : item.productId) || 'Unknown Product'
                            ).join(', ')
                          : 'No products listed'}
                      </p>
                      <p className="text-light-text">
                        <span className="font-semibold">Total:</span> ${order.totalAmount ? order.totalAmount.toFixed(2) : 'N/A'}
                      </p>
                      <div className="flex items-center mt-2">
                        <span className="text-light-text font-semibold mr-2">Status:</span>
                        <select
                          value={order.status || 'Pending'}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className="p-2 glass-effect text-light-text rounded focus:outline-none focus:ring-2 focus:ring-yellow-accent"
                        >
                          {orderStatusOptions.map((status) => (
                            <option className='bg-slate-400' key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-light-text/70">No orders found.</p>
              )}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}