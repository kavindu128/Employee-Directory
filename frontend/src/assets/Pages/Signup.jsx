import Navbar from '../Components/Navbar.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { authAPI } from '../../services/api.js';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      navigate('/');
    } catch (error) {
      alert(error.response?.data?.message || 'Signup failed');
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-sans pb-12">
      <Navbar />
      <div className="flex justify-center items-center mt-20 px-4">
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-soft w-full max-w-md p-8 border border-white shadow-xl transition-all duration-300 hover:shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Create Account</h2>
            <p className="text-gray-500 mt-2 text-sm">Join the team today.</p>
          </div>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-gray-700 ml-1 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-200"
                placeholder="Jane Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 ml-1 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-200"
                placeholder="jane@company.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 ml-1 mb-1">Password</label>
              <input
                type="password"
                name="password"
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-200"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:opacity-90 transform active:scale-95 transition-all duration-200 shadow-md disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>
          <div className="text-center mt-8 text-sm font-medium text-gray-500">
            <Link to="/" className="text-indigo-600 hover:text-indigo-800 hover:underline transition-colors">Already have an account?</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;