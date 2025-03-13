import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', { email, password });
      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-md text-text">
      <h1 className="text-4xl font-bold mb-8 text-center text-primary">Register</h1>
      <form onSubmit={handleRegister} className="space-y-6 bg-background p-6 rounded-lg shadow-lg">
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
          Register
        </button>
      </form>
      {error && <p className="mt-4 text-center text-red-500">{error}</p>}
      <p className="mt-4 text-center">
        Already have an account? <Link to="/login" className="text-primary hover:text-accent transition-colors">Login</Link>
      </p>
    </div>
  );
}