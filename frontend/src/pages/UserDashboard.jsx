import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [profileData, setProfileData] = useState({
    name: "",
    gender: "",
    age: "",
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [newAddress, setNewAddress] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [message, setMessage] = useState("");
  const [activeSection, setActiveSection] = useState("userDetails");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const sidebarItems = [
    { id: "userDetails", label: "User Details" },
    { id: "editProfile", label: "Edit Profile" },
    { id: "userAddress", label: "User Address" },
    { id: "addAddress", label: "Add Address" },
    { id: "changePassword", label: "Change Password" },
    { id: "updateMobile", label: "Update Mobile Number" },
    { id: "orderedProducts", label: "Ordered Products" },
  ];

  const decodeToken = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return {};
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    const decoded = decodeToken(token);
    if (decoded.role !== "user") {
      navigate("/");
      return;
    }
    const fetchData = async () => {
      try {
        const [userRes, ordersRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BASE_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${import.meta.env.VITE_BASE_URL}/api/orders`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setUser(userRes.data);
        setOrders(ordersRes.data || []); // Ensure orders is an array
        setProfileData({
          name: userRes.data.name || "",
          gender: userRes.data.gender || "",
          age: userRes.data.age || "",
        });
        setPhoneNumber(userRes.data.phoneNumber || "");
      } catch (error) {
        setMessage("Failed to load dashboard data");
        console.error("Error fetching dashboard data:", error);
      }
    };
    fetchData();
  }, [token, navigate]);

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    setIsSidebarOpen(false);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/auth/me`,
        profileData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Profile updated successfully");
    } catch (error) {
      setMessage("Failed to update profile");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage("New password and confirmation do not match");
      return;
    }
    try {
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/auth/change-password`,
        passwordData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Password changed successfully");
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      setMessage("Failed to change password");
    }
  };

  const handleAddressAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/address`,
        newAddress,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Address added successfully");
      setNewAddress({ addressLine1: "", addressLine2: "", city: "", state: "", postalCode: "", country: "" });
    } catch (error) {
      setMessage("Failed to add address");
    }
  };

  const handleMobileUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/auth/me`,
        { phoneNumber },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Mobile number updated successfully");
    } catch (error) {
      setMessage("Failed to update mobile number");
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
            <h2 className="text-2xl font-semibold text-yellow-accent">Dashboard</h2>
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
            onItemClick={handleSectionChange}
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="container mx-auto">
          {message && (
            <p className={`text-center mb-4 ${message.includes('success') ? 'text-green-400' : 'text-red-400'}`}>
              {message}
            </p>
          )}

          {/* User Details */}
          {activeSection === "userDetails" && user && (
            <section className="glass-effect p-6 rounded-lg shadow-glass hover-effect">
              <h1 className="text-3xl font-semibold text-yellow-accent mb-4">User Details</h1>
              <p className="text-light-text">Name: {user.name}</p>
              <p className="text-light-text">Email: {user.email}</p>
              <p className="text-light-text">Gender: {user.gender || 'Not set'}</p>
              <p className="text-light-text">Age: {user.age || 'Not set'}</p>
              <p className="text-light-text">Phone: {user.phoneNumber || 'Not set'}</p>
            </section>
          )}

          {/* Edit Profile */}
          {activeSection === "editProfile" && (
            <section className="glass-effect p-6 rounded-lg shadow-glass hover-effect">
              <h2 className="text-2xl font-semibold text-yellow-accent mb-4">Edit Profile</h2>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  placeholder="Name"
                  className="w-full p-3 glass-effect text-light-text rounded focus:outline-none focus:ring-2 focus:ring-yellow-accent"
                />
                <input
                  type="text"
                  value={profileData.gender}
                  onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                  placeholder="Gender"
                  className="w-full p-3 glass-effect text-light-text rounded focus:outline-none focus:ring-2 focus:ring-yellow-accent"
                />
                <input
                  type="number"
                  value={profileData.age}
                  onChange={(e) => setProfileData({ ...profileData, age: e.target.value })}
                  placeholder="Age"
                  className="w-full p-3 glass-effect text-light-text rounded focus:outline-none focus:ring-2 focus:ring-yellow-accent"
                />
                <button
                  type="submit"
                  className="w-full bg-yellow-accent text-dark-bg py-2 rounded hover:bg-light-yellow transition-colors hover-effect"
                >
                  Update Profile
                </button>
              </form>
            </section>
          )}

          {/* User Address */}
          {activeSection === "userAddress" && user && (
            <section className="glass-effect p-6 rounded-lg shadow-glass hover-effect">
              <h2 className="text-2xl font-semibold text-yellow-accent mb-4">User Address</h2>
              <p className="text-light-text">
                {user.address ? (
                  `${user.address.addressLine1}, ${user.address.city}, ${user.address.state} ${user.address.postalCode}, ${user.address.country}`
                ) : (
                  "No address set"
                )}
              </p>
            </section>
          )}

          {/* Add Address */}
          {activeSection === "addAddress" && (
            <section className="glass-effect p-6 rounded-lg shadow-glass hover-effect">
              <h2 className="text-2xl font-semibold text-yellow-accent mb-4">Add Address</h2>
              <form onSubmit={handleAddressAdd} className="space-y-4">
                <input
                  type="text"
                  value={newAddress.addressLine1}
                  onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                  placeholder="Address Line 1"
                  className="w-full p-3 glass-effect text-light-text rounded focus:outline-none focus:ring-2 focus:ring-yellow-accent"
                />
                <input
                  type="text"
                  value={newAddress.addressLine2}
                  onChange={(e) => setNewAddress({ ...newAddress, addressLine2: e.target.value })}
                  placeholder="Address Line 2"
                  className="w-full p-3 glass-effect text-light-text rounded focus:outline-none focus:ring-2 focus:ring-yellow-accent"
                />
                <input
                  type="text"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  placeholder="City"
                  className="w-full p-3 glass-effect text-light-text rounded focus:outline-none focus:ring-2 focus:ring-yellow-accent"
                />
                <input
                  type="text"
                  value={newAddress.state}
                  onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                  placeholder="State"
                  className="w-full p-3 glass-effect text-light-text rounded focus:outline-none focus:ring-2 focus:ring-yellow-accent"
                />
                <input
                  type="text"
                  value={newAddress.postalCode}
                  onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                  placeholder="Postal Code"
                  className="w-full p-3 glass-effect text-light-text rounded focus:outline-none focus:ring-2 focus:ring-yellow-accent"
                />
                <input
                  type="text"
                  value={newAddress.country}
                  onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                  placeholder="Country"
                  className="w-full p-3 glass-effect text-light-text rounded focus:outline-none focus:ring-2 focus:ring-yellow-accent"
                />
                <button
                  type="submit"
                  className="w-full bg-yellow-accent text-dark-bg py-2 rounded hover:bg-light-yellow transition-colors hover-effect"
                >
                  Add Address
                </button>
              </form>
            </section>
          )}

          {/* Change Password */}
          {activeSection === "changePassword" && (
            <section className="glass-effect p-6 rounded-lg shadow-glass hover-effect">
              <h2 className="text-2xl font-semibold text-yellow-accent mb-4">Change Password</h2>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <input
                  type="password"
                  value={passwordData.oldPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                  placeholder="Old Password"
                  className="w-full p-3 glass-effect text-light-text rounded focus:outline-none focus:ring-2 focus:ring-yellow-accent"
                />
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="New Password"
                  className="w-full p-3 glass-effect text-light-text rounded focus:outline-none focus:ring-2 focus:ring-yellow-accent"
                />
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="Confirm New Password"
                  className="w-full p-3 glass-effect text-light-text rounded focus:outline-none focus:ring-2 focus:ring-yellow-accent"
                />
                <button
                  type="submit"
                  className="w-full bg-yellow-accent text-dark-bg py-2 rounded hover:bg-light-yellow transition-colors hover-effect"
                >
                  Change Password
                </button>
              </form>
            </section>
          )}

          {/* Update Mobile Number */}
          {activeSection === "updateMobile" && (
            <section className="glass-effect p-6 rounded-lg shadow-glass hover-effect">
              <h2 className="text-2xl font-semibold text-yellow-accent mb-4">Update Mobile Number</h2>
              <form onSubmit={handleMobileUpdate} className="space-y-4">
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="New Mobile Number"
                  className="w-full p-3 glass-effect text-light-text rounded focus:outline-none focus:ring-2 focus:ring-yellow-accent"
                />
                <button
                  type="submit"
                  className="w-full bg-yellow-accent text-dark-bg py-2 rounded hover:bg-light-yellow transition-colors hover-effect"
                >
                  Update Mobile
                </button>
              </form>
            </section>
          )}

          {/* Ordered Products */}
          {activeSection === "orderedProducts" && (
            <section className="glass-effect p-6 rounded-lg shadow-glass hover-effect">
              <h2 className="text-2xl font-semibold text-yellow-accent mb-4">Ordered Products</h2>
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
                      <p className="text-light-text">
                        <span className="font-semibold">Status:</span> {order.status || 'N/A'}
                      </p>
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