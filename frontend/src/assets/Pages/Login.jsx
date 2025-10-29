import Navbar from '../Components/Navbar.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { authAPI } from '../../services/api';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await authAPI.login(formData);
      
      // Store user data (you might want to use context or redux for this)
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Navigate to home page
      navigate('/');
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto mt-20 p-6 border rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              name="email"
              className="w-full p-2 border rounded mt-1" 
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              name="password"
              className="w-full p-2 border rounded mt-1" 
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-green-900 text-white py-2 rounded hover:bg-green-600 disabled:bg-gray-400 transition-colors"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <div className="text-center mt-4 text-sm text-gray-600">
          <Link to="#" className="text-green-900 hover:underline">Forgot password</Link> | <Link to="/signup" className="text-green-900 hover:underline">Create account</Link>
        </div>
      </div>
    </>
  );
};

export default Login;