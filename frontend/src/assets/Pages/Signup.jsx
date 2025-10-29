import Navbar from '../Components/Navbar.jsx';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { authAPI } from '../../services/api.js';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

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
      const response = await authAPI.signup(formData);
      alert('Account created successfully!');
      // Redirect to login page
      window.location.href = '/login';
    } catch (error) {
      alert(error.response?.data?.message || 'Signup failed');
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto mt-20 p-6 border rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label>Name</label>
            <input 
              type="text" 
              name="name"
              className="w-full p-2 border rounded" 
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Email</label>
            <input 
              type="email" 
              name="email"
              className="w-full p-2 border rounded" 
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Password</label>
            <input 
              type="password" 
              name="password"
              className="w-full p-2 border rounded" 
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-green-900 text-white py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <div className="text-center mt-4 text-sm text-gray-600">
          <Link to="/login">Already have an account?</Link>
        </div>
      </div>
    </>
  );
};

export default Signup;