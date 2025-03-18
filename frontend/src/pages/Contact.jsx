import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState(""); // Success or error message

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/contact`, formData);
      setStatus("Message sent successfully! We’ll get back to you soon.");
      setFormData({ name: "", email: "", message: "" }); // Reset form
    } catch (error) {
      setStatus("Failed to send message. Please try again later.");
      console.error("Error sending contact form:", error);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg pt-20 px-6">
      <div className="container mx-auto">
        <h1 className="text-4xl font-extrabold mb-12 text-center text-yellow-accent">
          Contact Us
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="glass-effect p-6 rounded-lg shadow-glass hover-effect">
            <h2 className="text-2xl font-semibold text-yellow-accent mb-6">
              Send Us a Message
            </h2>
            {status && (
              <p
                className={`text-center mb-4 ${
                  status.includes("success") ? "text-green-400" : "text-red-400"
                }`}
              >
                {status}
              </p>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-light-text mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 glass-effect text-light-text placeholder-light-text/70 rounded focus:outline-none focus:ring-2 focus:ring-yellow-accent"
                  placeholder="Your Name"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-light-text mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 glass-effect text-light-text placeholder-light-text/70 rounded focus:outline-none focus:ring-2 focus:ring-yellow-accent"
                  placeholder="Your Email"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-light-text mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-3 glass-effect text-light-text placeholder-light-text/70 rounded focus:outline-none focus:ring-2 focus:ring-yellow-accent"
                  rows="5"
                  placeholder="Your Message"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-yellow-accent text-dark-bg py-3 rounded hover:bg-light-yellow transition-colors hover-effect font-semibold"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="glass-effect p-6 rounded-lg shadow-glass hover-effect">
            <h2 className="text-2xl font-semibold text-yellow-accent mb-6">
              Get in Touch
            </h2>
            <div className="space-y-4 text-light-text">
              <p>
                <span className="font-semibold">Email:</span>{" "}
                <a
                  href="mailto:support@trentshopnow.com"
                  className="text-yellow-accent hover:text-light-yellow transition-colors"
                >
                  support@trentshopnow.com
                </a>
              </p>
              <p>
                <span className="font-semibold">Phone:</span>{" "}
                <a
                  href="tel:+1234567890"
                  className="text-yellow-accent hover:text-light-yellow transition-colors"
                >
                  +1 (234) 567-890
                </a>
              </p>
              <p>
                <span className="font-semibold">Address:</span> 123 Shopping
                Lane, Commerce City, TX 75001
              </p>
            </div>
            <div className="mt-6 text-center">
              <Link
                to="/"
                className="text-yellow-accent hover:text-light-yellow transition-colors font-semibold hover:underline"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
