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
        setOrders(ordersRes.data);
        setProfileData({
          name: userRes.data.name || "",
          gender: userRes.data.gender || "",
          age: userRes.data.age || "",
        });
        setPhoneNumber(userRes.data.phoneNumber || "");
      } catch (error) {
        console.error("Failed to fetch data:", error);
        if (error.response?.status === 401) navigate("/login");
      }
    };
    fetchData();
  }, [navigate, token]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/auth/me`,
        profileData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data);
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
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/auth/change-password`,
        {
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message);
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setMessage(error.response?.data.message || "Failed to change password");
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/auth/me`,
        { address: newAddress },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data);
      setNewAddress({
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
      });
      setMessage("Address added successfully");
    } catch (error) {
      setMessage("Failed to add address");
    }
  };

  const handleUpdateMobile = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/auth/me`,
        { phoneNumber },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data);
      setMessage("Mobile number updated successfully");
    } catch (error) {
      setMessage("Failed to update mobile number");
    }
  };

  const handleProfilePictureUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("profilePicture", profilePicture);
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/auth/me/profile-picture`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUser({ ...user, profilePicture: res.data.profilePicture });
      setProfilePicture(null);
      setMessage("Profile picture updated successfully");
    } catch (error) {
      setMessage("Failed to upload profile picture");
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/orders/cancel/${orderId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(orders.map((o) => (o._id === orderId ? res.data : o)));
    } catch (error) {
      console.error("Failed to cancel order:", error);
      alert(error.response?.data.message || "Failed to cancel order");
    }
  };

  return (
    <div className="flex min-h-screen bg-dark-bg">
      <Sidebar
        items={sidebarItems}
        activeItem={activeSection}
        setActiveItem={setActiveSection}
      />
      <div className="flex-1 p-6 ml-64 min-h-screen pt-20">
        <h1 className="text-4xl font-bold text-light-text mb-8 text-center">
          User Dashboard
        </h1>

        {activeSection === "userDetails" && user && (
          <section className="glass-effect p-6 rounded-lg shadow-glass hover-effect">
            <h2 className="text-2xl font-semibold text-yellow-accent mb-4">
              User Details
            </h2>
            <div className="space-y-2 text-light-text">
              {user.profilePicture && (
                <img
                  src={`${import.meta.env.VITE_BASE_URL}/${user.profilePicture}`}
                  alt="Profile"
                  className="w-24 h-24 rounded-full mb-4 border-2 border-yellow-accent"
                />
              )}
              <p>
                <strong>Name:</strong> {user.name || "Not set"}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Gender:</strong> {user.gender || "Not set"}
              </p>
              <p>
                <strong>Age:</strong> {user.age || "Not set"}
              </p>
              <p>
                <strong>Phone Number:</strong> {user.phoneNumber || "Not set"}
              </p>
            </div>
          </section>
        )}

        {activeSection === "editProfile" && user && (
          <section className="glass-effect p-6 rounded-lg shadow-glass hover-effect">
            <h2 className="text-2xl font-semibold text-yellow-accent mb-4">
              Edit Profile
            </h2>
            <form
              onSubmit={handleProfileUpdate}
              className="space-y-4 max-w-lg mx-auto"
            >
              <input
                placeholder="Name"
                value={profileData.name}
                onChange={(e) =>
                  setProfileData({ ...profileData, name: e.target.value })
                }
                className="w-full p-3 glass-effect text-light-text placeholder-light-text/70 rounded focus:outline-none focus:ring-2 focus:ring-yellow-accent"
              />
              <select
                value={profileData.gender}
                onChange={(e) =>
                  setProfileData({ ...profileData, gender: e.target.value })
                }
                className="w-full p-3 glass-effect text-light-text rounded focus:outline-none focus:ring-2 focus:ring-yellow-accent"
              >
                <option value="" className="text-dark-bg">
                  Select Gender
                </option>
                <option value="male" className="text-dark-bg">
                  Male
                </option>
                <option value="female" className="text-dark-bg">
                  Female
                </option>
                <option value="other" className="text-dark-bg">
                  Other
                </option>
              </select>
              <input
                type="number"
                placeholder="Age"
                value={profileData.age}
                onChange={(e) =>
                  setProfileData({ ...profileData, age: e.target.value })
                }
                className="w-full p-3 glass-effect text-light-text placeholder-light-text/70 rounded focus:outline-none focus:ring-2 focus:ring-yellow-accent"
                min="1"
              />
              <button
                type="submit"
                className="w-full bg-yellow-accent text-dark-bg p-3 rounded hover:bg-light-yellow transition-colors hover-effect"
              >
                Update Profile
              </button>
            </form>
            <form
              onSubmit={handleProfilePictureUpload}
              className="mt-6 space-y-4 max-w-lg mx-auto"
            >
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProfilePicture(e.target.files[0])}
                className="w-full p-3 glass-effect text-light-text rounded"
              />
              <button
                type="submit"
                className="w-full bg-yellow-accent text-dark-bg p-3 rounded hover:bg-light-yellow transition-colors hover-effect"
                disabled={!profilePicture}
              >
                Upload Profile Picture
              </button>
            </form>
            {message && (
              <p
                className={`mt-4 text-center ${
                  message.includes("success")
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {message}
              </p>
            )}
          </section>
        )}

        {activeSection === "userAddress" && user && (
          <section className="glass-effect p-6 rounded-lg shadow-glass hover-effect">
            <h2 className="text-2xl font-semibold text-yellow-accent mb-4">
              User Address
            </h2>
            {user.address && Object.keys(user.address).length > 0 ? (
              <div className="space-y-2 text-light-text">
                <p>{user.address.addressLine1}</p>
                {user.address.addressLine2 && (
                  <p>{user.address.addressLine2}</p>
                )}
                <p>
                  {user.address.city}
                  {user.address.city ? ", " : ""}
                  {user.address.state} {user.address.postalCode}
                </p>
                <p>{user.address.country}</p>
              </div>
            ) : (
              <p className="text-light-text/70">No address set</p>
            )}
          </section>
        )}

        {activeSection === "addAddress" && (
          <section className="glass-effect p-6 rounded-lg shadow-glass hover-effect">
            <h2 className="text-2xl font-semibold text-yellow-accent mb-4">
              Add Address
            </h2>
            <form
              onSubmit={handleAddAddress}
              className="space-y-4 max-w-lg mx-auto"
            >
              <input
                placeholder="Address Line 1"
                value={newAddress.addressLine1}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, addressLine1: e.target.value })
                }
                className="w-full p-3 glass-effect text-light-text placeholder-light-text/70 rounded focus:outline-none focus:ring-2 focus:ring-yellow-accent"
                required
              />
              <input
                placeholder="Address Line 2 (Optional)"
                value={newAddress.addressLine2}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, addressLine2: e.target.value })
                }
                className="w-full p-3 glass-effect text-light-text placeholder-light-text/70 rounded focus:outline-none focus:ring-2 focus:ring-yellow-accent"
              />
              <input
                placeholder="City"
                value={newAddress.city}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, city: e.target.value })
                }
                className="w-full p-3 glass-effect text-light-text placeholder-light-text/70 rounded focus:outline-none focus:ring-2 focus:ring-yellow-accent"
                required
              />
              <input
                placeholder="State"
                value={newAddress.state}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, state: e.target.value })
                }
                className="w-full p-3 glass-effect text-light-text placeholder-light-text/70 rounded focus:outline-none focus:ring-2 focus:ring-yellow-accent"
                required
              />
              <input
                placeholder="Postal Code"
                value={newAddress.postalCode}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, postalCode: e.target.value })
                }
                className="w-full p-3 glass-effect text-light-text placeholder-light-text/70 rounded focus:outline-none focus:ring-2 focus:ring-yellow-accent"
                required
              />
              <input
                placeholder="Country"
                value={newAddress.country}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, country: e.target.value })
                }
                className="w-full p-3 glass-effect text-light-text placeholder-light-text/70 rounded focus:outline-none focus:ring-2 focus:ring-yellow-accent"
                required
              />
              <button
                type="submit"
                className="w-full bg-yellow-accent text-dark-bg p-3 rounded hover:bg-light-yellow transition-colors hover-effect"
              >
                Add Address
              </button>
            </form>
            {message && (
              <p
                className={`mt-4 text-center ${
                  message.includes("success")
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {message}
              </p>
            )}
          </section>
        )}

        {activeSection === "changePassword" && (
          <section className="glass-effect p-6 rounded-lg shadow-glass hover-effect">
            <h2 className="text-2xl font-semibold text-yellow-accent mb-4">
              Change Password
            </h2>
            <form
              onSubmit={handlePasswordChange}
              className="space-y-4 max-w-lg mx-auto"
            >
              <input
                type="password"
                placeholder="Old Password"
                value={passwordData.oldPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    oldPassword: e.target.value,
                  })
                }
                className="w-full p-3 glass-effect text-light-text placeholder-light-text/70 rounded focus:outline-none focus:ring-2 focus:ring-yellow-accent"
                required
              />
              <input
                type="password"
                placeholder="New Password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                className="w-full p-3 glass-effect text-light-text placeholder-light-text/70 rounded focus:outline-none focus:ring-2 focus:ring-yellow-accent"
                required
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
                className="w-full p-3 glass-effect text-light-text placeholder-light-text/70 rounded focus:outline-none focus:ring-2 focus:ring-yellow-accent"
                required
              />
              <button
                type="submit"
                className="w-full bg-yellow-accent text-dark-bg p-3 rounded hover:bg-light-yellow transition-colors hover-effect"
              >
                Update Password
              </button>
            </form>
            {message && (
              <p
                className={`mt-4 text-center ${
                  message.includes("success")
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {message}
              </p>
            )}
          </section>
        )}

        {activeSection === "updateMobile" && (
          <section className="glass-effect p-6 rounded-lg shadow-glass hover-effect">
            <h2 className="text-2xl font-semibold text-yellow-accent mb-4">
              Update Mobile Number
            </h2>
            <form
              onSubmit={handleUpdateMobile}
              className="space-y-4 max-w-lg mx-auto"
            >
              <input
                type="tel"
                placeholder="Mobile Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full p-3 glass-effect text-light-text placeholder-light-text/70 rounded focus:outline-none focus:ring-2 focus:ring-yellow-accent"
                required
              />
              <button
                type="submit"
                className="w-full bg-yellow-accent text-dark-bg p-3 rounded hover:bg-light-yellow transition-colors hover-effect"
              >
                Update Mobile Number
              </button>
            </form>
            {message && (
              <p
                className={`mt-4 text-center ${
                  message.includes("success")
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {message}
              </p>
            )}
          </section>
        )}

        {activeSection === "orderedProducts" && (
          <section className="glass-effect p-6 rounded-lg shadow-glass hover-effect">
            <h2 className="text-2xl font-semibold text-yellow-accent mb-4">
              Ordered Products
            </h2>
            {orders.length === 0 ? (
              <p className="text-center text-light-text/70">No orders found</p>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="glass-effect p-4 rounded-lg shadow-glass hover-effect"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-light-text">
                      <div>
                        <p className="text-lg font-medium">
                          Order ID: {order._id}
                        </p>
                        <p>Total: ${order.total.toFixed(2)}</p>
                        <p>
                          Payment Method:{" "}
                          {order.paymentMethod
                            ? order.paymentMethod
                                .replace("_", " ")
                                .toUpperCase()
                            : "Not specified"}
                        </p>
                        <p>Status: {order.status.toUpperCase()}</p>
                        <p>
                          Created: {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold">Shipping Address:</p>
                        <p>
                          {order.shippingAddress?.addressLine1 ||
                            "Not provided"}
                        </p>
                        {order.shippingAddress?.addressLine2 && (
                          <p>{order.shippingAddress.addressLine2}</p>
                        )}
                        <p>
                          {order.shippingAddress?.city || ""}
                          {order.shippingAddress?.city ? ", " : ""}
                          {order.shippingAddress?.state || ""}{" "}
                          {order.shippingAddress?.postalCode || ""}
                        </p>
                        <p>{order.shippingAddress?.country || ""}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="font-semibold text-light-text">Items:</p>
                      <ul className="list-disc pl-5 text-light-text">
                        {order.items.map((item, index) => (
                          <li key={index}>
                            {item.name} - Quantity: {item.quantity} - $
                            {item.price * item.quantity}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {order.status === "pending" && (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        className="mt-4 bg-red-500 text-light-text p-2 rounded hover:bg-red-600 transition-colors hover-effect"
                      >
                        Cancel Order
                      </button>
                    )}
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
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
  return JSON.parse(jsonPayload);
}
