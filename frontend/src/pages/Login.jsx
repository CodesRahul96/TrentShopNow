import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/login`, { email, password });
      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-md text-text">
      <h1 className="text-4xl font-bold mb-8 text-center text-primary">Login</h1>
      <form onSubmit={handleLogin} className="space-y-6 bg-background p-6 rounded-lg shadow-lg">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-3 border border-gray-300 rounded bg-secondary text-text focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-3 border border-gray-300 rounded bg-secondary text-text focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
        <button type="submit" className="w-full bg-primary text-white p-3 rounded hover:bg-accent transition-colors shadow-md">
          Login
        </button>
      </form>
      {error && <p className="mt-4 text-center text-red-500">{error}</p>}
      <p className="mt-4 text-center">
        Don&apos;t have an account? <Link to="/register" className="text-primary hover:text-accent transition-colors">Register</Link>
      </p>
    </div>
  );
}