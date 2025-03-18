import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard'); // Redirect to dashboard after login
    } catch (err) {
      setError(err.response?.data.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-6">
      <div className="glass-effect p-8 rounded-lg shadow-glass max-w-md w-full hover-effect">
        <h1 className="text-3xl font-bold text-yellow-accent mb-6 text-center">Login</h1>
        {error && <p className="text-red-400 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 glass-effect text-light-text placeholder-light-text/70 rounded focus:outline-none focus:ring-2 focus:ring-yellow-accent"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 glass-effect text-light-text placeholder-light-text/70 rounded focus:outline-none focus:ring-2 focus:ring-yellow-accent"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-accent text-dark-bg p-3 rounded hover:bg-light-yellow transition-colors hover-effect font-semibold"
          >
            Login
          </button>
        </form>
        <p className="text-light-text text-center mt-4">
          Don’t have an account?{' '}
          <Link to="/register" className="text-yellow-accent hover:underline transition-colors">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}