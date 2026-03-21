import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const user = localStorage.getItem('user');

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className="bg-white/70 backdrop-blur-md border-b border-indigo-50 text-indigo-900 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-blue-500 rounded-lg shadow-md flex items-center justify-center">
           <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
        </div>
      </div>
      <div className="space-x-6 text-sm font-semibold">
        <Link to="/home" className="text-gray-600 hover:text-indigo-600 transition-colors">Dashboard</Link>
        {!user ? (
          <>
            <Link to="/" className="text-gray-600 hover:text-indigo-600 transition-colors">Sign In</Link>
            <Link to="/signup" className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors">Sign Up</Link>
          </>
        ) : (
          <button onClick={handleLogout} className="text-red-500 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors cursor-pointer">Log Out</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
